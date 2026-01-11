'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Trash2,
  Check,
  Code,
  Server,
  Smartphone,
  Wrench,
  Database,
  Wrench as Tool,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
  getMySkills,
  getVerifiedSkills,
  getManualSkills,
  addSkill,
  updateSkillLevel,
  removeSkill,
  UserSkill,
  TechnologyType,
  ProficiencyLevel,
  TECHNOLOGY_CONFIG,
  PROFICIENCY_LABELS,
  SkillStats,
  getSkillStats,
} from '@/lib/api/skills';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  frontend: <Code className="h-4 w-4" />,
  backend: <Server className="h-4 w-4" />,
  mobile: <Smartphone className="h-4 w-4" />,
  devops: <Wrench className="h-4 w-4" />,
  database: <Database className="h-4 w-4" />,
  tools: <Tool className="h-4 w-4" />,
};

const CATEGORY_LABELS: Record<string, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  mobile: 'Mobile',
  devops: 'DevOps',
  database: 'Database',
  tools: 'Ferramentas',
};

interface StackTabProps {
  userId?: string;
}

export function StackTab({ userId }: StackTabProps) {
  const [verifiedSkills, setVerifiedSkills] = useState<UserSkill[]>([]);
  const [manualSkills, setManualSkills] = useState<UserSkill[]>([]);
  const [stats, setStats] = useState<SkillStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedTech, setSelectedTech] = useState<TechnologyType | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<ProficiencyLevel>(ProficiencyLevel.INTERMEDIATE);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOwnProfile = !userId;

  const fetchSkills = useCallback(async () => {
    try {
      setLoading(true);
      const [verified, manual, statsData] = await Promise.all([
        getVerifiedSkills(),
        getManualSkills(),
        getSkillStats(),
      ]);
      setVerifiedSkills(verified);
      setManualSkills(manual);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch skills:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const handleAddSkill = async () => {
    if (!selectedTech) return;

    setIsSubmitting(true);
    try {
      const newSkill = await addSkill({
        technology: selectedTech,
        proficiencyLevel: selectedLevel,
      });
      setManualSkills((prev) => [...prev, newSkill]);
      setAddDialogOpen(false);
      setSelectedTech(null);
      setSelectedLevel(ProficiencyLevel.INTERMEDIATE);
      fetchSkills(); // Refresh to get updated stats
    } catch (error) {
      console.error('Failed to add skill:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateLevel = async (technology: TechnologyType, newLevel: ProficiencyLevel) => {
    try {
      const updatedSkill = await updateSkillLevel(technology, { proficiencyLevel: newLevel });
      setManualSkills((prev) =>
        prev.map((skill) =>
          skill.technology === technology ? { ...skill, ...updatedSkill } : skill
        )
      );
    } catch (error) {
      console.error('Failed to update skill:', error);
    }
  };

  const handleRemoveSkill = async (technology: TechnologyType) => {
    if (!confirm('Tem certeza que deseja remover esta tecnologia?')) return;

    try {
      await removeSkill(technology);
      setManualSkills((prev) => prev.filter((skill) => skill.technology !== technology));
      fetchSkills(); // Refresh to get updated stats
    } catch (error) {
      console.error('Failed to remove skill:', error);
    }
  };

  // Group skills by category
  const groupedVerified = React.useMemo(() => {
    const groups: Record<string, UserSkill[]> = {};
    verifiedSkills.forEach((skill) => {
      const category = TECHNOLOGY_CONFIG[skill.technology]?.category || 'tools';
      if (!groups[category]) groups[category] = [];
      groups[category].push(skill);
    });
    return groups;
  }, [verifiedSkills]);

  const groupedManual = React.useMemo(() => {
    const groups: Record<string, UserSkill[]> = {};
    manualSkills.forEach((skill) => {
      const category = TECHNOLOGY_CONFIG[skill.technology]?.category || 'tools';
      if (!groups[category]) groups[category] = [];
      groups[category].push(skill);
    });
    return groups;
  }, [manualSkills]);

  // All available technologies that user doesn't have yet
  const availableTechnologies = React.useMemo(() => {
    const hasTech = new Set([...verifiedSkills, ...manualSkills].map((s) => s.technology));
    return Object.values(TechnologyType).filter((tech) => !hasTech.has(tech));
  }, [verifiedSkills, manualSkills]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-dark-card rounded-xl p-4 border border-neutral-200 dark:border-dark-border">
            <div className="text-2xl font-bold text-accent">{stats.totalSkills}</div>
            <div className="text-sm text-neutral-600 dark:text-dark-muted">Total de Skills</div>
          </div>
          <div className="bg-white dark:bg-dark-card rounded-xl p-4 border border-neutral-200 dark:border-dark-border">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.verifiedSkills}</div>
            <div className="text-sm text-neutral-600 dark:text-dark-muted flex items-center gap-1">
              <Check className="h-3 w-3" /> Verificadas
            </div>
          </div>
          <div className="bg-white dark:bg-dark-card rounded-xl p-4 border border-neutral-200 dark:border-dark-border">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.manualSkills}</div>
            <div className="text-sm text-neutral-600 dark:text-dark-muted">Manuais</div>
          </div>
          <div className="bg-white dark:bg-dark-card rounded-xl p-4 border border-neutral-200 dark:border-dark-border">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.frontendSkills + stats.backendSkills}</div>
            <div className="text-sm text-neutral-600 dark:text-dark-muted">Full Stack</div>
          </div>
        </div>
      )}

      {/* Verified Skills Section */}
      {Object.keys(groupedVerified).length > 0 && (
        <div className="bg-white dark:bg-dark-card rounded-xl border border-neutral-200 dark:border-dark-border overflow-hidden">
          <div className="px-4 py-3 bg-green-50 dark:bg-green-900/20 border-b border-neutral-200 dark:border-dark-border flex items-center gap-2">
            <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
            <h3 className="font-semibold text-neutral-900 dark:text-dark-foreground">
              Skills Verificadas ({verifiedSkills.length})
            </h3>
          </div>
          <div className="p-4 space-y-4">
            {Object.entries(groupedVerified).map(([category, skills]) => (
              <div key={category}>
                <div className="flex items-center gap-2 mb-2 text-sm font-medium text-neutral-600 dark:text-dark-muted">
                  {CATEGORY_ICONS[category]}
                  {CATEGORY_LABELS[category]}
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <SkillBadge key={skill.id} skill={skill} isVerified />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Manual Skills Section */}
      <div className="bg-white dark:bg-dark-card rounded-xl border border-neutral-200 dark:border-dark-border overflow-hidden">
        <div className="px-4 py-3 bg-neutral-50 dark:bg-dark-background border-b border-neutral-200 dark:border-dark-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="h-5 w-5 text-neutral-600 dark:text-dark-muted" />
            <h3 className="font-semibold text-neutral-900 dark:text-dark-foreground">
              Skills Manuais ({manualSkills.length})
            </h3>
          </div>
          {isOwnProfile && (
            <Button onClick={() => setAddDialogOpen(true)} size="sm" className="gap-1">
              <Plus className="h-4 w-4" /> Adicionar
            </Button>
          )}
        </div>
        <div className="p-4 space-y-4">
          {Object.keys(groupedManual).length > 0 ? (
            Object.entries(groupedManual).map(([category, skills]) => (
              <div key={category}>
                <div className="flex items-center gap-2 mb-2 text-sm font-medium text-neutral-600 dark:text-dark-muted">
                  {CATEGORY_ICONS[category]}
                  {CATEGORY_LABELS[category]}
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <EditableSkillBadge
                      key={skill.id}
                      skill={skill}
                      onUpdateLevel={(newLevel) => handleUpdateLevel(skill.technology, newLevel)}
                      onRemove={() => handleRemoveSkill(skill.technology)}
                      canEdit={isOwnProfile}
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-neutral-500 dark:text-dark-muted">
              <Code className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Nenhuma skill adicionada ainda.</p>
              {isOwnProfile && (
                <Button onClick={() => setAddDialogOpen(true)} variant="outline" size="sm" className="mt-3">
                  Adicionar sua primeira skill
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Skill Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Skill</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-dark-foreground mb-2">
                Tecnologia
              </label>
              <Select value={selectedTech || ''} onValueChange={(v) => setSelectedTech(v as TechnologyType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma tecnologia" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TechnologyType)
                    .filter(([_, tech]) => availableTechnologies.includes(tech))
                    .map(([key, tech]) => (
                      <SelectItem key={key} value={tech}>
                        {TECHNOLOGY_CONFIG[tech as TechnologyType]?.name || tech}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-dark-foreground mb-2">
                Nível de Proficiência
              </label>
              <Select
                value={selectedLevel}
                onValueChange={(v) => setSelectedLevel(v as ProficiencyLevel)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ProficiencyLevel).map((level) => (
                    <SelectItem key={level} value={level}>
                      {PROFICIENCY_LABELS[level as ProficiencyLevel]?.label || level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleAddSkill}
                disabled={!selectedTech || isSubmitting}
                className="bg-accent hover:bg-accent/90 text-white"
              >
                {isSubmitting ? 'Adicionando...' : 'Adicionar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Skill Badge Component
interface SkillBadgeProps {
  skill: UserSkill;
  isVerified?: boolean;
}

function SkillBadge({ skill, isVerified = false }: SkillBadgeProps) {
  const config = TECHNOLOGY_CONFIG[skill.technology];
  const levelConfig = PROFICIENCY_LABELS[skill.proficiencyLevel];

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium',
        levelConfig.color,
        isVerified ? 'border-2 border-green-400' : 'border border-transparent'
      )}
    >
      <span>{config?.name || skill.technology}</span>
      {isVerified && (
        <span className="text-xs bg-green-500 text-white rounded-full p-0.5" title="Verificado por desafios">
          <Check className="h-2.5 w-2.5" />
        </span>
      )}
      <span className="text-xs opacity-70">
        {levelConfig.label}
        {skill.challengesCount > 0 && ` (${skill.challengesCount}🏆)`}
      </span>
    </div>
  );
}

// Editable Skill Badge Component
interface EditableSkillBadgeProps extends SkillBadgeProps {
  onUpdateLevel: (newLevel: ProficiencyLevel) => void;
  onRemove: () => void;
  canEdit: boolean;
}

function EditableSkillBadge({ skill, onUpdateLevel, onRemove, canEdit }: EditableSkillBadgeProps) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing && canEdit) {
    return (
      <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm bg-neutral-100 dark:bg-dark-border">
        <span>{TECHNOLOGY_CONFIG[skill.technology]?.name}</span>
        <Select
          value={skill.proficiencyLevel}
          onValueChange={(v) => {
            onUpdateLevel(v as ProficiencyLevel);
            setIsEditing(false);
          }}
        >
          <SelectTrigger className="h-6 w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.values(ProficiencyLevel).map((level) => (
              <SelectItem key={level} value={level}>
                {PROFICIENCY_LABELS[level as ProficiencyLevel]?.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <button onClick={() => setIsEditing(false)} className="text-neutral-500 hover:text-neutral-700">
          ✓
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium group',
        PROFICIENCY_LABELS[skill.proficiencyLevel].color,
        'border border-transparent hover:border-neutral-300 dark:hover:border-neutral-600'
      )}
    >
      <span>{TECHNOLOGY_CONFIG[skill.technology]?.name}</span>
      <span className="text-xs opacity-70">
        {PROFICIENCY_LABELS[skill.proficiencyLevel].label}
      </span>
      {canEdit && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(true)}
            className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 p-0.5"
            title="Editar nível"
          >
            ✏️
          </button>
          <button
            onClick={onRemove}
            className="text-red-500 hover:text-red-700 p-0.5"
            title="Remover"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
}

export default StackTab;
