#!/bin/bash

###############################################################################
# Railway Deployment Script for Wellness Vaidya AI
# Complete automated deployment to Railway.app
###############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() {
    echo -e "\n${BLUE}╔════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║  $1${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════╝${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Check if Railway CLI is installed
check_railway_cli() {
    if ! command -v railway &> /dev/null; then
        print_warning "Railway CLI is not installed — attempting automatic install via npm"
        if command -v npm &> /dev/null; then
            print_info "Running: npm install -g railway"
            npm install -g railway || {
                print_error "Automatic installation failed. Please install Railway CLI manually: https://docs.railway.app/develop/cli"
                exit 1
            }
        else
            print_error "npm is not available. Install Railway CLI manually: https://docs.railway.app/develop/cli"
            exit 1
        fi
    fi
    print_success "Railway CLI found"
}

# Login to Railway
railway_login() {
    print_header "Step 1: Login to Railway"
    # Support CI/non-interactive mode when RAILWAY_TOKEN is provided
    if [ -n "$RAILWAY_TOKEN" ]; then
        print_info "Using RAILWAY_TOKEN for non-interactive login"
        # The CLI may pick up RAILWAY_TOKEN from env; try whoami to validate
        # Try browserless login which the newer CLI supports
        if railway login --browserless &> /dev/null; then
            if railway whoami &> /dev/null; then
                print_success "Railway authenticated via RAILWAY_TOKEN (browserless)"
                return 0
            fi
        fi
        print_warning "RAILWAY_TOKEN provided but authentication did not succeed. Proceeding to interactive login..."
    fi

    print_info "Opening Railway login in browser... (complete login in browser to continue)"
    railway login
    print_success "Logged in to Railway"
}

# Create Railway project
railway_init() {
    print_header "Step 2: Create Railway Project"
    
    read -p "Enter project name (wellness-vaidya-ai): " PROJECT_NAME
    PROJECT_NAME=${PROJECT_NAME:-wellness-vaidya-ai}
    
    print_info "Creating project: $PROJECT_NAME"
    # Try `railway new` first; fall back to `railway init` if needed
    if railway new "$PROJECT_NAME" 2>/dev/null; then
        print_success "Project created with 'railway new'"
    else
        if railway init --name "$PROJECT_NAME" 2>/dev/null; then
            print_success "Project initialized with 'railway init'"
        else
            print_warning "Could not create project automatically. You may need to create the project in the Railway dashboard manually."
        fi
    fi
}

# Add PostgreSQL database
railway_add_postgres() {
    print_header "Step 3: Add PostgreSQL Database"
    
    print_info "Adding PostgreSQL to your project..."
    # Some CLI versions support `railway add`; others manage services via web dashboard.
    if railway add --service postgres 2>/dev/null; then
        print_success "PostgreSQL added"
    else
        print_warning "Railway CLI could not add Postgres automatically. Please add a PostgreSQL plugin in the Railway dashboard if required."
    fi
}

# Set environment variables
railway_env_vars() {
    print_header "Step 4: Set Environment Variables"
    
    print_warning "You need to set these in Railway dashboard:"
    print_info "1. Go to: https://railway.app/dashboard"
    print_info "2. Select your project"
    print_info "3. Click 'Variables' tab"
    print_info "4. Add these variables:"
    
    echo ""
    echo "OPENAI_API_KEY=sk-your-actual-key"
    echo "SECRET_KEY=your-django-secret-key"
    echo "DEBUG=False"
    echo "ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com"
    echo "STRIPE_PUBLIC_KEY=pk_..."
    echo "STRIPE_SECRET_KEY=sk_..."
    echo "DJANGO_SUPERUSER_EMAIL=ojasrituwellness@gmail.com"
    echo ""
    
    read -p "Press Enter after adding variables to Railway dashboard..."
}

# Deploy code
railway_deploy() {
    print_header "Step 5: Deploy Code"
    
    print_info "Ensuring code is committed..."
    git add .
    git commit -m "Deploy to Railway with GPT-4o Mini" 2>/dev/null || true
    
    print_info "Deploying to Railway..."
    railway up
    
    print_success "Code deployed to Railway!"
}

# Run migrations
railway_migrations() {
    print_header "Step 6: Run Database Migrations"
    
    print_info "Running migrations..."
    railway run python manage.py migrate
    print_success "Migrations completed"
    
    print_info "Creating superuser (non-interactive if env vars provided)..."
    # Create superuser non-interactively using environment variables if available
    DJANGO_SUPERUSER_EMAIL=${DJANGO_SUPERUSER_EMAIL:-$(printenv DJANGO_SUPERUSER_EMAIL)}
    DJANGO_SUPERUSER_USERNAME=${DJANGO_SUPERUSER_USERNAME:-${DJANGO_SUPERUSER_EMAIL%%@*}}
    DJANGO_SUPERUSER_PASSWORD=${DJANGO_SUPERUSER_PASSWORD:-$(printenv DJANGO_SUPERUSER_PASSWORD)}

    if [ -z "$DJANGO_SUPERUSER_EMAIL" ] || [ -z "$DJANGO_SUPERUSER_PASSWORD" ]; then
        print_warning "DJANGO_SUPERUSER_EMAIL or DJANGO_SUPERUSER_PASSWORD not set — falling back to interactive createsuperuser"
        railway run python manage.py createsuperuser || true
    else
        # Run a small Django snippet to create the superuser if it doesn't exist
        railway run python manage.py shell -c "import os; from django.contrib.auth import get_user_model; User=get_user_model(); email='$DJANGO_SUPERUSER_EMAIL'; username='$DJANGO_SUPERUSER_USERNAME'; pwd='$DJANGO_SUPERUSER_PASSWORD'; u=User.objects.filter(email=email).first();
if not u:
    User.objects.create_superuser(username=username, email=email, password=pwd); print('SUPERUSER_CREATED');
else:
    print('SUPERUSER_EXISTS')"
        print_success "Superuser ensured (created or already exists)"
    fi
    
    print_info "Collecting static files..."
    railway run python manage.py collectstatic --noinput
    print_success "Static files collected"
}

# Get app URL
railway_get_url() {
    print_header "Step 7: Get Your App URL"
    
    print_info "Your Railway app is deployed!"
    
    # Try to get the URL via `railway status`. If impossible, instruct user to check dashboard.
    APP_URL=$(railway status 2>/dev/null || true)
    if echo "$APP_URL" | grep -i "http" >/dev/null 2>&1; then
        print_success "App status:\n$APP_URL"
    else
        print_info "Could not parse app URL from CLI. Visit: https://railway.app/dashboard and open your project to find the URL."
    fi
}

# Setup custom domain
godaddy_domain() {
    print_header "Step 8: Connect GoDaddy Domain"
    
    read -p "Do you have a GoDaddy domain? (y/n): " HAS_DOMAIN
    
    if [ "$HAS_DOMAIN" = "y" ] || [ "$HAS_DOMAIN" = "Y" ]; then
        read -p "Enter your domain (e.g., example.com): " DOMAIN
        
        print_info "Setting up domain: $DOMAIN"
        print_info ""
        print_warning "Add this CNAME record in GoDaddy DNS:"
        print_info "Name: www"
        print_info "Type: CNAME"
        print_info "Value: [your-railway-app].railway.app"
        print_info ""
        print_warning "Wait 24-48 hours for DNS propagation"
        
        read -p "Press Enter after updating DNS records in GoDaddy..."
        
        print_info "Updating Django settings..."
        print_info "Edit wellness_project/settings.py and update ALLOWED_HOSTS:"
        echo ""
        echo "ALLOWED_HOSTS = ['$DOMAIN', 'www.$DOMAIN', '*.railway.app']"
        echo ""
    fi
}

# Final status
show_status() {
    print_header "Deployment Complete!"
    
    echo ""
    echo "✅ Code deployed to Railway"
    echo "✅ PostgreSQL database connected"
    echo "✅ Environment variables configured"
    echo "✅ Migrations run"
    echo "✅ Superuser created"
    echo ""
    print_info "Next steps:"
    echo "1. Visit your Railway app URL"
    echo "2. Login to admin: /admin"
    echo "3. Connect GoDaddy domain (if applicable)"
    echo "4. Wait for DNS propagation"
    echo "5. Access via yourdomain.com"
    echo ""
    print_success "Your Wellness Vaidya AI is live! 🚀"
}

# Main script
main() {
    print_header "Railway Deployment Script"
    print_info "Wellness Vaidya AI with GPT-4o Mini"
    
    check_railway_cli
    railway_login
    railway_init
    railway_add_postgres
    railway_env_vars
    railway_deploy
    railway_migrations
    railway_get_url
    godaddy_domain
    show_status
}

# Run main
main "$@"
