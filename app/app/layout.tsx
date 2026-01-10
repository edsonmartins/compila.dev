'use client';

import { AppSidebar } from '@/components/app/layout/AppSidebar';
import { useAuth } from '@/components/providers/AuthProvider';

/**
 * Layout da área logada da aplicação
 */
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-dark-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
      </div>
    );
  }

  // If no user, the AuthProvider will redirect to login
  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-dark-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
      </div>
    );
  }

  const userData = {
    username: user.username,
    fullName: user.fullName,
    avatarUrl: user.avatarUrl,
    level: user.level,
    xp: Number(user.xp),
    streakCurrent: user.streakCurrent,
  };

  return <AppSidebar user={userData}>{children}</AppSidebar>;
}
