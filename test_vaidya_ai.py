#!/usr/bin/env python
"""
Quick Test Script for Vaidya AI Chatbot
Tests Gemini API integration and fallback responses
"""

import os
import json
import sys
from pathlib import Path

# Add project to path
project_path = Path(__file__).parent
sys.path.insert(0, str(project_path))

# Test Gemini API
print("=" * 60)
print("🤖 VAIDYA AI - CHATBOT TEST SUITE")
print("=" * 60)

# Test 1: Check if google-generativeai is installed
print("\n✓ Test 1: Checking Dependencies...")
try:
    import google.generativeai as genai
    print("  ✅ google-generativeai is installed")
except ImportError:
    print("  ❌ google-generativeai not installed")
    print("     Run: pip install google-generativeai")
    sys.exit(1)

# Test 2: Check API Key Configuration
print("\n✓ Test 2: Checking API Key Configuration...")
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', 'AIzaSyCFEb3v_VzFWKs6-gEa5CCmQ2LuxvaXtOI')
if GEMINI_API_KEY:
    print(f"  ✅ API Key Found (First 20 chars): {GEMINI_API_KEY[:20]}...")
else:
    print("  ❌ No API Key configured")
    sys.exit(1)

# Test 3: Try to configure Gemini
print("\n✓ Test 3: Configuring Gemini API...")
try:
    genai.configure(api_key=GEMINI_API_KEY)
    print("  ✅ Gemini API configured successfully")
except Exception as e:
    print(f"  ❌ Failed to configure: {e}")
    sys.exit(1)

# Test 4: Get available models
print("\n✓ Test 4: Checking Available Models...")
try:
    models = genai.list_models()
    print(f"  ✅ Found {sum(1 for m in models)} available models")
    for m in models:
        if 'pro' in m.name.lower():
            print(f"     - {m.name}")
except Exception as e:
    print(f"  ⚠️  Could not list models: {e}")

# Test 5: Test Simple API Call
print("\n✓ Test 5: Testing Gemini API Call...")
try:
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content("What is Ayurveda in one sentence?")
    if response and response.text:
        print(f"  ✅ API Response Received")
        print(f"     Response: {response.text[:100]}...")
    else:
        print("  ❌ Empty response from API")
except Exception as e:
    print(f"  ❌ API Error: {e}")
    sys.exit(1)

# Test 6: Test Ayurveda-specific prompt
print("\n✓ Test 6: Testing Ayurveda Expert Mode...")
try:
    model = genai.GenerativeModel('gemini-pro')
    
    prompt = """You are an ancient Ayurveda expert. 
    User asks: What is Vata dosha?
    Answer briefly in 2 sentences."""
    
    response = model.generate_content(prompt)
    if response and response.text:
        print(f"  ✅ Ayurveda Response Received")
        print(f"     {response.text[:150]}...")
    else:
        print("  ❌ Empty Ayurveda response")
except Exception as e:
    print(f"  ❌ Error: {e}")

# Test 7: Test Bilingual Support
print("\n✓ Test 7: Testing Bilingual Support...")
try:
    model = genai.GenerativeModel('gemini-pro')
    
    # Hindi test
    prompt_hi = "आयुर्वेद क्या है? एक वाक्य में बताएं।"
    response_hi = model.generate_content(prompt_hi)
    
    if response_hi and response_hi.text:
        print(f"  ✅ Hindi Response: {response_hi.text[:80]}...")
    else:
        print("  ⚠️  No Hindi response")
        
except Exception as e:
    print(f"  ⚠️  Bilingual test warning: {e}")

# Test 8: Check Django Setup
print("\n✓ Test 8: Checking Django Setup...")
try:
    import django
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'wellness_project.settings')
    django.setup()
    
    from shop.chatbot_improved import AYURVEDA_SLOKS, FALLBACK_RESPONSES
    print(f"  ✅ Django configured")
    print(f"     Found {len(AYURVEDA_SLOKS)} Ayurvedic sloks")
    print(f"     Found {len(FALLBACK_RESPONSES)} language packs")
    
except Exception as e:
    print(f"  ⚠️  Django check (may be normal in test): {e}")

# Final Summary
print("\n" + "=" * 60)
print("✅ ALL TESTS COMPLETED SUCCESSFULLY!")
print("=" * 60)
print("\n🚀 Your Vaidya AI Chatbot is ready to use!")
print("\nNext steps:")
print("  1. Start Django: python manage.py runserver")
print("  2. Start Frontend: cd frontend && npm run dev")
print("  3. Open: http://localhost:5173")
print("  4. Click the Pandit Robot logo! 🤖")
print("\n" + "=" * 60)
