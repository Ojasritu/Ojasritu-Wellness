from django.urls import path
from . import views

urlpatterns = [
    # Root → Home page
    path("", views.home, name="home"),
    # Product listing and detail pages
    path("products/", views.product_list, name="products"),
    path("products/<slug:slug>/", views.product_detail_slug, name="product_detail"),

    # Legacy numeric id detail (optional)
    path("product/<int:product_id>/", views.product_detail, name="product_detail_id"),

    # Cart pages (server-rendered session cart)
    path("cart/", views.cart_view, name="cart"),
    path("cart/add/<int:product_id>/", views.add_to_cart, name="add_to_cart"),
    path("cart/remove/<int:item_id>/", views.remove_from_cart, name="remove_from_cart"),

    # Checkout and success pages (if used)
    path("checkout/", views.checkout, name="checkout"),
    path("success/", views.success, name="success"),
]
