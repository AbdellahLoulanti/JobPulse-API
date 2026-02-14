import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobService } from '../../../core/services/job.service';
import { ApplicationService } from '../../../core/services/application.service';
import { AuthService } from '../../../core/services/auth.service';
import { ProfileService } from '../../../core/services/profile.service';
import { JobOffer } from '../../../core/models/job.model';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page">
      <div class="container container--narrow">
        <nav class="breadcrumb">
          <a routerLink="/">Accueil</a>
          <span class="breadcrumb__sep">/</span>
          <a routerLink="/jobs">Offres</a>
          <span class="breadcrumb__sep">/</span>
          <span>Détail</span>
        </nav>
        @if (loading) {
          <div class="loading">
            <div class="loading__spinner"></div>
          </div>
        } @else if (job) {
          <a routerLink="/jobs" class="back-link">← Retour aux offres</a>
          <article class="job-detail">
            <header class="job-detail__header">
              <h1 class="job-detail__title">{{ job.title }}</h1>
              @if (job.company) {
                <a [routerLink]="['/companies', job.company.id]" class="job-detail__company">
                  {{ job.company.name }}
                </a>
              }
              <div class="job-detail__meta">
                @if (job.location) {
                  <span class="badge">📍 {{ job.location }}</span>
                }
                @if (job.salary) {
                  <span class="badge">💰 {{ formatSalary(job.salary) }}</span>
                }
              </div>
              @if (auth.isLoggedIn()) {
                @if (hasApplied) {
                  <p class="job-detail__applied">Vous avez déjà postulé à cette offre. <a routerLink="/applications">Voir mes candidatures</a></p>
                } @else {
                  <div class="job-detail__apply">
                    <p class="apply__hint">Votre CV et votre lettre de motivation (profil) seront envoyés. Complétez votre <a routerLink="/profile">profil</a> si nécessaire.</p>
                    <textarea
                      [(ngModel)]="applyMessage"
                      class="apply__input"
                      placeholder="Message ou lettre de motivation personnalisée pour cette offre"
                      rows="4"
                    ></textarea>
                    <button class="btn btn--primary" (click)="postuler()" [disabled]="applying">
                      {{ applying ? 'Envoi...' : 'Postuler' }}
                    </button>
                  </div>
                }
              } @else {
                <a routerLink="/login" class="btn btn--primary">Connectez-vous pour postuler</a>
              }
            </header>
            @if (job.description) {
              <div class="job-detail__body">
                <h3>Description</h3>
                <div class="job-detail__desc">{{ job.description }}</div>
              </div>
            }
          </article>
        } @else {
          <div class="empty-state">
            <p>Offre introuvable.</p>
            <a routerLink="/jobs" class="btn btn--primary">Retour aux offres</a>
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

      .back-link {
        display: inline-block;
        margin-bottom: 1.5rem;
        color: var(--color-text-muted);
        text-decoration: none;
        font-size: 0.95rem;
      }

      .back-link:hover {
        color: var(--color-primary);
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

      .breadcrumb__sep { margin: 0 0.5rem; }

      .job-detail__apply {
        margin-top: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .apply__hint {
        font-size: 0.9rem;
        color: var(--color-text-muted);
        margin: 0 0 0.5rem 0;
      }

      .apply__hint a {
        color: var(--color-primary);
      }

      .apply__input {
        padding: 0.75rem;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        font-family: inherit;
        resize: vertical;
      }

      .job-detail__applied {
        margin-top: 1rem;
        color: var(--color-primary);
        font-weight: 500;
      }

      .job-detail__applied a {
        color: var(--color-primary);
        text-decoration: underline;
      }

      .job-detail {
        background: var(--color-bg-card);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        padding: 2rem;
      }

      .job-detail__header {
        margin-bottom: 2rem;
        padding-bottom: 1.5rem;
        border-bottom: 1px solid var(--color-border);
      }

      .job-detail__title {
        margin: 0 0 0.5rem 0;
        font-size: 1.75rem;
        font-weight: 700;
        color: var(--color-text);
      }

      .job-detail__company {
        display: inline-block;
        color: var(--color-primary);
        text-decoration: none;
        font-weight: 500;
        margin-bottom: 1rem;
      }

      .job-detail__company:hover {
        text-decoration: underline;
      }

      .job-detail__meta {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      .badge {
        padding: 0.35rem 0.75rem;
        background: var(--color-bg-hover);
        border-radius: var(--radius-md);
        font-size: 0.9rem;
        color: var(--color-text-muted);
      }

      .job-detail__body h3 {
        margin: 0 0 1rem 0;
        font-size: 1.1rem;
        font-weight: 600;
      }

      .job-detail__desc {
        color: var(--color-text-muted);
        line-height: 1.7;
        white-space: pre-wrap;
      }

      .container--narrow {
        max-width: 720px;
      }

      .loading,
      .empty-state {
        text-align: center;
        padding: 3rem 2rem;
      }

      .loading__spinner {
        width: 40px;
        height: 40px;
        margin: 0 auto;
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
export class JobDetailComponent implements OnInit {
  job: JobOffer | null = null;
  loading = true;
  applying = false;
  hasApplied = false;
  applyMessage = '';

  constructor(
    private route: ActivatedRoute,
    private jobService: JobService,
    private applicationService: ApplicationService,
    private profileService: ProfileService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.loading = false;
      return;
    }
    if (this.auth.isLoggedIn()) {
      this.profileService.getMyProfile().subscribe({
        next: (p) => {
          if (p.cover_letter) this.applyMessage = p.cover_letter;
        },
      });
    }
    this.jobService.getJob(+id).subscribe({
      next: (job) => {
        this.job = job;
        this.loading = false;
        if (this.auth.isLoggedIn()) this.checkApplied(+id);
      },
      error: () => {
        this.job = null;
        this.loading = false;
      },
    });
  }

  private checkApplied(jobId: number): void {
    this.applicationService.getMyApplications().subscribe({
      next: (res) => {
        this.hasApplied = res.results.some((a) => a.job_offer === jobId);
      },
    });
  }

  postuler(): void {
    if (!this.job) return;
    this.applying = true;
    this.applicationService.apply(this.job.id, this.applyMessage).subscribe({
      next: () => {
        this.hasApplied = true;
        this.applying = false;
      },
      error: () => {
        this.applying = false;
      },
    });
  }

  formatSalary(value: number | string): string {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(num);
  }
}
