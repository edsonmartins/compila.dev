'use client';

import React, { useEffect, useState } from 'react';
import { Play, Clock, Users, Trophy, BookOpen, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface LearningPath {
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
  author?: {
    username: string;
    fullName: string;
    avatarUrl: string;
  };
  userProgress?: {
    status: 'not_started' | 'in_progress' | 'completed';
    currentStep: number;
    totalSteps: number;
    completionPercentage: number;
    xpGained: number;
  };
}

export default function LearningPathsPage() {
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'frontend' | 'backend' | 'mobile' | 'devops'>('all');

  useEffect(() => {
    // TODO: Fetch learning paths from API
    const mockPaths: LearningPath[] = [
      {
        id: '1',
        slug: 'frontend-iniciante',
        title: 'Frontend do Zero',
        description: 'Aprenda HTML, CSS e JavaScript do absoluto zero. Esta trilha é perfeita para quem está começando na programação web.',
        shortDescription: 'Inicie sua jornada como desenvolvedor frontend.',
        stack: 'FRONTEND',
        level: 'BEGINNER',
        estimatedWeeks: 8,
        xpTotal: 500,
        coverImageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
        enrolledCount: 1234,
        completedCount: 456,
        featured: true,
        author: {
          username: 'felipe_dev',
          fullName: 'Felipe Souza',
          avatarUrl: 'https://i.pravatar.cc/150?img=3',
        },
      },
      {
        id: '2',
        slug: 'javascript-avancado',
        title: 'JavaScript Avançado',
        description: 'Domine conceitos avançados de JavaScript como closures, promises, async/await, e muito mais.',
        shortDescription: 'Closures, promises, async/await e muito mais.',
        stack: 'FRONTEND',
        level: 'SENIOR',
        estimatedWeeks: 6,
        xpTotal: 800,
        coverImageUrl: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800',
        enrolledCount: 892,
        completedCount: 123,
        featured: true,
        author: {
          username: 'maria_js',
          fullName: 'Maria Silva',
          avatarUrl: 'https://i.pravatar.cc/150?img=5',
        },
        userProgress: {
          status: 'in_progress',
          currentStep: 3,
          totalSteps: 10,
          completionPercentage: 30,
          xpGained: 240,
        },
      },
      {
        id: '3',
        slug: 'react-completo',
        title: 'React Completo',
        description: 'Torne-se um especialista em React. Hooks, Context API, performance testing e muito mais.',
        shortDescription: 'Hooks, context, performance testing e mais.',
        stack: 'FRONTEND',
        level: 'MID',
        estimatedWeeks: 10,
        xpTotal: 1200,
        coverImageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
        enrolledCount: 2341,
        completedCount: 567,
        featured: true,
        author: {
          username: 'pedro_react',
          fullName: 'Pedro Santos',
          avatarUrl: 'https://i.pravatar.cc/150?img=12',
        },
      },
      {
        id: '4',
        slug: 'nodejs-api-rest',
        title: 'Node.js - APIs REST',
        description: 'Aprenda a construir APIs REST robustas com Node.js, Express e MongoDB.',
        shortDescription: 'Construa APIs REST escaláveis com Node.js.',
        stack: 'BACKEND',
        level: 'JUNIOR',
        estimatedWeeks: 6,
        xpTotal: 700,
        coverImageUrl: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800',
        enrolledCount: 1567,
        completedCount: 234,
        featured: false,
      },
      {
        id: '5',
        slug: 'python-data-science',
        title: 'Python para Data Science',
        description: 'Aprenda Python e suas bibliotecas essenciais para Data Science: Pandas, NumPy, Matplotlib.',
        shortDescription: 'Análise de dados com Python.',
        stack: 'DATA',
        level: 'BEGINNER',
        estimatedWeeks: 12,
        xpTotal: 1500,
        coverImageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
        enrolledCount: 987,
        completedCount: 89,
        featured: false,
      },
      {
        id: '6',
        slug: 'docker-k8s',
        title: 'Docker e Kubernetes',
        description: 'Domine a conteinerização e orquestração com Docker e Kubernetes.',
        shortDescription: 'Conteinerização e orquestração de containers.',
        stack: 'DEVOPS',
        level: 'SENIOR',
        estimatedWeeks: 8,
        xpTotal: 1000,
        coverImageUrl: 'https://images.unsplash.com/photo-1667372393119-c3a613edfe1c?w=800',
        enrolledCount: 654,
        completedCount: 45,
        featured: false,
      },
    ];

    setTimeout(() => {
      setPaths(mockPaths);
      setLoading(false);
    }, 500);
  }, []);

  const filteredPaths = activeFilter === 'all'
    ? paths
    : paths.filter((p) => p.stack.toLowerCase() === activeFilter);

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'junior':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'mid':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'senior':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'expert':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400';
    }
  };

  const getStackColor = (stack: string) => {
    switch (stack.toLowerCase()) {
      case 'frontend':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'backend':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'mobile':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'devops':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'data':
        return 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400';
      default:
        return 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400';
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary dark:text-dark-foreground mb-2">
          Trilhas de Aprendizado
        </h1>
        <p className="text-neutral-dark dark:text-dark-muted">
          Siga caminhos estruturados para dominar novas tecnologias
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
        <button
          onClick={() => setActiveFilter('all')}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
            activeFilter === 'all'
              ? 'bg-accent text-white'
              : 'bg-white dark:bg-dark-card text-neutral-dark dark:text-dark-foreground border border-neutral-light dark:border-dark-border hover:bg-neutral-light dark:hover:bg-dark-border/50'
          )}
        >
          Todas
        </button>
        <button
          onClick={() => setActiveFilter('frontend')}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
            activeFilter === 'frontend'
              ? 'bg-accent text-white'
              : 'bg-white dark:bg-dark-card text-neutral-dark dark:text-dark-foreground border border-neutral-light dark:border-dark-border hover:bg-neutral-light dark:hover:bg-dark-border/50'
          )}
        >
          Frontend
        </button>
        <button
          onClick={() => setActiveFilter('backend')}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
            activeFilter === 'backend'
              ? 'bg-accent text-white'
              : 'bg-white dark:bg-dark-card text-neutral-dark dark:text-dark-foreground border border-neutral-light dark:border-dark-border hover:bg-neutral-light dark:hover:bg-dark-border/50'
          )}
        >
          Backend
        </button>
        <button
          onClick={() => setActiveFilter('mobile')}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
            activeFilter === 'mobile'
              ? 'bg-accent text-white'
              : 'bg-white dark:bg-dark-card text-neutral-dark dark:text-dark-foreground border border-neutral-light dark:border-dark-border hover:bg-neutral-light dark:hover:bg-dark-border/50'
          )}
        >
          Mobile
        </button>
        <button
          onClick={() => setActiveFilter('devops')}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
            activeFilter === 'devops'
              ? 'bg-accent text-white'
              : 'bg-white dark:bg-dark-card text-neutral-dark dark:text-dark-foreground border border-neutral-light dark:border-dark-border hover:bg-neutral-light dark:hover:bg-dark-border/50'
          )}
        >
          DevOps
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPaths.map((path) => (
            <Link
              key={path.id}
              href={`/app/trilhas/${path.slug}`}
              className="group"
            >
              <div className="bg-white dark:bg-dark-card rounded-xl border border-neutral-light dark:border-dark-border overflow-hidden hover:shadow-lg transition-shadow">
                {/* Cover Image */}
                <div className="h-40 bg-neutral-light dark:bg-dark-border relative overflow-hidden">
                  <img
                    src={path.coverImageUrl}
                    alt={path.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {path.featured && (
                    <div className="absolute top-3 right-3 px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
                      Destaque
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Tags */}
                  <div className="flex gap-2 mb-3">
                    <span
                      className={cn(
                        'text-xs px-2 py-1 rounded-full font-medium',
                        getLevelColor(path.level)
                      )}
                    >
                      {path.level}
                    </span>
                    <span
                      className={cn(
                        'text-xs px-2 py-1 rounded-full font-medium',
                        getStackColor(path.stack)
                      )}
                    >
                      {path.stack}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-bold text-lg text-primary dark:text-dark-foreground mb-2">
                    {path.title}
                  </h3>
                  <p className="text-sm text-neutral-dark dark:text-dark-muted mb-4 line-clamp-2">
                    {path.shortDescription}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-neutral-dark dark:text-dark-muted mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{path.estimatedWeeks} semanas</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      <span>{path.xpTotal} XP</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{path.enrolledCount}</span>
                    </div>
                  </div>

                  {/* Progress */}
                  {path.userProgress && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-neutral-dark dark:text-dark-muted">
                          Seu progresso
                        </span>
                        <span className="font-medium text-accent">
                          {path.userProgress.completionPercentage}%
                        </span>
                      </div>
                      <div className="h-2 bg-neutral-200 dark:bg-dark-border rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent rounded-full"
                          style={{ width: `${path.userProgress.completionPercentage}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Author */}
                  {path.author && (
                    <div className="flex items-center gap-2 pt-3 border-t border-neutral-light dark:border-dark-border">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={path.author.avatarUrl} alt={path.author.username} />
                        <AvatarFallback className="text-xs bg-accent text-white">
                          {path.author.fullName
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-neutral-dark dark:text-dark-muted">
                        por {path.author.fullName}
                      </span>
                    </div>
                  )}

                  {/* CTA */}
                  <Button
                    className={cn(
                      'w-full mt-4',
                      path.userProgress?.status === 'in_progress'
                        ? 'bg-accent hover:bg-accent/90 text-white'
                        : 'bg-primary hover:bg-primary/90 text-white'
                    )}
                  >
                    {path.userProgress?.status === 'completed' ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Completado
                      </>
                    ) : path.userProgress?.status === 'in_progress' ? (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Continuar
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Iniciar Trilha
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
