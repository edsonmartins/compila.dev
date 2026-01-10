/**
 * Gamification API
 */

import { fetchApi } from './client';

export interface Badge {
  id: string;
  userId: string;
  badgeType: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
}

export interface UserStats {
  id: string;
  username: string;
  fullName: string;
  avatarUrl?: string;
  level: number;
  xp: number;
  streakCurrent: number;
  streakBest: number;
  badgeCount: number;
  levelProgress: number;
}

export async function getUserStats(userId: string): Promise<UserStats> {
  return fetchApi<UserStats>(`/gamification/stats/${userId}`);
}

export async function getUserBadges(userId: string): Promise<Badge[]> {
  return fetchApi<Badge[]>(`/gamification/badges/${userId}`);
}

export interface RankingUser {
  id: string;
  username: string;
  fullName: string;
  avatarUrl?: string;
  level: number;
  xp: number;
  rank: number;
}

export async function getRanking(limit = 100): Promise<RankingUser[]> {
  return fetchApi<RankingUser[]>(`/gamification/ranking?limit=${limit}`);
}
