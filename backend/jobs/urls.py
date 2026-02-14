"""
jobs/urls.py - Routes API de l'app jobs
========================================

On utilise DefaultRouter pour générer automatiquement les routes REST :
- /api/jobs/         → Liste + Create
- /api/jobs/{id}/    → Detail + Update + Delete
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import JobOfferViewSet, CompanyViewSet, ApplicationViewSet, ProfileViewSet, TrendingJobsView

router = DefaultRouter()
router.register(r"jobs", JobOfferViewSet, basename="job")
router.register(r"companies", CompanyViewSet, basename="company")
router.register(r"applications", ApplicationViewSet, basename="application")
router.register(r"profiles", ProfileViewSet, basename="profile")

urlpatterns = [
    path("", include(router.urls)),
    path("jobs/trending/", TrendingJobsView.as_view(), name="jobs-trending"),
]
