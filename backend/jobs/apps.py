"""
Configuration de l'app jobs
===========================
On utilise ready() pour connecter les signals au démarrage de Django.
"""
from django.apps import AppConfig


class JobsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "jobs"
    verbose_name = "Offres d'emploi"

    def ready(self):
        """
        Appelé quand Django a chargé toutes les apps.
        On importe les signals ici pour qu'ils soient enregistrés.
        """
        import jobs.signals  # noqa: F401
