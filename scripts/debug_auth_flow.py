import os
import sys
import django
import json

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'wellness_project.settings')
django.setup()

from django.test import Client

c = Client(enforce_csrf_checks=True)
c.defaults['HTTP_HOST'] = 'localhost'

r = c.get('/api/auth/csrf/')
print('GET /api/auth/csrf/', r.status_code, r.content)
csrftoken = r.cookies.get('csrftoken').value if r.cookies.get('csrftoken') else None
print('csrftoken:', csrftoken)
headers = {'HTTP_X_CSRFTOKEN': csrftoken} if csrftoken else {}

email = 'debug+1@example.com'
pwd = 'DebugPass123!'

r = c.post('/api/auth/signup/', data=json.dumps({'email': email, 'password': pwd, 'password_confirm': pwd, 'first_name': 'Dbg'}), content_type='application/json', **headers)
print('POST /api/auth/signup/', r.status_code, r.content)
print('Cookies after signup:', c.cookies)

r = c.get('/api/auth/check/')
print('GET /api/auth/check/', r.status_code, r.content)
print('Session cookies:', c.cookies.get('sessionid'))

r = c.post('/api/auth/logout/', **headers)
print('POST /api/auth/logout/', r.status_code, r.content)

r = c.get('/api/auth/check/')
print('GET /api/auth/check/ after logout', r.status_code, r.content)
