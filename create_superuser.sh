#!/bin/bash
set -e

# Create Django superuser if env vars are set
if [ -n "$DJANGO_SUPERUSER_EMAIL" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ] && [ -n "$DJANGO_SUPERUSER_USERNAME" ]; then
    echo "===> Creating/Updating superuser: $DJANGO_SUPERUSER_USERNAME"
    python manage.py shell <<EOF
import os
from django.contrib.auth import get_user_model

User = get_user_model()
email = os.environ.get('DJANGO_SUPERUSER_EMAIL')
username = os.environ.get('DJANGO_SUPERUSER_USERNAME')
password = os.environ.get('DJANGO_SUPERUSER_PASSWORD')

# Check if user exists
user = User.objects.filter(username=username).first()

if user:
    # Update password
    user.set_password(password)
    user.is_staff = True
    user.is_superuser = True
    user.email = email
    user.save()
    print(f"✓ Updated superuser: {username}")
else:
    # Create new superuser
    User.objects.create_superuser(
        username=username,
        email=email,
        password=password
    )
    print(f"✓ Created superuser: {username}")
EOF
else
    echo "⚠ Skipping superuser creation (DJANGO_SUPERUSER_* env vars not set)"
fi
