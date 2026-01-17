"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { TerminalWindow } from "@/components/ui/TerminalWindow";
import { Download, Code2, Rocket, CheckCircle2 } from "lucide-react";

/**
 * Como Funciona - 3 passos no estilo terminal
 */
export function HowItWorks() {
  const prefersReducedMotion = useReducedMotion();

  const steps = [
    {
      icon: Download,
      command: "npm install @compila/challenges",
      output: "+ @compila/challenges@3.2.1\nadded 1 package in 0.5s",
      title: "Escolha seu desafio",
      description: "Navegue por 500+ desafios em Frontend, Backend, Mobile, IoT, DevOps e Data Science.",
    },
    {
      icon: Code2,
      command: "code solution.js && npm test",
      output: "Running tests...\n✓ test_básico passed\n✓ test_intermediário passed\n⏸ test_avançado pending",
      title: "Code no seu ritmo",
      description: "Use suas ferramentas preferidas, submeta quando estiver pronto. Sem tempo limite.",
    },
    {
      icon: Rocket,
      command: "git push compila main",
      output: "Analisando código...\n✓ Todos os testes passaram!\n🎉 +50 XP adicionado\n🏆 Badge 'Desafios' desbloqueado",
      title: "Receba feedback IA",
      description: "Análise automática do código, XP, badges e destaque no seu portfólio público.",
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
    <section className="py-16 lg:py-24 bg-terminal-bg">
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
            <span className="text-terminal-cyan"> cat ./como-funciona.md</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-terminal-fg mb-4">
            Como funciona
          </h2>
          <p className="text-lg text-terminal-gray-light max-w-2xl mx-auto">
            Três comandos simples para evoluir suas habilidades técnicas
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-3 gap-6"
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

        {/* Terminal com fluxo completo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-12 max-w-3xl mx-auto"
        >
          <TerminalWindow title="user@compila:~/quick-start" className="border-terminal-cyan/30">
            <div className="space-y-3 text-sm">
              <CommandLine cmd="npm init -y" output="Wrote to package.json" />
              <CommandLine cmd="npm install @compila/challenges" output="added 127 packages in 2s" />
              <CommandLine
                cmd="compila init"
                output="? Escolha seu desafio: Frontend - React
? Dificuldade: Intermediário
📝 Desafio carregado: Component com useEffect

✓ Comece a codificar!"
              />
              <div className="flex items-center gap-2 text-terminal-fg pt-2">
                <span className="text-terminal-green">user@compila</span>
                <span className="text-terminal-gray">:</span>
                <span className="text-terminal-blue">~/quick-start</span>
                <span className="text-terminal-gray">$</span>
                <span className="inline-block w-2 h-5 bg-terminal-cyan ml-1 cursor-blink" />
              </div>
            </div>
          </TerminalWindow>
        </motion.div>
      </Container>
    </section>
  );
}

function StepCard({
  command,
  output,
  title,
  description,
  step,
  variants,
  icon: Icon,
}: {
  command: string;
  output: string;
  title: string;
  description: string;
  step: number;
  variants: any;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <motion.div variants={variants} className="relative">
      {/* Step number */}
      <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-terminal-cyan text-terminal-bg flex items-center justify-center font-bold text-sm font-mono">
        {step}
      </div>

      {/* Terminal card */}
      <div className="bg-gray-900/80 border border-gray-800 rounded-xl overflow-hidden h-full hover:border-terminal-cyan/50 transition-colors">
        {/* Terminal header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-gray-900/50 border-b border-gray-800">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-terminal-red" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-terminal-green" />
          </div>
          <div className="flex-1 text-center">
            <span className="text-xs text-terminal-gray font-mono">step-{step}.sh</span>
          </div>
        </div>

        {/* Terminal content */}
        <div className="p-4 font-mono text-sm">
          <div className="flex items-center gap-2 text-terminal-fg mb-3">
            <span className="text-terminal-green">$</span>
            <span className="text-terminal-cyan break-all">{command}</span>
          </div>

          <div className="mb-4 text-terminal-gray-light text-xs whitespace-pre-wrap pl-4 border-l-2 border-terminal-gray/30">
            {output}
          </div>

          <div className="border-t border-gray-800 pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon className="h-4 w-4 text-terminal-cyan" />
              <h3 className="text-base font-semibold text-terminal-fg">{title}</h3>
            </div>
            <p className="text-sm text-terminal-gray-light">{description}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CommandLine({ cmd, output }: { cmd: string; output: string }) {
  return (
    <>
      <div className="flex items-center gap-2 text-terminal-fg">
        <span className="text-terminal-green">$</span>
        <span className="text-terminal-cyan">{cmd}</span>
      </div>
      <div className="text-terminal-gray-light text-xs pl-4 border-l-2 border-terminal-gray/30">
        {output}
      </div>
    </>
  );
}
