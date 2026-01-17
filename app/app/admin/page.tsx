'use client';

import React, { useEffect, useState } from 'react';
import {
  Users,
  Trophy,
  Code,
  MessageSquare,
  TrendingUp,
  BarChart3,
  Activity,
  Clock,
  Shield,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { getAdminStats, type AdminDashboardStats, type RecentActivity } from '@/lib/api/admin';
import { AdminLayout } from '@/components/app/admin/AdminLayout';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAdminStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch admin stats:', err);
        setError('Falha ao carregar dados do dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMins = Math.floor((now.getTime() - date.getTime()) / 60000);
    if (diffInMins < 1) return 'agora';
    if (diffInMins < 60) return `${diffInMins}m atrás`;
    const diffInHours = Math.floor(diffInMins / 60);
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    return `${Math.floor(diffInHours / 24)}d atrás`;
  };

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'user_registered':
        return <Users className="h-5 w-5 text-green-500" />;
      case 'challenge_completed':
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 'submission':
        return <Code className="h-5 w-5 text-blue-500" />;
      case 'post':
        return <MessageSquare className="h-5 w-5 text-purple-500" />;
      default:
        return <Activity className="h-5 w-5 text-neutral-500" />;
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
        </div>
      </AdminLayout>
    );
  }

  if (error || !stats) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Erro ao Carregar</h2>
            <p className="text-neutral-600 dark:text-dark-muted">{error || 'Dados não disponíveis'}</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Page Title */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-dark-foreground">
          Dashboard Administrativo
        </h2>
        <p className="text-neutral-600 dark:text-dark-muted mt-1">
          Visão geral da plataforma Compila.dev
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* Total Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-600 dark:text-dark-muted">
              Total de Usuários
            </CardTitle>
            <Users className="h-4 w-4 text-neutral-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-neutral-900 dark:text-dark-foreground">
              {stats.totalUsers.toLocaleString()}
            </div>
            <p className="text-xs text-neutral-600 dark:text-dark-muted mt-1">
              <span className="text-green-500">+12%</span> vs mês passado
            </p>
          </CardContent>
        </Card>

        {/* Active Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-600 dark:text-dark-muted">
              Usuários Ativos
            </CardTitle>
            <Activity className="h-4 w-4 text-neutral-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-neutral-900 dark:text-dark-foreground">
              {stats.activeUsers.toLocaleString()}
            </div>
            <p className="text-xs text-neutral-600 dark:text-dark-muted mt-1">
              Últimos 30 dias
            </p>
          </CardContent>
        </Card>

        {/* Total Challenges */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-600 dark:text-dark-muted">
              Desafios
            </CardTitle>
            <Code className="h-4 w-4 text-neutral-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-neutral-900 dark:text-dark-foreground">
              {stats.totalChallenges}
            </div>
            <p className="text-xs text-neutral-600 dark:text-dark-muted mt-1">
              {Math.round(stats.totalChallenges * 0.8)} publicados
            </p>
          </CardContent>
        </Card>

        {/* Total Submissions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-600 dark:text-dark-muted">
              Submissões
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-neutral-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-neutral-900 dark:text-dark-foreground">
              {stats.totalSubmissions.toLocaleString()}
            </div>
            <p className="text-xs text-neutral-600 dark:text-dark-muted mt-1">
              <span className="text-green-500">+8%</span> vs mês passado
            </p>
          </CardContent>
        </Card>

        {/* Success Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-600 dark:text-dark-muted">
              Taxa de Sucesso
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-neutral-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-neutral-900 dark:text-dark-foreground">
              {stats.successRate}%
            </div>
            <p className="text-xs text-neutral-600 dark:text-dark-muted mt-1">
              Média geral
            </p>
          </CardContent>
        </Card>

        {/* Avg Completion Time */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-600 dark:text-dark-muted">
              Tempo Médio
            </CardTitle>
            <Clock className="h-4 w-4 text-neutral-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-neutral-900 dark:text-dark-foreground">
              {stats.avgCompletionTimeMinutes}m
            </div>
            <p className="text-xs text-neutral-600 dark:text-dark-muted mt-1">
              Por submissão
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivities.length > 0 ? (
                stats.recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-dark-border transition-colors"
                  >
                    <div className="flex-shrink-0 p-2 bg-neutral-100 dark:bg-dark-border rounded-full">
                      {getActivityIcon(activity.type as any)}
                    </div>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={activity.username} alt={activity.username} />
                      <AvatarFallback>
                        {activity.fullName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 dark:text-dark-foreground">
                        {activity.fullName}
                      </p>
                      <p className="text-sm text-neutral-600 dark:text-dark-muted truncate">
                        {activity.description}
                      </p>
                    </div>
                    <span className="text-xs text-neutral-500 dark:text-dark-muted whitespace-nowrap">
                      {formatTimeAgo(activity.createdAt)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-neutral-600 dark:text-dark-muted text-center py-4">
                  Nenhuma atividade recente
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Users */}
        <Card>
          <CardHeader>
            <CardTitle>Top Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topUsers.map((user, index) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-dark-border transition-colors"
                >
                  <div className="flex-shrink-0 w-6 text-center">
                    <span
                      className={cn(
                        'text-sm font-bold',
                        index === 0 && 'text-yellow-500',
                        index === 1 && 'text-neutral-400',
                        index === 2 && 'text-orange-400',
                        index > 2 && 'text-neutral-500'
                      )}
                    >
                      #{index + 1}
                    </span>
                  </div>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatarUrl} alt={user.username} />
                    <AvatarFallback className="text-xs bg-accent text-white">
                      {user.fullName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 dark:text-dark-foreground truncate">
                      {user.fullName}
                    </p>
                    <p className="text-xs text-neutral-600 dark:text-dark-muted">
                      Nível {user.level} • {user.challengesCompleted} desafios
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-accent">{user.xp.toLocaleString()}</p>
                    <p className="text-xs text-neutral-500 dark:text-dark-muted">XP</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Link href="/app/admin/challenges">
              <Button variant="outline" className="gap-2">
                <Code className="h-4 w-4" />
                Novo Desafio
              </Button>
            </Link>
            <Link href="/app/admin/users">
              <Button variant="outline" className="gap-2">
                <Users className="h-4 w-4" />
                Gerenciar Usuários
              </Button>
            </Link>
            <Link href="/app/admin/moderation">
              <Button variant="outline" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Moderar Feed
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
