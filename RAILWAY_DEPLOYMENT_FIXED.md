# 🚀 RAILWAY DEPLOYMENT - COMPLETE GUIDE

## ✅ ALL FIXES APPLIED (December 19, 2025)

### 🔧 Changes Made

#### 1. **requirements.txt** - Fixed Dependencies
- ✅ Removed duplicate entries
- ✅ Added version constraints for stability
- ✅ All required packages present: Django, gunicorn, whitenoise, psycopg2-binary, etc.

#### 2. **settings.py** - Production Configuration
- ✅ **DEBUG**: Automatically False in production (detects Railway environment)
- ✅ **ALLOWED_HOSTS**: Includes ojasritu.co.in, www.ojasritu.co.in, wellness-project-2-production.up.railway.app, *.railway.app
- ✅ **Static Files**: Fixed STATICFILES_DIRS to handle non-existent directories
- ✅ **CORS & CSRF**: Updated to include Railway domain
- ✅ **Security**: SSL redirect, HSTS, secure cookies enabled for production
- ✅ **Database**: Uses Railway Postgres via DATABASE_URL (dj-database-url)
- ✅ **Frontend Build**: Automatically includes frontend/dist if built

#### 3. **Static Files** - Fixed Collection
- ✅ collectstatic runs successfully
- ✅ WhiteNoise properly configured
- ✅ Frontend build integration working

#### 4. **Django Sites Framework** - Domain Fixed
- ✅ Created `update_site_domain.py` script
- ✅ Integrated into `entrypoint.sh` - runs automatically on deploy
- ✅ Sets site domain to ojasritu.co.in
- ✅ Fixes Google OAuth redirect URLs

#### 5. **Railway Configuration** - Verified
- ✅ Dockerfile: Multi-stage build (frontend + backend)
- ✅ entrypoint.sh: Runs migrations → update site → collectstatic → gunicorn
- ✅ Procfile: Backup configuration for other platforms
- ✅ railway.toml: Documentation present

---

## 🎯 DEPLOYMENT STEPS FOR RAILWAY

### Step 1: Ensure Railway Service is Connected
1. Go to Railway dashboard: https://railway.app
2. Select your project
3. Verify the service is connected to the GitHub repository
4. Ensure it's connected to **main** branch (or **ojasritu** branch)

### Step 2: Verify Environment Variables
Required environment variables on Railway:

```bash
# Required
SECRET_KEY=<your-secret-key>
DATABASE_URL=<auto-set-by-railway-postgres>

# Optional but Recommended
OPENAI_API_KEY=<your-openai-key>
GOOGLE_CLIENT_ID=<your-google-oauth-client-id>
GOOGLE_CLIENT_SECRET=<your-google-oauth-secret>
RAZORPAY_KEY_ID=<your-razorpay-key>
RAZORPAY_KEY_SECRET=<your-razorpay-secret>

# Override only if needed (defaults are good)
DEBUG=False
ALLOWED_HOSTS=ojasritu.co.in,www.ojasritu.co.in,wellness-project-2-production.up.railway.app
```

### Step 3: Ensure Postgres Plugin is Attached
1. In Railway dashboard, click "+ New" → "Database" → "Add PostgreSQL"
2. Railway will automatically set DATABASE_URL environment variable
3. The application will detect and use it automatically

### Step 4: Check Domain Configuration
1. Go to Settings → Domains in your Railway service
2. Verify **wellness-project-2-production.up.railway.app** is the generated domain
3. Add custom domain: **ojasritu.co.in**
4. Add another custom domain: **www.ojasritu.co.in**

### Step 5: DNS Configuration (GoDaddy)
Update your DNS records at GoDaddy:

```
Type    Name    Value                                          TTL
A       @       <Railway-IP-from-dashboard>                    600
CNAME   www     wellness-project-2-production.up.railway.app   600
```

**To find Railway IP:**
- Railway Dashboard → Service → Settings → Domains → Click domain → Copy IP address
- OR use: `dig wellness-project-2-production.up.railway.app +short`

### Step 6: Trigger Redeployment
**Option A: Via Railway Dashboard**
1. Go to Deployments tab
2. Click "Deploy" → "Redeploy"

**Option B: Push to Trigger Auto-Deploy**
```bash
# Already done - latest commit pushed to main branch
git log -1  # Verify: "Fix Railway deployment..."
```

**Option C: Via Railway CLI**
```bash
railway up
```

### Step 7: Monitor Deployment
1. Watch build logs in Railway dashboard
2. Look for these success messages:
   ```
   ===> Running migrations
   ===> Updating Django Site domain
   ✓ Site updated: ojasritu.co.in (Ojasritu Wellness)
   ===> Collecting static files
   169 static files copied to '/app/staticfiles'
   ===> Starting Gunicorn on 0.0.0.0:8080
   ```

### Step 8: Verify Deployment
**Test Railway URL:**
```bash
curl -I https://wellness-project-2-production.up.railway.app
# Should return: HTTP/2 200 (not 400)
```

**Test Custom Domain:**
```bash
curl -I https://ojasritu.co.in
# Should return: HTTP/2 200
```

**Test in Browser:**
1. Open https://wellness-project-2-production.up.railway.app
2. Should see the NEW site (not old admin panel)
3. Open https://ojasritu.co.in
4. Should see the SAME new site
5. Check admin: https://ojasritu.co.in/admin
6. Verify static files load (CSS/JS)

---

## 🐛 TROUBLESHOOTING

### Issue 1: "Bad Request (400)"
**Cause**: Domain not in ALLOWED_HOSTS

**Fix**: Already fixed in settings.py. If still occurring:
1. Check Railway env vars - ensure ALLOWED_HOSTS includes your domain
2. Redeploy to pick up new settings

### Issue 2: Old Site Showing on ojasritu.co.in
**Causes**:
1. Domain attached to wrong Railway service
2. DNS not updated
3. Browser cache

**Fixes**:
1. **Check Railway Services**: 
   - List all services in your Railway project
   - Ensure ojasritu.co.in is ONLY attached to the correct service
   - Remove from old/unused services
2. **Verify DNS**: 
   ```bash
   dig ojasritu.co.in +short
   # Should point to Railway IP or CNAME
   ```
3. **Clear Cache**: Open in incognito/private window

### Issue 3: Static Files Not Loading
**Cause**: collectstatic not running or WhiteNoise misconfigured

**Fix**: Already fixed. Verify in deployment logs that collectstatic runs successfully.

### Issue 4: Google OAuth Broken
**Cause**: Django Sites domain mismatch

**Fix**: Already fixed with `update_site_domain.py`. 

Manual fix if needed:
```bash
railway run python manage.py shell
>>> from django.contrib.sites.models import Site
>>> site = Site.objects.get(id=1)
>>> site.domain = 'ojasritu.co.in'
>>> site.name = 'Ojasritu Wellness'
>>> site.save()
>>> exit()
```

### Issue 5: Database Migrations Fail
**Cause**: DATABASE_URL not set or Postgres not attached

**Fix**:
1. Ensure Postgres plugin is added to Railway project
2. Check environment variables - DATABASE_URL should be auto-set
3. Redeploy

---

## 🔍 VERIFICATION CHECKLIST

After deployment, verify:

- [ ] Railway URL loads without 400 error
- [ ] ojasritu.co.in loads the new site (not old admin)
- [ ] www.ojasritu.co.in redirects or loads correctly
- [ ] Admin panel accessible at /admin
- [ ] Static files (CSS/JS/images) load correctly
- [ ] Google OAuth login works
- [ ] Vaidya AI chatbot works
- [ ] Product pages load
- [ ] Cart functionality works
- [ ] No console errors in browser

---

## 📊 DEPLOYMENT ARCHITECTURE

```
GitHub Repo (main branch)
    ↓ (auto-deploy on push)
Railway Service
    ↓ (Dockerfile multi-stage build)
1. Build frontend (Node.js) → /app/frontend/dist
2. Install Python deps (requirements.txt)
3. Copy app + frontend build to /app
4. Run collectstatic
    ↓ (entrypoint.sh on container start)
5. Run migrations
6. Update Django Site domain
7. Collectstatic again (for safety)
8. Start Gunicorn on PORT 8080
    ↓
Railway Proxy (handles SSL)
    ↓
Custom Domain: ojasritu.co.in
```

---

## 🎉 SUCCESS CRITERIA

Deployment is successful when:

1. ✅ Railway URL returns HTTP 200 (not 400)
2. ✅ ojasritu.co.in shows the NEW site
3. ✅ Static files load from WhiteNoise
4. ✅ Admin panel is NEW (not old)
5. ✅ Google OAuth works
6. ✅ Database is PostgreSQL (not SQLite)
7. ✅ DEBUG=False in production
8. ✅ No security warnings

---

## 📝 NOTES

- **Automatic Site Domain Update**: The `update_site_domain.py` script runs automatically on every deploy via `entrypoint.sh`
- **Zero Downtime**: Railway handles rolling deployments automatically
- **Logs**: View real-time logs in Railway dashboard under "Deployments"
- **Rollback**: If deployment fails, Railway keeps previous version running
- **Health Checks**: Railway automatically monitors your app

---

## 🔐 SECURITY NOTES

Production settings enabled:
- DEBUG = False
- SECURE_SSL_REDIRECT = True
- SECURE_HSTS enabled with 1 year max age
- Secure cookies (CSRF + Session)
- WhiteNoise compressed static files
- CSP disabled (was blocking resources - can be re-enabled with proper config)

---

## 📞 SUPPORT

If deployment still fails after following this guide:

1. Check Railway deployment logs for specific errors
2. Verify all environment variables are set correctly
3. Ensure Postgres plugin is attached
4. Check GitHub repository has latest commits
5. Try manual redeploy from Railway dashboard

---

**Last Updated**: December 19, 2025
**Status**: ✅ All fixes applied and committed to main/ojasritu branches
**Ready for Deployment**: YES
