import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent) },
      { path: 'jobs', loadComponent: () => import('./pages/jobs/jobs.component').then((m) => m.JobsComponent) },
      {
        path: 'jobs/:id',
        loadComponent: () =>
          import('./pages/jobs/job-detail/job-detail.component').then((m) => m.JobDetailComponent),
      },
      {
        path: 'companies',
        loadComponent: () =>
          import('./pages/companies/companies.component').then((m) => m.CompaniesComponent),
      },
      {
        path: 'post-job',
        loadComponent: () =>
          import('./pages/recruiter/post-job/post-job.component').then((m) => m.PostJobComponent),
      },
      {
        path: 'companies/:id',
        loadComponent: () =>
          import('./pages/companies/company-detail/company-detail.component').then(
            (m) => m.CompanyDetailComponent
          ),
      },
      {
        path: 'login',
        loadComponent: () => import('./pages/auth/login/login.component').then((m) => m.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () => import('./pages/auth/register/register.component').then((m) => m.RegisterComponent),
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.component').then((m) => m.ProfileComponent),
      },
      {
        path: 'applications',
        loadComponent: () =>
          import('./pages/applications/applications.component').then((m) => m.ApplicationsComponent),
      },
    ],
  },
];
