"use client";

import Link from "next/link";
import Image from "next/image";
import { Github, Linkedin, MessageSquare, Youtube, Twitter, Cpu, Wifi, Battery } from "lucide-react";
import { footerLinks, socialLinks } from "@/lib/data";
import { useTheme } from "@/components/providers/ThemeProvider";

/**
 * Footer com estilo status bar do terminal
 */
export function Footer() {
  const { resolvedTheme } = useTheme();

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      {/* Status Bar Style Header */}
      <div className="bg-gray-950 border-b border-gray-800">
        <div className="container-custom">
          <div className="flex items-center justify-between py-2 px-4 text-xs font-mono">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-terminal-green">
                <div className="w-2 h-2 rounded-full bg-terminal-green animate-pulse" />
                <span>ONLINE</span>
              </div>
              <div className="flex items-center gap-1 text-terminal-gray">
                <Cpu className="h-3 w-3" />
                <span>12%</span>
              </div>
              <div className="flex items-center gap-1 text-terminal-gray">
                <Wifi className="h-3 w-3" />
                <span>connected</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-terminal-cyan">
              <Battery className="h-3 w-3" />
              <span>100%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom">
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
              <p className="text-sm text-terminal-gray mb-4 max-w-xs font-mono">
                <span className="text-terminal-green">{'>'}</span> Compile conhecimento.<br />
                <span className="text-terminal-green">{'>'}</span> Execute melhor.
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
              <div className="flex items-center gap-2 mb-4">
                <span className="text-terminal-cyan">./</span>
                <h4 className="font-semibold text-terminal-fg">produto</h4>
              </div>
              <ul className="space-y-3">
                {footerLinks.produto.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-terminal-gray hover:text-terminal-cyan transition-colors font-mono"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Empresa */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-terminal-cyan">./</span>
                <h4 className="font-semibold text-terminal-fg">empresa</h4>
              </div>
              <ul className="space-y-3">
                {footerLinks.empresa.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-terminal-gray hover:text-terminal-cyan transition-colors font-mono"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recursos */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-terminal-cyan">./</span>
                <h4 className="font-semibold text-terminal-fg">recursos</h4>
              </div>
              <ul className="space-y-3">
                {footerLinks.recursos.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-terminal-gray hover:text-terminal-cyan transition-colors font-mono"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Legal e copyright - Terminal style */}
          <div className="pt-8 border-t border-gray-800">
            <div className="bg-gray-950 rounded-lg p-4 font-mono text-sm">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  {footerLinks.legal.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="text-terminal-gray hover:text-terminal-cyan transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-terminal-gray-light">
                  <span className="text-terminal-gray">#</span>
                  <span>© 2025 Compila.dev</span>
                </div>
              </div>
              <div className="mt-3 text-terminal-gray text-xs">
                <span className="text-terminal-green">$</span> version --output
                <span className="text-terminal-cyan ml-2">v2.4.1-stable</span>
                <span className="text-terminal-gray ml-4">|</span>
                <span className="text-terminal-gray ml-4">build: 2025.01.17</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="bg-terminal-bg border-t border-gray-800">
        <div className="container-custom">
          <div className="flex items-center justify-between py-2 px-4 text-xs font-mono">
            <div className="flex items-center gap-4">
              <span className="text-terminal-gray">NORMAL</span>
              <span className="text-terminal-gray">UTF-8</span>
              <span className="text-terminal-gray">LF</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-terminal-gray">Ln 1, Col 1</span>
              <span className="text-terminal-cyan">compila.dev</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
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
      className="text-terminal-gray hover:text-terminal-cyan transition-colors"
    >
      <IconComponent className="h-5 w-5" />
    </Link>
  );
}
