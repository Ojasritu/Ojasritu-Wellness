#!/usr/bin/env python3
"""
Test script to verify backend authentication and superuser functionality
"""
import requests
import json
import sys

BACKEND_URL = "http://127.0.0.1:8000"
API_URL = f"{BACKEND_URL}/api"

def test_superuser_login():
    """Test superuser login"""
    print("🔐 Testing Superuser Login...")
    print("-" * 50)
    
    credentials = {
        "email": "ojasrituwellness@gmail.com",
        "password": "Admin@12345"
    }
    
    try:
        response = requests.post(
            f"{API_URL}/auth/login/",
            json=credentials,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success") and data.get("token"):
                print("✅ Login successful!")
                print(f"   Token: {data['token']}")
                return data['token']
            else:
                print("❌ Login failed: Invalid response format")
                print(f"   Response: {data}")
                return None
        else:
            print(f"❌ Login failed with status {response.status_code}")
            print(f"   Response: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Error during login: {e}")
        return None


def test_profile_endpoint(token):
    """Test profile endpoint with token"""
    print("\n👤 Testing Profile Endpoint...")
    print("-" * 50)
    
    try:
        response = requests.get(
            f"{API_URL}/auth/profile/",
            headers={
                "Authorization": f"Token {token}",
                "Content-Type": "application/json"
            }
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Profile endpoint working!")
            print(f"   Authenticated: {data.get('authenticated')}")
            if data.get('user'):
                user = data['user']
                print(f"   Username: {user.get('username')}")
                print(f"   Email: {user.get('email')}")
                print(f"   First Name: {user.get('first_name')}")
            return True
        else:
            print(f"❌ Profile check failed with status {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error checking profile: {e}")
        return False


def test_products_api():
    """Test products API endpoint"""
    print("\n📦 Testing Products API...")
    print("-" * 50)
    
    try:
        response = requests.get(f"{API_URL}/products/")
        
        if response.status_code == 200:
            products = response.json()
            print(f"✅ Products API working!")
            print(f"   Total products: {len(products)}")
            if products:
                print(f"   Sample product: {products[0].get('name', 'N/A')}")
            return True
        else:
            print(f"❌ Products API failed with status {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error fetching products: {e}")
        return False


def test_admin_access():
    """Test Django admin access"""
    print("\n🔧 Testing Django Admin Access...")
    print("-" * 50)
    
    try:
        response = requests.get(f"{BACKEND_URL}/admin/", allow_redirects=False)
        
        if response.status_code in [200, 302]:
            print("✅ Django admin is accessible")
            print(f"   URL: {BACKEND_URL}/admin/")
            return True
        else:
            print(f"⚠️  Admin returned status {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error accessing admin: {e}")
        return False


def main():
    print("=" * 50)
    print("🧪 Backend Authentication Test Suite")
    print("=" * 50)
    print(f"\nBackend URL: {BACKEND_URL}")
    print(f"API URL: {API_URL}")
    print("\nSuperuser Credentials:")
    print("  Email: ojasrituwellness@gmail.com")
    print("  Username: admin")
    print("  Password: Admin@12345")
    print("\n")
    
    results = {
        "login": False,
        "profile": False,
        "products": False,
        "admin": False
    }
    
    # Test 1: Login
    token = test_superuser_login()
    results["login"] = bool(token)
    
    # Test 2: Profile (requires token)
    if token:
        results["profile"] = test_profile_endpoint(token)
    
    # Test 3: Products API (public)
    results["products"] = test_products_api()
    
    # Test 4: Admin access
    results["admin"] = test_admin_access()
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 TEST SUMMARY")
    print("=" * 50)
    
    for test_name, passed in results.items():
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{test_name.upper():<15} {status}")
    
    all_passed = all(results.values())
    
    print("\n" + "=" * 50)
    if all_passed:
        print("🎉 ALL TESTS PASSED!")
        print("✅ Backend is fully functional")
        print("✅ Superuser credentials are working")
        print("✅ Frontend can now connect to backend")
    else:
        print("⚠️  SOME TESTS FAILED")
        print("Please check the output above for details")
    print("=" * 50)
    
    return 0 if all_passed else 1


if __name__ == "__main__":
    sys.exit(main())
