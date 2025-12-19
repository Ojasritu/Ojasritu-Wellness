from django.contrib.auth import get_user_model
import os

User = get_user_model()
email = os.environ.get('DJANGO_SUPERUSER_EMAIL', 'ojasrituwellness@gmail.com')
# Default username and password updated per user request
# Use capitalized 'Admin' username as requested
username = os.environ.get('DJANGO_SUPERUSER_USERNAME', 'Admin')
password = os.environ.get('DJANGO_SUPERUSER_PASSWORD', 'Ojas1177@Oj')

u = User.objects.filter(email=email).first()
if not u:
    User.objects.create_superuser(username=username, email=email, password=password)
    print('SUPERUSER_CREATED')
else:
    # Update existing user to match requested credentials and ensure superuser privileges
    changed = False
    if u.username != username:
        u.username = username
        changed = True
    try:
        # set_password will hash the password
        u.set_password(password)
        changed = True
    except Exception:
        pass
    if not u.is_superuser:
        u.is_superuser = True
        changed = True
    if not u.is_staff:
        u.is_staff = True
        changed = True
    if changed:
        u.save()
        print('SUPERUSER_UPDATED')
    else:
        print('SUPERUSER_EXISTS')
