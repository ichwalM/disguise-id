-- ====================================================================
-- MIGRATION SEMENTARA: MySQL (testing)
-- Diconvert dari docs/schema.md (Postgres/Supabase) ke MySQL 8.
-- Nanti akan kembali menggunakan Supabase sebagai sumber kebenaran schema.
-- ====================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- --------------------------------------------------------------------
-- mst_roles
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mst_roles (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  role_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NULL DEFAULT NULL,
  UNIQUE KEY uq_mst_roles_role_name (role_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------------------
-- mst_users
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mst_users (
  id CHAR(36) NOT NULL DEFAULT (UUID()) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name VARCHAR(255) NULL,
  role_id BIGINT NULL,
  avatar_url TEXT NULL,
  created_at TIMESTAMP NULL DEFAULT NULL,
  updated_at TIMESTAMP NULL DEFAULT NULL,
  email_unique VARCHAR(255) GENERATED ALWAYS AS (email) STORED,
  UNIQUE KEY uq_mst_users_email (email_unique),
  KEY idx_mst_users_role_id (role_id),
  CONSTRAINT fk_mst_users_role
    FOREIGN KEY (role_id) REFERENCES mst_roles (id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------------------
-- mst_timelines
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mst_timelines (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id CHAR(36) NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  status VARCHAR(255) NULL,
  created_at TIMESTAMP NULL DEFAULT NULL,
  KEY idx_mst_timelines_user_id (user_id),
  CONSTRAINT fk_mst_timelines_user
    FOREIGN KEY (user_id) REFERENCES mst_users (id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------------------
-- ai_models
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ai_models (
  id CHAR(36) NOT NULL DEFAULT (UUID()) PRIMARY KEY,
  version_name VARCHAR(255) NOT NULL,
  architecture_type VARCHAR(255) NOT NULL,
  hyperparameters JSON NULL,
  weights_storage_path TEXT NULL,
  is_active BOOLEAN NULL,
  created_by CHAR(36) NULL,
  created_at TIMESTAMP NULL DEFAULT NULL,
  UNIQUE KEY uq_ai_models_version_name (version_name),
  KEY idx_ai_models_created_by (created_by),
  CONSTRAINT fk_ai_models_created_by
    FOREIGN KEY (created_by) REFERENCES mst_users (id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------------------
-- ai_training_logs
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ai_training_logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  model_id CHAR(36) NULL,
  epoch_number INT NOT NULL,
  generator_loss DECIMAL(12,6) NULL,
  discriminator_loss DECIMAL(12,6) NULL,
  duration_seconds DECIMAL(12,3) NULL,
  created_at TIMESTAMP NULL DEFAULT NULL,
  KEY idx_ai_training_logs_model_id (model_id),
  CONSTRAINT fk_ai_training_logs_model
    FOREIGN KEY (model_id) REFERENCES ai_models (id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------------------
-- datasets
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS datasets (
  id CHAR(36) NOT NULL DEFAULT (UUID()) PRIMARY KEY,
  dataset_name VARCHAR(255) NOT NULL,
  description TEXT NULL,
  total_images INT NULL,
  created_at TIMESTAMP NULL DEFAULT NULL,
  UNIQUE KEY uq_datasets_dataset_name (dataset_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------------------
-- forensic_cases
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS forensic_cases (
  id CHAR(36) NOT NULL DEFAULT (UUID()) PRIMARY KEY,
  case_number VARCHAR(255) NOT NULL,
  investigator_id CHAR(36) NULL,
  notes TEXT NULL,
  status VARCHAR(255) NULL,
  created_at TIMESTAMP NULL DEFAULT NULL,
  UNIQUE KEY uq_forensic_cases_case_number (case_number),
  KEY idx_forensic_cases_investigator_id (investigator_id),
  CONSTRAINT fk_forensic_cases_investigator
    FOREIGN KEY (investigator_id) REFERENCES mst_users (id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------------------
-- forensic_results
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS forensic_results (
  id CHAR(36) NOT NULL DEFAULT (UUID()) PRIMARY KEY,
  case_id CHAR(36) NULL,
  model_used CHAR(36) NULL,
  dataset_source CHAR(36) NULL,
  input_cctv_url TEXT NOT NULL,
  target_clean_url TEXT NULL,
  output_ai_url TEXT NULL,
  ssim_score DECIMAL(10,6) NULL,
  psnr_score DECIMAL(10,4) NULL,
  processing_time_ms INT NULL,
  created_at TIMESTAMP NULL DEFAULT NULL,
  KEY idx_forensic_results_case_id (case_id),
  KEY idx_forensic_results_model_used (model_used),
  KEY idx_forensic_results_dataset_source (dataset_source),
  CONSTRAINT fk_forensic_results_case
    FOREIGN KEY (case_id) REFERENCES forensic_cases (id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_forensic_results_model
    FOREIGN KEY (model_used) REFERENCES ai_models (id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_forensic_results_dataset
    FOREIGN KEY (dataset_source) REFERENCES datasets (id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;
