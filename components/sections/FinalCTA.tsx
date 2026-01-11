"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

/**
 * CTA Final - Última chamada para ação antes do FAQ
 */
export function FinalCTA() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: prefersReducedMotion ? 0.3 : 0.6,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      className="py-16 lg:py-24 bg-primary relative overflow-hidden dark:bg-dark-card"
    >
      {/* Elementos decorativos animados */}
      {!prefersReducedMotion && (
        <>
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"
          />
        </>
      )}

      <div className="container-custom text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: prefersReducedMotion ? 0.3 : 0.6,
            delay: prefersReducedMotion ? 0 : 0.1,
            ease: [0.25, 0.4, 0.25, 1],
          }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
        >
          Pronto para compilar seu futuro?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: prefersReducedMotion ? 0.3 : 0.6,
            delay: prefersReducedMotion ? 0 : 0.2,
            ease: [0.25, 0.4, 0.25, 1],
          }}
          className="text-lg sm:text-xl text-white/80 mb-8 max-w-2xl mx-auto"
        >
          Junte-se a milhares de desenvolvedores praticando código em
          português
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          whileHover={{ scale: prefersReducedMotion ? 1 : 1.05 }}
          whileTap={{ scale: prefersReducedMotion ? 1 : 0.98 }}
          transition={{
            duration: prefersReducedMotion ? 0.3 : 0.4,
            delay: prefersReducedMotion ? 0 : 0.3,
            ease: [0.25, 0.4, 0.25, 1],
          }}
        >
          <Button size="lg" className="mb-8 bg-accent hover:bg-accent-hover text-white">
            Criar Conta Grátis
          </Button>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: prefersReducedMotion ? 0.3 : 0.6,
            delay: prefersReducedMotion ? 0 : 0.4,
            ease: [0.25, 0.4, 0.25, 1],
          }}
          className="flex flex-wrap justify-center gap-6 text-white/80 text-sm"
        >
          {[
            { icon: CheckCircle2, text: "Sem cartão de crédito" },
            { icon: CheckCircle2, text: "Cadastro em 2 minutos" },
            { icon: CheckCircle2, text: "Cancele quando quiser" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: prefersReducedMotion ? 0 : 0.5 + i * 0.1,
                duration: 0.4,
              }}
              className="flex items-center gap-2"
            >
              <item.icon className="h-5 w-5 text-accent" />
              <span>{item.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
