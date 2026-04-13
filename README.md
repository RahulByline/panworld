# PANWORLD SCHOOL PARTNER PORTAL (Demo Prototype)

Production-structured, demo-ready prototype for a multi-role, multi-phase school partner portal.

## Tech stack

- **Frontend**: React + Vite, React Router, Tailwind CSS, Zustand, React Hook Form + Zod, i18next (EN/AR + RTL), Recharts
- **Backend**: Node.js + Express (plain JavaScript), JWT access + refresh tokens, Multer, MySQL (`mysql2`)
- **Database**: MySQL

## Monorepo structure

- `frontend/` React application
- `backend/` Express REST API + MySQL `.sql` schema + seed
- `docs/` documentation (see below)

### CMS & admin (top-down guide)

For a **detailed, CMS-focused overview** — super-admin screens, school vs sales access matrix, catalogue folders, resources, announcements, and what is mock vs API-backed — see:

**[docs/CMS_ADMIN_TOP_DOWN.md](./docs/CMS_ADMIN_TOP_DOWN.md)**

> The product spec PDF **“Panworld Portal Master v4.pdf”** was not in the repo when that doc was written; add it under e.g. `docs/specs/` and cross-reference sections there.

## Quick start (local)

### 1) Prerequisites

- Node.js 20+
- MySQL 8+

### 2) Configure environment

Backend:

- Copy `backend/.env.example` → `backend/.env`
- Set `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME` to match your local MySQL

Frontend:

- Copy `frontend/.env.example` → `frontend/.env` (optional)

### 3) Install dependencies

From repo root:

```bash
cd panworld-portal
npm install
```

### 4) Database setup + seed (SQL import)

Create the database (example):

```sql
CREATE DATABASE panworld_portal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Then import SQL schema + seed:

- Import `backend/sql/panworld_portal_schema.sql`
- Import `backend/sql/panworld_portal_seed.sql`

### 5) Run

Backend (port 4000):

```bash
cd backend
npm install   # first time
node server.js
```

(`npm run dev` from the monorepo root also runs the backend workspace script, which is `node server.js`.)

Frontend (port 5173):

```bash
cd frontend
npm run dev
```

## Demo credentials

All demo users share the password:

- **Password**: `Panworld@123`

Seeded accounts:

- `teacher@panworld-demo.com`
- `hod@panworld-demo.com`
- `management@panworld-demo.com`
- `ceo@panworld-demo.com`
- `procurement@panworld-demo.com`
- `admin@panworld-demo.com`
- `publisher@panworld-demo.com`

## What’s implemented (current)

- **Backend**
  - MySQL schema + seed as `.sql` files under `backend/sql/` (Prisma-free)
  - JWT auth with refresh tokens stored hashed in DB (cookie-based refresh)
  - Mock notification services: Email + WhatsApp event simulation
- **Frontend**
  - Auth UI (Login / Forgot / Reset / Invite / First-login completion placeholder)
  - Dashboard shell (sidebar + topbar) with EN/AR + full RTL toggle
  - Demo-rich pages: Catalogue + product detail, RFQ list/detail, Invoices, Support

## Roadmap (next modules to fill)

This prototype is structured so mock endpoints/pages can be swapped for real integrations with minimal refactor:

- Phase 1: wishlist, curriculum mapping wizard, demo hub, announcements, contacts directory
- Phase 2: training library + progress, webinars/PD, samples tracking, certificates verification, assessment launch placeholder, analytics filters/export
- Phase 3: orders, deliveries, users/settings, Panworld admin analytics, impersonation, publisher-scoped dashboard, Odoo sync logs UI + mock endpoints

