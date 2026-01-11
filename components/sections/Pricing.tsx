"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/Container";
import { Check } from "lucide-react";

/**
 * Pricing - Planos FREE vs PRO
 */
export function Pricing() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="py-16 lg:py-24 bg-neutral-light/30 dark:bg-dark-background">
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
            Comece grátis, evolua quando quiser
          </h2>
          <p className="text-lg text-neutral-dark dark:text-dark-muted max-w-2xl mx-auto">
            Sem pegadinhas. Cancele quando quiser.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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
            <PricingCard
              name="FREE"
              price="R$ 0"
              period="Gratuito para sempre"
              features={[
                "50 desafios selecionados",
                "Portfólio público",
                "3 comunidades",
                "Ferramentas básicas",
                "XP e badges",
              ]}
              cta="Começar Grátis"
              variant="default"
            />
          </motion.div>

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
            <PricingCard
              name="PRO"
              price="R$ 29,90"
              period="por mês ou R$ 249/ano (30% off)"
              badge="Popular"
              features={[
                "Todos os 500+ desafios",
                "Feedback IA detalhado",
                "Comunidades ilimitadas",
                "Certificados verificados",
                "Analytics do portfólio",
                "Ferramentas PRO",
                "Suporte prioritário",
                "Sem anúncios",
              ]}
              cta="Começar teste grátis 7 dias"
              note="Sem cartão de crédito"
              variant="highlighted"
            />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

function PricingCard({
  name,
  price,
  period,
  features,
  cta,
  note,
  badge,
  variant,
}: {
  name: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
  note?: string;
  badge?: string;
  variant: "default" | "highlighted";
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={{ y: prefersReducedMotion ? 0 : -4 }}
      transition={{ duration: 0.2 }}
      className={`relative rounded-xl p-8 ${
        variant === "highlighted"
          ? "bg-white dark:bg-dark-card border-2 border-accent shadow-lg"
          : "bg-white dark:bg-dark-card border border-neutral-light dark:border-dark-border"
      }`}
    >
      {badge && (
        <motion.span
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", duration: 0.4 }}
          className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-sm font-medium px-4 py-1 rounded-full"
        >
          {badge}
        </motion.span>
      )}

      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-primary dark:text-dark-foreground mb-2">{name}</h3>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-4xl font-bold text-primary dark:text-dark-foreground">{price}</span>
        </div>
        <p className="text-sm text-neutral-dark dark:text-dark-muted mt-1">{period}</p>
      </div>

      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
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
        className={variant === "highlighted" ? "w-full" : "w-full"}
        variant={variant === "highlighted" ? "default" : "secondary"}
        size="lg"
      >
        {cta}
      </Button>

      {note && (
        <p className="text-xs text-neutral-dark dark:text-dark-muted text-center mt-4">{note}</p>
      )}
    </motion.div>
  );
}
