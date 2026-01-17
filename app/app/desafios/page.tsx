"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { ChallengeCard } from "@/components/app/desafios/ChallengeCard";
import { getChallenges, type Challenge } from "@/lib/api";

interface ChallengeWithProgress extends Challenge {
  userProgress?: {
    status: "not_started" | "in_progress" | "completed";
    percentage: number;
  };
}

/**
 * Página de listagem de desafios
 */
export default function DesafiosPage() {
  const [search, setSearch] = useState("");
  const [selectedStack, setSelectedStack] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [challenges, setChallenges] = useState<ChallengeWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        setErrorMessage(null);
        const response = await getChallenges({
          page,
          size: 20,
          stack: selectedStack !== "all" ? selectedStack.toUpperCase() : undefined,
          level: selectedLevel !== "all" ? selectedLevel.toUpperCase() : undefined,
          search: search || undefined,
        });
        setChallenges(
          response.content.map((c) => ({
            ...c,
            userProgress: c.featured
              ? { status: "not_started" as const, percentage: 0 }
              : undefined,
          }))
        );
        setTotalElements(response.totalElements);
      } catch (error) {
        console.error("Failed to fetch challenges:", error);
        setChallenges([]);
        setTotalElements(0);
        setErrorMessage("Nao foi possivel carregar os desafios. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, [page, selectedStack, selectedLevel, search]);

  const stacks = [
    { value: "all", label: "Todas" },
    { value: "frontend", label: "Frontend" },
    { value: "backend", label: "Backend" },
    { value: "mobile", label: "Mobile" },
    { value: "devops", label: "DevOps" },
    { value: "iot", label: "IoT" },
    { value: "data", label: "Data" },
  ];

  const levels = [
    { value: "all", label: "Todos" },
    { value: "beginner", label: "Iniciante" },
    { value: "junior", label: "Júnior" },
    { value: "mid", label: "Pleno" },
    { value: "senior", label: "Sênior" },
    { value: "expert", label: "Especialista" },
  ];

  // Debounced search to avoid too many API calls
  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary dark:text-dark-foreground mb-2">
          Desafios de Código
        </h1>
        <p className="text-neutral-dark dark:text-dark-muted">
          Pratique com desafios reais e evolua suas habilidades
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-dark-card rounded-xl p-4 border border-neutral-light dark:border-dark-border mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-dark dark:text-dark-muted" />
            <input
              type="text"
              placeholder="Buscar desafios ou tecnologias..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-neutral-light dark:border-dark-border bg-white dark:bg-dark-background text-neutral-dark dark:text-dark-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <select
              value={selectedStack}
              onChange={(e) => setSelectedStack(e.target.value)}
              className="px-4 py-2.5 rounded-lg border border-neutral-light dark:border-dark-border bg-white dark:bg-dark-background text-neutral-dark dark:text-dark-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {stacks.map((stack) => (
                <option key={stack.value} value={stack.value}>
                  {stack.label}
                </option>
              ))}
            </select>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-2.5 rounded-lg border border-neutral-light dark:border-dark-border bg-white dark:bg-dark-background text-neutral-dark dark:text-dark-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {levels.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active filters */}
        {(selectedStack !== "all" || selectedLevel !== "all" || search) && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-neutral-light dark:border-dark-border">
            <span className="text-sm text-neutral-dark dark:text-dark-muted">Filtros ativos:</span>
            {selectedStack !== "all" && (
              <button
                onClick={() => setSelectedStack("all")}
                className="text-xs px-2 py-1 bg-accent/10 text-accent rounded-full flex items-center gap-1"
              >
                {stacks.find((s) => s.value === selectedStack)?.label}
                <span>×</span>
              </button>
            )}
            {selectedLevel !== "all" && (
              <button
                onClick={() => setSelectedLevel("all")}
                className="text-xs px-2 py-1 bg-accent/10 text-accent rounded-full flex items-center gap-1"
              >
                {levels.find((l) => l.value === selectedLevel)?.label}
                <span>×</span>
              </button>
            )}
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-xs px-2 py-1 bg-accent/10 text-accent rounded-full flex items-center gap-1"
              >
                "{search}"
                <span>×</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results */}
      <div className="mb-4">
        <p className="text-sm text-neutral-dark dark:text-dark-muted">
          Mostrando <span className="font-semibold text-primary dark:text-dark-foreground">{challenges.length}</span> de {totalElements} desafios
        </p>
        {errorMessage && (
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-200">
            {errorMessage}
          </div>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
        </div>
      ) : challenges.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {challenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              id={challenge.id}
              title={challenge.title}
              slug={challenge.slug}
              shortDescription={challenge.shortDescription}
              stack={challenge.stack}
              level={challenge.level}
              difficulty={challenge.difficulty}
              technologies={challenge.technologies}
              xp={challenge.xpReward}
              estimatedTime={challenge.estimatedTimeMinutes}
              completedCount={challenge.completedCount}
              userProgress={challenge.userProgress}
            />
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-neutral-light dark:bg-dark-border rounded-full mb-4">
            <Search className="h-8 w-8 text-neutral-dark dark:text-dark-muted" />
          </div>
          <h3 className="text-lg font-semibold text-primary dark:text-dark-foreground mb-2">
            Nenhum desafio encontrado
          </h3>
          <p className="text-neutral-dark dark:text-dark-muted mb-4">
            Tente ajustar seus filtros ou termos de busca
          </p>
          <button
            onClick={() => {
              setSearch("");
              setSelectedStack("all");
              setSelectedLevel("all");
            }}
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors"
          >
            Limpar filtros
          </button>
        </div>
      )}
    </div>
  );
}
