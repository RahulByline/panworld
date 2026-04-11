-- =============================================================================
-- Panworld Portal — incremental migration (existing database)
-- Date: 2026-04-10
-- =============================================================================
-- Purpose:
--   1) Extend `schools` with address, contact, and explicit logo URL for
--      Main Admin "create school" / school profile (complements `branding` JSON).
--   2) Add optional `users.username` for future login-by-username (email stays primary today).
--   3) Extend `users.role` with SCHOOL_ADMIN and SALES_ADMIN for onboarding workflows.
--   4) Optional `schools.created_by_user_id` for audit (which staff created the school).
--
-- Apply: run once against `panworld_portal` (or your DB name). Safe to re-run:
-- uses INFORMATION_SCHEMA checks before ALTER.
--
-- After migration, provision a school admin with:
--   INSERT INTO schools (... new columns ...) VALUES (...);
--   INSERT INTO users (..., role, school_id) VALUES (..., 'SCHOOL_ADMIN', '<school_id>');
--   (hash password in app with bcrypt; same as existing users.)
-- =============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 1;

-- ---------------------------------------------------------------------------
-- schools: profile / address / contact / logo
-- ---------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS _pw_add_school_profile_columns;

DELIMITER $$

CREATE PROCEDURE _pw_add_school_profile_columns()
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'schools' AND COLUMN_NAME = 'address_line1'
  ) THEN
    ALTER TABLE schools ADD COLUMN address_line1 VARCHAR(255) NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'schools' AND COLUMN_NAME = 'address_line2'
  ) THEN
    ALTER TABLE schools ADD COLUMN address_line2 VARCHAR(255) NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'schools' AND COLUMN_NAME = 'city'
  ) THEN
    ALTER TABLE schools ADD COLUMN city VARCHAR(128) NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'schools' AND COLUMN_NAME = 'region'
  ) THEN
    ALTER TABLE schools ADD COLUMN region VARCHAR(128) NULL COMMENT 'Emirate / province / state';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'schools' AND COLUMN_NAME = 'postal_code'
  ) THEN
    ALTER TABLE schools ADD COLUMN postal_code VARCHAR(32) NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'schools' AND COLUMN_NAME = 'phone'
  ) THEN
    ALTER TABLE schools ADD COLUMN phone VARCHAR(64) NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'schools' AND COLUMN_NAME = 'school_email'
  ) THEN
    ALTER TABLE schools ADD COLUMN school_email VARCHAR(191) NULL COMMENT 'Official school contact email (not login)';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'schools' AND COLUMN_NAME = 'website'
  ) THEN
    ALTER TABLE schools ADD COLUMN website VARCHAR(512) NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'schools' AND COLUMN_NAME = 'logo_url'
  ) THEN
    ALTER TABLE schools ADD COLUMN logo_url VARCHAR(512) NULL COMMENT 'Public URL; can mirror branding.logoUrl';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'schools' AND COLUMN_NAME = 'created_by_user_id'
  ) THEN
    ALTER TABLE schools ADD COLUMN created_by_user_id VARCHAR(32) NULL;
  END IF;
END$$

DELIMITER ;

CALL _pw_add_school_profile_columns();
DROP PROCEDURE IF EXISTS _pw_add_school_profile_columns;

-- Index for created_by (skip if already present)
SET @idx_exists := (
  SELECT COUNT(*) FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'schools'
    AND INDEX_NAME = 'idx_schools_created_by_user_id'
);
SET @sql := IF(@idx_exists = 0,
  'CREATE INDEX idx_schools_created_by_user_id ON schools (created_by_user_id)',
  'SELECT ''index idx_schools_created_by_user_id already exists'' AS msg'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Optional FK: only add if users table exists and constraint missing
SET @fk_exists := (
  SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS
  WHERE CONSTRAINT_SCHEMA = DATABASE()
    AND TABLE_NAME = 'schools'
    AND CONSTRAINT_NAME = 'fk_schools_created_by_user'
);
SET @sql_fk := IF(@fk_exists = 0,
  'ALTER TABLE schools ADD CONSTRAINT fk_schools_created_by_user FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE',
  'SELECT ''fk_schools_created_by_user already exists'' AS msg'
);
PREPARE stmt FROM @sql_fk;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ---------------------------------------------------------------------------
-- users: optional username (email remains unique login for current API)
-- ---------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS _pw_add_users_username;

DELIMITER $$

CREATE PROCEDURE _pw_add_users_username()
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'username'
  ) THEN
    ALTER TABLE users ADD COLUMN username VARCHAR(191) NULL COMMENT 'Optional; unique when set';
  END IF;
END$$

DELIMITER ;

CALL _pw_add_users_username();
DROP PROCEDURE IF EXISTS _pw_add_users_username;

SET @uname_idx := (
  SELECT COUNT(*) FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'users'
    AND INDEX_NAME = 'uq_users_username'
);
SET @sql_un := IF(@uname_idx = 0,
  'CREATE UNIQUE INDEX uq_users_username ON users (username)',
  'SELECT ''unique index uq_users_username already exists'' AS msg'
);
PREPARE stmt FROM @sql_un;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ---------------------------------------------------------------------------
-- users.role: add SCHOOL_ADMIN, SALES_ADMIN
-- ---------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS _pw_extend_user_role_enum;

DELIMITER $$

CREATE PROCEDURE _pw_extend_user_role_enum()
BEGIN
  DECLARE ct TEXT;

  SELECT COLUMN_TYPE INTO ct
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'users'
    AND COLUMN_NAME = 'role'
  LIMIT 1;

  IF ct IS NOT NULL AND (ct NOT LIKE '%SCHOOL_ADMIN%' OR ct NOT LIKE '%SALES_ADMIN%') THEN
    ALTER TABLE users MODIFY COLUMN role ENUM(
      'TEACHER',
      'HOD',
      'MANAGEMENT',
      'CEO',
      'PROCUREMENT',
      'PANWORLD_ADMIN',
      'PUBLISHER',
      'SCHOOL_ADMIN',
      'SALES_ADMIN'
    ) COLLATE utf8mb4_unicode_ci NOT NULL;
  END IF;
END$$

DELIMITER ;

CALL _pw_extend_user_role_enum();
DROP PROCEDURE IF EXISTS _pw_extend_user_role_enum;

-- =============================================================================
-- Done. Next steps (application layer, not this file):
--   • Main Admin API: create school row + bcrypt hash + insert SCHOOL_ADMIN user.
--   • Extend JWT/auth types to include new roles; gate routes with requireRole.
--   • If using username login, extend auth.service lookup: WHERE email = ? OR username = ?
-- =============================================================================
