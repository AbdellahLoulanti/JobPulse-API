import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService, UserRole } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <h1 class="auth__title">Inscription</h1>
        <p class="auth__subtitle">Créez votre compte JobPulse</p>
        @if (error) {
          <div class="auth__error">{{ error }}</div>
        }
        <form class="auth__form" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label class="auth__label">Je suis</label>
            <div class="role-choices">
              <label class="role-choice">
                <input type="radio" name="role" value="candidate" [(ngModel)]="role" />
                <span class="role-label">Candidat</span>
                <span class="role-desc">Je cherche un emploi</span>
              </label>
              <label class="role-choice">
                <input type="radio" name="role" value="recruiter" [(ngModel)]="role" />
                <span class="role-label">Recruteur</span>
                <span class="role-desc">Je recrute</span>
              </label>
              <label class="role-choice">
                <input type="radio" name="role" value="both" [(ngModel)]="role" />
                <span class="role-label">Les deux</span>
                <span class="role-desc">Candidat et recruteur</span>
              </label>
            </div>
          </div>
          <label class="auth__label">Nom d'utilisateur</label>
          <input type="text" class="auth__input" [(ngModel)]="username" name="username" required />
          <label class="auth__label">Email (optionnel)</label>
          <input type="email" class="auth__input" [(ngModel)]="email" name="email" />
          <label class="auth__label">Mot de passe</label>
          <input type="password" class="auth__input" [(ngModel)]="password" name="password" required />
          <button type="submit" class="btn btn--primary auth__btn" [disabled]="loading">
            {{ loading ? 'Inscription...' : "S'inscrire" }}
          </button>
        </form>
        <p class="auth__footer">
          Déjà un compte ?
          <a routerLink="/login">Se connecter</a>
        </p>
      </div>
    </div>
  `,
  styles: [
    `
      .auth-page { display: flex; justify-content: center; align-items: center; min-height: 60vh; padding: 2rem; }
      .auth-card { width: 100%; max-width: 400px; background: var(--color-bg-card); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 2rem; }
      .auth__title { margin: 0 0 0.5rem 0; font-size: 1.5rem; font-weight: 700; }
      .auth__subtitle { margin: 0 0 1.5rem 0; color: var(--color-text-muted); font-size: 0.95rem; }
      .auth__error { padding: 0.75rem; background: #fef2f2; color: #dc2626; border-radius: var(--radius-md); margin-bottom: 1rem; font-size: 0.9rem; }
      .auth__form { display: flex; flex-direction: column; gap: 1rem; }
      .auth__label { font-weight: 500; font-size: 0.9rem; }
      .auth__input { padding: 0.75rem 1rem; border: 1px solid var(--color-border); border-radius: var(--radius-md); font-family: inherit; }
      .auth__btn { margin-top: 0.5rem; }
      .auth__footer { margin: 1.5rem 0 0 0; text-align: center; color: var(--color-text-muted); font-size: 0.95rem; }
      .auth__footer a { color: var(--color-primary); text-decoration: none; }
      .role-choices { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 0.5rem; }
      .role-choice { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; border: 1px solid var(--color-border); border-radius: var(--radius-md); cursor: pointer; transition: border-color 0.2s; }
      .role-choice:has(input:checked) { border-color: var(--color-primary); background: var(--color-primary-light); }
      .role-choice input { margin: 0; }
      .role-label { font-weight: 600; }
      .role-desc { color: var(--color-text-muted); font-size: 0.85rem; margin-left: auto; }
    `,
  ],
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  role: UserRole = 'candidate';
  loading = false;
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit(): void {
    this.loading = true;
    this.error = '';
    this.auth.register(this.username, this.password, this.role, this.email || undefined).subscribe({
      next: () => {
        this.auth.login(this.username, this.password).subscribe({
          next: () => this.router.navigate(['/']),
          error: () => {
            this.router.navigate(['/login']);
            this.loading = false;
          },
        });
      },
      error: (err: { error?: { detail?: string } }) => {
        this.error = err?.error?.detail || "Erreur lors de l'inscription.";
        this.loading = false;
      },
    });
  }
}
