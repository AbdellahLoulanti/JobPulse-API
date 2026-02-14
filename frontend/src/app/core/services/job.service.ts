import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { JobOffer, JobOfferApi, toJobOffer } from '../models/job.model';

export interface ApiListResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface JobFilters {
  search?: string;
  location?: string;
  company?: string;
  salary_min?: number;
  salary_max?: number;
  ordering?: string;
  page?: number;
}

@Injectable({ providedIn: 'root' })
export class JobService {
  private readonly baseUrl = `${environment.apiUrl}/jobs`;

  constructor(private http: HttpClient) {}

  getJobs(filters?: JobFilters): Observable<ApiListResponse<JobOffer>> {
    let params = new HttpParams();
    if (filters) {
      if (filters.search) params = params.set('search', filters.search);
      if (filters.location) params = params.set('location', filters.location);
      if (filters.company) params = params.set('company', filters.company);
      if (filters.salary_min != null) params = params.set('salary_min', filters.salary_min);
      if (filters.salary_max != null) params = params.set('salary_max', filters.salary_max);
      if (filters.ordering) params = params.set('ordering', filters.ordering);
      if (filters.page != null && filters.page > 0) params = params.set('page', filters.page);
    }
    return this.http
      .get<ApiListResponse<JobOfferApi>>(this.baseUrl, { params })
      .pipe(
        map((res) => ({ ...res, results: res.results.map(toJobOffer) }))
      );
  }

  getJob(id: number): Observable<JobOffer> {
    return this.http
      .get<JobOfferApi>(`${this.baseUrl}/${id}/`)
      .pipe(map(toJobOffer));
  }

  getTrendingJobs(): Observable<JobOffer[]> {
    return this.http
      .get<JobOfferApi[]>(`${this.baseUrl}/trending/`)
      .pipe(map((jobs) => jobs.map(toJobOffer)));
  }
}
