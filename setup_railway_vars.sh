#!/bin/bash

###############################################################################
# Railway Environment Variables Setup
# Run this script to configure all required environment variables for deployment
###############################################################################

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Railway Environment Variables Setup for Wellness    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}\n"

# Check if logged in
if ! railway whoami &>/dev/null; then
    echo -e "${RED}❌ Not logged into Railway. Please run: railway login${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Connected to Railway${NC}\n"

# Function to set variable if not empty
set_variable() {
    local key=$1
    local value=$2
    if [ -n "$value" ]; then
        echo -e "${BLUE}Setting $key...${NC}"
        railway variables set "$key=$value"
        echo -e "${GREEN}✓ $key set${NC}\n"
    else
        echo -e "${YELLOW}⚠ Skipping $key (empty value)${NC}\n"
    fi
}

echo -e "${YELLOW}Let's set up your environment variables.${NC}"
echo -e "${YELLOW}Press ENTER to skip any optional variables.${NC}\n"

# Required Variables
echo -e "${BLUE}═══ Required Variables ═══${NC}\n"

echo -n "Enter Django SECRET_KEY (required, or press ENTER for auto-generated): "
read SECRET_KEY
if [ -z "$SECRET_KEY" ]; then
    SECRET_KEY=$(python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')
    echo -e "${GREEN}Generated: $SECRET_KEY${NC}"
fi
set_variable "SECRET_KEY" "$SECRET_KEY"

echo -n "Enter OPENAI_API_KEY (required for Vaidya AI chatbot): "
read OPENAI_API_KEY
set_variable "OPENAI_API_KEY" "$OPENAI_API_KEY"

# Set DEBUG to False for production
echo -e "${BLUE}Setting DEBUG=False for production...${NC}"
railway variables set "DEBUG=False"
echo -e "${GREEN}✓ DEBUG set to False${NC}\n"

# Optional Variables
echo -e "${BLUE}═══ Optional Variables (Payment Gateways) ═══${NC}\n"

echo -n "Enter RAZORPAY_KEY_ID (optional, press ENTER to skip): "
read RAZORPAY_KEY_ID
set_variable "RAZORPAY_KEY_ID" "$RAZORPAY_KEY_ID"

echo -n "Enter RAZORPAY_KEY_SECRET (optional, press ENTER to skip): "
read RAZORPAY_KEY_SECRET
set_variable "RAZORPAY_KEY_SECRET" "$RAZORPAY_KEY_SECRET"

echo -n "Enter STRIPE_PUBLIC_KEY (optional, press ENTER to skip): "
read STRIPE_PUBLIC_KEY
set_variable "STRIPE_PUBLIC_KEY" "$STRIPE_PUBLIC_KEY"

echo -n "Enter STRIPE_SECRET_KEY (optional, press ENTER to skip): "
read STRIPE_SECRET_KEY
set_variable "STRIPE_SECRET_KEY" "$STRIPE_SECRET_KEY"

echo -e "${BLUE}═══ Optional Variables (Google OAuth) ═══${NC}\n"

echo -n "Enter GOOGLE_CLIENT_ID (optional, press ENTER to skip): "
read GOOGLE_CLIENT_ID
set_variable "GOOGLE_CLIENT_ID" "$GOOGLE_CLIENT_ID"

echo -n "Enter GOOGLE_CLIENT_SECRET (optional, press ENTER to skip): "
read GOOGLE_CLIENT_SECRET
set_variable "GOOGLE_CLIENT_SECRET" "$GOOGLE_CLIENT_SECRET"

echo -e "\n${GREEN}════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Environment variables setup complete!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════${NC}\n"

echo -e "${BLUE}View all variables:${NC}"
echo "railway variables"

echo -e "\n${BLUE}Next steps:${NC}"
echo "1. Add PostgreSQL database: railway add --database postgres"
echo "2. Deploy your code: railway up"
echo "3. Run migrations: railway run python manage.py migrate"
echo "4. Create superuser: railway run python create_superuser_script.py"
echo "5. Visit your site: https://www.ojasritu.co.in"

echo -e "\n${GREEN}Happy deploying! 🚀${NC}"
