'use client';

import React, { useEffect, useState } from 'react';
import {
  MapPin,
  DollarSign,
  Building2,
  Briefcase,
  Clock,
  ExternalLink,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type JobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'FREELANCE' | 'INTERNSHIP';
type JobLevel = 'JUNIOR' | 'MID' | 'SENIOR' | 'LEAD' | 'ARCHITECT';

interface Job {
  id: string;
  slug: string;
  companyName: string;
  companyLogoUrl?: string;
  companyWebsite?: string;
  title: string;
  description: string;
  requirements: string[];
  benefits: string[];
  type: JobType;
  level: JobLevel;
  remote: boolean;
  location?: string;
  technologies: string[];
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: string;
  applicationUrl?: string;
  contactEmail?: string;
  postedAt: string;
  featured: boolean;
  viewsCount: number;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState<JobType | 'all'>('all');
  const [activeLevel, setActiveLevel] = useState<JobLevel | 'all'>('all');
  const [remoteOnly, setRemoteOnly] = useState(false);

  useEffect(() => {
    // TODO: Fetch jobs from API
    const mockJobs: Job[] = [
      {
        id: '1',
        slug: 'frontend-developer-react',
        companyName: 'TechCorp Brasil',
        companyLogoUrl: 'https://logo.clearbit.com/techcorp.com',
        title: 'Desenvolvedor Frontend - React',
        description: 'Estamos buscando um desenvolvedor Frontend experiente para trabalhar com React, TypeScript e Tailwind CSS em projetos desafiadores.',
        requirements: [
          '3+ anos de experiência com React',
          'Experiência com TypeScript',
          'Conhecimento em Tailwind CSS',
          'Experiência com testes unitários',
        ],
        benefits: ['Saúde', 'Odonto', 'Home Office', 'Gympass'],
        type: 'FULL_TIME',
        level: 'MID',
        remote: true,
        location: 'São Paulo, SP (Híbrido)',
        technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Jest'],
        salaryMin: 8000,
        salaryMax: 12000,
        salaryCurrency: 'BRL',
        applicationUrl: 'https://techcorp.com/apply',
        postedAt: new Date(Date.now() - 2 * 24 * 3600000).toISOString(),
        featured: true,
        viewsCount: 1234,
      },
      {
        id: '2',
        slug: 'backend-developer-nodejs',
        companyName: 'InovaTech',
        companyLogoUrl: 'https://logo.clearbit.com/innovatech.com',
        title: 'Desenvolvedor Backend - Node.js',
        description: 'Procuramos um desenvolvedor Backend para construir APIs escaláveis e microserviços.',
        requirements: [
          '3+ anos com Node.js',
          'Experiência com PostgreSQL',
          'Conhecimento em Docker',
          'Noções de AWS',
        ],
        benefits: ['Saúde', 'VR', 'VT', 'Home Office'],
        type: 'FULL_TIME',
        level: 'SENIOR',
        remote: true,
        technologies: ['Node.js', 'PostgreSQL', 'Docker', 'AWS'],
        salaryMin: 10000,
        salaryMax: 15000,
        salaryCurrency: 'BRL',
        contactEmail: 'vagas@innovatech.com',
        postedAt: new Date(Date.now() - 5 * 24 * 3600000).toISOString(),
        featured: true,
        viewsCount: 892,
      },
      {
        id: '3',
        slug: 'fullstack-developer',
        companyName: 'StartupX',
        title: 'Desenvolvedor Full Stack',
        description: 'Junte-se ao nosso time de desenvolvimento e trabalhe em produtos inovadores.',
        requirements: [
          'Conhecimento em React',
          'Conhecimento em Node.js',
          'Experiência com MongoDB',
        ],
        benefits: ['Equipe jovem', 'Ambiente descontraído', 'Home Office'],
        type: 'FULL_TIME',
        level: 'JUNIOR',
        remote: false,
        location: 'Rio de Janeiro, RJ',
        technologies: ['React', 'Node.js', 'MongoDB'],
        salaryMin: 4000,
        salaryMax: 6000,
        salaryCurrency: 'BRL',
        applicationUrl: 'https://startupx.workable.com',
        postedAt: new Date(Date.now() - 7 * 24 * 3600000).toISOString(),
        featured: false,
        viewsCount: 567,
      },
      {
        id: '4',
        slug: 'devops-engineer',
        companyName: 'CloudSystems',
        title: 'Engenheiro DevOps',
        description: 'Procuramos um especialista em infraestrutura como código e CI/CD.',
        requirements: [
          'Experiência com Kubernetes',
          'Conhecimento em Terraform',
          'Experiência com CI/CD',
        ],
        benefits: ['Alta remuneração', 'Bônus', 'Home Office', 'Equipamentos'],
        type: 'FULL_TIME',
        level: 'SENIOR',
        remote: true,
        technologies: ['Kubernetes', 'Terraform', 'AWS', 'Docker'],
        salaryMin: 15000,
        salaryMax: 20000,
        salaryCurrency: 'BRL',
        contactEmail: 'careers@cloudsystems.com',
        postedAt: new Date(Date.now() - 1 * 24 * 3600000).toISOString(),
        featured: true,
        viewsCount: 445,
      },
    ];

    setTimeout(() => {
      setJobs(mockJobs);
      setLoading(false);
    }, 500);
  }, []);

  const filteredJobs = jobs.filter((job) => {
    if (activeType !== 'all' && job.type !== activeType) return false;
    if (activeLevel !== 'all' && job.level !== activeLevel) return false;
    if (remoteOnly && !job.remote) return false;
    return true;
  });

  const getJobTypeLabel = (type: JobType) => {
    switch (type) {
      case 'FULL_TIME':
        return 'CLT';
      case 'PART_TIME':
        return 'Part-time';
      case 'CONTRACT':
        return 'PJ';
      case 'FREELANCE':
        return 'Freelance';
      case 'INTERNSHIP':
        return 'Estágio';
    }
  };

  const getLevelLabel = (level: JobLevel) => {
    switch (level) {
      case 'JUNIOR':
        return 'Júnior';
      case 'MID':
        return 'Pleno';
      case 'SENIOR':
        return 'Sênior';
      case 'LEAD':
        return 'Tech Lead';
      case 'ARCHITECT':
        return 'Arquiteto';
    }
  };

  const getLevelColor = (level: JobLevel) => {
    switch (level) {
      case 'JUNIOR':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'MID':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'SENIOR':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'LEAD':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'ARCHITECT':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    }
  };

  const formatSalary = (min?: number, max?: number, currency = 'BRL') => {
    if (!min && !max) return 'A combinar';
    const symbol = currency === 'BRL' ? 'R$' : '$';
    if (min && max) {
      return `${symbol} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    }
    if (min) return `${symbol} ${min.toLocaleString()}+`;
    return `Até ${symbol} ${max?.toLocaleString()}`;
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / 86400000);
    if (diffInDays === 0) return 'Hoje';
    if (diffInDays === 1) return 'Ontem';
    if (diffInDays < 7) return `${diffInDays} dias atrás`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} semanas atrás`;
    return `${Math.floor(diffInDays / 30)} meses atrás`;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-primary dark:text-dark-foreground mb-2">
            Marketplace de Vagas
          </h1>
          <p className="text-neutral-dark dark:text-dark-muted">
            Encontre a oportunidade perfeita para evoluir sua carreira
          </p>
        </div>
        <Button className="bg-accent hover:bg-accent/90 text-white">
          <Briefcase className="h-4 w-4 mr-2" />
          Anunciar Vaga
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-dark-card rounded-xl border border-neutral-light dark:border-dark-border p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-neutral-500" />
            <span className="text-sm font-medium">Filtros:</span>
          </div>

          <select
            value={activeType}
            onChange={(e) => setActiveType(e.target.value as JobType | 'all')}
            className="px-3 py-1.5 bg-white dark:bg-dark-background border border-neutral-light dark:border-dark-border rounded-lg text-sm"
          >
            <option value="all">Todos os tipos</option>
            <option value="FULL_TIME">CLT</option>
            <option value="CONTRACT">PJ</option>
            <option value="FREELANCE">Freelance</option>
            <option value="PART_TIME">Part-time</option>
            <option value="INTERNSHIP">Estágio</option>
          </select>

          <select
            value={activeLevel}
            onChange={(e) => setActiveLevel(e.target.value as JobLevel | 'all')}
            className="px-3 py-1.5 bg-white dark:bg-dark-background border border-neutral-light dark:border-dark-border rounded-lg text-sm"
          >
            <option value="all">Todos os níveis</option>
            <option value="JUNIOR">Júnior</option>
            <option value="MID">Pleno</option>
            <option value="SENIOR">Sênior</option>
            <option value="LEAD">Tech Lead</option>
            <option value="ARCHITECT">Arquiteto</option>
          </select>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={remoteOnly}
              onChange={(e) => setRemoteOnly(e.target.checked)}
              className="rounded border-neutral-300 dark:border-dark-border"
            />
            <span className="text-sm">Apenas Remoto</span>
          </label>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
        </div>
      ) : (
        <>
          <p className="text-sm text-neutral-dark dark:text-dark-muted mb-4">
            {filteredJobs.length} vaga{filteredJobs.length !== 1 ? 's' : ''} encontrada
            {filteredJobs.length !== 1 ? 's' : ''}
          </p>

          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <Link
                key={job.id}
                href={`/app/vagas/${job.slug}`}
                className="block group"
              >
                <div className="bg-white dark:bg-dark-card rounded-xl border border-neutral-light dark:border-dark-border p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    {/* Company Logo */}
                    <div className="flex-shrink-0">
                      {job.companyLogoUrl ? (
                        <img
                          src={job.companyLogoUrl}
                          alt={job.companyName}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-accent" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {job.featured && (
                          <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                            Destaque
                          </Badge>
                        )}
                        <span className={cn('text-xs px-2 py-1 rounded-full font-medium', getLevelColor(job.level))}>
                          {getLevelLabel(job.level)}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-neutral-100 text-neutral-700 dark:bg-dark-border dark:text-dark-foreground">
                          {getJobTypeLabel(job.type)}
                        </span>
                        {job.remote && (
                          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            Remoto
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-semibold text-primary dark:text-dark-foreground group-hover:text-accent transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-neutral-dark dark:text-dark-muted">
                        {job.companyName}
                      </p>

                      <p className="text-sm text-primary dark:text-dark-foreground mb-3 line-clamp-2">
                        {job.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-dark dark:text-dark-muted">
                        {job.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatTimeAgo(job.postedAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <ExternalLink className="h-4 w-4" />
                          {job.viewsCount} visualizações
                        </span>
                      </div>

                      {/* Technologies */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {job.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-1 bg-neutral-100 dark:bg-dark-border rounded text-xs"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
