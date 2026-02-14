import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CompanyService } from '../../core/services/company.service';
import { Company } from '../../core/models/job.model';

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page">
      <div class="container">
        <nav class="breadcrumb">
          <a routerLink="/">Accueil</a>
          <span class="breadcrumb__sep">/</span>
          <span>Entreprises</span>
        </nav>
        <header class="page__header">
          <h1 class="page__title">Entreprises</h1>
          <p class="page__subtitle">Découvrez les entreprises qui recrutent</p>
        </header>
        @if (loading) {
          <div class="loading">
            <div class="loading__spinner"></div>
            <p>Chargement...</p>
          </div>
        }
        @if (error && !loading) {
          <div class="empty-state">
            <p class="empty-state__text">{{ error }}</p>
          </div>
        }
        @if (!loading && !error && companies.length === 0) {
          <div class="empty-state">
            <p class="empty-state__text">Aucune entreprise pour le moment.</p>
          </div>
        }
        @if (!loading && !error && companies.length > 0) {
          <div class="company-grid">
            @for (company of companies; track company.id) {
              <a [routerLink]="['/companies', company.id]" class="company-card">
                <div class="company-card__icon">{{ company.name.charAt(0) }}</div>
                <div class="company-card__content">
                  <h3 class="company-card__name">{{ company.name }}</h3>
                  @if (company.sector) {
                    <span class="company-card__sector">{{ company.sector }}</span>
                  }
                </div>
                <span class="company-card__cta">Voir les offres</span>
              </a>
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

      .breadcrumb__sep { margin: 0 0.5rem; }

      .page__header {
        margin-bottom: 2rem;
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

      .company-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1.5rem;
      }

      .company-card {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1.5rem;
        background: var(--color-bg-card);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        text-decoration: none;
        color: inherit;
        transition: border-color 0.2s, box-shadow 0.2s;
      }

      .company-card:hover {
        border-color: var(--color-primary);
        box-shadow: var(--shadow-md);
      }

      .company-card__icon {
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--gradient-accent);
        color: white;
        font-weight: 700;
        font-size: 1.25rem;
        border-radius: var(--radius-md);
      }

      .company-card__name {
        margin: 0;
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--color-text);
      }

      .company-card__sector {
        font-size: 0.9rem;
        color: var(--color-text-muted);
      }

      .company-card__cta {
        font-size: 0.9rem;
        font-weight: 500;
        color: var(--color-primary);
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
    `,
  ],
})
export class CompaniesComponent implements OnInit {
  companies: Company[] = [];
  loading = true;
  error = '';

  constructor(private companyService: CompanyService) {}

  ngOnInit(): void {
    this.companyService.getCompanies().subscribe({
      next: (res) => {
        this.companies = res.results;
        this.loading = false;
      },
      error: () => {
        this.error = 'Impossible de charger les entreprises.';
        this.loading = false;
      },
    });
  }
}
