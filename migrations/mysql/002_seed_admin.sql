-- ====================================================================
-- SEED: Akun admin untuk testing skema MySQL
-- Catatan: login aplikasi (Supabase Auth) TIDAK terhubung ke data ini —
-- tabel mst_users di sini tidak punya kolom password. Seed ini hanya
-- untuk menguji struktur data (relasi role, dashboard, dst) di MySQL.
-- ====================================================================

INSERT INTO mst_roles (id, role_name, created_at) VALUES
  (1, 'Super Admin', NOW()),
  (2, 'Operator Forensik', NOW()),
  (3, 'Peneliti', NOW())
ON DUPLICATE KEY UPDATE role_name = VALUES(role_name);

INSERT INTO mst_users (id, email, full_name, role_id, created_at, updated_at) VALUES
  ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'ichwal.admin@disguise.id', 'Ichwal Admin', 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), role_id = VALUES(role_id);
