import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';

export type UserRole = 'candidate' | 'recruiter' | 'both';

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface MeResponse {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  is_candidate: boolean;
  is_recruiter: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  private accessToken = signal<string | null>(this.getStoredToken());
  private refreshToken = signal<string | null>(this.getStoredRefreshToken());
  private userRole = signal<UserRole>(this.getStoredRole());

  isLoggedIn = computed(() => !!this.accessToken());
  isCandidate = computed(() => {
    const r = this.userRole();
    return r === 'candidate' || r === 'both';
  });
  isRecruiter = computed(() => {
    const r = this.userRole();
    return r === 'recruiter' || r === 'both';
  });

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  private getStoredToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private getStoredRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  private getStoredRole(): UserRole {
    return (localStorage.getItem('user_role') as UserRole) || 'candidate';
  }

  getAccessToken(): string | null {
    return this.accessToken();
  }

  login(username: string, password: string): Observable<MeResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login/`, { username, password })
      .pipe(
        tap((res) => {
          localStorage.setItem('access_token', res.access);
          localStorage.setItem('refresh_token', res.refresh);
          this.accessToken.set(res.access);
          this.refreshToken.set(res.refresh);
        }),
        switchMap(() => this.fetchMe())
      );
  }

  fetchMe(): Observable<MeResponse> {
    return this.http.get<MeResponse>(`${this.apiUrl}/me/`).pipe(
      tap((me) => {
        localStorage.setItem('user_role', me.role);
        this.userRole.set(me.role);
      })
    );
  }

  register(
    username: string,
    password: string,
    role: UserRole,
    email?: string
  ): Observable<{ id: number; username: string; role: UserRole }> {
    return this.http.post<{ id: number; username: string; role: UserRole }>(
      `${this.apiUrl}/register/`,
      { username, password, email: email || '', role }
    );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
    this.accessToken.set(null);
    this.refreshToken.set(null);
    this.userRole.set('candidate');
    this.router.navigate(['/']);
  }

  refresh(): Observable<{ access: string }> {
    const refresh = this.refreshToken();
    if (!refresh) throw new Error('No refresh token');
    return this.http.post<LoginResponse>(`${this.apiUrl}/refresh/`, { refresh }).pipe(
      tap((res) => {
        localStorage.setItem('access_token', res.access);
        this.accessToken.set(res.access);
      })
    );
  }
}
