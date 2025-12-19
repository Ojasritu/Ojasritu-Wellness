# 🚀 QUICK START REFERENCE

## One-Command Start (Recommended)
```bash
bash /workspaces/wellness/start_all.sh
```

## URLs to Access
| Service | URL |
|---------|-----|
| **Frontend** | http://127.0.0.1:5173 |
| **Backend API** | http://127.0.0.1:8000/api |
| **Admin Panel** | http://127.0.0.1:8000/admin |

## Add New Product
1. Go to: http://127.0.0.1:8000/admin/shop/product/add/
2. Fill form (name, price, category, status="active")
3. Click Save
4. Check frontend - product appears instantly!

## Update React Components to Use API Service

### Before (Old Way - Don't Use)
```javascript
const response = await fetch('/api/products/');
const data = await response.json();
```

### After (New Way - Use This)
```javascript
import { productsAPI } from '../services/apiService';
const data = await productsAPI.getAll();
```

## Available API Methods

### Products
```javascript
productsAPI.getAll()                      // All products
productsAPI.getBySlug(slug)               // Single product
productsAPI.getByCategory(category)       // By category
productsAPI.getBestSellers()              // Best sellers
```

### Cart
```javascript
cartAPI.get()                             // Get cart
cartAPI.addItem(productId, quantity)      // Add item
cartAPI.removeItem(itemId)                // Remove item
```

### Auth
```javascript
authAPI.signup(data)                      // Sign up
authAPI.login(email, password)            // Login
authAPI.logout()                          // Logout
authAPI.getProfile()                      // User profile
```

### Other
```javascript
categoriesAPI.getAll()                    // Get categories
articlesAPI.getAll()                      // Blog articles
faqsAPI.getAll()                          // FAQs
ordersAPI.getAll()                        // User orders
contactAPI.submit(data)                   // Contact form
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Products not showing | Check status="active" in admin |
| Admin UI broken | Run `python manage.py collectstatic --noinput` |
| Frontend can't reach API | Check both servers running and Vite proxy in vite.config.js |
| Port 8000 in use | `pkill -f "manage.py runserver"` |

## File Locations

| What | Where |
|------|-------|
| API Service | `/frontend/src/services/apiService.js` |
| API Config | `/frontend/src/services/apiConfig.js` |
| Vite Config | `/frontend/vite.config.js` |
| Django API | `/shop/api.py` |
| Django Settings | `/wellness_project/settings.py` |

## Manual Start (If Not Using start_all.sh)

**Terminal 1:**
```bash
cd /workspaces/wellness
python manage.py runserver 127.0.0.1:8000
```

**Terminal 2:**
```bash
cd /workspaces/wellness/frontend
npm run dev
```

## View Logs

```bash
tail -f /tmp/backend.log   # Backend
tail -f /tmp/frontend.log  # Frontend
```

## Kill All Servers
```bash
pkill -f "runserver\|npm run dev"
```

---

**That's it! Everything is set up and ready to go. 🎉**
