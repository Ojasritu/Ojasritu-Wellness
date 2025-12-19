# Wellness Project - Setup Guide

## Prerequisites
- Python 3.8+
- Node.js 14+
- Git
- pip (Python package manager)
- npm (Node package manager)

---

## Step 1: Extract the Zip File
```bash
unzip Wellness.zip
cd Wellness
```

---

## Step 2: Backend Setup (Django)

### 2.1 Create Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2.2 Install Python Dependencies
```bash
pip install -r requirements.txt
```

### 2.3 Database Setup
```bash
python manage.py makemigrations
python manage.py migrate
```

### 2.4 Create Superuser (Admin)
```bash
python manage.py createsuperuser
# Follow prompts to create admin account
```

### 2.5 Collect Static Files
```bash
python manage.py collectstatic --noinput
```

### 2.6 Run Django Server
```bash
python manage.py runserver
# Accessible at: http://localhost:8000
```

---

## Step 3: Frontend Setup (React/Vite)

### 3.1 Navigate to Frontend
```bash
cd frontend
```

### 3.2 Install Dependencies
```bash
npm install
```

### 3.3 Run Development Server
```bash
npm run dev
# Accessible at: http://localhost:5173 (or as shown in terminal)
```

### 3.4 Build for Production
```bash
npm run build
# Creates optimized build in `dist/` folder
```

---

## Step 4: Environment Variables (If Needed)

Create a `.env` file in the root directory:
```
DEBUG=True
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///db.sqlite3
STRIPE_API_KEY=your-stripe-key
```

Create a `.env` file in the `frontend/` directory:
```
VITE_API_URL=http://localhost:8000
```

---

## Step 5: Run Both Servers Together

### Option A: Two Terminals
**Terminal 1 (Backend):**
```bash
source venv/bin/activate  # or venv\Scripts\activate on Windows
python manage.py runserver
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

### Option B: Using a Process Manager (pm2)
```bash
npm install -g pm2

# Create ecosystem.config.js in root
# Then run: pm2 start ecosystem.config.js
```

---

## Step 6: Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin

---

## Step 7: Push to New GitHub Repository

### 7.1 Initialize New Git Repo
```bash
git init
git add .
git commit -m "Initial commit from Wellness project"
```

### 7.2 Add Remote Repository
```bash
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git branch -M main
git push -u origin main
```

---

## Step 8: Deploy to Hosting Platform

### Using Heroku:
```bash
heroku login
heroku create your-app-name
git push heroku main
heroku run python manage.py migrate
```

### Using Railway/Render:
1. Connect your GitHub repository
2. Set environment variables
3. Configure build/start commands
4. Deploy

---

## Troubleshooting

### Issue: Module not found errors
**Solution:**
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### Issue: Node modules issues
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Database errors
**Solution:**
```bash
python manage.py migrate
python manage.py createsuperuser
```

### Issue: Port already in use
```bash
# Change port for Django
python manage.py runserver 8001

# Change port for Vite (in frontend/)
npm run dev -- --port 5174
```

---

## Project Structure

```
Wellness/
├── frontend/              # React/Vite frontend
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── shop/                  # Django app
│   ├── models.py
│   ├── views.py
│   ├── api.py
│   └── migrations/
├── wellness_project/      # Django settings
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── templates/             # Django templates
├── static/                # Static files
├── media/                 # User uploads
├── manage.py
├── requirements.txt
├── db.sqlite3
└── venv/                  # Virtual environment
```

---

## Key Files to Configure

1. **wellness_project/settings.py** - Django settings
2. **wellness_project/urls.py** - URL routing
3. **frontend/vite.config.js** - Vite configuration
4. **frontend/src/i18n.js** - Internationalization
5. **requirements.txt** - Python dependencies
6. **frontend/package.json** - Node dependencies

---

## Useful Commands

```bash
# Backend
python manage.py runserver          # Start Django
python manage.py makemigrations     # Create migrations
python manage.py migrate            # Apply migrations
python manage.py createsuperuser    # Create admin
python manage.py collectstatic      # Collect static files

# Frontend
npm run dev                         # Start dev server
npm run build                       # Build for production
npm run preview                     # Preview production build
```

---

## Support

For issues or questions, check:
- Django Documentation: https://docs.djangoproject.com/
- React Documentation: https://react.dev/
- Vite Documentation: https://vitejs.dev/

---

**Last Updated**: November 16, 2025
