"""Admin Django pour les offres d'emploi et entreprises"""
from django.contrib import admin
from .models import JobOffer, Company, Application


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ["name", "sector", "created_at"]
    search_fields = ["name", "sector", "description"]


@admin.register(JobOffer)
class JobOfferAdmin(admin.ModelAdmin):
    list_display = ["title", "company", "location", "salary", "created_at"]
    list_filter = ["company", "location"]
    search_fields = ["title", "company__name", "description"]


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ["user", "job_offer", "status", "created_at"]
    list_filter = ["status"]
    search_fields = ["user__username", "job_offer__title", "message"]
