from django.contrib.auth import get_user_model
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'wellness_project.settings')
django.setup()

User = get_user_model()

# Create superuser if doesn't exist
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser(
        username='admin',
        email='admin@ojasritu.com',
        password='admin123456'
    )
    print("✅ Superuser 'admin' created successfully!")
    print("Username: admin")
    print("Password: admin123456")
    print("Email: admin@ojasritu.com")
else:
    print("✅ Admin user already exists")
    # Update password
    user = User.objects.get(username='admin')
    user.set_password('admin123456')
    user.save()
    print("Password updated to: admin123456")
