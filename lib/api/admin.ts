import { fetchApi } from './client';

export interface AdminDashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalChallenges: number;
  totalSubmissions: number;
  successRate: number;
  avgCompletionTimeMinutes: number;
  topUsers: TopUser[];
  recentActivities: RecentActivity[];
}

export interface TopUser {
  id: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  xp: number;
  level: number;
  challengesCompleted: number;
}

export interface RecentActivity {
  id: string;
  type: string;
  username: string;
  fullName: string;
  description: string;
  createdAt: string;
}

export async function getAdminStats(): Promise<AdminDashboardStats> {
  return fetchApi<AdminDashboardStats>('/admin/stats');
}
