# Railway Deployment - Ojasritu Wellness

## New Railway Project Details

- **Project Name**: ojasritu-wellness
- **Public Domain**: `ojasritu-wellness-new.up.railway.app`
- **Repository**: https://github.com/Ojasritu/Ojasritu-Wellness
- **Current Branch**: ojasritu

## Automatic Deployment Steps

### Step 1: Link GitHub Repository to Railway

```bash
# 1. Go to: https://railway.app/dashboard
# 2. Create new project
# 3. Select "Deploy from GitHub repo"
# 4. Authorize Ojasritu/Ojasritu-Wellness
# 5. Select branch: ojasritu
```

### Step 2: Add PostgreSQL Database

```bash
# In Railway Dashboard:
# 1. Click "+ New" on your project
# 2. Select "Database" → "Add PostgreSQL"
# 3. Railway will auto-generate DATABASE_URL
```

### Step 3: Configure Environment Variables

Set these in Railway Dashboard (Settings → Variables):

```
SECRET_KEY=<generate-secure-key>
DEBUG=False
ALLOWED_HOSTS=ojasritu.co.in,www.ojasritu.co.in,ojasritu-wellness-new.up.railway.app
OPENAI_API_KEY=<your-openai-key>
GOOGLE_CLIENT_ID=<google-oauth-id>
GOOGLE_CLIENT_SECRET=<google-oauth-secret>
RAZORPAY_KEY_ID=<razorpay-id>
RAZORPAY_KEY_SECRET=<razorpay-secret>
STRIPE_PUBLISHABLE_KEY=<stripe-pk>
STRIPE_SECRET_KEY=<stripe-sk>
```

**Note**: `DATABASE_URL` will be set automatically by Railway Postgres plugin.

### Step 4: Deploy

```bash
# Push to ojasritu branch to trigger auto-deploy
git push origin ojasritu
```

Railway will:
1. Build the Docker image (uses Dockerfile in repo)
2. Run migrations via entrypoint.sh: `python manage.py migrate`
3. Collect static files: `python manage.py collectstatic --noinput`
4. Start Gunicorn server

### Step 5: Verify Deployment

```bash
# Check app is running
curl -I https://ojasritu-wellness-new.up.railway.app

# Check logs
railway logs --service web

# Test API
curl https://ojasritu-wellness-new.up.railway.app/api/products/
```

## Useful Railway CLI Commands

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to project
railway link

# View environment variables
railway variables

# Set a variable
railway variables set SECRET_KEY "your-key" --service web

# View logs
railway logs --service web

# Run migrations on Railway
railway run python manage.py migrate

# Open Railway dashboard
railway open
```

## DNS Configuration (if using ojasritu.co.in)

Add to your GoDaddy DNS:

```
A record:   @  →  Railway IP (from dashboard)
CNAME:      www  →  ojasritu-wellness-new.up.railway.app
```

Or use Railway's managed domain feature.

## Troubleshooting

### Error: "Domain not in ALLOWED_HOSTS"
- Update ALLOWED_HOSTS in Railway variables
- Redeploy: `git push origin ojasritu`

### Error: "Database connection refused"
- Ensure Postgres plugin is added to Railway project
- Check DATABASE_URL is set: `railway variables | grep DATABASE_URL`
- Restart the web service

### Error: "Port 8000 already in use"
- Railway automatically finds available port
- Check entrypoint.sh uses PORT env var (it does)

### App shows 404 on root path
- Root path serves Django templates (correct)
- API available at `/api/`
- Admin at `/admin/`

## Current Status

✅ Code updated with new domain: `ojasritu-wellness-new.up.railway.app`
✅ Docker multi-stage build ready (Dockerfile)
✅ Migrations configured in entrypoint.sh
✅ Static files served by WhiteNoise
✅ CORS/CSRF configured for production
✅ Environment variables documented

**Next**: Create Railway project, add Postgres, set env vars, and deploy!

---

**Quick Start Command**:
```bash
# From your local machine after Railway setup:
git push origin ojasritu
# Railway automatically deploys via GitHub webhook
```
