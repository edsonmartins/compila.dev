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
import { getJobs, type JobResponse } from '@/lib/api/jobs';

type JobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'FREELANCE' | 'INTERNSHIP';
type JobLevel = 'JUNIOR' | 'MID' | 'SENIOR' | 'LEAD' | 'ARCHITECT';

interface Job extends JobResponse {
  type: JobType;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<JobType | 'all'>('all');
  const [activeLevel, setActiveLevel] = useState<JobLevel | 'all'>('all');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setErrorMessage(null);
      try {
        const response = await getJobs({
          page: 0,
          size: 50,
          type: activeType !== 'all' ? activeType : undefined,
          level: activeLevel !== 'all' ? activeLevel : undefined,
          remote: remoteOnly ? true : undefined,
        });

        const mapped = response.content.map((job) => ({
          ...job,
          type: job.jobType as JobType,
        }));

        setJobs(mapped);
        setTotalElements(response.totalElements);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
        setJobs([]);
        setTotalElements(0);
        setErrorMessage('Nao foi possivel carregar as vagas. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [activeType, activeLevel, remoteOnly]);

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
            {jobs.length} vaga{jobs.length !== 1 ? 's' : ''} encontrada
            {jobs.length !== 1 ? 's' : ''}
            {totalElements > jobs.length ? ` de ${totalElements}` : ''}
          </p>
          {errorMessage && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-200">
              {errorMessage}
            </div>
          )}

          <div className="space-y-4">
            {jobs.map((job) => (
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
