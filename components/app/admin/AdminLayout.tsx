'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Shield,
  Users,
  Trophy,
  MessageSquare,
  BarChart3,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export interface AdminTab {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const adminTabs: AdminTab[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/app/admin', icon: BarChart3 },
  { id: 'users', label: 'Usuários', href: '/app/admin/users', icon: Users },
  { id: 'challenges', label: 'Desafios', href: '/app/admin/challenges', icon: Trophy },
  { id: 'moderation', label: 'Moderação', href: '/app/admin/moderation', icon: MessageSquare },
  { id: 'settings', label: 'Configurações', href: '/app/admin/settings', icon: Settings },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/app/admin') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-dark-background">
      {/* Header */}
      <header className="bg-white dark:bg-dark-card border-b border-neutral-200 dark:border-dark-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/app/dashboard" className="text-neutral-600 dark:text-dark-muted hover:text-accent">
                ← Voltar
              </Link>
              <div className="h-6 w-px bg-neutral-300 dark:bg-dark-border" />
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-accent" />
                <h1 className="text-xl font-bold text-neutral-900 dark:text-dark-foreground">
                  Administração
                </h1>
              </div>
            </div>

            {/* Admin badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 rounded-full">
              <Shield className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-accent">Administrador</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex gap-1 mt-4 overflow-x-auto">
            {adminTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
                    isActive(tab.href)
                      ? 'bg-accent/10 text-accent'
                      : 'text-neutral-600 dark:text-dark-muted hover:bg-neutral-100 dark:hover:bg-dark-border'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
