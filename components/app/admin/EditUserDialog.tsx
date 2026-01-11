'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  User,
  Mail,
  Shield,
  ShieldAlert,
  Crown,
  Loader2,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { User } from './UserTable';

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onSubmit: (id: string, data: Partial<User>) => Promise<void>;
}

export function EditUserDialog({ open, onOpenChange, user, onSubmit }: EditUserDialogProps) {
  const [formData, setFormData] = useState<Partial<User>>({
    fullName: '',
    email: '',
    role: 'USER',
    enabled: true,
    emailVerified: false,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof User, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        enabled: user.enabled,
        emailVerified: user.emailVerified,
      });
      setErrors({});
    }
  }, [user, open]);

  const validateForm = () => {
    const newErrors: Partial<Record<keyof User, string>> = {};

    if (!formData.fullName?.trim()) {
      newErrors.fullName = 'Nome completo é obrigatório';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(user.id, formData);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const roles: Array<{ value: User['role']; label: string; icon: typeof Shield; color: string }> = [
    { value: 'USER', label: 'Usuário', icon: Crown, color: 'bg-blue-500' },
    { value: 'MODERATOR', label: 'Moderador', icon: ShieldAlert, color: 'bg-amber-500' },
    { value: 'ADMIN', label: 'Administrador', icon: Shield, color: 'bg-purple-500' },
  ];

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        {/* Header with user preview */}
        <div className="px-6 pt-6 pb-4 bg-gradient-to-br from-accent/10 via-accent/5 to-transparent border-b border-neutral-100 dark:border-neutral-800">
          <DialogHeader className="text-left">
            <div className="flex items-center gap-4 mb-2">
              <Avatar className="h-14 w-14 ring-2 ring-white shadow-lg">
                <AvatarImage src={user.avatarUrl} alt={user.username} />
                <AvatarFallback className="bg-gradient-to-br from-accent to-accent/70 text-white text-lg font-semibold">
                  {getInitials(user.fullName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <DialogTitle className="text-xl">Editar Usuário</DialogTitle>
                <DialogDescription className="text-sm mt-0.5">
                  @{user.username} • ID: {user.id.slice(0, 8)}...
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <Label
                htmlFor="edit-fullName"
                className={cn('text-sm font-medium', errors.fullName && 'text-red-600 dark:text-red-400')}
              >
                Nome completo
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  id="edit-fullName"
                  placeholder="ex: João Silva"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className={cn(
                    'pl-10 h-10 transition-colors',
                    errors.fullName && 'border-red-300 focus-visible:ring-red-500 dark:border-red-700'
                  )}
                />
              </div>
              {errors.fullName && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label
                htmlFor="edit-email"
                className={cn('text-sm font-medium', errors.email && 'text-red-600 dark:text-red-400')}
              >
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  id="edit-email"
                  type="email"
                  placeholder="ex: joao@compila.dev"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={cn(
                    'pl-10 h-10 transition-colors',
                    errors.email && 'border-red-300 focus-visible:ring-red-500 dark:border-red-700'
                  )}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Função</Label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map((role) => {
                  const Icon = role.icon;
                  return (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, role: role.value })}
                      className={cn(
                        'relative flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all',
                        formData.role === role.value
                          ? 'border-accent bg-accent/5'
                          : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
                      )}
                    >
                      <div
                        className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center',
                          role.color,
                          formData.role === role.value ? 'ring-2 ring-offset-2 ring-accent' : ''
                        )}
                      >
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                        {role.label}
                      </span>
                      {formData.role === role.value && (
                        <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-accent flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Status Toggles */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center',
                      formData.enabled ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
                    )}
                  >
                    {formData.enabled ? (
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      Status da conta
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {formData.enabled ? 'Ativo - Pode acessar a plataforma' : 'Inativo - Acesso bloqueado'}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={formData.enabled}
                  onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
                  className="data-[state=checked]:bg-green-600"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center',
                      formData.emailVerified
                        ? 'bg-green-100 dark:bg-green-900/30'
                        : 'bg-amber-100 dark:bg-amber-900/30'
                    )}
                  >
                    <Mail
                      className={cn(
                        'w-4 h-4',
                        formData.emailVerified
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-amber-600 dark:text-amber-400'
                      )}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      Email verificado
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {formData.emailVerified ? 'Confirmado pelo usuário' : 'Aguardando confirmação'}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={formData.emailVerified}
                  onCheckedChange={(checked) => setFormData({ ...formData, emailVerified: checked })}
                  className="data-[state=checked]:bg-green-600"
                />
              </div>
            </div>

            {/* User Stats - Read only */}
            <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700">
              <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2">
                Progresso do usuário
              </p>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
                  <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{user.level}</p>
                  <p className="text-[10px] uppercase tracking-wide text-neutral-500">Nível</p>
                </div>
                <div className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
                  <p className="text-lg font-bold text-accent">{user.xp.toLocaleString()}</p>
                  <p className="text-[10px] uppercase tracking-wide text-neutral-500">XP</p>
                </div>
                <div className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
                  <p className="text-lg font-bold text-orange-500">{user.streakCurrent}</p>
                  <p className="text-[10px] uppercase tracking-wide text-neutral-500">Streak</p>
                </div>
                <div className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
                  <p className="text-lg font-bold text-yellow-600">{user.challengesCompleted || 0}</p>
                  <p className="text-[10px] uppercase tracking-wide text-neutral-500">Desafios</p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="px-6 py-4 bg-neutral-50 dark:bg-neutral-800/50 border-t border-neutral-200 dark:border-neutral-700 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 sm:flex-none bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
