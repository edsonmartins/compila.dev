import { fetchApi } from './client';

export interface PortfolioProject {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  shortDescription: string | null;
  projectUrl: string | null;
  repositoryUrl: string | null;
  demoUrl: string | null;
  coverImageUrl: string | null;
  technologies: string[];
  tags: string[];
  featured: boolean;
  publicProject: boolean;
  viewsCount: number;
  likesCount: number;
  createdAt: string;
  updatedAt: string;
}

export async function getPublicPortfolio(username: string): Promise<PortfolioProject[]> {
  return fetchApi<PortfolioProject[]>(`/portfolio/${encodeURIComponent(username)}`);
}
