# Migration: Créer Company et migrer JobOffer.company (CharField -> ForeignKey)

from django.db import migrations, models
from django.db.models import deletion


def migrate_companies(apps, schema_editor):
    """Crée les Company à partir des noms existants et lie les JobOffers."""
    JobOffer = apps.get_model("jobs", "JobOffer")
    Company = apps.get_model("jobs", "Company")
    for job in JobOffer.objects.all():
        if job.company_name:
            company, _ = Company.objects.get_or_create(name=job.company_name)
            job.company_new = company
            job.save()


def reverse_migrate(apps, schema_editor):
    """Retour arrière : remet company_name depuis Company."""
    JobOffer = apps.get_model("jobs", "JobOffer")
    for job in JobOffer.objects.filter(company_new__isnull=False):
        job.company_name = job.company_new.name
        job.save()


class Migration(migrations.Migration):

    dependencies = [
        ("jobs", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Company",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=255, verbose_name="Nom")),
                ("sector", models.CharField(blank=True, max_length=255, verbose_name="Secteur")),
                ("description", models.TextField(blank=True, verbose_name="Description")),
                ("created_at", models.DateTimeField(auto_now_add=True, verbose_name="Date de création")),
            ],
            options={
                "verbose_name": "Entreprise",
                "verbose_name_plural": "Entreprises",
                "ordering": ["name"],
            },
        ),
        migrations.RenameField(
            model_name="joboffer",
            old_name="company",
            new_name="company_name",
        ),
        migrations.AddField(
            model_name="joboffer",
            name="company_new",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=deletion.CASCADE,
                related_name="job_offers",
                to="jobs.company",
                verbose_name="Entreprise",
            ),
        ),
        migrations.RunPython(migrate_companies, reverse_migrate),
        migrations.RemoveField(
            model_name="joboffer",
            name="company_name",
        ),
        migrations.RenameField(
            model_name="joboffer",
            old_name="company_new",
            new_name="company",
        ),
    ]
