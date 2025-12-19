# 🌟 Complete Wellness Vaidya AI Production Guide

## Table of Contents
1. [GPT-4o Mini Setup](#gpt-4o-mini-setup)
2. [Local Development](#local-development)
3. [Production Deployment](#production-deployment)
4. [Domain & Hosting](#domain--hosting)
5. [Superuser Setup](#superuser-setup)
6. [Troubleshooting](#troubleshooting)
7. [Security](#security)

---

## GPT-4o Mini Setup

### What is GPT-4o Mini?
- **Latest AI Model** from OpenAI (Dec 2024)
- **95% cheaper** than GPT-4 Turbo
- **Fastest response time** among advanced models
- **Perfect for** customer service, chatbots, content

### Get API Key

1. Visit: https://platform.openai.com/account/api-keys
2. Click "Create new secret key"
3. Copy the key (save in password manager)
4. Add $5-20 credit to avoid limits

---

## Local Development

### Quick Start (5 minutes)

```bash
# 1. Clone repo
git clone https://github.com/Ojasritu/wellness.git
cd wellness

# 2. Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 3. Copy environment template
cp .env.example .env

# 4. Edit .env and add your OpenAI key
nano .env
# OPENAI_API_KEY=sk-your-actual-key

# 5. Install dependencies
pip install -r requirements.txt

# 6. Run migrations
python manage.py migrate

# 7. Create admin user
python manage.py createsuperuser
# Username: admin
# Email: ojasrituwellness@gmail.com
# Password: (set your password)

# 8. Start server
python manage.py runserver 0.0.0.0:8000
```

**Access:**
- Website: http://localhost:8000
- Admin Panel: http://localhost:8000/admin
- API: http://localhost:8000/api/chat/

### Test Chatbot API

```bash
# Terminal 1: Start server
python manage.py runserver

# Terminal 2: Test API
curl -X POST http://localhost:8000/api/chat/ \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What helps with Vata imbalance?",
    "language": "en",
    "history": []
  }'
```

Expected response:
```json
{
  "status": "success",
  "message": "Lorem ipsum...",
  "source": "openai",
  "model": "GPT-4o Mini",
  "slok": "Sanskrit text..."
}
```

---

## Production Deployment

### Option 1: Heroku Deployment (Recommended)

#### Prerequisites:
- Heroku account (free tier available)
- Heroku CLI installed
- Git repository

#### Steps:

```bash
# 1. Login to Heroku
heroku login

# 2. Create new app (or use existing)
heroku create your-wellness-app

# 3. Add database
heroku addons:create heroku-postgresql:hobby-dev

# 4. Set environment variables
heroku config:set OPENAI_API_KEY="sk-your-actual-key"
heroku config:set SECRET_KEY="your-secret-key"
heroku config:set DEBUG=False
heroku config:set ALLOWED_HOSTS="your-wellness-app.herokuapp.com,yourdomain.com"

# 5. Deploy
git add .
git commit -m "Deploy with GPT-4o Mini"
git push heroku main

# 6. Run migrations
heroku run python manage.py migrate

# 7. Create admin
heroku run python manage.py createsuperuser
# Email: ojasrituwellness@gmail.com

# 8. View logs
heroku logs --tail
```

**Check Deployment:**
```bash
heroku open  # Opens your app in browser
heroku config  # View all settings
```

---

### Option 2: PythonAnywhere Deployment

1. Sign up at https://www.pythonanywhere.com
2. Upload your code via git
3. Configure web app (set Python 3.11, Django)
4. Set environment variables in web app settings
5. Reload web app
6. Access at: yourusername.pythonanywhere.com

---

### Option 3: Self-Hosted (VPS)

**Requirements:**
- Ubuntu 20.04+ server
- 2GB RAM minimum
- Python 3.11
- PostgreSQL
- Nginx (reverse proxy)

```bash
# 1. Connect to server
ssh root@your-server-ip

# 2. Install dependencies
apt update && apt upgrade -y
apt install python3 python3-pip python3-venv postgresql nginx git -y

# 3. Clone repository
git clone https://github.com/Ojasritu/wellness.git
cd wellness

# 4. Create virtual environment
python3 -m venv venv
source venv/bin/activate

# 5. Install Python packages
pip install -r requirements.txt
pip install gunicorn

# 6. Configure environment
cp .env.example .env
nano .env  # Add your settings

# 7. Setup database
python manage.py migrate
python manage.py collectstatic --noinput

# 8. Create systemd service
cat > /etc/systemd/system/wellness.service << EOF
[Unit]
Description=Wellness Vaidya AI
After=network.target

[Service]
User=www-data
WorkingDirectory=/root/wellness
ExecStart=/root/wellness/venv/bin/gunicorn wellness_project.wsgi:application --bind 127.0.0.1:8000
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# 9. Start service
systemctl enable wellness
systemctl start wellness

# 10. Configure Nginx
# See Nginx configuration below
```

---

## Domain & Hosting

### Connect Custom Domain

#### 1. Register Domain
- GoDaddy, Namecheap, Google Domains, etc.
- Cost: $1-15/year

#### 2. Point Domain to Hosting

**For Heroku:**
```bash
# Add domain to Heroku app
heroku domains:add yourdomain.com

# Get Heroku DNS target
heroku domains

# Update your domain's DNS:
# CNAME: yourdomain.com → your-app-name.herokuapp.com
```

**For VPS:**
```bash
# Update DNS A record:
# Host: @
# Type: A
# Value: Your server IP
```

#### 3. Update Django Settings

Edit `wellness_project/settings.py`:

```python
# Add your domain
ALLOWED_HOSTS = [
    'yourdomain.com',
    'www.yourdomain.com',
    'your-heroku-app.herokuapp.com',  # if using Heroku
]

# Enable HTTPS (Important!)
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
HSTS_SECONDS = 31536000
HSTS_INCLUDE_SUBDOMAINS = True
HSTS_PRELOAD = True
```

#### 4. Setup HTTPS/SSL

**Heroku:** Automatic (included)

**VPS:** Use Let's Encrypt
```bash
apt install certbot python3-certbot-nginx -y
certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com
```

#### 5. Configure Nginx

```nginx
upstream django {
    server 127.0.0.1:8000;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    client_max_body_size 20M;

    location /static/ {
        alias /root/wellness/static/;
    }

    location /media/ {
        alias /root/wellness/media/;
    }

    location / {
        proxy_pass http://django;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## Superuser Setup

### For ojasrituwellness@gmail.com

#### Local Setup:
```bash
python manage.py createsuperuser

# Prompts:
# Username: admin (or ojasritu)
# Email: ojasrituwellness@gmail.com
# Password: YourSecurePassword123!
```

#### Transfer Database:
```bash
# Backup existing database
python manage.py dumpdata > backup.json

# Load on new instance
python manage.py loaddata backup.json
```

#### Reset Admin Password:
```bash
python manage.py shell
>>> from django.contrib.auth.models import User
>>> u = User.objects.get(username='admin')
>>> u.set_password('new_password')
>>> u.save()
```

#### Production (Heroku):
```bash
heroku run python manage.py createsuperuser --app your-app-name

# Email: ojasrituwellness@gmail.com
# Password: (secure password)
```

---

## Troubleshooting

### Problem: "OPENAI_API_KEY not set"

```bash
# Check environment
echo $OPENAI_API_KEY

# If empty, set it
export OPENAI_API_KEY="sk-..."

# Or add to .env file
echo "OPENAI_API_KEY=sk-..." >> .env

# Or in Heroku
heroku config:set OPENAI_API_KEY="sk-..."
```

### Problem: "ModuleNotFoundError: No module named 'openai'"

```bash
pip install --upgrade openai>=1.0.0
pip list | grep openai  # Verify installation
```

### Problem: Database connection failed

```bash
# Check database settings
python manage.py dbshell

# Reset migrations (WARNING: loses data)
python manage.py migrate --fake-initial
python manage.py migrate

# Create fresh database
rm db.sqlite3
python manage.py migrate
```

### Problem: Static files not loading

```bash
# Collect static files
python manage.py collectstatic --noinput

# Check file permissions
chmod -R 755 /path/to/wellness/static/
```

### Problem: API returning 500 error

```bash
# Check logs
python manage.py runserver  # See console output

# Or production logs
heroku logs --tail

# Enable detailed error reporting
DEBUG=True  # Only in development!
```

---

## Security

### Essential Security Checklist

- [ ] **OPENAI_API_KEY**: Only in environment variables
- [ ] **SECRET_KEY**: Unique, not in git, 50+ characters
- [ ] **DEBUG**: False in production
- [ ] **ALLOWED_HOSTS**: Configured correctly
- [ ] **HTTPS/SSL**: Enabled on all pages
- [ ] **Database**: PostgreSQL (not SQLite) in production
- [ ] **Backup**: Daily database backups
- [ ] **Updates**: Regular security updates

### Security Best Practices

```python
# wellness_project/settings.py

# Never commit SECRET_KEY
from dotenv import load_dotenv
load_dotenv()

SECRET_KEY = os.getenv('SECRET_KEY')
if not SECRET_KEY:
    raise ValueError("SECRET_KEY environment variable not set!")

# Secure cookie settings
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True
CSRF_COOKIE_HTTPONLY = True

# Content Security Policy
SECURE_CONTENT_SECURITY_POLICY = {
    "default-src": ("'self'",),
}
```

### API Key Rotation

1. Generate new OpenAI API key
2. Update environment variable
3. Test thoroughly
4. Remove old key
5. Monitor for errors

---

## Monitoring & Maintenance

### Check App Status

```bash
# Heroku
heroku ps  # Check running dyno
heroku logs --tail  # Real-time logs

# Local
python manage.py check  # System check
python manage.py test  # Run tests
```

### Backup Database

```bash
# Heroku
heroku pg:backups:capture
heroku pg:backups:download

# Local
python manage.py dumpdata > backup_$(date +%Y%m%d).json
```

### Monitor Performance

```bash
# Heroku
heroku metrics -a your-app

# Check API response times
curl -w "Time: %{time_total}s\n" http://yourdomain.com/api/chat/
```

---

## Contact & Support

- **GitHub**: https://github.com/Ojasritu/wellness
- **Email**: ojasrituwellness@gmail.com
- **OpenAI Docs**: https://platform.openai.com/docs
- **Django Docs**: https://docs.djangoproject.com

---

**Last Updated**: December 10, 2025  
**Status**: ✅ Production Ready  
**GPT-4o Mini**: ✅ Enabled
