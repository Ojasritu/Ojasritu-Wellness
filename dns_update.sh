#!/bin/bash
set -e

if [ -z "$GODADDY_API_KEY" ] || [ -z "$GODADDY_API_SECRET" ] || [ -z "$DOMAIN" ] || [ -z "$RAILWAY_APP_HOST" ]; then
  echo "Usage: export GODADDY_API_KEY=... GODADDY_API_SECRET=... DOMAIN=yourdomain.com RAILWAY_APP_HOST=your-app.railway.app && ./dns_update.sh"
  exit 1
fi

echo "Updating GoDaddy DNS: setting CNAME www -> $RAILWAY_APP_HOST"

curl -s -X PUT "https://api.godaddy.com/v1/domains/${DOMAIN}/records/CNAME/www" \
  -H "Authorization: sso-key ${GODADDY_API_KEY}:${GODADDY_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d "[{\"data\":\"${RAILWAY_APP_HOST}\",\"ttl\":600}]" \
  | jq || true

echo "CNAME update requested. It can take up to 24-48 hours to propagate."
echo "If you want root domain forwarding, please configure GoDaddy forwarding to https://www.${DOMAIN} in the GoDaddy dashboard."
