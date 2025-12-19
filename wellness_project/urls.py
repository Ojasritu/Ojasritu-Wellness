from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from django.utils import timezone


# -------------------------
# HEALTH CHECK
# -------------------------
def health_check(request):
    return JsonResponse({
        "project": "Ojasritu Wellness",
        "status": "Backend running successfully",
        "timestamp": timezone.now().isoformat()
    })


urlpatterns = [

    # =========================
    # ADMIN PANEL
    # =========================
    path("admin/", admin.site.urls),

    # =========================
    # DJANGO ALLAUTH (Google OAuth internal)
    # =========================
    path("accounts/", include("allauth.urls")),

    # =========================
    # API (AUTH + SHOP + PROFILE)
    # =========================
    path("api/", include("shop.urls")),

    # =========================
    # WEB PAGES (Products, Cart, Checkout)
    # =========================
    path("", include("shop.web_urls")),

    # =========================
    # HEALTH CHECK (Railway / Local)
    # =========================
    path("healthz/", health_check),
    path("healthz", health_check),
]

# Custom handlers for friendly error pages
handler404 = 'wellness_project.views.custom_404'
handler500 = 'wellness_project.views.custom_500'

# =========================
# MEDIA FILES
# =========================
# Serve media files in both development and production
urlpatterns += static(
    settings.MEDIA_URL,
    document_root=settings.MEDIA_ROOT
)
