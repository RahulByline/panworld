export type UserRole =
  | "TEACHER"
  | "HOD"
  | "MANAGEMENT"
  | "CEO"
  | "PROCUREMENT"
  | "PANWORLD_ADMIN"
  | "PUBLISHER"
  | "SCHOOL_ADMIN"
  | "SALES_ADMIN";

/** ISO-style codes stored in DB `countries.code` (e.g. UAE, KSA, OM). */
export type CountryCode = string;
export type SchoolPurchaseStatus = "REGISTERED_NO_ORDERS" | "FIRST_ORDER_CONFIRMED" | "ACTIVE_REPEAT";

export type School = {
  id: string;
  name: string;
  country: CountryCode;
  curriculumType: string;
  purchaseStatus: SchoolPurchaseStatus;
  preferredLang: "en" | "ar";
  enabledModules: Record<string, unknown>;
  vatRate: string | number;
  /** Official school contact (not the login user). */
  schoolEmail?: string | null;
  whatsapp?: string | null;
};

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  schoolId: string | null;
  publisherId: string | null;
  preferredLang: "en" | "ar";
  impersonatedById?: string | null;
};

