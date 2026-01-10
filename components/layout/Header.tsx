"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/components/providers/ThemeProvider";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

/**
 * Header com logo, navegação e toggle de tema
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-neutral-light dark:border-dark-border bg-white/95 dark:bg-dark-background/95 backdrop-blur shadow-sm"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="container-custom">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src={
                resolvedTheme === "dark"
                  ? "/images/compila-dev_branco.png"
                  : "/images/compila-dev.png"
              }
              alt="Compila.dev - Compile conhecimento, execute sua carreira"
              width={240}
              height={60}
              priority
              className="h-16 w-auto"
            />
          </Link>

          {/* Navegação desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/desafios"
              className="text-sm font-medium text-neutral-dark dark:text-dark-foreground hover:text-accent transition-colors"
            >
              Desafios
            </Link>
            <Link
              href="/como-funciona"
              className="text-sm font-medium text-neutral-dark dark:text-dark-foreground hover:text-accent transition-colors"
            >
              Como Funciona
            </Link>
            <Link
              href="/comunidade"
              className="text-sm font-medium text-neutral-dark dark:text-dark-foreground hover:text-accent transition-colors"
            >
              Comunidade
            </Link>
          </nav>

          {/* Botões */}
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <Link
              href="/login"
              className="hidden sm:block text-sm font-medium text-neutral-dark dark:text-dark-foreground hover:text-accent transition-colors"
            >
              Login
            </Link>
            <Link
              href="/cadastro"
              className="inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-accent text-white hover:bg-accent-hover h-9 px-4 text-sm"
            >
              Cadastro
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
