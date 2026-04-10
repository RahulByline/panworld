-- PANWORLD SCHOOL PARTNER PORTAL
-- Single-file import: schema + seed (Prisma-free)
--
-- Recommended usage:
--   1) CREATE DATABASE panworld_portal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
--   2) USE panworld_portal;
--   3) Import this file.

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

-- =========================
-- SCHEMA (DDL)
-- =========================

DROP TABLE IF EXISTS integration_sync_logs;
DROP TABLE IF EXISTS language_preferences;
DROP TABLE IF EXISTS settings;
DROP TABLE IF EXISTS nps_surveys;
DROP TABLE IF EXISTS feedback;
DROP TABLE IF EXISTS recommendation_logs;
DROP TABLE IF EXISTS chatbot_logs;
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS deliveries;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS quotations;
DROP TABLE IF EXISTS rfq_items;
DROP TABLE IF EXISTS rfqs;
DROP TABLE IF EXISTS sample_requests;
DROP TABLE IF EXISTS certificates;
DROP TABLE IF EXISTS downloads;
DROP TABLE IF EXISTS resources;
DROP TABLE IF EXISTS pd_enrollments;
DROP TABLE IF EXISTS pd_courses;
DROP TABLE IF EXISTS webinar_registrations;
DROP TABLE IF EXISTS webinars;
DROP TABLE IF EXISTS support_messages;
DROP TABLE IF EXISTS support_tickets;
DROP TABLE IF EXISTS user_training_progress;
DROP TABLE IF EXISTS training_videos;
DROP TABLE IF EXISTS training_series;
DROP TABLE IF EXISTS contacts;
DROP TABLE IF EXISTS announcements;
DROP TABLE IF EXISTS demo_requests;
DROP TABLE IF EXISTS wishlist_items;
DROP TABLE IF EXISTS wishlists;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS refresh_tokens;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS schools;
DROP TABLE IF EXISTS school_groups;
DROP TABLE IF EXISTS publishers;

CREATE TABLE publishers (
  id VARCHAR(32) PRIMARY KEY,
  name VARCHAR(191) NOT NULL UNIQUE,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE school_groups (
  id VARCHAR(32) PRIMARY KEY,
  name VARCHAR(191) NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE schools (
  id VARCHAR(32) PRIMARY KEY,
  name VARCHAR(191) NOT NULL,
  country ENUM('UAE','KSA') NOT NULL,
  curriculum_type VARCHAR(191) NOT NULL,
  purchase_status ENUM('REGISTERED_NO_ORDERS','FIRST_ORDER_CONFIRMED','ACTIVE_REPEAT') NOT NULL DEFAULT 'REGISTERED_NO_ORDERS',
  preferred_lang VARCHAR(10) NOT NULL DEFAULT 'en',
  enabled_modules JSON NOT NULL,
  branding JSON NULL,
  vat_rate DECIMAL(5,2) NOT NULL,
  group_id VARCHAR(32) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  INDEX idx_schools_group_id (group_id),
  CONSTRAINT fk_schools_group
    FOREIGN KEY (group_id) REFERENCES school_groups(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE users (
  id VARCHAR(32) PRIMARY KEY,
  email VARCHAR(191) NOT NULL UNIQUE,
  password_hash VARCHAR(191) NOT NULL,
  first_name VARCHAR(191) NOT NULL,
  last_name VARCHAR(191) NOT NULL,
  role ENUM('TEACHER','HOD','MANAGEMENT','CEO','PROCUREMENT','PANWORLD_ADMIN','PUBLISHER') NOT NULL,
  department VARCHAR(191) NULL,
  active TINYINT(1) NOT NULL DEFAULT 1,
  preferred_lang VARCHAR(10) NOT NULL DEFAULT 'en',
  last_login_at DATETIME(3) NULL,
  impersonated_by_id VARCHAR(32) NULL,
  school_id VARCHAR(32) NULL,
  publisher_id VARCHAR(32) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  INDEX idx_users_school_id (school_id),
  INDEX idx_users_publisher_id (publisher_id),
  CONSTRAINT fk_users_school
    FOREIGN KEY (school_id) REFERENCES schools(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_users_publisher
    FOREIGN KEY (publisher_id) REFERENCES publishers(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE refresh_tokens (
  id VARCHAR(32) PRIMARY KEY,
  token_hash VARCHAR(191) NOT NULL,
  user_agent VARCHAR(255) NULL,
  ip_address VARCHAR(64) NULL,
  revoked_at DATETIME(3) NULL,
  expires_at DATETIME(3) NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  user_id VARCHAR(32) NOT NULL,
  INDEX idx_refresh_tokens_user_id (user_id),
  CONSTRAINT fk_refresh_tokens_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE products (
  id VARCHAR(32) PRIMARY KEY,
  sku VARCHAR(64) NOT NULL UNIQUE,
  name VARCHAR(191) NOT NULL,
  series_name VARCHAR(191) NULL,
  type VARCHAR(32) NOT NULL,
  grade_min INT NULL,
  grade_max INT NULL,
  subject VARCHAR(191) NULL,
  curriculum VARCHAR(191) NULL,
  format VARCHAR(64) NULL,
  edition VARCHAR(191) NULL,
  country_tags JSON NOT NULL,
  ncc_approved TINYINT(1) NOT NULL DEFAULT 0,
  price DECIMAL(10,2) NOT NULL,
  cover_image_url VARCHAR(512) NULL,
  metadata JSON NULL,
  publisher_id VARCHAR(32) NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  INDEX idx_products_publisher_id (publisher_id),
  CONSTRAINT fk_products_publisher
    FOREIGN KEY (publisher_id) REFERENCES publishers(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE wishlists (
  id VARCHAR(32) PRIMARY KEY,
  name VARCHAR(191) NOT NULL DEFAULT 'Default',
  school_id VARCHAR(32) NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  INDEX idx_wishlists_school_id (school_id),
  CONSTRAINT fk_wishlists_school
    FOREIGN KEY (school_id) REFERENCES schools(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE wishlist_items (
  id VARCHAR(32) PRIMARY KEY,
  wishlist_id VARCHAR(32) NOT NULL,
  product_id VARCHAR(32) NOT NULL,
  added_by_user_id VARCHAR(32) NULL,
  added_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  tags JSON NULL,
  INDEX idx_wishlist_items_wishlist_id (wishlist_id),
  INDEX idx_wishlist_items_product_id (product_id),
  CONSTRAINT fk_wishlist_items_wishlist
    FOREIGN KEY (wishlist_id) REFERENCES wishlists(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_wishlist_items_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_wishlist_items_added_by
    FOREIGN KEY (added_by_user_id) REFERENCES users(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE demo_requests (
  id VARCHAR(32) PRIMARY KEY,
  requested_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  status VARCHAR(64) NOT NULL DEFAULT 'CREDENTIALS_SENT',
  channel_log JSON NULL,
  school_id VARCHAR(32) NULL,
  product_id VARCHAR(32) NULL,
  publisher_id VARCHAR(32) NULL,
  requested_by_user_id VARCHAR(32) NULL,
  INDEX idx_demo_requests_school_id (school_id),
  INDEX idx_demo_requests_product_id (product_id),
  INDEX idx_demo_requests_publisher_id (publisher_id),
  CONSTRAINT fk_demo_requests_school
    FOREIGN KEY (school_id) REFERENCES schools(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_demo_requests_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_demo_requests_publisher
    FOREIGN KEY (publisher_id) REFERENCES publishers(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_demo_requests_user
    FOREIGN KEY (requested_by_user_id) REFERENCES users(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE announcements (
  id VARCHAR(32) PRIMARY KEY,
  title VARCHAR(191) NOT NULL,
  body TEXT NOT NULL,
  category VARCHAR(64) NOT NULL,
  pinned TINYINT(1) NOT NULL DEFAULT 0,
  audience JSON NOT NULL,
  created_by_user_id VARCHAR(32) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  INDEX idx_announcements_created_by (created_by_user_id),
  CONSTRAINT fk_announcements_user
    FOREIGN KEY (created_by_user_id) REFERENCES users(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE contacts (
  id VARCHAR(32) PRIMARY KEY,
  name VARCHAR(191) NOT NULL,
  title VARCHAR(191) NOT NULL,
  email VARCHAR(191) NULL,
  phone VARCHAR(64) NULL,
  whatsapp VARCHAR(64) NULL,
  territory JSON NOT NULL,
  type VARCHAR(64) NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE training_series (
  id VARCHAR(32) PRIMARY KEY,
  title VARCHAR(191) NOT NULL,
  description TEXT NOT NULL,
  publisher_id VARCHAR(32) NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX idx_training_series_publisher_id (publisher_id),
  CONSTRAINT fk_training_series_publisher
    FOREIGN KEY (publisher_id) REFERENCES publishers(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE training_videos (
  id VARCHAR(32) PRIMARY KEY,
  series_id VARCHAR(32) NOT NULL,
  title VARCHAR(191) NOT NULL,
  duration_min INT NOT NULL,
  order_index INT NOT NULL,
  video_url VARCHAR(512) NULL,
  chapter_markers JSON NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX idx_training_videos_series_id (series_id),
  CONSTRAINT fk_training_videos_series
    FOREIGN KEY (series_id) REFERENCES training_series(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE user_training_progress (
  id VARCHAR(32) PRIMARY KEY,
  user_id VARCHAR(32) NOT NULL,
  series_id VARCHAR(32) NOT NULL,
  progress_pct INT NOT NULL DEFAULT 0,
  completed_at DATETIME(3) NULL,
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  UNIQUE KEY uq_user_training (user_id, series_id),
  INDEX idx_user_training_user_id (user_id),
  INDEX idx_user_training_series_id (series_id),
  CONSTRAINT fk_user_training_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_user_training_series
    FOREIGN KEY (series_id) REFERENCES training_series(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE support_tickets (
  id VARCHAR(32) PRIMARY KEY,
  school_id VARCHAR(32) NOT NULL,
  created_by_user_id VARCHAR(32) NULL,
  subject VARCHAR(191) NOT NULL,
  description TEXT NOT NULL,
  status ENUM('OPEN','IN_PROGRESS','RESOLVED') NOT NULL DEFAULT 'OPEN',
  priority VARCHAR(32) NOT NULL DEFAULT 'NORMAL',
  attachments JSON NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  INDEX idx_support_tickets_school_id (school_id),
  INDEX idx_support_tickets_created_by (created_by_user_id),
  CONSTRAINT fk_support_tickets_school
    FOREIGN KEY (school_id) REFERENCES schools(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_support_tickets_user
    FOREIGN KEY (created_by_user_id) REFERENCES users(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE support_messages (
  id VARCHAR(32) PRIMARY KEY,
  ticket_id VARCHAR(32) NOT NULL,
  author_user_id VARCHAR(32) NULL,
  body TEXT NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX idx_support_messages_ticket_id (ticket_id),
  CONSTRAINT fk_support_messages_ticket
    FOREIGN KEY (ticket_id) REFERENCES support_tickets(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_support_messages_user
    FOREIGN KEY (author_user_id) REFERENCES users(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE webinars (
  id VARCHAR(32) PRIMARY KEY,
  publisher_id VARCHAR(32) NOT NULL,
  title VARCHAR(191) NOT NULL,
  description TEXT NOT NULL,
  starts_at DATETIME(3) NOT NULL,
  duration_min INT NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX idx_webinars_publisher_id (publisher_id),
  CONSTRAINT fk_webinars_publisher
    FOREIGN KEY (publisher_id) REFERENCES publishers(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE webinar_registrations (
  id VARCHAR(32) PRIMARY KEY,
  webinar_id VARCHAR(32) NOT NULL,
  user_id VARCHAR(32) NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE KEY uq_webinar_registration (webinar_id, user_id),
  INDEX idx_webinar_regs_user_id (user_id),
  CONSTRAINT fk_webinar_regs_webinar
    FOREIGN KEY (webinar_id) REFERENCES webinars(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_webinar_regs_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE pd_courses (
  id VARCHAR(32) PRIMARY KEY,
  title VARCHAR(191) NOT NULL,
  description TEXT NOT NULL,
  is_paid TINYINT(1) NOT NULL DEFAULT 0,
  price DECIMAL(10,2) NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE pd_enrollments (
  id VARCHAR(32) PRIMARY KEY,
  course_id VARCHAR(32) NOT NULL,
  user_id VARCHAR(32) NOT NULL,
  progress_pct INT NOT NULL DEFAULT 0,
  completed_at DATETIME(3) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  UNIQUE KEY uq_pd_enrollment (course_id, user_id),
  INDEX idx_pd_enrollments_user_id (user_id),
  CONSTRAINT fk_pd_enrollments_course
    FOREIGN KEY (course_id) REFERENCES pd_courses(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_pd_enrollments_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE resources (
  id VARCHAR(32) PRIMARY KEY,
  publisher_id VARCHAR(32) NOT NULL,
  title VARCHAR(191) NOT NULL,
  description TEXT NOT NULL,
  type VARCHAR(32) NOT NULL,
  url VARCHAR(512) NULL,
  is_premium TINYINT(1) NOT NULL DEFAULT 0,
  tags JSON NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX idx_resources_publisher_id (publisher_id),
  CONSTRAINT fk_resources_publisher
    FOREIGN KEY (publisher_id) REFERENCES publishers(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE downloads (
  id VARCHAR(32) PRIMARY KEY,
  resource_id VARCHAR(32) NOT NULL,
  user_id VARCHAR(32) NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX idx_downloads_resource_id (resource_id),
  INDEX idx_downloads_user_id (user_id),
  CONSTRAINT fk_downloads_resource
    FOREIGN KEY (resource_id) REFERENCES resources(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_downloads_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE certificates (
  id VARCHAR(32) PRIMARY KEY,
  certificate_no VARCHAR(64) NOT NULL UNIQUE,
  title VARCHAR(191) NOT NULL,
  issued_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  metadata JSON NULL,
  school_id VARCHAR(32) NOT NULL,
  user_id VARCHAR(32) NOT NULL,
  INDEX idx_certificates_school_id (school_id),
  INDEX idx_certificates_user_id (user_id),
  CONSTRAINT fk_certificates_school
    FOREIGN KEY (school_id) REFERENCES schools(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_certificates_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE sample_requests (
  id VARCHAR(32) PRIMARY KEY,
  status ENUM('SUBMITTED','REVIEWED','APPROVED','DISPATCHED','DELIVERED') NOT NULL DEFAULT 'SUBMITTED',
  requested_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  timeline JSON NULL,
  school_id VARCHAR(32) NOT NULL,
  product_id VARCHAR(32) NULL,
  INDEX idx_sample_requests_school_id (school_id),
  INDEX idx_sample_requests_product_id (product_id),
  CONSTRAINT fk_sample_requests_school
    FOREIGN KEY (school_id) REFERENCES schools(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_sample_requests_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE rfqs (
  id VARCHAR(32) PRIMARY KEY,
  rfq_no VARCHAR(64) NOT NULL UNIQUE,
  status ENUM('SUBMITTED','REVIEWED','QUOTED','APPROVED','ORDERED','DELIVERED') NOT NULL DEFAULT 'SUBMITTED',
  notes TEXT NULL,
  school_id VARCHAR(32) NOT NULL,
  created_by_user_id VARCHAR(32) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  INDEX idx_rfqs_school_id (school_id),
  INDEX idx_rfqs_created_by (created_by_user_id),
  CONSTRAINT fk_rfqs_school
    FOREIGN KEY (school_id) REFERENCES schools(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_rfqs_user
    FOREIGN KEY (created_by_user_id) REFERENCES users(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE rfq_items (
  id VARCHAR(32) PRIMARY KEY,
  rfq_id VARCHAR(32) NOT NULL,
  product_id VARCHAR(32) NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NULL,
  INDEX idx_rfq_items_rfq_id (rfq_id),
  INDEX idx_rfq_items_product_id (product_id),
  CONSTRAINT fk_rfq_items_rfq
    FOREIGN KEY (rfq_id) REFERENCES rfqs(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_rfq_items_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE quotations (
  id VARCHAR(32) PRIMARY KEY,
  rfq_id VARCHAR(32) NOT NULL UNIQUE,
  quote_no VARCHAR(64) NOT NULL UNIQUE,
  subtotal DECIMAL(12,2) NOT NULL,
  vat_amount DECIMAL(12,2) NOT NULL,
  total DECIMAL(12,2) NOT NULL,
  file_url VARCHAR(512) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT fk_quotations_rfq
    FOREIGN KEY (rfq_id) REFERENCES rfqs(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE orders (
  id VARCHAR(32) PRIMARY KEY,
  order_no VARCHAR(64) NOT NULL UNIQUE,
  status VARCHAR(64) NOT NULL DEFAULT 'CONFIRMED',
  school_id VARCHAR(32) NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  INDEX idx_orders_school_id (school_id),
  CONSTRAINT fk_orders_school
    FOREIGN KEY (school_id) REFERENCES schools(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE order_items (
  id VARCHAR(32) PRIMARY KEY,
  order_id VARCHAR(32) NOT NULL,
  product_id VARCHAR(32) NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  INDEX idx_order_items_order_id (order_id),
  INDEX idx_order_items_product_id (product_id),
  CONSTRAINT fk_order_items_order
    FOREIGN KEY (order_id) REFERENCES orders(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_order_items_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE deliveries (
  id VARCHAR(32) PRIMARY KEY,
  order_id VARCHAR(32) NOT NULL UNIQUE,
  courier VARCHAR(191) NOT NULL,
  tracking_no VARCHAR(191) NOT NULL,
  eta DATETIME(3) NULL,
  delivered_at DATETIME(3) NULL,
  timeline JSON NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  CONSTRAINT fk_deliveries_order
    FOREIGN KEY (order_id) REFERENCES orders(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE invoices (
  id VARCHAR(32) PRIMARY KEY,
  invoice_no VARCHAR(64) NOT NULL UNIQUE,
  status ENUM('OUTSTANDING','PAID') NOT NULL DEFAULT 'OUTSTANDING',
  subtotal DECIMAL(12,2) NOT NULL,
  vat_amount DECIMAL(12,2) NOT NULL,
  total DECIMAL(12,2) NOT NULL,
  issued_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  due_at DATETIME(3) NULL,
  pdf_url VARCHAR(512) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  school_id VARCHAR(32) NOT NULL,
  INDEX idx_invoices_school_id (school_id),
  CONSTRAINT fk_invoices_school
    FOREIGN KEY (school_id) REFERENCES schools(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE notifications (
  id VARCHAR(32) PRIMARY KEY,
  user_id VARCHAR(32) NOT NULL,
  type VARCHAR(64) NOT NULL,
  title VARCHAR(191) NOT NULL,
  body TEXT NOT NULL,
  read_at DATETIME(3) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX idx_notifications_user_id (user_id),
  CONSTRAINT fk_notifications_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE audit_logs (
  id VARCHAR(32) PRIMARY KEY,
  user_id VARCHAR(32) NULL,
  action VARCHAR(191) NOT NULL,
  entity VARCHAR(191) NOT NULL,
  entity_id VARCHAR(191) NULL,
  metadata JSON NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX idx_audit_logs_user_id (user_id),
  CONSTRAINT fk_audit_logs_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE chatbot_logs (
  id VARCHAR(32) PRIMARY KEY,
  school_id VARCHAR(32) NULL,
  prompt TEXT NOT NULL,
  response TEXT NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX idx_chatbot_logs_school_id (school_id),
  CONSTRAINT fk_chatbot_logs_school
    FOREIGN KEY (school_id) REFERENCES schools(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE recommendation_logs (
  id VARCHAR(32) PRIMARY KEY,
  school_id VARCHAR(32) NULL,
  input JSON NOT NULL,
  output JSON NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX idx_reco_logs_school_id (school_id),
  CONSTRAINT fk_reco_logs_school
    FOREIGN KEY (school_id) REFERENCES schools(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE feedback (
  id VARCHAR(32) PRIMARY KEY,
  user_id VARCHAR(32) NULL,
  type VARCHAR(64) NOT NULL,
  rating INT NULL,
  message TEXT NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX idx_feedback_user_id (user_id),
  CONSTRAINT fk_feedback_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE nps_surveys (
  id VARCHAR(32) PRIMARY KEY,
  user_id VARCHAR(32) NULL,
  score INT NOT NULL,
  comment TEXT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX idx_nps_user_id (user_id),
  CONSTRAINT fk_nps_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE settings (
  id VARCHAR(32) PRIMARY KEY,
  scope VARCHAR(32) NOT NULL,
  `key` VARCHAR(191) NOT NULL,
  `value` JSON NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  INDEX idx_settings_scope_key (scope, `key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE language_preferences (
  id VARCHAR(32) PRIMARY KEY,
  user_id VARCHAR(32) NOT NULL UNIQUE,
  lang VARCHAR(10) NOT NULL,
  rtl TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  CONSTRAINT fk_language_preferences_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE integration_sync_logs (
  id VARCHAR(32) PRIMARY KEY,
  system_name VARCHAR(64) NOT NULL,
  direction VARCHAR(16) NOT NULL,
  status VARCHAR(16) NOT NULL,
  message TEXT NULL,
  payload JSON NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX idx_integration_sync_logs_system (system_name),
  INDEX idx_integration_sync_logs_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================
-- SEED (DEMO)
-- =========================

DELETE FROM language_preferences;
DELETE FROM refresh_tokens;
DELETE FROM users;
DELETE FROM schools;
DELETE FROM school_groups;
DELETE FROM publishers;

INSERT INTO publishers (id, name) VALUES
('pub_mcgraw','McGraw Hill'),
('pub_kodeit','Kodeit Global'),
('pub_studysync','StudySync'),
('pub_achieve','Achieve3000'),
('pub_powerschool','PowerSchool'),
('pub_oxford','Oxford'),
('pub_cambridge','Cambridge'),
('pub_pearson','Pearson/Savvas'),
('pub_collins','Collins'),
('pub_jolly','Jolly Phonics');

INSERT INTO school_groups (id, name) VALUES
('grp_alnoor','Al Noor Education Group');

INSERT INTO schools (id, name, country, curriculum_type, purchase_status, preferred_lang, enabled_modules, branding, vat_rate, group_id) VALUES
('sch_daa','Dubai American Academy','UAE','American','REGISTERED_NO_ORDERS','en',
 JSON_OBJECT('phase1', TRUE, 'phase2', FALSE, 'phase3', FALSE, 'assessment', FALSE, 'kodeitAcademy', TRUE),
 JSON_OBJECT('logoUrl', NULL, 'primaryColor', '#0f172a'), 5.00, NULL),

('sch_adbs','Abu Dhabi British School','UAE','British','FIRST_ORDER_CONFIRMED','en',
 JSON_OBJECT('phase1', TRUE, 'phase2', TRUE, 'phase3', TRUE, 'assessment', FALSE, 'kodeitAcademy', TRUE),
 JSON_OBJECT('logoUrl', NULL, 'primaryColor', '#0f172a'), 5.00, NULL),

('sch_smc','Sharjah Mixed Curriculum School','UAE','Mixed','ACTIVE_REPEAT','en',
 JSON_OBJECT('phase1', TRUE, 'phase2', TRUE, 'phase3', TRUE, 'assessment', FALSE, 'kodeitAcademy', TRUE),
 JSON_OBJECT('logoUrl', NULL, 'primaryColor', '#0f172a'), 5.00, NULL),

('sch_rais','Riyadh American International School','KSA','American','REGISTERED_NO_ORDERS','ar',
 JSON_OBJECT('phase1', TRUE, 'phase2', FALSE, 'phase3', FALSE, 'assessment', TRUE, 'kodeitAcademy', TRUE),
 JSON_OBJECT('logoUrl', NULL, 'primaryColor', '#0f172a'), 15.00, NULL),

('sch_jncc','Jeddah NCC Academy','KSA','Saudi NCC','FIRST_ORDER_CONFIRMED','ar',
 JSON_OBJECT('phase1', TRUE, 'phase2', TRUE, 'phase3', TRUE, 'assessment', TRUE, 'kodeitAcademy', TRUE),
 JSON_OBJECT('logoUrl', NULL, 'primaryColor', '#0f172a'), 15.00, NULL),

('sch_dncs','Dammam National Curriculum School','KSA','Saudi NCC','ACTIVE_REPEAT','ar',
 JSON_OBJECT('phase1', TRUE, 'phase2', TRUE, 'phase3', TRUE, 'assessment', TRUE, 'kodeitAcademy', TRUE),
 JSON_OBJECT('logoUrl', NULL, 'primaryColor', '#0f172a'), 15.00, NULL),

('sch_alnoor_dxb','Al Noor Campus - Dubai','UAE','American','ACTIVE_REPEAT','en',
 JSON_OBJECT('phase1', TRUE, 'phase2', TRUE, 'phase3', TRUE, 'assessment', FALSE, 'kodeitAcademy', TRUE),
 JSON_OBJECT('logoUrl', NULL, 'primaryColor', '#0f172a'), 5.00, 'grp_alnoor'),

('sch_alnoor_auh','Al Noor Campus - Abu Dhabi','UAE','British','ACTIVE_REPEAT','en',
 JSON_OBJECT('phase1', TRUE, 'phase2', TRUE, 'phase3', TRUE, 'assessment', FALSE, 'kodeitAcademy', TRUE),
 JSON_OBJECT('logoUrl', NULL, 'primaryColor', '#0f172a'), 5.00, 'grp_alnoor'),

('sch_alnoor_shj','Al Noor Campus - Sharjah','UAE','IB','FIRST_ORDER_CONFIRMED','en',
 JSON_OBJECT('phase1', TRUE, 'phase2', TRUE, 'phase3', TRUE, 'assessment', FALSE, 'kodeitAcademy', TRUE),
 JSON_OBJECT('logoUrl', NULL, 'primaryColor', '#0f172a'), 5.00, 'grp_alnoor'),

('sch_ajm','Ajman Primary School','UAE','UAE MOE','REGISTERED_NO_ORDERS','en',
 JSON_OBJECT('phase1', TRUE, 'phase2', FALSE, 'phase3', FALSE, 'assessment', FALSE, 'kodeitAcademy', TRUE),
 JSON_OBJECT('logoUrl', NULL, 'primaryColor', '#0f172a'), 5.00, NULL),

('sch_akis','Al Khobar International School','KSA','British','ACTIVE_REPEAT','ar',
 JSON_OBJECT('phase1', TRUE, 'phase2', TRUE, 'phase3', TRUE, 'assessment', TRUE, 'kodeitAcademy', TRUE),
 JSON_OBJECT('logoUrl', NULL, 'primaryColor', '#0f172a'), 15.00, NULL),

('sch_mlc','Madinah Learning Center','KSA','Mixed','REGISTERED_NO_ORDERS','ar',
 JSON_OBJECT('phase1', TRUE, 'phase2', FALSE, 'phase3', FALSE, 'assessment', TRUE, 'kodeitAcademy', TRUE),
 JSON_OBJECT('logoUrl', NULL, 'primaryColor', '#0f172a'), 15.00, NULL);

-- Demo users (requested). Password = Panworld@123
-- bcrypt hash string (valid format)
SET @pw_hash = '$2b$10$c7max.8ruVFJ7I.cFfjmSOrCcEfQHbyAUVDC163vLoXfHJyuBS6Sa';

INSERT INTO users (id, email, password_hash, first_name, last_name, role, department, active, preferred_lang, school_id, publisher_id) VALUES
('usr_teacher','teacher@panworld-demo.com',@pw_hash,'Aisha','Teacher','TEACHER','English',1,'en','sch_adbs',NULL),
('usr_hod','hod@panworld-demo.com',@pw_hash,'Omar','HOD','HOD','Math',1,'en','sch_adbs',NULL),
('usr_management','management@panworld-demo.com',@pw_hash,'Sara','Management','MANAGEMENT',NULL,1,'en','sch_adbs',NULL),
('usr_ceo','ceo@panworld-demo.com',@pw_hash,'Khalid','CEO','CEO',NULL,1,'en','sch_adbs',NULL),
('usr_proc','procurement@panworld-demo.com',@pw_hash,'Lina','Procurement','PROCUREMENT',NULL,1,'en','sch_adbs',NULL),
('usr_admin','admin@panworld-demo.com',@pw_hash,'Panworld','Admin','PANWORLD_ADMIN',NULL,1,'en',NULL,NULL),
('usr_publisher','publisher@panworld-demo.com',@pw_hash,'Publisher','Partner','PUBLISHER',NULL,1,'en',NULL,'pub_oxford');

INSERT INTO language_preferences (id, user_id, lang, rtl) VALUES
('lp_teacher','usr_teacher','en',0),
('lp_hod','usr_hod','en',0),
('lp_management','usr_management','en',0),
('lp_ceo','usr_ceo','en',0),
('lp_proc','usr_proc','en',0),
('lp_admin','usr_admin','en',0),
('lp_publisher','usr_publisher','en',0);

SET FOREIGN_KEY_CHECKS = 1;

