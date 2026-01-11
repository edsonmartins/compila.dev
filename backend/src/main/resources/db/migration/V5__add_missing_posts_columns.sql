-- Add missing columns to posts table if they don't exist
ALTER TABLE posts ADD COLUMN IF NOT EXISTS badge_id UUID;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS challenge_id UUID;

-- Create comments table if it doesn't exist
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    post_id UUID NOT NULL,
    parent_id UUID,
    content TEXT NOT NULL,
    code_snippet JSONB,
    is_solution BOOLEAN NOT NULL DEFAULT FALSE,
    fire_count INTEGER NOT NULL DEFAULT 0,
    accepted_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create kudos table if it doesn't exist
CREATE TABLE IF NOT EXISTS kudos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    post_id UUID NOT NULL,
    kudo_type VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create follows table if it doesn't exist
CREATE TABLE IF NOT EXISTS follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID NOT NULL,
    following_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
