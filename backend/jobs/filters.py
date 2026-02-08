"""
jobs/filters.py - Filtres pour l'API des offres d'emploi
========================================================

Permet de filtrer et rechercher les offres via des paramètres GET :
- location : contient (icontains)
- company : contient (icontains)
- salary_min : salaire >= valeur
- salary_max : salaire <= valeur
- search : recherche dans title et description (icontains)
"""
import django_filters
from .models import JobOffer


class JobOfferFilter(django_filters.FilterSet):
    """
    Filtres disponibles pour GET /api/jobs/ :
    - ?location=Paris
    - ?company=TechCorp
    - ?salary_min=30000
    - ?salary_max=80000
    - ?search=python
    """

    location = django_filters.CharFilter(lookup_expr="icontains", label="Lieu contient")
    company = django_filters.CharFilter(field_name="company__name", lookup_expr="icontains", label="Entreprise contient")
    salary_min = django_filters.NumberFilter(field_name="salary", lookup_expr="gte", label="Salaire min")
    salary_max = django_filters.NumberFilter(field_name="salary", lookup_expr="lte", label="Salaire max")

    class Meta:
        model = JobOffer
        fields = ["location", "company", "salary_min", "salary_max"]
