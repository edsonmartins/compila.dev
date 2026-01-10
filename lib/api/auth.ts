/**
 * Authentication API
 */

import { fetchApi, setToken, removeToken } from './client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  fullName: string;
  bio?: string;
  avatarUrl?: string;
  level: number;
  xp: number;
  streakCurrent: number;
  streakBest: number;
  subscriptionPlan: string;
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await fetchApi<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  setToken(response.accessToken);
  return response;
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await fetchApi<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  setToken(response.accessToken);
  return response;
}

export async function getCurrentUser(): Promise<UserResponse> {
  return fetchApi<UserResponse>('/auth/me');
}

export async function logout(): Promise<void> {
  removeToken();
  // Optional: Call backend to invalidate token
  // await fetchApi('/auth/logout', { method: 'POST' });
}

export async function refreshToken(refreshToken: string): Promise<AuthResponse> {
  const response = await fetchApi<AuthResponse>('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });

  setToken(response.accessToken);
  return response;
}

/**
 * Refresh user data from the API
 * Useful after updating profile or completing challenges
 */
export async function refreshUser(): Promise<UserResponse> {
  return fetchApi<UserResponse>('/auth/me');
}
