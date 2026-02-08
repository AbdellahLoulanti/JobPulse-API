"""
jobs/tasks.py - Tâches Celery
==============================

Les tâches Celery s'exécutent en arrière-plan (dans le worker).
Elles sont appelées de manière asynchrone : la requête HTTP ne bloque pas.

Exemple : envoi d'email après création d'une offre.
"""
import time
from celery import shared_task


@shared_task
def send_job_notification_task(job_id: int, job_title: str, company: str):
    """
    Simule l'envoi d'un email de notification pour une nouvelle offre.
    
    En production, on remplacerait time.sleep(5) par un vrai envoi (SendGrid, etc.)
    
    Args:
        job_id: ID de l'offre créée
        job_title: Titre du poste
        company: Nom de l'entreprise
    """
    # Simule le temps d'envoi d'un email (5 secondes)
    time.sleep(5)
    # En production : send_mail(...)
    print(f"[Celery] Notification envoyée pour offre #{job_id}: {job_title} @ {company}")
