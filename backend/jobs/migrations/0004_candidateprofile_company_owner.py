# Generated migration for CandidateProfile and Company.owner

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


def cv_upload_path(instance, filename):
    ext = filename.split(".")[-1] if "." in filename else "pdf"
    return f"cvs/user_{instance.user_id}/cv.{ext}"


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("jobs", "0003_application"),
    ]

    operations = [
        migrations.CreateModel(
            name="CandidateProfile",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("full_name", models.CharField(blank=True, max_length=255, verbose_name="Nom complet")),
                ("phone", models.CharField(blank=True, max_length=50, verbose_name="Téléphone")),
                ("cv", models.FileField(blank=True, null=True, upload_to=cv_upload_path, verbose_name="CV")),
                ("cover_letter", models.TextField(blank=True, verbose_name="Lettre de motivation")),
                ("skills", models.TextField(blank=True, help_text="Compétences séparées par des virgules", verbose_name="Compétences")),
                ("experience", models.TextField(blank=True, verbose_name="Expérience professionnelle")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("user", models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name="candidate_profile", to=settings.AUTH_USER_MODEL, verbose_name="Utilisateur")),
            ],
            options={
                "verbose_name": "Profil candidat",
                "verbose_name_plural": "Profils candidats",
            },
        ),
        migrations.AddField(
            model_name="company",
            name="owner",
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="owned_companies", to=settings.AUTH_USER_MODEL, verbose_name="Recruteur"),
        ),
    ]
