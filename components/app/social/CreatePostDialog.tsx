'use client';

import React, { useState } from 'react';
import {
  X,
  Trophy,
  MessageSquare,
  Share2,
  FolderOpen,
  Code,
  Users,
  Search,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  PostType,
  POST_TYPE_CONFIG,
  CreatePostRequest,
  CodeSnippet,
} from '@/lib/api/social';
import { cn } from '@/lib/utils';
import { CodeSnippet as CodeSnippetPreview } from './CodeSnippet';

interface CreatePostDialogProps {
  open: boolean;
  onClose: () => void;
  onPost: (data: CreatePostRequest) => void | Promise<void>;
}

export function CreatePostDialog({ open, onClose, onPost }: CreatePostDialogProps) {
  const [content, setContent] = useState('');
  const [selectedType, setSelectedType] = useState<PostType>(PostType.SHARE);
  const [includeCode, setIncludeCode] = useState(false);
  const [codeSnippet, setCodeSnippet] = useState<CodeSnippet>({
    language: 'javascript',
    code: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const postTypes: { type: PostType; label: string; icon: React.ReactNode }[] = [
    { type: PostType.SHARE, label: 'Compartilhar', icon: <Share2 className="h-4 w-4" /> },
    { type: PostType.QUESTION, label: 'Pergunta', icon: <MessageSquare className="h-4 w-4" /> },
    { type: PostType.SNIPPET, label: 'Snippet', icon: <Code className="h-4 w-4" /> },
    { type: PostType.PROJECT, label: 'Projeto', icon: <FolderOpen className="h-4 w-4" /> },
    { type: PostType.PAIR_REQUEST, label: 'Pair Programming', icon: <Users className="h-4 w-4" /> },
    { type: PostType.CHALLENGE_COMPLETED, label: 'Desafio', icon: <Trophy className="h-4 w-4" /> },
    { type: PostType.CODE_REVIEW, label: 'Code Review', icon: <Search className="h-4 w-4" /> },
  ];

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'sql', label: 'SQL' },
    { value: 'bash', label: 'Bash' },
    { value: 'json', label: 'JSON' },
    { value: 'tsx', label: 'React TSX' },
    { value: 'jsx', label: 'React JSX' },
  ];

  const handlePost = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const data: CreatePostRequest = {
        content,
        type: selectedType,
        ...(includeCode && codeSnippet.code.trim()
          ? { codeSnippet: { ...codeSnippet, code: codeSnippet.code.trim() } }
          : {}),
      };

      await onPost(data);
      // Reset form
      setContent('');
      setSelectedType(PostType.SHARE);
      setIncludeCode(false);
      setCodeSnippet({ language: 'javascript', code: '' });
      onClose();
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPlaceholder = () => {
    switch (selectedType) {
      case PostType.QUESTION:
        return 'O que você gostaria de perguntar? Seja específico para obter boas respostas!';
      case PostType.SNIPPET:
        return 'Descreva o que este snippet faz...';
      case PostType.PROJECT:
        return 'Conte sobre seu projeto! Stack, desafios, próximos passos...';
      case PostType.PAIR_REQUEST:
        return 'O que você quer trabalhar? Qual stack? Qual horário funciona para você?';
      case PostType.CHALLENGE_COMPLETED:
        return 'Conte sobre o desafio que você completou! O que você aprendeu?';
      case PostType.CODE_REVIEW:
        return 'Cole seu código abaixo e descreva o tipo de feedback que você busca...';
      default:
        return 'Compartilhe algo com a comunidade...';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">
              Criar Post
            </DialogTitle>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 dark:hover:bg-dark-border rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Post Type Selection */}
          <div className="flex flex-wrap gap-2">
            {postTypes.map(({ type, label, icon }) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  selectedType === type
                    ? 'bg-accent text-white'
                    : 'bg-neutral-100 dark:bg-dark-border text-neutral-700 dark:text-dark-foreground hover:bg-neutral-200 dark:hover:bg-dark-border/80'
                )}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>

          {/* Content */}
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={getPlaceholder()}
            rows={4}
            className="resize-none"
          />

          {/* Code Snippet Toggle */}
          <button
            onClick={() => setIncludeCode(!includeCode)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors w-fit',
              includeCode
                ? 'bg-accent/10 text-accent border border-accent/20'
                : 'bg-neutral-100 dark:bg-dark-border text-neutral-600 dark:text-dark-foreground hover:bg-neutral-200 dark:hover:bg-dark-border/80 border border-transparent'
            )}
          >
            <Code className="h-4 w-4" />
            {includeCode ? 'Código incluído' : 'Adicionar código'}
          </button>

          {/* Code Snippet Input */}
          {includeCode && (
            <div className="space-y-3 p-4 bg-neutral-50 dark:bg-dark-background rounded-lg border border-neutral-200 dark:border-dark-border">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-neutral-700 dark:text-dark-foreground">
                  Linguagem:
                </label>
                <select
                  value={codeSnippet.language}
                  onChange={(e) =>
                    setCodeSnippet({ ...codeSnippet, language: e.target.value })
                  }
                  className="flex-1 px-3 py-2 rounded-lg bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border text-sm"
                >
                  {languages.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>

              <Textarea
                value={codeSnippet.code}
                onChange={(e) =>
                  setCodeSnippet({ ...codeSnippet, code: e.target.value })
                }
                placeholder="Cole seu código aqui..."
                rows={6}
                className="font-mono text-sm resize-none bg-white dark:bg-dark-card"
              />

              <Input
                value={codeSnippet.description || ''}
                onChange={(e) =>
                  setCodeSnippet({ ...codeSnippet, description: e.target.value })
                }
                placeholder="Descrição opcional do código (ex: função para calcular fibonacci)"
                className="bg-white dark:bg-dark-card"
              />

              {/* Preview */}
              {codeSnippet.code && (
                <div>
                  <p className="text-xs text-neutral-500 dark:text-dark-muted mb-2">
                    Preview:
                  </p>
                  <CodeSnippetPreview
                    code={codeSnippet.code}
                    language={codeSnippet.language}
                    description={codeSnippet.description}
                    maxHeight="200px"
                    showLineNumbers={false}
                  />
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              onClick={handlePost}
              disabled={!content.trim() || isSubmitting}
              className="bg-accent hover:bg-accent/90 text-white"
            >
              {isSubmitting ? (
                <>
                  <Zap className="h-4 w-4 mr-2 animate-pulse" />
                  Publicando...
                </>
              ) : (
                'Publicar'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CreatePostDialog;
