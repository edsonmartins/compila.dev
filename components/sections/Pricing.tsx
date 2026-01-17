"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check, CheckCircle2, Crown, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/Container";
import { pricingPlans } from "@/lib/data";

/**
 * Pricing - Planos FREE vs PRO
 */
export function Pricing() {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const getPlanFeatures = (plan: keyof typeof pricingPlans) => {
    return pricingPlans[plan].features;
  };

  return (
    <section className="py-16 lg:py-24 bg-neutral-light/30 dark:bg-dark-background">
      <Container>
        <motion.div
          initial={containerVariants}
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          transition={{
            duration: prefersReducedMotion ? 0.3 : 0.6,
          }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-primary dark:text-dark-foreground mb-4">
            Escolha seu plano
          </h2>
          <p className="text-lg text-neutral-dark dark:text-dark-muted max-w-2xl mx-auto">
            Comece gratuitamente e evolua conforme seu progresso.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Plano FREE */}
          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: prefersReducedMotion ? 0.3 : 0.5,
              delay: prefersReducedMotion ? 0 : 0.1,
              ease: [0.25, 0.4, 0.25, 1],
            }}
          >
            <div className="relative rounded-2xl p-8 bg-white dark:bg-dark-card border border-neutral-light dark:border-dark-border hover:border-accent/30 transition-colors">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-semibold text-primary dark:text-dark-foreground mb-2">
                  {pricingPlans.free.name}
                </h3>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-4xl font-bold text-primary dark:text-dark-foreground">
                    {pricingPlans.free.price}
                  </span>
                </div>
                <p className="text-sm text-neutral-dark dark:text-dark-muted mt-1">
                  {pricingPlans.free.period}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {getPlanFeatures("free").map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: prefersReducedMotion ? 0 : 0.3 + index * 0.05,
                      duration: 0.3,
                    }}
                    className="flex items-start gap-3"
                  >
                    <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-dark dark:text-dark-muted">{feature}</span>
                  </motion.li>
                ))}
              </ul>

              <Button
                variant="outline"
                size="lg"
                className="w-full"
              >
                {pricingPlans.free.cta}
              </Button>
            </div>
          </motion.div>

          {/* Plano PRO */}
          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: prefersReducedMotion ? 0.3 : 0.5,
              delay: prefersReducedMotion ? 0 : 0.2,
              ease: [0.25, 0.4, 0.25, 1],
            }}
          >
            <div className="relative rounded-2xl p-8 bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-accent shadow-2xl">
              {/* Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 to-orange-600 text-sm font-semibold px-4 py-1 rounded-full">
                    {pricingPlans.pro.badge}
                  </span>
                </div>
              </div>

              <div className="text-center mb-6 mt-8">
                <h3 className="text-2xl font-semibold text-white mb-2">
                  {pricingPlans.pro.name}
                </h3>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-4xl font-bold text-white">
                    {pricingPlans.pro.price}
                  </span>
                </div>
                <p className="text-sm text-white/80 mt-1">
                  {pricingPlans.pro.period}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {getPlanFeatures("pro").map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: prefersReducedMotion ? 0 : 0.3 + index * 0.05,
                      duration: 0.3,
                    }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-white">{feature}</span>
                  </motion.li>
                ))}
              </ul>

              <Button
                size="lg"
                className="w-full bg-white text-primary hover:bg-neutral-100"
              >
                {pricingPlans.pro.cta}
              </Button>

              <p className="text-xs text-white/70 text-center mt-4">
                {pricingPlans.pro.note}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Comparativo visual de recursos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{
            duration: prefersReducedMotion ? 0.3 : 0.5,
          }}
          className="max-w-3xl mx-auto mt-8"
        >
          <h4 className="text-center text-neutral-dark dark:text-dark-muted mb-6">
            Comparativo de recursos
          </h4>
          <div className="space-y-4">
            {[
              {
                feature: "Desafios disponíveis",
                free: "50 selecionados",
                pro: "500+ todos",
              },
              {
                feature: "Feedback IA",
                free: "Básico",
                pro: "Detalhado em português",
              },
              {
                feature: "Portfólio público",
                free: "Básico",
                pro: "Analytics completo + LinkedIn",
              },
              {
                feature: "Comunidades",
                free: "3 comunidades",
                pro: "Ilimitadas",
              },
              {
                feature: "Certificados",
                free: "Não",
                pro: "Verificados para LinkedIn",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b border-neutral-light dark:border-dark-border"
              >
                <span className="text-sm font-medium text-neutral-dark dark:text-dark-muted">
                  {item.feature}
                </span>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-neutral-dark dark:text-dark-muted">
                    {item.free}
                  </span>
                  <span className="text-sm font-semibold text-primary dark:text-accent">
                    {item.pro}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
