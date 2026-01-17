'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Reply,
  CheckCircle,
  Flame,
  MoreHorizontal,
  Trash2,
  Flag,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  CommentResponse,
  getComments,
  addComment,
  getCommentReplies,
  markAsSolution,
  CommentRequest,
  PostType,
  CodeSnippet,
} from '@/lib/api/social';

interface CommentsDialogProps {
  open: boolean;
  onClose: () => void;
  postId: string;
  postType: PostType;
  isSolved: boolean;
  isOwner: boolean;
  onCommentAdded?: () => void;
  onSolutionMarked?: () => void;
}

export function CommentsDialog({
  open,
  onClose,
  postId,
  postType,
  isSolved,
  isOwner,
  onCommentAdded,
  onSolutionMarked,
}: CommentsDialogProps) {
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getComments(postId, 0, 50);
      setComments(response.content || []);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      toast.error('Não foi possível carregar os comentários');
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    if (open) {
      fetchComments();
    }
  }, [open, fetchComments]);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      const request: CommentRequest = {
        content: newComment.trim(),
      };
      const comment = await addComment(postId, request);
      setComments((prev) => [comment, ...prev]);
      setNewComment('');
      toast.success('Comentário adicionado!');
      onCommentAdded?.();
    } catch (error) {
      console.error('Failed to add comment:', error);
      toast.error('Não foi possível adicionar o comentário');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!replyText.trim()) return;

    try {
      setSubmitting(true);
      const request: CommentRequest = {
        content: replyText.trim(),
        parentId,
      };
      const reply = await addComment(postId, request);

      // Update the parent comment's reply count
      setComments((prev) =>
        prev.map((c) =>
          c.id === parentId
            ? { ...c, replyCount: c.replyCount + 1 }
            : c
        )
      );

      // Add reply to local state
      setComments((prev) => {
        const parentIndex = prev.findIndex((c) => c.id === parentId);
        if (parentIndex === -1) return prev;

        const newComments = [...prev];
        newComments.splice(parentIndex + 1, 0, reply);
        return newComments;
      });

      setReplyText('');
      setReplyTo(null);
      toast.success('Resposta adicionada!');
      onCommentAdded?.();
    } catch (error) {
      console.error('Failed to add reply:', error);
      toast.error('Não foi possível adicionar a resposta');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkAsSolution = async (commentId: string) => {
    try {
      await markAsSolution(postId, commentId);
      setComments((prev) =>
        prev.map((c) => ({
          ...c,
          isSolution: c.id === commentId ? true : c.isSolution,
        }))
      );
      toast.success('Comentário marcado como solução!');
      onSolutionMarked?.();
    } catch (error) {
      console.error('Failed to mark as solution:', error);
      toast.error('Não foi possível marcar como solução');
    }
  };

  const handleFireComment = async (commentId: string) => {
    // TODO: Implement fire kudo for comments
    console.log('Fire comment:', commentId);
  };

  const toggleReplies = async (commentId: string) => {
    const newExpanded = new Set(expandedReplies);
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId);
    } else {
      newExpanded.add(commentId);
      // Fetch replies if not already loaded
      const hasRepliesLoaded = comments.some(
        (c) => c.parentId === commentId
      );
      if (!hasRepliesLoaded) {
        try {
          const response = await getCommentReplies(commentId, 0, 20);
          const replies = response.content || [];

          // Insert replies after the parent comment
          setComments((prev) => {
            const parentIndex = prev.findIndex((c) => c.id === commentId);
            if (parentIndex === -1) return prev;

            const newComments = [...prev];
            // Remove any existing replies for this comment first
            const filtered = newComments.filter(
              (c) => c.parentId !== commentId
            );
            const newParentIndex = filtered.findIndex((c) => c.id === commentId);
            filtered.splice(newParentIndex + 1, 0, ...replies);
            return filtered;
          });
        } catch (error) {
          console.error('Failed to fetch replies:', error);
          toast.error('Não foi possível carregar as respostas');
        }
      }
    }
    setExpandedReplies(newExpanded);
  };

  const isQuestionPost = postType === PostType.QUESTION;
  const canMarkSolution = isQuestionPost && isOwner && !isSolved;

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMins < 1) return 'agora';
    if (diffInMins < 60) return `${diffInMins} min`;
    if (diffInHours < 24) return `${diffInHours}h`;
    return `${diffInDays}d`;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const renderComment = (comment: CommentResponse, isReply = false) => {
    const isTopLevel = !comment.parentId;
    const showReplyButton = isTopLevel && !comment.isDeleted;
    const hasReplies = comment.replyCount > 0;
    const isExpanded = expandedReplies.has(comment.id);
    const isReplyingTo = replyTo === comment.id;

    return (
      <div
        key={comment.id}
        className={cn(
          'group',
          isReply && 'ml-12 mt-3'
        )}
      >
        <div
          className={cn(
            'flex gap-3',
            isReply && 'p-3 bg-neutral-50 dark:bg-dark-border/30 rounded-lg'
          )}
        >
          {/* Avatar */}
          <Avatar className={cn('h-8 w-8 flex-shrink-0', isReply && 'h-6 w-6')}>
            <AvatarImage src={comment.avatarUrl} alt={comment.username} />
            <AvatarFallback className="bg-accent text-white text-xs">
              {getInitials(comment.fullName)}
            </AvatarFallback>
          </Avatar>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-sm text-neutral-900 dark:text-dark-foreground">
                {comment.fullName}
              </span>
              <span className="text-xs text-neutral-500 dark:text-dark-muted">
                @{comment.username}
              </span>
              <span className="text-xs text-neutral-400 dark:text-dark-muted">
                {formatTimeAgo(comment.createdAt)}
              </span>
              {comment.isSolution && (
                <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  <CheckCircle className="h-3 w-3" />
                  Solução
                </span>
              )}
            </div>

            {comment.isDeleted ? (
              <p className="text-sm text-neutral-400 dark:text-dark-muted italic mt-1">
                Este comentário foi removido.
              </p>
            ) : (
              <>
                <p className="text-sm text-neutral-700 dark:text-dark-foreground mt-1 whitespace-pre-wrap">
                  {comment.content}
                </p>

                {/* Code Snippet in comment */}
                {comment.codeSnippet && (
                  <div className="mt-2 p-3 bg-neutral-900 rounded-lg overflow-x-auto">
                    <pre className="text-sm text-green-400">
                      <code>{comment.codeSnippet.code}</code>
                    </pre>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3 mt-2">
                  {/* Fire Kudo */}
                  <button
                    onClick={() => handleFireComment(comment.id)}
                    className={cn(
                      'flex items-center gap-1 text-xs transition-colors',
                      comment.fireCount > 0
                        ? 'text-orange-500 dark:text-orange-400'
                        : 'text-neutral-500 dark:text-dark-muted hover:text-orange-500'
                    )}
                  >
                    <Flame className="h-3.5 w-3.5" />
                    {comment.fireCount > 0 && <span>{comment.fireCount}</span>}
                  </button>

                  {/* Reply button */}
                  {showReplyButton && (
                    <button
                      onClick={() => setReplyTo(comment.id)}
                      className="flex items-center gap-1 text-xs text-neutral-500 dark:text-dark-muted hover:text-accent transition-colors"
                    >
                      <Reply className="h-3.5 w-3.5" />
                      Responder
                    </button>
                  )}

                  {/* Mark as solution */}
                  {canMarkSolution && isTopLevel && (
                    <button
                      onClick={() => handleMarkAsSolution(comment.id)}
                      className={cn(
                        'flex items-center gap-1 text-xs transition-colors',
                        comment.isSolution
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-neutral-500 dark:text-dark-muted hover:text-green-600 dark:hover:text-green-400'
                      )}
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      {comment.isSolution ? 'Marcado' : 'Marcar solução'}
                    </button>
                  )}

                  {/* More options */}
                  <button className="text-neutral-400 dark:text-dark-muted hover:text-neutral-600 dark:hover:text-dark-foreground">
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Reply input */}
                {isReplyingTo && (
                  <div className="mt-3 flex gap-2">
                    <Textarea
                      placeholder="Escreva sua resposta..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="min-h-[60px] text-sm"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          setReplyTo(null);
                          setReplyText('');
                        }}
                        variant="ghost"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSubmitReply(comment.id)}
                        disabled={!replyText.trim() || submitting}
                        className="bg-accent hover:bg-accent/90"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Show replies toggle */}
        {hasReplies && isTopLevel && (
          <button
            onClick={() => toggleReplies(comment.id)}
            className="ml-11 mt-2 flex items-center gap-1 text-xs text-accent hover:underline"
          >
            <Reply className="h-3 w-3.3" />
            {isExpanded ? 'Ocultar' : 'Ver'} {comment.replyCount}{' '}
            {comment.replyCount === 1 ? 'resposta' : 'respostas'}
          </button>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Comentários
            {comments.length > 0 && (
              <span className="text-sm font-normal text-neutral-500 dark:text-dark-muted">
                ({comments.length})
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto -mx-6 px-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 mx-auto text-neutral-300 dark:text-dark-muted mb-3" />
              <p className="text-neutral-600 dark:text-dark-muted">
                Seja o primeiro a comentar!
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {comments
                .filter((c) => !c.parentId)
                .map((comment) => renderComment(comment))}
            </div>
          )}
        </div>

        {/* New Comment Input */}
        <div className="flex-shrink-0 pt-4 border-t border-neutral-200 dark:border-dark-border">
          <div className="flex gap-3">
            <Textarea
              placeholder="Escreva um comentário..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[80px] resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmitComment();
                }
              }}
            />
            <div className="flex flex-col gap-2">
              <Button
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || submitting}
                className="bg-accent hover:bg-accent/90 h-full px-4"
              >
                {submitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <p className="text-xs text-neutral-400 dark:text-dark-muted mt-2">
            Pressione Enter para enviar, Shift+Enter para nova linha
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CommentsDialog;
