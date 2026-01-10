"use client";

import Link from "next/link";
import Image from "next/image";
import { Github, Linkedin, MessageSquare, Twitter, Youtube } from "lucide-react";
import { footerLinks, socialLinks } from "@/lib/data";
import { useTheme } from "@/components/providers/ThemeProvider";

/**
 * Footer com 4 colunas: Produto, Empresa, Recursos, Legal
 */
export function Footer() {
  const { resolvedTheme } = useTheme();

  return (
    <footer className="bg-neutral-light dark:bg-dark-card border-t border-neutral-light dark:border-dark-border">
      <Container>
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            {/* Logo e descrição */}
            <div className="col-span-2">
              <Link href="/" className="flex items-center mb-4">
                <Image
                  src={
                    resolvedTheme === "dark"
                      ? "/images/compila-dev_branco.png"
                      : "/images/compila-dev.png"
                  }
                  alt="Compila.dev - Compile conhecimento, execute sua carreira"
                  width={180}
                  height={45}
                  className="h-16 w-auto"
                />
              </Link>
              <p className="text-sm text-neutral-dark dark:text-dark-muted mb-4 max-w-xs">
                Compile conhecimento. Execute melhor.
              </p>
              {/* Redes sociais */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <SocialIcon key={social.name} {...social} />
                ))}
              </div>
            </div>

            {/* Produto */}
            <div>
              <h4 className="font-semibold text-primary dark:text-dark-foreground mb-4">Produto</h4>
              <ul className="space-y-3">
                {footerLinks.produto.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-dark dark:text-dark-muted hover:text-accent transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Empresa */}
            <div>
              <h4 className="font-semibold text-primary dark:text-dark-foreground mb-4">Empresa</h4>
              <ul className="space-y-3">
                {footerLinks.empresa.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-dark dark:text-dark-muted hover:text-accent transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recursos */}
            <div>
              <h4 className="font-semibold text-primary dark:text-dark-foreground mb-4">Recursos</h4>
              <ul className="space-y-3">
                {footerLinks.recursos.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-dark dark:text-dark-muted hover:text-accent transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Legal e copyright */}
          <div className="pt-8 border-t border-neutral-light/50 dark:border-dark-border flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <ul className="flex space-x-6">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-dark dark:text-dark-muted hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="text-sm text-neutral-dark dark:text-dark-muted">
              © 2025 Compila.dev — Compile conhecimento, execute sua carreira
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}

function Container({ children }: { children: React.ReactNode }) {
  return <div className="container-custom">{children}</div>;
}

function SocialIcon({ name, href, icon }: { name: string; href: string; icon: string }) {
  const IconComponent = {
    linkedin: Linkedin,
    twitter: Twitter,
    "message-square": MessageSquare,
    youtube: Youtube,
    github: Github,
  }[icon];

  if (!IconComponent) return null;

  return (
    <Link
      href={href}
      aria-label={name}
      className="text-neutral-dark dark:text-dark-muted hover:text-accent transition-colors"
    >
      <IconComponent className="h-5 w-5" />
    </Link>
  );
}
