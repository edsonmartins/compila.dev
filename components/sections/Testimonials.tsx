"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Card, CardContent } from "@/components/ui/Card";
import { testimonials } from "@/lib/data";
import { Quote } from "lucide-react";

/**
 * Depoimentos - Cards com citações de desenvolvedores
 */
export function Testimonials() {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : 40,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0.3 : 0.6,
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
            O que dizem os desenvolvedores
          </h2>
          <p className="text-lg text-neutral-dark dark:text-dark-muted max-w-2xl mx-auto">
            Histórias reais de quem transformou sua carreira com a Compila.dev
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} index={index} variants={itemVariants} />
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

function TestimonialCard({
  quote,
  author,
  role,
  company,
  index,
  variants,
}: {
  quote: string;
  author: string;
  role: string;
  company: string;
  index: number;
  variants: any;
}) {
  // Avatar images from pravatar.cc
  const avatarImages = [
    "https://i.pravatar.cc/150?img=11",
    "https://i.pravatar.cc/150?img=3",
    "https://i.pravatar.cc/150?img=23",
  ];

  return (
    <motion.div variants={variants}>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        <Card variant="elevated" className="h-full">
          <CardContent className="pt-6">
            <Quote className="h-8 w-8 text-accent/20 mb-4" />
            <p className="text-neutral-dark dark:text-dark-muted mb-6 leading-relaxed">
              &ldquo;{quote}&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-12 h-12 rounded-full overflow-hidden relative"
              >
                <Image
                  src={avatarImages[index % avatarImages.length]}
                  alt={`Foto de ${author}`}
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </motion.div>
              <div>
                <p className="font-semibold text-primary dark:text-dark-foreground">{author}</p>
                <p className="text-sm text-neutral-dark dark:text-dark-muted">
                  {role} na {company}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
