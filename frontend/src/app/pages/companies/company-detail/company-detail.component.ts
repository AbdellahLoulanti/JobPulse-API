import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CompanyService } from '../../../core/services/company.service';
import { JobService } from '../../../core/services/job.service';
import { Company } from '../../../core/models/job.model';
import { JobOffer } from '../../../core/models/job.model';
import { JobCardComponent } from '../../../shared/job-card/job-card.component';

@Component({
  selector: 'app-company-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, JobCardComponent],
  template: `
    <div class="page">
      <div class="container">
        @if (loading) {
          <div class="loading">
            <div class="loading__spinner"></div>
          </div>
        }
        @else if (company) {
          <nav class="breadcrumb">
            <a routerLink="/">Accueil</a>
            <span class="breadcrumb__sep">/</span>
            <a routerLink="/companies">Entreprises</a>
            <span class="breadcrumb__sep">/</span>
            <span>{{ company.name }}</span>
          </nav>
          <a routerLink="/companies" class="back-link">← Retour aux entreprises</a>
          <div class="company-detail">
            <header class="company-detail__header">
              <div class="company-detail__icon">{{ company.name.charAt(0) }}</div>
              <div class="company-detail__info">
                <h1 class="company-detail__name">{{ company.name }}</h1>
                @if (company.sector) {
                  <span class="company-detail__sector">{{ company.sector }}</span>
                }
              </div>
            </header>
            @if (company.description) {
              <div class="company-detail__desc">{{ company.description }}</div>
            }
          </div>
          @if (jobs.length > 0) {
            <section class="section">
              <h2 class="section__title">Offres de cette entreprise</h2>
              <div class="job-grid">
                @for (job of jobs; track job.id) {
                  <app-job-card [job]="job" />
                }
              </div>
            </section>
          }
        }
        @else {
          <div class="empty-state">
            <p>Entreprise introuvable.</p>
            <a routerLink="/companies" class="btn btn--primary">Retour aux entreprises</a>
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

      .back-link {
        display: inline-block;
        margin-bottom: 1.5rem;
        color: var(--color-text-muted);
        text-decoration: none;
      }

      .back-link:hover {
        color: var(--color-primary);
      }

      .company-detail {
        background: var(--color-bg-card);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        padding: 2rem;
        margin-bottom: 2rem;
      }

      .company-detail__header {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        margin-bottom: 1.5rem;
      }

      .company-detail__icon {
        width: 64px;
        height: 64px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--gradient-accent);
        color: white;
        font-weight: 700;
        font-size: 1.75rem;
        border-radius: var(--radius-md);
      }

      .company-detail__name {
        margin: 0 0 0.25rem 0;
        font-size: 1.5rem;
        font-weight: 700;
      }

      .company-detail__sector {
        font-size: 0.95rem;
        color: var(--color-text-muted);
      }

      .company-detail__desc {
        color: var(--color-text-muted);
        line-height: 1.7;
        white-space: pre-wrap;
      }

      .section {
        padding-top: 1rem;
      }

      .section__title {
        margin: 0 0 1.5rem 0;
        font-size: 1.25rem;
        font-weight: 600;
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
export class CompanyDetailComponent implements OnInit {
  company: Company | null = null;
  jobs: JobOffer[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private companyService: CompanyService,
    private jobService: JobService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.loading = false;
      return;
    }
    this.companyService.getCompany(+id).subscribe({
      next: (company) => {
        this.company = company;
        this.loadJobs(+id);
      },
      error: () => {
        this.company = null;
        this.loading = false;
      },
    });
  }

  private loadJobs(companyId: number): void {
    this.jobService.getJobs().subscribe({
      next: (res) => {
        this.jobs = res.results.filter((j) => j.company?.id === companyId);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
