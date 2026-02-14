import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SlicePipe } from '@angular/common';
import { JobOffer } from '../../core/models/job.model';

@Component({
  selector: 'app-job-card',
  standalone: true,
  imports: [RouterLink, SlicePipe],
  template: `
    <a [routerLink]="['/jobs', job.id]" class="job-card">
      <div class="job-card__header">
        <h3 class="job-card__title">{{ job.title }}</h3>
        @if (job.company) {
          <span class="job-card__company">{{ job.company.name }}</span>
        }
      </div>
      <div class="job-card__meta">
        @if (job.location) {
          <span class="job-card__meta-item">
            <span class="icon">📍</span>
            {{ job.location }}
          </span>
        }
        @if (job.salary) {
          <span class="job-card__meta-item">
            <span class="icon">💰</span>
            {{ formatSalary(job.salary) }}
          </span>
        }
      </div>
      @if (job.description && truncate) {
        <p class="job-card__desc">{{ job.description | slice:0:120 }}{{ job.description.length > 120 ? '…' : '' }}</p>
      }
      <span class="job-card__cta">Voir l'offre →</span>
    </a>
  `,
  styles: [
    `
      .job-card {
        display: block;
        padding: 1.5rem;
        background: var(--color-bg-card);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        text-decoration: none;
        color: inherit;
        transition: border-color 0.2s, box-shadow 0.2s;
      }

      .job-card:hover {
        border-color: var(--color-primary);
        box-shadow: var(--shadow-md);
      }

      .job-card__header {
        margin-bottom: 0.75rem;
      }

      .job-card__title {
        margin: 0 0 0.25rem 0;
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--color-text);
      }

      .job-card__company {
        font-size: 0.9rem;
        color: var(--color-text-muted);
      }

      .job-card__meta {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        margin-bottom: 0.75rem;
        font-size: 0.85rem;
        color: var(--color-text-muted);
      }

      .job-card__meta-item {
        display: flex;
        align-items: center;
        gap: 0.35rem;
      }

      .job-card__meta-item .icon {
        opacity: 0.8;
      }

      .job-card__desc {
        margin: 0 0 1rem 0;
        font-size: 0.9rem;
        color: var(--color-text-muted);
        line-height: 1.5;
      }

      .job-card__cta {
        font-size: 0.9rem;
        font-weight: 500;
        color: var(--color-primary);
        transition: gap 0.2s;
      }

      .job-card:hover .job-card__cta {
        gap: 0.25rem;
      }
    `,
  ],
})
export class JobCardComponent {
  @Input({ required: true }) job!: JobOffer;
  @Input() truncate = true;

  formatSalary(value: number | string): string {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(num);
  }
}
