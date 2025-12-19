#!/usr/bin/env python3
"""Enhance all Django templates with modern design"""

# PRODUCTS.HTML
products_html = """{% extends 'base.html' %}
{% load static %}

{% block title %}Products - Wellness Store{% endblock %}

{% block extra_css %}
<style>
    .products-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 60px 0;
        color: white;
        text-align: center;
    }
    
    .filter-section {
        background: #f8f9fa;
        padding: 30px;
        border-radius: 10px;
        margin-bottom: 30px;
    }
    
    .product-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 30px;
        padding: 30px 0;
    }
    
    .product-item {
        background: white;
        border-radius: 15px;
        overflow: hidden;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        transition: all 0.3s ease;
        animation: fadeInUp 0.6s ease;
    }
    
    .product-item:hover {
        transform: translateY(-10px);
        box-shadow: 0 15px 35px rgba(0,0,0,0.2);
    }
    
    .product-image {
        height: 300px;
        overflow: hidden;
    }
    
    .product-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
    }
    
    .product-item:hover .product-image img {
        transform: scale(1.1);
    }
    
    .product-info {
        padding: 20px;
    }
    
    .product-name {
        font-size: 1.3rem;
        font-weight: 600;
        color: #333;
        margin-bottom: 10px;
    }
    
    .product-price {
        font-size: 1.8rem;
        color: #667eea;
        font-weight: 700;
        margin: 15px 0;
    }
    
    .btn-add-cart {
        width: 100%;
        padding: 12px;
        background: #667eea;
        color: white;
        border: none;
        border-radius: 8px;
        transition: all 0.3s ease;
    }
    
    .btn-add-cart:hover {
        background: #5568d3;
        transform: scale(1.05);
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>
{% endblock %}

{% block content %}
<section class="products-header">
    <div class="container">
        <h1 class="display-4">Our Products</h1>
        <p class="lead">Discover premium wellness products</p>
    </div>
</section>

<div class="container mt-5 mb-5">
    <div class="filter-section">
        <form method="GET" action="{% url 'products' %}">
            <div class="row">
                <div class="col-md-4">
                    <input type="text" name="search" class="form-control" placeholder="Search products..." value="{{ request.GET.search }}">
                </div>
                <div class="col-md-4">
                    <select name="category" class="form-control">
                        <option value="">All Categories</option>
                        <option value="vitamins">Vitamins</option>
                        <option value="supplements">Supplements</option>
                        <option value="organic">Organic</option>
                    </select>
                </div>
                <div class="col-md-4">
                    <button type="submit" class="btn btn-primary w-100">Filter</button>
                </div>
            </div>
        </form>
    </div>
    
    <div class="product-grid">
        {% if products %}
            {% for product in products %}
            <div class="product-item">
                <div class="product-image">
                    <img src="{{ product.image.url }}" alt="{{ product.name }}">
                </div>
                <div class="product-info">
                    <h3 class="product-name">{{ product.name }}</h3>
                    <p class="text-muted">{{ product.description|truncatewords:15 }}</p>
                    <div class="product-price">\${{ product.price }}</div>
                    <form method="POST" action="{% url 'add_to_cart' product.id %}">
                        {% csrf_token %}
                        <button type="submit" class="btn-add-cart">Add to Cart</button>
                    </form>
                </div>
            </div>
            {% endfor %}
        {% else %}
            <div class="col-12 text-center">
                <img src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500" alt="Products" class="img-fluid mb-4 rounded">
                <h3>No products found</h3>
                <p>Check back soon for new products!</p>
            </div>
        {% endif %}
    </div>
</div>
{% endblock %}
"""

# CART.HTML
cart_html = """{% extends 'base.html' %}
{% load static %}

{% block title %}Shopping Cart - Wellness{% endblock %}

{% block extra_css %}
<style>
    .cart-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 60px 0;
        color: white;
        text-align: center;
    }
    
    .cart-container {
        padding: 50px 0;
    }
    
    .cart-item {
        background: white;
        padding: 25px;
        border-radius: 15px;
        box-shadow: 0 3px 10px rgba(0,0,0,0.1);
        margin-bottom: 20px;
        transition: all 0.3s ease;
        animation: slideIn 0.5s ease;
    }
    
    .cart-item:hover {
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(-30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .cart-item-image {
        width: 120px;
        height: 120px;
        object-fit: cover;
        border-radius: 10px;
    }
    
    .cart-summary {
        background: #f8f9fa;
        padding: 30px;
        border-radius: 15px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        position: sticky;
        top: 20px;
    }
    
    .summary-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 15px;
        font-size: 1.1rem;
    }
    
    .total-row {
        border-top: 2px solid #667eea;
        padding-top: 15px;
        font-size: 1.5rem;
        font-weight: 700;
        color: #667eea;
    }
    
    .btn-checkout {
        width: 100%;
        padding: 15px;
        background: #667eea;
        color: white;
        border: none;
        border-radius: 10px;
        font-size: 1.2rem;
        transition: all 0.3s ease;
    }
    
    .btn-checkout:hover {
        background: #5568d3;
        transform: scale(1.05);
    }
    
    .quantity-control {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .quantity-btn {
        width: 35px;
        height: 35px;
        border: 1px solid #667eea;
        background: white;
        color: #667eea;
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .quantity-btn:hover {
        background: #667eea;
        color: white;
    }
    
    .empty-cart {
        text-align: center;
        padding: 100px 0;
    }
    
    .empty-cart img {
        max-width: 400px;
        margin-bottom: 30px;
    }
</style>
{% endblock %}

{% block content %}
<section class="cart-header">
    <div class="container">
        <h1 class="display-4">Shopping Cart</h1>
        <p class="lead">Review your items</p>
    </div>
</section>

<div class="container cart-container">
    {% if cart_items %}
    <div class="row">
        <div class="col-lg-8">
            {% for item in cart_items %}
            <div class="cart-item">
                <div class="row align-items-center">
                    <div class="col-md-3">
                        <img src="{{ item.product.image.url }}" alt="{{ item.product.name }}" class="cart-item-image">
                    </div>
                    <div class="col-md-4">
                        <h4>{{ item.product.name }}</h4>
                        <p class="text-muted">{{ item.product.description|truncatewords:10 }}</p>
                    </div>
                    <div class="col-md-2">
                        <div class="quantity-control">
                            <form method="POST" action="{% url 'update_cart' item.id %}" style="display:inline;">
                                {% csrf_token %}
                                <input type="hidden" name="quantity" value="{{ item.quantity|add:-1 }}">
                                <button type="submit" class="quantity-btn">-</button>
                            </form>
                            <span class="mx-2">{{ item.quantity }}</span>
                            <form method="POST" action="{% url 'update_cart' item.id %}" style="display:inline;">
                                {% csrf_token %}
                                <input type="hidden" name="quantity" value="{{ item.quantity|add:1 }}">
                                <button type="submit" class="quantity-btn">+</button>
                            </form>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <h5 class="text-primary">\${{ item.total_price }}</h5>
                    </div>
                    <div class="col-md-1">
                        <form method="POST" action="{% url 'remove_from_cart' item.id %}">
                            {% csrf_token %}
                            <button type="submit" class="btn btn-danger btn-sm">×</button>
                        </form>
                    </div>
                </div>
            </div>
            {% endfor %}
        </div>
        
        <div class="col-lg-4">
            <div class="cart-summary">
                <h3 class="mb-4">Order Summary</h3>
                <div class="summary-row">
                    <span>Subtotal:</span>
                    <span>\${{ subtotal }}</span>
                </div>
                <div class="summary-row">
                    <span>Shipping:</span>
                    <span>\${{ shipping }}</span>
                </div>
                <div class="summary-row">
                    <span>Tax:</span>
                    <span>\${{ tax }}</span>
                </div>
                <div class="summary-row total-row">
                    <span>Total:</span>
                    <span>\${{ total }}</span>
                </div>
                <button class="btn-checkout mt-4">Proceed to Checkout</button>
            </div>
        </div>
    </div>
    {% else %}
    <div class="empty-cart">
        <img src="https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400" alt="Empty Cart" class="img-fluid rounded">
        <h2>Your cart is empty</h2>
        <p class="lead">Add some products to get started!</p>
        <a href="{% url 'products' %}" class="btn btn-primary btn-lg mt-3">Shop Now</a>
    </div>
    {% endif %}
</div>
{% endblock %}
"""

# Write files
with open('templates/products.html', 'w') as f:
    f.write(products_html)
print("✅ products.html enhanced")

with open('templates/cart.html', 'w') as f:
    f.write(cart_html)
print("✅ cart.html enhanced")

print("\n🎉 All templates enhanced successfully!")
