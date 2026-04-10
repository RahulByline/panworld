## MySQL import (Prisma-free)

### 1) Create DB

Example:

```sql
CREATE DATABASE panworld_portal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE panworld_portal;
```

### 2) Import schema

Use **one single file**:

- `backend/sql/panworld_portal_full.sql`

### Alternative (two-step)

If you prefer separate imports:

- `backend/sql/panworld_portal_schema.sql`
- `backend/sql/panworld_portal_seed.sql`

### Notes

- IDs are stored as `VARCHAR(32)` to support app-generated IDs (you can use UUIDs or your own IDs).
- JSON columns (`enabled_modules`, `audience`, `country_tags`, timelines, etc.) require MySQL 5.7+ (MySQL 8 recommended).

