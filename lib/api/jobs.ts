import { fetchApi } from './client';

export interface JobResponse {
  id: string;
  slug: string;
  companyName: string;
  companyLogoUrl?: string;
  companyWebsite?: string;
  title: string;
  description: string;
  requirements: string[];
  benefits: string[];
  jobType: string;
  level: string;
  remote: boolean;
  location?: string;
  technologies: string[];
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: string;
  applicationUrl?: string;
  contactEmail?: string;
  active: boolean;
  featured: boolean;
  viewsCount: number;
  applicationsCount: number;
  postedAt: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobListResponse {
  content: JobResponse[];
  totalElements: number;
}

export interface JobListParams {
  page?: number;
  size?: number;
  type?: string;
  level?: string;
  remote?: boolean;
  featured?: boolean;
  search?: string;
}

export async function getJobs(params: JobListParams): Promise<JobListResponse> {
  const query = new URLSearchParams();

  if (params.page !== undefined) query.set('page', String(params.page));
  if (params.size !== undefined) query.set('size', String(params.size));
  if (params.type) query.set('type', params.type);
  if (params.level) query.set('level', params.level);
  if (params.remote !== undefined) query.set('remote', String(params.remote));
  if (params.featured !== undefined) query.set('featured', String(params.featured));
  if (params.search) query.set('search', params.search);

  const queryString = query.toString();
  const url = queryString ? `/jobs?${queryString}` : '/jobs';

  return fetchApi<JobListResponse>(url);
}
