"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { categories } from "@/lib/data";
import * as Icons from "lucide-react";

/**
 * Categorias de Desafios - 6 cards com áreas tech
 */
export function ChallengeCategories() {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.08,
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
    <section className="py-16 lg:py-24">
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
            Desafios para todas as áreas
          </h2>
          <p className="text-lg text-neutral-dark dark:text-dark-muted max-w-2xl mx-auto">
            Mais de 500 desafios práticos cobrindo todo o ecossistema de
            desenvolvimento moderno
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {categories.map((category) => (
            <CategoryCard key={category.title} {...category} variants={itemVariants} />
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

function CategoryCard({
  icon,
  title,
  count,
  technologies,
  variants,
}: {
  icon: string;
  title: string;
  count: number;
  technologies: string;
  variants: any;
}) {
  const IconComponent = Icons[icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;

  return (
    <motion.div variants={variants}>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className="group bg-white dark:bg-dark-card rounded-xl p-6 border border-neutral-light dark:border-dark-border hover:border-accent hover:shadow-md transition-all"
      >
        <div className="flex items-start justify-between mb-4">
          <motion.div
            whileHover={{ rotate: 10 }}
            transition={{ duration: 0.2 }}
            className="w-12 h-12 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center"
          >
            {IconComponent ? (
              <IconComponent className="h-6 w-6 text-primary dark:text-dark-foreground" />
            ) : null}
          </motion.div>
          <span className="text-sm font-medium text-accent bg-accent/10 px-3 py-1 rounded-full">
            {count} desafios
          </span>
        </div>
        <h3 className="text-xl font-semibold text-primary dark:text-dark-foreground mb-2">{title}</h3>
        <p className="text-sm text-neutral-dark dark:text-dark-muted">{technologies}</p>
      </motion.div>
    </motion.div>
  );
}
