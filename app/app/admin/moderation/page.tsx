'use client';

import React, { useEffect, useState } from 'react';
import {
  Search,
  Flag,
  Trash2,
  Eye,
  MoreHorizontal,
  MessageSquare,
  FileText,
  AlertTriangle,
  CheckCircle,
  X,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { AdminLayout } from '@/components/app/admin/AdminLayout';
import { PostType } from '@/lib/api/social';

interface ReportItem {
  id: string;
  type: 'POST' | 'COMMENT';
  content: string;
  author: {
    id: string;
    username: string;
    fullName: string;
    avatarUrl?: string;
  };
  status: 'PENDING' | 'REVIEWED' | 'APPROVED' | 'REJECTED';
  reportReason?: string;
  reportedBy?: {
    username: string;
    fullName: string;
  };
  createdAt: string;
  metadata?: {
    postType?: PostType;
    codeSnippet?: boolean;
  };
}

export default function AdminModerationPage() {
  const [items, setItems] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'POST' | 'COMMENT'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'REVIEWED' | 'APPROVED' | 'REJECTED'>('ALL');
  const [selectedItem, setSelectedItem] = useState<ReportItem | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      // Mock data for now - would fetch from /admin/moderation endpoint
      setItems([
        {
          id: '1',
          type: 'POST',
          content: 'Preciso de ajuda com um bug no useEffect do React. Alguém pode me ajudar?',
          author: {
            id: 'u1',
            username: 'joaosilva',
            fullName: 'João Silva',
            avatarUrl: 'https://i.pravatar.cc/150?img=1',
          },
          status: 'PENDING',
          reportReason: 'Conteúdo inapropriado',
          reportedBy: {
            username: 'maria',
            fullName: 'Maria Santos',
          },
          createdAt: '2025-01-10T14:30:00',
          metadata: {
            postType: PostType.QUESTION,
            codeSnippet: false,
          },
        },
        {
          id: '2',
          type: 'COMMENT',
          content: 'Seu código está completamente errado. Você deveria parar de programar se não sabe fazer isso direito.',
          author: {
            id: 'u2',
            username: 'pedro123',
            fullName: 'Pedro Costa',
            avatarUrl: 'https://i.pravatar.cc/150?img=3',
          },
          status: 'PENDING',
          reportReason: 'Comentário ofensivo',
          reportedBy: {
            username: 'admin',
            fullName: 'Administrador',
          },
          createdAt: '2025-01-10T16:45:00',
        },
        {
          id: '3',
          type: 'POST',
          content: '```javascript\nconst getData = async () => {\n  const response = await fetch("/api/data");\n  return response.json();\n};\n```\n\nEsta é uma implementação correta para fazer requisições assíncronas em JavaScript.',
          author: {
            id: 'u3',
            username: 'devmaster',
            fullName: 'Carlos Dev',
            avatarUrl: 'https://i.pravatar.cc/150?img=5',
          },
          status: 'APPROVED',
          createdAt: '2025-01-09T10:00:00',
          metadata: {
            postType: PostType.SNIPPET,
            codeSnippet: true,
          },
        },
        {
          id: '4',
          type: 'POST',
          content: 'Compartilhando meu projeto de portfólio! Feito com Next.js e Tailwind CSS. Link no perfil!',
          author: {
            id: 'u4',
            username: 'anacreative',
            fullName: 'Ana Creative',
            avatarUrl: 'https://i.pravatar.cc/150?img=9',
          },
          status: 'REVIEWED',
          createdAt: '2025-01-09T08:15:00',
          metadata: {
            postType: PostType.SHARE,
            codeSnippet: false,
          },
        },
      ]);
    } catch (error) {
      console.error('Failed to fetch moderation items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (itemId: string, action: 'approve' | 'reject' | 'delete') => {
    try {
      // await fetchApi(`/admin/moderation/${itemId}/${action}`, { method: 'POST' });
      setItems((prev) =>
        prev.map((item) => {
          if (item.id === itemId) {
            if (action === 'delete') {
              return { ...item, status: 'REJECTED' };
            }
            return { ...item, status: action === 'approve' ? 'APPROVED' : 'REJECTED' };
          }
          return item;
        })
      );
      setSelectedItem(null);
    } catch (error) {
      console.error('Failed to perform action:', error);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      search === '' ||
      item.content.toLowerCase().includes(search.toLowerCase()) ||
      item.author.fullName.toLowerCase().includes(search.toLowerCase()) ||
      item.author.username.toLowerCase().includes(search.toLowerCase());

    const matchesType = typeFilter === 'ALL' || item.type === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'APPROVED':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'REJECTED':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'REVIEWED':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Pendente';
      case 'APPROVED':
        return 'Aprovado';
      case 'REJECTED':
        return 'Rejeitado';
      case 'REVIEWED':
        return 'Revisado';
      default:
        return status;
    }
  };

  const getPostTypeLabel = (postType?: PostType) => {
    if (!postType) return null;
    switch (postType) {
      case PostType.QUESTION:
        return 'Pergunta';
      case PostType.SHARE:
        return 'Compartilhamento';
      case PostType.SNIPPET:
        return 'Snippet';
      case PostType.PROJECT:
        return 'Projeto';
      default:
        return postType;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMins = Math.floor((now.getTime() - date.getTime()) / 60000);
    if (diffInMins < 60) return `${diffInMins}m atrás`;
    const diffInHours = Math.floor(diffInMins / 60);
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    return `${Math.floor(diffInHours / 24)}d atrás`;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
        </div>
      </AdminLayout>
    );
  }

  const pendingCount = items.filter((i) => i.status === 'PENDING').length;

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-dark-foreground">
            Moderação de Conteúdo
          </h2>
          <p className="text-neutral-600 dark:text-dark-muted mt-1">
            {pendingCount > 0 && (
              <span className="inline-flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                <AlertTriangle className="h-4 w-4" />
                {pendingCount} item(ns) pendente(s) de revisão
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                placeholder="Buscar conteúdo, autor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Type Filter */}
            <Select value={typeFilter} onValueChange={(v: any) => setTypeFilter(v)}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos</SelectItem>
                <SelectItem value="POST">Posts</SelectItem>
                <SelectItem value="COMMENT">Comentários</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos</SelectItem>
                <SelectItem value="PENDING">Pendentes</SelectItem>
                <SelectItem value="APPROVED">Aprovados</SelectItem>
                <SelectItem value="REJECTED">Rejeitados</SelectItem>
                <SelectItem value="REVIEWED">Revisados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Items List */}
      {filteredItems.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Flag className="h-12 w-12 mx-auto text-neutral-300 dark:text-dark-muted mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-foreground mb-2">
              Nenhum item encontrado
            </h3>
            <p className="text-neutral-600 dark:text-dark-muted">
              {search || typeFilter !== 'ALL' || statusFilter !== 'ALL'
                ? 'Tente ajustar os filtros de busca.'
                : 'Nenhum conteúdo para moderar no momento.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className={cn(
                'hover:shadow-md transition-shadow',
                item.status === 'PENDING' && 'border-yellow-300 dark:border-yellow-700'
              )}
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Author Avatar */}
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarImage src={item.author.avatarUrl} alt={item.author.username} />
                    <AvatarFallback className="bg-accent text-white text-xs">
                      {getInitials(item.author.fullName)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-neutral-900 dark:text-dark-foreground">
                          {item.author.fullName}
                        </span>
                        <span className="text-sm text-neutral-500 dark:text-dark-muted">
                          @{item.author.username}
                        </span>
                        <span className="text-xs text-neutral-400 dark:text-dark-muted">
                          {formatTimeAgo(item.createdAt)}
                        </span>
                        <span
                          className={cn(
                            'text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1',
                            getStatusColor(item.status)
                          )}
                        >
                          {item.type === 'POST' ? (
                            <MessageSquare className="h-3 w-3" />
                          ) : (
                            <FileText className="h-3 w-3" />
                          )}
                          {getStatusLabel(item.status)}
                        </span>
                        {item.metadata?.postType && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                            {getPostTypeLabel(item.metadata.postType)}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-neutral-700 dark:text-dark-foreground whitespace-pre-wrap">
                      {item.content}
                    </p>

                    {item.reportReason && (
                      <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg flex items-center gap-2">
                        <Flag className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                        <span className="text-sm text-yellow-700 dark:text-yellow-300">
                          Denunciado por: {item.reportReason}
                          {item.reportedBy && ` (${item.reportedBy.fullName})`}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setSelectedItem(item)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {item.status === 'PENDING' && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                          onClick={() => handleAction(item.id, 'approve')}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleAction(item.id, 'reject')}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleAction(item.id, 'delete')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-2xl">
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selectedItem.type === 'POST' ? (
                    <MessageSquare className="h-5 w-5" />
                  ) : (
                    <FileText className="h-5 w-5" />
                  )}
                  Detalhes do {selectedItem.type === 'POST' ? 'Post' : 'Comentário'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {/* Author Info */}
                <div className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-dark-border rounded-lg">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedItem.author.avatarUrl} />
                    <AvatarFallback className="bg-accent text-white">
                      {getInitials(selectedItem.author.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedItem.author.fullName}</p>
                    <p className="text-sm text-neutral-500 dark:text-dark-muted">
                      @{selectedItem.author.username}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <label className="text-sm font-medium text-neutral-700 dark:text-dark-muted">
                    Conteúdo
                  </label>
                  <div className="mt-1 p-3 bg-neutral-100 dark:bg-dark-border rounded-lg">
                    <pre className="text-sm whitespace-pre-wrap">{selectedItem.content}</pre>
                  </div>
                </div>

                {/* Report Info */}
                {selectedItem.reportReason && (
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                      Denunciado por: {selectedItem.reportReason}
                    </p>
                    {selectedItem.reportedBy && (
                      <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                        Por: {selectedItem.reportedBy.fullName} (@{selectedItem.reportedBy.username})
                      </p>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-4 border-t border-neutral-200 dark:border-dark-border">
                  <Button variant="outline" onClick={() => setSelectedItem(null)}>
                    Fechar
                  </Button>
                  {selectedItem.status === 'PENDING' && (
                    <>
                      <Button
                        variant="outline"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={() => handleAction(selectedItem.id, 'approve')}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Aprovar
                      </Button>
                      <Button
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleAction(selectedItem.id, 'reject')}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Rejeitar
                      </Button>
                    </>
                  )}
                  <Button
                    variant="destructive"
                    onClick={() => handleAction(selectedItem.id, 'delete')}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Excluir
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
