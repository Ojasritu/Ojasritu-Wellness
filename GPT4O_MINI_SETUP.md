# GPT-4o Mini Integration Guide for Wellness Vaidya AI

## ✅ Changes Made

Your Wellness application has been updated to use **OpenAI's GPT-4o Mini** - the latest, most cost-effective AI model from OpenAI.

### What Changed:
1. ✅ Replaced Google Gemini with OpenAI GPT-4o Mini
2. ✅ Updated `requirements.txt` - replaced `google-generativeai` with `openai>=1.0.0`
3. ✅ Updated `shop/chatbot_improved.py` - integrated OpenAI client
4. ✅ Maintained all fallback responses and Sanskrit sloks
5. ✅ Kept bilingual support (English & Hindi)

---

## 🚀 Setup Instructions

### Step 1: Get Your OpenAI API Key

1. Go to https://platform.openai.com/account/api-keys
2. Create a new API key
3. Copy the key (save it securely)

### Step 2: Set Environment Variable

**On Your Local Machine / Dev Container:**

```bash
# Option A: Set temporarily in terminal
export OPENAI_API_KEY="your-actual-api-key-here"

# Option B: Add to .env file
echo 'OPENAI_API_KEY=your-actual-api-key-here' >> .env
```

**In Production (Heroku/Cloud):**

```bash
# Using Heroku CLI
heroku config:set OPENAI_API_KEY="your-actual-api-key-here" --app your-app-name

# Or through web dashboard:
# Settings → Config Vars → Add: OPENAI_API_KEY = your-key
```

### Step 3: Install Updated Dependencies

```bash
# Clear cache and install fresh
pip install --upgrade pip
pip install -r requirements.txt
```

### Step 4: Verify Installation

```bash
# Test OpenAI import
python -c "from openai import OpenAI; print('✓ OpenAI library installed')"

# Test Django setup
python manage.py check
```

---

## 📋 How to Run for ojasrituwellness@gmail.com

### Method 1: Local Development (Codespace)

```bash
# 1. Clone repository
git clone https://github.com/Ojasritu/wellness.git
cd wellness

# 2. Set environment variables
export OPENAI_API_KEY="your-api-key"
export DEBUG=True
export ALLOWED_HOSTS="localhost,127.0.0.1"

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run migrations
python manage.py migrate

# 5. Create superuser (or use existing)
python manage.py createsuperuser --username admin --email ojasrituwellness@gmail.com

# 6. Start development server
python manage.py runserver 0.0.0.0:8000
```

Access at: http://localhost:8000

---

### Method 2: Production Deployment (Heroku)

#### Prerequisites:
- Heroku CLI installed
- Git configured
- Heroku account with permission

#### Steps:

```bash
# 1. Login to Heroku
heroku login

# 2. Add remote to your git repository
heroku git:remote -a your-wellness-app-name

# 3. Set environment variables
heroku config:set OPENAI_API_KEY="your-api-key" --app your-wellness-app-name
heroku config:set DEBUG=False --app your-wellness-app-name

# 4. Deploy code
git add .
git commit -m "Enable GPT-4o Mini integration"
git push heroku main

# 5. Run migrations on Heroku
heroku run "python manage.py migrate" --app your-wellness-app-name

# 6. Create superuser
heroku run "python manage.py createsuperuser" --app your-wellness-app-name

# 7. Check logs
heroku logs --tail --app your-wellness-app-name
```

---

### Method 3: Docker Deployment

```bash
# Build Docker image
docker build -t wellness-vaidya:latest .

# Set environment and run
docker run -e OPENAI_API_KEY="your-api-key" \
           -e DEBUG=False \
           -p 8000:8000 \
           wellness-vaidya:latest

# Or use docker-compose
docker-compose up
```

---

## 🔑 Environment Variables Required

### Essential Variables:
```
OPENAI_API_KEY=sk-... (your OpenAI API key)
STRIPE_PUBLIC_KEY=pk_...
STRIPE_SECRET_KEY=sk_...
SECRET_KEY=your-django-secret-key
DEBUG=False (in production)
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DATABASE_URL=postgresql://...
```

### Optional but Recommended:
```
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
DJANGO_SUPERUSER_USERNAME=admin
DJANGO_SUPERUSER_EMAIL=ojasrituwellness@gmail.com
DJANGO_SUPERUSER_PASSWORD=secure-password
```

---

## 🌐 Domain & Hosting Integration

### Connect Custom Domain (Heroku Example):

```bash
# 1. Add domain to Heroku app
heroku domains:add yourdomain.com --app your-wellness-app-name

# 2. Update DNS records with your domain provider:
# - Name: (blank or www)
# - Type: CNAME
# - Value: your-wellness-app-name.herokuapp.com

# 3. Verify domain
heroku domains --app your-wellness-app-name
```

### Django Settings Update:

Edit `wellness_project/settings.py`:
```python
# Add your domain
ALLOWED_HOSTS = [
    'yourdomain.com',
    'www.yourdomain.com',
    'your-wellness-app-name.herokuapp.com'
]

# Enable HTTPS
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
```

---

## ✨ API Features Now Available

### 1. Chat Endpoint
**POST** `/api/chat/` 
```json
{
  "message": "What is my dosha?",
  "language": "en",
  "history": []
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Your dosha is determined by...",
  "source": "openai",
  "model": "GPT-4o Mini",
  "slok": "Sanskrit text here"
}
```

### 2. Dosha Analyzer Endpoint
**POST** `/api/dosha-analyzer/`

### 3. Ayurveda Tips Endpoint
**GET** `/api/ayurveda-tips/?language=en&type=all`

---

## 🧪 Testing

### Test Chatbot Locally:
```bash
# Start server
python manage.py runserver

# In another terminal, test API
curl -X POST http://localhost:8000/api/chat/ \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello", "language":"en"}'
```

### Test with Python:
```python
import requests

response = requests.post(
    'http://localhost:8000/api/chat/',
    json={
        'message': 'What helps with Vata imbalance?',
        'language': 'en'
    }
)
print(response.json())
```

---

## 💰 Pricing Information

**OpenAI GPT-4o Mini Pricing (as of Dec 2025):**
- Input: $0.15 per 1M tokens
- Output: $0.60 per 1M tokens

**Cost Example:**
- 100 conversations/day × 500 tokens avg = 50,000 tokens/day
- Estimated cost: ~$0.015-0.020/day ($0.45-0.60/month)

**Compared to other models:**
- ✅ 95% cheaper than GPT-4 Turbo
- ✅ Much faster response times
- ✅ Perfect for Ayurveda chatbot use

---

## 🐛 Troubleshooting

### Issue: "OPENAI_API_KEY not configured"
**Solution:**
```bash
# Check if key is set
echo $OPENAI_API_KEY

# If empty, set it
export OPENAI_API_KEY="sk-..."

# Or add to .env file
echo 'OPENAI_API_KEY=sk-...' > .env
```

### Issue: "openai not installed"
**Solution:**
```bash
pip install --upgrade openai>=1.0.0
```

### Issue: API rate limit exceeded
**Solution:**
- Upgrade your OpenAI plan
- Add rate limiting on backend
- Queue requests

### Issue: Responses are too long
**Solution:**
Adjust in `chatbot_improved.py`:
```python
max_tokens=300  # Reduce from 500
```

---

## 📝 Superuser Transfer Instructions

### Transfer Django Admin Access:

```bash
# 1. Create new superuser for ojasrituwellness@gmail.com
python manage.py createsuperuser

# Username: admin (or preferred)
# Email: ojasrituwellness@gmail.com
# Password: secure-password

# 2. If migrating database:
python manage.py dumpdata > backup.json
# Transfer database file

# 3. To load existing data:
python manage.py loaddata backup.json

# 4. Verify access
python manage.py shell
>>> from django.contrib.auth.models import User
>>> User.objects.filter(email='ojasrituwellness@gmail.com')
```

### Transfer in Production:

```bash
# For Heroku
heroku run "python manage.py createsuperuser" --app your-app-name

# Email: ojasrituwellness@gmail.com
# Password: (use secure password)
```

---

## 🔒 Security Checklist

- [ ] OPENAI_API_KEY is in environment variables (not in code)
- [ ] SECRET_KEY is unique and secure
- [ ] DEBUG=False in production
- [ ] ALLOWED_HOSTS configured correctly
- [ ] HTTPS/SSL enabled
- [ ] Database backups in place
- [ ] Sensitive data not logged
- [ ] Regular security updates

---

## 📞 Support & Resources

- **OpenAI Docs:** https://platform.openai.com/docs
- **Django Docs:** https://docs.djangoproject.com
- **Heroku Docs:** https://devcenter.heroku.com
- **Repository:** https://github.com/Ojasritu/wellness

---

## ✅ Verification Checklist

After setup, verify:
- [ ] `pip list | grep openai` shows openai package
- [ ] `python manage.py check` passes all checks
- [ ] Chatbot API responds correctly
- [ ] Database migrations completed
- [ ] Superuser login works
- [ ] Static files collected (in production)
- [ ] Domain resolves correctly
- [ ] HTTPS working

---

**Last Updated:** December 10, 2025
**GPT-4o Mini:** Enabled ✅
**Ready for Production:** Yes ✅
