"use client";

import { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Github, Mail } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";

/**
 * Página de Login
 */
export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await login({ email, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Email ou senha incorretos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = (provider: "github" | "google") => {
    // Redirect to OAuth endpoint
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    window.location.href = `${baseUrl}/oauth2/authorization/${provider}?redirect_uri=${appUrl}/auth/callback`;
  };

  return (
    <div className="min-h-screen bg-neutral-light/30 dark:bg-dark-background flex flex-col">
      {/* Header */}
      <header className="border-b border-neutral-light dark:border-dark-border bg-white/95 dark:bg-dark-background/95 backdrop-blur">
        <div className="container-custom flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary dark:text-dark-foreground">
            compila.dev
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/cadastro"
              className="text-sm font-medium text-neutral-dark dark:text-dark-foreground hover:text-accent transition-colors"
            >
              Criar conta
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-dark-card rounded-2xl p-8 shadow-sm border border-neutral-light dark:border-dark-border">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-primary dark:text-dark-foreground mb-2">
                Entre na sua conta
              </h1>
              <p className="text-neutral-dark dark:text-dark-muted text-sm">
                Pratique código e evolua sua carreira
              </p>
            </div>

            {/* OAuth Buttons */}
            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleOAuthLogin("github")}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-neutral-light dark:border-dark-border rounded-lg hover:bg-neutral-light dark:hover:bg-dark-card-hover transition-colors"
              >
                <Github className="h-5 w-5" />
                <span className="text-sm font-medium text-neutral-dark dark:text-dark-foreground">
                  Continuar com GitHub
                </span>
              </button>
              <button
                onClick={() => handleOAuthLogin("google")}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-neutral-light dark:border-dark-border rounded-lg hover:bg-neutral-light dark:hover:bg-dark-card-hover transition-colors"
              >
                <Mail className="h-5 w-5" />
                <span className="text-sm font-medium text-neutral-dark dark:text-dark-foreground">
                  Continuar com Google
                </span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-light dark:border-dark-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-dark-card text-neutral-dark dark:text-dark-muted">
                  ou
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-dark dark:text-dark-foreground mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-neutral-light dark:border-dark-border bg-white dark:bg-dark-background text-neutral-dark dark:text-dark-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-neutral-dark dark:text-dark-foreground mb-2">
                  Senha
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-neutral-light dark:border-dark-border bg-white dark:bg-dark-background text-neutral-dark dark:text-dark-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-neutral-dark dark:text-dark-muted">
                  <input type="checkbox" className="rounded border-neutral-light dark:border-dark-border" />
                  Lembrar-me
                </label>
                <Link href="/esqueci-senha" className="text-accent hover:underline">
                  Esqueci minha senha
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-accent text-white font-medium rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </button>
            </form>

            {/* Footer */}
            <p className="mt-6 text-center text-sm text-neutral-dark dark:text-dark-muted">
              Não tem uma conta?{" "}
              <Link href="/cadastro" className="text-accent hover:underline font-medium">
                Criar conta
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
