import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="header">
      <div class="header__container">
        <a routerLink="/" class="header__logo">
          <span class="logo-icon">⚡</span>
          <span class="logo-text">JobPulse</span>
        </a>

        <button
          class="header__toggle"
          [attr.aria-expanded]="menuOpen"
          [attr.aria-label]="menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'"
          (click)="toggleMenu()"
        >
          <span class="hamburger" [class.hamburger--open]="menuOpen"></span>
        </button>

        <nav class="header__nav" [class.header__nav--open]="menuOpen">
          <!-- Public -->
          <div class="nav-group">
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" class="nav-link">Accueil</a>
            <a routerLink="/jobs" routerLinkActive="active" class="nav-link">Offres</a>
            <a routerLink="/companies" routerLinkActive="active" class="nav-link">Entreprises</a>
          </div>

          @if (auth.isLoggedIn()) {
            <!-- Candidat -->
            @if (auth.isCandidate()) {
              <div class="nav-group nav-group--sep">
                <a routerLink="/profile" routerLinkActive="active" class="nav-link">Mon profil</a>
                <a routerLink="/applications" routerLinkActive="active" class="nav-link">Mes candidatures</a>
              </div>
            }
            <!-- Recruteur -->
            @if (auth.isRecruiter()) {
              <div class="nav-group nav-group--sep">
                <a routerLink="/post-job" routerLinkActive="active" class="nav-link nav-link--accent">Publier une offre</a>
              </div>
            }
            <button class="nav-btn nav-btn--logout" (click)="logout()">Déconnexion</button>
          } @else {
            <div class="nav-group nav-group--sep">
              <a routerLink="/login" class="nav-link">Connexion</a>
              <a routerLink="/register" class="nav-btn nav-btn--primary">Inscription</a>
            </div>
          }
        </nav>
      </div>
    </header>
  `,
  styles: [
    `
      .header {
        position: sticky;
        top: 0;
        z-index: 100;
        background: var(--color-bg-header);
        backdrop-filter: blur(12px);
        border-bottom: 1px solid var(--color-border);
        box-shadow: var(--shadow-sm);
      }

      .header__container {
        max-width: var(--container-max);
        margin: 0 auto;
        padding: 0.875rem 1.5rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1.5rem;
      }

      .header__logo {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        text-decoration: none;
        font-weight: 700;
        font-size: 1.35rem;
        color: var(--color-text);
      }

      .logo-icon { font-size: 1.5rem; }
      .logo-text {
        background: var(--gradient-accent);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .header__toggle {
        display: none;
        width: 44px;
        height: 44px;
        align-items: center;
        justify-content: center;
        background: none;
        border: none;
        cursor: pointer;
      }

      .hamburger {
        position: relative;
        width: 22px;
        height: 2px;
        background: var(--color-text);
        transition: background 0.3s;
      }
      .hamburger::before, .hamburger::after {
        content: '';
        position: absolute;
        left: 0;
        width: 22px;
        height: 2px;
        background: var(--color-text);
        transition: transform 0.3s, top 0.3s;
      }
      .hamburger::before { top: -7px; }
      .hamburger::after { top: 7px; }
      .hamburger--open { background: transparent; }
      .hamburger--open::before { top: 0; transform: rotate(45deg); }
      .hamburger--open::after { top: 0; transform: rotate(-45deg); }

      .header__nav {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        flex-wrap: wrap;
      }

      .nav-group {
        display: flex;
        align-items: center;
        gap: 0.25rem;
      }

      .nav-group--sep {
        margin-left: 0.5rem;
        padding-left: 0.75rem;
        border-left: 1px solid var(--color-border);
      }

      .nav-link {
        padding: 0.5rem 0.875rem;
        text-decoration: none;
        color: var(--color-text-muted);
        font-weight: 500;
        font-size: 0.9375rem;
        border-radius: var(--radius-md);
        transition: color 0.2s, background 0.2s;
      }

      .nav-link:hover {
        color: var(--color-text);
        background: var(--color-bg-hover);
      }

      .nav-link.active {
        color: var(--color-primary);
        background: var(--color-primary-light);
      }

      .nav-link--accent {
        color: var(--color-primary);
        font-weight: 600;
      }

      .nav-link--accent:hover {
        background: var(--color-primary-light);
      }

      .nav-btn {
        padding: 0.5rem 1rem;
        font-family: inherit;
        font-weight: 500;
        font-size: 0.9375rem;
        border-radius: var(--radius-md);
        cursor: pointer;
        border: none;
        text-decoration: none;
        transition: opacity 0.2s;
      }

      .nav-btn--primary {
        background: var(--gradient-accent);
        color: white;
      }

      .nav-btn--primary:hover {
        opacity: 0.92;
      }

      .nav-btn--logout {
        background: transparent;
        color: var(--color-text-muted);
      }

      .nav-btn--logout:hover {
        color: var(--color-text);
        background: var(--color-bg-hover);
      }

      @media (max-width: 900px) {
        .nav-group--sep { margin-left: 0; padding-left: 0; border-left: none; }
      }

      @media (max-width: 768px) {
        .header__toggle { display: flex; }
        .header__nav {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          flex-direction: column;
          align-items: stretch;
          padding: 1rem;
          background: var(--color-bg-header);
          border-bottom: 1px solid var(--color-border);
          gap: 0.5rem;
          transform: translateY(-100%);
          opacity: 0;
          visibility: hidden;
          transition: transform 0.25s, opacity 0.25s, visibility 0.25s;
          box-shadow: var(--shadow-md);
        }
        .header__nav--open {
          transform: translateY(0);
          opacity: 1;
          visibility: visible;
        }
        .nav-group {
          flex-direction: column;
          gap: 0.25rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid var(--color-border);
        }
        .nav-group:last-of-type { border-bottom: none; padding-bottom: 0; }
        .nav-group--sep { padding-top: 0.5rem; }
        .nav-link, .nav-btn {
          width: 100%;
          padding: 0.75rem 1rem;
          text-align: center;
          display: block;
        }
      }
    `,
  ],
})
export class HeaderComponent implements OnInit {
  menuOpen = false;

  constructor(public auth: AuthService) {}

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.auth.fetchMe().subscribe();
    }
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  logout(): void {
    this.auth.logout();
    this.menuOpen = false;
  }
}
