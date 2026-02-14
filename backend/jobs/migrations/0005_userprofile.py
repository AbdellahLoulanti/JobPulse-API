# Generated migration for UserProfile

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("jobs", "0004_candidateprofile_company_owner"),
    ]

    operations = [
        migrations.CreateModel(
            name="UserProfile",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("role", models.CharField(choices=[("candidate", "Candidat"), ("recruiter", "Recruteur"), ("both", "Candidat et recruteur")], default="candidate", max_length=20, verbose_name="Rôle")),
                ("user", models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name="profile", to=settings.AUTH_USER_MODEL, verbose_name="Utilisateur")),
            ],
            options={
                "verbose_name": "Profil utilisateur",
                "verbose_name_plural": "Profils utilisateurs",
            },
        ),
    ]
