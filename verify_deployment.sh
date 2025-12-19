#!/bin/bash
# Railway Deployment Verification Script
# Run this after Railway deployment to verify everything is working

set -e

RAILWAY_URL="https://wellness-project-2-production-ojasritu.up.railway.app"
CUSTOM_DOMAIN="https://ojasritu.co.in"

echo "🚀 Railway Deployment Verification"
echo "=================================="
echo ""

# Check Railway URL
echo "1️⃣  Checking Railway URL..."
RAILWAY_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$RAILWAY_URL" || echo "000")
if [ "$RAILWAY_STATUS" = "200" ]; then
    echo "   ✅ Railway URL: $RAILWAY_URL - OK (HTTP $RAILWAY_STATUS)"
else
    echo "   ❌ Railway URL: $RAILWAY_URL - FAILED (HTTP $RAILWAY_STATUS)"
fi
echo ""

# Check Custom Domain
echo "2️⃣  Checking Custom Domain..."
DOMAIN_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$CUSTOM_DOMAIN" || echo "000")
if [ "$DOMAIN_STATUS" = "200" ]; then
    echo "   ✅ Custom Domain: $CUSTOM_DOMAIN - OK (HTTP $DOMAIN_STATUS)"
else
    echo "   ❌ Custom Domain: $CUSTOM_DOMAIN - FAILED (HTTP $DOMAIN_STATUS)"
fi
echo ""

# Check Admin
echo "3️⃣  Checking Admin Panel..."
ADMIN_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$CUSTOM_DOMAIN/admin/" || echo "000")
if [ "$ADMIN_STATUS" = "200" ] || [ "$ADMIN_STATUS" = "302" ]; then
    echo "   ✅ Admin Panel: $CUSTOM_DOMAIN/admin/ - OK (HTTP $ADMIN_STATUS)"
else
    echo "   ❌ Admin Panel: $CUSTOM_DOMAIN/admin/ - FAILED (HTTP $ADMIN_STATUS)"
fi
echo ""

# Check API
echo "4️⃣  Checking API..."
API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$CUSTOM_DOMAIN/api/" || echo "000")
if [ "$API_STATUS" = "200" ]; then
    echo "   ✅ API: $CUSTOM_DOMAIN/api/ - OK (HTTP $API_STATUS)"
else
    echo "   ⚠️  API: $CUSTOM_DOMAIN/api/ - Status $API_STATUS (might be expected)"
fi
echo ""

# Check Static Files
echo "5️⃣  Checking Static Files..."
STATIC_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$CUSTOM_DOMAIN/static/admin/css/base.css" || echo "000")
if [ "$STATIC_STATUS" = "200" ]; then
    echo "   ✅ Static Files: OK (HTTP $STATIC_STATUS)"
else
    echo "   ❌ Static Files: FAILED (HTTP $STATIC_STATUS)"
fi
echo ""

# DNS Check
echo "6️⃣  Checking DNS..."
DNS_RESULT=$(dig +short ojasritu.co.in | head -1)
if [ -n "$DNS_RESULT" ]; then
    echo "   ✅ DNS: ojasritu.co.in → $DNS_RESULT"
else
    echo "   ❌ DNS: No records found for ojasritu.co.in"
fi
echo ""

# Summary
echo "=================================="
echo "📊 SUMMARY"
echo "=================================="

if [ "$RAILWAY_STATUS" = "200" ] && [ "$DOMAIN_STATUS" = "200" ] && [ "$STATIC_STATUS" = "200" ]; then
    echo "✅ All checks passed! Deployment successful."
    echo ""
    echo "🎉 Your site is live at:"
    echo "   - $CUSTOM_DOMAIN"
    echo "   - $RAILWAY_URL"
else
    echo "⚠️  Some checks failed. Please review:"
    echo ""
    [ "$RAILWAY_STATUS" != "200" ] && echo "   - Railway URL returned HTTP $RAILWAY_STATUS (expected 200)"
    [ "$DOMAIN_STATUS" != "200" ] && echo "   - Custom domain returned HTTP $DOMAIN_STATUS (expected 200)"
    [ "$STATIC_STATUS" != "200" ] && echo "   - Static files not loading (check WhiteNoise config)"
    echo ""
    echo "📖 See RAILWAY_DEPLOYMENT_FIXED.md for troubleshooting"
fi
echo ""
