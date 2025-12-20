from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse, HttpResponse, FileResponse, Http404
from django.utils import timezone
from django.views.generic import RedirectView
from pathlib import Path
import os


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

# -------------------------
# MEDIA FILE SERVE (PRODUCTION)
# -------------------------\ndef serve_media(request, path):
    \"\"\"Serve media files in all environments\"\"\"\n    media_root = Path(settings.MEDIA_ROOT)
    file_path = media_root / path
    
    # Security: prevent directory traversal
    try:
        file_path = file_path.resolve()
        media_root = media_root.resolve()
        if not str(file_path).startswith(str(media_root)):
            raise Http404(\"Invalid path\")
    except:
        raise Http404(\"Invalid path\")
    
    if file_path.exists() and file_path.is_file():
        # Set proper content type
        import mimetypes
        content_type, _ = mimetypes.guess_type(str(file_path))
        response = FileResponse(open(file_path, 'rb'), content_type=content_type)
        # Add CORS headers for images
        response['Access-Control-Allow-Origin'] = '*'
        response['Cache-Control'] = 'public, max-age=31536000'
        return response
    raise Http404("Media file not found")


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
    
    # =========================
    # MEDIA FILES (PRODUCTION)
    # =========================
    re_path(r'^media/(?P<path>.*)$', serve_media, name='media'),
]

# Custom handlers for friendly error pages
handler404 = 'wellness_project.views.custom_404'
handler500 = 'wellness_project.views.custom_500'

# =========================
# MEDIA FILES (DEVELOPMENT)
# =========================
# Serve media files in development when DEBUG=True
if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )
