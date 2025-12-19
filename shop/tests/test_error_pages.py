from django.test import TestCase, override_settings, Client


class ErrorPagesTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.client.defaults['HTTP_HOST'] = 'localhost'

    @override_settings(DEBUG=False, ALLOWED_HOSTS=['localhost'])
    def test_404_template_used(self):
        r = self.client.get('/this-path-does-not-exist/')
        self.assertEqual(r.status_code, 404)
        # Ensure our friendly content appears
        self.assertIn(b'Page not found', r.content)
        self.assertIn(b'Back to Home', r.content)
