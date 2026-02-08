"""
jobs/models.py - Modèles Company, JobOffer et Application
=========================================================

Company : entreprise qui publie des offres
JobOffer : offre d'emploi, liée à une Company via ForeignKey
Application : candidature d'un utilisateur à une offre
"""
from django.conf import settings
from django.db import models


class Company(models.Model):
    """
    Entreprise qui publie des offres d'emploi.
    """
    name = models.CharField(max_length=255, verbose_name="Nom")
    sector = models.CharField(max_length=255, verbose_name="Secteur", blank=True)
    description = models.TextField(verbose_name="Description", blank=True)
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
    message = models.TextField(verbose_name="Message de motivation", blank=True)
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
