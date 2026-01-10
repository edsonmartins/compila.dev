"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  className?: string;
}

/**
 * Componente de animação fade-in com suporte a preferências de redução de movimento
 */
export function FadeIn({
  children,
  delay = 0,
  duration = 0.6,
  direction = "up",
  className = "",
}: FadeInProps) {
  const prefersReducedMotion = useReducedMotion();

  const directionVariants = {
    up: { y: prefersReducedMotion ? 0 : 40 },
    down: { y: prefersReducedMotion ? 0 : -40 },
    left: { x: prefersReducedMotion ? 0 : 40 },
    right: { x: prefersReducedMotion ? 0 : -40 },
    none: {},
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        ...directionVariants[direction],
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: prefersReducedMotion ? 0.3 : duration,
        delay: prefersReducedMotion ? 0 : delay,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}

/**
 * Container para animações em cascata (stagger)
 */
export function StaggerContainer({
  children,
  staggerDelay = 0.1,
  className = "",
}: StaggerContainerProps) {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : staggerDelay,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

/**
 * Item individual para animações em cascata
 */
export function StaggerItem({
  children,
  delay,
  className = "",
}: StaggerItemProps) {
  const prefersReducedMotion = useReducedMotion();

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0.3 : 0.5,
        delay: prefersReducedMotion ? 0 : delay,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  };

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}
