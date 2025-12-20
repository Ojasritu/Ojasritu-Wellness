#!/bin/bash
# Railway PostgreSQL Setup and Migration Script

set -e

echo "🗄️  Railway PostgreSQL Setup"
echo "=============================="
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm i -g @railway/cli
    echo "✅ Railway CLI installed"
fi

echo "📝 Step-by-step instructions:"
echo ""
echo "1️⃣  Add PostgreSQL to Railway Project:"
echo "   - Go to: https://railway.app/dashboard"
echo "   - Select your project: wellness-project-2-production-ojasritu"
echo "   - Click '+ New' → 'Database' → 'Add PostgreSQL'"
echo "   - Wait for it to provision (30-60 seconds)"
echo ""

read -p "Have you added PostgreSQL in Railway dashboard? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "ℹ️  Please add PostgreSQL first, then run this script again."
    exit 1
fi

echo ""
echo "2️⃣  Linking to Railway project..."
railway link

echo ""
echo "3️⃣  Running database migrations..."
railway run python manage.py migrate

echo ""
echo "4️⃣  Creating static files..."
railway run python manage.py collectstatic --noinput

echo ""
echo "✅ Database setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Create superuser: railway run python manage.py createsuperuser"
echo "   2. Verify tables: railway run python manage.py showmigrations"
echo "   3. Access admin: https://wellness-project-2-production-ojasritu.up.railway.app/admin/"
echo ""

read -p "Do you want to create a superuser now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "Creating superuser..."
    railway run python manage.py createsuperuser
fi

echo ""
echo "🎉 All done! Your PostgreSQL database is ready."
echo ""
echo "🔗 Useful commands:"
echo "   - Connect to DB: railway connect postgres"
echo "   - View logs: railway logs"
echo "   - View variables: railway variables"
echo "   - Run migrations: railway run python manage.py migrate"
