from django.test import TestCase, override_settings
from django.core import mail
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
import re
import json


class AuthTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.User = get_user_model()

    def test_signup_and_login(self):
        resp = self.client.post('/api/auth/signup/', data={
            'email': 'alice@example.com',
            'password': 'complexpass123',
            'password_confirm': 'complexpass123',
            'first_name': 'Alice'
        }, format='json')
        self.assertEqual(resp.status_code, 200)
        self.assertTrue(self.User.objects.filter(email='alice@example.com').exists())

        # login
        resp = self.client.post('/api/auth/login/', data={'email': 'alice@example.com', 'password': 'complexpass123'}, format='json')
        self.assertEqual(resp.status_code, 200)
        self.assertIn('token', resp.data)

    @override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend', FRONTEND_URL='http://localhost:5173')
    def test_forgot_and_reset_password(self):
        user = self.User.objects.create_user(username='bob', email='bob@example.com', password='oldpass123')

        # request reset
        resp = self.client.post('/api/auth/forgot-password/', data={'email': 'bob@example.com'}, format='json')
        self.assertEqual(resp.status_code, 200)
        # email sent
        self.assertEqual(len(mail.outbox), 1)
        body = mail.outbox[0].body
        # match uid and token segments after reset-password
        m = re.search(r'reset-password/([^/]+)/([^\s/]+)', body)
        self.assertIsNotNone(m)
        uid, token = m.group(1), m.group(2)

        # reset password
        resp = self.client.post('/api/auth/reset-password/', data={'uid': uid, 'token': token, 'password': 'newpass456', 'password_confirm': 'newpass456'}, format='json')
        print('DEBUG reset response:', resp.status_code, getattr(resp, 'data', None))
        print('DEBUG uid', uid)
        print('DEBUG token', token)
        self.assertEqual(resp.status_code, 200)

        # login with new password
        resp = self.client.post('/api/auth/login/', data={'email': 'bob@example.com', 'password': 'newpass456'}, format='json')
        self.assertEqual(resp.status_code, 200)

    def test_login_with_email_when_username_differs(self):
        # user created with username different from email
        u = self.User.objects.create_user(username='carol123', email='carol@example.com', password='secret789')
        # login using email should work
        resp = self.client.post('/api/auth/login/', data={'email': 'carol@example.com', 'password': 'secret789'}, format='json')
        self.assertEqual(resp.status_code, 200)
        self.assertIn('token', resp.data)

    def test_google_login_creates_and_logs_in_user(self):
        # Patch the google verify function to return a predictable payload
        from shop.api import google_id_token

        def fake_verify(token, req, client_id):
            return {
                'email': 'dan@example.com',
                'given_name': 'Dan',
                'family_name': 'Smith',
                'picture': '',
            }

        original_verify = google_id_token.verify_oauth2_token
        google_id_token.verify_oauth2_token = fake_verify
        try:
            # Use Django's Client with CSRF enforcement to mimic real requests
            from django.test import Client
            c = Client(enforce_csrf_checks=True)
            c.defaults['HTTP_HOST'] = 'localhost'
            r = c.get('/api/auth/csrf/')
            csrftoken = r.cookies.get('csrftoken').value if r.cookies.get('csrftoken') else None
            headers = {'HTTP_X_CSRFTOKEN': csrftoken, 'HTTP_REFERER': 'http://localhost/'} if csrftoken else {'HTTP_REFERER': 'http://localhost/'}
            resp = c.post('/api/auth/google/', data=json.dumps({'id_token': 'fake'}), content_type='application/json', **headers)
            self.assertEqual(resp.status_code, 200)
            self.assertTrue(self.User.objects.filter(email='dan@example.com').exists())
        finally:
            google_id_token.verify_oauth2_token = original_verify

    def test_google_invalid_token_returns_400(self):
        # Simulate an invalid token by making the verify function raise
        from shop.api import google_id_token

        def raise_err(token, req, client_id):
            raise ValueError('token malformed')

        original_verify = google_id_token.verify_oauth2_token
        google_id_token.verify_oauth2_token = raise_err
        try:
            resp = self.client.post('/api/auth/google/', data={'id_token': 'bad'}, format='json')
            self.assertEqual(resp.status_code, 400)
            self.assertIn('error', resp.json())
        finally:
            google_id_token.verify_oauth2_token = original_verify

    def test_auth_check_endpoint(self):
        # Unauthenticated should return authenticated=false
        resp = self.client.get('/api/auth/check/')
        self.assertEqual(resp.status_code, 200)
        self.assertFalse(resp.json().get('authenticated'))

        # After signup/login, check should report authenticated true and include user info
        resp = self.client.post('/api/auth/signup/', data={'email': 'check@example.com', 'password': 'chkpass123', 'password_confirm': 'chkpass123', 'first_name': 'Check'}, format='json')
        self.assertEqual(resp.status_code, 200)

        # Now authenticated via session - use client which preserves cookies
        resp = self.client.get('/api/auth/check/')
        self.assertEqual(resp.status_code, 200)
        self.assertTrue(resp.json().get('authenticated'))
        self.assertIsInstance(resp.json().get('user'), dict)
