-- =====================================================
-- Compila.dev - Seed Data
-- Test Users e Dados Iniciais
-- =====================================================

-- Senhas: usando bcrypt (cost 10)
-- Para gerar hashes: htpasswd -bnB 10 PASSWORD

INSERT INTO users (id, username, email, password_hash, full_name, bio, avatar_url, level, xp, streak_current, streak_best, subscription_plan, enabled, created_at, updated_at) VALUES
-- Admin (password: admin123)
('00000000-0000-0000-0000-000000000001', 'admin', 'admin@compila.dev', '$2a$10$U5JKFVLVjVHJKVDVJVHVHVjHVJVHJVHVJVHVJVHVJVHVJVHV', 'Administrador', 'Administrador do sistema Compila.dev', 'https://i.pravatar.cc/150?img=1', 10, 15000, 30, 100, 'PRO_PLUS', true, NOW(), NOW()),

-- User (password: joao123)
('00000000-0000-0000-0000-000000000002', 'joaosilva', 'joao@compila.dev', '$2a$10$VWLKFMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWM', 'João Silva', 'Desenvolvedor Full Stack apaixonado por React e Node.js', 'https://i.pravatar.cc/150?img=11', 5, 4500, 7, 30, 'PRO', true, NOW(), NOW()),

-- Test (password: test123)
('00000000-0000-0000-0000-000000000003', 'testuser', 'test@compila.dev', '$2a$10$XMLNGNXNZNZNZNZNZNZNZNZNZNZNZNZNZNZNZNZNZNZN', 'Usuário Teste', 'Usuário para testes do sistema', 'https://i.pravatar.cc/150?img=3', 1, 500, 3, 7, 'FREE', true, NOW(), NOW()),

-- Maria (password: maria123)
('00000000-0000-0000-0000-000000000004', 'mariadev', 'maria@compila.dev', '$2a$10$YNJMHOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYOYO', 'Maria Santos', 'Desenvolvedora Senior especialista em Python e Data Science', 'https://i.pravatar.cc/150?img=5', 15, 25000, 45, 90, 'PRO', true, NOW(), NOW()),

-- Pedro (password: pedro123)
('00000000-0000-0000-0000-000000000005', 'pedrobr', 'pedro@compila.dev', '$2a$10$ZKNPIPZPZPZPZPZPZPZPZPZPZPZPZPZPZPZPZPZP', 'Pedro Costa', 'Iniciante em programação, focado em aprender JavaScript', 'https://i.pravatar.cc/150?img=12', 1, 100, 1, 1, 'FREE', true, NOW(), NOW())
ON CONFLICT (username) DO NOTHING;

-- =====================================================
-- Badges de Exemplo
-- =====================================================

INSERT INTO user_badges (id, user_id, badge_type, earned_at) VALUES
('30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'FIRST_CHALLENGE', NOW()),
('30000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'STREAK_7', NOW()),
('30000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000004', 'XP_1000', NOW()),
('30000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000004', 'STREAK_30', NOW()),
('30000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000004', 'XP_5000', NOW())
ON CONFLICT (user_id, badge_type) DO NOTHING;
