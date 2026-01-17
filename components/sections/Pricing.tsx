"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/Container";
import { TerminalWindow } from "@/components/ui/TerminalWindow";
import { Check, Crown, Package } from "lucide-react";
import { pricingPlans } from "@/lib/data";

/**
 * Pricing - Planos no estilo npm list
 */
export function Pricing() {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="py-16 lg:py-24 bg-terminal-bg">
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg mb-4 font-mono text-sm">
            <span className="text-terminal-green">user@compila</span>
            <span className="text-terminal-gray">:</span>
            <span className="text-terminal-blue">~</span>
            <span className="text-terminal-gray">$</span>
            <span className="text-terminal-cyan"> npm list --depth=0</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-terminal-fg mb-4">
            Escolha seu plano
          </h2>
          <p className="text-lg text-terminal-gray-light max-w-2xl mx-auto">
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
            <TerminalWindow title="compila-free@0.0.1" className="border-gray-700">
              <div className="space-y-4">
                {/* Package tree */}
                <div className="font-mono text-sm space-y-1">
                  <div className="text-terminal-gray">└──</div>
                  <NpmItem
                    name="@compila/challenges"
                    version="50x selected"
                    color="text-terminal-cyan"
                  />
                  <NpmItem
                    name="@compila/portfolio"
                    version="public"
                    color="text-terminal-blue"
                  />
                  <NpmItem
                    name="@compila/communities"
                    version="3 included"
                    color="text-terminal-purple"
                  />
                  <NpmItem
                    name="@compila/tools"
                    version="basic"
                    color="text-terminal-green"
                  />
                  <NpmItem
                    name="@compila/gamification"
                    version="xp + badges"
                    color="text-terminal-cyan"
                  />
                </div>

                {/* Price tag */}
                <div className="pt-4 border-t border-gray-800">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl font-bold text-terminal-fg">
                      {pricingPlans.free.price}
                    </span>
                  </div>
                  <p className="text-sm text-terminal-gray text-center mt-1">
                    {pricingPlans.free.period}
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="lg"
                  className="w-full border-terminal-blue text-terminal-blue hover:bg-terminal-blue/10"
                >
                  npm install --save
                </Button>
              </div>
            </TerminalWindow>
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
            className="relative pt-6"
          >
            {/* Badge - fora do TerminalWindow para não ser cortado */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
              <div className="flex items-center gap-2 bg-terminal-cyan text-terminal-bg px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                <Crown className="h-4 w-4" />
                {pricingPlans.pro.badge}
              </div>
            </div>

            <TerminalWindow
              title="compila-pro@1.0.0"
              className="border-terminal-cyan shadow-2xl shadow-terminal-cyan/10"
            >
              <div className="space-y-4">
                {/* Package tree */}
                <div className="font-mono text-sm space-y-1">
                  <div className="text-terminal-gray">├──</div>
                  <NpmItem
                    name="@compila/challenges"
                    version="500+ all access"
                    color="text-terminal-cyan"
                    glow
                  />
                  <NpmItem
                    name="@compila/feedback"
                    version="detailed AI (pt-BR)"
                    color="text-terminal-blue"
                    glow
                  />
                  <NpmItem
                    name="@compila/communities"
                    version="unlimited"
                    color="text-terminal-purple"
                    glow
                  />
                  <NpmItem
                    name="@compila/certificates"
                    version="LinkedIn verified"
                    color="text-terminal-green"
                    glow
                  />
                  <NpmItem
                    name="@compila/analytics"
                    version="full portfolio stats"
                    color="text-terminal-cyan"
                    glow
                  />
                  <NpmItem
                    name="@compila/tools-pro"
                    version="exclusive"
                    color="text-terminal-blue"
                    glow
                  />
                  <NpmItem
                    name="@compila/support"
                    version="priority"
                    color="text-terminal-purple"
                    glow
                  />
                  <div className="text-terminal-gray">└── <span className="text-terminal-green">ad-free</span></div>
                </div>

                {/* Price tag */}
                <div className="pt-4 border-t border-gray-800">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl font-bold text-terminal-cyan">
                      {pricingPlans.pro.price}
                    </span>
                  </div>
                  <p className="text-sm text-terminal-gray-light text-center mt-1">
                    {pricingPlans.pro.period}
                  </p>
                </div>

                <Button
                  size="lg"
                  className="w-full bg-terminal-cyan hover:bg-terminal-cyan/90 text-terminal-bg font-semibold"
                >
                  npm install pro --global
                </Button>

                <p className="text-xs text-terminal-gray text-center">
                  {pricingPlans.pro.note}
                </p>
              </div>
            </TerminalWindow>
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
          className="max-w-3xl mx-auto mt-12"
        >
          <TerminalWindow title="user@compila:~$ npm diff free pro" className="border-gray-800">
            <div className="text-sm">
              <div className="text-terminal-gray mb-4">
                <span className="text-terminal-red">- removed</span>
                <span className="mx-4">|</span>
                <span className="text-terminal-green">+ added</span>
              </div>
              <div className="space-y-2">
                <DiffRow
                  feature="challenges"
                  removed="50 selected"
                  added="500+ all"
                />
                <DiffRow
                  feature="feedback"
                  removed="basic"
                  added="detailed pt-BR"
                />
                <DiffRow
                  feature="portfolio"
                  removed="basic"
                  added="analytics + LinkedIn"
                />
                <DiffRow
                  feature="communities"
                  removed="3"
                  added="unlimited"
                />
                <DiffRow
                  feature="certificates"
                  removed="—"
                  added="verified"
                />
              </div>
            </div>
          </TerminalWindow>
        </motion.div>
      </Container>
    </section>
  );
}

function NpmItem({
  name,
  version,
  color,
  glow = false,
}: {
  name: string;
  version: string;
  color: string;
  glow?: boolean;
}) {
  return (
    <div className={`flex items-center gap-2 pl-4 ${glow ? "text-terminal-fg" : ""}`}>
      <span className="text-terminal-gray">├──</span>
      <span className={color}>{name}</span>
      <span className="text-terminal-gray">@</span>
      <span className="text-terminal-gray-light">{version}</span>
    </div>
  );
}

function DiffRow({ feature, removed, added }: { feature: string; removed: string; added: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-800/50">
      <span className="text-sm font-medium text-terminal-gray-light w-32">
        {feature}
      </span>
      <div className="flex items-center gap-6">
        <span className="text-sm text-terminal-red line-through">
          {removed}
        </span>
        <span className="text-sm font-semibold text-terminal-green">
          {added}
        </span>
      </div>
    </div>
  );
}
