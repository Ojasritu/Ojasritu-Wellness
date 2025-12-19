#!/usr/bin/env python3
"""Create or update Django superuser using environment variables or .env file.

Reads the following variables (in order):
 - DJANGO_SUPERUSER_USERNAME (default: admin)
 - DJANGO_SUPERUSER_EMAIL (default: admin@localhost)
 - DJANGO_SUPERUSER_PASSWORD (default: admin123456)

This is safe for local development to ensure a predictable admin exists.
"""
import os
from pathlib import Path


def load_dotenv(path='.env'):
    p = Path(path)
    if not p.exists():
        return
    with p.open() as fh:
        for raw in fh:
            line = raw.strip()
            if not line or line.startswith('#') or '=' not in line:
                continue
            k, v = line.split('=', 1)
            k = k.strip()
            v = v.strip().strip('"').strip("'")
            if k and k not in os.environ:
                os.environ[k] = v


if __name__ == '__main__':
    # Load .env if present so we can pick up credentials from it
    load_dotenv('.env')

    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'wellness_project.settings')

    import django

    django.setup()

    from django.contrib.auth import get_user_model

    User = get_user_model()

    username = os.getenv('DJANGO_SUPERUSER_USERNAME', 'admin')
    email = os.getenv('DJANGO_SUPERUSER_EMAIL', 'admin@localhost')
    password = os.getenv('DJANGO_SUPERUSER_PASSWORD', 'admin123456')

    if not User.objects.filter(username=username).exists():
        User.objects.create_superuser(username=username, email=email, password=password)
        print(f"✅ Superuser '{username}' created successfully!")
        print(f"Username: {username}")
        print(f"Password: {password}")
        print(f"Email: {email}")
    else:
        user = User.objects.get(username=username)
        user.set_password(password)
        user.email = email
        user.save()
        print(f"✅ Superuser '{username}' already exists — password updated to the provided value.")
