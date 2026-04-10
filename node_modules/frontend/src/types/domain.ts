export type UserRole =
  | "TEACHER"
  | "HOD"
  | "MANAGEMENT"
  | "CEO"
  | "PROCUREMENT"
  | "PANWORLD_ADMIN"
  | "PUBLISHER";

export type CountryCode = "UAE" | "KSA";
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

