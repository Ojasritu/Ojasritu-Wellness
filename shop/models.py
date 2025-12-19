from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify
from django.core.validators import MinValueValidator, MaxValueValidator

# ✅ Category Model
class Category(models.Model):
    """Ayurveda product categories"""
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    icon = models.ImageField(upload_to="categories/", blank=True, null=True)
    background_image = models.ImageField(upload_to="categories/bg/", blank=True, null=True)
    hindi_name = models.CharField(max_length=200, blank=True)
    
    class Meta:
        verbose_name_plural = "Categories"
    
    def __str__(self):
        return f"{self.name} ({self.hindi_name})"
    
    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super().save(*args, **kwargs)


# ✅ Product Model - Enhanced
class Product(models.Model):
    """Premium Ayurveda Products with complete details"""
    DOSHA_CHOICES = [
        ('vata', 'वात'),
        ('pitta', 'पित्त'),
        ('kapha', 'कफ'),
        ('tridosha', 'त्रिदोष संतुलित'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'सक्रिय'),
        ('inactive', 'निष्क्रिय'),
        ('discontinued', 'बंद'),
    ]
    
    # Basic Info
    name = models.CharField(max_length=200)
    hindi_name = models.CharField(max_length=200, blank=True)
    slug = models.SlugField(unique=True)
    
    # Description & Benefits
    description = models.TextField()
    benefits = models.TextField(help_text="Health benefits in Hindi")
    ingredients = models.TextField()
    usage_instructions = models.TextField(blank=True, help_text="कैसे उपयोग करें")
    scientific_research = models.TextField(blank=True, help_text="वैज्ञानिक अनुसंधान")
    
    # Pricing
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    bulk_discount = models.JSONField(default=dict, blank=True, help_text="{'10': 10, '50': 15}")
    
    # Product Details
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    
    # Images
    image = models.ImageField(upload_to="products/")
    gallery = models.JSONField(default=list, blank=True)
    thumbnail = models.ImageField(upload_to="products/thumbnails/", blank=True, null=True)
    
    # Ayurveda Specific
    dosha_type = models.CharField(max_length=20, choices=DOSHA_CHOICES)
    ayurvedic_classification = models.CharField(max_length=200, blank=True)
    
    # Inventory & Status
    quantity_in_stock = models.PositiveIntegerField(default=0)
    sku = models.CharField(max_length=100, unique=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    
    # Marketing
    is_bestseller = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)
    is_new = models.BooleanField(default=False)
    is_organic = models.BooleanField(default=False)
    
    # Ratings & Reviews
    rating = models.FloatField(default=0, validators=[MinValueValidator(0), MaxValueValidator(5)])
    total_reviews = models.PositiveIntegerField(default=0)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-is_featured', '-is_bestseller', '-created_at']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['category']),
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.hindi_name})"
    
    def get_discount_percentage(self):
        if self.discount_price:
            return int(((self.price - self.discount_price) / self.price) * 100)
        return 0
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        if not self.sku:
            self.sku = f"PRD-{self.name[:3].upper()}-{self.id}"
        super().save(*args, **kwargs)


# ✅ ProductReview Model
class ProductReview(models.Model):
    """Customer reviews and ratings"""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    customer = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    title = models.CharField(max_length=200)
    comment = models.TextField()
    verified_purchase = models.BooleanField(default=False)
    helpful_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        unique_together = ['product', 'customer']
    
    def __str__(self):
        return f"{self.product.name} - {self.rating}⭐ by {self.customer.username}"


# ✅ Cart Model
class Cart(models.Model):
    """Shopping cart for customers"""
    customer = models.OneToOneField(User, on_delete=models.CASCADE, related_name='cart')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Cart of {self.customer.username}"
    
    def get_total_price(self):
        return sum(item.get_total_price() for item in self.items.all())


# ✅ CartItem Model
class CartItem(models.Model):
    """Items in cart"""
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    added_at = models.DateTimeField(auto_now_add=True)
    
    def get_total_price(self):
        price = self.product.discount_price or self.product.price
        return price * self.quantity
    
    def __str__(self):
        return f"{self.product.name} x {self.quantity}"


# ✅ Order Model - Enhanced
class Order(models.Model):
    """Customer orders"""
    STATUS_CHOICES = [
        ('pending', 'लंबित'),
        ('confirmed', 'पुष्टि किया गया'),
        ('processing', 'प्रसंस्करण'),
        ('shipped', 'भेजा गया'),
        ('delivered', 'सुपुर्द किया गया'),
        ('cancelled', 'रद्द किया गया'),
        ('refunded', 'धनवापसी'),
    ]
    
    PAYMENT_CHOICES = [
        ('credit_card', 'क्रेडिट कार्ड'),
        ('debit_card', 'डेबिट कार्ड'),
        ('upi', 'UPI'),
        ('wallet', 'डिजिटल वॉलेट'),
        ('cod', 'नकद'),
    ]
    
    order_id = models.CharField(max_length=100, unique=True)
    customer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='orders')
    
    # Address Info
    shipping_address = models.TextField(blank=True, null=True)
    billing_address = models.TextField(blank=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    
    # Order Details
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    final_amount = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Status & Payment
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_method = models.CharField(max_length=20, choices=PAYMENT_CHOICES)
    payment_status = models.CharField(max_length=20, choices=[('pending', 'लंबित'), ('completed', 'पूर्ण'), ('failed', 'विफल')])
    transaction_id = models.CharField(max_length=200, blank=True)
    
    # Notes
    special_instructions = models.TextField(blank=True)
    admin_notes = models.TextField(blank=True)
    
    # Tracking
    tracking_number = models.CharField(max_length=100, blank=True)
    estimated_delivery = models.DateField(blank=True, null=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['order_id']),
            models.Index(fields=['customer']),
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        return f"Order {self.order_id}"


# Keep old Booking class for backward compatibility, but redirect to Rebooking
class Booking(models.Model):
    """Service Bookings & Rebooking"""
    STATUS_CHOICES = [
        ('pending', 'पेंडिंग'),
        ('confirmed', 'पुष्टि किया गया'),
        ('completed', 'पूर्ण'),
        ('cancelled', 'रद्द'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    booking_date = models.DateField()
    booking_time = models.TimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    notes = models.TextField(blank=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-booking_date']
    
    def __str__(self):
        return f"{self.user.username} Booking ({self.booking_date})"


# ✅ Rebooking Model - Enhanced
class Rebooking(models.Model):
    """Ayurveda consultation and appointment bookings"""
    CONSULTATION_TYPES = [
        ('general', 'सामान्य परामर्श'),
        ('dosha_analysis', 'दोष विश्लेषण'),
        ('diet_plan', 'आहार योजना'),
        ('skincare', 'त्वचा देखभाल'),
        ('immunity', 'प्रतिरक्षा बूस्ट'),
        ('custom', 'कस्टम चिकित्सा'),
    ]
    
    STATUS_CHOICES = [
        ('requested', 'अनुरोधित'),
        ('confirmed', 'पुष्टि किया गया'),
        ('completed', 'पूर्ण'),
        ('cancelled', 'रद्द किया गया'),
        ('rescheduled', 'पुनः निर्धारित'),
    ]
    
    customer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='rebookings')
    consultation_type = models.CharField(max_length=20, choices=CONSULTATION_TYPES)
    
    # Schedule
    scheduled_date = models.DateField()
    scheduled_time = models.TimeField()
    duration_minutes = models.PositiveIntegerField(default=30)
    
    # Details
    health_concerns = models.TextField(help_text="स्वास्थ्य संबंधी चिंताएं")
    current_medications = models.TextField(blank=True, help_text="वर्तमान दवाएं (यदि कोई हो)")
    allergies = models.TextField(blank=True)
    dosha_type = models.CharField(max_length=20, choices=[
        ('vata', 'वात'),
        ('pitta', 'पित्त'),
        ('kapha', 'कफ'),
        ('unknown', 'पता नहीं'),
    ])
    
    # Status & Notes
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='requested')
    therapist_name = models.CharField(max_length=200, blank=True)
    consultation_notes = models.TextField(blank=True)
    recommended_products = models.ManyToManyField(Product, blank=True, related_name='recommended_in_rebookings')
    
    # Pricing
    consultation_fee = models.DecimalField(max_digits=10, decimal_places=2, default=500)
    is_paid = models.BooleanField(default=False)
    payment_id = models.CharField(max_length=200, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = "Rebookings"
        indexes = [
            models.Index(fields=['customer']),
            models.Index(fields=['scheduled_date']),
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        return f"{self.customer.username} - {self.get_consultation_type_display()}"


# ✅ Article Model - For Ayurveda Content
class Article(models.Model):
    """Blog articles about Ayurveda"""
    title = models.CharField(max_length=300)
    hindi_title = models.CharField(max_length=300, blank=True)
    slug = models.SlugField(unique=True)
    content = models.TextField()
    excerpt = models.TextField(max_length=500)
    
    featured_image = models.ImageField(upload_to="articles/")
    category = models.CharField(max_length=100)
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    
    views = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = "Articles"
    
    def __str__(self):
        return self.title


# ✅ FAQ Model
class FAQ(models.Model):
    """Frequently Asked Questions"""
    question_en = models.CharField(max_length=300)
    question_hi = models.CharField(max_length=300, blank=True)
    answer_en = models.TextField()
    answer_hi = models.TextField(blank=True)
    category = models.CharField(max_length=100)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['order', '-id']
        verbose_name_plural = "FAQs"
    
    def __str__(self):
        return self.question_en


# ✅ Contact Message Model
class ContactMessage(models.Model):
    """Contact form submissions"""
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=15, blank=True)
    subject = models.CharField(max_length=300)
    message = models.TextField()
    category = models.CharField(max_length=100, choices=[
        ('general', 'सामान्य'),
        ('complaint', 'शिकायत'),
        ('feedback', 'प्रतिक्रिया'),
        ('partnership', 'साझेदारी'),
    ])
    
    is_resolved = models.BooleanField(default=False)
    admin_response = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.email} - {self.subject}"


# ✅ Ojas Gurukul notification list
class GurukulNotification(models.Model):
    """Notify-me signups for Ojas Gurukul"""
    name = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Gurukul Notification"
        verbose_name_plural = "Gurukul Notifications"

    def __str__(self):
        return f"{self.name} <{self.email}>"


# Keep old models for backward compatibility (removed duplicate empty BlogPost)

# ✅ Profile model for extended user info
from django.conf import settings

class Profile(models.Model):
    """Extended profile information for users"""
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True)
    bio = models.TextField(blank=True)

    def __str__(self):
        return f"Profile of {self.user.username}"


class BlogPost(models.Model):
    """Ayurveda Blog & Articles"""
    title = models.CharField(max_length=250)
    slug = models.SlugField(max_length=250, unique=True)
    content = models.TextField()
    excerpt = models.CharField(max_length=500, blank=True)
    image = models.ImageField(upload_to="blog/", blank=True, null=True)
    author = models.CharField(max_length=100, default="Ojasritu")
    published = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    is_featured = models.BooleanField(default=False)

    class Meta:
        ordering = ['-published']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        self.slug = slugify(self.title)
        super().save(*args, **kwargs)

