'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Plus,
  TrendingUp,
  Hash,
  MessageSquare,
  Code,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import FeedPostComponent from '@/components/app/social/FeedPost';
import { CreatePostDialog } from '@/components/app/social/CreatePostDialog';
import {
  getFeed,
  getTrending,
  getUnsolvedQuestions,
  getPostsWithSnippets,
  createPost as createPostApi,
  CreatePostRequest,
  PostType,
  FeedPostResponse,
} from '@/lib/api/social';
import { cn } from '@/lib/utils';

type FeedTab = 'recent' | 'trending' | 'questions' | 'snippets';

export default function FeedPage() {
  const [posts, setPosts] = useState<FeedPostResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<FeedTab>('recent');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = useCallback(async (pageNum: number = 0) => {
    try {
      const isLoadMore = pageNum > 0;
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      let response;
      switch (activeTab) {
        case 'recent':
          response = await getFeed(pageNum, 20);
          break;
        case 'trending':
          response = await getTrending(pageNum, 20);
          break;
        case 'questions':
          response = await getUnsolvedQuestions(pageNum, 20);
          break;
        case 'snippets':
          response = await getPostsWithSnippets(pageNum, 20);
          break;
        default:
          response = await getFeed(pageNum, 20);
      }

      const newPosts = response.content || [];

      if (isLoadMore) {
        setPosts((prev) => [...prev, ...newPosts]);
      } else {
        setPosts(newPosts);
      }

      setHasMore(!response.last);
      setPage(pageNum);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      // Set empty posts on error
      setPosts([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchPosts(0);
  }, [activeTab, fetchPosts]);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchPosts(page + 1);
    }
  };

  const handleComment = (postId: string) => {
    // TODO: Open comment dialog/sheet
    console.log('Open comments for post:', postId);
  };

  const handleShare = (postId: string) => {
    // TODO: Implement share functionality (copy link, share to external, etc.)
    console.log('Share post:', postId);
  };

  const handleCreatePost = async (data: CreatePostRequest) => {
    try {
      const newPost = await createPostApi(data);
      setPosts((prev) => [newPost, ...prev]);
    } catch (error) {
      console.error('Failed to create post:', error);
      throw error;
    }
  };

  const trendingTopics = [
    { tag: 'JavaScript', count: 1234 },
    { tag: 'React', count: 892 },
    { tag: 'Python', count: 567 },
    { tag: 'TypeScript', count: 445 },
    { tag: 'Java', count: 334 },
    { tag: 'Ajuda', count: 298 },
    { tag: 'Projetos', count: 234 },
    { tag: 'Frontend', count: 189 },
  ];

  const tabs = [
    { id: 'recent' as FeedTab, label: 'Recentes', icon: null },
    { id: 'trending' as FeedTab, label: 'Em Alta', icon: <TrendingUp className="h-4 w-4" /> },
    { id: 'questions' as FeedTab, label: 'Perguntas', icon: <MessageSquare className="h-4 w-4" /> },
    { id: 'snippets' as FeedTab, label: 'Snippets', icon: <Code className="h-4 w-4" /> },
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
          <div className="flex gap-1 sm:gap-4 mt-4 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
                  activeTab === tab.id
                    ? 'bg-accent/10 text-accent'
                    : 'text-neutral-600 dark:text-dark-muted hover:bg-neutral-100 dark:hover:bg-dark-border'
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-foreground mb-2">
              Nenhum post encontrado
            </h3>
            <p className="text-neutral-600 dark:text-dark-muted mb-6">
              {activeTab === 'questions'
                ? 'Nenhuma pergunta pendente. Seja o primeiro a perguntar!'
                : activeTab === 'snippets'
                  ? 'Nenhum snippet compartilhado ainda.'
                  : 'Seja o primeiro a compartilhar algo com a comunidade!'}
            </p>
            <Button
              onClick={() => setCreateDialogOpen(true)}
              className="gap-2 bg-accent hover:bg-accent/90 text-white"
            >
              <Plus className="h-4 w-4" />
              Criar Post
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <FeedPostComponent
                key={post.id}
                post={post}
                onComment={handleComment}
                onShare={handleShare}
              />
            ))}

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center py-4">
                <Button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  variant="outline"
                  className="min-w-[150px]"
                >
                  {loadingMore ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent" />
                      Carregando...
                    </div>
                  ) : (
                    'Carregar Mais'
                  )}
                </Button>
              </div>
            )}
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
