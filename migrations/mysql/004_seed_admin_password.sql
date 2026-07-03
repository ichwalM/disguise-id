-- ====================================================================
-- Set password akun admin (dari 002_seed_admin.sql) supaya bisa login.
-- Email : ichwal.admin@disguise.id
-- Password (plain, hanya untuk testing lokal) : AdminRahasia123!
-- ====================================================================

UPDATE mst_users
SET password_hash = '$2b$10$VDPzirfvObFxC3s3sWgYx.QYeh/4z8n0lzVdtAl6alt6ZKWFZQbty'
WHERE email = 'ichwal.admin@disguise.id';
