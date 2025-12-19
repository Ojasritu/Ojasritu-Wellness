#!/bin/bash

###############################################################################
# Wellness Vaidya AI - Quick Deployment Script
# This script helps deploy the Wellness application with GPT-4o Mini
# Usage: ./deploy.sh [heroku|local|docker]
###############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "\n${BLUE}===========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}===========================================${NC}\n"
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

check_command() {
    if ! command -v $1 &> /dev/null; then
        print_error "$1 is not installed"
        return 1
    fi
    print_success "$1 is installed"
}

# Main deployment logic
deploy_local() {
    print_header "LOCAL DEVELOPMENT SETUP"
    
    print_info "Step 1: Installing Python dependencies..."
    pip install --upgrade pip
    pip install -r requirements.txt
    print_success "Dependencies installed"
    
    print_info "Step 2: Checking for .env file..."
    if [ ! -f .env ]; then
        print_warning ".env file not found"
        cp .env.example .env
        print_warning "Please edit .env with your API keys!"
        read -p "Press Enter after editing .env..."
    fi
    
    print_info "Step 3: Loading environment variables..."
    set -a
    source .env
    set +a
    print_success "Environment variables loaded"
    
    print_info "Step 4: Running database migrations..."
    python manage.py migrate
    print_success "Migrations completed"
    
    print_info "Step 5: Creating superuser (if needed)..."
    python manage.py shell << END
from django.contrib.auth.models import User
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'ojasrituwellness@gmail.com', 'admin123')
    print("✓ Superuser created")
else:
    print("✓ Superuser already exists")
END
    
    print_info "Step 6: Starting development server..."
    print_success "Django development server starting on http://localhost:8000"
    python manage.py runserver
}

deploy_heroku() {
    print_header "HEROKU PRODUCTION DEPLOYMENT"
    
    # Check if Heroku CLI is installed
    check_command heroku || return 1
    
    read -p "Enter your Heroku app name: " APP_NAME
    
    if [ -z "$APP_NAME" ]; then
        print_error "App name cannot be empty"
        return 1
    fi
    
    print_info "Step 1: Authenticating with Heroku..."
    heroku login
    print_success "Heroku authentication successful"
    
    print_info "Step 2: Adding Heroku remote..."
    git remote add heroku https://git.heroku.com/$APP_NAME.git 2>/dev/null || true
    print_success "Heroku remote configured"
    
    print_info "Step 3: Setting environment variables..."
    print_warning "You will need your OpenAI API key"
    read -sp "Enter your OpenAI API Key: " OPENAI_KEY
    echo ""
    
    heroku config:set OPENAI_API_KEY="$OPENAI_KEY" --app $APP_NAME
    heroku config:set DEBUG=False --app $APP_NAME
    print_success "Environment variables configured"
    
    print_info "Step 4: Deploying code..."
    git add .
    git commit -m "Deploy: Enable GPT-4o Mini integration" || true
    git push heroku main
    print_success "Code deployed to Heroku"
    
    print_info "Step 5: Running migrations..."
    heroku run "python manage.py migrate" --app $APP_NAME
    print_success "Database migrations completed"
    
    print_info "Step 6: Creating superuser..."
    heroku run "python manage.py shell" --app $APP_NAME << END
from django.contrib.auth.models import User
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'ojasrituwellness@gmail.com', 'admin123')
    print("✓ Superuser created")
else:
    print("✓ Superuser already exists")
END
    
    print_success "Deployment complete!"
    print_info "Access your app at: https://$APP_NAME.herokuapp.com"
    print_info "Admin panel at: https://$APP_NAME.herokuapp.com/admin"
}

deploy_docker() {
    print_header "DOCKER DEPLOYMENT"
    
    # Check if Docker is installed
    check_command docker || return 1
    
    print_info "Step 1: Building Docker image..."
    docker build -t wellness-vaidya:latest .
    print_success "Docker image built"
    
    print_warning "You will need your OpenAI API key"
    read -sp "Enter your OpenAI API Key: " OPENAI_KEY
    echo ""
    
    print_info "Step 2: Running container..."
    docker run -e OPENAI_API_KEY="$OPENAI_KEY" \
               -e DEBUG=False \
               -p 8000:8000 \
               -v /path/to/wellness:/app \
               wellness-vaidya:latest
}

show_help() {
    cat << EOF
Usage: $0 [command]

Commands:
    local       Deploy locally for development
    heroku      Deploy to Heroku production
    docker      Deploy using Docker
    help        Show this help message

Examples:
    $0 local      # Start local development server
    $0 heroku     # Deploy to Heroku
    $0 docker     # Run in Docker container

EOF
}

# Main script
if [ -z "$1" ] || [ "$1" == "help" ]; then
    show_help
    exit 0
fi

case "$1" in
    local)
        deploy_local
        ;;
    heroku)
        deploy_heroku
        ;;
    docker)
        deploy_docker
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac
