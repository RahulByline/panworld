export type AssignableProductType = "textbook" | "digital" | "kit" | "library";

export type AssignableProduct = {
  id: string;
  title: string;
  publisher: string;
  subject: string;
  type: AssignableProductType;
};

/** Mock catalogue aligned with panworld_admin.html — UI only */
export const ASSIGNABLE_PRODUCTS: AssignableProduct[] = [
  { id: "inspire-sci", title: "Inspire Science G1–G8", publisher: "McGraw Hill", subject: "Science", type: "textbook" },
  { id: "reveal-math", title: "Reveal Math 2025", publisher: "McGraw Hill", subject: "Mathematics", type: "textbook" },
  { id: "connected-digital", title: "ConnectED Digital", publisher: "McGraw Hill", subject: "Science", type: "digital" },
  { id: "lab-kit-g14", title: "Science Lab Kit G1–G4", publisher: "McGraw Hill", subject: "Science", type: "kit" },
  { id: "lab-kit-g58", title: "Science Lab Kit G5–G8", publisher: "McGraw Hill", subject: "Science", type: "kit" },
  { id: "kodeit-ss", title: "Kodeit Social Sciences G1–G12", publisher: "Kodeit", subject: "Social Sciences", type: "textbook" },
  { id: "studysync-ela", title: "StudySync ELA G6–G12", publisher: "StudySync", subject: "English / ELA", type: "digital" },
  { id: "achieve3000", title: "Achieve3000 Platform", publisher: "Achieve3000", subject: "English / ELA", type: "digital" },
  { id: "oxford-ort", title: "Oxford Reading Tree (30 titles)", publisher: "Oxford", subject: "English / ELA", type: "library" },
  { id: "jolly-kg", title: "Jolly Phonics KG1–KG2 Kit", publisher: "Jolly Phonics", subject: "Phonics", type: "kit" },
  { id: "cam-sci", title: "Cambridge Primary Science", publisher: "Cambridge", subject: "Science", type: "textbook" },
];

export const DEFAULT_ASSIGNED_PRODUCT_IDS = ["inspire-sci", "reveal-math", "connected-digital", "lab-kit-g14"] as const;

export const PUBLISHER_FILTER_ALL = "__all__";
export const SUBJECT_FILTER_ALL = "__all__";
export const TYPE_FILTER_ALL = "__all__";

export const ASSIGN_PRODUCT_PUBLISHERS = [
  PUBLISHER_FILTER_ALL,
  "McGraw Hill",
  "Kodeit",
  "Oxford",
  "Cambridge",
  "StudySync",
  "Achieve3000",
  "Jolly Phonics",
] as const;

export const ASSIGN_PRODUCT_SUBJECTS = [
  SUBJECT_FILTER_ALL,
  "Science",
  "Mathematics",
  "English / ELA",
  "Social Sciences",
  "Phonics",
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
