# 🌿 Ojasritu Wellness - Full Stack Setup Guide

## ✅ What's Fixed

1. **API Connection Layer**: Created a centralized API service for all frontend-backend communication
2. **Frontend Products Page**: Updated to use the new API service
3. **Static Files**: Collected for proper Django admin UI
4. **Development Environment**: Configured Vite proxy for seamless API calls
5. **Product Sync**: Products added in Django admin now properly appear in frontend

---

## 🚀 Quick Start

### Option 1: One Command (Recommended)
```bash
cd /workspaces/wellness
bash start_all.sh
```

This will:
- ✅ Collect static files
- ✅ Run migrations
- ✅ Start backend on http://127.0.0.1:8000
- ✅ Start frontend on http://127.0.0.1:5173

### Option 2: Manual Setup

**Terminal 1 - Backend:**
```bash
cd /workspaces/wellness
python manage.py runserver 127.0.0.1:8000
```

**Terminal 2 - Frontend:**
```bash
cd /workspaces/wellness/frontend
npm run dev
```

---

## 📱 Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://127.0.0.1:5173 | Main website |
| **Backend API** | http://127.0.0.1:8000/api | REST API |
| **Admin Panel** | http://127.0.0.1:8000/admin | Add products, manage content |
| **Database Admin** | http://127.0.0.1:8000/admin/shop/product | Product management |

---

## 📝 Adding Products

### Step 1: Open Admin Panel
Visit: **http://127.0.0.1:8000/admin/**

Login with your superuser credentials:
```
Username: admin
Password: (your password)
```

### Step 2: Add New Product
1. Click **"Shop" → "Products"**
2. Click **"+ Add Product"**
3. Fill in the form:

| Field | Example | Required |
|-------|---------|----------|
| **Name** | Anti-Aging Supplement | ✓ Yes |
| **Category** | Supplement | ✓ Yes |
| **Price** | 1999.00 | ✓ Yes |
| **Discount Price** | 1499.00 | ✗ No |
| **Status** | active | ✓ Yes |
| **Description** | Full product description | ✓ Yes |
| **Benefits** | List of benefits | ✗ No |
| **Image** | Upload image | ✗ No |

### Step 3: Save Product
Click **"Save"** button.

### Step 4: Verify in Frontend
Visit **http://127.0.0.1:5173/products** - Your new product should appear within seconds!

---

## 🛠️ API Service Files

### New Files Created:

1. **`/frontend/src/services/apiService.js`**
   - Main API communication layer
   - All API methods centralized here
   - Automatic error handling and logging

2. **`/frontend/src/services/apiConfig.js`**
   - Configuration for API connection
   - Environment detection (dev/prod)
   - Base URL management

3. **`/start_all.sh`**
   - One-command startup script
   - Handles both backend and frontend

---

## 💻 Using the API Service in React

### Example 1: Fetch All Products
```javascript
import { productsAPI } from '../services/apiService';

useEffect(() => {
  const loadProducts = async () => {
    try {
      const products = await productsAPI.getAll();
      console.log('Products:', products);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  loadProducts();
}, []);
```

### Example 2: Add to Cart
```javascript
import { cartAPI } from '../services/apiService';

const handleAddToCart = async (productId) => {
  try {
    await cartAPI.addItem(productId, quantity);
    alert('Added to cart!');
  } catch (error) {
    alert('Error: ' + error.message);
  }
};
```

### Example 3: User Login
```javascript
import { authAPI } from '../services/apiService';

const handleLogin = async (email, password) => {
  try {
    const response = await authAPI.login(email, password);
    console.log('Logged in:', response);
  } catch (error) {
    alert('Login failed: ' + error.message);
  }
};
```

### Available API Methods:

```javascript
// Products
productsAPI.getAll()
productsAPI.getBySlug(slug)
productsAPI.getByCategory(category)
productsAPI.getBestSellers()

// Categories
categoriesAPI.getAll()
categoriesAPI.getBySlug(slug)

// Cart
cartAPI.get()
cartAPI.addItem(productId, quantity)
cartAPI.removeItem(itemId)

// Orders
ordersAPI.getAll()
ordersAPI.get(orderId)
ordersAPI.create(orderData)

// Authentication
authAPI.signup(userData)
authAPI.login(email, password)
authAPI.logout()
authAPI.checkAuth()
authAPI.getProfile()

// Articles/Blog
articlesAPI.getAll()
articlesAPI.getBySlug(slug)

// FAQs
faqsAPI.getAll()

// Contact
contactAPI.submit(contactData)

// Rebookings
rebookingsAPI.getAll()
rebookingsAPI.create(rebookingData)
```

---

## 🔄 How the Connection Works

### Development Flow:
```
Browser (http://127.0.0.1:5173)
    ↓
React Component (imports productsAPI)
    ↓
apiService.js (makes fetch request to /api/products/)
    ↓
Vite Dev Server (proxy middleware)
    ↓
Django Backend (http://127.0.0.1:8000/api/products/)
    ↓
Database Query
    ↓
Response flows back through the chain
```

### Important: Vite Proxy Configuration
The Vite dev server proxies `/api/*` requests to the Django backend:
```javascript
// vite.config.js
proxy: {
  '/api': {
    target: 'http://127.0.0.1:8000',  // Backend URL
    changeOrigin: true,
    secure: false,
  }
}
```

This means:
- Request to: `http://127.0.0.1:5173/api/products/`
- Gets proxied to: `http://127.0.0.1:8000/api/products/`

---

## ❌ Troubleshooting

### Problem: Products not showing in frontend

**Solution:**
1. Check Django admin: http://127.0.0.1:8000/admin/shop/product/
2. Ensure product status is set to **"active"**
3. Open browser DevTools (F12) → Network tab
4. Look for `/api/products/` request
5. Check if products are in the response

### Problem: Django admin UI looks broken

**Solution:**
```bash
cd /workspaces/wellness
python manage.py collectstatic --noinput
```
Then refresh the admin page.

### Problem: Frontend can't reach backend

**Solution:**
1. Verify both servers are running:
   ```bash
   ps aux | grep "runserver\|npm run dev"
   ```
2. Check backend on http://127.0.0.1:8000 directly
3. Check browser console for CORS errors
4. Verify `vite.config.js` proxy configuration

### Problem: Port 8000 already in use

**Solution:**
```bash
# Kill existing Django processes
pkill -f "manage.py runserver"

# Kill existing Node processes
pkill -f "npm run dev"

# Then start again
bash start_all.sh
```

---

## 📊 Project Structure

```
/workspaces/wellness/
├── manage.py                          # Django management
├── wellness_project/                  # Django settings
│   ├── settings.py                   # Project configuration
│   ├── urls.py                       # URL routing
│   └── wsgi.py                       # Production server
├── shop/                             # Django app
│   ├── models.py                     # Database models
│   ├── api.py                        # REST API endpoints
│   ├── urls.py                       # API URL routing
│   └── views.py                      # HTML views
├── frontend/                         # React application
│   ├── vite.config.js               # Vite configuration (proxy)
│   ├── src/
│   │   ├── services/
│   │   │   ├── apiService.js        # ✨ API communication layer
│   │   │   └── apiConfig.js         # ✨ API configuration
│   │   ├── pages/
│   │   │   └── Products.jsx         # ✨ Updated to use API service
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── start_all.sh                      # ✨ One-command startup
├── API_CONNECTION_GUIDE.md           # ✨ This guide
└── db.sqlite3                        # SQLite database
```

---

## 🔐 Environment Variables

Create a `.env` file in the root if needed:
```env
DJANGO_DEBUG=False
DJANGO_SECRET_KEY=your-secret-key
DATABASE_URL=sqlite:///db.sqlite3
GOOGLE_CLIENT_ID=your-google-client-id
```

---

## 📚 Next Steps

1. ✅ Test the setup: http://127.0.0.1:5173
2. 📝 Add products via admin panel
3. 🎨 Customize frontend components
4. 🚀 Deploy to production (Railway/etc.)

---

## 🆘 Need Help?

- Check the logs:
  ```bash
  tail -f /tmp/backend.log  # Backend logs
  tail -f /tmp/frontend.log # Frontend logs
  ```
- Check Django admin: http://127.0.0.1:8000/admin/
- Check API directly: http://127.0.0.1:8000/api/

---

## 📄 Important Files Updated

- ✨ **Created**: `/frontend/src/services/apiService.js` - Main API layer
- ✨ **Created**: `/frontend/src/services/apiConfig.js` - Configuration
- ✨ **Updated**: `/frontend/src/pages/Products.jsx` - Uses API service
- ✨ **Created**: `/start_all.sh` - Startup script
- ✨ **Created**: `API_CONNECTION_GUIDE.md` - Quick reference

---

**Happy building! 🌿**
