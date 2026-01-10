'use client';

import { useState, useEffect } from 'react';
import { Trophy, Medal, Crown, TrendingUp, Eye } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getRanking } from '@/lib/api';
import type { RankingUser } from '@/lib/api';
import { useAuth } from '@/components/providers/AuthProvider';

export default function RankingPage() {
  const { user } = useAuth();
  const [ranking, setRanking] = useState<RankingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<'weekly' | 'monthly' | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'xp' | 'streak' | 'challenges'>('xp');

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const data = await getRanking(100);
        setRanking(data);
      } catch (error) {
        console.error('Failed to fetch ranking:', error);
        // Mock data fallback
        setRanking(generateMockRanking());
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, [timeFilter, categoryFilter]);

  const generateMockRanking = (): RankingUser[] => {
    const names = [
      { username: 'maria_dev', fullName: 'Maria Santos' },
      { username: 'pedro_code', fullName: 'Pedro Costa' },
      { username: 'ana_js', fullName: 'Ana Silva' },
      { username: 'carlos_full', fullName: 'Carlos Mendes' },
      { username: 'julia_beginner', fullName: 'Júlia Rocha' },
      { username: 'lucas_react', fullName: 'Lucas Ferreira' },
      { username: 'beatriz_dev', fullName: 'Beatriz Almeida' },
      { username: 'felipe_backend', fullName: 'Felipe Gomes' },
      { username: 'gabriela_ui', fullName: 'Gabriela Nunes' },
      { username: 'rafael_python', fullName: 'Rafael Torres' },
    ];

    return names.map((person, index) => ({
      id: String(index + 1),
      username: person.username,
      fullName: person.fullName,
      avatarUrl: `https://i.pravatar.cc/150?img=${index + 1}`,
      level: Math.floor(Math.random() * 20) + 1,
      xp: 5000 - index * 350,
      rank: index + 1,
    }));
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-700" />;
      default:
        return (
          <span className="w-6 h-6 flex items-center justify-center text-sm font-semibold text-neutral-500">
            {rank}
          </span>
        );
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-400 text-white';
      case 3:
        return 'bg-gradient-to-r from-amber-600 to-amber-800 text-white';
      default:
        return 'bg-neutral-100 dark:bg-dark-border text-neutral-600 dark:text-dark-muted';
    }
  };

  const currentUserRank = ranking.find((r) => r.id === user?.id);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary dark:text-dark-foreground mb-2">
          Ranking da Comunidade
        </h1>
        <p className="text-neutral-dark dark:text-dark-muted">
          Os melhores desenvolvedores da plataforma
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-dark-card rounded-xl p-4 border border-neutral-light dark:border-dark-border mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Time Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-dark dark:text-dark-muted">Período:</span>
            <div className="flex gap-1">
              {(['weekly', 'monthly', 'all'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTimeFilter(filter)}
                  className="px-3 py-1.5 text-sm rounded-lg capitalize transition-colors"
                >
                  {filter === 'all' ? 'Geral' : filter === 'weekly' ? 'Semana' : 'Mês'}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-dark dark:text-dark-muted">Categoria:</span>
            <div className="flex gap-1">
              {(['xp', 'streak', 'challenges'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setCategoryFilter(filter)}
                  className="px-3 py-1.5 text-sm rounded-lg capitalize transition-colors"
                >
                  {filter === 'xp' ? 'XP' : filter === 'streak' ? 'Streak' : 'Desafios'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Current User Rank Card */}
      {currentUserRank && currentUserRank.rank > 10 && (
        <div className="bg-accent/10 dark:bg-accent/20 rounded-xl p-4 border border-accent/20 dark:border-accent/30 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent text-white font-bold">
                {currentUserRank.rank}
              </div>
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.avatarUrl} alt={user?.username} />
                <AvatarFallback className="bg-accent text-white">
                  {user?.fullName?.split(' ').map((n) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-primary dark:text-dark-foreground">{user?.fullName}</p>
                <p className="text-sm text-neutral-dark dark:text-dark-muted">@{user?.username}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-accent">{currentUserRank.xp} XP</p>
              <p className="text-sm text-neutral-dark dark:text-dark-muted">Nível {currentUserRank.level}</p>
            </div>
          </div>
        </div>
      )}

      {/* Top 3 Podium */}
      {!loading && ranking.length >= 3 && (
        <div className="grid grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
          {/* 2nd Place */}
          <div className="flex flex-col items-center pt-8">
            <div className="relative">
              <Avatar className="h-20 w-20 ring-4 ring-gray-300">
                <AvatarImage src={ranking[1]?.avatarUrl} alt={ranking[1]?.username} />
                <AvatarFallback className="text-2xl bg-gray-200 text-gray-700">
                  {ranking[1]?.fullName?.split(' ').map((n) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 flex items-center justify-center bg-gradient-to-r from-gray-300 to-gray-400 rounded-full">
                <span className="text-white font-bold">2</span>
              </div>
            </div>
            <div className="text-center mt-4">
              <p className="font-semibold text-primary dark:text-dark-foreground">{ranking[1]?.fullName}</p>
              <p className="text-sm text-neutral-dark dark:text-dark-muted">@{ranking[1]?.username}</p>
              <p className="text-lg font-bold text-gray-600 mt-1">{ranking[1]?.xp} XP</p>
            </div>
            <div className="h-24 w-full bg-gradient-to-t from-gray-200 to-transparent rounded-t-lg mt-4" />
          </div>

          {/* 1st Place */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                <Crown className="h-8 w-8 text-yellow-500" />
              </div>
              <Avatar className="h-24 w-24 ring-4 ring-yellow-400">
                <AvatarImage src={ranking[0]?.avatarUrl} alt={ranking[0]?.username} />
                <AvatarFallback className="text-2xl bg-yellow-100 text-yellow-700">
                  {ranking[0]?.fullName?.split(' ').map((n) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 flex items-center justify-center bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full">
                <span className="text-white font-bold">1</span>
              </div>
            </div>
            <div className="text-center mt-4">
              <p className="font-bold text-xl text-primary dark:text-dark-foreground">{ranking[0]?.fullName}</p>
              <p className="text-sm text-neutral-dark dark:text-dark-muted">@{ranking[0]?.username}</p>
              <p className="text-xl font-bold text-yellow-600 mt-1">{ranking[0]?.xp} XP</p>
            </div>
            <div className="h-32 w-full bg-gradient-to-t from-yellow-300 to-transparent rounded-t-lg mt-4" />
          </div>

          {/* 3rd Place */}
          <div className="flex flex-col items-center pt-8">
            <div className="relative">
              <Avatar className="h-20 w-20 ring-4 ring-amber-700">
                <AvatarImage src={ranking[2]?.avatarUrl} alt={ranking[2]?.username} />
                <AvatarFallback className="text-2xl bg-amber-100 text-amber-700">
                  {ranking[2]?.fullName?.split(' ').map((n) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 flex items-center justify-center bg-gradient-to-r from-amber-600 to-amber-800 rounded-full">
                <span className="text-white font-bold">3</span>
              </div>
            </div>
            <div className="text-center mt-4">
              <p className="font-semibold text-primary dark:text-dark-foreground">{ranking[2]?.fullName}</p>
              <p className="text-sm text-neutral-dark dark:text-dark-muted">@{ranking[2]?.username}</p>
              <p className="text-lg font-bold text-amber-700 mt-1">{ranking[2]?.xp} XP</p>
            </div>
            <div className="h-16 w-full bg-gradient-to-t from-amber-700 to-transparent rounded-t-lg mt-4" />
          </div>
        </div>
      )}

      {/* Full Ranking List */}
      <div className="bg-white dark:bg-dark-card rounded-xl border border-neutral-light dark:border-dark-border overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-light dark:border-dark-border">
          <h2 className="font-semibold text-primary dark:text-dark-foreground">Classificação Completa</h2>
          <div className="flex items-center gap-2 text-sm text-neutral-dark dark:text-dark-muted">
            <TrendingUp className="h-4 w-4" />
            <span>Atualizado em tempo real</span>
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
          </div>
        ) : (
          <div className="divide-y divide-neutral-light dark:divide-dark-border">
            {ranking.map((userRank) => (
              <div
                key={userRank.id}
                className={`flex items-center gap-4 px-6 py-4 hover:bg-neutral-50 dark:hover:bg-dark-border/50 transition-colors ${
                  userRank.id === user?.id ? 'bg-accent/5 dark:bg-accent/10' : ''
                }`}
              >
                {/* Rank */}
                <div className="w-12 flex justify-center">{getRankIcon(userRank.rank)}</div>

                {/* User */}
                <Avatar className="h-12 w-12">
                  <AvatarImage src={userRank.avatarUrl} alt={userRank.username} />
                  <AvatarFallback className="bg-accent text-white">
                    {userRank.fullName?.split(' ').map((n) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-primary dark:text-dark-foreground">
                      {userRank.fullName}
                    </span>
                    {userRank.id === user?.id && (
                      <Badge variant="outline" className="text-xs">Você</Badge>
                    )}
                  </div>
                  <p className="text-sm text-neutral-dark dark:text-dark-muted">@{userRank.username}</p>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-lg font-bold text-accent">{userRank.xp}</p>
                    <p className="text-xs text-neutral-dark dark:text-dark-muted">XP</p>
                  </div>
                  <div className="text-center hidden sm:block">
                    <p className="text-lg font-semibold text-primary dark:text-dark-foreground">
                      {userRank.level}
                    </p>
                    <p className="text-xs text-neutral-dark dark:text-dark-muted">Nível</p>
                  </div>
                </div>

                {/* View Profile Link */}
                <a
                  href={`/app/portfolio/${userRank.username}`}
                  className="p-2 hover:bg-neutral-100 dark:hover:bg-dark-border rounded-lg transition-colors"
                  title="Ver perfil"
                >
                  <Eye className="h-5 w-5 text-neutral-dark dark:text-dark-muted" />
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && ranking.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="h-16 w-16 text-neutral-light dark:text-dark-border mx-auto mb-4" />
            <p className="text-neutral-dark dark:text-dark-muted">Ranking indisponível no momento</p>
          </div>
        )}
      </div>
    </div>
  );
}
