'use client';

import React, { useEffect, useState } from 'react';
import {
  Settings,
  MapPin,
  Link as LinkIcon,
  Github,
  Linkedin,
  Camera,
  Save,
  X,
  Bell,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/providers/AuthProvider';
import { refreshUser } from '@/lib/api';

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
  streakCurrent: number;
  streakBest: number;
  email: string;
}

type TabType = 'profile' | 'settings' | 'security';

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  useEffect(() => {
    if (user) {
      const userProfile: UserProfile = {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        bio: user.bio || '',
        avatarUrl: user.avatarUrl || '',
        location: '',
        websiteUrl: '',
        githubUrl: '',
        linkedinUrl: '',
        level: user.level,
        xp: Number(user.xp),
        streakCurrent: user.streakCurrent,
        streakBest: user.streakBest || 0,
        email: user.email,
      };
      setProfile(userProfile);
      setEditedProfile(userProfile);
      setLoading(false);
    }
  }, [user]);

  const handleSave = async () => {
    if (!editedProfile) return;

    setSaving(true);
    setMessage(null);

    try {
      // TODO: Call API to update profile
      // await updateProfile(editedProfile);
      setProfile(editedProfile);
      setEditing(false);
      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });

      // Refresh user data from API
      await refreshUser();
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao atualizar perfil. Tente novamente.' });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile!);
    setEditing(false);
    setMessage(null);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (passwordForm.new !== passwordForm.confirm) {
      setMessage({ type: 'error', text: 'As senhas não coincidem.' });
      return;
    }

    if (passwordForm.new.length < 8) {
      setMessage({ type: 'error', text: 'A senha deve ter no mínimo 8 caracteres.' });
      return;
    }

    setSaving(true);
    try {
      // TODO: Call API to change password
      // await changePassword(passwordForm.current, passwordForm.new);
      setMessage({ type: 'success', text: 'Senha alterada com sucesso!' });
      setPasswordForm({ current: '', new: '', confirm: '' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao alterar senha. Verifique sua senha atual.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
      </div>
    );
  }

  if (!profile || !editedProfile) return null;

  const xpToNextLevel = ((editedProfile.level + 1) * 1000) - editedProfile.xp;
  const currentLevelXp = editedProfile.xp - (editedProfile.level * 1000);
  const levelProgress = (currentLevelXp / 1000) * 100;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary dark:text-dark-foreground mb-2">
          Meu Perfil
        </h1>
        <p className="text-neutral-dark dark:text-dark-muted">
          Gerencie suas informações e configurações
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-neutral-light/30 dark:bg-dark-border/30 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('profile')}
          className={cn(
            'px-4 py-2 rounded-md text-sm font-medium transition-colors',
            activeTab === 'profile'
              ? 'bg-white dark:bg-dark-card text-primary dark:text-dark-foreground shadow-sm'
              : 'text-neutral-dark dark:text-dark-muted hover:text-primary dark:hover:text-dark-foreground'
          )}
        >
          Perfil
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={cn(
            'px-4 py-2 rounded-md text-sm font-medium transition-colors',
            activeTab === 'settings'
              ? 'bg-white dark:bg-dark-card text-primary dark:text-dark-foreground shadow-sm'
              : 'text-neutral-dark dark:text-dark-muted hover:text-primary dark:hover:text-dark-foreground'
          )}
        >
          Configurações
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={cn(
            'px-4 py-2 rounded-md text-sm font-medium transition-colors',
            activeTab === 'security'
              ? 'bg-white dark:bg-dark-card text-primary dark:text-dark-foreground shadow-sm'
              : 'text-neutral-dark dark:text-dark-muted hover:text-primary dark:hover:text-dark-foreground'
          )}
        >
          Segurança
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="space-y-6 max-w-4xl">
          {/* Profile Card */}
          <div className="bg-white dark:bg-dark-card rounded-xl border border-neutral-light dark:border-dark-border overflow-hidden">
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
                    <AvatarImage src={editedProfile.avatarUrl} alt={editedProfile.username} />
                    <AvatarFallback className="text-2xl bg-accent text-white">
                      {editedProfile.fullName
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
                      <h2 className="text-2xl font-bold text-primary dark:text-dark-foreground">
                        {editedProfile.fullName}
                      </h2>
                      <p className="text-neutral-dark dark:text-dark-muted">@{editedProfile.username}</p>
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
                        <Button onClick={handleSave} disabled={saving} className="gap-2">
                          <Save className="h-4 w-4" />
                          {saving ? 'Salvando...' : 'Salvar'}
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 p-4 bg-neutral-light/30 dark:bg-dark-background rounded-lg">
                <div className="text-center">
                  <p className="text-2xl font-bold text-accent">{editedProfile.level}</p>
                  <p className="text-sm text-neutral-dark dark:text-dark-muted">Nível</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-accent">{editedProfile.xp.toLocaleString()}</p>
                  <p className="text-sm text-neutral-dark dark:text-dark-muted">XP Total</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-accent">{editedProfile.streakCurrent}</p>
                  <p className="text-sm text-neutral-dark dark:text-dark-muted">Streak Atual</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-accent">{editedProfile.streakBest}</p>
                  <p className="text-sm text-neutral-dark dark:text-dark-muted">Melhor Streak</p>
                </div>
              </div>

              {/* Level Progress */}
              <div className="mt-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-neutral-dark dark:text-dark-muted">
                    Progresso para o Nível {editedProfile.level + 1}
                  </span>
                  <span className="text-neutral-dark dark:text-dark-muted">
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

              {/* Message */}
              {message && (
                <div className={cn(
                  'mt-4 p-3 rounded-lg',
                  message.type === 'success'
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                )}>
                  {message.text}
                </div>
              )}

              {/* Editable Fields */}
              <div className="mt-8 space-y-6">
                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-primary dark:text-dark-foreground mb-2">
                    Bio
                  </label>
                  {editing ? (
                    <Textarea
                      value={editedProfile.bio}
                      onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                      rows={3}
                      className="w-full"
                      placeholder="Conte um pouco sobre você..."
                    />
                  ) : (
                    <p className="text-neutral-700 dark:text-dark-foreground">{profile.bio || 'Sem bio ainda'}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-primary dark:text-dark-foreground mb-2">
                    Email
                  </label>
                  {editing ? (
                    <Input
                      type="email"
                      value={editedProfile.email}
                      onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                    />
                  ) : (
                    <p className="text-neutral-700 dark:text-dark-foreground">{profile.email}</p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-primary dark:text-dark-foreground mb-2">
                    Localização
                  </label>
                  {editing ? (
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                      <Input
                        value={editedProfile.location}
                        onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                        className="pl-10"
                        placeholder="São Paulo, Brasil"
                      />
                    </div>
                  ) : (
                    <p className="text-neutral-700 dark:text-dark-foreground flex items-center gap-2">
                      {profile.location && (
                        <>
                          <MapPin className="h-4 w-4 text-neutral-400" />
                          {profile.location}
                        </>
                      ) || <span className="text-neutral-400">Não informado</span>}
                    </p>
                  )}
                </div>

                {/* Website */}
                <div>
                  <label className="block text-sm font-medium text-primary dark:text-dark-foreground mb-2">
                    Website
                  </label>
                  {editing ? (
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                      <Input
                        type="url"
                        value={editedProfile.websiteUrl}
                        onChange={(e) => setEditedProfile({ ...editedProfile, websiteUrl: e.target.value })}
                        className="pl-10"
                        placeholder="https://seusite.com"
                      />
                    </div>
                  ) : (
                    <p className="text-neutral-700 dark:text-dark-foreground flex items-center gap-2">
                      {profile.websiteUrl && (
                        <>
                          <LinkIcon className="h-4 w-4 text-neutral-400" />
                          <a href={profile.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-accent">
                            {profile.websiteUrl}
                          </a>
                        </>
                      ) || <span className="text-neutral-400">Não informado</span>}
                    </p>
                  )}
                </div>

                {/* GitHub */}
                <div>
                  <label className="block text-sm font-medium text-primary dark:text-dark-foreground mb-2">
                    GitHub
                  </label>
                  {editing ? (
                    <div className="relative">
                      <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                      <Input
                        type="url"
                        value={editedProfile.githubUrl}
                        onChange={(e) => setEditedProfile({ ...editedProfile, githubUrl: e.target.value })}
                        className="pl-10"
                        placeholder="https://github.com/usuario"
                      />
                    </div>
                  ) : (
                    <p className="text-neutral-700 dark:text-dark-foreground flex items-center gap-2">
                      {profile.githubUrl && (
                        <>
                          <Github className="h-4 w-4 text-neutral-400" />
                          <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="text-accent">
                            {profile.githubUrl}
                          </a>
                        </>
                      ) || <span className="text-neutral-400">Não informado</span>}
                    </p>
                  )}
                </div>

                {/* LinkedIn */}
                <div>
                  <label className="block text-sm font-medium text-primary dark:text-dark-foreground mb-2">
                    LinkedIn
                  </label>
                  {editing ? (
                    <div className="relative">
                      <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                      <Input
                        type="url"
                        value={editedProfile.linkedinUrl}
                        onChange={(e) => setEditedProfile({ ...editedProfile, linkedinUrl: e.target.value })}
                        className="pl-10"
                        placeholder="https://linkedin.com/in/usuario"
                      />
                    </div>
                  ) : (
                    <p className="text-neutral-700 dark:text-dark-foreground flex items-center gap-2">
                      {profile.linkedinUrl && (
                        <>
                          <Linkedin className="h-4 w-4 text-neutral-400" />
                          <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-accent">
                            {profile.linkedinUrl}
                          </a>
                        </>
                      ) || <span className="text-neutral-400">Não informado</span>}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Achievements Section */}
          <div className="bg-white dark:bg-dark-card rounded-xl border border-neutral-light dark:border-dark-border p-6">
            <h3 className="text-xl font-bold text-primary dark:text-dark-foreground mb-4">
              Conquistas
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Primeiro Desafio', icon: '🎯', unlocked: true },
                { name: 'Streak 7 Dias', icon: '🔥', unlocked: profile.streakCurrent >= 7 },
                { name: '1000 XP', icon: '⭐', unlocked: profile.xp >= 1000 },
                { name: 'Streak 30 Dias', icon: '💯', unlocked: profile.streakBest >= 30 },
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
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6 max-w-4xl">
          <div className="bg-white dark:bg-dark-card rounded-xl border border-neutral-light dark:border-dark-border p-6">
            <h3 className="text-lg font-semibold text-primary dark:text-dark-foreground mb-4">
              Preferências de Notificação
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Desafios concluídos', desc: 'Receba alertas quando completar um desafio' },
                { label: 'Novos desafios', desc: 'Seja notificado sobre novos desafios na sua área' },
                { label: 'Streak lembrete', desc: 'Lembretes diários para manter seu streak' },
                { label: 'Atualizações da plataforma', desc: 'Novidades e melhorias no Compila.dev' },
              ].map((setting, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-neutral-light dark:border-dark-border last:border-0">
                  <div>
                    <p className="font-medium text-primary dark:text-dark-foreground">{setting.label}</p>
                    <p className="text-sm text-neutral-dark dark:text-dark-muted">{setting.desc}</p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-accent transition-colors">
                    <span className="inline-block h-4 w-4 transform translate-x-6 rounded-full bg-white transition" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-dark-card rounded-xl border border-neutral-light dark:border-dark-border p-6">
            <h3 className="text-lg font-semibold text-primary dark:text-dark-foreground mb-4">
              Preferências de Código
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary dark:text-dark-foreground mb-2">
                  Tema do Editor
                </label>
                <select className="w-full px-4 py-2 rounded-lg border border-neutral-light dark:border-dark-border bg-white dark:bg-dark-background">
                  <option value="dark">Escuro (VS Code Dark)</option>
                  <option value="light">Claro (VS Code Light)</option>
                  <option value="monokai">Monokai</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-primary dark:text-dark-foreground mb-2">
                  Tamanho da Fonte
                </label>
                <select className="w-full px-4 py-2 rounded-lg border border-neutral-light dark:border-dark-border bg-white dark:bg-dark-background">
                  <option value="12">Pequena (12px)</option>
                  <option value="14">Normal (14px)</option>
                  <option value="16">Grande (16px)</option>
                  <option value="18">Extra Grande (18px)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-primary dark:text-dark-foreground mb-2">
                  Linguagem Preferida
                </label>
                <select className="w-full px-4 py-2 rounded-lg border border-neutral-light dark:border-dark-border bg-white dark:bg-dark-background">
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6 max-w-4xl">
          <div className="bg-white dark:bg-dark-card rounded-xl border border-neutral-light dark:border-dark-border p-6">
            <h3 className="text-lg font-semibold text-primary dark:text-dark-foreground mb-4">
              Alterar Senha
            </h3>

            {message && (
              <div className={cn(
                'mb-4 p-3 rounded-lg',
                message.type === 'success'
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                  : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
              )}>
                {message.text}
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-primary dark:text-dark-foreground mb-2">
                  Senha Atual
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordForm.current}
                    onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4 text-neutral-400" /> : <Eye className="h-4 w-4 text-neutral-400" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-primary dark:text-dark-foreground mb-2">
                  Nova Senha
                </label>
                <Input
                  type="password"
                  value={passwordForm.new}
                  onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                  required
                  minLength={8}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary dark:text-dark-foreground mb-2">
                  Confirmar Nova Senha
                </label>
                <Input
                  type="password"
                  value={passwordForm.confirm}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                  required
                  minLength={8}
                />
              </div>
              <Button
                type="submit"
                disabled={saving}
                className="bg-accent hover:bg-accent/90 text-white"
              >
                {saving ? 'Alterando...' : 'Alterar Senha'}
              </Button>
            </form>
          </div>

          <div className="bg-white dark:bg-dark-card rounded-xl border border-neutral-light dark:border-dark-border p-6">
            <h3 className="text-lg font-semibold text-primary dark:text-dark-foreground mb-4">
              Conexões Autorizadas
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-neutral-light dark:border-dark-border">
                <div className="flex items-center gap-3">
                  <Github className="h-8 w-8" />
                  <div>
                    <p className="font-medium text-primary dark:text-dark-foreground">GitHub</p>
                    <p className="text-sm text-neutral-dark dark:text-dark-muted">Conectado como @{user?.username || 'usuario'}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm rounded-full">
                  Conectado
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">G</span>
                  </div>
                  <div>
                    <p className="font-medium text-primary dark:text-dark-foreground">Google</p>
                    <p className="text-sm text-neutral-dark dark:text-dark-muted">Não conectado</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Conectar
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-card rounded-xl border border-neutral-light dark:border-dark-border p-6">
            <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">
              Zona de Perigo
            </h3>
            <p className="text-neutral-dark dark:text-dark-muted mb-4">
              Uma vez excluída, sua conta não poderá ser recuperada.
            </p>
            <Button variant="destructive">
              Excluir Minha Conta
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
