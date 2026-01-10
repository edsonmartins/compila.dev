"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Target, Code, Rocket } from "lucide-react";

/**
 * Como Funciona - 3 passos simples
 */
export function HowItWorks() {
  const prefersReducedMotion = useReducedMotion();

  const steps = [
    {
      icon: Target,
      emoji: "🎯",
      title: "Escolha seu desafio",
      description:
        "Navegue por 500+ desafios em Frontend, Backend, Mobile, IoT, DevOps e Data Science.",
    },
    {
      icon: Code,
      emoji: "💻",
      title: "Code no seu ritmo",
      description:
        "Use suas ferramentas preferidas, submeta quando estiver pronto. Sem tempo limite.",
    },
    {
      icon: Rocket,
      emoji: "🚀",
      title: "Receba feedback IA",
      description:
        "Análise automática do código, XP, badges e destaque no seu portfólio público.",
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0.3 : 0.5,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  };

  return (
    <section className="py-16 lg:py-24">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{
            duration: prefersReducedMotion ? 0.3 : 0.6,
            ease: [0.25, 0.4, 0.25, 1],
          }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-primary dark:text-dark-foreground mb-4">
            Como funciona
          </h2>
          <p className="text-lg text-neutral-dark dark:text-dark-muted max-w-2xl mx-auto">
            Três passos simples para evoluir suas habilidades técnicas
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-3 gap-8"
        >
          {steps.map((step, index) => (
            <StepCard
              key={index}
              {...step}
              step={index + 1}
              variants={itemVariants}
            />
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

function StepCard({
  emoji,
  title,
  description,
  step,
  variants,
}: {
  emoji: string;
  title: string;
  description: string;
  step: number;
  variants: any;
}) {
  return (
    <motion.div variants={variants} className="relative text-center">
      {/* Número do passo */}
      <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-semibold text-sm">
        {step}
      </div>

      <div className="bg-white dark:bg-dark-card rounded-xl p-8 border border-neutral-light dark:border-dark-border h-full">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: step * 0.1, duration: 0.3 }}
          className="text-4xl mb-4"
        >
          {emoji}
        </motion.div>
        <h3 className="text-xl font-semibold text-primary dark:text-dark-foreground mb-3">
          {title}
        </h3>
        <p className="text-neutral-dark dark:text-dark-muted">{description}</p>
      </div>
    </motion.div>
  );
}
