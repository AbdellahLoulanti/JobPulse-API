import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CandidateProfile {
  id?: number;
  full_name: string;
  phone: string;
  cv?: File | string | null;
  cv_url?: string | null;
  cover_letter: string;
  skills: string;
  experience: string;
  created_at?: string;
  updated_at?: string;
}

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly baseUrl = `${environment.apiUrl}/profiles`;

  constructor(private http: HttpClient) {}

  getMyProfile(): Observable<CandidateProfile> {
    return this.http.get<CandidateProfile>(`${this.baseUrl}/me/`);
  }

  updateProfile(data: Partial<CandidateProfile>, cvFile?: File): Observable<CandidateProfile> {
    if (cvFile) {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value != null && key !== 'cv' && key !== 'cv_url') {
          formData.append(key, String(value));
        }
      });
      formData.append('cv', cvFile);
      return this.http.put<CandidateProfile>(`${this.baseUrl}/me/`, formData);
    }
    return this.http.put<CandidateProfile>(`${this.baseUrl}/me/`, data);
  }

  patchProfile(data: Partial<CandidateProfile>, cvFile?: File): Observable<CandidateProfile> {
    if (cvFile) {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value != null && key !== 'cv' && key !== 'cv_url') {
          formData.append(key, String(value));
        }
      });
      formData.append('cv', cvFile);
      return this.http.patch<CandidateProfile>(`${this.baseUrl}/me/`, formData);
    }
    return this.http.patch<CandidateProfile>(`${this.baseUrl}/me/`, data);
  }
}
