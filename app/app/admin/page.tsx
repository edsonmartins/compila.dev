'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
import { useTheme } from '@/components/providers/ThemeProvider';
import { getAdminStats, type AdminDashboardStats, type TopUser, type RecentActivity } from '@/lib/api/admin';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();

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
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Erro ao Carregar</h2>
          <p className="text-neutral-600 dark:text-dark-muted">{error || 'Dados não disponíveis'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-dark-background">
      {/* Header */}
      <header className="bg-white dark:bg-dark-card border-b border-neutral-200 dark:border-dark-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {/* Logo */}
              <Link href="/">
                <Image
                  src={
                    resolvedTheme === 'dark'
                      ? '/images/compila-dev_branco.png'
                      : '/images/compila-dev.png'
                  }
                  alt="Compila.dev"
                  width={180}
                  height={45}
                  className="h-10 w-auto"
                />
              </Link>

              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm">
                <Link href="/" className="text-neutral-600 dark:text-dark-muted hover:text-accent">
                  Home
                </Link>
                <span className="text-neutral-400">/</span>
                <span className="flex items-center gap-1 text-neutral-900 dark:text-dark-foreground font-medium">
                  <Shield className="h-4 w-4" />
                  Admin
                </span>
              </div>
            </div>

            {/* Admin badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 rounded-full">
              <Shield className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-accent">Administrador</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-dark-foreground">
            Dashboard Administrativo
          </h1>
          <p className="text-neutral-600 dark:text-dark-muted mt-2">
            Visão geral da plataforma Compila.dev
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
              <Button variant="outline" className="gap-2">
                <Code className="h-4 w-4" />
                Novo Desafio
              </Button>
              <Button variant="outline" className="gap-2">
                <Users className="h-4 w-4" />
                Gerenciar Usuários
              </Button>
              <Button variant="outline" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Moderar Feed
              </Button>
              <Button variant="outline" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Relatórios
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
