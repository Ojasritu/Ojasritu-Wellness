# 🚀 Railway Deployment Guide - Ojasritu Wellness

## ✅ Pre-Deployment Checklist

Your project is **READY** for Railway deployment! All configurations are in place:

- ✅ Railway CLI installed (v4.15.1)
- ✅ `railway.json` configured
- ✅ `railway.toml` configured
- ✅ `Procfile` ready
- ✅ `Dockerfile` available
- ✅ `requirements.txt` complete
- ✅ Django settings configured for Railway
- ✅ Static files setup with WhiteNoise
- ✅ Database ready for PostgreSQL

---

## 🎯 Quick Deploy (3 Steps)

### Step 1: Login to Railway

```bash
railway login
```

This will open your browser. Sign in with:
- GitHub (recommended)
- Email

### Step 2: Initialize Project

```bash
railway init
```

Choose:
- "Create new project" 
- Name it: `wellness-ojasritu`
- Link to your current directory

### Step 3: Deploy

```bash
railway up
```

That's it! Railway will:
- Build your Docker image
- Deploy your app
- Give you a URL like: `wellness-ojasritu.up.railway.app`

---

## 🔧 Complete Setup (For Production)

### 1. Add PostgreSQL Database

```bash
railway add --database postgres
```

Or via Railway Dashboard:
- Go to: https://railway.app/dashboard
- Select your project
- Click "New Service" → "Database" → "PostgreSQL"

### 2. Set Environment Variables

```bash
# Required variables
railway variables set SECRET_KEY="your-secret-key-here"
railway variables set DEBUG="False"
railway variables set OPENAI_API_KEY="your-openai-key"

# Optional (for payments)
railway variables set RAZORPAY_KEY_ID="your-razorpay-key"
railway variables set RAZORPAY_KEY_SECRET="your-razorpay-secret"

# Optional (for Google OAuth)
railway variables set GOOGLE_CLIENT_ID="your-google-client-id"
railway variables set GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

Or set via Dashboard:
- Go to your project → "Variables"
- Add each variable with its value

### 3. Update ALLOWED_HOSTS

After deployment, get your Railway URL:

```bash
railway domain
```

Then add it to your settings. Railway automatically sets `RAILWAY_PUBLIC_DOMAIN`.

### 4. Run Migrations

```bash
railway run python manage.py migrate
```

### 5. Create Superuser

```bash
railway run python manage.py createsuperuser
```

Or use your existing script:

```bash
railway run python create_superuser_script.py
```

### 6. Collect Static Files

```bash
railway run python manage.py collectstatic --no-input
```

---

## 🌐 Connect Custom Domain (GoDaddy)

### Step 1: Add Domain in Railway

```bash
railway domain add ojasritu.co.in
railway domain add www.ojasritu.co.in
```

Or via Dashboard:
- Go to project → "Settings" → "Domains"
- Click "Add Domain"
- Enter: `ojasritu.co.in`
- Repeat for `www.ojasritu.co.in`

### Step 2: Get Railway DNS Records

Railway will show you:
- **CNAME** record to add in GoDaddy

Example:
```
Type: CNAME
Name: @ (or www)
Value: your-app.up.railway.app
```

### Step 3: Update GoDaddy DNS

1. Login to GoDaddy: https://dcc.godaddy.com
2. Go to: "My Products" → "DNS" for ojasritu.co.in
3. Add CNAME records as shown by Railway
4. Wait 5-60 minutes for DNS propagation

### Step 4: Update Django Settings

Add your domain to ALLOWED_HOSTS:

```python
ALLOWED_HOSTS = [
    "localhost",
    "127.0.0.1",
    ".railway.app",
    "ojasritu.co.in",
    "www.ojasritu.co.in",
]

CSRF_TRUSTED_ORIGINS = [
    "https://ojasritu.co.in",
    "https://www.ojasritu.co.in",
    "https://*.railway.app",
]

CORS_ALLOWED_ORIGINS = [
    "https://ojasritu.co.in",
    "https://www.ojasritu.co.in",
]
```

Then redeploy:

```bash
railway up
```

---

## 📋 Useful Railway Commands

```bash
# Check deployment status
railway status

# View logs
railway logs

# Open project in browser
railway open

# Open Railway dashboard
railway dashboard

# List all variables
railway variables

# Connect to database
railway connect postgres

# Run Django commands
railway run python manage.py <command>

# SSH into container
railway shell
```

---

## 🔍 Troubleshooting

### Issue: Build fails

**Solution:**
```bash
# Check logs
railway logs --build

# Ensure all dependencies in requirements.txt
# Verify Dockerfile is correct
```

### Issue: Database connection error

**Solution:**
```bash
# Ensure PostgreSQL is added
railway add --database postgres

# Check DATABASE_URL is set
railway variables | grep DATABASE_URL

# Run migrations
railway run python manage.py migrate
```

### Issue: Static files not loading

**Solution:**
```bash
# Collect static files
railway run python manage.py collectstatic --no-input

# Check STATIC_ROOT in settings.py
# Ensure WhiteNoise is in MIDDLEWARE
```

### Issue: 502 Bad Gateway

**Solution:**
- Check if app is listening on correct PORT
- Railway sets PORT environment variable
- Verify Procfile uses: `0.0.0.0:$PORT`

---

## 🎉 Expected Results

After successful deployment:

1. **Railway URL:** `https://wellness-ojasritu.up.railway.app`
2. **Custom Domain:** `https://ojasritu.co.in`
3. **Admin Panel:** `https://ojasritu.co.in/admin`
4. **Frontend:** `https://ojasritu.co.in`
5. **API:** `https://ojasritu.co.in/api`
6. **Chatbot:** GPT-4o Mini integrated and working
7. **SSL:** Automatic HTTPS (Railway provides free SSL)

---

## 📞 Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Your deployment is ready! Just run `railway login` to start.

---

**Created:** December 18, 2025
**Status:** ✅ Ready to Deploy
**Estimated Time:** 15 minutes for first deployment
