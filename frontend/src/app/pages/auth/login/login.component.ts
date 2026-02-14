import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <h1 class="auth__title">Connexion</h1>
        <p class="auth__subtitle">Accédez à votre compte JobPulse</p>
        @if (error) {
          <div class="auth__error">{{ error }}</div>
        }
        <form class="auth__form" (ngSubmit)="onSubmit()">
          <label class="auth__label">Nom d'utilisateur</label>
          <input
            type="text"
            class="auth__input"
            [(ngModel)]="username"
            name="username"
            required
            autocomplete="username"
          />
          <label class="auth__label">Mot de passe</label>
          <input
            type="password"
            class="auth__input"
            [(ngModel)]="password"
            name="password"
            required
            autocomplete="current-password"
          />
          <button type="submit" class="btn btn--primary auth__btn" [disabled]="loading">
            {{ loading ? 'Connexion...' : 'Se connecter' }}
          </button>
        </form>
        <p class="auth__footer">
          Pas encore de compte ?
          <a routerLink="/register">S'inscrire</a>
        </p>
      </div>
    </div>
  `,
  styles: [
    `
      .auth-page {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 60vh;
        padding: 2rem;
      }

      .auth-card {
        width: 100%;
        max-width: 400px;
        background: var(--color-bg-card);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        padding: 2rem;
      }

      .auth__title {
        margin: 0 0 0.5rem 0;
        font-size: 1.5rem;
        font-weight: 700;
      }

      .auth__subtitle {
        margin: 0 0 1.5rem 0;
        color: var(--color-text-muted);
        font-size: 0.95rem;
      }

      .auth__error {
        padding: 0.75rem;
        background: #fef2f2;
        color: #dc2626;
        border-radius: var(--radius-md);
        margin-bottom: 1rem;
        font-size: 0.9rem;
      }

      .auth__form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .auth__label {
        font-weight: 500;
        font-size: 0.9rem;
      }

      .auth__input {
        padding: 0.75rem 1rem;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        font-family: inherit;
      }

      .auth__btn {
        margin-top: 0.5rem;
      }

      .auth__footer {
        margin: 1.5rem 0 0 0;
        text-align: center;
        color: var(--color-text-muted);
        font-size: 0.95rem;
      }

      .auth__footer a {
        color: var(--color-primary);
        text-decoration: none;
      }

      .auth__footer a:hover {
        text-decoration: underline;
      }
    `,
  ],
})
export class LoginComponent {
  username = '';
  password = '';
  loading = false;
  error = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.loading = true;
    this.error = '';
    this.auth.login(this.username, this.password).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: () => {
        this.error = 'Identifiants incorrects.';
        this.loading = false;
      },
    });
  }
}
