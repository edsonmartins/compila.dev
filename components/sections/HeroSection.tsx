"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { CheckCircle2 } from "lucide-react";

/**
 * Hero Section - Seção principal acima da dobra
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
              <Button size="lg" className="w-full sm:w-auto">
                Começar Grátis
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto"
              >
                Ver Desafios
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
              <TrustBadge text="Sem cartão" />
              <TrustBadge text="Português" />
            </motion.div>
          </div>

          {/* Hero Visual - Placeholder para imagem/vídeo */}
          <motion.div
            variants={imageVariants}
            initial="hidden"
            animate="visible"
            className="relative"
          >
            <div className="aspect-video rounded-xl bg-gradient-to-br from-primary to-accent/20 p-1">
              <div className="w-full h-full rounded-lg bg-neutral-white/90 dark:bg-dark-card/90 backdrop-blur flex items-center justify-center">
                {/* Placeholder visual - substituir por imagem real */}
                <div className="text-center p-8">
                  <svg
                    width="120"
                    height="120"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mx-auto mb-4 opacity-20"
                  >
                    <rect
                      x="4"
                      y="4"
                      width="32"
                      height="32"
                      rx="4"
                      fill="#0F2A44"
                    />
                    <path
                      d="M13 12C13 12 13 28 13 28C13 28 27 28 27 28C27 28 27 12 27 12C27 12 13 12 13 12ZM16 16L24 16M16 20L24 20M16 24L20 24"
                      stroke="#1ECAD3"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <p className="text-neutral-dark/60 dark:text-dark-muted/60 text-sm">
                    Screenshot da plataforma
                  </p>
                  <p className="text-neutral-dark/40 dark:text-dark-muted/40 text-xs mt-1">
                    (asset local será fornecido)
                  </p>
                </div>
              </div>
            </div>
            {/* Elemento decorativo */}
            <motion.div
              animate={{
                scale: prefersReducedMotion ? 1 : [1, 1.1, 1],
              }}
              transition={{
                duration: prefersReducedMotion ? 0 : 4,
                repeat: prefersReducedMotion ? 0 : Infinity,
                ease: "easeInOut",
              }}
              className="absolute -z-10 -top-4 -right-4 w-72 h-72 bg-accent/10 rounded-full blur-3xl"
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
              className="absolute -z-10 -bottom-4 -left-4 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
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
