# Railway PostgreSQL Database Setup Guide

## Step 1: Add PostgreSQL to Your Railway Project

### Option A: Via Railway Dashboard (Recommended)

1. **Go to your Railway project**: https://railway.app/dashboard
2. **Click on your project**: "wellness-project-2-production-ojasritu"
3. **Click "+ New"** button (top right)
4. **Select "Database"** → **"Add PostgreSQL"**
5. Railway will automatically:
   - Create a new PostgreSQL instance
   - Generate a `DATABASE_URL` environment variable
   - Link it to your service

### Option B: Via Railway CLI

```bash
# Install Railway CLI (if not already installed)
npm i -g @railway/cli

# Login to Railway
railway login

# Link to your project
railway link

# Add PostgreSQL
railway add --database postgres
```

## Step 2: Verify DATABASE_URL Environment Variable

1. Go to your **Django service** (not the Postgres service)
2. Click **"Variables"** tab
3. You should see `DATABASE_URL` automatically added
4. Format: `postgresql://user:password@host:port/database`

Example:
```
DATABASE_URL=postgresql://postgres:password@containers-us-west-123.railway.app:5432/railway
```

**Important**: The DATABASE_URL should be automatically linked. If not visible, manually copy it from the Postgres service.

## Step 3: Run Django Migrations to Create Tables

### Method 1: Via Railway CLI (Easiest)

```bash
# From your local project directory
cd /workspaces/Ojasritu-Wellness

# Run migrations on Railway
railway run python manage.py migrate

# Create superuser (optional)
railway run python manage.py createsuperuser
```

### Method 2: Via Deployment Trigger

The migrations run automatically on each deployment via `entrypoint.sh`:

```bash
# Check entrypoint.sh - it already includes:
python manage.py migrate --noinput
python manage.py collectstatic --noinput
```

Just trigger a new deployment:

```bash
git commit --allow-empty -m "Trigger Railway deployment for migrations"
git push origin ojasritu
```

### Method 3: Via Railway Console (Web)

1. Go to Railway dashboard
2. Select your Django service
3. Click **"Deploy"** → **"Run Command"**
4. Enter: `python manage.py migrate`
5. Click "Run"

## Step 4: Verify Tables Were Created

### Check via Railway CLI:

```bash
# Connect to Railway Postgres
railway connect postgres

# List all tables
\dt

# You should see tables like:
# - shop_product
# - shop_category
# - shop_cart
# - shop_order
# - auth_user
# - etc.

# Exit psql
\q
```

### Check via Web:

```bash
# Get database URL from Railway
railway variables

# Connect using psql (if installed locally)
psql "YOUR_DATABASE_URL_HERE"

# Or use a GUI tool like:
# - pgAdmin
# - DBeaver
# - TablePlus
```

## Step 5: Create Initial Data (Optional)

### Create Superuser:

```bash
railway run python manage.py createsuperuser
# Email: ojasrituwellness@gmail.com
# Username: admin
# Password: (your secure password)
```

### Load Demo Data:

```bash
# If you have fixtures or seed scripts
railway run python create_demo.py

# Or use Django management command
railway run python manage.py shell < create_demo.py
```

## Troubleshooting

### Issue: "DATABASE_URL not found"

**Solution**: Restart your Django service after adding Postgres:
1. Go to Railway dashboard
2. Click your Django service
3. Click "Redeploy" button

### Issue: "SSL connection required"

Your settings.py already handles this:
```python
ssl_require=not os.getenv("DATABASE_URL") is None
```

### Issue: "No migrations to apply"

Make sure migrations are committed:
```bash
# Check if migrations exist
ls shop/migrations/

# If missing, create them locally
python manage.py makemigrations
git add shop/migrations/
git commit -m "Add migrations"
git push origin ojasritu
```

### Issue: "psycopg2 not installed"

Your requirements.txt already includes:
```
psycopg2-binary>=2.9.9
```

If needed, add to Railway environment:
```bash
railway run pip install psycopg2-binary
```

## Current Database Models (Tables to be Created)

Based on `shop/models.py`:

1. **shop_category** - Product categories
2. **shop_product** - Products with Ayurveda info
3. **shop_cart** - User shopping carts
4. **shop_cartitem** - Cart items
5. **shop_order** - Customer orders
6. **shop_profile** - User profiles
7. **shop_article** - Blog articles (Wellness Acharyas)
8. **shop_faq** - FAQ entries
9. **shop_contactmessage** - Contact form submissions
10. **auth_user** - Django users
11. **django_session** - Sessions
12. **allauth_** tables - Social auth (Google OAuth)

## Quick Command Reference

```bash
# Check current database
railway run python manage.py showmigrations

# Run migrations
railway run python manage.py migrate

# Create superuser
railway run python manage.py createsuperuser

# Access Django shell
railway run python manage.py shell

# Connect to Postgres directly
railway connect postgres

# View environment variables
railway variables

# Check deployment logs
railway logs
```

## Next Steps After Setup

1. ✅ Verify tables created: `railway run python manage.py showmigrations`
2. ✅ Create superuser: `railway run python manage.py createsuperuser`
3. ✅ Add demo products via Django admin: https://wellness-project-2-production-ojasritu.up.railway.app/admin/
4. ✅ Test API endpoints: https://wellness-project-2-production-ojasritu.up.railway.app/api/
5. ✅ Configure backups in Railway dashboard (Settings → Backups)

## Backup & Restore

### Create Backup:

```bash
# Railway automatically backs up Postgres
# Manual backup:
railway connect postgres -- pg_dump > backup.sql
```

### Restore from Backup:

```bash
railway connect postgres -- psql < backup.sql
```

---

**Your Django app is already configured for Postgres!** Just add the database service in Railway and the migrations will run automatically on next deployment.
