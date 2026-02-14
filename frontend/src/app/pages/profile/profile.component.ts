import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService, CandidateProfile } from '../../core/services/profile.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page">
      <div class="container container--narrow">
        <nav class="breadcrumb">
          <a routerLink="/">Accueil</a>
          <span class="breadcrumb__sep">/</span>
          <span>Mon profil</span>
        </nav>

        @if (!auth.isLoggedIn()) {
          <div class="empty-state">
            <p>Connectez-vous pour gérer votre profil candidat.</p>
            <a routerLink="/login" class="btn btn--primary">Se connecter</a>
          </div>
        } @else if (!auth.isCandidate()) {
          <div class="empty-state">
            <p>Cette page est réservée aux candidats.</p>
            <a routerLink="/" class="btn btn--primary">Retour à l'accueil</a>
          </div>
        } @else {
          <header class="page__header">
            <h1 class="page__title">Mon profil candidat</h1>
            <p class="page__subtitle">Complétez votre profil pour postuler aux offres (CV, lettre de motivation)</p>
          </header>

          @if (successMessage) {
            <div class="alert alert--success">{{ successMessage }}</div>
          }
          @if (errorMessage) {
            <div class="alert alert--error">{{ errorMessage }}</div>
          }

          @if (loading && !profile) {
            <div class="loading">
              <div class="loading__spinner"></div>
            </div>
          } @else if (profile) {
            <form class="profile-form" (ngSubmit)="onSubmit()">
              <div class="form-group">
                <label class="form-label">Nom complet</label>
                <input type="text" class="form-input" [(ngModel)]="profile.full_name" name="full_name" placeholder="Jean Dupont" />
              </div>
              <div class="form-group">
                <label class="form-label">Téléphone</label>
                <input type="tel" class="form-input" [(ngModel)]="profile.phone" name="phone" placeholder="06 12 34 56 78" />
              </div>
              <div class="form-group">
                <label class="form-label">CV (PDF)</label>
                <input type="file" class="form-input" accept=".pdf,.doc,.docx" (change)="onFileChange($event)" />
                @if (profile.cv_url) {
                  <a [href]="profile.cv_url" target="_blank" class="form-hint">Voir le CV actuel</a>
                }
              </div>
              <div class="form-group">
                <label class="form-label">Lettre de motivation</label>
                <textarea class="form-textarea" [(ngModel)]="profile.cover_letter" name="cover_letter" rows="6" placeholder="Rédigez votre lettre de motivation type..."></textarea>
              </div>
              <div class="form-group">
                <label class="form-label">Compétences</label>
                <input type="text" class="form-input" [(ngModel)]="profile.skills" name="skills" placeholder="Python, Angular, Management, ..." />
              </div>
              <div class="form-group">
                <label class="form-label">Expérience professionnelle</label>
                <textarea class="form-textarea" [(ngModel)]="profile.experience" name="experience" rows="4" placeholder="Décrivez votre parcours..."></textarea>
              </div>
              <button type="submit" class="btn btn--primary" [disabled]="saving">
                {{ saving ? 'Enregistrement...' : 'Enregistrer mon profil' }}
              </button>
            </form>
          }
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
      .page__subtitle { margin: 0; color: var(--color-text-muted); font-size: 0.95rem; }
      .alert { padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1rem; }
      .alert--success { background: #d1fae5; color: #065f46; }
      .alert--error { background: #fee2e2; color: #991b1b; }
      .profile-form { display: flex; flex-direction: column; gap: 1.25rem; }
      .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
      .form-label { font-weight: 500; font-size: 0.95rem; }
      .form-input, .form-textarea { padding: 0.75rem 1rem; border: 1px solid var(--color-border); border-radius: var(--radius-md); font-family: inherit; }
      .form-textarea { resize: vertical; min-height: 100px; }
      .form-hint { font-size: 0.9rem; color: var(--color-primary); }
      .empty-state, .loading { text-align: center; padding: 3rem 2rem; }
      .loading__spinner { width: 40px; height: 40px; margin: 0 auto; border: 3px solid var(--color-border); border-top-color: var(--color-primary); border-radius: 50%; animation: spin 0.8s linear infinite; }
      @keyframes spin { to { transform: rotate(360deg); } }
    `,
  ],
})
export class ProfileComponent implements OnInit {
  profile: CandidateProfile | null = null;
  loading = true;
  saving = false;
  successMessage = '';
  errorMessage = '';
  cvFile: File | null = null;

  constructor(
    public auth: AuthService,
    private profileService: ProfileService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.auth.isLoggedIn() || !this.auth.isCandidate()) {
      this.loading = false;
      return;
    }
    this.profileService.getMyProfile().subscribe({
      next: (p) => {
        this.profile = {
          full_name: p.full_name || '',
          phone: p.phone || '',
          cover_letter: p.cover_letter || '',
          skills: p.skills || '',
          experience: p.experience || '',
          cv_url: p.cv_url,
        };
        this.loading = false;
      },
      error: () => {
        this.profile = { full_name: '', phone: '', cover_letter: '', skills: '', experience: '' };
        this.loading = false;
      },
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.cvFile = input.files[0];
    }
  }

  onSubmit(): void {
    if (!this.profile) return;
    this.saving = true;
    this.successMessage = '';
    this.errorMessage = '';
    const data = {
      full_name: this.profile.full_name,
      phone: this.profile.phone,
      cover_letter: this.profile.cover_letter,
      skills: this.profile.skills,
      experience: this.profile.experience,
    };
    const req = this.cvFile
      ? this.profileService.patchProfile(data, this.cvFile)
      : this.profileService.patchProfile(data);
    req.subscribe({
      next: (p) => {
        this.profile = { ...this.profile!, ...p };
        this.cvFile = null;
        this.saving = false;
        this.successMessage = 'Profil enregistré avec succès.';
      },
      error: () => {
        this.errorMessage = "Erreur lors de l'enregistrement.";
        this.saving = false;
      },
    });
  }
}
