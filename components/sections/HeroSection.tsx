"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/Container";
import { TerminalWindow } from "@/components/ui/TerminalWindow";
import { TerminalTyping } from "@/components/ui/TerminalTyping";
import { CheckCircle2, Terminal, Zap } from "lucide-react";

/**
 * Hero Section - Seção principal da landing page com estilo terminal
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

  return (
    <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32 bg-terminal-bg">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(30,202,211,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(30,202,211,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <Container>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Conteúdo */}
          <div className="max-w-2xl">
            <motion.div
              variants={titleVariants}
              initial="hidden"
              animate="visible"
              className="mb-6 font-mono text-sm"
            >
              <span className="text-terminal-green">user@compila</span>
              <span className="text-terminal-gray">:</span>
              <span className="text-terminal-blue">~</span>
              <span className="text-terminal-gray">$</span>
              <span className="text-terminal-cyan"> ./intro.sh</span>
            </motion.div>

            <motion.h1
              variants={titleVariants}
              initial="hidden"
              animate="visible"
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-terminal-fg leading-tight mb-6"
            >
              Compile conhecimento,{" "}
              <span className="text-terminal-cyan glow-cyan">execute sua carreira</span>
            </motion.h1>
            <motion.p
              variants={subtitleVariants}
              initial="hidden"
              animate="visible"
              className="text-lg sm:text-xl text-terminal-gray-light mb-8 leading-relaxed"
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
              <Button size="lg" className="w-full sm:w-auto bg-terminal-cyan hover:bg-terminal-cyan/90 text-terminal-bg font-semibold shadow-lg shadow-terminal-cyan/20">
                npm start
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto border-terminal-blue text-terminal-blue hover:bg-terminal-blue/10"
              >
                ./explore.sh
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

          {/* Hero Visual - Terminal com código */}
          <motion.div
            variants={imageVariants}
            initial="hidden"
            animate="visible"
            className="relative"
          >
            <TerminalWindow title="user@compila:~/challenges" className="shadow-2xl shadow-terminal-cyan/10">
              <div className="space-y-2">
                {/* Código com syntax highlight em tons de azul */}
                <CodeLine>
                  <span className="text-terminal-purple">import</span>
                  <span className="text-terminal-fg"> Challenge </span>
                  <span className="text-terminal-purple">from</span>
                  <span className="text-terminal-blue"> "compila-dev"</span>
                </CodeLine>
                <CodeLine>
                  <span className="text-terminal-purple">import</span>
                  <span className="text-terminal-fg"> CodeEditor </span>
                  <span className="text-terminal-purple">from</span>
                  <span className="text-terminal-blue"> "@/compila/ui"</span>
                </CodeLine>
                <CodeLine />
                <CodeLine>
                  <span className="text-terminal-purple">const</span>
                  <span className="text-terminal-fg"> challenge </span>
                  <span className="text-terminal-gray">=</span>
                  <span className="text-terminal-purple"> await</span>
                  <span className="text-terminal-fg"> getChallenge(</span>
                  <span className="text-terminal-blue">"recursão"</span>
                  <span className="text-terminal-fg">)</span>
                </CodeLine>
                <CodeLine>
                  <span className="text-terminal-purple">const</span>
                  <span className="text-terminal-fg"> solution </span>
                  <span className="text-terminal-gray">=</span>
                  <span className="text-terminal-purple"> await</span>
                  <span className="text-terminal-fg"> solve(challenge)</span>
                </CodeLine>
                <CodeLine />
                <CodeLine>
                  <span className="text-terminal-purple">const</span>
                  <span className="text-terminal-fg"> feedback </span>
                  <span className="text-terminal-gray">=</span>
                  <span className="text-terminal-purple"> await</span>
                  <span className="text-terminal-fg"> analyzeCode(solution)</span>
                </CodeLine>
                <CodeLine />
                <CodeLine>
                  <span className="text-terminal-purple">const</span>
                  <span className="text-terminal-fg"> success </span>
                  <span className="text-terminal-gray">=</span>
                  <span className="text-terminal-fg"> feedback</span>
                  <span className="text-terminal-gray">.</span>
                  <span className="text-terminal-fg">passed</span>
                </CodeLine>
                <CodeLine>
                  <span className="text-terminal-fg">console</span>
                  <span className="text-terminal-gray">.</span>
                  <span className="text-terminal-blue">log</span>
                  <span className="text-terminal-fg">(</span>
                  <span className="text-terminal-green">"Parabéns! + 50 XP"</span>
                  <span className="text-terminal-fg">)</span>
                </CodeLine>

                {/* Status bar */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                  className="mt-6 flex items-center justify-between text-xs text-terminal-gray border-t border-gray-800 pt-4"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-terminal-green animate-pulse" />
                    <span className="text-terminal-green">Compilado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-terminal-green" />
                    <span className="text-terminal-fg">3 testes passaram</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-3 w-3 text-terminal-cyan" />
                    <span className="text-terminal-cyan">+50 XP</span>
                  </div>
                </motion.div>
              </div>
            </TerminalWindow>

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
              className="absolute -z-10 -top-4 -right-4 w-72 h-72 bg-terminal-cyan/10 rounded-full blur-3xl"
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

// Componente auxiliar para linha de código colorido
function CodeLine({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex font-mono text-sm leading-relaxed">
      {children || <span>&nbsp;</span>}
    </div>
  );
}

// Componente para badge de confiança
function TrustBadge({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-terminal-bg border border-gray-800 rounded-lg">
      <CheckCircle2 className="h-4 w-4 text-terminal-green" />
      <span className="text-sm font-medium text-terminal-fg">{text}</span>
    </div>
  );
}
