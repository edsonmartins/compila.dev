'use client';

import React, { useState } from 'react';
import {
  CheckCircle,
  XCircle,
  Shield,
  ShieldAlert,
  Crown,
  Zap,
  Trophy,
  Mail,
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  role: 'USER' | 'ADMIN' | 'MODERATOR';
  enabled: boolean;
  emailVerified: boolean;
  level: number;
  xp: number;
  streakCurrent: number;
  subscription: 'FREE' | 'PRO' | 'PRO_PLUS';
  createdAt: string;
  lastLoginAt?: string;
  challengesCompleted?: number;
}

interface UserTableProps {
  users: User[];
  selectedUsers: Set<string>;
  onToggleSelection: (userId: string) => void;
  onToggleAll: () => void;
  onToggleStatus: (userId: string, enabled: boolean) => void;
  onToggleRole: (userId: string, role: string) => void;
  onDeleteUser: (userId: string) => void;
  onEditUser?: (user: User) => void;
}

export function UserTable({
  users,
  selectedUsers,
  onToggleSelection,
  onToggleAll,
  onToggleStatus,
  onToggleRole,
  onDeleteUser,
  onEditUser,
}: UserTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

  const toggleRowExpanded = (userId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId);
    } else {
      newExpanded.add(userId);
    }
    setExpandedRows(newExpanded);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleConfig = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return {
          icon: Shield,
          label: 'Admin',
          className: 'text-purple-700 bg-purple-50 border-purple-200 dark:bg-purple-950/30 dark:border-purple-800 dark:text-purple-400',
        };
      case 'MODERATOR':
        return {
          icon: ShieldAlert,
          label: 'Moderador',
          className: 'text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-400',
        };
      default:
        return {
          icon: Crown,
          label: 'Usuário',
          className: 'text-blue-700 bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-400',
        };
    }
  };

  const getSubscriptionConfig = (subscription: string) => {
    switch (subscription) {
      case 'PRO_PLUS':
        return {
          label: 'Pro+',
          className: 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0',
        };
      case 'PRO':
        return {
          label: 'Pro',
          className: 'bg-cyan-600 text-white border-0',
        };
      default:
        return {
          label: 'Grátis',
          className: 'text-neutral-600 bg-neutral-100 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700',
        };
    }
  };

  const allSelected = users.length > 0 && selectedUsers.size === users.length;
  const someSelected = selectedUsers.size > 0 && !allSelected;

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="w-20 h-20 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
          <UserIcon className="w-10 h-10 text-neutral-400" />
        </div>
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
          Nenhum usuário encontrado
        </h3>
        <p className="text-neutral-500 dark:text-neutral-400 text-center max-w-sm">
          Tente ajustar os filtros ou adicione um novo usuário para começar.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden bg-white dark:bg-neutral-900">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-3 px-5 py-3 bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-700 text-xs font-semibold tracking-wide text-neutral-500 dark:text-neutral-400 uppercase">
        <div className="col-span-1 flex items-center">
          <input
            type="checkbox"
            checked={allSelected}
            ref={someSelected ? (input) => input && (input.indeterminate = true) : null}
            onChange={onToggleAll}
            className="w-4 h-4 rounded border-neutral-300 text-accent focus:ring-accent focus:ring-offset-0"
          />
        </div>
        <div className="col-span-4 md:col-span-3">Usuário</div>
        <div className="col-span-2 hidden md:block">Função</div>
        <div className="col-span-2 hidden sm:block">Plano</div>
        <div className="col-span-2 hidden lg:block">Progresso</div>
        <div className="col-span-3 md:col-span-2 text-right">Ações</div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
        {users.map((user, index) => {
          const RoleIcon = getRoleConfig(user.role).icon;
          const subscriptionConfig = getSubscriptionConfig(user.subscription);
          const isSelected = selectedUsers.has(user.id);
          const isExpanded = expandedRows.has(user.id);

          return (
            <div
              key={user.id}
              className={cn(
                'group relative transition-all duration-200',
                isSelected && 'bg-accent/5 dark:bg-accent/10',
                !user.enabled && 'opacity-50'
              )}
              style={{ animation: `slideIn 0.3s ease-out ${index * 0.05}s both` }}
            >
              {/* Main Row */}
              <div
                className={cn(
                  'grid grid-cols-12 gap-3 px-5 py-4 items-center hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors cursor-pointer',
                  isExpanded && 'bg-neutral-50 dark:bg-neutral-800/30'
                )}
                onClick={() => toggleRowExpanded(user.id)}
              >
                {/* Checkbox */}
                <div className="col-span-1" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelection(user.id)}
                    className="w-4 h-4 rounded border-neutral-300 text-accent focus:ring-accent focus:ring-offset-0"
                  />
                </div>

                {/* User Info */}
                <div className="col-span-4 md:col-span-3 flex items-center gap-3">
                  <Avatar className="h-11 w-11 ring-2 ring-transparent group-hover:ring-accent/20 transition-all">
                    <AvatarImage src={user.avatarUrl} alt={user.username} />
                    <AvatarFallback className="bg-gradient-to-br from-accent to-accent/70 text-white text-sm font-semibold">
                      {getInitials(user.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-neutral-900 dark:text-neutral-100 truncate">
                        {user.fullName}
                      </p>
                      {!user.emailVerified && (
                        <span className="flex-shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                          Pending
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate">@{user.username}</p>
                  </div>
                </div>

                {/* Role */}
                <div className="col-span-2 hidden md:flex items-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleRole(user.id, user.role);
                    }}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all hover:scale-105 active:scale-95',
                      getRoleConfig(user.role).className
                    )}
                  >
                    <RoleIcon className="w-3.5 h-3.5" />
                    {getRoleConfig(user.role).label}
                  </button>
                </div>

                {/* Subscription */}
                <div className="col-span-2 hidden sm:flex items-center">
                  <span
                    className={cn(
                      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border',
                      subscriptionConfig.className
                    )}
                  >
                    {subscriptionConfig.label}
                  </span>
                </div>

                {/* Progress - Desktop */}
                <div className="col-span-2 hidden lg:flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-sm">
                    <Trophy className="w-3.5 h-3.5 text-yellow-500" />
                    <span className="font-medium text-neutral-700 dark:text-neutral-300">
                      N{user.level}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400">
                    <Zap className="w-3.5 h-3.5 text-orange-500" />
                    <span>{user.xp.toLocaleString()}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="col-span-3 md:col-span-2 flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-neutral-400 hover:text-accent hover:bg-accent/10"
                    onClick={() => onEditUser?.(user)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      'h-8 w-8 transition-colors',
                      user.enabled
                        ? 'text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30'
                        : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                    )}
                    onClick={() => onToggleStatus(user.id, user.enabled)}
                  >
                    {user.enabled ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                    onClick={() => onDeleteUser(user.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-5 pb-4 pl-16 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm animate-expand">
                  <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                    <Calendar className="w-4 h-4" />
                    <span>Cadastrado em {formatDate(user.createdAt)}</span>
                  </div>
                  {user.lastLoginAt && (
                    <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                      <Eye className="w-4 h-4" />
                      <span>Último acesso: {formatDate(user.lastLoginAt)}</span>
                    </div>
                  )}
                  {/* Mobile progress info */}
                  <div className="flex md:hidden items-center gap-4 text-neutral-600 dark:text-neutral-400">
                    <span className="flex items-center gap-1">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      N{user.level}
                    </span>
                    <span className="flex items-center gap-1">
                      <Zap className="w-4 h-4 text-orange-500" />
                      {user.xp.toLocaleString()} XP
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes expand {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 100px;
          }
        }
        .animate-expand {
          animation: expand 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
