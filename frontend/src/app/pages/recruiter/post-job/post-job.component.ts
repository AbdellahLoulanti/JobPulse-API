import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecruiterService } from '../../../core/services/recruiter.service';
import { CompanyService } from '../../../core/services/company.service';
import { AuthService } from '../../../core/services/auth.service';
import { Company } from '../../../core/models/job.model';

@Component({
  selector: 'app-post-job',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page">
      <div class="container container--narrow">
        <nav class="breadcrumb">
          <a routerLink="/">Accueil</a>
          <span class="breadcrumb__sep">/</span>
          <span>Publier une offre</span>
        </nav>

        @if (!auth.isLoggedIn()) {
          <div class="empty-state">
            <p>Connectez-vous pour publier des offres.</p>
            <a routerLink="/login" class="btn btn--primary">Se connecter</a>
          </div>
        } @else if (!auth.isRecruiter()) {
          <div class="empty-state">
            <p>Cette page est réservée aux recruteurs.</p>
            <a routerLink="/" class="btn btn--primary">Retour à l'accueil</a>
          </div>
        } @else {
          <header class="page__header">
            <h1 class="page__title">Publier une offre d'emploi</h1>
            <p class="page__subtitle">Recruteurs : diffusez vos offres sur JobPulse</p>
          </header>

          @if (successMessage) {
            <div class="alert alert--success">{{ successMessage }}</div>
          }
          @if (errorMessage) {
            <div class="alert alert--error">{{ errorMessage }}</div>
          }

          <form class="job-form" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label class="form-label">Entreprise *</label>
              <select class="form-input" [(ngModel)]="selectedCompanyId" name="company" required>
                <option value="">-- Choisir une entreprise --</option>
                @for (c of companies; track c.id) {
                  <option [value]="c.id">{{ c.name }}</option>
                }
              </select>
              <button type="button" class="btn btn--outline btn--sm" (click)="showNewCompany = true">
                + Créer une entreprise
              </button>
            </div>

            @if (showNewCompany) {
              <div class="form-card">
                <h3>Nouvelle entreprise</h3>
                <div class="form-group">
                  <label class="form-label">Nom</label>
                  <input type="text" class="form-input" [(ngModel)]="newCompany.name" name="newName" required />
                </div>
                <div class="form-group">
                  <label class="form-label">Secteur</label>
                  <input type="text" class="form-input" [(ngModel)]="newCompany.sector" name="newSector" />
                </div>
                <button type="button" class="btn btn--primary" (click)="createCompany()" [disabled]="creatingCompany">
                  Créer
                </button>
              </div>
            }

            <div class="form-group">
              <label class="form-label">Titre du poste *</label>
              <input type="text" class="form-input" [(ngModel)]="job.title" name="title" placeholder="Développeur Full Stack" required />
            </div>
            <div class="form-group">
              <label class="form-label">Lieu</label>
              <input type="text" class="form-input" [(ngModel)]="job.location" name="location" placeholder="Paris, Lyon, Remote..." />
            </div>
            <div class="form-group">
              <label class="form-label">Salaire (€)</label>
              <input type="number" class="form-input" [(ngModel)]="job.salary" name="salary" placeholder="45000" />
            </div>
            <div class="form-group">
              <label class="form-label">Description</label>
              <textarea class="form-textarea" [(ngModel)]="job.description" name="description" rows="6"></textarea>
            </div>
            <button type="submit" class="btn btn--primary" [disabled]="saving">
              {{ saving ? 'Publication...' : 'Publier l\'offre' }}
            </button>
          </form>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .page { padding: 1rem 0; }
      .container--narrow { max-width: 640px; }
      .breadcrumb { margin-bottom: 1rem; font-size: 0.9rem; color: var(--color-text-muted); }
      .breadcrumb a { color: var(--color-primary); text-decoration: none; }
      .breadcrumb__sep { margin: 0 0.5rem; }
      .page__header { margin-bottom: 1.5rem; }
      .page__title { margin: 0 0 0.5rem 0; font-size: 1.5rem; font-weight: 700; }
      .page__subtitle { margin: 0; color: var(--color-text-muted); }
      .alert { padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1rem; }
      .alert--success { background: #d1fae5; color: #065f46; }
      .alert--error { background: #fee2e2; color: #991b1b; }
      .job-form { display: flex; flex-direction: column; gap: 1.25rem; }
      .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
      .form-label { font-weight: 500; }
      .form-input, .form-textarea { padding: 0.75rem 1rem; border: 1px solid var(--color-border); border-radius: var(--radius-md); font-family: inherit; }
      .form-textarea { resize: vertical; min-height: 120px; }
      .form-card { padding: 1.5rem; background: var(--color-bg-hover); border-radius: var(--radius-lg); margin-bottom: 1rem; }
      .form-card h3 { margin: 0 0 1rem 0; font-size: 1.1rem; }
      .btn--sm { align-self: flex-start; margin-top: 0.5rem; }
      .empty-state { text-align: center; padding: 3rem 2rem; }
    `,
  ],
})
export class PostJobComponent implements OnInit {
  companies: Company[] = [];
  selectedCompanyId: number | null = null;
  showNewCompany = false;
  newCompany = { name: '', sector: '', description: '' };
  job = { title: '', location: '', salary: null as number | null, description: '' };
  saving = false;
  creatingCompany = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    public auth: AuthService,
    private recruiterService: RecruiterService,
    private companyService: CompanyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.auth.isLoggedIn() && this.auth.isRecruiter()) {
      this.loadCompanies();
    }
  }

  loadCompanies(): void {
    this.companyService.getCompanies().subscribe({
      next: (res) => (this.companies = res.results),
    });
  }

  createCompany(): void {
    if (!this.newCompany.name.trim()) return;
    this.creatingCompany = true;
    this.errorMessage = '';
    this.recruiterService.createCompany(this.newCompany).subscribe({
      next: (c) => {
        this.companies = [...this.companies, c];
        this.selectedCompanyId = c.id;
        this.showNewCompany = false;
        this.newCompany = { name: '', sector: '', description: '' };
        this.creatingCompany = false;
      },
      error: () => {
        this.errorMessage = "Erreur lors de la création de l'entreprise.";
        this.creatingCompany = false;
      },
    });
  }

  onSubmit(): void {
    if (!this.selectedCompanyId || !this.job.title.trim()) return;
    this.saving = true;
    this.errorMessage = '';
    this.recruiterService
      .createJob({
        title: this.job.title,
        company: this.selectedCompanyId,
        location: this.job.location || undefined,
        salary: this.job.salary || undefined,
        description: this.job.description || undefined,
      })
      .subscribe({
        next: () => {
          this.successMessage = "Offre publiée avec succès !";
          this.job = { title: '', location: '', salary: null, description: '' };
          this.saving = false;
        },
        error: () => {
          this.errorMessage = "Erreur lors de la publication.";
          this.saving = false;
        },
      });
  }
}
