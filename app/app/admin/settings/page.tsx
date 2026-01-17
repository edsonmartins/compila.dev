'use client';

import React, { useState } from 'react';
import {
  Settings,
  Bell,
  Shield,
  Palette,
  Database,
  Mail,
  Users,
  Save,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { AdminLayout } from '@/components/app/admin/AdminLayout';

export default function AdminSettingsPage() {
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Simulate save
    setTimeout(() => {
      setSaving(false);
    }, 1000);
  };

  const handleReset = () => {
    // Reset to defaults
    console.log('Reset settings');
  };

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-dark-foreground">
          Configurações da Plataforma
        </h2>
        <p className="text-neutral-600 dark:text-dark-muted mt-1">
          Gerencie as configurações do sistema
        </p>
      </div>

      <div className="space-y-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configurações Gerais
            </CardTitle>
            <CardDescription>
              Configurações básicas da plataforma
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="site-name">Nome do Site</Label>
                <Input id="site-name" defaultValue="Compila.dev" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-url">URL do Site</Label>
                <Input id="site-url" defaultValue="https://compila.dev" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="site-description">Descrição</Label>
              <Textarea
                id="site-description"
                defaultValue="Plataforma de aprendizado de programação com desafios práticos e gamificação."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="default-language">Idioma Padrão</Label>
              <Select defaultValue="pt-BR">
                <SelectTrigger id="default-language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="es-ES">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* User Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Configurações de Usuário
            </CardTitle>
            <CardDescription>
              Gerencie as configurações padrão para novos usuários
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Verificação de Email Obrigatória</Label>
                <p className="text-sm text-neutral-500 dark:text-dark-muted">
                  Exige que usuários verifiquem o email antes de acessar
                </p>
              </div>
              <Switch defaultChecked={false} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Perfil Público por Padrão</Label>
                <p className="text-sm text-neutral-500 dark:text-dark-muted">
                  Novos usuários têm perfil público por padrão
                </p>
              </div>
              <Switch defaultChecked={true} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Auto-share de Conquistas</Label>
                <p className="text-sm text-neutral-500 dark:text-dark-muted">
                  Posta automaticamente no feed ao completar desafios
                </p>
              </div>
              <Switch defaultChecked={false} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="default-xp">XP Inicial</Label>
              <Input id="default-xp" type="number" defaultValue="0" min="0" />
              <p className="text-sm text-neutral-500 dark:text-dark-muted">
                XP dado para novos usuários ao se cadastrarem
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Configurações de Email
            </CardTitle>
            <CardDescription>
              Configure o servidor de email para notificações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtp-host">Servidor SMTP</Label>
                <Input id="smtp-host" placeholder="smtp.example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp-port">Porta</Label>
                <Input id="smtp-port" type="number" defaultValue="587" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtp-user">Usuário</Label>
                <Input id="smtp-user" placeholder="noreply@compila.dev" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp-password">Senha</Label>
                <Input id="smtp-password" type="password" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-from">Email de Remetente</Label>
              <Input id="email-from" defaultValue="noreply@compila.dev" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Email de Boas-vindas</Label>
                <p className="text-sm text-neutral-500 dark:text-dark-muted">
                  Envia email de boas-vindas para novos usuários
                </p>
              </div>
              <Switch defaultChecked={true} />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificações
            </CardTitle>
            <CardDescription>
              Configure as notificações do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Notificações de Desafios</Label>
                <p className="text-sm text-neutral-500 dark:text-dark-muted">
                  Novos desafios disponíveis
                </p>
              </div>
              <Switch defaultChecked={true} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Notificações de Conquistas</Label>
                <p className="text-sm text-neutral-500 dark:text-dark-muted">
                  Badges e conquistas desbloqueadas
                </p>
              </div>
              <Switch defaultChecked={true} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Notificações do Feed</Label>
                <p className="text-sm text-neutral-500 dark:text-dark-muted">
                  Respostas, kudos e menções
                </p>
              </div>
              <Switch defaultChecked={true} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Notificações de Ranking</Label>
                <p className="text-sm text-neutral-500 dark:text-dark-muted">
                  Mudanças no ranking semanal
                </p>
              </div>
              <Switch defaultChecked={false} />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Segurança
            </CardTitle>
            <CardDescription>
              Configure as opções de segurança da plataforma
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Autenticação de Dois Fatores</Label>
                <p className="text-sm text-neutral-500 dark:text-dark-muted">
                  Permite usuários ativarem 2FA
                </p>
              </div>
              <Switch defaultChecked={false} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Login Social</Label>
                <p className="text-sm text-neutral-500 dark:text-dark-muted">
                  Habilita login via Google, GitHub, etc.
                </p>
              </div>
              <Switch defaultChecked={true} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="session-timeout">Tempo de Sessão (minutos)</Label>
              <Input id="session-timeout" type="number" defaultValue="4320" min="5" />
              <p className="text-sm text-neutral-500 dark:text-dark-muted">
                Tempo antes da sessão expirar (padrão: 72 horas)
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-login-attempts">Tentativas Máximas de Login</Label>
              <Input id="max-login-attempts" type="number" defaultValue="5" min="1" />
              <p className="text-sm text-neutral-500 dark:text-dark-muted">
                Bloqueia temporariamente após este número de tentativas
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Aparência
            </CardTitle>
            <CardDescription>
              Configure as cores e tema da plataforma
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Modo Escuro</Label>
                <p className="text-sm text-neutral-500 dark:text-dark-muted">
                  Permite usuários alternarem para modo escuro
                </p>
              </div>
              <Switch defaultChecked={true} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="primary-color">Cor Primária</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="primary-color"
                  type="color"
                  defaultValue="#6366f1"
                  className="w-20 h-10"
                />
                <Input defaultValue="#6366f1" className="flex-1" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="accent-color">Cor de Destaque</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="accent-color"
                  type="color"
                  defaultValue="#f59e0b"
                  className="w-20 h-10"
                />
                <Input defaultValue="#f59e0b" className="flex-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Actions */}
        <div className="flex items-center justify-end gap-3 p-4 bg-white dark:bg-dark-card rounded-lg border border-neutral-200 dark:border-dark-border">
          <Button variant="outline" onClick={handleReset} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Restaurar Padrões
          </Button>
          <Button onClick={handleSave} disabled={saving} className="gap-2 bg-accent hover:bg-accent/90">
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Salvar Alterações
              </>
            )}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
