-- Add auto_share_milestones column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS auto_share_milestones BOOLEAN DEFAULT FALSE;

-- Add comment
COMMENT ON COLUMN users.auto_share_milestones IS 'Whether user wants automatic posts for milestones (challenges, badges)';
