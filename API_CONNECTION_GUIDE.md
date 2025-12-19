# API Connection Setup Guide

## Problem Solved ✅

Your frontend was using direct `/api/` paths without proper API service abstraction. The new setup includes:

### 1. **API Service Layer** (`/frontend/src/services/apiService.js`)
   - Centralized API communication
   - Automatic error handling
   - Proper request/response logging
   - CORS and CSRF support

### 2. **API Configuration** (`/frontend/src/services/apiConfig.js`)
   - Environment-aware API base URL selection
   - Development: Uses Vite proxy (`/api` → `http://127.0.0.1:8000/api`)
   - Production: Direct backend connection

### 3. **Updated Components**
   - `Products.jsx` now uses `productsAPI.getAll()`
   - All components should be updated to use the API service

---

## How It Works

### Development Mode (Vite Dev Server)
```
Frontend (http://127.0.0.1:5173)
    ↓ (request to /api/...)
Vite Proxy (vite.config.js)
    ↓ (proxies to)
Backend (http://127.0.0.1:8000)
```

### Production Mode
```
Frontend (https://ojasritu.co.in)
    ↓ (request to /api/...)
Backend (https://ojasritu.co.in/api/...)
```

---

## Running Both Servers

### Terminal 1: Backend
```bash
cd /workspaces/wellness
python manage.py runserver 127.0.0.1:8000
```

### Terminal 2: Frontend
```bash
cd /workspaces/wellness/frontend
npm run dev
```

Then visit: **http://127.0.0.1:5173**

---

## API Service Usage

### In any React component:
```javascript
import { productsAPI, authAPI, cartAPI } from '../services/apiService';

// Get all products
const products = await productsAPI.getAll();

// Get products by category
const categoryProducts = await productsAPI.getByCategory('Supplement');

// Add to cart
await cartAPI.addItem(productId, quantity);

// Login
await authAPI.login(email, password);
```

---

## Adding New Products in Django Admin

1. Go to: **http://127.0.0.1:8000/admin/**
2. Login with admin credentials
3. Click "Products" → "Add Product"
4. Fill in:
   - **Name**: Product name
   - **Category**: Select category
   - **Status**: Set to "active"
   - **Price**: Set product price
   - **Discount Price** (optional)
5. Click "Save"
6. The product will automatically appear in the frontend!

---

## Troubleshooting

### Products not showing in frontend?
1. Check Django admin: `http://127.0.0.1:8000/admin/shop/product/`
2. Ensure product `status` is set to `"active"`
3. Check browser console for API errors
4. Open DevTools → Network → check `/api/products/` response

### Django Admin UI looks broken?
```bash
cd /workspaces/wellness
python manage.py collectstatic --noinput
```

### Frontend can't reach backend?
1. Ensure both servers are running
2. Check Vite proxy in `frontend/vite.config.js`
3. Check CORS settings in `wellness_project/settings.py`

---

## Update Other Pages

Replace all `fetch('/api/...')` calls with the API service:

### Before:
```javascript
const response = await fetch('/api/products/');
const data = await response.json();
```

### After:
```javascript
import { productsAPI } from '../services/apiService';
const data = await productsAPI.getAll();
```

---

## File Locations

- API Service: `/frontend/src/services/apiService.js`
- API Config: `/frontend/src/services/apiConfig.js`
- Vite Config: `/frontend/vite.config.js`
- Django Settings: `/wellness_project/settings.py`
- Products API: `/shop/api.py`
