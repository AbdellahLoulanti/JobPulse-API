"""
jobs/serializers.py - Serializers pour JobOffer et Company
===========================================================

Les Serializers DRF transforment :
- Model → dict (pour renvoyer du JSON en réponse)
- dict → Model (pour valider et créer/mettre à jour des objets)
"""
from rest_framework import serializers
from .models import JobOffer, Company, Application


class CompanySerializer(serializers.ModelSerializer):
    """Serializer pour Company."""

    class Meta:
        model = Company
        fields = ["id", "name", "sector", "description", "created_at"]
        read_only_fields = ["id", "created_at"]


class JobOfferSerializer(serializers.ModelSerializer):
    """
    Serializer complet pour JobOffer.
    Affiche l'objet company imbriqué en lecture, accepte company (id) en écriture.
    """

    company_detail = CompanySerializer(source="company", read_only=True)

    class Meta:
        model = JobOffer
        fields = [
            "id",
            "title",
            "company",
            "company_detail",
            "description",
            "salary",
            "location",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class ApplicationSerializer(serializers.ModelSerializer):
    """Serializer pour les candidatures."""

    job_offer_title = serializers.CharField(source="job_offer.title", read_only=True)
    user_username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Application
        fields = ["id", "user", "user_username", "job_offer", "job_offer_title", "message", "status", "created_at"]
        read_only_fields = ["id", "user", "status", "created_at"]
