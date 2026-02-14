import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <div class="layout">
      <app-header />
      <main class="main">
        <router-outlet />
      </main>
      <app-footer />
    </div>
  `,
  styles: [
    `
      .layout {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }

      .main {
        flex: 1;
        padding: 2rem 0;
      }
    `,
  ],
})
export class MainLayoutComponent {}
