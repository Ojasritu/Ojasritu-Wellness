# 🚀 RAILWAY DEPLOYMENT & GODADDY DOMAIN SETUP - COMPLETE GUIDE

## ✅ DEPLOYMENT STATUS CHECK

### Current Files:
- ✅ `Procfile` exists (Heroku/Railway compatible)
- ✅ `runtime.txt` exists (Python 3.11)
- ✅ `requirements.txt` updated (GPT-4o Mini)
- ✅ Code is production-ready

### What We'll Do Now:
1. ✅ Create Railway.json configuration
2. ✅ Setup Railway deployment
3. ✅ Connect GoDaddy domain
4. ✅ Configure DNS records
5. ✅ Enable SSL/HTTPS
6. ✅ Verify everything working

---

## 🚂 RAILWAY DEPLOYMENT (Complete Step-by-Step)

### Step 1: Create Railway Account

1. Go to: https://railway.app
2. Sign up with GitHub account (recommended)
3. Click "Create a new project"

### Step 2: Connect GitHub Repository

1. Click "Deploy from GitHub"
2. Authorize Railway to access your GitHub
3. Select repository: `Ojasritu/wellness`
4. Select branch: `main`
5. Click "Deploy"

Railway will start deploying automatically! ✅

### Step 3: Set Environment Variables

Go to your Railway project → Settings → Environment

Add these variables:

```
OPENAI_API_KEY=sk-your-actual-key
SECRET_KEY=your-django-secret-key-here
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com,your-railway-app.railway.app
DATABASE_URL=postgresql://...  (Railway auto-provides this)
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
DJANGO_SUPERUSER_USERNAME=admin
DJANGO_SUPERUSER_EMAIL=ojasrituwellness@gmail.com
DJANGO_SUPERUSER_PASSWORD=secure-password
```

### Step 4: Setup Database

Railway PostgreSQL is automatic! ✅

1. Go to: Railway Project → Settings
2. Look for "PostgreSQL" add-on
3. If not there: Click "Add Service" → "PostgreSQL"
4. Railway will create DATABASE_URL automatically

### Step 5: Run Migrations

1. Go to Railway: Project → Deployments
2. Find your latest deployment
3. Click on it → "Logs"
4. Click on "Variables" tab → Add run command

Or run via Railway CLI:

```bash
railway run python manage.py migrate
railway run python manage.py createsuperuser
railway run python manage.py collectstatic --noinput
```

### Step 6: Get Your Railway URL

1. Go to Railway: Project → Settings
2. Find "Public URL" section
3. Copy your app URL: `https://your-app-name.railway.app`

**Your app is LIVE! ✅**

---

## 🌐 GODADDY DOMAIN CONNECTION (Complete Step-by-Step)

### Step 1: Login to GoDaddy

1. Go to: https://godaddy.com
2. Login to your account
3. Go to "My Products"
4. Find your domain: `yourdomain.com`

### Step 2: Change DNS Records

1. Click on your domain
2. Go to "DNS" section
3. Look for "Manage DNS"
4. Find or add CNAME record:

**Option A: For Railway**
```
Type: CNAME
Name: (leave blank or enter "www")
Value: your-app-name.railway.app
TTL: 3600 (default)
```

**Option B: For A Record (Advanced)**
```
Type: A
Name: @
Value: Railway IP address
TTL: 3600
```

### Step 3: Wait for DNS Propagation

DNS can take 24-48 hours to fully propagate.

**Check Status:**
```bash
# Check DNS propagation
nslookup yourdomain.com
dig yourdomain.com

# Or use online tools:
https://www.whatsmydns.net/
```

### Step 4: Update Django Settings

Edit `wellness_project/settings.py`:

```python
# Add your domain to ALLOWED_HOSTS
ALLOWED_HOSTS = [
    'yourdomain.com',
    'www.yourdomain.com',
    'your-app-name.railway.app'
]

# Enable HTTPS (CRITICAL!)
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# CORS Settings
CORS_ALLOWED_ORIGINS = [
    'https://yourdomain.com',
    'https://www.yourdomain.com'
]
```

### Step 5: Deploy Changes

```bash
git add wellness_project/settings.py
git commit -m "Configure custom domain for Railway"
git push origin main
```

Railway will auto-deploy! ✅

### Step 6: Enable SSL Certificate

Railway automatically provides SSL! ✅

1. Go to Railway: Project → Settings
2. Look for "SSL" section
3. Should show "Valid SSL Certificate"
4. Your domain will have HTTPS automatically

---

## ✅ COMPLETE CHECKLIST

### Railway Deployment:
- [ ] Railway account created
- [ ] GitHub repository connected
- [ ] Code deployed successfully
- [ ] PostgreSQL database connected
- [ ] Environment variables set
- [ ] Migrations run
- [ ] Superuser created
- [ ] App accessible at Railway URL

### GoDaddy Domain:
- [ ] Domain registered
- [ ] DNS records updated (CNAME)
- [ ] Waiting for DNS propagation (24-48 hrs)
- [ ] Django ALLOWED_HOSTS updated
- [ ] Settings.py configured
- [ ] Changes committed and pushed
- [ ] SSL certificate active

### Testing:
- [ ] Visit https://yourdomain.com
- [ ] Admin panel works: https://yourdomain.com/admin
- [ ] Chatbot API responds
- [ ] Database has data

---

## 🔍 TROUBLESHOOTING

### Issue: Domain not resolving

```bash
# Check DNS propagation
nslookup yourdomain.com
# Should show: yourdomain.com -> your-app-name.railway.app

# Check GoDaddy DNS settings
# Make sure CNAME is correct
```

**Solution:**
1. Wait 24-48 hours for propagation
2. Clear browser cache: Ctrl+Shift+Delete
3. Try incognito window
4. Verify CNAME in GoDaddy is correct

### Issue: SSL Certificate error

**Solution:**
1. Check Railway has certificate active
2. Wait for certificate generation (usually automatic)
3. Ensure SECURE_SSL_REDIRECT=True in settings.py
4. Clear CloudFlare cache if using

### Issue: Admin panel not working

```bash
# SSH into Railway and check
railway run python manage.py shell
>>> from django.contrib.auth.models import User
>>> User.objects.all()
```

**Solution:**
1. Ensure migrations ran
2. Create superuser if missing
3. Check ALLOWED_HOSTS includes your domain

### Issue: Database connection error

**Solution:**
1. Check DATABASE_URL in Railway environment
2. Ensure PostgreSQL add-on is enabled
3. Run: `railway run python manage.py migrate`
4. Check logs: Railway → Deployments → Logs

---

## 📊 RAILWAY vs HEROKU

| Feature | Railway | Heroku |
|---------|---------|--------|
| Cost | $5/month | $7-9/month |
| Setup | 5 minutes | 10 minutes |
| Auto-deploy | Yes (from GitHub) | Yes |
| Database | PostgreSQL included | Add-on ($9) |
| Domain | Easy CNAME | Easy CNAME |
| Uptime | 99.9% | 99.9% |
| Support | Good | Excellent |

**Railway is recommended!** ✅

---

## 💰 MONTHLY COSTS

### Railway Setup:
| Component | Cost |
|-----------|------|
| Railway app | $5 |
| PostgreSQL | Free (included) |
| Domain | $1 (yearly avg) |
| OpenAI API | $0.50 |
| **TOTAL** | **~$6.50/month** |

**Very affordable! ✅**

---

## 🚀 COMMANDS QUICK REFERENCE

### Deploy to Railway:

```bash
# Ensure code is clean
git add .
git commit -m "Deploy to Railway with custom domain"
git push origin main
# Railway auto-deploys!

# Run migrations
railway run python manage.py migrate

# Create superuser
railway run python manage.py createsuperuser

# Collect static files
railway run python manage.py collectstatic --noinput

# Check logs
railway logs

# SSH into Railway
railway shell
```

### GoDaddy DNS Configuration:

```
Type: CNAME
Name: www (or leave blank)
Value: your-railway-app.railway.app
TTL: 3600
```

Then:
```
Type: CNAME
Name: @ (or root)
Value: your-railway-app.railway.app
TTL: 3600
```

---

## 📈 MONITORING

### Check App Status:

```bash
# Railway CLI
railway status
railway logs --tail

# Browser
https://yourdomain.com/admin  # Should work
https://yourdomain.com/api/chat/  # Test API
```

### Database Health:

```bash
railway run python manage.py dbshell
# Check database connection
```

---

## 🔐 SECURITY CHECKLIST

- [ ] SECRET_KEY is unique (50+ chars)
- [ ] DEBUG=False in production
- [ ] OPENAI_API_KEY in environment only
- [ ] STRIPE keys in environment only
- [ ] ALLOWED_HOSTS configured correctly
- [ ] HTTPS enabled (SECURE_SSL_REDIRECT=True)
- [ ] Database backups enabled
- [ ] Monitoring logs enabled
- [ ] CORS properly configured

---

## 📞 SUPPORT

### Railway:
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway
- Status: https://status.railway.app

### GoDaddy:
- Support: https://www.godaddy.com/help
- DNS Help: https://www.godaddy.com/help/manage-dns-records-680

### Django:
- Docs: https://docs.djangoproject.com
- Deployment: https://docs.djangoproject.com/en/stable/howto/deployment/

---

## ✨ FINAL STATUS

### Deployment:
✅ Railway ready for deployment
✅ Procfile configured
✅ Database auto-managed
✅ Environment variables documented

### Domain:
✅ GoDaddy DNS setup instructions provided
✅ Django settings prepared
✅ SSL/HTTPS ready
✅ CNAME configuration clear

### Next Steps:
1. Sign up for Railway
2. Connect GitHub
3. Set environment variables
4. Update GoDaddy DNS
5. Wait for DNS propagation
6. Access: https://yourdomain.com ✅

---

**Ready to deploy! 🚀**

Date: December 10, 2025
Status: ✅ COMPLETE & DOCUMENTED
