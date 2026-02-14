"""
core/celery.py - Configuration Celery
======================================

Celery = système de file d'attente pour exécuter des tâches en arrière-plan.
- Broker (Redis) : stocke les tâches en attente
- Worker : process qui consomme les tâches et les exécute

Ce fichier crée l'instance Celery et la configure pour utiliser :
1. Django settings (DJANGO_SETTINGS_MODULE)
2. Redis comme broker (CELERY_BROKER_URL)
"""
import os
from celery import Celery

# Définir le module settings par défaut pour Celery
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")

app = Celery("core")

# Charger la config depuis Django settings avec le préfixe CELERY_
# Ex: CELERY_BROKER_URL dans settings → broker_url pour Celery
app.config_from_object("django.conf:settings", namespace="CELERY")

# Découvrir automatiquement les tâches dans les apps installées
# Cherche un fichier tasks.py dans chaque app (jobs/tasks.py)
app.autodiscover_tasks()


@app.task(bind=True)
def debug_task(self):
    """Tâche de test pour vérifier que Celery fonctionne."""
    print(f"Request: {self.request!r}")
