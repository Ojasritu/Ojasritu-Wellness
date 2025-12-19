import os
from pathlib import Path
import dj_database_url

# =========================
# BASE
# =========================
BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-dev-only-change-in-production')
DEBUG = os.getenv('DEBUG', 'False').lower() in ('1', 'true', 'yes')

# Production security settings
if not DEBUG:
    SECURE_HSTS_SECONDS = 31536000
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    SECURE_SSL_REDIRECT = True
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_SECURITY_POLICY = {
        'default-src': ("'self'",),
    }

# =========================
# ALLOWED HOSTS
# =========================
# Always allow local/dev hosts so the server works out of the box
_default_allowed_hosts = os.getenv('ALLOWED_HOSTS', 'ojasritu.co.in,www.ojasritu.co.in,*.railway.app').split(',')
_local_hosts = ['localhost', '127.0.0.1']

# Allow Codespaces-style forwarded hosts (e.g., *.app.github.dev) automatically
if os.getenv('CODESPACE_NAME') or os.getenv('GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN'):
    _local_hosts.append('*.app.github.dev')

ALLOWED_HOSTS = [host for host in _default_allowed_hosts + _local_hosts if host]

# Use SECURE_PROXY_SSL_HEADER when behind a proxy (Railway or GitHub Codespaces)
# This tells Django to trust X-Forwarded-Proto header for determining the scheme
if os.getenv('RAILWAY_ENVIRONMENT') or os.getenv('CODESPACE_NAME') or (os.getenv('DATABASE_URL') and 'railway' in os.getenv('DATABASE_URL', '')):
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

# =========================
# INSTALLED APPS
# =========================
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    "shop",

    "rest_framework",
    "rest_framework.authtoken",

    "corsheaders",

    "django.contrib.sites",
    "allauth",
    "allauth.account",
    "allauth.socialaccount",
    "allauth.socialaccount.providers.google",
]

SITE_ID = 1

# =========================
# MIDDLEWARE
# =========================
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "corsheaders.middleware.CorsMiddleware",

    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "allauth.account.middleware.AccountMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# =========================
# CORS CONFIG
# =========================
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://ojasritu.co.in",
    "https://www.ojasritu.co.in",
    "https://urban-spoon-jjprx45wrjpvhjqwv.github.dev",
]

CORS_ALLOW_CREDENTIALS = True

# =========================
# CSRF CONFIG (🔥 FINAL FIX)
# =========================
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://ojasritu.co.in",
    "https://www.ojasritu.co.in",
    "https://urban-spoon-jjprx45wrjpvhjqwv.github.dev/",
    "https://urban-spoon-jjprx45wrjpvhjqwv.github.dev/",
]

# Use cross-site cookies for SPA authentication (frontend runs on different origin)
# Browsers require SameSite=None for cross-site cookies
CSRF_COOKIE_SAMESITE = "LAX"
SESSION_COOKIE_SAMESITE = "LAX"

# Use secure cookies in production or when explicitly requested via env var
FORCE_SECURE_COOKIES = os.getenv('FORCE_SECURE_COOKIES', 'False').lower() in ('1', 'true', 'yes')
if DEBUG:
    CSRF_COOKIE_SECURE = FORCE_SECURE_COOKIES
    SESSION_COOKIE_SECURE = FORCE_SECURE_COOKIES
else:
    CSRF_COOKIE_SECURE = True
    SESSION_COOKIE_SECURE = True

# Allow cross-site requests to include credentials
CORS_ALLOW_CREDENTIALS = True


# =========================
# URLS / WSGI
# =========================
ROOT_URLCONF = "wellness_project.urls"
WSGI_APPLICATION = "wellness_project.wsgi.application"

# =========================
# TEMPLATES
# =========================
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# =========================
# DATABASE
# =========================
DATABASES = {
    "default": dj_database_url.config(
        default="sqlite:///" + str(BASE_DIR / "db.sqlite3"),
        conn_max_age=600,
    )
}

# =========================
# PASSWORD VALIDATION
# =========================
AUTH_PASSWORD_VALIDATORS = []

# =========================
# I18N
# =========================
LANGUAGE_CODE = "en-us"
TIME_ZONE = "Asia/Kolkata"
USE_I18N = True
USE_TZ = True

# =========================
# STATIC / MEDIA
# =========================
STATIC_URL = "/static/"
STATICFILES_DIRS = [BASE_DIR / "static"]
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# =========================
# 🔐 GOOGLE OAUTH (CONFIGURED FROM ENV)
# =========================
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")

SOCIALACCOUNT_PROVIDERS = {
    "google": {
        "SCOPE": ["profile", "email"],
        "AUTH_PARAMS": {"access_type": "online"},
    }
}
FRONTEND_URL = "http://localhost:5173" if DEBUG else "https://ojasritu.co.in"

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
DEFAULT_FROM_EMAIL = "no-reply@ojasritu.co.in"

# REST framework: support both session and token authentication
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.TokenAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ]
}

