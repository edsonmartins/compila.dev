import { fetchApi } from './client';

export interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  bio: string | null;
  avatarUrl: string | null;
  location: string | null;
  websiteUrl: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  level: number;
  xp: number;
  streakCurrent: number;
  streakBest: number;
  joinedAt: string;
  completedChallenges: number;
  attemptedChallenges: number;
}

export async function getUserProfile(username: string): Promise<UserProfile> {
  return fetchApi<UserProfile>(`/users/profile/${encodeURIComponent(username)}`);
}

export async function getUserProfileById(id: string): Promise<UserProfile> {
  return fetchApi<UserProfile>(`/users/id/${id}`);
}
