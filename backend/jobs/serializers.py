"""
jobs/serializers.py - Serializers pour JobOffer, Company, Application, CandidateProfile
"""
from rest_framework import serializers
from .models import JobOffer, Company, Application, CandidateProfile


class CandidateProfileSerializer(serializers.ModelSerializer):
    """Serializer pour le profil candidat (CV, lettre, compétences)."""
    cv_url = serializers.SerializerMethodField()

    class Meta:
        model = CandidateProfile
        fields = [
            "id",
            "full_name",
            "phone",
            "cv",
            "cv_url",
            "cover_letter",
            "skills",
            "experience",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def get_cv_url(self, obj):
        if obj.cv:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.cv.url)
            return obj.cv.url
        return None


class CandidateProfileBriefSerializer(serializers.ModelSerializer):
    """Version courte pour afficher dans une candidature (recruteur)."""

    cv_url = serializers.SerializerMethodField()

    class Meta:
        model = CandidateProfile
        fields = ["full_name", "phone", "cv_url", "cover_letter", "skills"]

    def get_cv_url(self, obj):
        if obj.cv:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.cv.url)
            return obj.cv.url
        return None


class CompanySerializer(serializers.ModelSerializer):
    """Serializer pour Company."""

    class Meta:
        model = Company
        fields = ["id", "name", "sector", "description", "owner", "created_at"]
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
    """Serializer pour les candidatures. Inclut le profil candidat (CV, lettre) pour les recruteurs."""

    job_offer_title = serializers.CharField(source="job_offer.title", read_only=True)
    user_username = serializers.CharField(source="user.username", read_only=True)
    candidate_profile = serializers.SerializerMethodField()

    class Meta:
        model = Application
        fields = [
            "id",
            "user",
            "user_username",
            "job_offer",
            "job_offer_title",
            "message",
            "status",
            "created_at",
            "candidate_profile",
        ]
        read_only_fields = ["id", "user", "status", "created_at"]

    def get_candidate_profile(self, obj):
        try:
            profile = obj.user.candidate_profile
            return CandidateProfileBriefSerializer(profile, context=self.context).data
        except CandidateProfile.DoesNotExist:
            return None
