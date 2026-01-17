"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { TerminalWindow } from "@/components/ui/TerminalWindow";
import { FileCode, Folder, Braces, Cpu, Smartphone, Cloud, Code2 } from "lucide-react";

/**
 * Features Principais - Estilo listagem de arquivos/diretórios
 */
export function Features() {
  const prefersReducedMotion = useReducedMotion();

  const features = [
    {
      icon: FileCode,
      file: "challenges.ts",
      comment: "// Desafios variados por dificuldade",
      description: "500+ desafios em Frontend, Backend, Mobile, IoT, DevOps e Data Science.",
      color: "text-terminal-cyan",
    },
    {
      icon: Code2,
      file: "editor.tsx",
      comment: "// Editor integrado com syntax highlight",
      description: "Editor de código com autocomplete, temas e atalhos personalizados.",
      color: "text-terminal-blue",
    },
    {
      icon: Braces,
      file: "feedback.ts",
      comment: "// Feedback detalhado com IA",
      description: "Análise automática do código com sugestões de melhoria em português.",
      color: "text-terminal-purple",
    },
    {
      icon: Cloud,
      file: "portfolio.ts",
      comment: "// Portfólio automático integrado",
      description: "Seu progresso vira um portfólio público para compartilhar com recrutadores.",
      color: "text-terminal-green",
    },
    {
      icon: Smartphone,
      file: "mobile.tsx",
      comment: "// Experiência mobile otimizada",
      description: "Pratique de qualquer lugar com interface responsiva e app nativo.",
      color: "text-terminal-cyan",
    },
    {
      icon: Cpu,
      file: "analytics.ts",
      comment: "// Analytics de progresso",
      description: "Acompanhe sua evolução com gráficos e métricas detalhadas.",
      color: "text-terminal-blue",
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : 20,
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
    <section className="py-16 lg:py-24 bg-dark-background">
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg mb-4 font-mono text-sm">
            <span className="text-terminal-green">user@compila</span>
            <span className="text-terminal-gray">:</span>
            <span className="text-terminal-blue">~</span>
            <span className="text-terminal-gray">$</span>
            <span className="text-terminal-cyan"> tree ./src -L 1</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-terminal-fg mb-4">
            Estrutura da plataforma
          </h2>
          <p className="text-lg text-terminal-gray-light max-w-2xl mx-auto">
            Tudo que você precisa para evoluir como desenvolvedor
          </p>
        </motion.div>

        {/* Terminal Window com listagem de arquivos */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="max-w-4xl mx-auto"
        >
          <TerminalWindow title="user@compila:~/compila.dev/src" className="border-terminal-cyan/30">
            <div className="font-mono text-sm">
              {/* Tree header */}
              <div className="text-terminal-gray mb-4">
                <span className="text-terminal-cyan">src/</span>
              </div>

              {/* File listing */}
              <div className="space-y-2">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.file}
                    variants={itemVariants}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-900/50 transition-colors group"
                  >
                    <span className="text-terminal-gray">├──</span>
                    <feature.icon className={`h-5 w-5 mt-0.5 ${feature.color} flex-shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-terminal-fg group-hover:${feature.color} transition-colors`}>
                          {feature.file}
                        </span>
                      </div>
                      <div className="text-terminal-gray text-xs mt-1">
                        {feature.comment}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Close the tree */}
                <div className="text-terminal-gray pl-3">
                  └── <span className="text-terminal-gray">...</span>
                </div>
              </div>

              {/* Terminal prompt */}
              <div className="flex items-center gap-2 text-terminal-fg pt-4 mt-4 border-t border-gray-800">
                <span className="text-terminal-green">user@compila</span>
                <span className="text-terminal-gray">:</span>
                <span className="text-terminal-blue">src</span>
                <span className="text-terminal-gray">$</span>
                <span className="inline-block w-2 h-5 bg-terminal-cyan ml-1 cursor-blink" />
              </div>
            </div>
          </TerminalWindow>
        </motion.div>

        {/* Features detalhadas em cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12"
        >
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} variants={itemVariants} />
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

function FeatureCard({
  file,
  comment,
  description,
  color,
  variants,
  icon: Icon,
}: {
  file: string;
  comment: string;
  description: string;
  color: string;
  variants: any;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <motion.div variants={variants}>
      <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6 hover:border-terminal-cyan/50 transition-colors h-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center">
            <Icon className={`h-5 w-5 ${color}`} />
          </div>
          <div className="font-mono text-sm">
            <div className={`text-terminal-fg ${color}`}>{file}</div>
          </div>
        </div>
        <div className="text-terminal-gray text-xs mb-3 font-mono">
          {comment}
        </div>
        <p className="text-terminal-gray-light text-sm">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
