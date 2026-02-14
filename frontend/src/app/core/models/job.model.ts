export interface Company {
  id: number;
  name: string;
  sector?: string;
  description?: string;
}

export interface JobOfferApi {
  id: number;
  title: string;
  company?: number | null;
  company_detail?: Company | null;
  description?: string;
  salary?: number;
  location: string;
  created_at: string;
}

export interface JobOffer {
  id: number;
  title: string;
  company: Company | null;
  description?: string;
  salary?: number;
  location: string;
  created_at: string;
}

export function toJobOffer(api: JobOfferApi): JobOffer {
  return {
    ...api,
    company: api.company_detail ?? null,
  };
}
