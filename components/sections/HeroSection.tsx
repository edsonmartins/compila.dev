"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/Container";
import { CheckCircle2, Code2, Terminal, Zap, Users, Trophy } from "lucide-react";

/**
 * Hero Section - Seção principal da landing page
 */
export function HeroSection() {
  const prefersReducedMotion = useReducedMotion();

  const titleVariants = {
    hidden: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0.3 : 0.6,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  };

  const subtitleVariants = {
    hidden: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0.3 : 0.6,
        delay: prefersReducedMotion ? 0 : 0.1,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  };

  const ctaVariants = {
    hidden: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0.3 : 0.6,
        delay: prefersReducedMotion ? 0 : 0.2,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  };

  const badgesVariants = {
    hidden: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0.3 : 0.6,
        delay: prefersReducedMotion ? 0 : 0.3,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  };

  const imageVariants = {
    hidden: {
      opacity: 0,
      scale: prefersReducedMotion ? 1 : 0.95,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: prefersReducedMotion ? 0.3 : 0.8,
        delay: prefersReducedMotion ? 0 : 0.2,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  };

  // Code snippet para demonstração visual
  const codeSnippet = `function saudacao(nome) {
  return \`Olá, \${nome}! Bem-vindo ao Compila.dev\`;
}

console.log(saudacao("Mundo"));`;

  return (
    <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32">
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Conteúdo */}
          <div className="max-w-2xl">
            <motion.h1
              variants={titleVariants}
              initial="hidden"
              animate="visible"
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary dark:text-dark-foreground leading-tight mb-6"
            >
              Compile conhecimento,{" "}
              <span className="text-accent">execute sua carreira</span>
            </motion.h1>
            <motion.p
              variants={subtitleVariants}
              initial="hidden"
              animate="visible"
              className="text-lg sm:text-xl text-neutral-dark dark:text-dark-muted mb-8 leading-relaxed"
            >
              Pratique programação com desafios reais em Frontend, Backend,
              Mobile, IoT e DevOps. 100% em português.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={ctaVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col sm:flex-row gap-4 mb-8"
            >
              <Button size="lg" className="w-full sm:w-auto shadow-lg shadow-accent/20">
                Começar Grátis
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto"
              >
                Explorar Desafios
              </Button>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              variants={badgesVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-4 sm:gap-6"
            >
              <TrustBadge text="500+ desafios" />
              <TrustBadge text="10k+ devs" />
              <TrustBadge text="Sem cartão" />
            </motion.div>
          </div>

          {/* Hero Visual - Código demonstrativo */}
          <motion.div
            variants={imageVariants}
            initial="hidden"
            animate="visible"
            className="relative"
          >
            <div className="rounded-xl bg-gradient-to-br from-primary to-accent/20 p-1 shadow-2xl">
              <div className="w-full rounded-lg bg-neutral-900 dark:bg-[#0A0F1D] p-6 font-mono text-sm overflow-hidden">
                {/* Barra de janela */}
                <div className="flex items-center gap-2 mb-4 text-neutral-400">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="flex-1 text-right text-xs">
                    main.tsx
                  </div>
                </div>

                {/* Código de exemplo */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="space-y-1"
                >
                  <div className="text-purple-400">import</div>
                  <div className="flex">
                    <span className="text-blue-400">{`{`}`}</span>
                    <span className="text-orange-400">{`Challenge`}</span>
                    <span className="text-neutral-400"> from </span>
                    <span className="text-green-400">'compila-dev'</span>
                    <span className="text-neutral-400">;</span>
                  </div>
                  <div className="flex">
                    <span className="text-purple-400">import</span>
                    <span className="text-blue-400">{` {`}`}</span>
                    <span className="text-yellow-400">CodeEditor</span>
                    <span className="text-neutral-400"> from </span>
                    <span className="text-cyan-400">'@compila/ui'</span>
                    <span className="text-neutral-400">;</span>
                  </div>
                  <div className="text-neutral-300">
                    {/* Linha em branco */}
                    <span className="text-gray-500">export default function</span>
                    <span className="text-blue-300"> ChallengePage</span>
                    <span className="text-neutral-300">() {"{"}</span>
                  </div>
                  <div className="pl-4 text-neutral-300">
                    {/* Conteúdo indentado */}
                    <div className="text-gray-400">
                      <span className="text-purple-400">const</span>
                      <span className="text-cyan-400"> [</span>
                      <span className="text-orange-400">challenge</span>
                      <span className="text-cyan-400">]</span>
                      <span className="text-neutral-300"> = </span>
                      <span className="text-yellow-400">await</span>
                      <span className="text-blue-400">getChallenge</span>
                      <span className="text-cyan-400">(</span>
                      <span className="text-green-400">'recursão'</span>
                      <span className="text-cyan-400">)</span>
                      <span className="text-neutral-300">;</span>
                    </div>
                    <div className="text-gray-400">
                      <span className="text-purple-400">return</span>
                      <span className="text-neutral-300"> (</span>
                      <span className="text-green-400">true</span>
                      <span className="text-neutral-300">) {"{"}</span>
                    </div>
                  </div>
                </motion.div>

                {/* Status bar */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                  className="mt-6 flex items-center justify-between text-xs text-neutral-400"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span>Compilado</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      <span>3 testes</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-3 w-3 text-accent" />
                    <span>+50 XP</span>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Elementos decorativos animados */}
            <motion.div
              animate={{
                scale: prefersReducedMotion ? 1 : [1, 1.1, 1],
              }}
              transition={{
                duration: prefersReducedMotion ? 0 : 4,
                repeat: prefersReducedMotion ? 0 : Infinity,
                ease: "easeInOut",
              }}
              className="absolute -z-10 -top-4 -right-4 w-72 h-72 bg-accent/20 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                scale: prefersReducedMotion ? 1 : [1, 1.15, 1],
              }}
              transition={{
                duration: prefersReducedMotion ? 0 : 5,
                repeat: prefersReducedMotion ? 0 : Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
              className="absolute -z-10 -bottom-4 -left-4 w-72 h-72 bg-primary/20 rounded-full blur-3xl"
            />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

function TrustBadge({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-neutral-dark dark:text-dark-muted">
      <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0" />
      <span>{text}</span>
    </div>
  );
}
