"""
jobs/signals.py - Signals Django
=================================

Les Signals permettent d'exécuter du code lors d'événements du modèle :
- post_save : après la sauvegarde (create ou update)
- pre_save : avant la sauvegarde
- post_delete : après suppression
- etc.

Ici : à chaque création/mise à jour d'une JobOffer, on envoie une notification
via Celery (de manière asynchrone pour ne pas bloquer la requête).
"""
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import JobOffer
from .tasks import send_job_notification_task


@receiver(post_save, sender=JobOffer)
def job_offer_post_save(sender, instance, created, **kwargs):
    """
    Déclenché après chaque save() sur JobOffer.
    
    - created=True : c'est une création (pas une mise à jour)
    - On appelle la tâche Celery pour envoyer la notification en arrière-plan
    - .delay() = exécution asynchrone (ne bloque pas)
    """
    if created:
        company_name = instance.company.name if instance.company else "N/A"
        send_job_notification_task.delay(
            job_id=instance.id,
            job_title=instance.title,
            company=company_name,
        )
