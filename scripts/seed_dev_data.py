#!/usr/bin/env python3
import os
import sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'wellness_project.settings')
try:
    import django
    django.setup()
except Exception as e:
    print('Error setting up Django:', e)
    sys.exit(1)

from django.contrib.auth import get_user_model

User = get_user_model()

def create_user(username, email, password, is_super=False):
    if User.objects.filter(username=username).exists():
        print(f'User {username} already exists')
        return
    if is_super:
        user = User.objects.create_superuser(username=username, email=email, password=password)
        print(f'Created superuser: {username}')
    else:
        user = User.objects.create_user(username=username, email=email, password=password)
        print(f'Created user: {username}')

if __name__ == '__main__':
    # By default we DO NOT create/override a superuser to avoid changing existing credentials.
    # To explicitly create a dev superuser set the env var DEV_CREATE_SUPERUSER=1 and provide
    # DEV_SUPERUSER_USERNAME, DEV_SUPERUSER_EMAIL, DEV_SUPERUSER_PASSWORD.
    create_super = os.environ.get('DEV_CREATE_SUPERUSER', '0') == '1'

    if create_super:
        su_name = os.environ.get('DEV_SUPERUSER_USERNAME', 'tempgpt666')
        su_email = os.environ.get('DEV_SUPERUSER_EMAIL', 'tempgpt666@example.com')
        su_pass = os.environ.get('DEV_SUPERUSER_PASSWORD', 'devpass123')
        create_user(su_name, su_email, su_pass, is_super=True)
    else:
        print('Skipping superuser creation (DEV_CREATE_SUPERUSER not set).')

    # Additional test accounts (safe to create)
    create_user('testuser1', 'test1@example.com', 'testpass1', is_super=False)
    create_user('testuser2', 'test2@example.com', 'testpass2', is_super=False)

    print('Seeding complete.')
