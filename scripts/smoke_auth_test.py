"""Quick smoke test for auth endpoints using Django test client.

Checks: signup, login, profile, logout, forgot -> reset flow, CSRF handling.

Run: python3 scripts/smoke_auth_test.py
"""
import os
import sys
import django
import json

# Ensure project root is on the import path so DJANGO_SETTINGS_MODULE can be resolved
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

def run():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'wellness_project.settings')
    django.setup()

    from django.test import Client
    from django.contrib.auth.tokens import default_token_generator
    from django.utils.http import urlsafe_base64_encode
    from django.utils.encoding import force_bytes
    from django.contrib.auth import get_user_model

    User = get_user_model()

    client = Client(enforce_csrf_checks=True)
    # ensure requests use a host allowed by ALLOWED_HOSTS during tests
    client.defaults['HTTP_HOST'] = 'localhost'
    def log(msg):
        path = 'tmp/smoke_auth_results.txt'
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, 'a') as f:
            f.write(msg + '\n')

    # clear file
    path = 'tmp/smoke_auth_results.txt'
    os.makedirs(os.path.dirname(path), exist_ok=True)
    open(path, 'w').close()

    log('GET /api/auth/csrf/')
    r = client.get('/api/auth/csrf/')
    log(f'status {r.status_code} body {r.content}')
    csrftoken = r.cookies.get('csrftoken').value if r.cookies.get('csrftoken') else None
    headers = {'HTTP_X_CSRFTOKEN': csrftoken}
    log(f'csrftoken: {csrftoken}')

    email = 'smoke+1@example.com'
    pwd = 'Testpass123!'

    # Ensure user does not exist
    User.objects.filter(username=email).delete()

    print('POST /api/auth/signup/')
    r = client.post('/api/auth/signup/', json.dumps({'email': email, 'password': pwd, 'password_confirm': pwd, 'first_name': 'Smoke'}), content_type='application/json', **headers)
    print('status', r.status_code, 'body', r.content)

    # CSRF tokens can rotate when sessions change; re-fetch before login
    r = client.get('/api/auth/csrf/')
    csrftoken = r.cookies.get('csrftoken').value if r.cookies.get('csrftoken') else None
    headers = {'HTTP_X_CSRFTOKEN': csrftoken}

    print('POST /api/auth/login/')
    r = client.post('/api/auth/login/', json.dumps({'email': email, 'password': pwd}), content_type='application/json', **headers)
    print('status', r.status_code, 'body', r.content)

    print('GET /api/auth/check/')
    r = client.get('/api/auth/check/')
    print('status', r.status_code, 'body', r.content)

    print('GET /api/auth/profile/')
    r = client.get('/api/auth/profile/')
    print('status', r.status_code, 'body', r.content)

    print('POST /api/auth/logout/')
    # Need CSRF again
    r = client.get('/api/auth/csrf/')
    csrftoken = r.cookies.get('csrftoken').value if r.cookies.get('csrftoken') else None
    headers = {'HTTP_X_CSRFTOKEN': csrftoken}
    r = client.post('/api/auth/logout/', content_type='application/json', **headers)
    print('status', r.status_code, 'body', r.content)

    # Forgot / reset flow
    print('POST /api/auth/forgot-password/')
    r = client.post('/api/auth/forgot-password/', json.dumps({'email': email}), content_type='application/json', **headers)
    print('status', r.status_code, 'body', r.content)

    try:
        user = User.objects.get(username=email)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        new_pwd = 'Newpass123!'
        print('POST /api/auth/reset-password/')
        r = client.post('/api/auth/reset-password/', json.dumps({'uid': uid, 'token': token, 'password': new_pwd, 'password_confirm': new_pwd}), content_type='application/json', **headers)
        print('status', r.status_code, 'body', r.content)

        print('Login with new password')
        r = client.post('/api/auth/login/', json.dumps({'email': email, 'password': new_pwd}), content_type='application/json', **headers)
        print('status', r.status_code, 'body', r.content)
    except Exception as e:
        print('Error during reset flow:', e)

if __name__ == '__main__':
    run()
