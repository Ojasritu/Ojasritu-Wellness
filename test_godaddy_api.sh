#!/bin/bash

# Test GoDaddy API credentials and permissions

API_KEY="${GODADDY_API_KEY:-}"
API_SECRET="${GODADDY_API_SECRET:-}"
DOMAIN="${DOMAIN:-ojasritu.co.in}"

if [ -z "$API_KEY" ] || [ -z "$API_SECRET" ]; then
  echo "ERROR: GODADDY_API_KEY or GODADDY_API_SECRET not set"
  exit 1
fi

echo "=== GoDaddy API Diagnostic Test ==="
echo "Domain: $DOMAIN"
echo ""

# Test 1: Production API - Get domain list
echo "Test 1: Production API - List all domains (checks basic auth)"
RESPONSE=$(curl -sS -i -H "Authorization: sso-key ${API_KEY}:${API_SECRET}" \
  -H "Accept: application/json" \
  "https://api.godaddy.com/v1/domains" 2>&1)

HTTP_CODE=$(echo "$RESPONSE" | head -1 | awk '{print $2}')
echo "HTTP Status: $HTTP_CODE"

if echo "$RESPONSE" | grep -q "ACCESS_DENIED"; then
  echo "Result: ❌ ACCESS_DENIED - API key lacks permission"
elif echo "$RESPONSE" | grep -q "UNAUTHORIZED\|401"; then
  echo "Result: ❌ UNAUTHORIZED - Invalid API key or secret"
elif [ "$HTTP_CODE" = "200" ]; then
  echo "Result: ✅ SUCCESS - API key is valid"
  echo "$RESPONSE" | tail -1 | jq . 2>/dev/null | head -5
else
  echo "Result: ⚠️  Unexpected response"
  echo "$RESPONSE" | tail -10
fi

echo ""
echo "Test 2: Production API - Get DNS records for $DOMAIN (checks domain access)"
RESPONSE=$(curl -sS -i -H "Authorization: sso-key ${API_KEY}:${API_SECRET}" \
  -H "Accept: application/json" \
  "https://api.godaddy.com/v1/domains/${DOMAIN}/records" 2>&1)

HTTP_CODE=$(echo "$RESPONSE" | head -1 | awk '{print $2}')
echo "HTTP Status: $HTTP_CODE"

if echo "$RESPONSE" | grep -q "ACCESS_DENIED"; then
  echo "Result: ❌ ACCESS_DENIED - API key cannot access this domain"
  echo "Likely cause: Key created in different GoDaddy account or lacks domain scope"
elif echo "$RESPONSE" | grep -q "UNAUTHORIZED\|401"; then
  echo "Result: ❌ UNAUTHORIZED - Invalid credentials"
elif [ "$HTTP_CODE" = "200" ]; then
  echo "Result: ✅ SUCCESS - Can read DNS records"
  echo "$RESPONSE" | tail -1 | jq . 2>/dev/null | head -10
else
  echo "Result: ⚠️  Unexpected response (HTTP $HTTP_CODE)"
  echo "$RESPONSE" | tail -5
fi

echo ""
echo "Test 3: Update CNAME record (checks write permission)"
CNAME_BODY='[{"data":"7krp9g4c.up.railway.app","type":"CNAME"}]'
RESPONSE=$(curl -sS -i -X PUT \
  -H "Authorization: sso-key ${API_KEY}:${API_SECRET}" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d "$CNAME_BODY" \
  "https://api.godaddy.com/v1/domains/${DOMAIN}/records/CNAME/www" 2>&1)

HTTP_CODE=$(echo "$RESPONSE" | head -1 | awk '{print $2}')
echo "HTTP Status: $HTTP_CODE"

if echo "$RESPONSE" | grep -q "ACCESS_DENIED"; then
  echo "Result: ❌ ACCESS_DENIED - Cannot write DNS (permission denied)"
elif echo "$RESPONSE" | grep -q "UNAUTHORIZED\|401"; then
  echo "Result: ❌ UNAUTHORIZED - Invalid credentials"
elif [ "$HTTP_CODE" = "200" ]; then
  echo "Result: ✅ SUCCESS - DNS record updated!"
else
  echo "Result: ⚠️  Unexpected response"
  echo "$RESPONSE" | tail -3
fi

echo ""
echo "=== Summary ==="
echo "If Test 1 fails: API key/secret is wrong"
echo "If Test 1 passes but Test 2 fails: Key is for different GoDaddy account"
echo "If Test 2 passes but Test 3 fails: Key lacks DNS write scope"
