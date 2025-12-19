# Ojasritu Wellness - Django Starter (Demo)

This is a demo Django e-commerce starter project (small, easy to run).

## Quick start (Codespaces)
1. Create a GitHub repo and upload this zip.
2. Open Codespaces (Create codespace on main).
3. In the Codespaces terminal:
   unzip wellness_project.zip
   rm wellness_project.zip
   cd wellness_project
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py createsuperuser
   python manage.py shell < create_demo.py
   python manage.py runserver 0.0.0.0:8000

4. Open Ports tab → 8000 → Open in Browser.
5. Admin: /admin/ → login with superuser and add products.

## Notes

## Ojasritu Wellness — Demo Website

This repository includes a Django backend and a Vite React frontend (PWA-ready) for the Ojasritu Ayurvedic website demo.

What I added (summary):
- Frontend (under `/frontend`) — React + Vite PWA-ready scaffold, Lottie animation, Video gallery (multilingual), Chatbot stub, pages for products, blog, contact, login/signup, profile, wellness centre scaffold and more.
- Backend (Django site) — small API endpoints (DRF) for `Product` at `/api/products/` with demo product creation script `create_demo.py`.
- Dockerfile updated to build frontend and backend (multi-stage). See `Dockerfile`.
- Service worker and `manifest.json` for PWA
- README deployment steps for Railway below

Important: secrets (Google, Razorpay keys) are NOT committed. Use environment variables in Railway or local `.env`.

Environment variables (Railway / production):
- DJANGO_SECRET_KEY
- DATABASE_URL (Postgres)
- RAZORPAY_KEY_ID
- RAZORPAY_KEY_SECRET
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- ALLOWED_HOSTS (comma-separated)

Railway deployment (quick):
1. Create a Railway account: https://railway.app
2. Create a new project and link your GitHub repository.
3. In Railway > Variables, add the env vars above.
4. Set up the service with the Dockerfile (repo-root Dockerfile). Railway will build using the Dockerfile.
    - Build: the Dockerfile runs npm build for `/frontend`, then collects static into Django `staticfiles` and runs gunicorn.
5. Add your domain in Railway > Domains and follow the DNS instructions.

Local development quickstart:
- Backend (Django):
   1. python -m venv venv && source venv/bin/activate
   2. pip install -r requirements.txt
   3. python manage.py migrate
   4. python manage.py createsuperuser
   5. python manage.py runserver
- Frontend (React):
   1. cd frontend
   2. npm install
   3. npm run dev

Notes & next steps:
- Configure Google OAuth and Razorpay keys as environment variables; configure Django auth/social apps for production.
- Add webhook endpoints for Razorpay and server-side order creation for secure payments.
- Replace placeholder videos with real MP4/WebM files in `frontend/public/videos/`.
- Add more demo data via `python manage.py shell < create_demo.py` or via Django admin.

If you want, I will now run the frontend build and a local Django check (migrations) and fix any remaining runtime errors.
