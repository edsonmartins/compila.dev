'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Code,
  BookOpen,
  Briefcase,
  Users,
  Trophy,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/app/dashboard', icon: Home },
  { label: 'Desafios', href: '/app/desafios', icon: Code },
  { label: 'Trilhas', href: '/app/trilhas', icon: BookOpen },
  { label: 'Vagas', href: '/app/vagas', icon: Briefcase },
  { label: 'Feed', href: '/app/feed', icon: Users, badge: 3 },
  { label: 'Ranking', href: '/app/ranking', icon: Trophy },
];

const bottomNavItems: NavItem[] = [
  { label: 'Perfil', href: '/app/perfil', icon: User },
  { label: 'Configurações', href: '/app/configuracoes', icon: Settings },
];

interface AppSidebarProps {
  user?: {
    username: string;
    fullName: string;
    avatarUrl?: string;
    level: number;
    xp: number;
    streakCurrent: number;
  };
  children: React.ReactNode;
}

export function AppSidebar({ user, children }: AppSidebarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const mockUser = user || {
    username: 'joaosilva',
    fullName: 'João Silva',
    avatarUrl: 'https://i.pravatar.cc/150?img=11',
    level: 12,
    xp: 12450,
    streakCurrent: 7,
  };

  const levelProgress = (mockUser.xp % 1000) / 10;

  const isActive = (href: string) => {
    if (href === '/app/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen bg-neutral-50 dark:bg-dark-bg overflow-hidden">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 bg-white dark:bg-dark-card border-r border-neutral-200 dark:border-dark-border transition-all duration-300',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          isCollapsed ? 'w-20' : 'w-72'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-dark-border">
          {!isCollapsed && (
            <Link href="/app/dashboard" className="flex items-center gap-2">
              <div className="h-10 w-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                <Code className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-neutral-900 dark:text-dark-foreground">
                  Compila.dev
                </h1>
              </div>
            </Link>
          )}
          {isCollapsed && (
            <div className="h-10 w-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mx-auto">
              <Code className="h-6 w-6 text-white" />
            </div>
          )}

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden p-2 hover:bg-neutral-100 dark:hover:bg-dark-border rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Collapse Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:block p-2 hover:bg-neutral-100 dark:hover:bg-dark-border rounded-lg"
          >
            <Menu className={cn('h-5 w-5 transition-transform', isCollapsed && 'rotate-180')} />
          </button>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-neutral-200 dark:border-dark-border">
          <div className={cn('flex items-center gap-3', isCollapsed ? 'justify-center' : '')}>
            <Link href="/app/perfil">
              <Avatar className="h-10 w-10">
                <AvatarImage src={mockUser.avatarUrl} alt={mockUser.username} />
                <AvatarFallback className="bg-accent text-white">
                  {mockUser.fullName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
            </Link>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <Link href="/app/perfil" className="block">
                  <p className="font-semibold text-sm text-neutral-900 dark:text-dark-foreground truncate">
                    {mockUser.fullName}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-dark-muted">
                    @{mockUser.username}
                  </p>
                </Link>
                {/* XP Progress */}
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-neutral-600 dark:text-dark-muted">
                      Nível {mockUser.level}
                    </span>
                    <span className="text-accent font-medium">{mockUser.xp.toLocaleString()} XP</span>
                  </div>
                  <div className="h-1.5 bg-neutral-200 dark:bg-dark-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-accent to-primary rounded-full"
                      style={{ width: `${levelProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <div className="flex items-center gap-1 mt-3 text-xs text-neutral-600 dark:text-dark-muted">
              <Zap className="h-3 w-3 text-orange-500" />
              <span>{mockUser.streakCurrent} dias de streak</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                  isActive(item.href)
                    ? 'bg-accent/10 text-accent'
                    : 'text-neutral-700 dark:text-dark-foreground hover:bg-neutral-100 dark:hover:bg-dark-border',
                  isCollapsed && 'justify-center'
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto px-2 py-0.5 bg-accent text-white text-xs rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Navigation */}
        <div className="p-3 border-t border-neutral-200 dark:border-dark-border space-y-1">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                  isActive(item.href)
                    ? 'bg-accent/10 text-accent'
                    : 'text-neutral-700 dark:text-dark-foreground hover:bg-neutral-100 dark:hover:bg-dark-border',
                  isCollapsed && 'justify-center'
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span className="flex-1">{item.label}</span>}
              </Link>
            );
          })}

          {/* Logout */}
          <button
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors',
              isCollapsed && 'justify-center'
            )}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span className="flex-1 text-left">Sair</span>}
          </button>
        </div>

        {/* Theme Toggle */}
        {!isCollapsed && (
          <div className="p-4 border-t border-neutral-200 dark:border-dark-border">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-neutral-700 dark:text-dark-foreground hover:bg-neutral-100 dark:hover:bg-dark-border transition-colors"
            >
              {theme === 'dark' ? (
                <>
                  <span className="text-sm">Modo Claro</span>
                </>
              ) : (
                <>
                  <span className="text-sm">Modo Escuro</span>
                </>
              )}
            </button>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-dark-card border-b border-neutral-200 dark:border-dark-border">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-dark-border rounded-lg"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Code className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-neutral-900 dark:text-dark-foreground">
              Compila.dev
            </span>
          </div>
          <Link href="/app/perfil">
            <Avatar className="h-8 w-8">
              <AvatarImage src={mockUser.avatarUrl} alt={mockUser.username} />
              <AvatarFallback className="bg-accent text-white text-xs">
                {mockUser.fullName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
          </Link>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppSidebar;
