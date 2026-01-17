"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { TerminalWindow } from "@/components/ui/TerminalWindow";
import { GitCommit, MessageSquare } from "lucide-react";
import { testimonials } from "@/lib/data";

/**
 * Depoimentos - Estilo git log/commits
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

  // Avatar images from pravatar.cc
  const avatarImages = [
    "https://i.pravatar.cc/150?img=11",
    "https://i.pravatar.cc/150?img=3",
    "https://i.pravatar.cc/150?img=23",
  ];

  return (
    <section className="py-16 lg:py-24 bg-dark-background">
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg mb-4 font-mono text-sm">
            <span className="text-terminal-green">user@compila</span>
            <span className="text-terminal-gray">:</span>
            <span className="text-terminal-blue">~</span>
            <span className="text-terminal-gray">$</span>
            <span className="text-terminal-cyan"> git log --oneline -10</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-terminal-fg mb-4">
            Commit history
          </h2>
          <p className="text-lg text-terminal-gray-light max-w-2xl mx-auto">
            Histórias reais de quem transformou sua carreira
          </p>
        </motion.div>

        {/* Git log terminal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <TerminalWindow title="user@compila:~/career-journal" className="border-terminal-cyan/30">
            <div className="font-mono text-sm space-y-4">
              {testimonials.map((testimonial, index) => (
                <GitLogEntry
                  key={index}
                  hash={generateHash(index)}
                  author={testimonial.author}
                  message={testimonial.quote}
                  branch={index === 0 ? "HEAD -> main" : undefined}
                  date={getDateFromNow(index)}
                  avatar={avatarImages[index % avatarImages.length]}
                />
              ))}
            </div>
          </TerminalWindow>
        </motion.div>

        {/* Cards de depoimentos */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-3 gap-6"
        >
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              {...testimonial}
              index={index}
              variants={itemVariants}
              avatar={avatarImages[index % avatarImages.length]}
            />
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

function GitLogEntry({
  hash,
  author,
  message,
  branch,
  date,
  avatar,
}: {
  hash: string;
  author: string;
  message: string;
  branch?: string;
  date: string;
  avatar: string;
}) {
  // Truncate message for git log view
  const shortMessage = message.length > 50 ? message.slice(0, 50) + "..." : message;

  return (
    <div className="flex items-start gap-3 pb-3 border-b border-gray-800/50 last:border-0">
      <GitCommit className="h-4 w-4 text-terminal-cyan mt-1 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-terminal-yellow">{hash}</span>
          {branch && <span className="text-terminal-green">({branch})</span>}
        </div>
        <div className="text-terminal-gray-light mt-1">{shortMessage}</div>
        <div className="flex items-center gap-3 mt-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full overflow-hidden relative">
              <Image
                src={avatar}
                alt={author}
                width={16}
                height={16}
                className="object-cover"
              />
            </div>
            <span className="text-terminal-blue">{author}</span>
          </div>
          <span className="text-terminal-gray">{date}</span>
        </div>
      </div>
    </div>
  );
}

function TestimonialCard({
  quote,
  author,
  role,
  company,
  index,
  variants,
  avatar,
}: {
  quote: string;
  author: string;
  role: string;
  company: string;
  index: number;
  variants: any;
  avatar: string;
}) {
  return (
    <motion.div variants={variants}>
      <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6 hover:border-terminal-cyan/50 transition-colors h-full">
        <MessageSquare className="h-8 w-8 text-terminal-cyan/30 mb-4" />
        <p className="text-terminal-gray-light mb-6 leading-relaxed">
          &ldquo;{quote}&rdquo;
        </p>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden relative border-2 border-terminal-cyan/30">
            <Image
              src={avatar}
              alt={`Foto de ${author}`}
              width={48}
              height={48}
              className="object-cover"
            />
          </div>
          <div>
            <p className="font-semibold text-terminal-fg">{author}</p>
            <p className="text-sm text-terminal-gray">
              {role} na <span className="text-terminal-cyan">{company}</span>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Helper functions
function generateHash(index: number): string {
  const chars = "0123456789abcdef";
  let hash = "";
  for (let i = 0; i < 7; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

function getDateFromNow(index: number): string {
  const days = [1, 3, 7, 14, 30, 90];
  const day = days[index % days.length] || 1;
  return `${day} day${day > 1 ? "s" : ""} ago`;
}
