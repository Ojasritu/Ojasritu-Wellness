# Add this to settings.py after INSTALLED_APPS

INSTALLED_APPS = [
    # ... existing apps ...
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',
    'social_django',
    'django_allauth',
]

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
    'social_core.backends.google.GoogleOAuth2',
]

import os

# Google OAuth Settings
SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = os.getenv('GOOGLE_CLIENT_ID', 'REDACTED_GOOGLE_CLIENT_ID')
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = os.getenv('GOOGLE_CLIENT_SECRET', 'REDACTED_GOOGLE_CLIENT_SECRET')

# Email Configuration
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'  # For development
# For production, use:
# EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
# EMAIL_HOST = os.getenv('EMAIL_HOST', 'smtp.gmail.com')
# EMAIL_PORT = int(os.getenv('EMAIL_PORT', '587'))
# EMAIL_USE_TLS = True
# EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER', '')
# EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD', '')
# DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL', 'noreply@ojasritu.com')

DEFAULT_FROM_EMAIL = 'noreply@ojasritu.com'
FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:5173')

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ]
}

CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
]
