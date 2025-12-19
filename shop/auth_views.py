import logging
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import json
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.conf import settings

logger = logging.getLogger(__name__)

# ---------------- SIGNUP ----------------
@api_view(["POST"])
@permission_classes([AllowAny])
def signup(request):
    data = json.loads(request.body)

    email = data.get("email", "").lower()
    password = data.get("password")
    password_confirm = data.get("password_confirm")
    first_name = data.get("first_name", "")

    if not email or not password:
        return Response({"error": "Email & password required"}, status=400)

    if password != password_confirm:
        return Response({"error": "Passwords do not match"}, status=400)

    if User.objects.filter(username=email).exists():
        return Response({"error": "User already exists"}, status=400)

    user = User.objects.create_user(
        username=email,
        email=email,
        password=password,
        first_name=first_name
    )

    token, _ = Token.objects.get_or_create(user=user)
    login(request, user)

    # Ensure session is saved and cookie will be set for the client
    try:
        request.session.save()
    except Exception:
        pass

    return Response({"success": True, "token": token.key}, status=200)

# ---------------- EMAIL LOGIN ----------------
@api_view(["POST"])
@permission_classes([AllowAny])
def email_login(request):
    try:
        # Support both DRF Request (request.data) and raw Django HttpRequest (request.body)
        if hasattr(request, 'data'):
            data = request.data
        else:
            data = json.loads(request.body)
        identifier = (data.get("email", "") or "").lower()
        password = data.get("password")

        # Try authenticating directly using the identifier as username
        user = authenticate(request, username=identifier, password=password)

        # If that fails and the identifier looks like an email, try lookup by email
        if not user and "@" in identifier:
            from django.contrib.auth import get_user_model
            User = get_user_model()
            try:
                u = User.objects.get(email__iexact=identifier)
                user = authenticate(request, username=u.username, password=password)
            except User.DoesNotExist:
                user = None

        if not user:
            logger.warning(f"Failed login attempt for identifier={identifier} from={request.META.get('REMOTE_ADDR')}")
            return Response({"error": "Invalid credentials"}, status=401)

        login(request, user)
        # Ensure session is saved so browser receives cookie
        try:
            request.session.save()
        except Exception:
            pass

        token, _ = Token.objects.get_or_create(user=user)

        return Response({"success": True, "token": token.key}, status=200)
    except Exception as exc:
        logger.exception("Error in email_login")
        return Response({"error": "Internal server error", "detail": str(exc)}, status=500)

# ---------------- GOOGLE LOGIN ----------------
@api_view(["POST"])
@permission_classes([AllowAny])
def google_login(request):
    try:
        data = json.loads(request.body)
        id_token_val = data.get('id_token') or data.get('credential')
        if not id_token_val:
            return Response({"error": "id_token required"}, status=400)

        try:
            info = id_token.verify_oauth2_token(
                id_token_val,
                google_requests.Request(),
                settings.GOOGLE_CLIENT_ID
            )
        except Exception as e:
            logger.warning(f"Invalid Google token: {e}")
            return Response({"error": "Invalid token", "detail": str(e)}, status=400)

        email = info.get("email")
        if not email:
            return Response({"error": "Email not available in token"}, status=400)

        user, _ = User.objects.get_or_create(
            username=email,
            defaults={"email": email, "first_name": info.get("given_name", "")}
        )

        login(request, user)
        # Ensure session is saved so browser receives cookie
        try:
            request.session.save()
        except Exception:
            pass

        token, _ = Token.objects.get_or_create(user=user)
        return Response({"success": True, "token": token.key}, status=200)
    except Exception as exc:
        logger.exception("Error in google_login")
        return Response({"error": "Internal server error", "detail": str(exc)}, status=500)

# ---------------- LOGOUT ----------------
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_view(request):
    try:
        request.user.auth_token.delete()
    except:
        pass

    logout(request)
    # Ensure session data is fully cleared
    try:
        request.session.flush()
    except Exception:
        pass

    return Response({"success": True}, status=200)

# ---------------- PROFILE ----------------
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def profile(request):
    u = request.user
    return Response({
        "authenticated": True,
        "user": {
            "username": u.username,
            "email": u.email,
            "first_name": u.first_name,
        }
    })


# Lightweight auth status check for SPA (idempotent and safe)
@api_view(["GET"])
@permission_classes([AllowAny])
def auth_check(request):
    if request.user and request.user.is_authenticated:
        u = request.user
        return Response({
            "authenticated": True,
            "user": {"id": u.id, "email": u.email, "first_name": u.first_name}
        }, status=200)
    return Response({"authenticated": False, "user": None}, status=200)

# ---------------- FORGOT / RESET PASSWORD ----------------
@api_view(["POST"])
@permission_classes([AllowAny])
def forgot_password(request):
    data = json.loads(request.body)
    email = data.get("email", "").lower()
    from django.contrib.auth import get_user_model
    User = get_user_model()
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        # Return 200 to avoid leaking which emails exist
        return Response({"message": "If the email exists, a reset link has been sent"}, status=200)

    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    reset_link = f"{getattr(settings, 'FRONTEND_URL', '').rstrip('/')}/reset-password/{uid}/{token}"

    subject = "Password reset request"
    body = f"Visit the following link to reset your password:\n\n{reset_link}\n\nIf you did not request this, ignore this email."

    send_mail(subject, body, getattr(settings, 'DEFAULT_FROM_EMAIL', 'no-reply@example.com'), [user.email])

    return Response({"message": "If the email exists, a reset link has been sent"}, status=200)


@api_view(["POST"])
@permission_classes([AllowAny])
def reset_password(request):
    data = json.loads(request.body)
    uid = data.get("uid")
    token = data.get("token")
    password = data.get("password")
    password_confirm = data.get("password_confirm")

    if not uid or not token or not password:
        return Response({"error": "Missing fields"}, status=400)

    if password != password_confirm:
        return Response({"error": "Passwords do not match"}, status=400)

    from django.contrib.auth import get_user_model
    User = get_user_model()

    try:
        pk = force_str(urlsafe_base64_decode(uid))
        user = User.objects.get(pk=pk)
    except Exception:
        return Response({"error": "Invalid reset link"}, status=400)

    if not default_token_generator.check_token(user, token):
        return Response({"error": "Invalid or expired token"}, status=400)

    user.set_password(password)
    user.save()

    return Response({"message": "Password has been reset"}, status=200)
