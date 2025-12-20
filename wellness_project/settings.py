import os
from pathlib import Path
import dj_database_url

# =========================
# BASE
# =========================
BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-dev-only-change-in-production')

# Detect production environment (Railway or when DATABASE_URL contains railway/postgres)
IS_PRODUCTION = bool(
    os.getenv('RAILWAY_ENVIRONMENT') or 
    (os.getenv('DATABASE_URL') and 'railway' in os.getenv('DATABASE_URL', '').lower())
)

# DEBUG should be False in production, but can be overridden with DEBUG=True env var
DEBUG = False if IS_PRODUCTION else os.getenv('DEBUG', 'True').lower() in ('1', 'true', 'yes')

# Production security settings
if not DEBUG and IS_PRODUCTION:
    SECURE_HSTS_SECONDS = 31536000
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    SECURE_SSL_REDIRECT = True
    SECURE_BROWSER_XSS_FILTER = True
    # Disable CSP for now as it can block legitimate resources
    # SECURE_CONTENT_SECURITY_POLICY = {
    #     'default-src': ("'self'",),
    # }

# =========================
# ALLOWED HOSTS
# =========================
# Always allow local/dev hosts so the server works out of the box
_default_allowed_hosts = os.getenv('ALLOWED_HOSTS', 'ojasritu.co.in,www.ojasritu.co.in,ojasritu-wellness-new.up.railway.app').split(',')
_local_hosts = ['localhost', '127.0.0.1']

# Capture Railway-provided hostnames from common env vars
_railway_host = os.getenv('RAILWAY_PUBLIC_DOMAIN') or os.getenv('RAILWAY_DOMAIN') or os.getenv('RAILWAY_URL')
_railway_host = _railway_host.replace('https://', '').replace('http://', '').strip('/') if _railway_host else ''

# Allow Codespaces-style forwarded hosts (e.g., *.app.github.dev) automatically
if os.getenv('CODESPACE_NAME') or os.getenv('GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN'):
    _local_hosts.append('*.app.github.dev')

ALLOWED_HOSTS = [host.strip() for host in _default_allowed_hosts + _local_hosts if host.strip()]
if _railway_host:
    ALLOWED_HOSTS.append(_railway_host)

# Add Railway wildcard patterns
ALLOWED_HOSTS.extend(['.railway.app', '.up.railway.app'])

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
    "https://ojasritu-wellness-new.up.railway.app",
    "https://urban-spoon-jjprx45wrjpvhjqwv.github.dev",
]

if _railway_host:
    CORS_ALLOWED_ORIGINS.append(f"https://{_railway_host}")

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
    "https://ojasritu-wellness-new.up.railway.app",
    "https://urban-spoon-jjprx45wrjpvhjqwv.github.dev/",
    "https://urban-spoon-jjprx45wrjpvhjqwv.github.dev/",
]

if _railway_host:
    CSRF_TRUSTED_ORIGINS.append(f"https://{_railway_host}")

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
    "default": dj_database_url.parse(
        os.getenv("DATABASE_URL", "sqlite:///db.sqlite3"),
        conn_max_age=600,
        ssl_require=not os.getenv("DATABASE_URL") is None
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
STATIC_ROOT = BASE_DIR / "staticfiles"

# Only include static dir if it exists and has content
_static_dir = BASE_DIR / "static"
if _static_dir.exists():
    STATICFILES_DIRS = [_static_dir]
else:
    STATICFILES_DIRS = []

# Include frontend build if it exists
_frontend_dist = BASE_DIR / "frontend" / "dist"
if _frontend_dist.exists():
    STATICFILES_DIRS.append(_frontend_dist)

STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# WhiteNoise configuration for media
WHITENOISE_AUTOREFRESH = True if DEBUG else False
WHITENOISE_USE_FINDERS = True
WHITENOISE_MIMETYPES = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
}

# Media files configuration
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# Add MEDIA_URL to CORS origins
if f"https://{os.getenv('RAILWAY_PUBLIC_DOMAIN', 'ojasritu.co.in')}" not in CORS_ALLOWED_ORIGINS:
    CORS_ALLOWED_ORIGINS.append(f"https://{os.getenv('RAILWAY_PUBLIC_DOMAIN', 'ojasritu.co.in')}")

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

