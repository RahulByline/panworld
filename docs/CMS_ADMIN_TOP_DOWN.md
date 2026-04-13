# Panworld Portal — CMS & Admin (Top-Down Overview)

This document describes the **content management system (CMS)**, **Panworld super-admin console**, and how **roles and permissions** are modeled in the current codebase. It is written for product, engineering, and operations readers who need a **single map** of what exists, what is mock/demo, and how content flows from admin to schools.

> **Reference document:** The file **"Panworld Portal Master v4.pdf"** was **not present** in this repository at documentation time. Where this README aligns with that product spec, it is inferred from **implemented UI, routes, and data modules**. When you add the PDF to the repo (e.g. `docs/specs/Panworld Portal Master v4.pdf`), update this file with explicit section references.

---

## 1. Architecture at a glance

### 1.1 Two application shells

| Shell | URL prefix | Who | Purpose |
|-------|------------|-----|--------|
| **School portal** | `/app/*` | School users (teachers, HOD, admin, procurement, etc.) and **sales** users | Day-to-day: catalogue, RFQs, orders, training, resources, etc. |
| **Panworld admin** | `/admin/*` | **`PANWORLD_ADMIN` only** (super admin) | Full CMS, operations oversight, integrations, audit |

**Implementation detail:** `PANWORLD_ADMIN` users hitting `/app` are **redirected to `/admin`** (`PanworldAdminRedirect`). The admin area is **not** opened to other roles by route guards today (`RequireRole` allows only `PANWORLD_ADMIN` for `/admin/*`).

### 1.2 Tech alignment

- **Frontend:** React (Vite), React Router, Tailwind, Zustand, i18next (EN/AR + RTL).
- **Backend:** Node/Express, JWT access + refresh (cookie), MySQL — **auth and some admin APIs are real; many admin/CMS surfaces still use mock data in `frontend/src/data/admin/**`.**

---

## 2. Role model (domain)

Canonical roles in `frontend/src/types/domain.ts`:

| Role | Typical use |
|------|-------------|
| `PANWORLD_ADMIN` | Super admin — **only role with `/admin` access** in current code |
| `SCHOOL_ADMIN`, `HOD`, `TEACHER`, `MANAGEMENT`, `CEO`, `PROCUREMENT` | School-side portal |
| `SALES_ADMIN` | Sales / account management (school portal; **no separate admin CMS role in routes**) |
| `PUBLISHER` | Publisher-scoped dashboard (app) |

**Important:** Fine-grained **per-user permissions** (e.g. “Sales Head sees X, junior AM only sees Y”) are **not** implemented as a permission service in this repo. The **User management** UI includes **policy copy** and an **access matrix** for **human** governance; **enforcement** is a roadmap item unless you add backend rules.

---

## 3. Super admin (`PANWORLD_ADMIN`) — rights and screens

Super admin is the **only** role that can use the **admin sidebar** (`AdminSidebar.tsx`). Below: **navigation sections**, **routes**, and **what you can do** (including mock vs. real where obvious).

### 3.1 Overview

| Screen | Route | Purpose / actions |
|--------|-------|-------------------|
| **Dashboard** | `/admin` | Greeting, headline stats (schools, RFQs, tickets, certs, sales aggregates), **Export report** / **Quick add** (toasts), **catalogue mini-links** to CMS tabs, activity-style panels, **API**: live school count may load from `GET /api/admin/schools` when available |

| **Analytics** | `/admin/analytics` | Live-tagged analytics view (admin) |

### 3.2 CMS & catalogue (core content)

This is the **heart of CMS** for sellable and educational content.

| Screen | Route | Content model | Management actions (UI) |
|--------|-------|----------------|---------------------------|
| **Textbooks** | `/admin/cms/textbooks` | **Series folders** → **line items** (per-grade books, ISBN, price, cover) | Tabs: Textbooks / Library / Kits; **search + filters**; **card or list** view; **+ Add** opens modal; **Open folder** → `?folder=<id>` **folder detail** with **card grid** of books; **Edit folder**; **+ Add book/SKU**; **View** per line; **Archive/Publish** (mock toasts) |
| **Library books** | `/admin/cms/library` | Same **folder → items** pattern for library bundles / stages | Same pattern as textbooks |
| **Kits** | `/admin/cms/kits` | Kit **folders** → **components/SKUs** | Same pattern |
| **Publisher access** | `/admin/cms/publisher-access` | Publisher **credentials**, delivery, verification | Cards, filters, **Verify**, **Renew**, **Assign to school**, modals |
| **Resource library** | `/admin/cms/resources` | Uploadable **files/links** (PDF, PPTX, DOCX, XLSX, etc.) | **Upload resource** modal; filters: **publisher**, **type**, **status**; per-card **Publish**, **Download**, **Open link**, **Edit** |
| **Announcements** | `/admin/cms/announcements` | School-facing **announcements** (pinned/live/draft) | **+ New announcement**; rows **Edit** / **Publish** |

**Legacy redirect:** `/admin/cms/catalogue` → `/admin/cms/textbooks`; `/admin/cms/demo-credentials` → publisher access.

**Catalogue creation (folder modal)** — *Product intent in UI:*  
Defines **series identity** (publisher, series name, full title, edition, format, curriculum, grades, badges, description, optional **folder listing image**). **ISBN and list price** are **not** at folder level; they belong on **each line item** (book modal). Line items can also have a **resource URL** and/or **uploaded file** (PDF, Office formats, etc.) — not folder-level. See `CatalogueModals.tsx` and `CatalogueBookItemModal.tsx`.

**Folder access (demo flags):** Password-protected folder, school access **active/expired** — shown on folder detail; school portal can show **Request access** when expired (demo product).

### 3.3 Schools & people

| Screen | Route | Purpose / actions |
|--------|-------|-------------------|
| **School management** | `/admin/schools` | School records, **View** modal, assignments, etc. |
| **User management** | `/admin/users` | **Directory** tab: filter by role, **Create user**, **Edit**, **Deactivate**, **Reset PW**; **Access control** tab: **RoleAccessMatrix** (HOD / School Admin / Sales / Panworld) |
| **Sales team** | `/admin/account-managers` | Account managers list and management |
| **School assignments** | `/admin/assignments` | Map **schools ↔ account managers** |

### 3.4 Operations

| Screen | Route | Purpose / actions |
|--------|-------|-------------------|
| **RFQ pipeline** | `/admin/rfq` | Pipeline stages, **View** RFQ |
| **Orders & delivery** | `/admin/orders` | Order list, **View** modal |
| **Invoices** | `/admin/invoices` | Invoice admin |
| **Sample requests** | `/admin/samples` | Sample workflow |
| **Support tickets** | `/admin/support` | Tickets, **View** modal |
| **Webinars & training** | `/admin/webinars` | Webinar CMS admin |
| **Certifications** | `/admin/certifications` | Certifications admin |

### 3.5 Platform & publishers

| Screen | Route | Purpose |
|--------|-------|---------|
| **Publishers** | `/admin/publishers` | Publisher directory |
| **Publisher dashboard** | `/admin/publisher-dashboard` | Publisher analytics |
| **Integrations** | `/admin/integrations` | Integration hub |

### 3.6 Automation

| Screen | Route | Purpose |
|--------|-------|---------|
| **WhatsApp logs** | `/admin/whatsapp-logs` | Message automation logs |
| **Odoo / ERP** | `/admin/odoo` | Odoo sync / links |

### 3.7 System

| Screen | Route | Purpose |
|--------|-------|---------|
| **Audit log** | `/admin/audit-log` | System audit |
| **Settings** | `/admin/settings` | Global settings (mock save) |

---

## 4. Access matrix (school & sales — policy, not full RBAC)

Implemented in `data/admin/accessControlMatrix.ts` and shown on **User management → Access control**.

Columns: **HOD**, **School Admin**, **Sales**, **Panworld**.

Cell values:

- **`yes`** — allowed in product scope  
- **`request`** — requires Panworld / school approval flow  
- **`no`** — not allowed  

**Capabilities (rows):**

| Capability | Meaning |
|------------|--------|
| **Teachers** | Invite/manage teachers |
| **School staff (elevated)** | Direct add vs request for sensitive roles |
| **User requests** | Workflow for new user requests |
| **Create schools** | Schools created by **Sales** (yes) vs school roles (no) |
| **Assign resources** | Catalogue/library/kit assignment to schools |
| **AM ↔ school mapping** | Account manager ↔ school mapping |
| **Deactivate users** | Who can deactivate; HOD often **request** |

**“Sales Head vs all sales reps” (product design):**  
The matrix is **role-class** level. **Delegating** which **sales** users can **create schools** or **assign resources** would be a **permission layer** (e.g. `SALES_ADMIN` vs `SALES_REP` or scoped flags) — **not** fully wired in routes today. Use this matrix as the **source of truth for policy** until backend RBAC is added.

---

## 5. School portal — what content exists and where it shows

School users consume CMS output under `/app/*` (examples):

| Content | School routes (examples) | Sourced from CMS |
|---------|-------------------------|------------------|
| **Textbooks / catalogue** | `/app/catalogue`, `/app/catalogue/:id` | Product mock + demo series; **admin** catalogue is richer (folders) |
| **Library** | `/app/library` | |
| **Kits** | `/app/kits` | |
| **Announcements** | `/app/announcements` | Mirrors **CMS announcements** intent |
| **Resources** | `/app/resources` | **Resource library** |
| **Training / Webinars / Certificates** | `/app/training`, `/app/webinars`, `/app/certificates` | |
| **RFQ / Orders / Invoices** | `/app/rfq`, `/app/orders`, `/app/invoices` | Operations |

**Display patterns:** List + detail pages, cards, filters, bilingual (EN/AR + RTL).

---

## 6. Content management deep dive (CMS)

### 6.1 Catalogue (textbooks / library / kits)

- **Folders (series):** Marketing/edition metadata, grade span, curriculum, badges, optional **folder image** for admin list.  
- **Line items:** **Cover**, **ISBN** (where applicable), **price**, **status**, optional **resource link** and/or **file upload** (PDF, PPT, Excel, etc.) per item (book modal).  
- **Presentation in admin:** Folder **card grid** or **list**; inside folder **card grid** per book/SKU.  
- **Search:** `catalogueHaystack` includes folder + line item fields.

### 6.2 Resource library

- **Types:** PDF, PPTX, DOCX, link, spreadsheet, other.  
- **Workflow:** Upload → draft/publish → download or open link.  
- **Filters:** Publisher, type, status.

### 6.3 Announcements

- Rows with **tone** (pinned / live / draft), **Edit**, **Publish**.

### 6.4 Publisher access

- **Credentials** for publisher platforms (shared vs school-specific), **verify**, **renew**, **assign to school**.

---

## 7. Buttons & actions (inventory-style)

This is not every click in the app, but the **categories** of actions CMS operators expect:

- **List tools:** Search, filters, **card/list toggle**, **Export** (where shown).  
- **CRUD:** **Add**, **Edit**, **View**, **Publish**, **Save draft**, **Archive**, **Deactivate**.  
- **Assignments:** **Assign** catalogue/resources, **school ↔ AM** mapping.  
- **Operations:** **View** RFQ/order/ticket/invoice modals; pipeline actions.  
- **Integrations:** Configure / link (Odoo, WhatsApp).  

Most **mock** actions show **toast** feedback (`useAdminToast`).

---

## 8. Backend vs frontend (honest scope)

| Area | Notes |
|------|------|
| **Auth** | Real JWT + refresh cookie; session refresh on 401 in frontend. |
| **Admin schools** | `GET /api/admin/schools` used on dashboard when API responds. |
| **CMS data** | Large parts of **admin CMS** still use **`frontend/src/data/admin/*.ts`** mocks. |
| **Production** | Replace mocks with REST + DB tables for catalogue folders, resources, announcements, etc. |

---

## 9. How to extend toward “Master PDF” parity

1. Add the **PDF** under `docs/specs/` and cross-link **section numbers** here.  
2. Map each **PDF requirement** to a **route** + **API** + **DB table**.  
3. Implement **RBAC** beyond `PANWORLD_ADMIN` if you need **sales** or **publisher** CMS slices.  
4. Persist **folder line items** and **files** in storage (S3/local) with **signed URLs**.

---

## 10. Related files (quick reference)

| Topic | Location |
|-------|----------|
| Admin routes | `frontend/src/routes/AppRoutes.tsx` |
| Admin sidebar | `frontend/src/ui/admin/AdminSidebar.tsx` |
| Role gate | `frontend/src/routes/RequireRole.tsx` |
| Access matrix data | `frontend/src/data/admin/accessControlMatrix.ts` |
| Catalogue data & helpers | `frontend/src/data/admin/catalogue.ts` |
| Catalogue UI | `frontend/src/ui/pages/admin/AdminCatalogueSegmentPage.tsx`, `.../catalogue/*` |

---

*Last updated to match the repository structure and CMS behavior as implemented in code. Align with **Panworld Portal Master v4.pdf** when the spec is available in-repo.*
