'use client';

import React, { useEffect, useState } from 'react';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Code,
  Trophy,
  Filter,
  MoreHorizontal,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { AdminLayout } from '@/components/app/admin/AdminLayout';
import { fetchApi } from '@/lib/api/client';

interface AdminChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'BEGINNER' | 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
  stack: string;
  xpReward: number;
  published: boolean;
  createdAt: string;
  completionCount?: number;
  successRate?: number;
}

export default function AdminChallengesPage() {
  const [challenges, setChallenges] = useState<AdminChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const response = await fetchApi<{ content: AdminChallenge[] }>('/admin/challenges');
      setChallenges(response.content || []);
    } catch (error) {
      console.error('Failed to fetch challenges:', error);
      // Mock data for now
      setChallenges([
        {
          id: '1',
          title: 'Todo List com Hooks',
          description: 'Crie uma lista de tarefas usando React Hooks',
          difficulty: 'BEGINNER',
          stack: 'React',
          xpReward: 100,
          published: true,
          createdAt: '2024-01-15T10:30:00',
          completionCount: 245,
          successRate: 85,
        },
        {
          id: '2',
          title: 'Dashboard Analytics',
          description: 'Construa um dashboard com gráficos interativos',
          difficulty: 'MEDIUM',
          stack: 'React',
          xpReward: 250,
          published: true,
          createdAt: '2024-02-10T14:00:00',
          completionCount: 128,
          successRate: 72,
        },
        {
          id: '3',
          title: 'API RESTful com Node.js',
          description: 'Implemente uma API REST completa',
          difficulty: 'HARD',
          stack: 'Node.js',
          xpReward: 400,
          published: true,
          createdAt: '2024-03-05T09:00:00',
          completionCount: 56,
          successRate: 58,
        },
        {
          id: '4',
          title: 'Sistema de Autenticação',
          description: 'JWT com refresh tokens e OAuth2',
          difficulty: 'EXPERT',
          stack: 'Node.js',
          xpReward: 500,
          published: false,
          createdAt: '2024-05-20T16:30:00',
          completionCount: 0,
          successRate: 0,
        },
        {
          id: '5',
          title: 'Componentes com Styled Components',
          description: 'Refatorar CSS para styled-components',
          difficulty: 'EASY',
          stack: 'React',
          xpReward: 150,
          published: true,
          createdAt: '2024-06-01T10:00:00',
          completionCount: 89,
          successRate: 91,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (challengeId: string, published: boolean) => {
    try {
      await fetchApi(`/admin/challenges/${challengeId}/publish`, {
        method: 'PUT',
        body: JSON.stringify({ published: !published }),
      });
      setChallenges((prev) =>
        prev.map((c) => (c.id === challengeId ? { ...c, published: !published } : c))
      );
    } catch (error) {
      console.error('Failed to toggle challenge publish:', error);
    }
  };

  const handleDeleteChallenge = async (challengeId: string) => {
    if (!confirm('Tem certeza que deseja excluir este desafio?')) return;
    try {
      await fetchApi(`/admin/challenges/${challengeId}`, { method: 'DELETE' });
      setChallenges((prev) => prev.filter((c) => c.id !== challengeId));
    } catch (error) {
      console.error('Failed to delete challenge:', error);
    }
  };

  const filteredChallenges = challenges.filter((challenge) => {
    const matchesSearch =
      search === '' ||
      challenge.title.toLowerCase().includes(search.toLowerCase()) ||
      challenge.description.toLowerCase().includes(search.toLowerCase()) ||
      challenge.stack.toLowerCase().includes(search.toLowerCase());

    const matchesDifficulty =
      difficultyFilter === 'ALL' || challenge.difficulty === difficultyFilter;
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'PUBLISHED' && challenge.published) ||
      (statusFilter === 'DRAFT' && !challenge.published);

    return matchesSearch && matchesDifficulty && matchesStatus;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'EASY':
        return 'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'HARD':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'EXPERT':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER':
        return 'Iniciante';
      case 'EASY':
        return 'Fácil';
      case 'MEDIUM':
        return 'Médio';
      case 'HARD':
        return 'Difícil';
      case 'EXPERT':
        return 'Expert';
      default:
        return difficulty;
    }
  };

  const getStackColor = (stack: string) => {
    const colors: Record<string, string> = {
      React: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
      'Node.js': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      Python: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      Java: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      TypeScript: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      JavaScript: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    };
    return colors[stack] || 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400';
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

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-dark-foreground">
            Gerenciar Desafios
          </h2>
          <p className="text-neutral-600 dark:text-dark-muted mt-1">
            {challenges.length} desafios cadastrados
          </p>
        </div>
        <Button className="gap-2 bg-accent hover:bg-accent/90">
          <Plus className="h-4 w-4" />
          Novo Desafio
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                placeholder="Buscar por título, descrição ou stack..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Difficulty Filter */}
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Dificuldade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todas</SelectItem>
                <SelectItem value="BEGINNER">Iniciante</SelectItem>
                <SelectItem value="EASY">Fácil</SelectItem>
                <SelectItem value="MEDIUM">Médio</SelectItem>
                <SelectItem value="HARD">Difícil</SelectItem>
                <SelectItem value="EXPERT">Expert</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos</SelectItem>
                <SelectItem value="PUBLISHED">Publicados</SelectItem>
                <SelectItem value="DRAFT">Rascunhos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Challenges Grid */}
      {filteredChallenges.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Code className="h-12 w-12 mx-auto text-neutral-300 dark:text-dark-muted mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-foreground mb-2">
              Nenhum desafio encontrado
            </h3>
            <p className="text-neutral-600 dark:text-dark-muted mb-6">
              {search || difficultyFilter !== 'ALL' || statusFilter !== 'ALL'
                ? 'Tente ajustar os filtros de busca.'
                : 'Comece criando seu primeiro desafio.'}
            </p>
            <Button className="gap-2 bg-accent hover:bg-accent/90">
              <Plus className="h-4 w-4" />
              Criar Desafio
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredChallenges.map((challenge) => (
            <Card
              key={challenge.id}
              className={cn(
                'hover:shadow-md transition-shadow',
                !challenge.published && 'opacity-75'
              )}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={cn(
                          'text-xs px-2 py-0.5 rounded-full font-medium',
                          getDifficultyColor(challenge.difficulty)
                        )}
                      >
                        {getDifficultyLabel(challenge.difficulty)}
                      </span>
                      <span
                        className={cn(
                          'text-xs px-2 py-0.5 rounded-full font-medium',
                          getStackColor(challenge.stack)
                        )}
                      >
                        {challenge.stack}
                      </span>
                    </div>
                    <CardTitle className="text-base truncate">{challenge.title}</CardTitle>
                  </div>
                  {!challenge.published ? (
                    <EyeOff className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                  ) : (
                    <Eye className="h-4 w-4 text-green-500 flex-shrink-0" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-neutral-600 dark:text-dark-muted line-clamp-2">
                  {challenge.description}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-neutral-600 dark:text-dark-muted">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium text-accent">{challenge.xpReward} XP</span>
                  </div>
                  {challenge.completionCount !== undefined && challenge.published && (
                    <div className="flex items-center gap-1 text-neutral-600 dark:text-dark-muted">
                      <Sparkles className="h-4 w-4" />
                      <span>{challenge.completionCount}</span>
                    </div>
                  )}
                  {challenge.successRate !== undefined && challenge.published && (
                    <div className="flex items-center gap-1 text-neutral-600 dark:text-dark-muted">
                      <span className="text-xs">
                        {challenge.successRate}% sucesso
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-neutral-200 dark:border-dark-border">
                  <Button variant="outline" size="sm" className="flex-1 gap-1">
                    <Edit className="h-3 w-3" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTogglePublish(challenge.id, challenge.published)}
                    className={cn(
                      'gap-1',
                      challenge.published
                        ? 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50'
                        : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                    )}
                  >
                    {challenge.published ? (
                      <>
                        <EyeOff className="h-3 w-3" />
                        Arquivar
                      </>
                    ) : (
                      <>
                        <Eye className="h-3 w-3" />
                        Publicar
                      </>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDeleteChallenge(challenge.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
