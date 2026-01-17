"use client";

import { motion } from "framer-motion";
import { Users, Code2, Trophy, Target, Zap, Building2 } from "lucide-react";
import { Container } from "@/components/ui/Container";

/**
 * StatsSection - Estatísticas animadas para prova social
 */
export function StatsSection() {
  const stats = [
    { value: "500+", label: "Desafios", icon: Target },
    { value: "10k+", label: "Desenvolvedores", icon: Users },
    { value: "50+", label: "Badges", icon: Trophy },
    { value: "1M+", label: "Submissões", icon: Code2 },
    { value: "98%", label: "Satisfação", icon: Zap },
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
    <section className="py-12 lg:16 bg-neutral-50 dark:bg-dark-bg">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-dark-foreground mb-4">
              Números que falam por si
            </h2>
            <p className="text-lg text-neutral-600 dark:text-dark-muted max-w-2xl mx-auto">
              Uma plataforma consolidada com milhares de desafios completados
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="flex flex-col items-center justify-center p-6 bg-white dark:bg-dark-card rounded-2xl shadow-lg"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-3">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-primary dark:text-dark-foreground">
                  {stat.value}
                </div>
                <div className="text-sm text-neutral-600 dark:text-dark-muted">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Logos de empresas - prova social */}
          <div className="mt-12 text-center">
            <p className="text-sm text-neutral-500 dark:text-dark-muted mb-4">
              Usado por desenvolvedores de empresas como:
            </p>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={itemVariants}
              className="flex flex-wrap justify-center gap-8 md:gap-12"
            >
              {["Nubank", "iFood", "VTEX", "Mercado Livre", "Itaú", "Banco do Brasil"].map((company) => (
                <div
                  key={company}
                  className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-dark-card rounded-lg shadow-sm"
                >
                  <Building2 className="h-5 w-5 text-neutral-400" />
                  <span className="text-sm font-medium text-neutral-700 dark:text-dark-foreground">{company}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
