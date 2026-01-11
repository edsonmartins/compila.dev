'use client';

import React, { useEffect, useState } from 'react';
import { Plus, TrendingUp, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FeedPostComponent, { FeedPost } from '@/components/app/social/FeedPost';
import { CreatePostDialog } from '@/components/app/social/CreatePostDialog';
import { cn } from '@/lib/utils';

export default function FeedPage() {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'recent' | 'trending'>('recent');

  useEffect(() => {
    // TODO: Fetch posts from API
    const mockPosts: FeedPost[] = [
      {
        id: '1',
        userId: '1',
        username: 'maria_dev',
        fullName: 'Maria Santos',
        avatarUrl: 'https://i.pravatar.cc/150?img=5',
        type: 'challenge_completed',
        content: 'Finalmente consegui completar o desafio do FizzBuzz! Parecia simples mas me pegou de jeito na lógica dos múltiplos. Aprendi bastante sobre operadores modulus. 🎉',
        challengeTitle: 'FizzBuzz Clássico',
        challengeSlug: 'fizzbuzz',
        xpGained: 30,
        likesCount: 24,
        commentsCount: 5,
        isLiked: false,
        createdAt: new Date(Date.now() - 30 * 60000).toISOString(), // 30 min ago
      },
      {
        id: '2',
        userId: '2',
        username: 'pedro_code',
        fullName: 'Pedro Costa',
        avatarUrl: 'https://i.pravatar.cc/150?img=12',
        type: 'achievement',
        content: 'Consegui chegar na marca de 1000 XP! 🎉 Já estou no nível 2 e não pretendo parar por aqui. Obrigado a toda a comunidade pelo apoio!',
        badgeIcon: '⭐',
        badgeName: '1.000 XP',
        likesCount: 89,
        commentsCount: 23,
        isLiked: true,
        createdAt: new Date(Date.now() - 2 * 3600000).toISOString(), // 2 hours ago
      },
      {
        id: '3',
        userId: '3',
        username: 'ana_js',
        fullName: 'Ana Silva',
        avatarUrl: 'https://i.pravatar.cc/150?img=9',
        type: 'question',
        content: 'Alguém pode me ajudar a entender como funciona o async/await no JavaScript? Estou tendo dificuldade em entender quando usar cada um.',
        likesCount: 15,
        commentsCount: 12,
        isLiked: false,
        createdAt: new Date(Date.now() - 5 * 3600000).toISOString(), // 5 hours ago
      },
      {
        id: '4',
        userId: '4',
        username: 'carlos_full',
        fullName: 'Carlos Mendes',
        avatarUrl: 'https://i.pravatar.cc/150?img=32',
        type: 'project',
        content: 'Acabei de publicar meu projeto final do curso de React! É um dashboard de tarefas com drag-and-drop e dark mode. O link está no meu perfil! 👇',
        likesCount: 56,
        commentsCount: 8,
        isLiked: false,
        createdAt: new Date(Date.now() - 24 * 3600000).toISOString(), // 1 day ago
      },
      {
        id: '5',
        userId: '5',
        username: 'julia_beginner',
        fullName: 'Júlia Rocha',
        avatarUrl: 'https://i.pravatar.cc/150?img=23',
        type: 'share',
        content: 'Hoje completei 7 dias consecutivos estudando no Compila.dev! A plataforma está sendo muito útil para melhorar minhas habilidades de programação. Recomendo para quem está começando! 🚀',
        likesCount: 42,
        commentsCount: 7,
        isLiked: false,
        createdAt: new Date(Date.now() - 48 * 3600000).toISOString(), // 2 days ago
      },
    ];

    setTimeout(() => {
      setPosts(mockPosts);
      setLoading(false);
    }, 500);
  }, []);

  const handleLike = (postId: string) => {
    setPosts(posts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likesCount: post.isLiked ? post.likesCount - 1 : post.likesCount + 1,
        };
      }
      return post;
    }));
  };

  const handleComment = (postId: string) => {
    // TODO: Open comment dialog
    console.log('Open comments for post:', postId);
  };

  const handleShare = (postId: string) => {
    // TODO: Implement share functionality
    console.log('Share post:', postId);
  };

  const handleCreatePost = (content: string, type: string, metadata?: Record<string, unknown>) => {
    const newPost: FeedPost = {
      id: Date.now().toString(),
      userId: 'current-user',
      username: 'current_user',
      fullName: 'Usuário Atual',
      avatarUrl: 'https://i.pravatar.cc/150?img=11',
      type: type as FeedPost['type'],
      content,
      likesCount: 0,
      commentsCount: 0,
      isLiked: false,
      createdAt: new Date().toISOString(),
      ...metadata,
    };
    setPosts([newPost, ...posts]);
  };

  const trendingTopics = [
    { tag: 'JavaScript', count: 1234 },
    { tag: 'React', count: 892 },
    { tag: 'Python', count: 567 },
    { tag: 'Ajuda', count: 445 },
    { tag: 'Projetos', count: 334 },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-dark-background">
      {/* Header */}
      <header className="bg-white dark:bg-dark-card border-b border-neutral-200 dark:border-dark-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-dark-foreground">
              Feed da Comunidade
            </h1>
            <Button
              onClick={() => setCreateDialogOpen(true)}
              className="gap-2 bg-accent hover:bg-accent/90 text-white"
            >
              <Plus className="h-4 w-4" />
              Novo Post
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => setActiveTab('recent')}
              className={cn(
                'pb-2 border-b-2 transition-colors',
                activeTab === 'recent'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-neutral-600 dark:text-dark-muted hover:text-neutral-900 dark:hover:text-dark-foreground'
              )}
            >
              Recentes
            </button>
            <button
              onClick={() => setActiveTab('trending')}
              className={cn(
                'flex items-center gap-1 pb-2 border-b-2 transition-colors',
                activeTab === 'trending'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-neutral-600 dark:text-dark-muted hover:text-neutral-900 dark:hover:text-dark-foreground'
              )}
            >
              <TrendingUp className="h-4 w-4" />
              Em Alta
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <FeedPostComponent
                key={post.id}
                post={post}
                onLike={handleLike}
                onComment={handleComment}
                onShare={handleShare}
              />
            ))}
          </div>
        )}

        {/* Trending Topics Sidebar */}
        <aside className="mt-8 bg-white dark:bg-dark-card rounded-xl shadow-sm border border-neutral-200 dark:border-dark-border p-4">
          <h3 className="font-semibold text-neutral-900 dark:text-dark-foreground mb-4 flex items-center gap-2">
            <Hash className="h-5 w-5" />
            Tópicos em Alta
          </h3>
          <div className="flex flex-wrap gap-2">
            {trendingTopics.map((topic) => (
              <button
                key={topic.tag}
                className="px-3 py-1.5 bg-neutral-100 dark:bg-dark-border rounded-full text-sm hover:bg-neutral-200 dark:hover:bg-dark-border/80 transition-colors"
              >
                #{topic.tag}
              </button>
            ))}
          </div>
        </aside>
      </div>

      <CreatePostDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onPost={handleCreatePost}
      />
    </div>
  );
}
