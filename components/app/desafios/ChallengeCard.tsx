"use client";

import { motion } from "framer-motion";
import { Code2, Clock, Users, TrendingUp } from "lucide-react";
import Link from "next/link";

interface ChallengeCardProps {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  stack: string;
  level: string;
  difficulty: number;
  technologies: string[];
  xp: number;
  estimatedTime: number;
  completedCount: number;
  userProgress?: {
    status: "not_started" | "in_progress" | "completed";
    percentage: number;
  };
}

export function ChallengeCard({
  id,
  title,
  slug,
  shortDescription,
  stack,
  level,
  difficulty,
  technologies,
  xp,
  estimatedTime,
  completedCount,
  userProgress,
}: ChallengeCardProps) {
  const levelColors = {
    beginner: "bg-green-500/10 text-green-600 dark:text-green-400",
    junior: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    mid: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    senior: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    expert: "bg-red-500/10 text-red-600 dark:text-red-400",
  };

  const stackLabels = {
    frontend: "Frontend",
    backend: "Backend",
    mobile: "Mobile",
    devops: "DevOps",
    iot: "IoT",
    data: "Data",
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/app/desafios/${slug}`}>
        <div className="bg-white dark:bg-dark-card rounded-xl p-6 border border-neutral-light dark:border-dark-border hover:border-accent transition-all h-full">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs px-2 py-1 bg-primary/10 text-primary dark:text-dark-foreground rounded-full capitalize">
                  {stackLabels[stack as keyof typeof stackLabels] || stack}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full capitalize ${levelColors[level as keyof typeof levelColors]}`}>
                  {level}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-primary dark:text-dark-foreground mb-1">
                {title}
              </h3>
              <p className="text-sm text-neutral-dark dark:text-dark-muted line-clamp-2">
                {shortDescription}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1 ml-4">
              <span className="text-sm font-bold text-accent">+{xp} XP</span>
              <div className="flex items-center gap-1 text-xs text-neutral-dark dark:text-dark-muted">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`h-3 w-3 ${
                      i < difficulty ? "fill-yellow-400 text-yellow-400" : "fill-neutral-light dark:fill-dark-border text-neutral-light dark:text-dark-border"
                    }`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>

          {/* Technologies */}
          <div className="flex flex-wrap gap-2 mb-4">
            {technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="text-xs px-2 py-1 bg-neutral-light dark:bg-dark-border text-neutral-dark dark:text-dark-muted rounded"
              >
                {tech}
              </span>
            ))}
            {technologies.length > 4 && (
              <span className="text-xs px-2 py-1 text-neutral-dark dark:text-dark-muted">
                +{technologies.length - 4}
              </span>
            )}
          </div>

          {/* Progress (if started) */}
          {userProgress && userProgress.status !== "not_started" && (
            <div className="mb-4">
              <div className="flex justify-between text-xs text-neutral-dark dark:text-dark-muted mb-1">
                <span>Progresso</span>
                <span>{userProgress.percentage}%</span>
              </div>
              <div className="h-1.5 bg-neutral-light dark:bg-dark-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent transition-all"
                  style={{ width: `${userProgress.percentage}%` }}
                />
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-neutral-dark dark:text-dark-muted">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{completedCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{estimatedTime}min</span>
              </div>
            </div>
            {userProgress?.status === "completed" && (
              <span className="text-green-600 dark:text-green-400 font-medium">
                ✓ Completo
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
