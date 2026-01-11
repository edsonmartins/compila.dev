'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Clock, Trophy, Users, Star, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CodeEditor, { Language } from '@/components/app/editor/CodeEditor';
import { cn } from '@/lib/utils';
import { getChallengeBySlug, submitCode } from '@/lib/api';
import type { ChallengeResponse } from '@/lib/api';

interface LocalChallenge {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  stack: string;
  level: string;
  difficulty: number;
  technologies: string[];
  xpReward: number;
  estimatedTimeMinutes: number;
  completedCount: number;
  starterCode: Record<string, string>;
  requirements?: Record<string, unknown>;
  isLocked?: boolean;
  isCompleted?: boolean;
}

const LANGUAGE_MAP: Record<string, string> = {
  javascript: 'JAVASCRIPT',
  typescript: 'TYPESCRIPT',
  python: 'PYTHON',
  java: 'JAVA',
  go: 'GO',
  rust: 'RUST',
  php: 'PHP',
  cpp: 'CPLUSPLUS',
};

const REVERSE_LANGUAGE_MAP: Record<string, Language> = {
  JAVASCRIPT: 'javascript',
  TYPESCRIPT: 'typescript',
  PYTHON: 'python',
  JAVA: 'java',
  GO: 'go',
  RUST: 'rust',
  PHP: 'php',
  CPLUSPLUS: 'cpp',
  C_SHARP: 'cpp',
};

export default function ChallengeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [challenge, setChallenge] = useState<LocalChallenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'descricao' | 'codigo'>('codigo');

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const data = await getChallengeBySlug(slug);
        const localChallenge: LocalChallenge = {
          id: data.id,
          slug: data.slug,
          title: data.title,
          shortDescription: data.shortDescription,
          description: data.description,
          stack: data.stack,
          level: data.level,
          difficulty: data.difficulty,
          technologies: data.technologies,
          xpReward: data.xpReward,
          estimatedTimeMinutes: data.estimatedTimeMinutes,
          completedCount: data.completedCount,
          starterCode: data.starterCode || {},
          requirements: data.requirements as Record<string, unknown> | undefined,
          isLocked: data.isLocked,
          isCompleted: data.isCompleted,
        };
        setChallenge(localChallenge);
      } catch (error) {
        console.error('Failed to fetch challenge:', error);
        // Fallback to mock data for development
        const mockChallenge: LocalChallenge = {
          id: '1',
          slug: 'hello-world',
          title: 'Hello World',
          shortDescription: 'Seu primeiro desafio!',
          description: `# Hello World

Bem-vindo ao Compila.dev! Este é o seu primeiro desafio.

## Objetivo

Crie uma função que retorne a string "Hello World!".

## Exemplo

\`\`\`javascript
function helloWorld() {
  return "Hello World!";
}
\`\`\`

## Requisitos

- A função deve retornar exatamente "Hello World!"
- Não use console.log, use return`,
          stack: 'FRONTEND',
          level: 'BEGINNER',
          difficulty: 1,
          technologies: ['javascript'],
          xpReward: 10,
          estimatedTimeMinutes: 5,
          completedCount: 1234,
          starterCode: {
            javascript: `// Escreva seu código aqui
function helloWorld() {
  // Seu código aqui

}

// Teste sua função
console.log(helloWorld());`,
          },
          requirements: {
            functionName: 'helloWorld',
            expectedOutput: 'Hello World!',
          },
        };
        setChallenge(mockChallenge);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, [slug]);

  const handleSubmit = useCallback(async (code: string, language: Language) => {
    if (!challenge) {
      throw new Error('Challenge not loaded');
    }

    const apiLanguage = LANGUAGE_MAP[language] || 'JAVASCRIPT';
    const response = await submitCode({
      challengeId: challenge.id,
      code,
      language: apiLanguage as any,
    });

    return {
      status: response.status.toLowerCase() as any,
      score: response.score,
      xpGained: response.xpGained,
      testResults: Array.isArray(response.testResults)
        ? response.testResults.map((t: any) => ({
            passed: t.passed,
            name: t.name,
            error: t.error,
            output: t.output,
          }))
        : [],
      aiFeedback: response.aiFeedback?.message || response.aiFeedback?.suggestions?.join('\n'),
    };
  }, [challenge]);

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
      default:
        return 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Desafio não encontrado</h2>
          <Button onClick={() => router.push('/app/desafios')}>Voltar</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-dark-bg">
      {/* Header */}
      <header className="border-b border-neutral-200 dark:border-dark-border bg-white dark:bg-dark-card">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-neutral-100 dark:hover:bg-dark-border rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-neutral-600 dark:text-dark-muted" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-neutral-900 dark:text-dark-foreground">
                {challenge.title}
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className={cn(
                    'text-xs px-2 py-0.5 rounded-full font-medium',
                    getLevelColor(challenge.level)
                  )}
                >
                  {challenge.level}
                </span>
                <span
                  className={cn(
                    'text-xs px-2 py-0.5 rounded-full font-medium',
                    getStackColor(challenge.stack)
                  )}
                >
                  {challenge.stack}
                </span>
                <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-dark-muted">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'h-3 w-3',
                        i < challenge.difficulty
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-neutral-300 dark:text-dark-muted'
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-dark-muted">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span className="font-semibold text-accent">{challenge.xpReward} XP</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-neutral-600 dark:text-dark-muted">
              <Clock className="h-4 w-4" />
              <span>{challenge.estimatedTimeMinutes} min</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-neutral-600 dark:text-dark-muted">
              <Users className="h-4 w-4" />
              <span>{challenge.completedCount}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-t border-neutral-200 dark:border-dark-border">
          <button
            onClick={() => setActiveTab('descricao')}
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
              activeTab === 'descricao'
                ? 'border-accent text-accent'
                : 'border-transparent text-neutral-600 dark:text-dark-muted hover:text-neutral-900 dark:hover:text-dark-foreground'
            )}
          >
            Descrição
          </button>
          <button
            onClick={() => setActiveTab('codigo')}
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
              activeTab === 'codigo'
                ? 'border-accent text-accent'
                : 'border-transparent text-neutral-600 dark:text-dark-muted hover:text-neutral-900 dark:hover:text-dark-foreground'
            )}
          >
            Código
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Description Panel */}
        <div
          className={cn(
            'w-96 border-r border-neutral-200 dark:border-dark-border bg-neutral-50 dark:bg-dark-card/30 overflow-y-auto transition-all',
            activeTab === 'codigo' && 'hidden lg:block'
          )}
        >
          <div className="p-6 prose prose-sm dark:prose-invert max-w-none">
            <p className="text-neutral-600 dark:text-dark-muted mb-4">
              {challenge.shortDescription}
            </p>
            <div className="whitespace-pre-wrap text-neutral-700 dark:text-dark-foreground">
              {challenge.description}
            </div>

            {/* Technologies */}
            <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-dark-border">
              <h3 className="text-sm font-semibold mb-3">Tecnologias</h3>
              <div className="flex flex-wrap gap-2">
                {challenge.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-neutral-200 dark:bg-dark-border rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Code Editor */}
        <div className="flex-1">
          <CodeEditor
            initialCode={challenge.starterCode.javascript || ''}
            challengeId={challenge.id}
            availableLanguages={['javascript', 'typescript', 'python']}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
