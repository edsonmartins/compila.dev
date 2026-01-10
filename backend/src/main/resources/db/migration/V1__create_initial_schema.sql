-- =====================================================
-- Compila.dev Database Schema - Initial Migration
-- PostgreSQL 16
-- =====================================================

-- =====================================================
-- ENUMS
-- =====================================================

-- Subscription plan enum
CREATE TYPE subscription_plan AS ENUM (
    'FREE',
    'PRO',
    'PRO_PLUS'
);

-- Challenge stack enum
CREATE TYPE challenge_stack AS ENUM (
    'FRONTEND',
    'BACKEND',
    'MOBILE',
    'DEVOPS',
    'IOT',
    'DATA',
    'FULLSTACK'
);

-- Challenge level enum
CREATE TYPE challenge_level AS ENUM (
    'BEGINNER',
    'JUNIOR',
    'MID',
    'SENIOR',
    'EXPERT'
);

-- Submission status enum
CREATE TYPE submission_status AS ENUM (
    'PENDING',
    'PASSED',
    'FAILED',
    'PARTIAL',
    'ERROR'
);

-- Programming language enum
CREATE TYPE programming_language AS ENUM (
    'JAVASCRIPT',
    'TYPESCRIPT',
    'PYTHON',
    'JAVA',
    'C_SHARP',
    'GO',
    'RUST',
    'PHP',
    'CPLUSPLUS',
    'KOTLIN',
    'SWIFT',
    'DART',
    'RUBY',
    'OTHER'
);

-- OAuth provider enum
CREATE TYPE oauth_provider AS ENUM (
    'GITHUB',
    'GOOGLE',
    'LINKEDIN'
);

-- Badge type enum
CREATE TYPE badge_type AS ENUM (
    'FIRST_CHALLENGE',
    'STREAK_7',
    'STREAK_30',
    'STREAK_100',
    'XP_1000',
    'XP_5000',
    'XP_10000',
    'PERFECT_SCORE',
    'SPEED_RUNNER',
    'HELPER',
    'MENTOR',
    'EXPLORER',
    'MASTER_FRONTEND',
    'MASTER_BACKEND',
    'MASTER_FULLSTACK'
);

-- Post type enum
CREATE TYPE post_type AS ENUM (
    'CHALLENGE_COMPLETED',
    'ACHIEVEMENT',
    'QUESTION',
    'SHARE',
    'PROJECT'
);

-- Job type enum
CREATE TYPE job_type AS ENUM (
    'FULL_TIME',
    'PART_TIME',
    'CONTRACT',
    'FREELANCE',
    'INTERNSHIP'
);

-- Job level enum
CREATE TYPE job_level AS ENUM (
    'JUNIOR',
    'MID',
    'SENIOR',
    'LEAD',
    'ARCHITECT'
);

-- =====================================================
-- TABLES: USERS & AUTH
-- =====================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(30) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255),

    -- Profile
    full_name VARCHAR(100),
    bio TEXT,
    avatar_url VARCHAR(500),
    location VARCHAR(100),
    website_url VARCHAR(500),
    github_url VARCHAR(500),
    linkedin_url VARCHAR(500),

    -- Gamification
    level INTEGER NOT NULL DEFAULT 1,
    xp BIGINT NOT NULL DEFAULT 0,
    streak_current INTEGER NOT NULL DEFAULT 0,
    streak_best INTEGER NOT NULL DEFAULT 0,

    -- OAuth
    oauth_provider oauth_provider,
    oauth_id VARCHAR(255),

    -- Subscription
    subscription_plan subscription_plan NOT NULL DEFAULT 'FREE',
    subscription_expires_at TIMESTAMP WITH TIME ZONE,

    -- Account status
    enabled BOOLEAN NOT NULL DEFAULT true,
    email_verified BOOLEAN NOT NULL DEFAULT false,
    last_active_at TIMESTAMP WITH TIME ZONE,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for users
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_oauth ON users(oauth_provider, oauth_id);
CREATE INDEX idx_users_level ON users(level DESC);
CREATE INDEX idx_users_xp ON users(xp DESC);

-- =====================================================
-- TABLES: CHALLENGES
-- =====================================================

CREATE TABLE challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    short_description VARCHAR(300),
    description TEXT NOT NULL,

    -- Categorization
    stack challenge_stack NOT NULL,
    level challenge_level NOT NULL,
    difficulty INTEGER NOT NULL CHECK (difficulty BETWEEN 1 AND 10),
    technologies TEXT[] NOT NULL,
    tags TEXT[],

    -- Code & Requirements
    requirements JSONB,
    starter_code JSONB,
    solution_code JSONB,

    -- Rewards
    xp_reward INTEGER NOT NULL,
    estimated_time_minutes INTEGER,

    -- Badges that can be earned
    badges TEXT[],

    -- Publishing
    published BOOLEAN NOT NULL DEFAULT false,
    featured BOOLEAN NOT NULL DEFAULT false,

    -- Statistics
    completed_count INTEGER NOT NULL DEFAULT 0,
    attempted_count INTEGER NOT NULL DEFAULT 0,
    success_rate DECIMAL(5, 2),

    -- Author
    author_id UUID REFERENCES users(id),

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for challenges
CREATE INDEX idx_challenges_slug ON challenges(slug);
CREATE INDEX idx_challenges_stack ON challenges(stack);
CREATE INDEX idx_challenges_level ON challenges(level);
CREATE INDEX idx_challenges_published ON challenges(published);
CREATE INDEX idx_challenges_featured ON challenges(featured);
CREATE INDEX idx_challenges_technologies ON challenges USING GIN(technologies);
CREATE INDEX idx_challenges_tags ON challenges USING GIN(tags);

-- =====================================================
-- TABLES: SUBMISSIONS
-- =====================================================

CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Relations
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,

    -- Code
    code TEXT NOT NULL,
    language programming_language NOT NULL,
    files JSONB,

    -- Results
    status submission_status NOT NULL DEFAULT 'PENDING',
    test_results JSONB,
    score INTEGER CHECK (score BETWEEN 0 AND 100),
    xp_gained INTEGER DEFAULT 0,

    -- AI Feedback
    ai_feedback JSONB,
    ai_tokens_used INTEGER,

    -- Metadata
    execution_time_ms INTEGER,
    attempt_number INTEGER NOT NULL DEFAULT 1,

    -- Timestamps
    submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for submissions
CREATE INDEX idx_submissions_user ON submissions(user_id);
CREATE INDEX idx_submissions_challenge ON submissions(challenge_id);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_user_challenge ON submissions(user_id, challenge_id);

-- =====================================================
-- TABLES: USER BADGES
-- =====================================================

CREATE TABLE user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_type badge_type NOT NULL,
    earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(user_id, badge_type)
);

CREATE INDEX idx_user_badges_user ON user_badges(user_id);

-- =====================================================
-- TABLES: SOCIAL - FOLLOWERS
-- =====================================================

CREATE TABLE followers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(follower_id, following_id),
    CHECK (follower_id != following_id)
);

CREATE INDEX idx_followers_follower ON followers(follower_id);
CREATE INDEX idx_followers_following ON followers(following_id);

-- =====================================================
-- TABLES: SOCIAL - POSTS
-- =====================================================

CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_type post_type NOT NULL,

    -- Content
    content TEXT NOT NULL,
    challenge_id UUID REFERENCES challenges(id) ON DELETE SET NULL,

    -- Engagement
    likes_count INTEGER NOT NULL DEFAULT 0,
    comments_count INTEGER NOT NULL DEFAULT 0,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_posts_user ON posts(user_id);
CREATE INDEX idx_posts_type ON posts(post_type);
CREATE INDEX idx_posts_challenge ON posts(challenge_id);
CREATE INDEX idx_posts_created ON posts(created_at DESC);

-- =====================================================
-- TABLES: SOCIAL - POST LIKES
-- =====================================================

CREATE TABLE post_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(post_id, user_id)
);

CREATE INDEX idx_post_likes_post ON post_likes(post_id);
CREATE INDEX idx_post_likes_user ON post_likes(user_id);

-- =====================================================
-- TABLES: SOCIAL - COMMENTS
-- =====================================================

CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,

    content TEXT NOT NULL,
    likes_count INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_comments_user ON comments(user_id);
CREATE INDEX idx_comments_parent ON comments(parent_id);

-- =====================================================
-- TABLES: LEARNING PATHS
-- =====================================================

CREATE TABLE learning_paths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    short_description VARCHAR(300),

    -- Metadata
    stack challenge_stack NOT NULL,
    level challenge_level NOT NULL,
    estimated_weeks INTEGER,
    xp_total INTEGER NOT NULL DEFAULT 0,

    -- Cover image
    cover_image_url VARCHAR(500),

    -- Statistics
    enrolled_count INTEGER NOT NULL DEFAULT 0,
    completed_count INTEGER NOT NULL DEFAULT 0,

    -- Author
    author_id UUID REFERENCES users(id),

    -- Publishing
    published BOOLEAN NOT NULL DEFAULT false,
    featured BOOLEAN NOT NULL DEFAULT false,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_learning_paths_slug ON learning_paths(slug);
CREATE INDEX idx_learning_paths_stack ON learning_paths(stack);
CREATE INDEX idx_learning_paths_published ON learning_paths(published);

-- =====================================================
-- TABLES: LEARNING PATH CHALLENGES (JUNCTION)
-- =====================================================

CREATE TABLE learning_path_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    learning_path_id UUID NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
    challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL,
    is_mandatory BOOLEAN NOT NULL DEFAULT true,

    UNIQUE(learning_path_id, challenge_id)
);

CREATE INDEX idx_lpc_path ON learning_path_challenges(learning_path_id);
CREATE INDEX idx_lpc_challenge ON learning_path_challenges(challenge_id);

-- =====================================================
-- TABLES: LEARNING PATH PROGRESS
-- =====================================================

CREATE TABLE learning_path_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    learning_path_id UUID NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,

    status VARCHAR(20) NOT NULL DEFAULT 'NOT_STARTED',
    current_step INTEGER NOT NULL DEFAULT 0,
    total_steps INTEGER NOT NULL DEFAULT 0,
    completion_percentage INTEGER NOT NULL DEFAULT 0 CHECK (completion_percentage BETWEEN 0 AND 100),
    xp_gained INTEGER NOT NULL DEFAULT 0,

    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    last_accessed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(user_id, learning_path_id)
);

CREATE INDEX idx_lpp_user ON learning_path_progress(user_id);
CREATE INDEX idx_lpp_path ON learning_path_progress(learning_path_id);

-- =====================================================
-- TABLES: JOBS
-- =====================================================

CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) NOT NULL UNIQUE,

    -- Company info
    company_name VARCHAR(200) NOT NULL,
    company_logo_url VARCHAR(500),
    company_website VARCHAR(500),

    -- Position info
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT[],
    benefits TEXT[],

    -- Categorization
    job_type job_type NOT NULL,
    level job_level NOT NULL,
    remote BOOLEAN NOT NULL DEFAULT false,
    location VARCHAR(200),

    -- Technologies
    technologies TEXT[],

    -- Salary
    salary_min INTEGER,
    salary_max INTEGER,
    salary_currency VARCHAR(3) DEFAULT 'BRL',

    -- Contact
    application_url VARCHAR(500),
    contact_email VARCHAR(255),

    -- Status
    active BOOLEAN NOT NULL DEFAULT true,
    featured BOOLEAN NOT NULL DEFAULT false,

    -- Statistics
    views_count INTEGER NOT NULL DEFAULT 0,
    applications_count INTEGER NOT NULL DEFAULT 0,

    -- Posted by
    posted_by_id UUID REFERENCES users(id),

    -- Timestamps
    posted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_jobs_slug ON jobs(slug);
CREATE INDEX idx_jobs_active ON jobs(active);
CREATE INDEX idx_jobs_featured ON jobs(featured);
CREATE INDEX idx_jobs_type ON jobs(job_type);
CREATE INDEX idx_jobs_level ON jobs(level);
CREATE INDEX idx_jobs_remote ON jobs(remote);
CREATE INDEX idx_jobs_technologies ON jobs USING GIN(technologies);

-- =====================================================
-- TABLES: JOB APPLICATIONS
-- =====================================================

CREATE TABLE job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    cover_letter TEXT,
    resume_url VARCHAR(500),

    status VARCHAR(20) NOT NULL DEFAULT 'APPLIED',
    applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(job_id, user_id)
);

CREATE INDEX idx_job_applications_job ON job_applications(job_id);
CREATE INDEX idx_job_applications_user ON job_applications(user_id);
CREATE INDEX idx_job_applications_status ON job_applications(status);

-- =====================================================
-- TABLES: USER PROJECTS (PORTFOLIO)
-- =====================================================

CREATE TABLE user_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    title VARCHAR(200) NOT NULL,
    description TEXT,
    short_description VARCHAR(300),

    -- Links
    project_url VARCHAR(500),
    repository_url VARCHAR(500),
    demo_url VARCHAR(500),
    cover_image_url VARCHAR(500),

    -- Technologies
    technologies TEXT[],
    tags TEXT[],

    -- Visibility
    featured BOOLEAN NOT NULL DEFAULT false,
    public BOOLEAN NOT NULL DEFAULT true,

    -- Statistics
    views_count INTEGER NOT NULL DEFAULT 0,
    likes_count INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_projects_user ON user_projects(user_id);
CREATE INDEX idx_user_projects_featured ON user_projects(featured);
CREATE INDEX idx_user_projects_public ON user_projects(public);

-- =====================================================
-- TABLES: ACTIVITY LOG
-- =====================================================

CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    activity_type VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    description TEXT,
    metadata JSONB,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_type ON activity_logs(activity_type);
CREATE INDEX idx_activity_logs_created ON activity_logs(created_at DESC);

-- =====================================================
-- TRIGGERS: Updated At
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_challenges_updated_at BEFORE UPDATE ON challenges
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_paths_updated_at BEFORE UPDATE ON learning_paths
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_projects_updated_at BEFORE UPDATE ON user_projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SEED DATA: Initial Challenges
-- =====================================================

INSERT INTO challenges (slug, title, short_description, description, stack, level, difficulty, technologies, tags, xp_reward, estimated_time_minutes, published, featured) VALUES
('hello-world', 'Hello World', 'Seu primeiro desafio!', 'Crie um programa que imprima "Hello World!" na tela.', 'FRONTEND', 'BEGINNER', 1, ARRAY['javascript'], ARRAY['basics', 'output'], 10, 5, true, false),
('soma-dois-numeros', 'Soma de Dois Números', 'Aprenda a trabalhar com entrada e saída.', 'Crie uma função que receba dois números e retorne a soma deles.', 'BACKEND', 'BEGINNER', 1, ARRAY['python'], ARRAY['basics', 'functions', 'math'], 15, 10, true, false),
('contador-caracteres', 'Contador de Caracteres', 'Manipulação de strings em JavaScript.', 'Crie uma função que conte quantos caracteres uma string tem.', 'FRONTEND', 'BEGINNER', 2, ARRAY['javascript'], ARRAY['strings', 'loops'], 20, 15, true, false),
('FizzBuzz', 'FizzBuzz Clássico', 'O desafio clássico de entrevista.', 'Imprima "Fizz" para múltiplos de 3, "Buzz" para múltiplos de 5, e "FizzBuzz" para múltiplos de ambos.', 'BACKEND', 'JUNIOR', 3, ARRAY['javascript', 'python'], ARRAY['logic', 'conditionals', 'loops'], 30, 20, true, true),
('todo-list', 'Lista de Tarefas', 'Crie seu primeiro CRUD completo.', 'Construa uma aplicação de lista de tarefas com create, read, update e delete.', 'FULLSTACK', 'JUNIOR', 4, ARRAY['typescript', 'react'], ARRAY['crud', 'state', 'forms'], 100, 120, true, true);

-- =====================================================
-- SEED DATA: Learning Paths
-- =====================================================

INSERT INTO learning_paths (slug, title, description, short_description, stack, level, estimated_weeks, xp_total, published, featured) VALUES
('frontend-iniciante', 'Frontend do Zero', 'Aprenda HTML, CSS e JavaScript do absoluto zero.', 'Inicie sua jornada como desenvolvedor frontend.', 'FRONTEND', 'BEGINNER', 8, 500, true, true),
('javascript-avancado', 'JavaScript Avançado', 'Domine conceitos avançados de JavaScript.', 'Closures, promises, async/await e muito mais.', 'FRONTEND', 'SENIOR', 6, 800, true, false),
('react-completo', 'React Completo', 'Torne-se um especialista em React.', 'Hooks, context, performance testing e mais.', 'FRONTEND', 'MID', 10, 1200, true, true);
