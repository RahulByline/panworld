-- =============================================================================
-- Panworld Portal — curricula + schools.whatsapp + countries (single import)
-- =============================================================================
-- Run ONCE against your app database (default name: panworld_portal).
-- Uses only CREATE TABLE / INSERT / ALTER (no stored procedures).
--
-- Command line:
--   mysql -u YOUR_USER -p panworld_portal < panworld_portal_migration_20260411_curricula_whatsapp.sql
--
-- MySQL Workbench / phpMyAdmin: select database first, then run or import this file.
--
-- If a statement fails because the change already exists:
--   - Duplicate column 'whatsapp' → comment out the ADD COLUMN whatsapp line and re-run the rest.
--   - countries table already exists → comment out CREATE TABLE countries + INSERT, keep ALTER schools if needed.
-- =============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 1;

-- Optional: uncomment if your client does not pre-select the database
-- USE panworld_portal;

-- ---------------------------------------------------------------------------
-- curricula: dropdown source for schools.curriculum_type (value = name string)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS curricula (
  id VARCHAR(32) PRIMARY KEY,
  name VARCHAR(191) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE KEY uq_curricula_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO curricula (id, name, sort_order) VALUES
('cur_british', 'British', 10),
('cur_american', 'American', 20),
('cur_ib', 'IB', 30),
('cur_uae_moe', 'UAE MOE', 40),
('cur_saudi_ncc', 'Saudi NCC', 50),
('cur_mixed', 'Mixed', 60),
('cur_other', 'Other', 70);

-- ---------------------------------------------------------------------------
-- schools.whatsapp (official school WhatsApp; required by API for new schools)
-- If column already exists, comment out this line or ignore "Duplicate column" error.
-- ---------------------------------------------------------------------------
ALTER TABLE schools
  ADD COLUMN whatsapp VARCHAR(64) NULL COMMENT 'School WhatsApp (E.164 or local digits)';

-- ---------------------------------------------------------------------------
-- countries: code + label + default VAT (GET /api/admin/countries)
-- Widens schools.country so new codes work (not only ENUM UAE/KSA in older dumps).
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS countries (
  code VARCHAR(32) PRIMARY KEY,
  label VARCHAR(191) NOT NULL,
  vat_rate DECIMAL(5, 2) NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO countries (code, label, vat_rate, sort_order) VALUES
('UAE', 'United Arab Emirates', 5.00, 10),
('KSA', 'Kingdom of Saudi Arabia', 15.00, 20);

ALTER TABLE schools MODIFY COLUMN country VARCHAR(32) NOT NULL;
