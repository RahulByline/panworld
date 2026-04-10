import type { UserRole } from "./roles.js";

export type AuthUser = {
  id: string;
  role: UserRole;
  schoolId: string | null;
  publisherId: string | null;
  impersonatedById: string | null;
};

