'use client';

import React, { useState } from 'react';
import { X, Trophy, Code, MessageSquare, Share2, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FeedPostComponent, PostType } from './FeedPost';
import { cn } from '@/lib/utils';

interface CreatePostDialogProps {
  open: boolean;
  onClose: () => void;
  onPost: (content: string, type: PostType, metadata?: Record<string, unknown>) => void;
}

export function CreatePostDialog({ open, onClose, onPost }: CreatePostDialogProps) {
  const [content, setContent] = useState('');
  const [selectedType, setSelectedType] = useState<PostType>('share');

  const postTypes: { type: PostType; label: string; icon: React.ReactNode }[] = [
    { type: 'share', label: 'Compartilhar', icon: <Share2 className="h-4 w-4" /> },
    { type: 'challenge_completed', label: 'Desafio', icon: <Trophy className="h-4 w-4" /> },
    { type: 'question', label: 'Pergunta', icon: <MessageSquare className="h-4 w-4" /> },
    { type: 'project', label: 'Projeto', icon: <FolderOpen className="h-4 w-4" /> },
    { type: 'achievement', label: 'Conquista', icon: <Code className="h-4 w-4" /> },
  ];

  const handlePost = () => {
    if (content.trim()) {
      onPost(content, selectedType);
      setContent('');
      setSelectedType('share');
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Criar Post</DialogTitle>
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
            placeholder={
              selectedType === 'question'
                ? 'O que você gostaria de perguntar?'
                : selectedType === 'challenge_completed'
                  ? 'Conte sobre o desafio que você completou!'
                  : selectedType === 'project'
                    ? 'Mostre seu projeto para a comunidade!'
                    : 'Compartilhe algo com a comunidade...'
            }
            rows={4}
            className="resize-none"
          />

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              onClick={handlePost}
              disabled={!content.trim()}
              className="bg-accent hover:bg-accent/90 text-white"
            >
              Publicar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
