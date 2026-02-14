"""
jobs/views.py - Vues API
=========================

- JobOfferViewSet : CRUD complet (Create, Read, Update, Delete) pour les offres
- TrendingJobsView : Liste des jobs "tendances" avec cache 15 min (Étape 6)
"""
from rest_framework import viewsets, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page

from .models import JobOffer, Company, Application, CandidateProfile
from .serializers import (
    JobOfferSerializer,
    CompanySerializer,
    ApplicationSerializer,
    CandidateProfileSerializer,
)
from .filters import JobOfferFilter


class JobOfferViewSet(viewsets.ModelViewSet):
    """
    ViewSet = CRUD complet en une seule classe.
    
    Fournit automatiquement :
    - GET    /api/jobs/          → Liste des offres (avec filtres)
    - POST   /api/jobs/          → Créer une offre
    - GET    /api/jobs/{id}/     → Détail d'une offre
    - PUT    /api/jobs/{id}/     → Mise à jour complète
    - PATCH  /api/jobs/{id}/     → Mise à jour partielle
    - DELETE /api/jobs/{id}/     → Supprimer une offre
    
    Filtres : ?location=Paris&company=Tech&salary_min=30000&salary_max=80000
    Recherche : ?search=python (dans title et description)
    Tri : ?ordering=-salary, ?ordering=created_at, ?ordering=-created_at
    
    Permissions : lecture (GET) publique, écriture (POST/PUT/PATCH/DELETE) réservée aux utilisateurs authentifiés (JWT)
    """
    queryset = JobOffer.objects.select_related("company").all()
    serializer_class = JobOfferSerializer
    filterset_class = JobOfferFilter
    permission_classes = [IsAuthenticatedOrReadOnly]
    search_fields = ["title", "description", "company__name"]
    ordering_fields = ["created_at", "salary", "title"]
    ordering = ["-created_at"]


class CompanyViewSet(viewsets.ModelViewSet):
    """
    CRUD pour les entreprises.
    GET /api/companies/ - Liste
    POST /api/companies/ - Créer (authentifié, owner = user connecté)
    """
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    search_fields = ["name", "sector", "description"]
    ordering_fields = ["name", "created_at"]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ApplicationViewSet(viewsets.ModelViewSet):
    """
    Candidatures : postuler à une offre (authentification requise).
    - GET /api/applications/ : mes candidatures
    - POST /api/applications/ : postuler (job_offer, message)
    - GET /api/applications/1/ : détail
    Le user est automatiquement l'utilisateur connecté.
    """
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Application.objects.select_related("user", "job_offer").all()
        return Application.objects.filter(user=self.request.user).select_related("job_offer")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ProfileViewSet(viewsets.GenericViewSet):
    """
    Profil candidat : CV, lettre de motivation, compétences.
    GET /api/profiles/me/ → Mon profil
    PUT /api/profiles/me/ → Mettre à jour mon profil
    """
    serializer_class = CandidateProfileSerializer
    permission_classes = [IsAuthenticated]

    def _get_profile(self):
        profile, _ = CandidateProfile.objects.get_or_create(user=self.request.user)
        return profile

    @action(detail=False, methods=["get", "put", "patch"])
    def me(self, request):
        profile = self._get_profile()
        if request.method == "GET":
            serializer = self.get_serializer(profile)
            return Response(serializer.data)
        serializer = self.get_serializer(profile, data=request.data, partial=(request.method == "PATCH"))
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)
        return Response(serializer.data)


class TrendingJobsView(generics.GenericAPIView):
    """
    Vue des offres "tendances" (les 10 plus récentes).
    Mise en cache 15 minutes pour réduire la charge sur la DB.
    """
    serializer_class = JobOfferSerializer

    @method_decorator(cache_page(60 * 15))
    def get(self, request):
        jobs = JobOffer.objects.select_related("company").all()[:10]
        serializer = self.get_serializer(jobs, many=True)
        return Response(serializer.data)
