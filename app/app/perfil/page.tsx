'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Settings,
  MapPin,
  Link as LinkIcon,
  Github,
  Linkedin,
  Camera,
  Save,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  bio: string;
  avatarUrl: string;
  location: string;
  websiteUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  level: number;
  xp: number;
  streakCurrent: string;
  streakBest: number;
  email: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    // TODO: Fetch user from auth context / API
    const mockUser: UserProfile = {
      id: '1',
      username: 'joaosilva',
      fullName: 'João Silva',
      bio: 'Desenvolvedor Full Stack apaixonado por React e Node.js. Sempre aprendendo e compartilhando conhecimento.',
      avatarUrl: 'https://i.pravatar.cc/150?img=11',
      location: 'São Paulo, Brasil',
      websiteUrl: 'https://joaosilva.dev',
      githubUrl: 'https://github.com/joaosilva',
      linkedinUrl: 'https://linkedin.com/in/joaosilva',
      level: 12,
      xp: 12450,
      streakCurrent: '7',
      streakBest: 30,
      email: 'joao@silva.com',
    };

    setTimeout(() => {
      setUser(mockUser);
      setEditedUser(mockUser);
      setLoading(false);
    }, 500);
  }, []);

  const handleSave = () => {
    // TODO: Save to API
    setUser(editedUser!);
    setEditing(false);
  };

  const handleCancel = () => {
    setEditedUser(user!);
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
      </div>
    );
  }

  if (!user || !editedUser) return null;

  const xpToNextLevel = (editedUser.level + 1) * 1000 - editedUser.xp;
  const currentLevelXp = editedUser.xp - editedUser.level * 1000;
  const levelProgress = (currentLevelXp / 1000) * 100;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-dark-bg">
      {/* Header */}
      <header className="bg-white dark:bg-dark-card border-b border-neutral-200 dark:border-dark-border">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-dark-foreground">
            Meu Perfil
          </h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Profile Card */}
        <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg overflow-hidden">
          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-primary to-accent relative">
            {editing && (
              <button className="absolute top-4 right-4 p-2 bg-black/30 hover:bg-black/50 rounded-lg text-white">
                <Camera className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Profile Info */}
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row gap-6 -mt-12">
              {/* Avatar */}
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-white dark:border-dark-card">
                  <AvatarImage src={editedUser.avatarUrl} alt={editedUser.username} />
                  <AvatarFallback className="text-2xl bg-accent text-white">
                    {editedUser.fullName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                {editing && (
                  <button className="absolute bottom-0 right-0 p-1.5 bg-accent text-white rounded-full hover:bg-accent/90">
                    <Camera className="h-3 w-3" />
                  </button>
                )}
              </div>

              {/* Name & Actions */}
              <div className="flex-1 pt-2">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-dark-foreground">
                      {editedUser.fullName}
                    </h2>
                    <p className="text-neutral-600 dark:text-dark-muted">@{editedUser.username}</p>
                  </div>
                  {!editing ? (
                    <Button
                      onClick={() => setEditing(true)}
                      variant="outline"
                      className="gap-2"
                    >
                      <Settings className="h-4 w-4" />
                      Editar Perfil
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={handleSave} className="gap-2">
                        <Save className="h-4 w-4" />
                        Salvar
                      </Button>
                      <Button onClick={handleCancel} variant="outline" className="gap-2">
                        <X className="h-4 w-4" />
                        Cancelar
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 p-4 bg-neutral-50 dark:bg-dark-bg rounded-lg">
              <div className="text-center">
                <p className="text-2xl font-bold text-accent">{editedUser.level}</p>
                <p className="text-sm text-neutral-600 dark:text-dark-muted">Nível</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-accent">{editedUser.xp.toLocaleString()}</p>
                <p className="text-sm text-neutral-600 dark:text-dark-muted">XP Total</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-accent">{editedUser.streakCurrent}</p>
                <p className="text-sm text-neutral-600 dark:text-dark-muted">Streak Atual</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-accent">{editedUser.streakBest}</p>
                <p className="text-sm text-neutral-600 dark:text-dark-muted">Melhor Streak</p>
              </div>
            </div>

            {/* Level Progress */}
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-neutral-600 dark:text-dark-muted">
                  Progresso para o Nível {editedUser.level + 1}
                </span>
                <span className="text-neutral-600 dark:text-dark-muted">
                  {xpToNextLevel} XP restantes
                </span>
              </div>
              <div className="h-3 bg-neutral-200 dark:bg-dark-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent to-primary rounded-full transition-all duration-500"
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
            </div>

            {/* Editable Fields */}
            <div className="mt-8 space-y-6">
              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-dark-foreground mb-2">
                  Bio
                </label>
                {editing ? (
                  <Textarea
                    value={editedUser.bio}
                    onChange={(e) => setEditedUser({ ...editedUser, bio: e.target.value })}
                    rows={3}
                    className="w-full"
                  />
                ) : (
                  <p className="text-neutral-700 dark:text-dark-foreground">{user.bio}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-dark-foreground mb-2">
                  Email
                </label>
                {editing ? (
                  <Input
                    type="email"
                    value={editedUser.email}
                    onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                  />
                ) : (
                  <p className="text-neutral-700 dark:text-dark-foreground">{user.email}</p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-dark-foreground mb-2">
                  Localização
                </label>
                {editing ? (
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <Input
                      value={editedUser.location}
                      onChange={(e) => setEditedUser({ ...editedUser, location: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                ) : (
                  <p className="text-neutral-700 dark:text-dark-foreground flex items-center gap-2">
                    {user.location && (
                      <>
                        <MapPin className="h-4 w-4 text-neutral-400" />
                        {user.location}
                      </>
                    )}
                  </p>
                )}
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-dark-foreground mb-2">
                  Website
                </label>
                {editing ? (
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <Input
                      type="url"
                      value={editedUser.websiteUrl}
                      onChange={(e) => setEditedUser({ ...editedUser, websiteUrl: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                ) : (
                  <p className="text-neutral-700 dark:text-dark-foreground flex items-center gap-2">
                    {user.websiteUrl && (
                      <>
                        <LinkIcon className="h-4 w-4 text-neutral-400" />
                        <a href={user.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-accent">
                          {user.websiteUrl}
                        </a>
                      </>
                    )}
                  </p>
                )}
              </div>

              {/* GitHub */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-dark-foreground mb-2">
                  GitHub
                </label>
                {editing ? (
                  <div className="relative">
                    <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <Input
                      type="url"
                      value={editedUser.githubUrl}
                      onChange={(e) => setEditedUser({ ...editedUser, githubUrl: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                ) : (
                  <p className="text-neutral-700 dark:text-dark-foreground flex items-center gap-2">
                    {user.githubUrl && (
                      <>
                        <Github className="h-4 w-4 text-neutral-400" />
                        <a href={user.githubUrl} target="_blank" rel="noopener noreferrer" className="text-accent">
                          {user.githubUrl}
                        </a>
                      </>
                    )}
                  </p>
                )}
              </div>

              {/* LinkedIn */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-dark-foreground mb-2">
                  LinkedIn
                </label>
                {editing ? (
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <Input
                      type="url"
                      value={editedUser.linkedinUrl}
                      onChange={(e) => setEditedUser({ ...editedUser, linkedinUrl: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                ) : (
                  <p className="text-neutral-700 dark:text-dark-foreground flex items-center gap-2">
                    {user.linkedinUrl && (
                      <>
                        <Linkedin className="h-4 w-4 text-neutral-400" />
                        <a href={user.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-accent">
                          {user.linkedinUrl}
                        </a>
                      </>
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6 mt-8">
          <h3 className="text-xl font-bold text-neutral-900 dark:text-dark-foreground mb-4">
            Conquistas
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Primeiro Desafio', icon: '🎯', unlocked: true },
              { name: 'Streak 7 Dias', icon: '🔥', unlocked: true },
              { name: '1000 XP', icon: '⭐', unlocked: true },
              { name: 'Streak 30 Dias', icon: '💯', unlocked: false },
            ].map((badge) => (
              <div
                key={badge.name}
                className={cn(
                  'p-4 rounded-lg text-center',
                  badge.unlocked
                    ? 'bg-yellow-50 dark:bg-yellow-900/20'
                    : 'bg-neutral-100 dark:bg-dark-border opacity-50'
                )}
              >
                <div className="text-3xl mb-2">{badge.icon}</div>
                <p className="text-sm font-medium">{badge.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
