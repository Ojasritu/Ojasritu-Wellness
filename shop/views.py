from django.shortcuts import render, redirect
from django.shortcuts import get_object_or_404
from .models import Product
from django.conf import settings
from django.http import JsonResponse, HttpResponse

def home(request):
    products = Product.objects.all()
    return render(request, "home.html", {"products": products})

def checkout(request):
    products = Product.objects.all()
    total = sum(p.price for p in products)
    return render(request, "checkout.html", {"products": products, "total": total, "stripe_pub": settings.STRIPE_PUBLISHABLE_KEY})

def success(request):
    return render(request, "success.html")


def health(request):
    """Simple health endpoint for platform healthchecks."""
    return HttpResponse("OK", content_type="text/plain")


# Compatibility helpers & simple views used by URLs
def product_list(request):
    """Server-rendered product listing page with basic filters."""
    qs = Product.objects.filter(status='active')
    search = request.GET.get('search')
    category = request.GET.get('category')
    dosha = request.GET.get('dosha')
    bestseller = request.GET.get('bestseller')

    if search:
        from django.db.models import Q
        qs = qs.filter(Q(name__icontains=search) | Q(description__icontains=search))
    if category:
        qs = qs.filter(category__slug=category)
    if dosha:
        qs = qs.filter(dosha_type=dosha)
    if bestseller:
        qs = qs.filter(is_bestseller=True)

    return render(request, "products.html", {"products": qs})


def product_detail(request, product_id):
    """Product detail by numeric id (legacy)."""
    product = get_object_or_404(Product, pk=product_id)
    return render(request, "product_detail.html", {"product": product})


def product_detail_slug(request, slug):
    """Product detail by slug (preferred)."""
    product = get_object_or_404(Product, slug=slug, status='active')
    return render(request, "product_detail.html", {"product": product})


def cart_view(request):
    """Render the cart page (session-backed cart)."""
    return render(request, "cart.html", {})


def add_to_cart(request, product_id):
    """Add one unit of product to session cart and redirect to cart."""
    try:
        Product.objects.get(pk=product_id)
    except Product.DoesNotExist:
        return HttpResponse("Product not found", status=404)
    cart = request.session.get('cart', {})
    cart[str(product_id)] = cart.get(str(product_id), 0) + 1
    request.session['cart'] = cart
    return redirect('cart')


def remove_from_cart(request, item_id):
    """Remove an item from the session cart by product id and redirect."""
    cart = request.session.get('cart', {})
    cart.pop(str(item_id), None)
    request.session['cart'] = cart
    return redirect('cart')


def account(request):
    if not request.user.is_authenticated:
        return redirect('/login')
    return render(request, 'account.html', {})


def signup_view(request):
    return render(request, 'signup.html', {})


def contact_view(request):
    """Handle contact form submissions (simple save) and render contact page."""
    if request.method == 'POST':
        from .models import ContactMessage
        name = request.POST.get('name', '')
        email = request.POST.get('email', '')
        subject = request.POST.get('subject', '')
        message = request.POST.get('message', '')
        if name and email and subject and message:
            ContactMessage.objects.create(name=name, email=email, subject=subject, message=message)
            return render(request, 'contact.html', {'success': True})
    return render(request, 'contact.html', {})


# ===== POLICY PAGES =====
def shipping_policy(request):
    """Shipping Policy page"""
    return render(request, 'policies/shipping_policy.html', {})


def terms_and_conditions(request):
    """Terms and Conditions page"""
    return render(request, 'policies/terms_and_conditions.html', {})


def cancellation_refund_policy(request):
    """Cancellation & Refund Policy page"""
    return render(request, 'policies/cancellation_refund_policy.html', {})


def privacy_policy(request):
    """Privacy Policy page"""
    return render(request, 'policies/privacy_policy.html', {})
