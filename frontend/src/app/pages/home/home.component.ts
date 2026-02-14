import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { JobService } from '../../core/services/job.service';
import { JobOffer } from '../../core/models/job.model';
import { JobCardComponent } from '../../shared/job-card/job-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, JobCardComponent],
  template: `
    <section class="hero">
      <div class="hero__container">
        <h1 class="hero__title">
          Trouvez votre
          <span class="hero__accent">opportunité</span>
          idéale
        </h1>
        <p class="hero__subtitle">
          Des centaines d'offres d'emploi à portée de clic. Postulez en quelques minutes.
        </p>
        <div class="hero__actions">
          <a routerLink="/jobs" class="btn btn--primary">Explorer les offres</a>
          <a routerLink="/companies" class="btn btn--outline">Découvrir les entreprises</a>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section__header">
          <h2 class="section__title">Offres tendances</h2>
          <a routerLink="/jobs" class="section__link">Voir tout →</a>
        </div>
        @if (loading) {
          <div class="loading">
            <div class="loading__spinner"></div>
            <p>Chargement des offres...</p>
          </div>
        }
        @if (error && !loading) {
          <div class="empty-state">
            <p class="empty-state__text">{{ error }}</p>
            <p class="empty-state__hint">Assurez-vous que le backend est démarré sur le port 8000.</p>
          </div>
        }
        @if (!loading && !error && trendingJobs.length === 0) {
          <div class="empty-state">
            <p class="empty-state__text">Aucune offre tendance pour le moment.</p>
          </div>
        }
        @if (!loading && !error && trendingJobs.length > 0) {
          <div class="job-grid">
            @for (job of trendingJobs; track job.id) {
              <app-job-card [job]="job" />
            }
          </div>
        }
      </div>
    </section>
  `,
  styles: [
    `
      .hero {
        background: linear-gradient(135deg, var(--color-hero-bg) 0%, var(--color-hero-bg-alt) 100%);
        padding: 4rem 1.5rem;
        text-align: center;
      }

      .hero__container {
        max-width: 720px;
        margin: 0 auto;
      }

      .hero__title {
        margin: 0 0 1rem 0;
        font-size: clamp(2rem, 5vw, 3rem);
        font-weight: 700;
        line-height: 1.2;
        color: var(--color-text);
      }

      .hero__accent {
        background: var(--gradient-accent);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .hero__subtitle {
        margin: 0 0 2rem 0;
        font-size: 1.15rem;
        color: var(--color-text-muted);
        line-height: 1.6;
      }

      .hero__actions {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        justify-content: center;
      }

      .section {
        padding: 3rem 0;
      }

      .section__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      .section__title {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--color-text);
      }

      .section__link {
        color: var(--color-primary);
        text-decoration: none;
        font-weight: 500;
        font-size: 0.95rem;
      }

      .section__link:hover {
        text-decoration: underline;
      }

      .job-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 1.5rem;
      }

      .loading,
      .empty-state {
        text-align: center;
        padding: 3rem 2rem;
        color: var(--color-text-muted);
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

      .empty-state__hint {
        font-size: 0.9rem;
        margin-top: 0.5rem;
        opacity: 0.8;
      }
    `,
  ],
})
export class HomeComponent implements OnInit {
  trendingJobs: JobOffer[] = [];
  loading = true;
  error = '';

  constructor(private jobService: JobService) {}

  ngOnInit(): void {
    this.jobService.getTrendingJobs().subscribe({
      next: (jobs) => {
        this.trendingJobs = jobs;
        this.loading = false;
      },
      error: () => {
        this.error = 'Impossible de charger les offres tendances.';
        this.loading = false;
      },
    });
  }
}
