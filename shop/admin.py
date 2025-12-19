from django.contrib import admin
from .models import (
    Category, Product, ProductReview, Cart, CartItem,
    Order, Booking, Rebooking, Article, FAQ, ContactMessage, GurukulNotification, BlogPost
)

# ✅ CATEGORY ADMIN
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'hindi_name', 'slug']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name', 'hindi_name']


# ✅ PRODUCT ADMIN
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'discount_price', 'status', 'is_bestseller', 'quantity_in_stock']
    list_filter = ['status', 'category', 'dosha_type', 'is_bestseller', 'is_featured', 'is_organic', 'created_at']
    search_fields = ['name', 'hindi_name', 'description', 'sku']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['created_at', 'updated_at']


# ✅ PRODUCT REVIEW ADMIN
@admin.register(ProductReview)
class ProductReviewAdmin(admin.ModelAdmin):
    list_display = ['product', 'customer', 'rating', 'verified_purchase', 'created_at']
    list_filter = ['rating', 'verified_purchase', 'created_at']
    search_fields = ['product__name', 'customer__username', 'comment']
    readonly_fields = ['created_at', 'updated_at']


# ✅ CART ADMIN
@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['customer', 'created_at', 'updated_at']
    search_fields = ['customer__username', 'customer__email']
    readonly_fields = ['created_at', 'updated_at']


# ✅ CART ITEM ADMIN
@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ['product', 'cart', 'quantity', 'added_at']
    list_filter = ['product__category', 'added_at']
    search_fields = ['product__name', 'cart__customer__username']
    readonly_fields = ['added_at']


# ✅ ORDER ADMIN
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_id', 'customer', 'final_amount', 'status', 'payment_status', 'created_at']
    list_filter = ['status', 'payment_status', 'payment_method', 'created_at']
    search_fields = ['order_id', 'customer__username', 'customer__email', 'transaction_id']
    readonly_fields = ['order_id', 'created_at', 'updated_at']


# ✅ BOOKING ADMIN
@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'booking_date', 'booking_time', 'status']
    list_filter = ['status', 'booking_date']
    search_fields = ['user__username', 'user__email']
    readonly_fields = ['created_at', 'updated_at']


# ✅ REBOOKING ADMIN
@admin.register(Rebooking)
class RebookingAdmin(admin.ModelAdmin):
    list_display = ['id', 'customer', 'consultation_type', 'scheduled_date', 'status', 'is_paid']
    list_filter = ['status', 'consultation_type', 'scheduled_date', 'is_paid']
    search_fields = ['customer__username', 'customer__email', 'health_concerns']
    filter_horizontal = ['recommended_products']
    readonly_fields = ['created_at', 'updated_at']


# ✅ ARTICLE ADMIN
@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'category', 'views', 'is_featured', 'is_published', 'created_at']
    list_filter = ['is_published', 'is_featured', 'category', 'created_at']
    search_fields = ['title', 'hindi_title', 'content']
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ['views', 'created_at', 'updated_at']


# ✅ FAQ ADMIN
@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ['question_en', 'category', 'order', 'is_active']
    list_filter = ['category', 'is_active', 'order']
    search_fields = ['question_en', 'question_hi', 'answer_en', 'answer_hi']
    ordering = ['order']


# ✅ CONTACT MESSAGE ADMIN
@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'category', 'is_resolved', 'created_at']
    list_filter = ['category', 'is_resolved', 'created_at']
    search_fields = ['name', 'email', 'subject', 'message']
    readonly_fields = ['created_at']


# ✅ GURUKUL NOTIFICATION ADMIN
@admin.register(GurukulNotification)
class GurukulNotificationAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'created_at']
    search_fields = ['name', 'email']
    readonly_fields = ['created_at']


# ✅ BLOGPOST ADMIN (Legacy Support)
@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'published', 'is_featured']
    list_filter = ['published', 'is_featured']
    search_fields = ['title', 'content']
    prepopulated_fields = {'slug': ('title',)}
