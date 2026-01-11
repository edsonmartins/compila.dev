'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Shield,
  UserPlus,
  Users,
  Loader2,
  RefreshCw,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AdminLayout } from '@/components/app/admin/AdminLayout';
import { UserTable, type User } from '@/components/app/admin/UserTable';
import { AddUserDialog } from '@/components/app/admin/AddUserDialog';
import { EditUserDialog } from '@/components/app/admin/EditUserDialog';
import { fetchApi } from '@/lib/api/client';
import { cn } from '@/lib/utils';

type RoleFilter = 'ALL' | 'USER' | 'ADMIN' | 'MODERATOR';
type StatusFilter = 'ALL' | 'ENABLED' | 'DISABLED';
type SubscriptionFilter = 'ALL' | 'FREE' | 'PRO' | 'PRO_PLUS';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('ALL');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [subscriptionFilter, setSubscriptionFilter] = useState<SubscriptionFilter>('ALL');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Advanced filters state
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      if (!refreshing) setLoading(true);
      const response = await fetchApi<{ content: User[] }>('/admin/users');
      setUsers(response.content || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      // Mock data for development
      setUsers([
        {
          id: '1',
          username: 'joaosilva',
          fullName: 'João Silva',
          email: 'joao@compila.dev',
          role: 'USER',
          enabled: true,
          emailVerified: true,
          level: 12,
          xp: 12450,
          streakCurrent: 7,
          subscription: 'PRO',
          createdAt: '2024-01-15T10:30:00',
          lastLoginAt: '2025-01-10T09:15:00',
          challengesCompleted: 15,
        },
        {
          id: '2',
          username: 'mariasantos',
          fullName: 'Maria Santos',
          email: 'maria@compila.dev',
          role: 'USER',
          enabled: true,
          emailVerified: true,
          level: 8,
          xp: 8200,
          streakCurrent: 3,
          subscription: 'FREE',
          createdAt: '2024-02-20T14:00:00',
          lastLoginAt: '2025-01-09T16:45:00',
          challengesCompleted: 8,
        },
        {
          id: '3',
          username: 'pedrocosta',
          fullName: 'Pedro Costa',
          email: 'pedro@compila.dev',
          role: 'MODERATOR',
          enabled: false,
          emailVerified: false,
          level: 3,
          xp: 2100,
          streakCurrent: 0,
          subscription: 'FREE',
          createdAt: '2024-06-10T08:30:00',
          challengesCompleted: 2,
        },
        {
          id: '4',
          username: 'admin',
          fullName: 'Administrador',
          email: 'admin@compila.dev',
          role: 'ADMIN',
          enabled: true,
          emailVerified: true,
          level: 50,
          xp: 50000,
          streakCurrent: 100,
          subscription: 'PRO_PLUS',
          createdAt: '2023-12-01T00:00:00',
          lastLoginAt: '2025-01-11T10:00:00',
          challengesCompleted: 50,
        },
        {
          id: '5',
          username: 'anabeatriz',
          fullName: 'Ana Beatriz',
          email: 'ana@compila.dev',
          role: 'USER',
          enabled: true,
          emailVerified: true,
          level: 15,
          xp: 15600,
          streakCurrent: 12,
          subscription: 'PRO',
          createdAt: '2024-01-05T11:00:00',
          lastLoginAt: '2025-01-11T08:30:00',
          challengesCompleted: 22,
        },
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        search === '' ||
        user.fullName.toLowerCase().includes(search.toLowerCase()) ||
        user.username.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());

      const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'ENABLED' && user.enabled) ||
        (statusFilter === 'DISABLED' && !user.enabled);
      const matchesSubscription = subscriptionFilter === 'ALL' || user.subscription === subscriptionFilter;

      return matchesSearch && matchesRole && matchesStatus && matchesSubscription;
    });
  }, [users, search, roleFilter, statusFilter, subscriptionFilter]);

  const stats = useMemo(() => {
    return {
      total: users.length,
      active: users.filter((u) => u.enabled).length,
      admins: users.filter((u) => u.role === 'ADMIN').length,
      moderators: users.filter((u) => u.role === 'MODERATOR').length,
      pro: users.filter((u) => u.subscription === 'PRO' || u.subscription === 'PRO_PLUS').length,
      filtered: filteredUsers.length,
    };
  }, [users, filteredUsers]);

  const toggleUserSelection = (userId: string) => {
    const newSelection = new Set(selectedUsers);
    if (newSelection.has(userId)) {
      newSelection.delete(userId);
    } else {
      newSelection.add(userId);
    }
    setSelectedUsers(newSelection);
  };

  const toggleAllUsers = () => {
    if (selectedUsers.size === filteredUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(filteredUsers.map((u) => u.id)));
    }
  };

  const handleToggleStatus = async (userId: string, enabled: boolean) => {
    try {
      await fetchApi(`/admin/users/${userId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ enabled: !enabled }),
      });
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, enabled: !enabled } : u)));
    } catch (error) {
      console.error('Failed to toggle user status:', error);
    }
  };

  const handleToggleRole = async (userId: string, role: string) => {
    try {
      const newRole = role === 'ADMIN' ? 'USER' : 'ADMIN';
      await fetchApi(`/admin/users/${userId}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role: newRole }),
      });
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    } catch (error) {
      console.error('Failed to toggle user role:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.')) return;
    try {
      await fetchApi(`/admin/users/${userId}`, { method: 'DELETE' });
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setSelectedUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setEditDialogOpen(true);
  };

  const handleCreateUser = async (data: {
    username: string;
    fullName: string;
    email: string;
    password: string;
    role: 'USER' | 'ADMIN' | 'MODERATOR';
  }) => {
    await fetchApi('/admin/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    await fetchUsers();
  };

  const handleUpdateUser = async (id: string, data: Partial<User>) => {
    await fetchApi(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...data } : u)));
  };

  // Loading skeleton
  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          {/* Header skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <div className="h-8 w-48 bg-neutral-200 dark:bg-neutral-700 rounded-lg animate-pulse" />
              <div className="h-4 w-32 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
            </div>
            <div className="h-10 w-40 bg-neutral-200 dark:bg-neutral-700 rounded-lg animate-pulse" />
          </div>

          {/* Stats skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-neutral-200 dark:bg-neutral-700 rounded-xl animate-pulse" />
            ))}
          </div>

          {/* Table skeleton */}
          <div className="h-96 bg-neutral-200 dark:bg-neutral-700 rounded-xl animate-pulse" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center shadow-lg shadow-accent/20">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  Gerenciar Usuários
                </h1>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {stats.filtered} de {stats.total} usuários cadastrados
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setRefreshing(true);
                fetchUsers();
              }}
              disabled={refreshing}
              className="shrink-0"
            >
              <RefreshCw className={cn('w-4 h-4', refreshing && 'animate-spin')} />
            </Button>
            <Button
              onClick={() => setAddDialogOpen(true)}
              className="gap-2 bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20"
            >
              <UserPlus className="w-4 h-4" />
              Adicionar Usuário
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total" value={stats.total} icon={Users} color="neutral" />
          <StatCard label="Ativos" value={stats.active} icon={Shield} color="green" />
          <StatCard label="Admins" value={stats.admins} icon={Shield} color="purple" />
          <StatCard label="Pro" value={stats.pro} icon={Shield} color="cyan" />
        </div>

        {/* Filters Section */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-700 p-4">
          {/* Search and basic filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                placeholder="Buscar por nome, usuário ou email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-10"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  ×
                </button>
              )}
            </div>

            {/* Role Filter */}
            <Select value={roleFilter} onValueChange={(v: RoleFilter) => setRoleFilter(v)}>
              <SelectTrigger className="w-full lg:w-[160px] h-10">
                <SelectValue placeholder="Função" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todas Funções</SelectItem>
                <SelectItem value="USER">Usuários</SelectItem>
                <SelectItem value="MODERATOR">Moderadores</SelectItem>
                <SelectItem value="ADMIN">Administradores</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={(v: StatusFilter) => setStatusFilter(v)}>
              <SelectTrigger className="w-full lg:w-[140px] h-10">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos Status</SelectItem>
                <SelectItem value="ENABLED">Ativos</SelectItem>
                <SelectItem value="DISABLED">Inativos</SelectItem>
              </SelectContent>
            </Select>

            {/* Advanced Filters Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={cn(
                'gap-2 h-10',
                showAdvancedFilters && 'bg-neutral-100 dark:bg-neutral-800'
              )}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Mais filtros
              <ChevronDown
                className={cn('w-4 h-4 transition-transform', showAdvancedFilters && 'rotate-180')}
              />
            </Button>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="pt-4 mt-4 border-t border-neutral-200 dark:border-neutral-700 animate-fadeIn">
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">Plano:</span>
                  <div className="flex gap-1">
                    <FilterChip
                      active={subscriptionFilter === 'ALL'}
                      onClick={() => setSubscriptionFilter('ALL')}
                      label="Todos"
                    />
                    <FilterChip
                      active={subscriptionFilter === 'FREE'}
                      onClick={() => setSubscriptionFilter('FREE')}
                      label="Grátis"
                    />
                    <FilterChip
                      active={subscriptionFilter === 'PRO'}
                      onClick={() => setSubscriptionFilter('PRO')}
                      label="Pro"
                    />
                    <FilterChip
                      active={subscriptionFilter === 'PRO_PLUS'}
                      onClick={() => setSubscriptionFilter('PRO_PLUS')}
                      label="Pro+"
                    />
                  </div>
                </div>

                {/* Clear filters button */}
                {(roleFilter !== 'ALL' || statusFilter !== 'ALL' || subscriptionFilter !== 'ALL' || search) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setRoleFilter('ALL');
                      setStatusFilter('ALL');
                      setSubscriptionFilter('ALL');
                      setSearch('');
                    }}
                    className="ml-auto text-neutral-500 hover:text-red-600"
                  >
                    Limpar filtros
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bulk Actions */}
        {selectedUsers.size > 0 && (
          <div className="bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20 rounded-xl p-4 flex items-center justify-between animate-slideDown">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium text-accent">
                {selectedUsers.size} usuário{selectedUsers.size !== 1 ? 's' : ''} selecionado
                {selectedUsers.size !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Shield className="w-3 h-3" />
                Tornar Admin
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="w-3 h-3" />
                Suspender
              </Button>
              <Button variant="destructive" size="sm" className="gap-1">
                Excluir {selectedUsers.size > 1 && `(${selectedUsers.size})`}
              </Button>
            </div>
          </div>
        )}

        {/* Users Table */}
        <UserTable
          users={filteredUsers}
          selectedUsers={selectedUsers}
          onToggleSelection={toggleUserSelection}
          onToggleAll={toggleAllUsers}
          onToggleStatus={handleToggleStatus}
          onToggleRole={handleToggleRole}
          onDeleteUser={handleDeleteUser}
          onEditUser={handleEditUser}
        />

        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <div className="flex items-center justify-between px-2">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Mostrando <span className="font-medium">{filteredUsers.length}</span> de{' '}
              <span className="font-medium">{users.length}</span> usuários
            </p>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled>
                Anterior
              </Button>
              <Button variant="outline" size="sm" disabled>
                Próximo
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <AddUserDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} onSubmit={handleCreateUser} />
      <EditUserDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        user={editingUser}
        onSubmit={handleUpdateUser}
      />

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </AdminLayout>
  );
}

// Stat Card Component
function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: 'neutral' | 'green' | 'purple' | 'cyan';
}) {
  const colorStyles = {
    neutral: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    cyan: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400',
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-700 p-4 hover:shadow-lg hover:shadow-neutral-200/50 dark:hover:shadow-black/20 transition-all">
      <div className="flex items-center gap-3">
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', colorStyles[color])}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{value}</p>
          <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}

// Filter Chip Component
function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-3 py-1 rounded-full text-xs font-medium transition-all',
        active
          ? 'bg-accent text-white shadow-md shadow-accent/20'
          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
      )}
    >
      {label}
    </button>
  );
}
