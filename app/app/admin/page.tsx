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
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalChallenges: number;
  totalSubmissions: number;
  successRate: number;
  avgCompletionTime: number;
}

interface RecentActivity {
  id: string;
  type: 'user_registered' | 'challenge_completed' | 'submission' | 'post';
  user: {
    username: string;
    fullName: string;
    avatarUrl: string;
  };
  description: string;
  createdAt: string;
}

interface TopUser {
  id: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  xp: number;
  level: number;
  challengesCompleted: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch data from admin API
    const mockStats: DashboardStats = {
      totalUsers: 12453,
      activeUsers: 3892,
      totalChallenges: 156,
      totalSubmissions: 45678,
      successRate: 73.5,
      avgCompletionTime: 25,
    };

    const mockActivities: RecentActivity[] = [
      {
        id: '1',
        type: 'challenge_completed',
        user: {
          username: 'maria_dev',
          fullName: 'Maria Santos',
          avatarUrl: 'https://i.pravatar.cc/150?img=5',
        },
        description: 'Completou o desafio "FizzBuzz Clássico"',
        createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
      },
      {
        id: '2',
        type: 'user_registered',
        user: {
          username: 'novo_usuario',
          fullName: 'João Pedro',
          avatarUrl: 'https://i.pravatar.cc/150?img=15',
        },
        description: 'Criou uma conta na plataforma',
        createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
      },
      {
        id: '3',
        type: 'submission',
        user: {
          username: 'pedro_code',
          fullName: 'Pedro Costa',
          avatarUrl: 'https://i.pravatar.cc/150?img=12',
        },
        description: 'Submeteu uma solução para "Lista de Tarefas"',
        createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
      },
      {
        id: '4',
        type: 'post',
        user: {
          username: 'ana_js',
          fullName: 'Ana Silva',
          avatarUrl: 'https://i.pravatar.cc/150?img=9',
        },
        description: 'Publicou no feed sobre React Hooks',
        createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
      },
    ];

    const mockTopUsers: TopUser[] = [
      {
        id: '1',
        username: 'felipe_master',
        fullName: 'Felipe Souza',
        avatarUrl: 'https://i.pravatar.cc/150?img=3',
        xp: 45670,
        level: 45,
        challengesCompleted: 123,
      },
      {
        id: '2',
        username: 'julia_code',
        fullName: 'Júnia Rocha',
        avatarUrl: 'https://i.pravatar.cc/150?img=23',
        xp: 38920,
        level: 38,
        challengesCompleted: 98,
      },
      {
        id: '3',
        username: 'carlos_dev',
        fullName: 'Carlos Mendes',
        avatarUrl: 'https://i.pravatar.cc/150?img=32',
        xp: 34500,
        level: 34,
        challengesCompleted: 87,
      },
      {
        id: '4',
        username: 'bruno_full',
        fullName: 'Bruno Almeida',
        avatarUrl: 'https://i.pravatar.cc/150?img=51',
        xp: 28900,
        level: 28,
        challengesCompleted: 72,
      },
      {
        id: '5',
        username: 'lucia_js',
        fullName: 'Lúcia Ferreira',
        avatarUrl: 'https://i.pravatar.cc/150?img=44',
        xp: 23450,
        level: 23,
        challengesCompleted: 56,
      },
    ];

    setTimeout(() => {
      setStats(mockStats);
      setRecentActivities(mockActivities);
      setTopUsers(mockTopUsers);
      setLoading(false);
    }, 500);
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

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-dark-bg">
      {/* Header */}
      <header className="bg-white dark:bg-dark-card border-b border-neutral-200 dark:border-dark-border">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-dark-foreground">
            Dashboard Administrativo
          </h1>
          <p className="text-neutral-600 dark:text-dark-muted mt-1">
            Visão geral da plataforma Compila.dev
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
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
                {stats?.totalUsers.toLocaleString()}
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
                {stats?.activeUsers.toLocaleString()}
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
                {stats?.totalChallenges}
              </div>
              <p className="text-xs text-neutral-600 dark:text-dark-muted mt-1">
                {Math.round((stats?.totalChallenges || 0) * 0.8)} publicados
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
                {stats?.totalSubmissions.toLocaleString()}
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
                {stats?.successRate}%
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
                {stats?.avgCompletionTime}m
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
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-dark-border transition-colors"
                  >
                    <div className="flex-shrink-0 p-2 bg-neutral-100 dark:bg-dark-border rounded-full">
                      {getActivityIcon(activity.type)}
                    </div>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={activity.user.avatarUrl} alt={activity.user.username} />
                      <AvatarFallback>
                        {activity.user.fullName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 dark:text-dark-foreground">
                        {activity.user.fullName}
                      </p>
                      <p className="text-sm text-neutral-600 dark:text-dark-muted truncate">
                        {activity.description}
                      </p>
                    </div>
                    <span className="text-xs text-neutral-500 dark:text-dark-muted whitespace-nowrap">
                      {formatTimeAgo(activity.createdAt)}
                    </span>
                  </div>
                ))}
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
                {topUsers.map((user, index) => (
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
