'use client';

import React from 'react';
import {
  MessageCircle,
  Share2,
  MoreHorizontal,
  Trophy,
  Award,
  CheckCircle,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { KudoButton } from './KudoButton';
import { CodeSnippet } from './CodeSnippet';
import {
  FeedPostResponse,
  PostType,
  POST_TYPE_CONFIG,
  toggleKudo,
  KudoResponse,
} from '@/lib/api/social';

interface FeedPostProps {
  post: FeedPostResponse;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
}

export function FeedPostComponent({ post, onComment, onShare }: FeedPostProps) {
  const [localPost, setLocalPost] = React.useState<FeedPostResponse>(post);

  const handleKudoChange = async (response: KudoResponse) => {
    setLocalPost({
      ...localPost,
      userKudo: response.kudoType,
      fireCount: response.fireCount,
      rocketCount: response.rocketCount,
      lightbulbCount: response.lightbulbCount,
      cleanCount: response.cleanCount,
      targetCount: response.targetCount,
      pairCount: response.pairCount,
      totalKudos: response.totalKudos,
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMins < 1) return 'agora';
    if (diffInMins < 60) return `${diffInMins} min atrás`;
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    return `${diffInDays}d atrás`;
  };

  const getTypeColor = (type: PostType) => {
    switch (type) {
      case PostType.CHALLENGE_COMPLETED:
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case PostType.ACHIEVEMENT:
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case PostType.QUESTION:
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case PostType.SHARE:
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case PostType.PROJECT:
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case PostType.SNIPPET:
        return 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400';
      case PostType.PAIR_REQUEST:
        return 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400';
      case PostType.CODE_REVIEW:
        return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400';
      default:
        return 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400';
    }
  };

  const typeConfig = POST_TYPE_CONFIG[localPost.type] || {
    label: 'Post',
    icon: '📝',
  };

  return (
    <article className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-neutral-200 dark:border-dark-border overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={localPost.avatarUrl} alt={localPost.username} />
            <AvatarFallback className="bg-accent text-white">
              {localPost.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-neutral-900 dark:text-dark-foreground">
                {localPost.fullName}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-neutral-100 dark:bg-dark-border text-neutral-600 dark:text-dark-muted">
                @{localPost.username}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className={cn(
                  'text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1',
                  getTypeColor(localPost.type)
                )}
              >
                <span>{typeConfig.icon}</span>
                {typeConfig.label}
              </span>
              <span className="text-xs text-neutral-500 dark:text-dark-muted">
                {localPost.timeAgo || formatTimeAgo(localPost.createdAt)}
              </span>
              {localPost.isSolved && (
                <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  <CheckCircle className="h-3 w-3" />
                  Resolvido
                </span>
              )}
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
        {localPost.type === PostType.CHALLENGE_COMPLETED &&
          localPost.metadata &&
          'challengeTitle' in localPost.metadata &&
          typeof localPost.metadata.challengeTitle === 'string' && (
            <div className="mb-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="font-medium text-neutral-900 dark:text-dark-foreground">
                    {localPost.metadata.challengeTitle}
                  </p>
                  {'xpGained' in localPost.metadata &&
                    typeof localPost.metadata.xpGained === 'number' && (
                      <p className="text-sm text-green-600 dark:text-green-400">
                        +{localPost.metadata.xpGained} XP ganhos
                      </p>
                    )}
                </div>
              </div>
            </div>
          )}

        {/* Badge Info */}
        {localPost.type === PostType.ACHIEVEMENT &&
          localPost.metadata &&
          'badgeName' in localPost.metadata &&
          typeof localPost.metadata.badgeName === 'string' && (
            <div className="mb-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center gap-3">
                <span className="text-3xl">
                  {'badgeIcon' in localPost.metadata &&
                    typeof localPost.metadata.badgeIcon === 'string'
                    ? localPost.metadata.badgeIcon
                    : '⭐'}
                </span>
                <div>
                  <p className="font-medium text-neutral-900 dark:text-dark-foreground">
                    Conquista desbloqueada:{' '}
                    {localPost.metadata.badgeName}
                  </p>
                </div>
              </div>
            </div>
          )}

        {/* Text Content */}
        <p className="text-neutral-700 dark:text-dark-foreground whitespace-pre-wrap mb-3">
          {localPost.content}
        </p>

        {/* Code Snippet */}
        {localPost.codeSnippet && (
          <CodeSnippet
            code={localPost.codeSnippet.code || ''}
            language={localPost.codeSnippet.language || 'javascript'}
            lineHighlight={localPost.codeSnippet.lineHighlight}
            description={localPost.codeSnippet.description}
            className="mb-3"
          />
        )}

        {/* Image */}
        {localPost.imageUrl && (
          <img
            src={localPost.imageUrl}
            alt="Post image"
            className="w-full rounded-lg mb-3 max-h-96 object-cover"
          />
        )}
      </div>

      {/* Kudos Summary */}
      {localPost.totalKudos > 0 && (
        <div className="px-4 py-2 bg-neutral-50 dark:bg-dark-background border-t border-neutral-100 dark:border-dark-border">
          <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-dark-muted">
            <span className="font-medium">
              {localPost.totalKudos} {localPost.totalKudos === 1 ? 'Kudo' : 'Kudos'}
            </span>
            <span>•</span>
            <span>{localPost.commentCount} comentários</span>
            {localPost.viewCount > 0 && (
              <>
                <span>•</span>
                <span>{localPost.viewCount} visualizações</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center divide-x divide-neutral-200 dark:divide-dark-border">
        {/* Kudos */}
        <div className="flex-1 px-2 py-3">
          <KudoButton
            postId={localPost.id}
            userKudo={localPost.userKudo}
            fireCount={localPost.fireCount}
            rocketCount={localPost.rocketCount}
            lightbulbCount={localPost.lightbulbCount}
            cleanCount={localPost.cleanCount}
            targetCount={localPost.targetCount}
            pairCount={localPost.pairCount}
            onKudoChange={handleKudoChange}
            compact
          />
        </div>

        {/* Comments */}
        <button
          onClick={() => onComment?.(localPost.id)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-neutral-600 dark:text-dark-muted hover:bg-neutral-100 dark:hover:bg-dark-border transition-colors"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="font-medium">
            {localPost.commentCount > 0 ? localPost.commentCount : 'Comentar'}
          </span>
        </button>

        {/* Share */}
        <button
          onClick={() => onShare?.(localPost.id)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-neutral-600 dark:text-dark-muted hover:bg-neutral-100 dark:hover:bg-dark-border transition-colors"
        >
          <Share2 className="h-5 w-5" />
          <span className="font-medium">Compartilhar</span>
        </button>
      </div>

      {/* Solution indicator for questions */}
      {localPost.type === PostType.QUESTION && localPost.isSolved && (
        <div className="px-4 py-2 bg-green-50 dark:bg-green-900/20 border-t border-green-200 dark:border-green-800 flex items-center gap-2 text-sm">
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          <span className="text-green-700 dark:text-green-400 font-medium">
            Esta pergunta foi marcada como resolvida
          </span>
        </div>
      )}
    </article>
  );
}

// Re-export types for convenience
export type { FeedPostResponse as FeedPost, PostType };

export default FeedPostComponent;
