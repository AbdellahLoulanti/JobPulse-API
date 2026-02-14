import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApplicationService, Application } from '../../core/services/application.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page">
      <div class="container">
        <nav class="breadcrumb">
          <a routerLink="/">Accueil</a>
          <span class="breadcrumb__sep">/</span>
          <span>Mes candidatures</span>
        </nav>
        <header class="page__header">
          <h1 class="page__title">Mes candidatures</h1>
          <p class="page__subtitle">Suivez l'état de vos candidatures</p>
        </header>

        @if (!auth.isLoggedIn()) {
          <div class="empty-state">
            <p>Connectez-vous pour voir vos candidatures.</p>
            <a routerLink="/login" class="btn btn--primary">Se connecter</a>
          </div>
        } @else if (!auth.isCandidate()) {
          <div class="empty-state">
            <p>Cette page est réservée aux candidats.</p>
            <a routerLink="/" class="btn btn--primary">Retour à l'accueil</a>
          </div>
        } @else if (loading) {
          <div class="loading">
            <div class="loading__spinner"></div>
            <p>Chargement...</p>
          </div>
        } @else if (error) {
          <div class="empty-state">
            <p>{{ error }}</p>
          </div>
        } @else if (applications.length === 0) {
          <div class="empty-state">
            <p>Vous n'avez pas encore postulé.</p>
            <a routerLink="/jobs" class="btn btn--primary">Explorer les offres</a>
          </div>
        } @else {
          <div class="application-list">
            @for (app of applications; track app.id) {
              <div class="application-card">
                <div class="application-card__content">
                  <h3 class="application-card__title">
                    <a [routerLink]="['/jobs', app.job_offer]">{{ app.job_offer_title }}</a>
                  </h3>
                  <span class="application-card__date">
                    Postulé le {{ formatDate(app.created_at) }}
                  </span>
                </div>
                <span class="application-card__status" [class]="'status--' + app.status">
                  {{ statusLabel(app.status) }}
                </span>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .page {
        padding: 1rem 0;
      }

      .breadcrumb {
        margin-bottom: 1rem;
        font-size: 0.9rem;
        color: var(--color-text-muted);
      }

      .breadcrumb a {
        color: var(--color-primary);
        text-decoration: none;
      }

      .page__header {
        margin-bottom: 2rem;
      }

      .page__title {
        margin: 0 0 0.5rem 0;
        font-size: 1.75rem;
        font-weight: 700;
      }

      .page__subtitle {
        margin: 0;
        color: var(--color-text-muted);
      }

      .application-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .application-card {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 1rem;
        padding: 1.5rem;
        background: var(--color-bg-card);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
      }

      .application-card__title {
        margin: 0 0 0.25rem 0;
        font-size: 1.1rem;
      }

      .application-card__title a {
        color: var(--color-text);
        text-decoration: none;
      }

      .application-card__title a:hover {
        color: var(--color-primary);
      }

      .application-card__date {
        font-size: 0.9rem;
        color: var(--color-text-muted);
      }

      .application-card__status {
        padding: 0.35rem 0.75rem;
        border-radius: var(--radius-md);
        font-size: 0.85rem;
        font-weight: 500;
      }

      .status--pending {
        background: #fef3c7;
        color: #92400e;
      }

      .status--accepted {
        background: #d1fae5;
        color: #065f46;
      }

      .status--rejected {
        background: #fee2e2;
        color: #991b1b;
      }

      .loading,
      .empty-state {
        text-align: center;
        padding: 3rem 2rem;
        color: var(--color-text-muted);
      }

      .empty-state .btn {
        margin-top: 1rem;
      }

      .loading__spinner {
        width: 40px;
        height: 40px;
        margin: 0 auto 1rem;
        border: 3px solid var(--color-border);
        border-top-color: var(--color-primary);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `,
  ],
})
export class ApplicationsComponent implements OnInit {
  applications: Application[] = [];
  loading = true;
  error = '';

  constructor(
    public auth: AuthService,
    private applicationService: ApplicationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.auth.isLoggedIn() || !this.auth.isCandidate()) {
      this.loading = false;
      return;
    }
    this.applicationService.getMyApplications().subscribe({
      next: (res) => {
        this.applications = res.results;
        this.loading = false;
      },
      error: () => {
        this.error = 'Impossible de charger vos candidatures.';
        this.loading = false;
      },
    });
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  statusLabel(status: string): string {
    const labels: Record<string, string> = {
      pending: 'En attente',
      accepted: 'Acceptée',
      rejected: 'Refusée',
    };
    return labels[status] || status;
  }
}
