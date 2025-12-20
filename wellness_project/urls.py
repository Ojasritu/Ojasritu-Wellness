from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse, HttpResponse
from django.utils import timezone
from django.views.generic import RedirectView
from pathlib import Path


# -------------------------
# HEALTH CHECK
# -------------------------
def health_check(request):
    return JsonResponse({
        "project": "Ojasritu Wellness",
        "status": "Backend running successfully",
        "timestamp": timezone.now().isoformat()
    })

# -------------------------
# FRONTEND SPA SERVE
# -------------------------
def serve_frontend(request):
    base = Path(settings.BASE_DIR)
    candidates = [
        base / "staticfiles" / "index.html",
        base / "frontend" / "dist" / "index.html",
    ]
    for p in candidates:
        if p.exists():
            try:
                return HttpResponse(p.read_text(encoding="utf-8"), content_type="text/html")
            except Exception:
                continue
    # Fallback to shop web pages if SPA not present
    return RedirectView.as_view(url="/", permanent=False)(request)


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
    # FRONTEND (SPA) at root
    # =========================
    path("", serve_frontend),

    # =========================
    # WEB PAGES (legacy)
    # =========================
    path("web/", include("shop.web_urls")),

    # =========================
    # HEALTH CHECK (Railway / Local)
    # =========================
    path("healthz/", health_check),
    path("healthz", health_check),

    # =========================
    # FAVICON
    # =========================
    path("favicon.ico", RedirectView.as_view(url=f"{settings.STATIC_URL}images/logo.svg", permanent=True)),
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
