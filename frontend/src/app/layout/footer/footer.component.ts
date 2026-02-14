import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="footer__container">
        <div class="footer__brand">
          <a routerLink="/" class="footer__logo">
            <span class="logo-icon">⚡</span>
            JobPulse
          </a>
          <p class="footer__tagline">Trouvez votre opportunité idéale</p>
        </div>
        <div class="footer__links">
          <a routerLink="/jobs" class="footer__link">Offres d'emploi</a>
          <a routerLink="/companies" class="footer__link">Entreprises</a>
        </div>
        <div class="footer__copy">
          &copy; {{ year }} JobPulse. Tous droits réservés.
        </div>
      </div>
    </footer>
  `,
  styles: [
    `
      .footer {
        margin-top: auto;
        background: var(--color-bg-footer);
        border-top: 1px solid var(--color-border);
        padding: 2.5rem 0;
      }

      .footer__container {
        max-width: var(--container-max);
        margin: 0 auto;
        padding: 0 1.5rem;
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 2rem;
        align-items: start;
      }

      .footer__logo {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        text-decoration: none;
        font-weight: 700;
        font-size: 1.1rem;
        color: var(--color-text);
        margin-bottom: 0.5rem;
      }

      .footer__tagline {
        margin: 0;
        color: var(--color-text-muted);
        font-size: 0.9rem;
      }

      .footer__links {
        display: flex;
        gap: 1.5rem;
      }

      .footer__link {
        color: var(--color-text-muted);
        text-decoration: none;
        font-size: 0.9rem;
        transition: color 0.2s;
      }

      .footer__link:hover {
        color: var(--color-primary);
      }

      .footer__copy {
        grid-column: 1 / -1;
        padding-top: 1.5rem;
        border-top: 1px solid var(--color-border);
        color: var(--color-text-muted);
        font-size: 0.85rem;
      }

      @media (max-width: 600px) {
        .footer__container {
          grid-template-columns: 1fr;
          text-align: center;
        }

        .footer__links {
          justify-content: center;
        }
      }
    `,
  ],
})
export class FooterComponent {
  year = new Date().getFullYear();
}
