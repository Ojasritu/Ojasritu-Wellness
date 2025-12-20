# Railway Setup Checklist - ojasritu-wellness

## Project Created ✅
- Domain: `ojasritu-wellness-new.up.railway.app`
- Repository: Ojasritu/Ojasritu-Wellness (branch: ojasritu)

## Pre-Deployment Checklist

### ☐ Step 1: Create Railway Project
- [ ] Go to https://railway.app/dashboard
- [ ] Click "New Project"
- [ ] Select "Deploy from GitHub"
- [ ] Select: Ojasritu/Ojasritu-Wellness
- [ ] Select branch: `ojasritu`
- [ ] Railway will auto-detect Dockerfile and start build

### ☐ Step 2: Add PostgreSQL Database
- [ ] In your Railway project, click "+ New"
- [ ] Select "Database" → "Add PostgreSQL"
- [ ] Wait for provisioning (30-60 seconds)
- [ ] Railway auto-sets DATABASE_URL environment variable

### ☐ Step 3: Set Environment Variables
Go to your project → Settings → Variables, add:

| Variable | Value | Required |
|----------|-------|----------|
| `SECRET_KEY` | (Generate at https://djecrety.ir/) | Yes |
| `DEBUG` | `False` | Yes |
| `ALLOWED_HOSTS` | `ojasritu.co.in,www.ojasritu.co.in,ojasritu-wellness-new.up.railway.app` | Yes |
| `OPENAI_API_KEY` | Your OpenAI key | Yes (for chatbot) |
| `GOOGLE_CLIENT_ID` | From Google Cloud Console | No |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud Console | No |
| `RAZORPAY_KEY_ID` | From Razorpay Dashboard | No |
| `RAZORPAY_KEY_SECRET` | From Razorpay Dashboard | No |
| `STRIPE_PUBLISHABLE_KEY` | From Stripe Dashboard | No |
| `STRIPE_SECRET_KEY` | From Stripe Dashboard | No |

**DATABASE_URL** will be auto-set by Railway Postgres. You do NOT need to set it manually.

### ☐ Step 4: Deploy
Simply push code to trigger auto-deployment:
```bash
git push origin ojasritu
```

Monitor logs in Railway dashboard → Logs tab

### ☐ Step 5: Verify Deployment

Test if deployment successful:
```bash
# Check app is responding
curl -I https://ojasritu-wellness-new.up.railway.app

# Test API
curl https://ojasritu-wellness-new.up.railway.app/api/products/

# Access admin
https://ojasritu-wellness-new.up.railway.app/admin/
```

### ☐ Step 6: Create Superuser (if needed)
```bash
railway run python manage.py createsuperuser
```

### ☐ Step 7: Configure Custom Domain (Optional)
If using ojasritu.co.in:
1. Go to Railway Project Settings → Domains
2. Add custom domain: `ojasritu.co.in`
3. Follow DNS setup instructions provided by Railway
4. GoDaddy: Point A/CNAME records to Railway

## Deployment Trigger Options

### Option A: Automatic (Recommended)
Simply push to ojasritu branch:
```bash
git push origin ojasritu
```

### Option B: Manual via Railway Dashboard
1. Go to Deployments tab
2. Click "Deploy"
3. Select latest commit

### Option C: Redeploy via CLI
```bash
railway redeploy
```

## What Happens During Deployment

1. **Build Phase**
   - Railway clones repo
   - Builds Docker image (multi-stage: frontend build + backend)
   - Uploads image to Railway registry

2. **Deploy Phase**
   - Starts container with environment variables
   - Runs entrypoint.sh which:
     - Applies migrations: `python manage.py migrate`
     - Collects static files: `python manage.py collectstatic --noinput`
     - Starts Gunicorn: `gunicorn wellness_project.wsgi --workers 4 --bind 0.0.0.0:$PORT`

3. **Health Check**
   - Railway checks if app responds on PORT
   - Takes ~2-3 minutes total

## Files Updated for This Deployment

- ✅ `wellness_project/settings.py` - Updated ALLOWED_HOSTS, CORS, CSRF for new domain
- ✅ `railway.json` - Project metadata
- ✅ `railway.toml` - Configuration hints
- ✅ `Dockerfile` - Multi-stage build (unchanged, works as-is)
- ✅ `entrypoint.sh` - Migration runner (unchanged, works as-is)
- ✅ `start_servers.sh` - Local dev startup script

## Monitoring After Deployment

```bash
# View logs
railway logs --follow --service web

# View environment
railway variables

# Check status
railway status

# SSH into container (if needed)
railway shell
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `DisallowedHost` error | Add domain to ALLOWED_HOSTS variable, redeploy |
| Database connection failed | Ensure Postgres plugin added; check DATABASE_URL |
| Port bind error | Railway handles port assignment; check PORT env var |
| Static files 404 | Run: `railway run python manage.py collectstatic --noinput` |
| Migrations not applied | Check logs: `railway logs --tail 100` |

## Rollback to Previous Version

```bash
# In Railway Deployments tab, click any previous deployment → "Redeploy"
```

---

## Quick Summary

✅ Code ready at: https://github.com/Ojasritu/Ojasritu-Wellness (branch: ojasritu)
✅ Dockerfile ready for containerization
✅ All settings configured for: `ojasritu-wellness-new.up.railway.app`
✅ Environment variables documented above
✅ Ready for Railway deployment

**Next Step**: Follow checklist starting at "Step 1: Create Railway Project" above.
