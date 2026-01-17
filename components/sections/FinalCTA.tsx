"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TerminalWindow } from "@/components/ui/TerminalWindow";
import { CheckCircle2, Terminal } from "lucide-react";

/**
 * CTA Final - Terminal prompt esperando input
 */
export function FinalCTA() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="py-16 lg:py-24 bg-terminal-bg relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(30,202,211,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(30,202,211,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

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
            className="absolute top-0 left-0 w-64 h-64 bg-terminal-cyan/10 rounded-full blur-3xl"
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
            className="absolute bottom-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
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
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-terminal-fg mb-4"
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
          className="text-lg sm:text-xl text-terminal-gray-light mb-8 max-w-2xl mx-auto"
        >
          Junte-se a milhares de desenvolvedores praticando código em
          português
        </motion.p>

        {/* Terminal Prompt CTA */}
        <motion.div
          initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: prefersReducedMotion ? 0.3 : 0.5,
            delay: prefersReducedMotion ? 0 : 0.3,
          }}
          className="max-w-2xl mx-auto mb-8"
        >
          <TerminalWindow title="user@compila:~" className="border-terminal-cyan/50 shadow-2xl shadow-terminal-cyan/10">
            <div className="space-y-4">
              {/* Command history */}
              <div className="text-sm space-y-2">
                <div className="flex items-center gap-2 text-terminal-gray">
                  <span className="text-terminal-green">$</span>
                  <span>compila --account create</span>
                </div>
                <div className="text-terminal-green text-sm pl-4">
                  ✓ Account created successfully
                </div>
              </div>

              {/* Current prompt */}
              <div className="flex items-center gap-2 text-terminal-fg text-sm py-2 bg-gray-900/50 -mx-4 px-4 rounded">
                <span className="text-terminal-green">user@compila</span>
                <span className="text-terminal-gray">:</span>
                <span className="text-terminal-blue">~</span>
                <span className="text-terminal-gray">$</span>
                <span className="text-terminal-cyan">npm start</span>
                <span className="inline-block w-2 h-5 bg-terminal-cyan ml-1 cursor-blink" />
              </div>

              <Button
                size="lg"
                className="w-full bg-terminal-cyan hover:bg-terminal-cyan/90 text-terminal-bg font-semibold"
              >
                <Terminal className="h-5 w-5 mr-2" />
                Execute Command
              </Button>
            </div>
          </TerminalWindow>
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
          className="flex flex-wrap justify-center gap-6 text-terminal-gray-light text-sm"
        >
          {[
            { text: "Sem cartão de crédito" },
            { text: "Cadastro em 2 minutos" },
            { text: "Cancele quando quiser" },
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
              className="flex items-center gap-2 px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg"
            >
              <CheckCircle2 className="h-4 w-4 text-terminal-green" />
              <span>{item.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
