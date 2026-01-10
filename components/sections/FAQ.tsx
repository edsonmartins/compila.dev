"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/Accordion";
import { faqItems } from "@/lib/data";

/**
 * FAQ - Perguntas Frequentes com Accordion
 */
export function FAQ() {
  const prefersReducedMotion = useReducedMotion();

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
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-primary dark:text-dark-foreground mb-4 text-center">
            Perguntas Frequentes
          </h2>
          <p className="text-lg text-neutral-dark dark:text-dark-muted text-center mb-12">
            Tire suas dúvidas sobre a Compila.dev
          </p>

          <Accordion type="single" collapsible>
            {faqItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: prefersReducedMotion ? 0.3 : 0.4,
                  delay: prefersReducedMotion ? 0 : index * 0.05,
                  ease: [0.25, 0.4, 0.25, 1],
                }}
              >
                <AccordionItem value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-primary dark:text-dark-foreground">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-neutral-dark dark:text-dark-muted">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </Container>
    </section>
  );
}
