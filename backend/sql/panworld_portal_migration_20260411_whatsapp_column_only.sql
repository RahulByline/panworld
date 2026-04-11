-- =============================================================================
-- Optional: add schools.whatsapp only (split from main migration)
-- =============================================================================
-- The main file panworld_portal_migration_20260411_curricula_whatsapp.sql now
-- uses a plain ALTER TABLE for whatsapp (no procedure). Use this file only if
-- you need to add whatsapp in isolation after partial imports.
--
-- Select database panworld_portal, then run this ONCE.
-- If you see "Duplicate column name 'whatsapp'", the column is already there — stop.
-- =============================================================================

ALTER TABLE schools
  ADD COLUMN whatsapp VARCHAR(64) NULL COMMENT 'School WhatsApp (E.164 or local digits)';
