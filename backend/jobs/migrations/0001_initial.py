# Generated migration for JobOffer model

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="JobOffer",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(max_length=255, verbose_name="Titre")),
                ("company", models.CharField(max_length=255, verbose_name="Entreprise")),
                ("description", models.TextField(blank=True, verbose_name="Description")),
                ("salary", models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True, verbose_name="Salaire")),
                ("location", models.CharField(default="Non précisé", max_length=255, verbose_name="Lieu")),
                ("created_at", models.DateTimeField(auto_now_add=True, verbose_name="Date de création")),
            ],
            options={
                "verbose_name": "Offre d'emploi",
                "verbose_name_plural": "Offres d'emploi",
                "ordering": ["-created_at"],
            },
        ),
    ]
