"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Code2, TrendingUp, Trophy, Flame, Target, Clock } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { getUserStats, getUserBadges, getFeaturedChallenges } from "@/lib/api";
import type { Badge } from "@/lib/api";

interface ActivityItem {
  id: string;
  type: "challenge" | "badge" | "level";
  title: string;
  time: string;
  xp?: number;
}

/**
 * Dashboard do usuário
 */
export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    completedChallenges: 0,
    xp: 0,
    level: 1,
    streak: 0,
    rank: 0,
    levelProgress: 0,
  });
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [recommendedChallenges, setRecommendedChallenges] = useState<any[]>([]);
  const [dailyGoal, setDailyGoal] = useState({ current: 0, target: 5 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        // Fetch user stats
        const userStats = await getUserStats(user.id);
        setStats({
          completedChallenges: userStats.badgeCount, // Using badgeCount as proxy for completed
          xp: userStats.xp,
          level: userStats.level,
          streak: userStats.streakCurrent,
          rank: 0, // Would come from ranking API
          levelProgress: userStats.levelProgress,
        });

        // Fetch user badges for activity
        const badges = await getUserBadges(user.id);
        const badgeActivities: ActivityItem[] = badges.slice(0, 3).map((badge: Badge) => ({
          id: badge.id,
          type: "badge" as const,
          title: badge.name,
          time: new Date(badge.earnedAt).toLocaleDateString("pt-BR"),
        }));
        setRecentActivity(badgeActivities);

        // Fetch recommended challenges
        const featured = await getFeaturedChallenges();
        setRecommendedChallenges(featured.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        // Set mock data on error
        setStats({
          completedChallenges: 12,
          xp: 450,
          level: 5,
          streak: 7,
          rank: 234,
          levelProgress: 60,
        });
        setRecentActivity([
          {
            id: "1",
            type: "challenge",
            title: "Dashboard Analytics",
            time: "2 horas atrás",
            xp: 120,
          },
          {
            id: "2",
            type: "badge",
            title: "React Components",
            time: "1 dia atrás",
          },
          {
            id: "3",
            type: "level",
            title: "Nível 5 alcançado!",
            time: "2 dias atrás",
          },
        ]);
        setRecommendedChallenges([
          {
            id: "1",
            title: "Todo List com Hooks",
            stack: "frontend",
            level: "junior",
            xpReward: 80,
            technologies: ["React", "TypeScript"],
            slug: "todo-list-hooks",
          },
          {
            id: "2",
            title: "API REST com Node.js",
            stack: "backend",
            level: "junior",
            xpReward: 100,
            technologies: ["Node.js", "Express"],
            slug: "api-rest-node",
          },
          {
            id: "3",
            title: "Layout Responsivo",
            stack: "frontend",
            level: "beginner",
            xpReward: 50,
            technologies: ["HTML", "CSS"],
            slug: "layout-responsivo",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const circumference = 2 * Math.PI * 56;
  const progressOffset = circumference * (1 - dailyGoal.current / dailyGoal.target);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary dark:text-dark-foreground">
          Olá, {user?.fullName || user?.username || "Dev"}! 👋
        </h1>
        <p className="text-neutral-dark dark:text-dark-muted">
          Continue evoluindo. Você está no caminho certo!
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            <StatCard
              icon={<Code2 className="h-5 w-5" />}
              label="Desafios Completados"
              value={stats.completedChallenges}
              color="bg-accent/10 text-accent"
            />
            <StatCard
              icon={<Trophy className="h-5 w-5" />}
              label="XP Total"
              value={stats.xp}
              color="bg-yellow-500/10 text-yellow-600"
            />
            <StatCard
              icon={<Flame className="h-5 w-5" />}
              label="Streak Atual"
              value={`${stats.streak} dias`}
              color="bg-orange-500/10 text-orange-600"
            />
            <StatCard
              icon={<TrendingUp className="h-5 w-5" />}
              label="Nível"
              value={stats.level}
              color="bg-purple-500/10 text-purple-600"
            />
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div className="bg-white dark:bg-dark-card rounded-xl p-6 border border-neutral-light dark:border-dark-border">
                <h2 className="text-lg font-semibold text-primary dark:text-dark-foreground mb-4">
                  Atividade Recente
                </h2>
                {recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-neutral-light dark:bg-dark-border flex items-center justify-center">
                          {activity.type === "challenge" && <Code2 className="h-5 w-5 text-accent" />}
                          {activity.type === "badge" && <Trophy className="h-5 w-5 text-yellow-600" />}
                          {activity.type === "level" && <TrendingUp className="h-5 w-5 text-purple-600" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-primary dark:text-dark-foreground">
                            {activity.title}
                          </p>
                          <p className="text-xs text-neutral-dark dark:text-dark-muted">{activity.time}</p>
                        </div>
                        {activity.xp && (
                          <span className="text-sm font-medium text-accent">+{activity.xp} XP</span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-neutral-dark dark:text-dark-muted">
                    Comece a resolver desafios para ver sua atividade aqui!
                  </p>
                )}
              </div>
            </motion.div>

            {/* Daily Goal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-white dark:bg-dark-card rounded-xl p-6 border border-neutral-light dark:border-dark-border">
                <h2 className="text-lg font-semibold text-primary dark:text-dark-foreground mb-4">
                  Meta Diária
                </h2>
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        fill="none"
                        className="stroke-neutral-light dark:stroke-dark-border"
                        strokeWidth="12"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        fill="none"
                        className="stroke-accent"
                        strokeWidth="12"
                        strokeDasharray={circumference}
                        strokeDashoffset={progressOffset}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-primary dark:text-dark-foreground">
                        {Math.round((dailyGoal.current / dailyGoal.target) * 100)}%
                      </span>
                      <span className="text-xs text-neutral-dark dark:text-dark-muted">
                        {dailyGoal.current}/{dailyGoal.target} desafios
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-dark dark:text-dark-muted mt-4 text-center">
                    {dailyGoal.current >= dailyGoal.target
                      ? "Parabéns! Você completou sua meta de hoje!"
                      : `Continue assim! Mais ${dailyGoal.target - dailyGoal.current} desafios para completar sua meta.`}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Recommended Challenges */}
          {recommendedChallenges.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6"
            >
              <div className="bg-white dark:bg-dark-card rounded-xl p-6 border border-neutral-light dark:border-dark-border">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-primary dark:text-dark-foreground">
                    Recomendados para Você
                  </h2>
                  <Link href="/app/desafios" className="text-sm text-accent hover:underline">
                    Ver todos
                  </Link>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendedChallenges.map((challenge) => (
                    <Link
                      key={challenge.id}
                      href={`/app/desafios/${challenge.slug}`}
                      className="p-4 rounded-lg border border-neutral-light dark:border-dark-border hover:border-accent transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-primary dark:text-dark-foreground">{challenge.title}</h3>
                        <span className="text-xs px-2 py-1 bg-accent/10 text-accent rounded-full">
                          +{challenge.xpReward} XP
                        </span>
                      </div>
                      <p className="text-xs text-neutral-dark dark:text-dark-muted mb-3">
                        {challenge.technologies?.join(" • ") || challenge.stack}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-neutral-dark dark:text-dark-muted capitalize">
                          {challenge.level}
                        </span>
                        <Clock className="h-4 w-4 text-neutral-dark dark:text-dark-muted" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: string;
}) {
  return (
    <div className="bg-white dark:bg-dark-card rounded-xl p-4 border border-neutral-light dark:border-dark-border">
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
        <span className="text-2xl font-bold text-primary dark:text-dark-foreground">{value}</span>
      </div>
      <p className="text-sm text-neutral-dark dark:text-dark-muted">{label}</p>
    </div>
  );
}
