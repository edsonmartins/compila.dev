# CodeBR - Database Schema

## Schema completo PostgreSQL

```sql
-- ============================================
-- EXTENSÕES
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- Para busca fuzzy

-- ============================================
-- USUÁRIOS E AUTENTICAÇÃO
-- ============================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(30) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),  -- NULL se OAuth
    avatar_url TEXT,
    bio TEXT,
    
    -- OAuth
    google_id VARCHAR(255),
    github_id VARCHAR(255),
    linkedin_id VARCHAR(255),
    
    -- Localização
    location VARCHAR(100),
    timezone VARCHAR(50) DEFAULT 'America/Sao_Paulo',
    
    -- Gamificação
    xp_total INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    streak_current INTEGER DEFAULT 0,
    streak_longest INTEGER DEFAULT 0,
    last_activity_date DATE,
    
    -- Status
    is_verified BOOLEAN DEFAULT FALSE,
    is_pro BOOLEAN DEFAULT FALSE,
    pro_expires_at TIMESTAMP,
    is_banned BOOLEAN DEFAULT FALSE,
    
    -- Preferências
    settings JSONB DEFAULT '{
        "notifications": true,
        "public_profile": true,
        "theme": "dark",
        "language": "pt-BR"
    }'::jsonb,
    
    created_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_xp ON users(xp_total DESC);
CREATE INDEX idx_users_streak ON users(streak_current DESC);

-- ============================================
-- DESAFIOS
-- ============================================

CREATE TABLE challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    
    -- Classificação
    difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('newbie', 'junior', 'intermediate', 'advanced', 'expert')),
    category VARCHAR(50) NOT NULL,  -- layout, interactive, fullstack
    
    -- Tecnologias
    tags TEXT[] DEFAULT '{}',  -- html, css, javascript, react, etc
    framework_agnostic BOOLEAN DEFAULT TRUE,
    
    -- Assets
    preview_image_url TEXT NOT NULL,
    figma_url TEXT,
    design_files JSONB,  -- {mobile: url, desktop: url, tablet: url}
    starter_files JSONB,  -- {html: content, css: content, readme: content}
    
    -- Requisitos
    requirements JSONB NOT NULL,  -- [{type: 'functional', description: '...'}]
    acceptance_criteria JSONB,
    
    -- Métricas
    xp_reward INTEGER DEFAULT 100,
    estimated_time_hours INTEGER,
    submissions_count INTEGER DEFAULT 0,
    avg_score DECIMAL(5,2),
    completion_rate DECIMAL(5,2),
    
    -- Status
    is_premium BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    published_at TIMESTAMP,
    
    -- Metadata
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_challenges_slug ON challenges(slug) WHERE is_active;
CREATE INDEX idx_challenges_difficulty ON challenges(difficulty);
CREATE INDEX idx_challenges_tags ON challenges USING GIN(tags);
CREATE INDEX idx_challenges_published ON challenges(published_at DESC) WHERE is_active;

-- ============================================
-- SUBMISSIONS
-- ============================================

CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Código e demo
    live_url TEXT NOT NULL,
    github_repo_url TEXT,
    source_code JSONB,  -- {html: '', css: '', js: ''}
    screenshots TEXT[] DEFAULT '{}',
    
    -- Análise automática
    lighthouse_score JSONB,  -- {performance: 95, accessibility: 100, seo: 90}
    html_valid BOOLEAN,
    css_valid BOOLEAN,
    responsive_check JSONB,  -- {mobile: true, tablet: true, desktop: true}
    
    -- Feedback IA
    ai_feedback JSONB,
    ai_score INTEGER,  -- 0-100
    ai_analyzed_at TIMESTAMP,
    
    -- Status
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected')),
    submitted_at TIMESTAMP,
    
    -- Engajamento
    views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(challenge_id, user_id)
);

CREATE INDEX idx_submissions_user ON submissions(user_id, submitted_at DESC);
CREATE INDEX idx_submissions_challenge ON submissions(challenge_id, submitted_at DESC);
CREATE INDEX idx_submissions_status ON submissions(status, submitted_at DESC);
CREATE INDEX idx_submissions_score ON submissions(ai_score DESC) WHERE status = 'submitted';

-- ============================================
-- INTERAÇÕES SOCIAIS
-- ============================================

CREATE TABLE submission_likes (
    submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (submission_id, user_id)
);

CREATE INDEX idx_likes_user ON submission_likes(user_id);

CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    
    content TEXT NOT NULL,
    code_snippet TEXT,
    is_review BOOLEAN DEFAULT FALSE,
    
    likes_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_comments_submission ON comments(submission_id, created_at DESC);
CREATE INDEX idx_comments_user ON comments(user_id, created_at DESC);

CREATE TABLE follows (
    follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (follower_id, following_id),
    CHECK (follower_id != following_id)
);

CREATE INDEX idx_follows_follower ON follows(follower_id);
CREATE INDEX idx_follows_following ON follows(following_id);

-- ============================================
-- BATALHAS/RINHAS
-- ============================================

CREATE TABLE battles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    challenge_id UUID REFERENCES challenges(id),
    
    battle_type VARCHAR(20) NOT NULL CHECK (battle_type IN ('duel', 'squad', 'tournament')),
    max_participants INTEGER,
    
    starts_at TIMESTAMP NOT NULL,
    ends_at TIMESTAMP NOT NULL,
    duration_minutes INTEGER NOT NULL,
    
    rules JSONB,
    prize JSONB,  -- {type: 'xp', amount: 500, badge_id: '...'}
    
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'judging', 'completed', 'cancelled')),
    winner_id UUID REFERENCES users(id),
    
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_battles_status ON battles(status, starts_at);

CREATE TABLE battle_participants (
    battle_id UUID REFERENCES battles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    team_name VARCHAR(100),
    
    submission_id UUID REFERENCES submissions(id),
    final_score INTEGER,
    ranking INTEGER,
    
    joined_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (battle_id, user_id)
);

-- ============================================
-- GAMIFICAÇÃO
-- ============================================

CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url TEXT NOT NULL,
    
    criteria JSONB NOT NULL,  -- {type: 'streak', value: 7}
    rarity VARCHAR(20) DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
    
    xp_bonus INTEGER DEFAULT 0,
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_badges (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, badge_id)
);

CREATE INDEX idx_user_badges ON user_badges(user_id);

-- ============================================
-- PORTFÓLIO
-- ============================================

CREATE TABLE portfolios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    
    custom_slug VARCHAR(50) UNIQUE,
    
    title VARCHAR(200) DEFAULT 'Meu Portfólio',
    bio TEXT,
    headline VARCHAR(300),
    
    meta_description TEXT,
    og_image_url TEXT,
    
    theme VARCHAR(20) DEFAULT 'default',
    primary_color VARCHAR(7) DEFAULT '#3B82F6',
    layout VARCHAR(20) DEFAULT 'grid',
    
    sections JSONB DEFAULT '{
        "about": true,
        "skills": true,
        "submissions": true,
        "experience": true,
        "education": true,
        "achievements": true
    }'::jsonb,
    
    featured_submissions UUID[] DEFAULT '{}',
    social_links JSONB DEFAULT '[]'::jsonb,
    
    views_count INTEGER DEFAULT 0,
    last_viewed_at TIMESTAMP,
    
    is_public BOOLEAN DEFAULT TRUE,
    is_searchable BOOLEAN DEFAULT TRUE,
    published_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_portfolios_slug ON portfolios(custom_slug) WHERE is_public;
CREATE INDEX idx_portfolios_views ON portfolios(views_count DESC);

CREATE TABLE experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    company VARCHAR(200) NOT NULL,
    position VARCHAR(200) NOT NULL,
    location VARCHAR(200),
    
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    
    description TEXT,
    technologies TEXT[] DEFAULT '{}',
    
    display_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_experiences_user ON experiences(user_id, start_date DESC);

CREATE TABLE education (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    institution VARCHAR(200) NOT NULL,
    degree VARCHAR(200) NOT NULL,
    field VARCHAR(200),
    
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    
    description TEXT,
    
    display_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_skills (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    skill VARCHAR(100) NOT NULL,
    
    proficiency VARCHAR(20) DEFAULT 'intermediate' CHECK (proficiency IN ('beginner', 'intermediate', 'advanced', 'expert')),
    usage_count INTEGER DEFAULT 1,
    
    is_highlighted BOOLEAN DEFAULT FALSE,
    
    PRIMARY KEY (user_id, skill)
);

-- ============================================
-- COMUNIDADES
-- ============================================

CREATE TABLE communities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    
    type VARCHAR(50) NOT NULL CHECK (type IN ('study_group', 'mentorship', 'tech_stack', 'location_based')),
    topics TEXT[] DEFAULT '{}',
    
    is_private BOOLEAN DEFAULT FALSE,
    requires_approval BOOLEAN DEFAULT TRUE,
    max_members INTEGER,
    
    avatar_url TEXT,
    cover_url TEXT,
    
    rules TEXT[],
    
    members_count INTEGER DEFAULT 0,
    posts_count INTEGER DEFAULT 0,
    
    is_active BOOLEAN DEFAULT TRUE,
    
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_communities_slug ON communities(slug) WHERE is_active;
CREATE INDEX idx_communities_topics ON communities USING GIN(topics);
CREATE INDEX idx_communities_members ON communities(members_count DESC);

CREATE TABLE community_members (
    community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('owner', 'moderator', 'member')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'pending', 'banned')),
    
    joined_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (community_id, user_id)
);

CREATE INDEX idx_members_user ON community_members(user_id) WHERE status = 'active';

CREATE TABLE community_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    title VARCHAR(300),
    content TEXT NOT NULL,
    post_type VARCHAR(50) DEFAULT 'discussion' CHECK (post_type IN ('discussion', 'question', 'resource', 'event')),
    
    resource_url TEXT,
    resource_type VARCHAR(50),
    
    event_date TIMESTAMP,
    event_url TEXT,
    
    upvotes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    
    is_pinned BOOLEAN DEFAULT FALSE,
    is_locked BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_community_posts ON community_posts(community_id, created_at DESC);
CREATE INDEX idx_community_posts_pinned ON community_posts(community_id, is_pinned, created_at DESC);

-- ============================================
-- VAGAS
-- ============================================

CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    
    logo_url TEXT,
    website TEXT,
    description TEXT,
    
    industry VARCHAR(100),
    company_size VARCHAR(50),
    
    headquarters VARCHAR(200),
    is_remote_friendly BOOLEAN DEFAULT FALSE,
    
    linkedin_url TEXT,
    github_url TEXT,
    
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    
    plan_type VARCHAR(20) DEFAULT 'free' CHECK (plan_type IN ('free', 'basic', 'premium')),
    plan_expires_at TIMESTAMP,
    credits_remaining INTEGER DEFAULT 0,
    
    owner_user_id UUID REFERENCES users(id),
    
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_companies_slug ON companies(slug) WHERE is_active;

CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(250) UNIQUE NOT NULL,
    
    description TEXT NOT NULL,
    requirements TEXT[],
    nice_to_have TEXT[],
    benefits TEXT[],
    
    job_type VARCHAR(50) NOT NULL CHECK (job_type IN ('clt', 'pj', 'freelance', 'internship')),
    seniority VARCHAR(50) NOT NULL CHECK (seniority IN ('junior', 'pleno', 'senior', 'tech-lead', 'staff')),
    category VARCHAR(50) NOT NULL CHECK (category IN ('frontend', 'backend', 'fullstack', 'mobile')),
    
    location VARCHAR(200),
    is_remote BOOLEAN DEFAULT FALSE,
    remote_type VARCHAR(50) CHECK (remote_type IN ('fully_remote', 'hybrid', 'onsite')),
    accepted_locations TEXT[],
    
    salary_min INTEGER,
    salary_max INTEGER,
    salary_currency VARCHAR(3) DEFAULT 'BRL',
    show_salary BOOLEAN DEFAULT TRUE,
    
    required_skills TEXT[] DEFAULT '{}',
    nice_skills TEXT[] DEFAULT '{}',
    
    application_url TEXT,
    apply_via_platform BOOLEAN DEFAULT TRUE,
    
    min_xp_required INTEGER DEFAULT 0,
    auto_match BOOLEAN DEFAULT TRUE,
    
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'filled', 'closed')),
    published_at TIMESTAMP,
    expires_at TIMESTAMP,
    filled_at TIMESTAMP,
    
    views_count INTEGER DEFAULT 0,
    applications_count INTEGER DEFAULT 0,
    
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_jobs_company ON jobs(company_id, status);
CREATE INDEX idx_jobs_active ON jobs(status, published_at DESC) WHERE status = 'active';
CREATE INDEX idx_jobs_skills ON jobs USING GIN(required_skills);
CREATE INDEX idx_jobs_location ON jobs(is_remote, location) WHERE status = 'active';

CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    portfolio_snapshot JSONB NOT NULL,
    cover_letter TEXT,
    
    match_score INTEGER,
    match_reasons JSONB,
    
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'interview', 'rejected', 'accepted')),
    status_updated_at TIMESTAMP DEFAULT NOW(),
    
    recruiter_notes TEXT,
    recruiter_rating INTEGER CHECK (recruiter_rating BETWEEN 1 AND 5),
    
    applied_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(job_id, user_id)
);

CREATE INDEX idx_applications_job ON applications(job_id, status, applied_at DESC);
CREATE INDEX idx_applications_user ON applications(user_id, applied_at DESC);
CREATE INDEX idx_applications_match ON applications(match_score DESC) WHERE status = 'pending';

-- ============================================
-- NOTIFICAÇÕES
-- ============================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    type VARCHAR(50) NOT NULL,
    actor_id UUID REFERENCES users(id),
    
    title VARCHAR(200) NOT NULL,
    message TEXT,
    
    reference_type VARCHAR(50),
    reference_id UUID,
    link_url TEXT,
    
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC) WHERE NOT is_read;

-- ============================================
-- ANALYTICS
-- ============================================

CREATE TABLE portfolio_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
    
    visitor_ip VARCHAR(45),
    visitor_country VARCHAR(2),
    visitor_city VARCHAR(100),
    
    referrer_url TEXT,
    referrer_type VARCHAR(50),
    
    user_agent TEXT,
    device_type VARCHAR(20),
    
    viewed_at TIMESTAMP DEFAULT NOW()
) PARTITION BY RANGE (viewed_at);

-- Criar partições mensais
CREATE TABLE portfolio_views_2025_01 PARTITION OF portfolio_views
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

CREATE TABLE portfolio_views_2025_02 PARTITION OF portfolio_views
    FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');

-- ============================================
-- TRIGGERS
-- ============================================

-- Atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_challenges_updated_at
    BEFORE UPDATE ON challenges
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_submissions_updated_at
    BEFORE UPDATE ON submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_portfolios_updated_at
    BEFORE UPDATE ON portfolios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Atualizar contadores
CREATE OR REPLACE FUNCTION update_submission_counters()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE challenges SET submissions_count = submissions_count + 1 
        WHERE id = NEW.challenge_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE challenges SET submissions_count = submissions_count - 1 
        WHERE id = OLD.challenge_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_submissions_count
    AFTER INSERT OR DELETE ON submissions
    FOR EACH ROW EXECUTE FUNCTION update_submission_counters();

-- ============================================
-- SEEDS INICIAIS
-- ============================================

-- Badges padrão
INSERT INTO badges (slug, name, description, icon_url, criteria, rarity) VALUES
('first-blood', 'First Blood', 'Primeira submissão enviada', '/badges/first-blood.svg', '{"type": "submission_count", "value": 1}', 'common'),
('perfectionist', 'Perfeccionista', 'Alcançou score 100 em um desafio', '/badges/perfectionist.svg', '{"type": "perfect_score", "value": 100}', 'rare'),
('streak-7', 'Consistente', '7 dias consecutivos', '/badges/streak-7.svg', '{"type": "streak", "value": 7}', 'common'),
('streak-30', 'Dedicado', '30 dias consecutivos', '/badges/streak-30.svg', '{"type": "streak", "value": 30}', 'rare'),
('streak-100', 'Imparável', '100 dias consecutivos', '/badges/streak-100.svg', '{"type": "streak", "value": 100}', 'legendary'),
('social-butterfly', 'Social', '50 seguidores', '/badges/social.svg', '{"type": "followers", "value": 50}', 'rare'),
('code-reviewer', 'Revisor', '25 code reviews', '/badges/reviewer.svg', '{"type": "reviews_given", "value": 25}', 'epic'),
('battle-champion', 'Campeão', '10 vitórias em batalhas', '/badges/champion.svg', '{"type": "battle_wins", "value": 10}', 'epic');
```
