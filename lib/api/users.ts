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

export interface AutoShareResponse {
  autoShare: boolean;
}

export interface UpdateProfileRequest {
  fullName: string;
  bio: string;
  avatarUrl: string;
  location: string;
  websiteUrl: string;
  githubUrl: string;
  linkedinUrl: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export async function getUserProfile(username: string): Promise<UserProfile> {
  return fetchApi<UserProfile>(`/users/profile/${encodeURIComponent(username)}`);
}

export async function getUserProfileById(id: string): Promise<UserProfile> {
  return fetchApi<UserProfile>(`/users/id/${id}`);
}

export async function updateProfile(payload: UpdateProfileRequest): Promise<UserProfile> {
  return fetchApi<UserProfile>('/users/me', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function changePassword(payload: ChangePasswordRequest): Promise<void> {
  await fetchApi<void>('/users/me/password', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

/**
 * Get auto-share setting
 */
export async function getAutoShareSetting(): Promise<AutoShareResponse> {
  return fetchApi<AutoShareResponse>('/users/settings/auto-share');
}

/**
 * Update auto-share setting
 */
export async function updateAutoShareSetting(autoShare: boolean): Promise<AutoShareResponse> {
  return fetchApi<AutoShareResponse>('/users/settings/auto-share', {
    method: 'PUT',
    body: JSON.stringify({ autoShare }),
  });
}
