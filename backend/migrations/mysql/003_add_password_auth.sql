-- ====================================================================
-- Tambahan kolom password untuk login lokal berbasis MySQL (testing).
-- Kolom ini TIDAK ada di docs/schema.md (Supabase mengelola password
-- lewat auth.users) — ditambahkan khusus supaya /login bisa memverifikasi
-- kredensial langsung dari MySQL selama masa testing.
-- ====================================================================

SET @col_exists = (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'mst_users'
    AND COLUMN_NAME = 'password_hash'
);

SET @sql = IF(@col_exists = 0,
  'ALTER TABLE mst_users ADD COLUMN password_hash VARCHAR(255) NOT NULL DEFAULT '''' AFTER email',
  'SELECT 1'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
