import { fetchApi } from './client';

export interface LearningPath {
  id: string;
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  stack: string;
  level: string;
  estimatedWeeks: number;
  xpTotal: number;
  coverImageUrl: string;
  enrolledCount: number;
  completedCount: number;
  featured: boolean;
  authorName: string;
  authorAvatarUrl?: string;
  userProgress?: {
    status: 'not_started' | 'in_progress' | 'completed';
    currentStep: number;
    totalSteps: number;
    completionPercentage: number;
    xpGained: number;
  };
}

export async function getLearningPaths(): Promise<LearningPath[]> {
  return fetchApi<LearningPath[]>('/learning-paths');
}

export async function getFeaturedLearningPaths(): Promise<LearningPath[]> {
  return fetchApi<LearningPath[]>('/learning-paths/featured');
}

export async function getLearningPathsByStack(stack: string): Promise<LearningPath[]> {
  return fetchApi<LearningPath[]>(`/learning-paths/stack/${stack}`);
}

export async function getLearningPathBySlug(slug: string): Promise<LearningPath> {
  return fetchApi<LearningPath>(`/learning-paths/slug/${slug}`);
}
