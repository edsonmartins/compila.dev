"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/Container";
import { gamificationBenefits } from "@/lib/data";
import * as Icons from "lucide-react";

/**
 * Gamification - Sistema de XP, badges e leaderboard
 */
export function Gamification() {
  const prefersReducedMotion = useReducedMotion();

  const listVariants = {
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
      x: prefersReducedMotion ? 0 : -20,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: prefersReducedMotion ? 0.3 : 0.5,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  };

  return (
    <section className="py-16 lg:py-24 bg-neutral-light/30 dark:bg-dark-background">
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Mockup visual do perfil */}
          <motion.div
            initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: prefersReducedMotion ? 0.3 : 0.6,
              ease: [0.25, 0.4, 0.25, 1],
            }}
            className="order-2 lg:order-1"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg max-w-md mx-auto"
            >
              {/* Header do perfil */}
              <div className="flex items-center gap-4 mb-6">
                <motion.div
                  whileHover={{ rotate: 10 }}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold"
                >
                  JD
                </motion.div>
                <div>
                  <h4 className="font-semibold text-primary dark:text-dark-foreground text-lg">
                    João Dev
                  </h4>
                  <p className="text-sm text-neutral-dark dark:text-dark-muted">
                    Level 12 • Frontend Developer
                  </p>
                </div>
              </div>

              {/* Barra de XP */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-neutral-dark dark:text-dark-muted">XP Progress</span>
                  <span className="font-medium text-accent">2,450 / 3,000</span>
                </div>
                <div className="h-3 bg-neutral-light dark:bg-dark-border rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "82%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                  />
                </div>
              </div>

              {/* Badges */}
              <div className="mb-6">
                <h5 className="text-sm font-medium text-primary dark:text-dark-foreground mb-3">
                  Badges Recentes
                </h5>
                <div className="flex flex-wrap gap-2">
                  {["🏆", "⚡", "🔥", "💎", "🎯"].map((badge, i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 0, rotate: -180 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: 0.4 + i * 0.1,
                        duration: 0.4,
                        type: "spring",
                      }}
                      className="w-10 h-10 rounded-lg bg-neutral-light dark:bg-dark-background flex items-center justify-center text-xl"
                    >
                      {badge}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                {[
                  { value: "42", label: "Desafios" },
                  { value: "15", label: "Streak" },
                  { value: "#234", label: "Ranking" },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 + i * 0.1, duration: 0.3 }}
                  >
                    <p className="text-2xl font-bold text-accent">{stat.value}</p>
                    <p className="text-xs text-neutral-dark dark:text-dark-muted">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Conteúdo */}
          <motion.div
            initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: prefersReducedMotion ? 0.3 : 0.6,
              ease: [0.25, 0.4, 0.25, 1],
            }}
            className="order-1 lg:order-2"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-primary dark:text-dark-foreground mb-4">
              Acompanhe sua evolução
            </h2>
            <p className="text-lg text-neutral-dark dark:text-dark-muted mb-8">
              Sistema de XP, badges e leaderboard para manter você motivado
            </p>

            <motion.ul
              variants={listVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="space-y-4 mb-8"
            >
              {gamificationBenefits.map((benefit, index) => {
                const IconComponent = Icons[benefit.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
                return (
                  <motion.li
                    key={index}
                    variants={itemVariants}
                    className="flex items-center gap-3"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0"
                    >
                      {IconComponent ? (
                        <IconComponent className="h-5 w-5 text-accent" />
                      ) : null}
                    </motion.div>
                    <span className="text-neutral-dark dark:text-dark-muted">{benefit.text}</span>
                  </motion.li>
                );
              })}
            </motion.ul>

            <Button variant="secondary">Ver meu perfil de exemplo</Button>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
