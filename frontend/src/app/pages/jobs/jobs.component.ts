import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { JobService, JobFilters } from '../../core/services/job.service';
import { JobOffer } from '../../core/models/job.model';
import { JobCardComponent } from '../../shared/job-card/job-card.component';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, JobCardComponent],
  template: `
    <div class="page">
      <div class="container">
        <nav class="breadcrumb">
          <a routerLink="/">Accueil</a>
          <span class="breadcrumb__sep">/</span>
          <span>Offres d'emploi</span>
        </nav>
        <header class="page__header">
          <h1 class="page__title">Offres d'emploi</h1>
          <p class="page__subtitle">Découvrez toutes les opportunités disponibles</p>
        </header>

        <div class="filters">
          <div class="filters__row">
            <input
              type="text"
              class="filters__search"
              placeholder="Rechercher (titre, description, entreprise)..."
              [(ngModel)]="filters.search"
              (keyup.enter)="applyFilters()"
            />
            <button class="btn btn--primary" (click)="applyFilters()">Rechercher</button>
          </div>
          <div class="filters__row filters__row--secondary">
            <input
              type="text"
              class="filters__input"
              placeholder="Lieu"
              [(ngModel)]="filters.location"
              (keyup.enter)="applyFilters()"
            />
            <input
              type="text"
              class="filters__input"
              placeholder="Entreprise"
              [(ngModel)]="filters.company"
              (keyup.enter)="applyFilters()"
            />
            <input
              type="number"
              class="filters__input"
              placeholder="Salaire min"
              [(ngModel)]="filters.salary_min"
              (keyup.enter)="applyFilters()"
            />
            <input
              type="number"
              class="filters__input"
              placeholder="Salaire max"
              [(ngModel)]="filters.salary_max"
              (keyup.enter)="applyFilters()"
            />
            <select class="filters__select" [(ngModel)]="filters.ordering" (change)="applyFilters()">
              <option value="-created_at">Plus récentes</option>
              <option value="created_at">Plus anciennes</option>
              <option value="-salary">Salaire décroissant</option>
              <option value="salary">Salaire croissant</option>
            </select>
          </div>
        </div>

        @if (loading) {
          <div class="loading">
            <div class="loading__spinner"></div>
            <p>Chargement des offres...</p>
          </div>
        } @else if (error) {
          <div class="empty-state">
            <p class="empty-state__text">{{ error }}</p>
          </div>
        } @else if (jobs.length === 0) {
          <div class="empty-state">
            <p class="empty-state__text">Aucune offre ne correspond à votre recherche.</p>
            <button class="btn btn--outline" (click)="resetFilters()">Réinitialiser les filtres</button>
          </div>
        } @else {
          <p class="results-count">{{ totalCount }} offre(s) trouvée(s)</p>
          <div class="job-grid">
            @for (job of jobs; track job.id) {
              <app-job-card [job]="job" />
            }
          </div>
          @if (totalPages > 1) {
            <div class="pagination">
              <button
                class="btn btn--outline"
                [disabled]="currentPage <= 1"
                (click)="goToPage(currentPage - 1)"
              >
                ← Précédent
              </button>
              <span class="pagination__info">
                Page {{ currentPage }} / {{ totalPages }}
              </span>
              <button
                class="btn btn--outline"
                [disabled]="currentPage >= totalPages"
                (click)="goToPage(currentPage + 1)"
              >
                Suivant →
              </button>
            </div>
          }
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

      .breadcrumb a:hover {
        text-decoration: underline;
      }

      .breadcrumb__sep {
        margin: 0 0.5rem;
      }

      .page__header {
        margin-bottom: 1.5rem;
      }

      .page__title {
        margin: 0 0 0.5rem 0;
        font-size: 1.75rem;
        font-weight: 700;
        color: var(--color-text);
      }

      .page__subtitle {
        margin: 0;
        color: var(--color-text-muted);
        font-size: 1rem;
      }

      .filters {
        background: var(--color-bg-card);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        padding: 1.25rem;
        margin-bottom: 1.5rem;
      }

      .filters__row {
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
        margin-bottom: 0.75rem;
      }

      .filters__row:last-child {
        margin-bottom: 0;
      }

      .filters__search {
        flex: 1;
        min-width: 200px;
        padding: 0.6rem 1rem;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        font-family: inherit;
      }

      .filters__input,
      .filters__select {
        padding: 0.6rem 1rem;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        font-family: inherit;
        min-width: 120px;
      }

      .results-count {
        margin-bottom: 1rem;
        color: var(--color-text-muted);
        font-size: 0.95rem;
      }

      .job-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 1.5rem;
      }

      .pagination {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        margin-top: 2rem;
        flex-wrap: wrap;
      }

      .pagination__info {
        color: var(--color-text-muted);
        font-size: 0.9rem;
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

      @media (max-width: 768px) {
        .filters__row--secondary {
          flex-direction: column;
        }

        .filters__input,
        .filters__select {
          min-width: 100%;
        }
      }
    `,
  ],
})
export class JobsComponent implements OnInit {
  jobs: JobOffer[] = [];
  loading = true;
  error = '';
  totalCount = 0;
  currentPage = 1;
  totalPages = 1;
  filters: JobFilters = {
    search: '',
    location: '',
    company: '',
    ordering: '-created_at',
    page: 1,
  };

  constructor(private jobService: JobService) {}

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    this.loading = true;
    this.error = '';
    this.jobService.getJobs(this.filters).subscribe({
      next: (res) => {
        this.jobs = res.results;
        this.totalCount = res.count;
        this.totalPages = Math.ceil(res.count / 10) || 1;
        this.loading = false;
      },
      error: () => {
        this.error = 'Impossible de charger les offres.';
        this.loading = false;
      },
    });
  }

  applyFilters(): void {
    this.filters.page = 1;
    this.currentPage = 1;
    this.loadJobs();
  }

  resetFilters(): void {
    this.filters = {
      search: '',
      location: '',
      company: '',
      salary_min: undefined,
      salary_max: undefined,
      ordering: '-created_at',
      page: 1,
    };
    this.currentPage = 1;
    this.loadJobs();
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.filters.page = page;
    this.loadJobs();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
