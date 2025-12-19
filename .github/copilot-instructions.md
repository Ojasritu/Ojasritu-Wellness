# Ojasritu Wellness - AI Coding Agent Instructions

## Project Overview

Ojasritu Wellness is a full-stack Ayurvedic e-commerce platform featuring an AI-powered chatbot ("Vaidya AI"). Built with **Django (DRF)** backend and **React + Vite** frontend, designed for bilingual (Hindi/English) users.

**Architecture**: Monorepo with separate backend (root) and frontend (`/frontend/`) directories. Docker multi-stage build deploys to Railway.

## Quick Start (Development)

```bash
# Terminal 1 - Backend (Django on :8000)
python manage.py migrate
python manage.py runserver 0.0.0.0:8000

# Terminal 2 - Frontend (Vite on :5173)
cd frontend && npm run dev

# Or use: ./start_servers.sh
```

**URLs**:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api/
- Admin: http://localhost:8000/admin/

## Critical Architecture Patterns

### Frontend-Backend Communication

The frontend uses **Vite proxy** (not direct CORS) to route `/api/*` requests to Django:

```javascript
// frontend/vite.config.js
proxy: {
  '/api': { target: 'http://127.0.0.1:8000', changeOrigin: false }
}
```

**API calls** use relative paths: `fetch('/api/products/')` (not `http://localhost:8000/api/...`)

All API calls go through `frontend/src/services/apiService.js` which handles:
- CSRF token management (from cookies)
- Automatic error handling/logging
- Request/response interceptors

### Authentication Flow

Uses **session-based auth** (not JWT) with Django Allauth + custom endpoints:

1. Login: POST `/api/auth/login/` → sets `sessionid` cookie
2. Check auth: GET `/api/auth/check/` → returns `{authenticated: true, user: {...}}`
3. CSRF: GET `/api/auth/csrf/` → sets `csrftoken` cookie
4. All mutations require CSRF token from cookie

Google OAuth is integrated via Django Allauth at `/accounts/google/login/`.

**Frontend auth state** managed in `AuthContext` (see `frontend/src/context/AuthContext.jsx`).

### Django App Structure

All business logic lives in the `shop/` app:

- **Models** (`shop/models.py`): Category, Product, Cart, Order, Profile, Article, FAQ, ContactMessage
- **API ViewSets** (`shop/api.py`): DRF router with categories, products, orders, cart endpoints
- **Web Views** (`shop/views.py` + `shop/web_urls.py`): Template-based views for legacy support
- **Auth** (`shop/auth_views.py`): Custom login/register/logout endpoints
- **Chatbot** (`shop/chatbot_improved.py`): AI chatbot using OpenAI GPT-4o-mini (fallback to keyword matching)

**URL routing**:
- `/api/` → DRF endpoints (shop.urls)
- Web pages → shop.web_urls
- Admin → django.contrib.admin

### Data Models - Key Relationships

```python
# Product is the core entity
Product
  ├─ category: ForeignKey(Category)
  ├─ dosha_type: CharField (vata/pitta/kapha/tridosha)
  ├─ quantity_in_stock: PositiveIntegerField
  └─ Fields: hindi_name, benefits, ingredients, usage_instructions

Cart → User (one-to-one)
  └─ CartItem → Product (many-to-one)

Order → User
  └─ Items stored in JSON field (snapshot at purchase time)
```

### Vaidya AI Chatbot

**Endpoint**: POST `/api/chat/` (see `shop/chatbot_improved.py`)

**Flow**:
1. Frontend sends `{message: "...", language: "hi"|"en", history: [...]}`
2. Backend tries OpenAI GPT-4o-mini with Ayurveda system prompt
3. On API failure, falls back to keyword-based responses
4. Returns `{response: "...", slok: {...}}` (Sanskrit verse)

**Configuration**: Requires `OPENAI_API_KEY` in environment (`.env` or Railway vars).

The chatbot UI is `frontend/src/components/AyurvedicChatbot.jsx` with custom `PanditRobotLogo.jsx` SVG.

## Development Workflows

### Database Migrations

```bash
python manage.py makemigrations
python manage.py migrate

# Check migration status
python manage.py showmigrations
```

**Important**: Always run migrations in production via `entrypoint.sh` (Railway) or manually before deploying.

### Creating Test Data

```bash
# Create demo products/categories
python manage.py shell < create_demo.py

# Seed dev users (testuser1, testuser2)
python scripts/seed_dev_data.py

# Create superuser
python manage.py createsuperuser  # Use: ojasrituwellness@gmail.com
```

### Frontend Build

```bash
cd frontend
npm run build  # Outputs to frontend/dist/

# Backend serves built frontend via collectstatic
python manage.py collectstatic --noinput
```

In production (Dockerfile), frontend is built in stage 1, copied to `/app/staticfiles/frontend`, and served by Django/WhiteNoise.

### Testing

```bash
# Backend tests
pytest shop/tests/

# Frontend (no tests yet - manually test pages)
cd frontend && npm run dev

# Test chatbot
python test_vaidya_ai.py

# Smoke test auth flow
python scripts/smoke_auth_test.py
```

## Deployment (Railway)

**Build process** (see `Dockerfile`):
1. Multi-stage: Node.js builds frontend → Python serves backend
2. `entrypoint.sh` runs migrations + collectstatic + gunicorn

**Environment variables** (set in Railway dashboard):
- `DATABASE_URL` (auto-set by Railway Postgres)
- `SECRET_KEY` (Django secret)
- `OPENAI_API_KEY` (for chatbot)
- `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` (payments)
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` (OAuth)
- `ALLOWED_HOSTS=ojasritu.co.in,*.railway.app`

**Deployment scripts**:
- `./deploy-railway.sh` (automated Railway deploy)
- `./start_all.sh` (local development)
- `./stop_servers.sh` (cleanup)

### Custom Domain Setup

Railway → Settings → Domains → Add `ojasritu.co.in`

Update GoDaddy DNS (see `RAILWAY_GODADDY_SETUP.md`):
- A record: `@` → Railway IP
- CNAME: `www` → Railway domain

## Project-Specific Conventions

### Bilingual Support

All user-facing text has Hindi/English versions:

```python
# Backend models
product.name = "Anti-Aging Capsule"
product.hindi_name = "बुढ़ापा रोधी कैप्सूल"

# Frontend uses i18next
<Trans i18nKey="home.hero.title" />
```

Configuration: `frontend/src/i18n.js`

### Dosha Types (Ayurveda)

Products are categorized by Ayurvedic dosha:
- `vata` (वात)
- `pitta` (पित्त)
- `kapha` (कफ)
- `tridosha` (त्रिदोष संतुलित - balances all three)

Use dosha type for filtering: `GET /api/products/?dosha_type=vata`

### Payment Integration

**Razorpay** is primary (India-focused):

```javascript
// Frontend checkout flow
const options = {
  key: import.meta.env.VITE_RAZORPAY_KEY_ID,
  amount: order.amount * 100,  // Convert to paise
  currency: "INR",
  order_id: order.razorpay_order_id
};
```

Stripe integration exists but is secondary (see `shop/api.py`).

### Static Files

**Django** uses WhiteNoise to serve:
- Built frontend: `/staticfiles/frontend/`
- Admin/DRF static: `/staticfiles/admin/`, `/staticfiles/rest_framework/`
- User uploads: `/media/` (products, avatars)

In development, Vite serves frontend directly. In production, Django serves everything.

## Common Gotchas

1. **CSRF tokens**: Always fetch from cookie, not hardcoded. Use `apiService.js` for all API calls.

2. **Vite proxy**: Don't use `http://localhost:8000/api/` in frontend code - use `/api/` (proxy handles it).

3. **Migrations**: Run `makemigrations` THEN `migrate`. Don't skip migration files in commits.

4. **ALLOWED_HOSTS**: Must include `.app.github.dev` for Codespaces, `.railway.app` for Railway.

5. **Environment detection**: Settings auto-detect Railway via `RAILWAY_ENVIRONMENT` or `DATABASE_URL` containing "railway".

6. **Chatbot fallback**: Works without OpenAI key (degrades to keyword responses).

## Key Files Reference

- `wellness_project/settings.py` - Django config (CORS, DB, static files)
- `shop/models.py` - Database schema (Product, Cart, Order, etc.)
- `shop/api.py` - DRF ViewSets and serializers (lines 174-533 have all endpoints)
- `shop/chatbot_improved.py` - AI chatbot logic
- `frontend/src/services/apiService.js` - Centralized API client
- `frontend/src/context/AuthContext.jsx` - Auth state management
- `frontend/vite.config.js` - Proxy config for local dev
- `Dockerfile` - Multi-stage build (frontend → backend)
- `entrypoint.sh` - Production startup script
- `start_servers.sh` - Local development launcher

## Documentation Index

Extensive docs in root (30+ markdown files):
- **START_HERE.md** - Overview and initial setup
- **SYSTEM_ARCHITECTURE.md** - Detailed architecture diagrams
- **VAIDYA_AI_ARCHITECTURE.md** - Chatbot-specific architecture
- **HOW_TO_RUN.md** - 3 deployment methods (local, Heroku, Railway)
- **RAILWAY_DEPLOY_NOW.md** - Railway deployment guide
- **PRODUCTION_GUIDE.md** - Production checklist
- **QUICK_START.md** - 5-minute quickstart

When in doubt, search these docs: `grep -r "keyword" *.md`
