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
  const [page, setPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
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
        // Fallback to mock data for development
        setChallenges([
          {
            id: "1",
            title: "Dashboard Analytics",
            slug: "dashboard-analytics",
            shortDescription: "Crie um dashboard interativo com gráficos usando React e Recharts.",
            description: "Desafio completo de dashboard com gráficos interativos, tabelas e filtros.",
            stack: "frontend",
            level: "junior",
            difficulty: 3,
            technologies: ["React", "TypeScript", "Recharts"],
            xpReward: 120,
            estimatedTimeMinutes: 120,
            completedCount: 234,
            featured: false,
            userProgress: {
              status: "in_progress" as const,
              percentage: 45,
            },
          },
          {
            id: "2",
            title: "API REST com Spring Boot",
            slug: "api-rest-spring",
            shortDescription: "Construa uma API RESTful completa usando Spring Boot e PostgreSQL.",
            description: "Crie endpoints CRUD, validação, autenticação e testes automatizados.",
            stack: "backend",
            level: "junior",
            difficulty: 3,
            technologies: ["Java", "Spring Boot", "PostgreSQL"],
            xpReward: 150,
            estimatedTimeMinutes: 180,
            completedCount: 156,
            featured: false,
          },
          {
            id: "3",
            title: "Todo List com React Hooks",
            slug: "todo-list-hooks",
            shortDescription: "Implemente uma lista de tarefas completa usando useState e useEffect.",
            description: "App de todo list com CRUD, filtros e persistência local.",
            stack: "frontend",
            level: "beginner",
            difficulty: 1,
            technologies: ["React", "TypeScript"],
            xpReward: 50,
            estimatedTimeMinutes: 45,
            completedCount: 892,
            featured: false,
            userProgress: {
              status: "completed" as const,
              percentage: 100,
            },
          },
          {
            id: "4",
            title: "Autenticação JWT",
            slug: "auth-jwt",
            shortDescription: "Implemente autenticação JWT com refresh tokens e OAuth.",
            description: "Sistema de autenticação completo com login, registro e refresh tokens.",
            stack: "backend",
            level: "mid",
            difficulty: 4,
            technologies: ["Node.js", "Express", "JWT"],
            xpReward: 180,
            estimatedTimeMinutes: 150,
            completedCount: 67,
            featured: false,
          },
          {
            id: "5",
            title: "App Clima com Flutter",
            slug: "weather-app-flutter",
            shortDescription: "Crie um app de previsão do tempo usando a API OpenWeather.",
            description: "App mobile com widgets, busca por cidade e forecast de 5 dias.",
            stack: "mobile",
            level: "junior",
            difficulty: 2,
            technologies: ["Flutter", "Dart", "HTTP"],
            xpReward: 100,
            estimatedTimeMinutes: 90,
            completedCount: 123,
            featured: false,
          },
          {
            id: "6",
            title: "Docker-compose para Microserviços",
            slug: "docker-microservices",
            shortDescription: "Orquestre múltiplos containers com Docker Compose.",
            description: "Arquitetura de microserviços com Docker, networks e volumes.",
            stack: "devops",
            level: "mid",
            difficulty: 4,
            technologies: ["Docker", "nginx", "Redis"],
            xpReward: 160,
            estimatedTimeMinutes: 120,
            completedCount: 45,
            featured: false,
          },
        ]);
        setTotalElements(6);
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
