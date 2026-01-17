'use client';

import React, { useState } from 'react';
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
import { UserPlus, Mail, User, Shield, KeyRound, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface CreateUserFormData {
  username: string;
  fullName: string;
  email: string;
  password: string;
  role: 'USER' | 'ADMIN' | 'MODERATOR';
}

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateUserFormData) => Promise<void>;
}

export function AddUserDialog({ open, onOpenChange, onSubmit }: AddUserDialogProps) {
  const [formData, setFormData] = useState<CreateUserFormData>({
    username: '',
    fullName: '',
    email: '',
    password: '',
    role: 'USER',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CreateUserFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Partial<Record<keyof CreateUserFormData, string>> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Nome de usuário é obrigatório';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Mínimo de 3 caracteres';
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Nome completo é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else {
      const passwordErrors: string[] = [];
      if (formData.password.length < 8) {
        passwordErrors.push('Mínimo de 8 caracteres');
      }
      if (!/[A-Z]/.test(formData.password)) {
        passwordErrors.push('Uma letra maiúscula');
      }
      if (!/[a-z]/.test(formData.password)) {
        passwordErrors.push('Uma letra minúscula');
      }
      if (!/[0-9]/.test(formData.password)) {
        passwordErrors.push('Um número');
      }
      if (passwordErrors.length > 0) {
        newErrors.password = passwordErrors.join(', ');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      toast.success('Usuário criado com sucesso!');
      handleClose();
    } catch (error) {
      console.error('Failed to create user:', error);
      const errorMessage = error instanceof Error ? error.message : 'Não foi possível criar o usuário';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      username: '',
      fullName: '',
      email: '',
      password: '',
      role: 'USER',
    });
    setErrors({});
    onOpenChange(false);
  };

  const roles: Array<{ value: CreateUserFormData['role']; label: string; color: string }> = [
    { value: 'USER', label: 'Usuário', color: 'bg-blue-500' },
    { value: 'MODERATOR', label: 'Moderador', color: 'bg-amber-500' },
    { value: 'ADMIN', label: 'Administrador', color: 'bg-purple-500' },
  ];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden">
        {/* Header with gradient */}
        <div className="px-6 pt-6 pb-4 bg-gradient-to-br from-accent/10 via-accent/5 to-transparent border-b border-neutral-100 dark:border-neutral-800">
          <DialogHeader className="text-left">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shadow-lg shadow-accent/20">
                <UserPlus className="w-5 h-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl">Adicionar Usuário</DialogTitle>
                <DialogDescription className="text-sm mt-1">
                  Crie uma nova conta de usuário na plataforma
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-4">
            {/* Username */}
            <div className="space-y-1.5">
              <Label
                htmlFor="username"
                className={cn('text-sm font-medium', errors.username && 'text-red-600 dark:text-red-400')}
              >
                Nome de usuário
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  id="username"
                  placeholder="ex: joaosilva"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className={cn(
                    'pl-10 h-10 transition-colors',
                    errors.username && 'border-red-300 focus-visible:ring-red-500 dark:border-red-700'
                  )}
                  autoComplete="off"
                />
              </div>
              {errors.username && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.username}</p>
              )}
            </div>

            {/* Full Name */}
            <div className="space-y-1.5">
              <Label
                htmlFor="fullName"
                className={cn('text-sm font-medium', errors.fullName && 'text-red-600 dark:text-red-400')}
              >
                Nome completo
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  id="fullName"
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
                htmlFor="email"
                className={cn('text-sm font-medium', errors.email && 'text-red-600 dark:text-red-400')}
              >
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="ex: joao@compila.dev"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={cn(
                    'pl-10 h-10 transition-colors',
                    errors.email && 'border-red-300 focus-visible:ring-red-500 dark:border-red-700'
                  )}
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label
                htmlFor="password"
                className={cn('text-sm font-medium', errors.password && 'text-red-600 dark:text-red-400')}
              >
                Senha provisória
              </Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={cn(
                    'pl-10 h-10 transition-colors',
                    errors.password && 'border-red-300 focus-visible:ring-red-500 dark:border-red-700'
                  )}
                  autoComplete="new-password"
                />
              </div>
              {errors.password && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.password}</p>
              )}
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Requisitos: 8+ caracteres, maiúscula, minúscula e número. O usuário deverá alterar no primeiro acesso.
              </p>
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Função</Label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map((role) => (
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
                      <Shield className="w-4 h-4 text-white" />
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
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="px-6 py-4 bg-neutral-50 dark:bg-neutral-800/50 border-t border-neutral-200 dark:border-neutral-700 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
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
                  Criando...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Criar Usuário
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
