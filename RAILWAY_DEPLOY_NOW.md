# ✅ Railway Connection Complete - Next Steps

## 🎉 Status: CONNECTED!

You are now successfully connected to Railway!

**Current Configuration:**
- ✅ Railway CLI installed
- ✅ Logged in as: `ojasrituwellness@gmail.com`
- ✅ Project linked: `wellness project 2`
- ✅ Environment: `production`
- ✅ Domain configured: `www.ojasritu.co.in`

---

## 🚀 Deploy in 5 Steps

### Step 1: Set Environment Variables

Run the setup script:
```bash
./setup_railway_vars.sh
```

This will prompt you to enter:
- **SECRET_KEY** (auto-generated if you skip)
- **OPENAI_API_KEY** (required for Vaidya AI)
- Payment keys (optional)
- Google OAuth keys (optional)

**Or set manually:**
```bash
# Generate Django secret key
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'

# Then set it
railway variables set SECRET_KEY="your-generated-secret-key"
railway variables set OPENAI_API_KEY="your-openai-key"
railway variables set DEBUG="False"
```

### Step 2: Add PostgreSQL Database

```bash
railway add
```

Choose: `Postgres` from the list

**Or via Dashboard:**
1. Open: https://railway.app/dashboard
2. Select "wellness project 2"
3. Click "New Service"
4. Select "Database"
5. Choose "PostgreSQL"

### Step 3: Deploy Your Code

```bash
railway up
```

This will:
- Upload your code
- Build the Docker container
- Deploy to production
- Use your Dockerfile and Procfile

### Step 4: Run Database Migrations

```bash
railway run python manage.py migrate
```

### Step 5: Create Admin User

```bash
railway run python create_superuser_script.py
```

Or manually:
```bash
railway run python manage.py createsuperuser
```

---

## 🌐 Access Your Site

After deployment:

- **Main Site:** https://www.ojasritu.co.in
- **Admin Panel:** https://www.ojasritu.co.in/admin
- **API:** https://www.ojasritu.co.in/api
- **Health Check:** https://www.ojasritu.co.in/health

---

## 🔍 Monitoring & Management

### View Logs
```bash
railway logs
```

### View Live Logs
```bash
railway logs --follow
```

### Check Deployment Status
```bash
railway status
```

### Open Railway Dashboard
```bash
railway open
```

### View All Variables
```bash
railway variables
```

### Redeploy After Changes
```bash
# After making code changes
git add .
git commit -m "Update code"
railway up
```

---

## 📋 Pre-Flight Checklist

Before going live, ensure:

- [ ] Environment variables set
- [ ] PostgreSQL database added
- [ ] Code deployed successfully
- [ ] Database migrations run
- [ ] Superuser created
- [ ] Static files collected (automatic via Procfile)
- [ ] Site accessible at www.ojasritu.co.in
- [ ] Admin panel accessible
- [ ] Vaidya AI chatbot working
- [ ] SSL certificate active (automatic)

---

## 🔧 Quick Commands Reference

```bash
# Login to Railway
railway login

# Link project (if needed)
railway link

# View project info
railway status

# Set environment variable
railway variables set KEY=value

# Add database
railway add

# Deploy code
railway up

# Run Django commands
railway run python manage.py <command>

# View logs
railway logs

# Open dashboard
railway open

# SSH into container
railway shell

# View domain
railway domain
```

---

## 🌐 GoDaddy DNS Configuration

Your domain `www.ojasritu.co.in` is already configured in Railway!

To verify DNS is correct:

1. Go to: https://railway.app/dashboard
2. Select "wellness project 2"
3. Click "Settings" → "Domains"
4. Check the DNS records shown

Make sure GoDaddy has:
- **Type:** CNAME
- **Name:** www
- **Value:** (as shown in Railway dashboard)
- **TTL:** 600

---

## 🎯 Expected Deployment Time

- Environment setup: 5 minutes
- Initial deployment: 5-10 minutes
- Database migrations: 1 minute
- Total: ~15 minutes

---

## 📞 Troubleshooting

### Issue: Deployment fails

```bash
# Check logs
railway logs --build

# Common fix: ensure requirements.txt is complete
pip freeze > requirements.txt
railway up
```

### Issue: Database connection error

```bash
# Verify DATABASE_URL is set
railway variables | grep DATABASE

# If missing, add PostgreSQL
railway add
```

### Issue: Static files not loading

```bash
# Procfile already handles this, but you can run manually
railway run python manage.py collectstatic --no-input
```

### Issue: 502 Bad Gateway

- Wait 2-3 minutes for full deployment
- Check logs: `railway logs`
- Verify PORT is used in Procfile (already configured)

---

## 📚 Documentation

- **Railway Docs:** https://docs.railway.app
- **Your Project Dashboard:** https://railway.app/project/d6cdf51e-501f-4b31-9a01-71f6748f1ca8
- **Railway Guide:** See `RAILWAY_CONNECT_GUIDE.md`
- **Deployment Scripts:** See `deploy-railway.sh`

---

## ✨ What's Configured

Your project has:

✅ **Backend:**
- Django with PostgreSQL support
- WhiteNoise for static files
- Gunicorn production server
- CORS configured
- CSRF protection
- SSL/HTTPS ready

✅ **Frontend:**
- React with Vite
- Beautiful chatbot with "Chat Us" button
- Lower-left corner positioning
- Responsive design

✅ **Features:**
- Vaidya AI chatbot (GPT-4o Mini)
- Product catalog
- Shopping cart
- User authentication
- Google OAuth ready
- Payment gateway ready (Razorpay/Stripe)

✅ **DevOps:**
- Dockerfile for containerization
- Procfile for Railway
- Environment-based configuration
- Health check endpoint

---

## 🎉 You're Ready!

Start with:
```bash
./setup_railway_vars.sh
```

Then deploy:
```bash
railway up
```

**Your site will be live at:** https://www.ojasritu.co.in 🚀

---

**Last Updated:** December 18, 2025
**Status:** ✅ Ready to Deploy
