'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  MapPin,
  Link as LinkIcon,
  Github,
  Linkedin,
  Trophy,
  Zap,
  Flame,
  Calendar,
  Eye,
  Heart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  bio: string;
  avatarUrl: string;
  location: string;
  websiteUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  level: number;
  xp: number;
  streakCurrent: number;
  streakBest: number;
  joinedAt: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  coverImageUrl: string;
  projectUrl: string;
  repositoryUrl: string;
  technologies: string[];
  viewsCount: number;
  likesCount: number;
  featured: boolean;
  createdAt: string;
}

interface Achievement {
  id: string;
  type: string;
  earnedAt: string;
}

export default function UserProfilePage() {
  const params = useParams();
  const username = params.username as string;

  const [user, setUser] = useState<UserProfile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch user data from API
    const mockUser: UserProfile = {
      id: '1',
      username: username,
      fullName: 'João Silva',
      bio: 'Desenvolvedor Full Stack apaixonado por React e Node.js. Sempre aprendendo e compartilhando conhecimento.',
      avatarUrl: 'https://i.pravatar.cc/150?img=11',
      location: 'São Paulo, Brasil',
      websiteUrl: 'https://joaosilva.dev',
      githubUrl: 'https://github.com/joaosilva',
      linkedinUrl: 'https://linkedin.com/in/joaosilva',
      level: 12,
      xp: 12450,
      streakCurrent: 7,
      streakBest: 30,
      joinedAt: '2024-01-15',
    };

    const mockProjects: Project[] = [
      {
        id: '1',
        title: 'E-commerce Platform',
        description: 'Plataforma de e-commerce completa com carrinho, pagamentos e dashboard administrativo.',
        coverImageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
        projectUrl: 'https://demo.com',
        repositoryUrl: 'https://github.com/joaosilva/ecommerce',
        technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
        viewsCount: 1234,
        likesCount: 45,
        featured: true,
        createdAt: '2024-06-15',
      },
      {
        id: '2',
        title: 'Task Management App',
        description: 'Aplicativo de gerenciamento de tarefas com drag-and-drop e colaboração em tempo real.',
        coverImageUrl: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800',
        projectUrl: 'https://tasks.app',
        repositoryUrl: 'https://github.com/joaosilva/tasks',
        technologies: ['Next.js', 'TypeScript', 'Prisma', 'WebSocket'],
        viewsCount: 892,
        likesCount: 32,
        featured: true,
        createdAt: '2024-07-20',
      },
      {
        id: '3',
        title: 'Weather Dashboard',
        description: 'Dashboard interativo de previsão do tempo com mapas e gráficos.',
        coverImageUrl: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800',
        projectUrl: 'https://weather.app',
        repositoryUrl: 'https://github.com/joaosilva/weather',
        technologies: ['Vue.js', 'D3.js', 'OpenWeather API'],
        viewsCount: 567,
        likesCount: 21,
        featured: false,
        createdAt: '2024-08-10',
      },
    ];

    setTimeout(() => {
      setUser(mockUser);
      setProjects(mockProjects);
      setLoading(false);
    }, 500);
  }, [username]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Perfil não encontrado</h2>
          <p className="text-neutral-600 dark:text-dark-muted">
            O usuário @{username} não existe.
          </p>
        </div>
      </div>
    );
  }

  const xpToNextLevel = (user.level + 1) * 1000 - user.xp;
  const currentLevelXp = user.xp - user.level * 1000;
  const levelProgress = (currentLevelXp / 1000) * 100;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-dark-background">
      {/* Header Banner */}
      <div className="h-48 bg-gradient-to-r from-primary to-accent" />

      <div className="container mx-auto px-4 -mt-20">
        {/* Profile Card */}
        <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <Avatar className="h-40 w-40 border-4 border-white dark:border-dark-card">
                <AvatarImage src={user.avatarUrl} alt={user.username} />
                <AvatarFallback className="text-3xl bg-accent text-white">
                  {user.fullName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-neutral-900 dark:text-dark-foreground">
                    {user.fullName}
                  </h1>
                  <p className="text-neutral-600 dark:text-dark-muted">@{user.username}</p>

                  <p className="mt-4 text-neutral-700 dark:text-dark-foreground max-w-2xl">
                    {user.bio}
                  </p>

                  {/* Location & Links */}
                  <div className="flex flex-wrap items-center gap-4 mt-4">
                    {user.location && (
                      <div className="flex items-center gap-1 text-sm text-neutral-600 dark:text-dark-muted">
                        <MapPin className="h-4 w-4" />
                        <span>{user.location}</span>
                      </div>
                    )}
                    {user.websiteUrl && (
                      <a
                        href={user.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-accent hover:underline"
                      >
                        <LinkIcon className="h-4 w-4" />
                        <span>Website</span>
                      </a>
                    )}
                    {user.githubUrl && (
                      <a
                        href={user.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-neutral-600 dark:text-dark-muted hover:text-accent"
                      >
                        <Github className="h-4 w-4" />
                        <span>GitHub</span>
                      </a>
                    )}
                    {user.linkedinUrl && (
                      <a
                        href={user.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-neutral-600 dark:text-dark-muted hover:text-accent"
                      >
                        <Linkedin className="h-4 w-4" />
                        <span>LinkedIn</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex gap-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      <span className="text-2xl font-bold text-neutral-900 dark:text-dark-foreground">
                        {user.level}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-dark-muted">Nível</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Zap className="h-5 w-5 text-accent" />
                      <span className="text-2xl font-bold text-neutral-900 dark:text-dark-foreground">
                        {user.xp.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-dark-muted">XP Total</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Flame className="h-5 w-5 text-orange-500" />
                      <span className="text-2xl font-bold text-neutral-900 dark:text-dark-foreground">
                        {user.streakCurrent}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-dark-muted">Streak</p>
                  </div>
                </div>
              </div>

              {/* Level Progress */}
              <div className="mt-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-neutral-600 dark:text-dark-muted">
                    Nível {user.level}
                  </span>
                  <span className="text-neutral-600 dark:text-dark-muted">
                    Nível {user.level + 1}
                  </span>
                </div>
                <div className="h-3 bg-neutral-200 dark:bg-dark-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-accent to-primary rounded-full transition-all duration-500"
                    style={{ width: `${levelProgress}%` }}
                  />
                </div>
                <p className="text-sm text-neutral-600 dark:text-dark-muted mt-1">
                  {xpToNextLevel} XP para o próximo nível
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-dark-foreground">
              Projetos
            </h2>
            <Button variant="outline" size="sm">
              Ver Todos
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white dark:bg-dark-card rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Cover Image */}
                <div className="h-48 bg-neutral-200 dark:bg-dark-border">
                  <img
                    src={project.coverImageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg text-neutral-900 dark:text-dark-foreground">
                      {project.title}
                    </h3>
                    {project.featured && (
                      <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs rounded-full">
                        Destaque
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-neutral-600 dark:text-dark-muted mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-neutral-100 dark:bg-dark-border rounded text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Stats & Links */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-dark-muted">
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {project.viewsCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {project.likesCount}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {project.projectUrl && (
                        <a
                          href={project.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-accent hover:underline"
                        >
                          Demo
                        </a>
                      )}
                      {project.repositoryUrl && (
                        <a
                          href={project.repositoryUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-accent hover:underline"
                        >
                          Código
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
