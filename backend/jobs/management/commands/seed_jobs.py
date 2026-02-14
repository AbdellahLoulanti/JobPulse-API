"""
Commande : python manage.py seed_jobs
Ajoute des entreprises et offres d'emploi de démonstration.
"""
from decimal import Decimal
from django.core.management.base import BaseCommand
from jobs.models import Company, JobOffer


class Command(BaseCommand):
    help = "Crée des entreprises et offres d'emploi de démonstration"

    def handle(self, *args, **options):
     

        companies = [
            Company(name="TechCorp France", sector="Technologie", description="Startup innovante dans le développement logiciel."),
            Company(name="DataFlow SAS", sector="Data & IA", description="Spécialiste de l'analyse de données et de l'intelligence artificielle."),
            Company(name="GreenEnergy", sector="Énergie", description="Leader des énergies renouvelables en Europe."),
        ]
        for c in companies:
            c.save()
        self.stdout.write(f"  Créé {len(companies)} entreprises")

        jobs_data = [
            {"title": "Développeur Python", "company": companies[0], "salary": 45000, "location": "Paris"},
            {"title": "Ingénieur DevOps", "company": companies[0], "salary": 55000, "location": "Lyon"},
            {"title": "Data Scientist", "company": companies[1], "salary": 50000, "location": "Paris"},
            {"title": "Développeur Full Stack", "company": companies[0], "salary": 48000, "location": "Remote"},
            {"title": "Chef de projet IT", "company": companies[0], "salary": 52000, "location": "Paris"},
            {"title": "Ingénieur Machine Learning", "company": companies[1], "salary": 58000, "location": "Lyon"},
            {"title": "Consultant Data", "company": companies[1], "salary": 47000, "location": "Paris"},
            {"title": "Ingénieur Énergie", "company": companies[2], "salary": 44000, "location": "Nantes"},
            {"title": "Analyste Business Intelligence", "company": companies[1], "salary": 42000, "location": "Remote"},
        ]

        for j in jobs_data:
            JobOffer.objects.create(
                title=j["title"],
                company=j["company"],
                salary=Decimal(str(j["salary"])),
                location=j["location"],
                description=f"Rejoignez notre équipe pour le poste de {j['title']}. Expérience souhaitée, esprit d'équipe.",
            )
        self.stdout.write(self.style.SUCCESS(f"  Créé {len(jobs_data)} offres d'emploi"))
        self.stdout.write(self.style.SUCCESS("Données de démonstration créées avec succès."))
