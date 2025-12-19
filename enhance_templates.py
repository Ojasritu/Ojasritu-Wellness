#!/usr/bin/env python3
"""
Script to enhance all Django templates with modern design, animations, and proper structure
"""

# Enhanced home.html
home_html = '''{% extends 'base.html' %}
{% load static %}

{% block title %}Wellness - Your Health & Wellness Store{% endblock %}

{% block extra_css %}
<style>
    /* Hero Section with Animation */
    .hero-section {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 100px 0;
        color: white;
        position: relative;
        overflow: hidden;
        animation: gradientShift 10s ease infinite;
    }
    
    @keyframes gradientShift {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
    }
    
    .hero-content {
        position: relative;
        z-index: 2;
        animation: fadeInUp 1s ease;
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
    
    .hero-title {
        font-size: 3.5rem;
        font-weight: 700;
        margin-bottom: 20px;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
    }
    
    .hero-subtitle {
        font-size: 1.5rem;
        margin-bottom: 30px;
        opacity: 0.95;
    }
    
    .btn-hero {
        padding: 15px 40px;
        font-size: 1.2rem;
        border-radius: 50px;
        transition: all 0.3s ease;
        background: white;
        color: #667eea;
        border: none;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }
    
    .btn-hero:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 20px rgba(0,0,0,0.3);
    }
    
    /* Features Section */
    .features-section {
        padding: 80px 0;
        background: #f8f9fa;
    }
    
    .feature-card {
        padding: 40px;
        background: white;
        border-radius: 15px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.08);
        transition: all 0.3s ease;
        margin-bottom: 30px;
        animation: fadeIn 1s ease;
    }
    
    .feature-card:hover {
        transform: translateY(-10px);
        box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    .feature-icon {
        font-size: 3rem;
        color: #667eea;
        margin-bottom: 20px;
    }
    
    /* Products Preview Section */
    .products-preview {
        padding: 80px 0;
    }
    
    .product-card {
        border: none;
        border-radius: 15px;
        overflow: hidden;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        transition: all 0.3s ease;
        margin-bottom: 30px;
    }
    
    .product-card:hover {
        transform: scale(1.05);
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }
    
    .product-card img {
        height: 250px;
        object-fit: cover;
        transition: transform 0.5s ease;
    }
    
    .product-card:hover img {
        transform: scale(1.1);
    }
    
    .product-title {
        font-size: 1.2rem;
        font-weight: 600;
        color: #333;
        margin: 15px 0 10px;
    }
    
    .product-price {
        font-size: 1.5rem;
        color: #667eea;
        font-weight: 700;
    }
    
    /* Testimonials Section */
    .testimonials-section {
        padding: 80px 0;
        background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
        color: white;
    }
    
    .testimonial-card {
        background: rgba(255,255,255,0.1);
        padding: 30px;
        border-radius: 15px;
        backdrop-filter: blur(10px);
        margin-bottom: 30px;
        animation: slideIn 1s ease;
    }
    
    @keyframes slideIn {
        from { transform: translateX(-50px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .section-title {
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 50px;
        text-align: center;
    }
</style>
{% endblock %}

{% block content %}
<!-- Hero Section -->
<section class="hero-section">
    <div class="container">
        <div class="row align-items-center">
            <div class="col-lg-7 hero-content">
                <h1 class="hero-title">Welcome to Wellness</h1>
                <p class="hero-subtitle">Your trusted partner for health and wellness products</p>
                <a href="{% url 'products' %}" class="btn btn-hero">Shop Now</a>
            </div>
            <div class="col-lg-5">
                <img src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=600" alt="Wellness" class="img-fluid rounded-3 shadow-lg" style="animation: fadeInRight 1s ease;">
            </div>
        </div>
    </div>
</section>

<!-- Features Section -->
<section class="features-section">
    <div class="container">
        <h2 class="section-title" style="color: #333;">Why Choose Us</h2>
        <div class="row">
            <div class="col-md-4">
                <div class="feature-card text-center">
                    <div class="feature-icon">🌿</div>
                    <h3>Natural Products</h3>
                    <p>100% organic and natural wellness products carefully selected for you</p>
                </div>
            </div>
            <div class="col-md-4">
                <div class="feature-card text-center">
                    <div class="feature-icon">🚚</div>
                    <h3>Fast Delivery</h3>
                    <p>Quick and reliable delivery right to your doorstep</p>
                </div>
            </div>
            <div class="col-md-4">
                <div class="feature-card text-center">
                    <div class="feature-icon">💯</div>
                    <h3>Quality Guaranteed</h3>
                    <p>Premium quality products with satisfaction guarantee</p>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Featured Products -->
<section class="products-preview">
    <div class="container">
        <h2 class="section-title" style="color: #333;">Featured Products</h2>
        <div class="row">
            {% if products %}
                {% for product in products %}
                <div class="col-md-4">
                    <div class="product-card card">
                        <img src="{{ product.image.url }}" class="card-img-top" alt="{{ product.name }}">
                        <div class="card-body text-center">
                            <h3 class="product-title">{{ product.name }}</h3>
                            <p class="product-price">${{ product.price }}</p>
                            <a href="{% url 'products' %}" class="btn btn-primary">View Details</a>
                        </div>
                    </div>
                </div>
                {% endfor %}
            {% else %}
                <div class="col-md-4">
                    <div class="product-card card">
                        <img src="https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=400" class="card-img-top" alt="Vitamins">
                        <div class="card-body text-center">
                            <h3 class="product-title">Multivitamin Pack</h3>
                            <p class="product-price">$29.99</p>
                            <a href="{% url 'products' %}" class="btn btn-primary">View Details</a>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="product-card card">
                        <img src="https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400" class="card-img-top" alt="Protein">
                        <div class="card-body text-center">
                            <h3 class="product-title">Protein Powder</h3>
                            <p class="product-price">$39.99</p>
                            <a href="{% url 'products' %}" class="btn btn-primary">View Details</a>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="product-card card">
                        <img src="https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400" class="card-img-top" alt="Wellness">
                        <div class="card-body text-center">
                            <h3 class="product-title">Wellness Bundle</h3>
                            <p class="product-price">$49.99</p>
                            <a href="{% url 'products' %}" class="btn btn-primary">View Details</a>
                        </div>
                    </div>
                </div>
            {% endif %}
        </div>
    </div>
</section>

<!-- Testimonials -->
<section class="testimonials-section">
    <div class="container">
        <h2 class="section-title">What Our Customers Say</h2>
        <div class="row">
            <div class="col-md-4">
                <div class="testimonial-card">
                    <p>"Amazing products! My health has improved significantly."</p>
                    <strong>- Sarah Johnson</strong>
                </div>
            </div>
            <div class="col-md-4">
                <div class="testimonial-card">
                    <p>"Fast delivery and excellent customer service!"</p>
                    <strong>- Mike Chen</strong>
                </div>
            </div>
            <div class="col-md-4">
                <div class="testimonial-card">
                    <p>"Best wellness store I've ever shopped at."</p>
                    <strong>- Emily Davis</strong>
                </div>
            </div>
        </div>
    </div>
</section>
{% endblock %}
'''

# Write the enhanced home.html
with open('templates/home.html', 'w') as f:
    f.write(home_html)

print("✅ home.html enhanced successfully!")
