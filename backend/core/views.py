"""
core/views.py - Vues d'authentification
"""
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model

User = get_user_model()


def get_user_profile_data(user):
    """Retourne les données profil (role) pour un utilisateur."""
    from jobs.models import UserProfile
    profile, _ = UserProfile.objects.get_or_create(user=user, defaults={"role": "candidate"})
    return {"role": profile.role, "is_candidate": profile.is_candidate(), "is_recruiter": profile.is_recruiter()}


class RegisterView(APIView):
    """
    POST /api/auth/register/
    Crée un utilisateur avec rôle : candidate | recruiter | both
    """
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        email = request.data.get("email", "")
        role = request.data.get("role", "candidate")
        if role not in ("candidate", "recruiter", "both"):
            role = "candidate"

        if not username or not password:
            return Response(
                {"detail": "username et password sont requis"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if User.objects.filter(username=username).exists():
            return Response(
                {"detail": "Ce nom d'utilisateur existe déjà"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = User.objects.create_user(
            username=username,
            password=password,
            email=email or "",
        )
        from jobs.models import UserProfile
        UserProfile.objects.create(user=user, role=role)
        return Response(
            {"id": user.id, "username": user.username, "role": role},
            status=status.HTTP_201_CREATED,
        )


class MeView(APIView):
    """
    GET /api/auth/me/
    Retourne les infos de l'utilisateur connecté (username, role).
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile_data = get_user_profile_data(request.user)
        return Response({
            "id": request.user.id,
            "username": request.user.username,
            "email": request.user.email or "",
            **profile_data,
        })
