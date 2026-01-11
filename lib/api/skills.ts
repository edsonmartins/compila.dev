/**
 * User Skills API
 */

import { fetchApi } from './client';

// ==================== Types & Enums ====================

export enum ProficiencyLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export enum TechnologyType {
  // Frontend
  REACT = 'REACT',
  VUE = 'VUE',
  ANGULAR = 'ANGULAR',
  NEXT_JS = 'NEXT_JS',
  SVELTE = 'SVELTE',
  HTML = 'HTML',
  CSS = 'CSS',
  TAILWIND = 'TAILWIND',
  TYPESCRIPT = 'TYPESCRIPT',
  JAVASCRIPT = 'JAVASCRIPT',

  // Backend
  JAVA = 'JAVA',
  SPRING = 'SPRING',
  NODE_JS = 'NODE_JS',
  PYTHON = 'PYTHON',
  DJANGO = 'DJANGO',
  FLASK = 'FLASK',
  FASTAPI = 'FASTAPI',
  DOTNET = 'DOTNET',
  GO = 'GO',
  RUST = 'RUST',
  PHP = 'PHP',
  RUBY = 'RUBY',

  // Mobile
  REACT_NATIVE = 'REACT_NATIVE',
  FLUTTER = 'FLUTTER',
  SWIFT = 'SWIFT',
  KOTLIN = 'KOTLIN',
  IONIC = 'IONIC',

  // DevOps
  DOCKER = 'DOCKER',
  KUBERNETES = 'KUBERNETES',
  AWS = 'AWS',
  AZURE = 'AZURE',
  GCP = 'GCP',
  TERRAFORM = 'TERRAFORM',
  ANSIBLE = 'ANSIBLE',
  JENKINS = 'JENKINS',
  GITHUB_ACTIONS = 'GITHUB_ACTIONS',
  GITLAB_CI = 'GITLAB_CI',

  // Database
  POSTGRESQL = 'POSTGRESQL',
  MYSQL = 'MYSQL',
  MONGODB = 'MONGODB',
  REDIS = 'REDIS',
  ELASTICSEARCH = 'ELASTICSEARCH',
  SQLITE = 'SQLITE',

  // Tools/Other
  GIT = 'GIT',
  LINUX = 'LINUX',
  FIGMA = 'FIGMA',
  JIRA = 'JIRA',
}

export const TECHNOLOGY_CONFIG: Record<TechnologyType, { name: string; category: string }> = {
  [TechnologyType.REACT]: { name: 'React', category: 'frontend' },
  [TechnologyType.VUE]: { name: 'Vue.js', category: 'frontend' },
  [TechnologyType.ANGULAR]: { name: 'Angular', category: 'frontend' },
  [TechnologyType.NEXT_JS]: { name: 'Next.js', category: 'frontend' },
  [TechnologyType.SVELTE]: { name: 'Svelte', category: 'frontend' },
  [TechnologyType.HTML]: { name: 'HTML', category: 'frontend' },
  [TechnologyType.CSS]: { name: 'CSS', category: 'frontend' },
  [TechnologyType.TAILWIND]: { name: 'Tailwind CSS', category: 'frontend' },
  [TechnologyType.TYPESCRIPT]: { name: 'TypeScript', category: 'frontend' },
  [TechnologyType.JAVASCRIPT]: { name: 'JavaScript', category: 'frontend' },
  [TechnologyType.JAVA]: { name: 'Java', category: 'backend' },
  [TechnologyType.SPRING]: { name: 'Spring Boot', category: 'backend' },
  [TechnologyType.NODE_JS]: { name: 'Node.js', category: 'backend' },
  [TechnologyType.PYTHON]: { name: 'Python', category: 'backend' },
  [TechnologyType.DJANGO]: { name: 'Django', category: 'backend' },
  [TechnologyType.FLASK]: { name: 'Flask', category: 'backend' },
  [TechnologyType.FASTAPI]: { name: 'FastAPI', category: 'backend' },
  [TechnologyType.DOTNET]: { name: '.NET/C#', category: 'backend' },
  [TechnologyType.GO]: { name: 'Go', category: 'backend' },
  [TechnologyType.RUST]: { name: 'Rust', category: 'backend' },
  [TechnologyType.PHP]: { name: 'PHP', category: 'backend' },
  [TechnologyType.RUBY]: { name: 'Ruby', category: 'backend' },
  [TechnologyType.REACT_NATIVE]: { name: 'React Native', category: 'mobile' },
  [TechnologyType.FLUTTER]: { name: 'Flutter', category: 'mobile' },
  [TechnologyType.SWIFT]: { name: 'Swift', category: 'mobile' },
  [TechnologyType.KOTLIN]: { name: 'Kotlin', category: 'mobile' },
  [TechnologyType.IONIC]: { name: 'Ionic', category: 'mobile' },
  [TechnologyType.DOCKER]: { name: 'Docker', category: 'devops' },
  [TechnologyType.KUBERNETES]: { name: 'Kubernetes', category: 'devops' },
  [TechnologyType.AWS]: { name: 'AWS', category: 'devops' },
  [TechnologyType.AZURE]: { name: 'Azure', category: 'devops' },
  [TechnologyType.GCP]: { name: 'GCP', category: 'devops' },
  [TechnologyType.TERRAFORM]: { name: 'Terraform', category: 'devops' },
  [TechnologyType.ANSIBLE]: { name: 'Ansible', category: 'devops' },
  [TechnologyType.JENKINS]: { name: 'Jenkins', category: 'devops' },
  [TechnologyType.GITHUB_ACTIONS]: { name: 'GitHub Actions', category: 'devops' },
  [TechnologyType.GITLAB_CI]: { name: 'GitLab CI', category: 'devops' },
  [TechnologyType.POSTGRESQL]: { name: 'PostgreSQL', category: 'database' },
  [TechnologyType.MYSQL]: { name: 'MySQL', category: 'database' },
  [TechnologyType.MONGODB]: { name: 'MongoDB', category: 'database' },
  [TechnologyType.REDIS]: { name: 'Redis', category: 'database' },
  [TechnologyType.ELASTICSEARCH]: { name: 'Elasticsearch', category: 'database' },
  [TechnologyType.SQLITE]: { name: 'SQLite', category: 'database' },
  [TechnologyType.GIT]: { name: 'Git', category: 'tools' },
  [TechnologyType.LINUX]: { name: 'Linux', category: 'tools' },
  [TechnologyType.FIGMA]: { name: 'Figma', category: 'tools' },
  [TechnologyType.JIRA]: { name: 'Jira', category: 'tools' },
};

export const PROFICIENCY_LABELS: Record<ProficiencyLevel, { label: string; color: string }> = {
  [ProficiencyLevel.BEGINNER]: { label: 'Básico', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  [ProficiencyLevel.INTERMEDIATE]: { label: 'Intermediário', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  [ProficiencyLevel.ADVANCED]: { label: 'Avançado', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
};

// ==================== DTOs ====================

export interface UserSkill {
  id: string;
  userId: string;
  technology: TechnologyType;
  proficiencyLevel: ProficiencyLevel;
  isVerified: boolean;
  challengesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SkillStats {
  totalSkills: number;
  verifiedSkills: number;
  manualSkills: number;
  frontendSkills: number;
  backendSkills: number;
  mobileSkills: number;
  devopsSkills: number;
  databaseSkills: number;
}

export interface AddSkillRequest {
  technology: TechnologyType;
  proficiencyLevel: ProficiencyLevel;
}

export interface UpdateSkillRequest {
  proficiencyLevel: ProficiencyLevel;
}

// ==================== API Functions ====================

/**
 * Get all skills for current user
 */
export async function getMySkills(): Promise<UserSkill[]> {
  return fetchApi<UserSkill[]>('/users/skills');
}

/**
 * Get all skills for a specific user
 */
export async function getUserSkills(userId: string): Promise<UserSkill[]> {
  return fetchApi<UserSkill[]>(`/users/skills/${userId}`);
}

/**
 * Get verified skills (from challenges)
 */
export async function getVerifiedSkills(): Promise<UserSkill[]> {
  return fetchApi<UserSkill[]>('/users/skills/verified');
}

/**
 * Get manual skills
 */
export async function getManualSkills(): Promise<UserSkill[]> {
  return fetchApi<UserSkill[]>('/users/skills/manual');
}

/**
 * Get skills by category
 */
export async function getSkillsByCategory(category: string): Promise<UserSkill[]> {
  return fetchApi<UserSkill[]>(`/users/skills/category/${category}`);
}

/**
 * Get skill statistics
 */
export async function getSkillStats(): Promise<SkillStats> {
  return fetchApi<SkillStats>('/users/skills/stats');
}

/**
 * Add a manual skill
 */
export async function addSkill(request: AddSkillRequest): Promise<UserSkill> {
  return fetchApi<UserSkill>('/users/skills', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

/**
 * Update skill level (manual skills only)
 */
export async function updateSkillLevel(
  technology: TechnologyType,
  request: UpdateSkillRequest
): Promise<UserSkill> {
  return fetchApi<UserSkill>(`/users/skills/${technology}`, {
    method: 'PUT',
    body: JSON.stringify(request),
  });
}

/**
 * Remove a manual skill
 */
export async function removeSkill(technology: TechnologyType): Promise<void> {
  return fetchApi<void>(`/users/skills/${technology}`, {
    method: 'DELETE',
  });
}

/**
 * Check if user has a specific technology
 */
export async function hasSkill(technology: TechnologyType): Promise<boolean> {
  return fetchApi<boolean>(`/users/skills/has/${technology}`);
}
