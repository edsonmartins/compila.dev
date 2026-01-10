'use client';

import React, { useState } from 'react';
import { Play, RotateCcw, Settings, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import MonacoEditor from './MonacoEditor';
import { Button } from '@/components/ui/button';

export type Language = 'javascript' | 'typescript' | 'python' | 'java' | 'go' | 'rust' | 'php' | 'cpp';

interface LanguageOption {
  id: Language;
  name: string;
  monacoLanguage: string;
}

const LANGUAGES: LanguageOption[] = [
  { id: 'javascript', name: 'JavaScript', monacoLanguage: 'javascript' },
  { id: 'typescript', name: 'TypeScript', monacoLanguage: 'typescript' },
  { id: 'python', name: 'Python', monacoLanguage: 'python' },
  { id: 'java', name: 'Java', monacoLanguage: 'java' },
  { id: 'go', name: 'Go', monacoLanguage: 'go' },
  { id: 'rust', name: 'Rust', monacoLanguage: 'rust' },
  { id: 'php', name: 'PHP', monacoLanguage: 'php' },
  { id: 'cpp', name: 'C++', monacoLanguage: 'cpp' },
];

interface TestResult {
  passed: boolean;
  name: string;
  error?: string;
  output?: string;
}

interface SubmissionResult {
  status: 'pending' | 'passed' | 'failed' | 'partial' | 'error';
  score?: number;
  xpGained?: number;
  testResults: TestResult[];
  aiFeedback?: string;
}

interface CodeEditorProps {
  initialCode?: string;
  challengeId: string;
  availableLanguages?: Language[];
  onSubmit?: (code: string, language: Language) => Promise<SubmissionResult>;
  readOnly?: boolean;
}

export function CodeEditor({
  initialCode = '',
  challengeId,
  availableLanguages = ['javascript', 'typescript', 'python'],
  onSubmit,
  readOnly = false,
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [language, setLanguage] = useState<Language>(availableLanguages[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<SubmissionResult | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const currentLanguageConfig = LANGUAGES.find((l) => l.id === language) || LANGUAGES[0];

  const handleRunCode = async () => {
    if (!onSubmit || readOnly) return;

    setIsRunning(true);
    setResult(null);

    try {
      const submissionResult = await onSubmit(code, language);
      setResult(submissionResult);
    } catch (error) {
      setResult({
        status: 'error',
        testResults: [{ passed: false, name: 'Erro', error: 'Erro ao executar código' }],
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleResetCode = () => {
    setCode(initialCode);
    setResult(null);
  };

  const getStatusIcon = () => {
    if (isRunning) {
      return <Loader2 className="h-5 w-5 animate-spin text-accent" />;
    }

    switch (result?.status) {
      case 'passed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'partial':
        return <CheckCircle2 className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    if (isRunning) return 'Executando...';
    if (!result) return '';

    switch (result.status) {
      case 'passed':
        return `Passou em todos os testes! +${result.xpGained || 0} XP`;
      case 'failed':
        return 'Alguns testes falharam';
      case 'partial':
        return `Parcialmente correto! +${result.xpGained || 0} XP`;
      case 'error':
        return 'Erro na execução';
      default:
        return '';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-neutral-100 dark:bg-dark-card border-b border-neutral-200 dark:border-dark-border">
        <div className="flex items-center gap-3">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="px-3 py-1.5 bg-white dark:bg-dark-bg border border-neutral-300 dark:border-dark-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            disabled={readOnly}
          >
            {availableLanguages.map((lang) => {
              const config = LANGUAGES.find((l) => l.id === lang);
              return (
                <option key={lang} value={lang}>
                  {config?.name}
                </option>
              );
            })}
          </select>
        </div>

        <div className="flex items-center gap-2">
          {result && (
            <div
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium',
                result.status === 'passed' && 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
                result.status === 'failed' && 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
                result.status === 'partial' && 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
                result.status === 'error' && 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
              )}
            >
              {getStatusIcon()}
              <span>{getStatusText()}</span>
            </div>
          )}

          {!readOnly && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetCode}
                disabled={isRunning}
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Resetar
              </Button>
              <Button
                size="sm"
                onClick={handleRunCode}
                disabled={isRunning}
                className="bg-accent hover:bg-accent/90 text-white"
              >
                <Play className="h-4 w-4 mr-1" />
                {isRunning ? 'Executando...' : 'Executar'}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1">
        <MonacoEditor
          value={code}
          onChange={setCode}
          language={currentLanguageConfig.monacoLanguage}
          height="100%"
          readOnly={readOnly}
        />
      </div>

      {/* Results Panel */}
      {result && result.testResults.length > 0 && (
        <div className="border-t border-neutral-200 dark:border-dark-border bg-neutral-50 dark:bg-dark-card/50">
          <div className="px-4 py-3 border-b border-neutral-200 dark:border-dark-border">
            <h3 className="font-semibold text-sm">Resultados dos Testes</h3>
          </div>
          <div className="p-4 space-y-2 max-h-48 overflow-y-auto">
            {result.testResults.map((test, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-start gap-3 p-3 rounded-md',
                  test.passed
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                )}
              >
                {test.passed ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 dark:text-dark-foreground">
                    {test.name}
                  </p>
                  {test.error && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1 font-mono">
                      {test.error}
                    </p>
                  )}
                  {test.output && (
                    <p className="text-sm text-neutral-600 dark:text-dark-muted mt-1 font-mono">
                      {test.output}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Feedback */}
      {result?.aiFeedback && (
        <div className="border-t border-neutral-200 dark:border-dark-border bg-purple-50 dark:bg-purple-900/20">
          <div className="px-4 py-3 border-b border-purple-200 dark:border-purple-800">
            <h3 className="font-semibold text-sm text-purple-900 dark:text-purple-300">
              Feedback da IA
            </h3>
          </div>
          <div className="p-4">
            <p className="text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">
              {result.aiFeedback}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default CodeEditor;
