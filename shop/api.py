from rest_framework import serializers, viewsets, routers, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django.urls import path, include
from django.middleware.csrf import get_token
from .models import (
    Category, Product, ProductReview, Cart, CartItem,
    Order, Rebooking, Article, FAQ, ContactMessage, GurukulNotification
)
from .models import Profile
from django.contrib.auth import get_user_model, login
from django.conf import settings
from django.core.mail import send_mail
import json
import os

from django.views.decorators.csrf import csrf_exempt
import logging

logger = logging.getLogger(__name__)

# For Google ID token verification
from google.oauth2 import id_token as google_id_token
from google.auth.transport import requests as google_requests
from django.core.files.base import ContentFile
import requests


# ===== SERIALIZERS =====

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'hindi_name', 'slug', 'description', 'icon', 'background_image']


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    discount_percentage = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'hindi_name', 'slug', 'description', 'benefits',
            'ingredients', 'price', 'discount_price', 'discount_percentage',
            'category', 'category_name', 'image', 'dosha_type', 'quantity_in_stock',
            'is_bestseller', 'is_featured', 'rating', 'status', 'sku'
        ]
    
    def get_discount_percentage(self, obj):
        if obj.discount_price:
            return int(((obj.price - obj.discount_price) / obj.price) * 100)
        return 0
    
    def get_image(self, obj):
        """Return full absolute image URL for production."""
        if not obj.image:
            return None
        request = self.context.get('request')
        if request is not None:
            return request.build_absolute_uri(obj.image.url)
        # Fallback to relative URL
        return obj.image.url if obj.image else None


class ProductDetailSerializer(ProductSerializer):
    reviews = serializers.SerializerMethodField()
    
    class Meta(ProductSerializer.Meta):
        fields = ProductSerializer.Meta.fields + ['usage_instructions', 'scientific_research', 'gallery', 'reviews']
    
    def get_reviews(self, obj):
        reviews = obj.reviews.all()[:5]
        return ProductReviewSerializer(reviews, many=True).data


class ProductReviewSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.username', read_only=True)
    
    class Meta:
        model = ProductReview
        fields = ['id', 'product', 'customer_name', 'rating', 'title', 'comment', 'verified_purchase', 'created_at']
        read_only_fields = ['id', 'created_at']


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)
    total_price = serializers.SerializerMethodField()
    
    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity', 'total_price', 'added_at']
    
    def get_total_price(self, obj):
        return obj.get_total_price()


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()
    
    class Meta:
        model = Cart
        fields = ['id', 'customer', 'items', 'total_price', 'created_at']
    
    def get_total_price(self, obj):
        return obj.get_total_price()


class OrderSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.username', read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'order_id', 'customer', 'customer_name', 'total_amount',
            'discount_amount', 'tax_amount', 'final_amount', 'status',
            'payment_method', 'payment_status', 'created_at'
        ]
        read_only_fields = ['order_id', 'created_at']


class RebookingSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.username', read_only=True)
    
    class Meta:
        model = Rebooking
        fields = [
            'id', 'customer', 'customer_name', 'consultation_type',
            'scheduled_date', 'scheduled_time', 'health_concerns',
            'dosha_type', 'status', 'consultation_fee', 'is_paid', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class ArticleSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)
    
    class Meta:
        model = Article
        fields = ['id', 'title', 'hindi_title', 'slug', 'excerpt', 'featured_image', 'category',
                  'author', 'author_name', 'views', 'is_published', 'is_featured', 'created_at']


class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = ['id', 'question_en', 'question_hi', 'answer_en', 'answer_hi', 'category']


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'phone', 'subject', 'message', 'category', 'created_at']
        read_only_fields = ['id', 'created_at']


class GurukulNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = GurukulNotification
        fields = ['id', 'name', 'email', 'created_at']
        read_only_fields = ['id', 'created_at']


# ===== VIEWSETS =====

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ProductSerializer
    lookup_field = 'slug'
    
    def get_queryset(self):
        queryset = Product.objects.filter(status='active')
        category = self.request.query_params.get('category')
        dosha = self.request.query_params.get('dosha')
        bestseller = self.request.query_params.get('bestseller')
        
        if category:
            queryset = queryset.filter(category__slug=category)
        if dosha:
            queryset = queryset.filter(dosha_type=dosha)
        if bestseller:
            queryset = queryset.filter(is_bestseller=True)
        
        return queryset
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductSerializer


class ProductReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ProductReviewSerializer
    
    def get_queryset(self):
        return ProductReview.objects.filter(product__slug=self.kwargs.get('product_slug'))
    
    def perform_create(self, serializer):
        product = Product.objects.get(slug=self.kwargs.get('product_slug'))
        serializer.save(product=product, customer=self.request.user)


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return Order.objects.all()
        return Order.objects.filter(customer=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)


class RebookingViewSet(viewsets.ModelViewSet):
    serializer_class = RebookingSerializer
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return Rebooking.objects.all()
        return Rebooking.objects.filter(customer=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)


class ArticleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Article.objects.filter(is_published=True)
    serializer_class = ArticleSerializer
    lookup_field = 'slug'


class FAQViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = FAQ.objects.filter(is_active=True)
    serializer_class = FAQSerializer
    
    @action(detail=False, methods=['get'])
    def by_category(self, request):
        category = request.query_params.get('category')
        if category:
            faqs = FAQ.objects.filter(category=category, is_active=True)
            serializer = self.get_serializer(faqs, many=True)
            return Response(serializer.data)
        return Response({'error': 'category parameter required'}, status=status.HTTP_400_BAD_REQUEST)


class ContactMessageViewSet(viewsets.ModelViewSet):
    serializer_class = ContactMessageSerializer
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return ContactMessage.objects.all()
        return ContactMessage.objects.filter(email=self.request.user.email)


@api_view(['POST'])
@permission_classes([AllowAny])
def ojas_gurukul_notify(request):
    """Store notify-me requests and send a confirmation email."""
    serializer = GurukulNotificationSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({'error': 'Invalid data', 'details': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    data = serializer.validated_data
    record, created = GurukulNotification.objects.update_or_create(
        email=data['email'],
        defaults={'name': data.get('name', '')}
    )

    subject = "Welcome to Ojas Gurukul"
    body = (
        "Thank you for joining the Ojas Gurukul vision.\n"
        "You will receive updates about admissions, events, and announcements."
    )

    email_sent = True
    try:
        send_mail(subject, body, settings.DEFAULT_FROM_EMAIL, [record.email], fail_silently=False)
    except Exception:
        email_sent = False
        logger.warning("Failed to send Gurukul confirmation email", exc_info=True)

    return Response({
        'success': True,
        'created': created,
        'email_sent': email_sent,
        'message': 'Thank you for joining the Ojas Gurukul vision.',
    }, status=status.HTTP_201_CREATED)


# ===== PROFILE SERIALIZER & VIEW =====
class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = Profile
        fields = ['id', 'username', 'email', 'avatar', 'phone', 'bio']


class ProfileAPIView(APIView):
    """Simple profile endpoints for the current authenticated user"""

    def get(self, request):
        user = request.user
        if not user.is_authenticated:
            return Response({'detail': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        profile, _ = Profile.objects.get_or_create(user=user)
        serializer = ProfileSerializer(profile, context={'request': request})
        return Response(serializer.data)

    def put(self, request):
        user = request.user
        if not user.is_authenticated:
            return Response({'detail': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        profile, _ = Profile.objects.get_or_create(user=user)
        # Allow updating Profile fields and basic User fields
        data = request.data.copy()
        # If user fields are present, update them
        if 'first_name' in data:
            request.user.first_name = data.get('first_name')
        if 'last_name' in data:
            request.user.last_name = data.get('last_name')
        if 'email' in data:
            request.user.email = data.get('email')
        request.user.save()

        serializer = ProfileSerializer(profile, data=data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ===== CART API VIEWS =====

@csrf_exempt
@api_view(['POST'])
def add_to_cart(request):
    """Add product to cart (session-based, user-specific)"""
    if not request.user.is_authenticated:
        return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
    
    product_id = request.data.get('product_id')
    quantity = request.data.get('quantity', 1)
    
    if not product_id:
        return Response({'error': 'product_id is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        product = Product.objects.get(id=product_id, status='active')
    except Product.DoesNotExist:
        return Response({'error': 'Product not found or inactive'}, status=status.HTTP_404_NOT_FOUND)
    
    # Get or create cart for user
    cart, created = Cart.objects.get_or_create(customer=request.user)
    
    # Get or create cart item
    cart_item, item_created = CartItem.objects.get_or_create(
        cart=cart,
        product=product,
        defaults={'quantity': quantity}
    )
    
    if not item_created:
        # Item exists, update quantity
        cart_item.quantity += int(quantity)
        cart_item.save()
    
    return Response({
        'success': True,
        'message': f'{product.name} added to cart',
        'cart_total': float(cart.get_total_price()),
        'cart_items_count': cart.items.count()
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_cart(request):
    """Get user's cart contents"""
    if not request.user.is_authenticated:
        return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
    
    try:
        cart = Cart.objects.get(customer=request.user)
        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data)
    except Cart.DoesNotExist:
        return Response({
            'items': [],
            'total_price': 0,
            'message': 'Cart is empty'
        })


@api_view(['DELETE'])
def remove_from_cart(request, item_id):
    """Remove item from cart"""
    if not request.user.is_authenticated:
        return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
    
    try:
        cart = Cart.objects.get(customer=request.user)
        cart_item = CartItem.objects.get(id=item_id, cart=cart)
        product_name = cart_item.product.name
        cart_item.delete()
        
        return Response({
            'success': True,
            'message': f'{product_name} removed from cart',
            'cart_total': float(cart.get_total_price()),
            'cart_items_count': cart.items.count()
        })
    except (Cart.DoesNotExist, CartItem.DoesNotExist):
        return Response({'error': 'Item not found in cart'}, status=status.HTTP_404_NOT_FOUND)


# ===== PRE-BOOKING API =====

@csrf_exempt
@api_view(['POST'])
def create_prebooking(request):
    """Create a pre-booking order (payment stub for now)"""
    if not request.user.is_authenticated:
        return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
    
    product_id = request.data.get('product_id')
    quantity = request.data.get('quantity', 1)
    
    if not product_id:
        return Response({'error': 'product_id is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        product = Product.objects.get(id=product_id, status='active')
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Calculate amount
    price = product.discount_price or product.price
    amount = float(price) * int(quantity)
    
    # TODO: In future, integrate with Razorpay here
    # For now, return mock success response
    
    # Create a pending order (using existing Order model)
    import uuid
    order = Order.objects.create(
        customer=request.user,
        order_id=f'PRE-{uuid.uuid4().hex[:8].upper()}',
        total_amount=amount,
        final_amount=amount,
        status='pending',
        payment_method='upi',  # Default for pre-booking
        payment_status='pending'
    )
    
    return Response({
        'success': True,
        'message': 'Pre-booking created successfully',
        'order_id': order.order_id,
        'amount': amount,
        'status': 'pending',
        'note': 'Payment will be available from 21st December 2025'
    }, status=status.HTTP_201_CREATED)


@csrf_exempt
@api_view(['POST'])
def create_prebooking_from_cart(request):
    """Create a single pre-booking order for the user's entire cart and clear the cart."""
    if not request.user.is_authenticated:
        return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        cart = Cart.objects.get(customer=request.user)
    except Cart.DoesNotExist:
        return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

    cart_total = float(cart.get_total_price())
    if cart.items.count() == 0 or cart_total <= 0:
        return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

    import uuid
    order = Order.objects.create(
        customer=request.user,
        order_id=f'PRE-CART-{uuid.uuid4().hex[:8].upper()}',
        total_amount=cart_total,
        discount_amount=0,
        tax_amount=0,
        final_amount=cart_total,
        status='pending',
        payment_method='upi',
        payment_status='pending',
    )

    # Clear cart after creating the pre-booking
    cart.items.all().delete()

    return Response({
        'success': True,
        'message': 'Cart pre-booking created successfully',
        'order_id': order.order_id,
        'amount': cart_total,
        'status': 'pending',
        'cart_cleared': True,
        'note': 'Payment will be available from 21st December 2025'
    }, status=status.HTTP_201_CREATED)


# ===== ROUTER =====

router = routers.DefaultRouter()

router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'products', ProductViewSet, basename='product')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'rebookings', RebookingViewSet, basename='rebooking')
router.register(r'articles', ArticleViewSet, basename='article')
router.register(r'faqs', FAQViewSet, basename='faq')
router.register(r'contact', ContactMessageViewSet, basename='contact')

urlpatterns = router.urls
urlpatterns += [
    path('profile/', ProfileAPIView.as_view(), name='api-profile'),
    # Cart endpoints
    path('cart/add/', add_to_cart, name='api-cart-add'),
    path('cart/', get_cart, name='api-cart-get'),
    path('cart/remove/<int:item_id>/', remove_from_cart, name='api-cart-remove'),
    # Pre-booking endpoint
    path('prebook/', create_prebooking, name='api-prebook'),
    path('prebook/cart/', create_prebooking_from_cart, name='api-prebook-cart'),
    # Ojas Gurukul notify endpoint
    path('ojas-gurukul/notify/', ojas_gurukul_notify, name='api-ojas-gurukul-notify'),
]


class LogoutAPIView(APIView):
    """API endpoint to log out the current user"""

    def post(self, request):
        from django.contrib.auth import logout
        logout(request)
        return Response({'detail': 'logged out'})


urlpatterns += [
    path('logout/', LogoutAPIView.as_view(), name='api-logout'),
]


# ===== Google ID token auth endpoint =====
class GoogleAuthAPIView(APIView):
    """Accepts Google ID token (from client-side) and logs in/creates user.

    Allows unauthenticated POSTs (frontend obtains CSRF token first)."""
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            body = request.data
            id_token_val = body.get('id_token') or body.get('credential')
            if not id_token_val:
                return Response({'error': 'id_token required'}, status=status.HTTP_400_BAD_REQUEST)

            # Verify token using configured client id
            client_id = getattr(settings, 'GOOGLE_CLIENT_ID', None)
            try:
                idinfo = google_id_token.verify_oauth2_token(id_token_val, google_requests.Request(), client_id)
            except Exception as e:
                return Response({'error': 'Invalid token', 'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

            # idinfo contains 'email', 'given_name', 'family_name', 'picture', 'email_verified'
            email = idinfo.get('email')
            if not email:
                return Response({'error': 'Email not available in token'}, status=status.HTTP_400_BAD_REQUEST)

            User = get_user_model()
            # Use email as username to ensure consistent login behavior
            user, created = User.objects.get_or_create(username=email, defaults={
                'email': email,
                'first_name': idinfo.get('given_name', ''),
                'last_name': idinfo.get('family_name', ''),
            })

            # Update user names if changed
            changed = False
            if user.first_name != idinfo.get('given_name', ''):
                user.first_name = idinfo.get('given_name', '')
                changed = True
            if user.last_name != idinfo.get('family_name', ''):
                user.last_name = idinfo.get('family_name', '')
                changed = True
            if changed:
                user.save()

            # Create profile and possibly save avatar URL
            profile, _ = Profile.objects.get_or_create(user=user)
            picture = idinfo.get('picture')
            if picture:
                try:
                    # download the image and save to profile.avatar
                    r = requests.get(picture, timeout=5)
                    if r.status_code == 200:
                        ext = picture.split('.')[-1].split('?')[0]
                        if len(ext) > 5:
                            ext = 'jpg'
                        file_name = f"avatar_{user.username}.{ext}"
                        profile.avatar.save(file_name, ContentFile(r.content), save=True)
                except Exception:
                    # ignore avatar download errors
                    pass

            # Log the user in via session
            login(request, user)

            # return consistent success response (include token for backward-compatibility)
            try:
                from rest_framework.authtoken.models import Token
                token, _ = Token.objects.get_or_create(user=user)
                return Response({'success': True, 'token': token.key}, status=status.HTTP_200_OK)
            except Exception:
                return Response({'success': True}, status=status.HTTP_200_OK)

        except Exception as exc:
            # Log unexpected server-side errors
            import logging
            logging.getLogger(__name__).exception('Error in GoogleAuthAPIView')
            return Response({'error': 'Error during authentication', 'detail': str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


urlpatterns += [
    path('auth/google/', GoogleAuthAPIView.as_view(), name='api-auth-google'),
]


@api_view(['GET'])
@permission_classes([AllowAny])
def get_csrf_token(request):
    """Return a CSRF token and ensure the CSRF cookie is set."""
    token = get_token(request)
    return Response({'csrftoken': token})

urlpatterns += [
    path('auth/csrf/', get_csrf_token, name='api-auth-csrf'),
]

# Auth endpoints implemented in shop/auth_views.py
from . import auth_views

urlpatterns += [
    path('auth/signup/', auth_views.signup, name='api-auth-signup'),
    path('auth/login/', auth_views.email_login, name='api-auth-login'),
    path('auth/check/', auth_views.auth_check, name='api-auth-check'),
]


# ===== Avatar delete endpoint =====
class AvatarDeleteAPIView(APIView):
    def delete(self, request):
        user = request.user
        if not user.is_authenticated:
            return Response({'detail': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        profile, _ = Profile.objects.get_or_create(user=user)
        if profile.avatar:
            profile.avatar.delete(save=False)
            profile.avatar = None
            profile.save()
        return Response({'detail': 'avatar deleted'})


urlpatterns += [
    path('profile/avatar/', AvatarDeleteAPIView.as_view(), name='api-profile-avatar-delete'),
]
