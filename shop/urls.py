from django.urls import path, include
from . import auth_views
from .api import (
    get_csrf_token,
    GoogleAuthAPIView,
    router,
    ProfileAPIView,
    AvatarDeleteAPIView,
    add_to_cart,
    get_cart,
    remove_from_cart,
    create_prebooking,
    create_prebooking_from_cart,
    LogoutAPIView,
    ojas_gurukul_notify,
)

# Include the DRF router first (provides: products, categories, orders, etc.)
urlpatterns = [
    path("", include(router.urls)),
]

# Then add AUTH endpoints
urlpatterns += [
    path("auth/signup/", auth_views.signup, name="signup"),
    path("auth/login/", auth_views.email_login, name="login"),
    path("auth/logout/", auth_views.logout_view, name="logout"),
    path("auth/profile/", auth_views.profile, name="profile"),
    path("auth/check/", auth_views.auth_check, name="auth_check"),
    path("auth/forgot-password/", auth_views.forgot_password, name="forgot_password"),
    path("auth/reset-password/", auth_views.reset_password, name="reset_password"),

    # CSRF token endpoint for SPA
    path('auth/csrf/', get_csrf_token, name='api-auth-csrf'),

    # Google ID token endpoint
    path('auth/google/', GoogleAuthAPIView.as_view(), name='api-auth-google'),

    # Profile endpoints
    path('profile/', ProfileAPIView.as_view(), name='api-profile'),
    path('profile/avatar/', AvatarDeleteAPIView.as_view(), name='api-profile-avatar-delete'),

    # Cart endpoints
    path('cart/add/', add_to_cart, name='api-cart-add'),
    path('cart/', get_cart, name='api-cart-get'),
    path('cart/remove/<int:item_id>/', remove_from_cart, name='api-cart-remove'),

    # Pre-booking endpoints
    path('prebook/', create_prebooking, name='api-prebook'),
    path('prebook/cart/', create_prebooking_from_cart, name='api-prebook-cart'),

    # Ojas Gurukul notify
    path('ojas-gurukul/notify/', ojas_gurukul_notify, name='api-ojas-gurukul-notify'),

    # Legacy logout endpoint
    path('logout/', LogoutAPIView.as_view(), name='api-logout'),
]
