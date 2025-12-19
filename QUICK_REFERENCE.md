# Quick Reference: Wellness Vaidya AI with GPT-4o Mini

## ⚡ Quick Start (Copy & Paste)

### 1. Local Development (5 min)
```bash
git clone https://github.com/Ojasritu/wellness.git && cd wellness
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env and add OPENAI_API_KEY=sk-...
python manage.py migrate
python manage.py createsuperuser  # Email: ojasrituwellness@gmail.com
python manage.py runserver
```

**Access:**
- Website: http://localhost:8000
- Admin: http://localhost:8000/admin
- API: http://localhost:8000/api/chat/

---

### 2. Heroku Deployment (10 min)
```bash
heroku login
heroku create wellness-app-name
heroku addons:create heroku-postgresql:hobby-dev
heroku config:set OPENAI_API_KEY="sk-your-key"
heroku config:set SECRET_KEY="your-secret"
git push heroku main
heroku run python manage.py migrate
heroku run python manage.py createsuperuser  # ojasrituwellness@gmail.com
heroku open  # View app
heroku logs --tail  # Check logs
```

---

## 🔑 Essential Environment Variables

```bash
# Required
OPENAI_API_KEY=sk-...          # Your OpenAI API key
SECRET_KEY=django-secret-key   # Django secret
DEBUG=False                     # Never True in production

# Domain & Hosting
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DATABASE_URL=postgresql://...  # Production database

# Optional but recommended
STRIPE_PUBLIC_KEY=pk_...
STRIPE_SECRET_KEY=sk_...
EMAIL_HOST_USER=ojasrituwellness@gmail.com
```

---

## 🧪 Test API Endpoint

```bash
# Using curl
curl -X POST http://localhost:8000/api/chat/ \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is Ayurveda?",
    "language": "en",
    "history": []
  }'

# Expected response:
# {
#   "status": "success",
#   "message": "...",
#   "source": "openai",
#   "model": "GPT-4o Mini"
# }
```

---

## 📊 Pricing

| Model | Input | Output | Use Case |
|-------|-------|--------|----------|
| GPT-4o Mini | $0.15/1M tokens | $0.60/1M tokens | ✅ Chosen (95% cheaper) |
| GPT-4 Turbo | $10/1M tokens | $30/1M tokens | Advanced tasks |
| Gemini Pro | Free | Free | Limited requests |

**Cost for 100 chats/day:**
- ~$0.50-1.00/month (very affordable!)

---

## 🔐 Security Checklist

- [ ] OPENAI_API_KEY in .env (not in code)
- [ ] SECRET_KEY is unique (50+ chars)
- [ ] DEBUG=False in production
- [ ] ALLOWED_HOSTS configured
- [ ] HTTPS enabled
- [ ] Database backups
- [ ] Regular updates

---

## 🐛 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| `ModuleNotFoundError: openai` | `pip install openai>=1.0.0` |
| `OPENAI_API_KEY not set` | `export OPENAI_API_KEY="sk-..."` |
| `Database locked` | Restart server / clear db.sqlite3 |
| `Static files missing` | `python manage.py collectstatic` |
| `502 Bad Gateway` | Check Heroku logs: `heroku logs --tail` |

---

## 📱 API Endpoints

### Chat Endpoint
```
POST /api/chat/
{
  "message": "string",
  "language": "en" or "hi",
  "history": []
}
```

### Dosha Analyzer
```
POST /api/dosha-analyzer/
{
  "answers": {...},
  "language": "en" or "hi"
}
```

### Ayurveda Tips
```
GET /api/ayurveda-tips/?language=en&type=all
```

---

## 🌐 Domain Setup

### DNS Configuration
```
CNAME record:
Domain: yourdomain.com
Points to: your-app-name.herokuapp.com (for Heroku)
```

### Django Settings Update
```python
# wellness_project/settings.py
ALLOWED_HOSTS = [
    'yourdomain.com',
    'www.yourdomain.com',
    'your-app-name.herokuapp.com'
]

SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
```

---

## 👤 Admin User Setup

### Create Admin
```bash
python manage.py createsuperuser

# When prompted:
# Username: admin
# Email: ojasrituwellness@gmail.com
# Password: YourSecurePassword
```

### Change Admin Password
```bash
python manage.py shell
>>> from django.contrib.auth.models import User
>>> u = User.objects.get(username='admin')
>>> u.set_password('new_password')
>>> u.save()
>>> exit()
```

---

## 📂 File Structure

```
wellness/
├── manage.py                 # Django management
├── requirements.txt          # Python dependencies
├── .env.example             # Environment template
├── wellness_project/        # Django settings
├── shop/                    # Main app
│   └── chatbot_improved.py  # ✅ GPT-4o Mini integration
├── frontend/                # React frontend
├── templates/               # HTML templates
├── static/                  # CSS, JS, images
└── PRODUCTION_GUIDE.md      # ✅ Full deployment guide
```

---

## 🚀 Deployment Checklist

- [ ] Code committed to git
- [ ] .env configured with all keys
- [ ] Database migrations run
- [ ] Superuser created (ojasrituwellness@gmail.com)
- [ ] Static files collected
- [ ] ALLOWED_HOSTS updated
- [ ] SSL/HTTPS configured
- [ ] DNS pointing to host
- [ ] Database backups setup
- [ ] Monitoring enabled

---

## 📞 Help & Resources

| Resource | URL |
|----------|-----|
| OpenAI Docs | https://platform.openai.com/docs |
| Django Docs | https://docs.djangoproject.com |
| Heroku Docs | https://devcenter.heroku.com |
| GitHub Repo | https://github.com/Ojasritu/wellness |

---

## ✅ Verification Commands

```bash
# Check Python version
python --version

# Check Django setup
python manage.py check

# Check dependencies installed
pip list | grep -E "Django|openai|stripe"

# Test API
python manage.py shell -c "
from openai import OpenAI
print('✓ OpenAI library available')
"

# Check superuser exists
python manage.py shell -c "
from django.contrib.auth.models import User
print('Superusers:', User.objects.filter(is_superuser=True).values('username'))
"
```

---

## 🎯 For ojasrituwellness@gmail.com

**To run locally as collaborator:**
1. Get access to GitHub repo
2. Clone: `git clone https://github.com/Ojasritu/wellness.git`
3. Get OpenAI API key
4. Setup .env with OPENAI_API_KEY
5. Run: `python manage.py runserver`
6. Use as admin at http://localhost:8000/admin

**To deploy to production:**
1. Get Heroku account access
2. Follow Heroku deployment steps above
3. All Django data, superuser, and settings transfer
4. App becomes publicly accessible

---

**Last Updated:** December 10, 2025  
**Status:** ✅ Production Ready  
**GPT-4o Mini:** ✅ Enabled
