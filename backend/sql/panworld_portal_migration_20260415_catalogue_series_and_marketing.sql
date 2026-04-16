-- =============================================================================
-- Panworld Portal — Catalogue series, textbook items, marketing elements
-- Date: 2026-04-15
-- =============================================================================
-- Purpose:
--   1) Create series-level catalogue entities for admin CMS (/admin/cms/textbooks).
--   2) Allow adding grade-level textbook/library/kit line items under each series.
--   3) Allow attaching pre-sales/post-sales marketing elements to a series.
--
-- Run once:
--   mysql -u YOUR_USER -p panworld_portal < panworld_portal_migration_20260415_catalogue_series_and_marketing.sql
-- =============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE IF NOT EXISTS catalogue_series (
  id VARCHAR(32) PRIMARY KEY,
  category ENUM('textbooks', 'library', 'kits') NOT NULL,
  name VARCHAR(191) NOT NULL,
  publisher VARCHAR(191) NOT NULL,
  format VARCHAR(64) NOT NULL DEFAULT 'Print',
  curriculum_type VARCHAR(191) NOT NULL,
  subject VARCHAR(191) NOT NULL,
  grade_from VARCHAR(32) NOT NULL,
  grade_to VARCHAR(32) NOT NULL,
  description TEXT NULL,
  detail_line VARCHAR(255) NULL,
  status ENUM('Published', 'Draft', 'Archived') NOT NULL DEFAULT 'Draft',
  badges JSON NULL,
  territories JSON NULL,
  folder_image_url VARCHAR(512) NULL,
  created_by_user_id VARCHAR(32) NULL,
  updated_by_user_id VARCHAR(32) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  INDEX idx_catalogue_series_category_status (category, status),
  INDEX idx_catalogue_series_publisher (publisher),
  INDEX idx_catalogue_series_created_at (created_at),
  CONSTRAINT fk_catalogue_series_created_by
    FOREIGN KEY (created_by_user_id) REFERENCES users(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_catalogue_series_updated_by
    FOREIGN KEY (updated_by_user_id) REFERENCES users(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS catalogue_series_items (
  id VARCHAR(32) PRIMARY KEY,
  series_id VARCHAR(32) NOT NULL,
  resource_type ENUM(
    'TEXTBOOK',
    'LIBRARY_BOOK',
    'TEACHER_GUIDE',
    'PRACTICE_BOOK',
    'KIT',
    'DIGITAL_LICENSE',
    'ASSESSMENT',
    'OTHER'
  ) NOT NULL DEFAULT 'TEXTBOOK',
  title VARCHAR(255) NOT NULL,
  subject VARCHAR(191) NULL,
  grade_label VARCHAR(64) NOT NULL,
  internal_sku VARCHAR(128) NULL,
  isbn VARCHAR(64) NULL,
  format VARCHAR(64) NOT NULL DEFAULT 'Print',
  list_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  currency_code CHAR(3) NOT NULL DEFAULT 'AED',
  price_unit VARCHAR(64) NOT NULL DEFAULT '/ student',
  status ENUM('Published', 'Draft', 'Archived') NOT NULL DEFAULT 'Draft',
  cover_image_url VARCHAR(512) NULL,
  material_link_url VARCHAR(512) NULL,
  material_file_url VARCHAR(512) NULL,
  inventory_note VARCHAR(255) NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  UNIQUE KEY uq_catalogue_item_series_title_grade (series_id, title, grade_label),
  INDEX idx_catalogue_items_series (series_id),
  INDEX idx_catalogue_items_status (status),
  CONSTRAINT fk_catalogue_items_series
    FOREIGN KEY (series_id) REFERENCES catalogue_series(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Backward-safe updates if table already existed from an earlier import of this file.
SET @resource_type_exists := (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'catalogue_series_items'
    AND COLUMN_NAME = 'resource_type'
);
SET @sql_resource_type := IF(
  @resource_type_exists = 0,
  "ALTER TABLE catalogue_series_items ADD COLUMN resource_type ENUM('TEXTBOOK','LIBRARY_BOOK','TEACHER_GUIDE','PRACTICE_BOOK','KIT','DIGITAL_LICENSE','ASSESSMENT','OTHER') NOT NULL DEFAULT 'TEXTBOOK' AFTER series_id",
  "SELECT 'resource_type already exists' AS msg"
);
PREPARE stmt FROM @sql_resource_type;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @subject_exists := (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'catalogue_series_items'
    AND COLUMN_NAME = 'subject'
);
SET @sql_subject := IF(
  @subject_exists = 0,
  "ALTER TABLE catalogue_series_items ADD COLUMN subject VARCHAR(191) NULL AFTER title",
  "SELECT 'subject already exists' AS msg"
);
PREPARE stmt FROM @sql_subject;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

CREATE TABLE IF NOT EXISTS catalogue_series_marketing_assets (
  id VARCHAR(32) PRIMARY KEY,
  series_id VARCHAR(32) NOT NULL,
  asset_type VARCHAR(64) NOT NULL,
  title VARCHAR(191) NOT NULL,
  description TEXT NULL,
  asset_url VARCHAR(512) NULL,
  asset_file_url VARCHAR(512) NULL,
  audience_stage ENUM('PRE_SALES', 'POST_SALES', 'BOTH') NOT NULL DEFAULT 'BOTH',
  status ENUM('Published', 'Draft', 'Archived') NOT NULL DEFAULT 'Published',
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  INDEX idx_catalogue_marketing_series (series_id),
  INDEX idx_catalogue_marketing_stage (audience_stage),
  CONSTRAINT fk_catalogue_marketing_series
    FOREIGN KEY (series_id) REFERENCES catalogue_series(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
