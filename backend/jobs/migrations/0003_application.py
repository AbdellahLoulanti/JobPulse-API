# Migration: Modèle Application (candidatures)

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("jobs", "0002_company_and_migrate"),
    ]

    operations = [
        migrations.CreateModel(
            name="Application",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("message", models.TextField(blank=True, verbose_name="Message de motivation")),
                ("status", models.CharField(
                    choices=[("pending", "En attente"), ("accepted", "Acceptée"), ("rejected", "Refusée")],
                    default="pending",
                    max_length=20,
                    verbose_name="Statut",
                )),
                ("created_at", models.DateTimeField(auto_now_add=True, verbose_name="Date de candidature")),
                ("job_offer", models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name="applications",
                    to="jobs.joboffer",
                    verbose_name="Offre",
                )),
                ("user", models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name="applications",
                    to=settings.AUTH_USER_MODEL,
                    verbose_name="Candidat",
                )),
            ],
            options={
                "verbose_name": "Candidature",
                "verbose_name_plural": "Candidatures",
                "ordering": ["-created_at"],
            },
        ),
        migrations.AddConstraint(
            model_name="application",
            constraint=models.UniqueConstraint(
                fields=("user", "job_offer"),
                name="unique_application_per_user_job",
            ),
        ),
    ]
