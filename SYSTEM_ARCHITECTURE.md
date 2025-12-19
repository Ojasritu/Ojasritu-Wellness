# System Architecture Diagram

## Complete System Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
│                  http://127.0.0.1:5173                         │
└─────────────────────────────────────────────────────────────────┘
                                 │
                    Vite Dev Server (5173)
                                 │
┌─────────────────────────────────────────────────────────────────┐
│                     REACT FRONTEND                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │            React Components                              │   │
│  │                                                           │   │
│  │  - Home.jsx          - Products.jsx  ✨ UPDATED          │   │
│  │  - Blog.jsx          - Cart.jsx                          │   │
│  │  - Contact.jsx       - Checkout.jsx                      │   │
│  │  - Login.jsx         - Profile.jsx                       │   │
│  │                                                           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                            ↓                                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │        API SERVICE LAYER ✨ NEW                           │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  apiService.js                                     │  │   │
│  │  │  ┌──────────────────────────────────────────────┐  │  │   │
│  │  │  │ • productsAPI                               │  │  │   │
│  │  │  │ • cartAPI                                   │  │  │   │
│  │  │  │ • authAPI                                   │  │  │   │
│  │  │  │ • ordersAPI                                 │  │  │   │
│  │  │  │ • categoriesAPI                             │  │  │   │
│  │  │  │ • articlesAPI                               │  │  │   │
│  │  │  │ • faqsAPI                                   │  │  │   │
│  │  │  │ • contactAPI                                │  │  │   │
│  │  │  └──────────────────────────────────────────────┘  │  │   │
│  │  │                                                     │  │   │
│  │  │  Features:                                         │  │   │
│  │  │  ✓ Automatic error handling                       │  │   │
│  │  │  ✓ Request/response logging                       │  │   │
│  │  │  ✓ CORS support                                   │  │   │
│  │  │  ✓ CSRF token management                          │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │                                                           │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  apiConfig.js                                      │  │   │
│  │  │  ✓ Environment detection                          │  │   │
│  │  │  ✓ Base URL management                            │  │   │
│  │  │  ✓ Retry configuration                            │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                            ↓                                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │           VITE PROXY CONFIGURATION                       │   │
│  │                                                           │   │
│  │  /api/* → http://127.0.0.1:8000/api/*                   │   │
│  │                                                           │   │
│  │  Benefits:                                               │   │
│  │  ✓ No CORS issues in development                        │   │
│  │  ✓ Same-origin API calls                                │   │
│  │  ✓ Automatic URL rewriting                              │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  vite.config.js Configuration:                                   │
│  {                                                               │
│    proxy: {                                                      │
│      '/api': {                                                   │
│        target: 'http://127.0.0.1:8000',                         │
│        changeOrigin: true,                                       │
│        secure: false                                             │
│      }                                                            │
│    }                                                              │
│  }                                                               │
└─────────────────────────────────────────────────────────────────┘
                                 │
                    HTTP Request (via proxy)
                                 │
┌─────────────────────────────────────────────────────────────────┐
│                    DJANGO BACKEND                               │
│              http://127.0.0.1:8000                             │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Django URL Routing                         │   │
│  │                                                          │   │
│  │  /api/products/        → ProductViewSet                │   │
│  │  /api/categories/      → CategoryViewSet               │   │
│  │  /api/cart/            → Cart endpoints                │   │
│  │  /api/orders/          → OrderViewSet                  │   │
│  │  /api/auth/            → Authentication endpoints      │   │
│  │  /admin/               → Django Admin Interface         │   │
│  │  /media/               → Uploaded files                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                            ↓                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │           Django REST Framework                         │   │
│  │                                                          │   │
│  │  • Serializers        (data validation & formatting)    │   │
│  │  • ViewSets           (CRUD operations)                 │   │
│  │  • Routers            (auto URL generation)             │   │
│  │  • Authentication     (session + CSRF)                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                            ↓                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │            Django Models (Business Logic)               │   │
│  │                                                          │   │
│  │  • Product          (name, price, category, etc)        │   │
│  │  • Category         (product categories)                │   │
│  │  • Cart / CartItem  (shopping cart)                     │   │
│  │  • Order            (customer orders)                   │   │
│  │  • User / Profile   (user accounts)                     │   │
│  │  • Article          (blog posts)                        │   │
│  │  • FAQ              (frequently asked questions)        │   │
│  │  • ContactMessage   (contact form submissions)          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                            ↓                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              SQLite3 Database                           │   │
│  │            (db.sqlite3)                                │   │
│  │                                                          │   │
│  │  • Currently: 1 active product                         │   │
│  │  • Status: Production-ready                            │   │
│  │  • Admin access: Via Django admin panel                │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Django Admin Interface:                                        │
│  http://127.0.0.1:8000/admin/                                 │
│  ├─ Products Management     ← ADD NEW PRODUCTS HERE            │
│  ├─ Category Management                                         │
│  ├─ User Management                                             │
│  └─ Other models                                                │
└─────────────────────────────────────────────────────────────────┘

```

## Data Flow Example: Fetching Products

```
1. User visits frontend
   http://127.0.0.1:5173

2. Products.jsx component mounts
   ↓
   import { productsAPI } from '../services/apiService'
   ↓
   const data = await productsAPI.getAll()

3. API Service makes request
   ↓
   fetch('/api/products/', {
     credentials: 'include',
     headers: { 'Accept': 'application/json' }
   })

4. Vite Proxy intercepts
   Request:  http://127.0.0.1:5173/api/products/
   Proxies to: http://127.0.0.1:8000/api/products/

5. Django Backend processes
   ↓
   URL Router matches /api/products/
   ↓
   ProductViewSet.list()
   ↓
   Query database: Product.objects.all()
   ↓
   Serialize data with ProductSerializer
   ↓
   Return JSON response

6. Response flows back
   ↓
   Django sends 200 OK with JSON
   ↓
   Vite proxy forwards to frontend
   ↓
   apiService receives response
   ↓
   API service parses JSON and logs

7. React component receives data
   ↓
   setAllProducts(data)
   ↓
   Component re-renders with products

8. User sees products on page! ✨
```

## Adding a New Product Flow

```
1. Admin goes to: http://127.0.0.1:8000/admin/shop/product/add/

2. Fills form:
   ├─ Name: "New Product"
   ├─ Price: 999.00
   ├─ Category: "Supplement"
   ├─ Status: "active"
   └─ Description: "..."

3. Clicks Save

4. Django saves to database
   ↓
   Product(
     name="New Product",
     price=999.00,
     category=...,
     status="active"
   ).save()

5. User visits frontend
   ↓
   Products.jsx fetches via apiService.getAll()
   ↓
   Queries: SELECT * FROM shop_product WHERE status='active'
   ↓
   NEW PRODUCT APPEARS! ✨

6. No reload needed - works instantly!
```

## Files & Their Roles

```
Frontend (React)
├── src/
│   ├── pages/
│   │   └── Products.jsx ✨ UPDATED (uses apiService)
│   ├── services/
│   │   ├── apiService.js ✨ NEW (API layer)
│   │   └── apiConfig.js ✨ NEW (configuration)
│   ├── App.jsx
│   └── main.jsx
├── vite.config.js (proxy configuration)
└── package.json

Backend (Django)
├── shop/
│   ├── api.py (REST endpoints)
│   ├── models.py (database models)
│   ├── views.py (HTML views)
│   ├── urls.py (URL routing)
│   └── admin.py (Django admin)
├── wellness_project/
│   ├── settings.py (configuration)
│   ├── urls.py (main routing)
│   └── wsgi.py (production server)
├── manage.py (Django CLI)
└── db.sqlite3 (database)

Documentation ✨
├── QUICK_START.md
├── FULL_STACK_SETUP.md
├── API_CONNECTION_GUIDE.md
├── ISSUES_FIXED_SUMMARY.md
└── FINAL_STATUS_REPORT.md

Automation ✨
└── start_all.sh (one-command startup)
```

## Environment Variables & Configuration

```
Development:
├── Frontend base URL: /api (via Vite proxy)
├── Backend: http://127.0.0.1:8000
├── CORS: Enabled for dev domains
└── Debug: True

Production:
├── Frontend base URL: /api (same origin)
├── Backend: https://ojasritu.co.in
├── CORS: Limited to production domains
└── Debug: False
```

---

**This architecture ensures:**
- ✅ Clean separation of concerns
- ✅ Easy debugging and testing
- ✅ Scalable API structure
- ✅ Reusable API service layer
- ✅ Simple environment-aware configuration
