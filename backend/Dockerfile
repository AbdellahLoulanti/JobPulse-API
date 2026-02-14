# JobPulse API - Dockerfile
# =========================
# Étapes : 
# 1. Image de base légère Python 3.11 (slim = sans paquets inutiles)
# 2. Définir le répertoire de travail
# 3. Installer les dépendances
# 4. Copier le code source
# 5. Exposer le port 8000 (Django)

FROM python:3.11-slim

# Éviter les questions interactives pendant l'installation
ENV PYTHONUNBUFFERED=1

# Répertoire de travail dans le conteneur
WORKDIR /app

# Installer les dépendances système pour psycopg2 (PostgreSQL)
# libpq-dev = bibliothèques PostgreSQL
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copier requirements AVANT le code (meilleure utilisation du cache Docker)
# Si requirements.txt ne change pas, cette couche est mise en cache
COPY requirements.txt .

# Installer les paquets Python
RUN pip install --no-cache-dir -r requirements.txt

# Copier tout le code source
COPY . .

# Port exposé par l'application Django
EXPOSE 8000

# Commande par défaut (sera écrasée dans docker-compose pour chaque service)
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "core.wsgi:application"]
