-- ====================================================================
-- Tambahan kolom password untuk login lokal berbasis MySQL (testing).
-- Kolom ini TIDAK ada di docs/schema.md (Supabase mengelola password
-- lewat auth.users) — ditambahkan khusus supaya /login bisa memverifikasi
-- kredensial langsung dari MySQL selama masa testing.
-- ====================================================================

ALTER TABLE mst_users
  ADD COLUMN password_hash VARCHAR(255) NOT NULL DEFAULT '' AFTER email;
