'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  getCurrentUser,
  getToken,
  removeToken,
  type LoginRequest,
  type RegisterRequest,
  type UserResponse,
} from '@/lib/api';

interface AuthContextType {
  user: UserResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch {
        // Token is invalid, remove it
        removeToken();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading) {
      const publicRoutes = ['/login', '/cadastro', '/', '/esqueci-senha'];
      const isPublicRoute = publicRoutes.some((route) =>
        pathname === route || pathname.startsWith(route)
      );

      if (!user && !isPublicRoute && pathname.startsWith('/app')) {
        router.push('/login');
      }
    }
  }, [user, isLoading, pathname, router]);

  const login = async (data: LoginRequest) => {
    await apiLogin(data);
    // After login, get the user data
    const userData = await getCurrentUser();
    setUser(userData);
    router.push('/app/dashboard');
  };

  const register = async (data: RegisterRequest) => {
    await apiRegister(data);
    // After registration, get the user data
    const userData = await getCurrentUser();
    setUser(userData);
    router.push('/app/dashboard');
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
    router.push('/');
  };

  const refreshUser = async () => {
    const userData = await getCurrentUser();
    setUser(userData);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
