"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { features } from "@/lib/data";
import * as Icons from "lucide-react";

/**
 * Features Principais - Grid 2x3 com funcionalidades
 */
export function Features() {
  const prefersReducedMotion = useReducedMotion();

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
    <section className="py-16 lg:py-24 bg-neutral-light/30 dark:bg-dark-card/50">
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
            Tudo que você precisa para evoluir
          </h2>
          <p className="text-lg text-neutral-dark dark:text-dark-muted max-w-2xl mx-auto">
            Ferramentas profissionais desenvolvidas para quem quer sério na
            carreira de desenvolvimento
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
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
  icon,
  title,
  description,
  variants,
}: {
  icon: string;
  title: string;
  description: string;
  variants: any;
}) {
  const IconComponent = Icons[icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;

  return (
    <motion.div variants={variants}>
      <Card
        variant="elevated"
        className="hover:border-accent/50 transition-colors h-full"
      >
        <CardHeader>
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
            className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4"
          >
            {IconComponent ? (
              <IconComponent className="h-6 w-6 text-accent" />
            ) : null}
          </motion.div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-dark dark:text-dark-muted">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
