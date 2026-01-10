'use client';

import React from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Trophy } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type PostType = 'challenge_completed' | 'achievement' | 'question' | 'share' | 'project';

export interface FeedPost {
  id: string;
  userId: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  type: PostType;
  content: string;
  challengeTitle?: string;
  challengeSlug?: string;
  xpGained?: number;
  badgeIcon?: string;
  badgeName?: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  createdAt: string;
}

interface FeedPostProps {
  post: FeedPost;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
}

export function FeedPostComponent({ post, onLike, onComment, onShare }: FeedPostProps) {
  const getTypeColor = (type: PostType) => {
    switch (type) {
      case 'challenge_completed':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'achievement':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'question':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'share':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'project':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      default:
        return 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400';
    }
  };

  const getTypeLabel = (type: PostType) => {
    switch (type) {
      case 'challenge_completed':
        return 'Desafio Completado';
      case 'achievement':
        return 'Conquista';
      case 'question':
        return 'Pergunta';
      case 'share':
        return 'Compartilhamento';
      case 'project':
        return 'Projeto';
      default:
        return 'Post';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMins < 1) return 'agora';
    if (diffInMins < 60) return `${diffInMins}m`;
    if (diffInHours < 24) return `${diffInHours}h`;
    return `${diffInDays}d`;
  };

  return (
    <article className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-neutral-200 dark:border-dark-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.avatarUrl} alt={post.username} />
            <AvatarFallback className="bg-accent text-white">
              {post.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-neutral-900 dark:text-dark-foreground">
                {post.fullName}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium">
                @{post.username}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={cn('text-xs px-2 py-0.5 rounded-full', getTypeColor(post.type))}>
                {getTypeLabel(post.type)}
              </span>
              <span className="text-xs text-neutral-500 dark:text-dark-muted">
                {formatTimeAgo(post.createdAt)}
              </span>
            </div>
          </div>
        </div>
        <button className="p-2 hover:bg-neutral-100 dark:hover:bg-dark-border rounded-lg transition-colors">
          <MoreHorizontal className="h-5 w-5 text-neutral-500" />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pb-4">
        {/* Challenge Info */}
        {post.type === 'challenge_completed' && post.challengeTitle && (
          <div className="mb-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="font-medium text-neutral-900 dark:text-dark-foreground">
                  {post.challengeTitle}
                </p>
                {post.xpGained && (
                  <p className="text-sm text-green-600 dark:text-green-400">
                    +{post.xpGained} XP ganhos
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Badge Info */}
        {post.type === 'achievement' && post.badgeIcon && (
          <div className="mb-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{post.badgeIcon}</span>
              <div>
                <p className="font-medium text-neutral-900 dark:text-dark-foreground">
                  Conquista desbloqueada: {post.badgeName}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Text Content */}
        <p className="text-neutral-700 dark:text-dark-foreground whitespace-pre-wrap">
          {post.content}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-around px-4 py-3 border-t border-neutral-200 dark:border-dark-border">
        <button
          onClick={() => onLike?.(post.id)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
            post.isLiked
              ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
              : 'text-neutral-600 dark:text-dark-muted hover:bg-neutral-100 dark:hover:bg-dark-border'
          )}
        >
          <Heart className={cn('h-5 w-5', post.isLiked && 'fill-current')} />
          <span>{post.likesCount > 0 ? post.likesCount : ''}</span>
        </button>
        <button
          onClick={() => onComment?.(post.id)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-neutral-600 dark:text-dark-muted hover:bg-neutral-100 dark:hover:bg-dark-border transition-colors"
        >
          <MessageCircle className="h-5 w-5" />
          <span>{post.commentsCount > 0 ? post.commentsCount : ''}</span>
        </button>
        <button
          onClick={() => onShare?.(post.id)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-neutral-600 dark:text-dark-muted hover:bg-neutral-100 dark:hover:bg-dark-border transition-colors"
        >
          <Share2 className="h-5 w-5" />
        </button>
      </div>
    </article>
  );
}

export default FeedPostComponent;
