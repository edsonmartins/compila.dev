"use client";

import { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Github, Mail } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";

/**
 * Página de Cadastro
 */
export default function CadastroPage() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    agreeTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }
    if (!formData.username.trim()) {
      newErrors.username = "Nome de usuário é obrigatório";
    } else if (!/^[a-zA-Z0-9_-]{3,20}$/.test(formData.username)) {
      newErrors.username = "Use 3-20 caracteres (letras, números, _, -)";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }
    if (!formData.password) {
      newErrors.password = "Senha é obrigatória";
    } else if (formData.password.length < 8) {
      newErrors.password = "Mínimo de 8 caracteres";
    }
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "Você precisa aceitar os termos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    try {
      await register({
        email: formData.email,
        password: formData.password,
        fullName: formData.name,
        username: formData.username,
      });
    } catch (err) {
      setErrors({
        form: err instanceof Error ? err.message : "Erro ao criar conta. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignup = (provider: "github" | "google") => {
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
              href="/login"
              className="text-sm font-medium text-neutral-dark dark:text-dark-foreground hover:text-accent transition-colors"
            >
              Já tenho conta
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-dark-card rounded-2xl p-8 shadow-sm border border-neutral-light dark:border-dark-border">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-primary dark:text-dark-foreground mb-2">
                Crie sua conta
              </h1>
              <p className="text-neutral-dark dark:text-dark-muted text-sm">
                Comece a praticar código hoje
              </p>
            </div>

            {/* OAuth Buttons */}
            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleOAuthSignup("github")}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-neutral-light dark:border-dark-border rounded-lg hover:bg-neutral-light dark:hover:bg-dark-card-hover transition-colors"
              >
                <Github className="h-5 w-5" />
                <span className="text-sm font-medium text-neutral-dark dark:text-dark-foreground">
                  Continuar com GitHub
                </span>
              </button>
              <button
                onClick={() => handleOAuthSignup("google")}
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
              {errors.form && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.form}</p>
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-dark dark:text-dark-foreground mb-2">
                  Nome completo
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border bg-white dark:bg-dark-background text-neutral-dark dark:text-dark-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent ${
                    errors.name
                      ? "border-red-300 dark:border-red-700"
                      : "border-neutral-light dark:border-dark-border"
                  }`}
                  placeholder="Seu nome"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-neutral-dark dark:text-dark-foreground mb-2">
                  Nome de usuário
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-dark/50 dark:text-dark-muted/50">
                    @
                  </span>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    className={`w-full pl-8 pr-4 py-3 rounded-lg border bg-white dark:bg-dark-background text-neutral-dark dark:text-dark-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent ${
                      errors.username
                        ? "border-red-300 dark:border-red-700"
                        : "border-neutral-light dark:border-dark-border"
                    }`}
                    placeholder="username"
                  />
                </div>
                {errors.username && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.username}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-dark dark:text-dark-foreground mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border bg-white dark:bg-dark-background text-neutral-dark dark:text-dark-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent ${
                    errors.email
                      ? "border-red-300 dark:border-red-700"
                      : "border-neutral-light dark:border-dark-border"
                  }`}
                  placeholder="seu@email.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-neutral-dark dark:text-dark-foreground mb-2">
                  Senha
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border bg-white dark:bg-dark-background text-neutral-dark dark:text-dark-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent ${
                    errors.password
                      ? "border-red-300 dark:border-red-700"
                      : "border-neutral-light dark:border-dark-border"
                  }`}
                  placeholder="Mínimo 8 caracteres"
                />
                {errors.password && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>}
              </div>

              <div className="flex items-start gap-2">
                <input
                  id="agreeTerms"
                  name="agreeTerms"
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="mt-1 rounded border-neutral-light dark:border-dark-border"
                />
                <label htmlFor="agreeTerms" className="text-sm text-neutral-dark dark:text-dark-muted">
                  Eu concordo com os{" "}
                  <Link href="/termos" className="text-accent hover:underline">
                    Termos de Uso
                  </Link>{" "}
                  e{" "}
                  <Link href="/privacidade" className="text-accent hover:underline">
                    Política de Privacidade
                  </Link>
                </label>
              </div>
              {errors.agreeTerms && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.agreeTerms}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-accent text-white font-medium rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Criando conta..." : "Criar conta"}
              </button>
            </form>

            {/* Footer */}
            <p className="mt-6 text-center text-sm text-neutral-dark dark:text-dark-muted">
              Já tem uma conta?{" "}
              <Link href="/login" className="text-accent hover:underline font-medium">
                Fazer login
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
