# core/__init__.py
# =================
# Celery doit être importé au démarrage de Django pour que l'app
# soit enregistrée et que les tâches soient découvertes.
from .celery import app as celery_app

__all__ = ("celery_app",)
