/**
 * Challenges API
 */

import { fetchApi } from './client';

export interface Challenge {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  stack: string;
  level: string;
  difficulty: number;
  technologies: string[];
  xpReward: number;
  estimatedTimeMinutes: number;
  completedCount: number;
  featured: boolean;
}

export interface ChallengeDetail extends Challenge {
  requirements?: Record<string, unknown>;
  starterCode: Record<string, string>;
  tags?: string[];
  badges?: string[];
  successRate?: number;
  attemptedCount?: number;
  isLocked?: boolean;
  isCompleted?: boolean;
}

// Alias for ChallengeDetail to match import in page
export type ChallengeResponse = ChallengeDetail;

export interface ChallengesParams {
  page?: number;
  size?: number;
  stack?: string;
  level?: string;
  technology?: string;
  search?: string;
}

export interface ChallengesResponse {
  content: Challenge[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export async function getChallenges(params?: ChallengesParams): Promise<ChallengesResponse> {
  const queryParams = new URLSearchParams();
  if (params?.page !== undefined) queryParams.set('page', params.page.toString());
  if (params?.size !== undefined) queryParams.set('size', params.size.toString());
  if (params?.stack) queryParams.set('stack', params.stack);
  if (params?.level) queryParams.set('level', params.level);
  if (params?.technology) queryParams.set('technology', params.technology);
  if (params?.search) queryParams.set('q', params.search);

  const query = queryParams.toString();
  return fetchApi<ChallengesResponse>(`/challenges${query ? `?${query}` : ''}`);
}

export async function getFeaturedChallenges(): Promise<Challenge[]> {
  return fetchApi<Challenge[]>('/challenges/featured');
}

export async function getChallengeBySlug(slug: string): Promise<ChallengeDetail> {
  return fetchApi<ChallengeDetail>(`/challenges/${slug}`);
}
