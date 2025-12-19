# API Testing Guide

## ✅ Backend API Tests

### 1. Products API
```bash
curl http://127.0.0.1:8000/api/products/
```
**Expected**: JSON array with product data including absolute image URLs

### 2. Cart Add API (requires auth)
```bash
curl -X POST http://127.0.0.1:8000/api/cart/add/ \
  -H "Content-Type: application/json" \
  -d '{"product_id": 1, "quantity": 1}'
```
**Expected**: 401 error (authentication required) or success if logged in

### 3. Cart Get API (requires auth)
```bash
curl http://127.0.0.1:8000/api/cart/
```
**Expected**: 401 error or cart contents if logged in

### 4. Pre-booking API (requires auth)
```bash
curl -X POST http://127.0.0.1:8000/api/prebook/ \
  -H "Content-Type: application/json" \
  -d '{"product_id": 1, "quantity": 1}'
```
**Expected**: 401 error or order created if logged in

## ✅ Frontend Access

### Development URLs
- **Frontend**: http://localhost:5173
- **Backend Admin**: http://127.0.0.1:8000/admin
- **API Direct**: http://127.0.0.1:8000/api/products/

### Important Notes

1. **Admin URL Clarification**:
   - ❌ `/admin/api/products/` - DOES NOT EXIST
   - ✅ `/api/products/` - Correct API endpoint
   - ✅ `/admin/` - Django Admin panel (for managing products)

2. **Frontend Products Page**:
   - Access via: http://localhost:5173
   - Navigate to Products page
   - Products should load automatically from `/api/products/`

3. **CORS/Proxy**:
   - Vite dev server proxies `/api/*` to Django backend
   - No CORS issues in development

## 🔧 Troubleshooting

### If frontend shows no products:

1. **Check backend is running**:
   ```bash
   curl http://127.0.0.1:8000/api/products/
   ```

2. **Check frontend dev server**:
   ```bash
   cd /workspaces/wellness/frontend
   npm run dev
   ```

3. **Check browser console** (F12):
   - Look for API errors
   - Check Network tab for failed requests

4. **Verify products exist**:
   ```bash
   cd /workspaces/wellness
   python manage.py shell
   >>> from shop.models import Product
   >>> Product.objects.filter(status='active').count()
   ```

### If cart doesn't work:

1. **Must be logged in** - Cart APIs require authentication
2. **Check session cookie** - Should be set after login
3. **Check browser console** for 401 errors

## 🚀 Quick Start

```bash
# Terminal 1: Start Django
cd /workspaces/wellness
python manage.py runserver 0.0.0.0:8000

# Terminal 2: Start Vite
cd /workspaces/wellness/frontend
npm run dev

# Terminal 3: Test API
curl http://127.0.0.1:8000/api/products/
```

Then open browser to: **http://localhost:5173**
