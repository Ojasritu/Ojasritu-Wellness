#!/usr/bin/env python
"""
Create superuser with specified credentials
Email: ojasrituwellness@gmail.com
Username: admin
Password: Admin@12345
"""
import os
import sys
import django

# Setup Django environment
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'wellness_project.settings')
django.setup()

from django.contrib.auth import get_user_model

def create_superuser():
    User = get_user_model()
    
    email = 'ojasrituwellness@gmail.com'
    username = 'admin'
    password = 'Admin@12345'
    
    try:
        # Delete existing users with this email or username to avoid conflicts
        User.objects.filter(email=email).delete()
        User.objects.filter(username=username).delete()
        
        # Create new superuser
        user = User.objects.create_superuser(
            username=username,
            email=email,
            password=password
        )
        
        print("✅ Superuser created successfully!")
        print(f"   Email: {email}")
        print(f"   Username: {username}")
        print(f"   Password: {password}")
        print(f"   Is superuser: {user.is_superuser}")
        print(f"   Is staff: {user.is_staff}")
        print(f"   Is active: {user.is_active}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error creating superuser: {e}")
        return False

if __name__ == '__main__':
    success = create_superuser()
    sys.exit(0 if success else 1)
