-- =====================================================
-- Compila.dev - Update Password Hashes
-- Senha para todos os usuários de teste: secret123
-- =====================================================

-- Hash bcrypt válido para "secret123" (cost 10)
UPDATE users SET password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy' WHERE id = '00000000-0000-0000-0000-000000000001';

UPDATE users SET password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy' WHERE id = '00000000-0000-0000-0000-000000000002';

UPDATE users SET password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy' WHERE id = '00000000-0000-0000-0000-000000000003';

UPDATE users SET password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy' WHERE id = '00000000-0000-0000-0000-000000000004';

UPDATE users SET password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy' WHERE id = '00000000-0000-0000-0000-000000000005';
