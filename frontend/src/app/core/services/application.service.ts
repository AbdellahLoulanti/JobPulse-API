import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Application {
  id: number;
  job_offer: number;
  job_offer_title: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

export interface ApiListResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

@Injectable({ providedIn: 'root' })
export class ApplicationService {
  private readonly baseUrl = `${environment.apiUrl}/applications`;

  constructor(private http: HttpClient) {}

  getMyApplications(): Observable<ApiListResponse<Application>> {
    return this.http.get<ApiListResponse<Application>>(this.baseUrl);
  }

  apply(jobOfferId: number, message?: string): Observable<Application> {
    return this.http.post<Application>(this.baseUrl + '/', {
      job_offer: jobOfferId,
      message: message || '',
    });
  }
}
