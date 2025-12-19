from django.test import TestCase, Client
from django.contrib.auth import get_user_model
import json


class IntegrationAuthTests(TestCase):
    def setUp(self):
        self.client = Client(enforce_csrf_checks=True)
        self.User = get_user_model()
        self.client.defaults['HTTP_HOST'] = 'localhost'

    def test_signup_login_check_logout_flow(self):
        # Get CSRF token
        r = self.client.get('/api/auth/csrf/')
        self.assertEqual(r.status_code, 200)
        csrftoken = r.cookies.get('csrftoken').value if r.cookies.get('csrftoken') else None
        headers = {'HTTP_X_CSRFTOKEN': csrftoken} if csrftoken else {}

        email = 'integ+1@example.com'
        pwd = 'IntegPass123!'

        # Ensure user doesn't exist
        self.User.objects.filter(username=email).delete()

        # Signup
        r = self.client.post('/api/auth/signup/', data=json.dumps({'email': email, 'password': pwd, 'password_confirm': pwd, 'first_name': 'Integ'}), content_type='application/json', **headers)
        self.assertEqual(r.status_code, 200)
        self.assertTrue(self.User.objects.filter(email=email).exists())

        # After signup we should have a session cookie; check /api/auth/check/
        import time
        r = None
        for _ in range(3):
            r = self.client.get('/api/auth/check/')
            if r.status_code == 200:
                break
            time.sleep(0.05)
        if r.status_code != 200:
            self.fail(f"/api/auth/check returned {r.status_code}: {r.content} cookies: {self.client.cookies}")
        data = r.json()
        self.assertTrue(data.get('authenticated'))
        self.assertIsInstance(data.get('user'), dict)
        self.assertEqual(data['user']['email'], email)

        # Refresh CSRF token (may rotate after session changes) then Logout
        r2 = self.client.get('/api/auth/csrf/')
        csrftoken2 = r2.cookies.get('csrftoken').value if r2.cookies.get('csrftoken') else None
        headers2 = {'HTTP_X_CSRFTOKEN': csrftoken2} if csrftoken2 else {}
        r = self.client.post('/api/auth/logout/', **headers2)
        if r.status_code != 200:
            self.fail(f"Logout failed: {r.status_code} {r.content} cookies: {self.client.cookies}")

        # After logout, /api/auth/check/ should report unauthenticated
        r = self.client.get('/api/auth/check/')
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertFalse(data.get('authenticated'))
