export type AssignableProductType = "textbook" | "digital" | "kit" | "library";

export type AssignableProduct = {
  id: string;
  title: string;
  publisher: string;
  subject: string;
  type: AssignableProductType;
};

/** Mock catalogue aligned with panworld_admin.html — UI only */
export const ASSIGNABLE_PRODUCTS: AssignableProduct[] = [];

export const DEFAULT_ASSIGNED_PRODUCT_IDS = [] as const;

export const PUBLISHER_FILTER_ALL = "__all__";
export const SUBJECT_FILTER_ALL = "__all__";
export const TYPE_FILTER_ALL = "__all__";

export const ASSIGN_PRODUCT_PUBLISHERS = [
  PUBLISHER_FILTER_ALL,
] as const;

export const ASSIGN_PRODUCT_SUBJECTS = [
  SUBJECT_FILTER_ALL,
] as const;

export const ASSIGN_PRODUCT_TYPES = [
  { value: TYPE_FILTER_ALL, labelKey: "admin.schools.assignProducts.filterTypeAll" },
  { value: "textbook", labelKey: "admin.schools.assignProducts.filterTypeTextbooks" },
  { value: "library", labelKey: "admin.schools.assignProducts.filterTypeLibrary" },
  { value: "kit", labelKey: "admin.schools.assignProducts.filterTypeKits" },
  { value: "digital", labelKey: "admin.schools.assignProducts.filterTypeDigital" },
] as const;

const TYPE_LABEL_KEYS: Record<AssignableProductType, string> = {
  textbook: "admin.schools.assignProducts.chipTextbook",
  digital: "admin.schools.assignProducts.chipDigital",
  kit: "admin.schools.assignProducts.chipKit",
  library: "admin.schools.assignProducts.chipLibrary",
};

export function assignableProductTypeLabelKey(productType: AssignableProductType): string {
  return TYPE_LABEL_KEYS[productType];
}
