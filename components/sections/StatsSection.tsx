"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { TerminalWindow } from "@/components/ui/TerminalWindow";
import { Cpu, HardDrive, Activity, Code2, Trophy, Zap, Building2 } from "lucide-react";

/**
 * StatsSection - Estatísticas no estilo sysinfo terminal
 */
export function StatsSection() {
  const prefersReducedMotion = useReducedMotion();

  const stats = [
    { value: "500+", label: "challenges", icon: Code2, color: "text-terminal-cyan" },
    { value: "10k+", label: "developers", icon: Cpu, color: "text-terminal-blue" },
    { value: "50+", label: "badges", icon: Trophy, color: "text-terminal-purple" },
    { value: "1M+", label: "submissions", icon: Activity, color: "text-terminal-green" },
    { value: "98%", label: "satisfaction", icon: Zap, color: "text-terminal-cyan" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="py-12 lg:py-16 bg-dark-background">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-terminal-bg border border-gray-800 rounded-lg mb-4">
              <span className="text-terminal-green">$</span>
              <span className="text-terminal-cyan">sysinfo</span>
              <span className="text-terminal-gray">--stats</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-terminal-fg mb-2">
              System Metrics
            </h2>
            <p className="text-sm text-terminal-gray">
              Platform performance indicators
            </p>
          </motion.div>

          {/* Terminal Window com stats */}
          <motion.div
            variants={itemVariants}
            className="max-w-4xl mx-auto"
          >
            <TerminalWindow title="user@compila:~$ sysinfo --stats" className="shadow-2xl">
              <div className="space-y-4">
                {/* Header do output */}
                <div className="text-terminal-gray text-xs mb-4">
                  <span className="text-terminal-cyan">▌</span> Compila.dev Platform Statistics
                  <span className="ml-4 text-terminal-gray-light">{new Date().toISOString().split('T')[0]}</span>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 hover:border-terminal-cyan/50 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        <span className="text-xs text-terminal-gray">{stat.label}</span>
                      </div>
                      <div className={`text-2xl font-bold ${stat.color}`}>
                        {stat.value}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Status bar do terminal */}
                <div className="mt-6 pt-4 border-t border-gray-800 flex items-center justify-between text-xs text-terminal-gray">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-terminal-green animate-pulse" />
                    <span>system: operational</span>
                  </div>
                  <span>v2.4.1</span>
                </div>
              </div>
            </TerminalWindow>
          </motion.div>

          {/* Logos de empresas - estilo "dependencies" */}
          <motion.div
            variants={itemVariants}
            className="mt-12"
          >
            <p className="text-sm text-terminal-gray mb-4 text-center">
              <span className="text-terminal-cyan">$</span> cat ./companies.txt
            </p>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={itemVariants}
              className="flex flex-wrap justify-center gap-4 md:gap-6"
            >
              {["Nubank", "iFood", "VTEX", "Mercado Livre", "Itaú", "Banco do Brasil"].map((company, index) => (
                <motion.div
                  key={company}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="flex items-center gap-2 px-4 py-2 bg-terminal-bg border border-gray-800 rounded-lg"
                >
                  <Building2 className="h-4 w-4 text-terminal-gray" />
                  <span className="text-sm text-terminal-fg font-mono">{company}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
