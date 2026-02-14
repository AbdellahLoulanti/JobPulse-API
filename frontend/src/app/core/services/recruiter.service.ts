import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { JobOffer } from '../models/job.model';

export interface Company {
  id: number;
  name: string;
  sector?: string;
  description?: string;
}

@Injectable({ providedIn: 'root' })
export class RecruiterService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createCompany(data: { name: string; sector?: string; description?: string }): Observable<Company> {
    return this.http.post<Company>(`${this.apiUrl}/companies/`, data);
  }

  createJob(data: {
    title: string;
    company: number;
    description?: string;
    salary?: number;
    location?: string;
  }): Observable<JobOffer> {
    return this.http.post<JobOffer>(`${this.apiUrl}/jobs/`, data);
  }
}
