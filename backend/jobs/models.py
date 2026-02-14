"""
jobs/models.py - Modèles Company, JobOffer, Application, CandidateProfile, UserProfile
=====================================================================================

UserProfile : rôle utilisateur (candidat, recruteur, les deux)
"""
from django.conf import settings
from django.db import models


class UserProfile(models.Model):
    """Profil utilisateur : rôle (candidat / recruteur)."""
    ROLE_CANDIDATE = "candidate"
    ROLE_RECRUITER = "recruiter"
    ROLE_BOTH = "both"
    ROLE_CHOICES = [
        (ROLE_CANDIDATE, "Candidat"),
        (ROLE_RECRUITER, "Recruteur"),
        (ROLE_BOTH, "Candidat et recruteur"),
    ]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile",
        verbose_name="Utilisateur",
    )
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default=ROLE_CANDIDATE,
        verbose_name="Rôle",
    )

    class Meta:
        verbose_name = "Profil utilisateur"
        verbose_name_plural = "Profils utilisateurs"

    def __str__(self):
        return f"{self.user.username} ({self.get_role_display()})"

    def is_candidate(self):
        return self.role in (self.ROLE_CANDIDATE, self.ROLE_BOTH)

    def is_recruiter(self):
        return self.role in (self.ROLE_RECRUITER, self.ROLE_BOTH)


def cv_upload_path(instance, filename):
    """Chemin de stockage : media/cvs/user_<id>/cv.pdf"""
    ext = filename.split(".")[-1] if "." in filename else "pdf"
    return f"cvs/user_{instance.user_id}/cv.{ext}"


class CandidateProfile(models.Model):
    """
    Profil candidat : CV, lettre de motivation, informations personnelles.
    Un utilisateur = un profil candidat.
    """
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="candidate_profile",
        verbose_name="Utilisateur",
    )
    full_name = models.CharField(max_length=255, verbose_name="Nom complet", blank=True)
    phone = models.CharField(max_length=50, verbose_name="Téléphone", blank=True)
    cv = models.FileField(
        upload_to=cv_upload_path,
        verbose_name="CV",
        blank=True,
        null=True,
    )
    cover_letter = models.TextField(verbose_name="Lettre de motivation", blank=True)
    skills = models.TextField(
        verbose_name="Compétences",
        blank=True,
        help_text="Compétences séparées par des virgules",
    )
    experience = models.TextField(verbose_name="Expérience professionnelle", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Profil candidat"
        verbose_name_plural = "Profils candidats"

    def __str__(self):
        return f"Profil de {self.user.username}"


class Company(models.Model):
    """
    Entreprise qui publie des offres d'emploi.
    owner : recruteur qui gère cette entreprise (peut être null pour données seed/admin)
    """
    name = models.CharField(max_length=255, verbose_name="Nom")
    sector = models.CharField(max_length=255, verbose_name="Secteur", blank=True)
    description = models.TextField(verbose_name="Description", blank=True)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="owned_companies",
        verbose_name="Recruteur",
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Date de création")

    class Meta:
        verbose_name = "Entreprise"
        verbose_name_plural = "Entreprises"
        ordering = ["name"]

    def __str__(self):
        return self.name


class JobOffer(models.Model):
    """
    Offre d'emploi avec les informations essentielles.
    
    - title : Titre du poste (ex: "Développeur Python")
    - company : Entreprise (ForeignKey vers Company)
    - description : Description détaillée du poste
    - salary : Salaire proposé (Decimal pour la précision financière)
    - location : Lieu du travail (ville, pays, ou "Remote")
    - created_at : Date de création (auto-rempli)
    """

    title = models.CharField(max_length=255, verbose_name="Titre")
    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="job_offers",
        null=True,
        blank=True,
        verbose_name="Entreprise",
    )
    description = models.TextField(verbose_name="Description", blank=True)
    salary = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name="Salaire",
    )
    location = models.CharField(max_length=255, verbose_name="Lieu", default="Non précisé")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Date de création")

    class Meta:
        verbose_name = "Offre d'emploi"
        verbose_name_plural = "Offres d'emploi"
        ordering = ["-created_at"]

    def __str__(self):
        company_name = self.company.name if self.company else "Sans entreprise"
        return f"{self.title} @ {company_name}"


class Application(models.Model):
    """
    Candidature : un utilisateur postule à une offre d'emploi.
    Un utilisateur ne peut postuler qu'une seule fois par offre.
    """
    STATUS_CHOICES = [
        ("pending", "En attente"),
        ("accepted", "Acceptée"),
        ("rejected", "Refusée"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="applications",
        verbose_name="Candidat",
    )
    job_offer = models.ForeignKey(
        JobOffer,
        on_delete=models.CASCADE,
        related_name="applications",
        verbose_name="Offre",
    )
    message = models.TextField(
        verbose_name="Message / Lettre de motivation",
        blank=True,
        help_text="Lettre de motivation ou message personnalisé pour cette offre",
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending",
        verbose_name="Statut",
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Date de candidature")

    class Meta:
        verbose_name = "Candidature"
        verbose_name_plural = "Candidatures"
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["user", "job_offer"],
                name="unique_application_per_user_job",
            )
        ]

    def __str__(self):
        return f"{self.user.username} → {self.job_offer.title}"
