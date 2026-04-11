export type CatalogueTab = "textbooks" | "library" | "kits";

export type CatalogueProductRow = {
  id: string;
  name: string;
  publisher: string;
  grades: string;
  format: string;
  price: string;
  badges: string[];
  status: "Published" | "Draft";
};

/** Core curriculum — textbooks & courseware */
export const catalogueTextbooks: CatalogueProductRow[] = [
  {
    id: "tb-inspire",
    name: "Inspire Science",
    publisher: "McGraw Hill",
    grades: "G1–G8",
    format: "Blended",
    price: "AED 89",
    badges: ["New Ed."],
    status: "Published",
  },
  {
    id: "tb-reveal",
    name: "Reveal Math 2025",
    publisher: "McGraw Hill",
    grades: "G1–G12",
    format: "Blended",
    price: "AED 95",
    badges: ["2025 Ed."],
    status: "Published",
  },
  {
    id: "tb-kodeit-ss",
    name: "Kodeit Social Sciences",
    publisher: "Kodeit",
    grades: "G1–G12",
    format: "Print",
    price: "AED 75",
    badges: ["Our Brand", "NCC"],
    status: "Published",
  },
  {
    id: "tb-studysync",
    name: "StudySync GCC Ed.",
    publisher: "StudySync",
    grades: "G6–G12",
    format: "Digital",
    price: "AED 120",
    badges: ["Arabic UI"],
    status: "Published",
  },
  {
    id: "tb-wonders",
    name: "Wonders 2024",
    publisher: "McGraw Hill",
    grades: "G1–G6",
    format: "Blended",
    price: "AED 92",
    badges: ["Core ELA"],
    status: "Published",
  },
];

/** School library & leveled reading */
export const catalogueLibraryBooks: CatalogueProductRow[] = [
  {
    id: "lb-ort",
    name: "Oxford Reading Tree — Complete G1–G3",
    publisher: "Oxford University Press",
    grades: "G1–G3",
    format: "Print",
    price: "AED 2,450",
    badges: ["Leveled set", "Fiction"],
    status: "Published",
  },
  {
    id: "lb-scholastic",
    name: "Scholastic Classroom Libraries — Middle",
    publisher: "Scholastic",
    grades: "G6–G8",
    format: "Print",
    price: "AED 3,100",
    badges: ["150 titles"],
    status: "Published",
  },
  {
    id: "lb-ng",
    name: "National Geographic Ladders — Science",
    publisher: "Cengage",
    grades: "G4–G8",
    format: "Print",
    price: "AED 1,890",
    badges: ["Non-fiction", "ELL"],
    status: "Published",
  },
  {
    id: "lb-arabic",
    name: "Arabic Leveled Library — Band A–C",
    publisher: "Panworld",
    grades: "G1–G4",
    format: "Print",
    price: "AED 1,200",
    badges: ["Arabic", "NCC"],
    status: "Published",
  },
  {
    id: "lb-bigcat",
    name: "Collins Big Cat — Extended Pack",
    publisher: "HarperCollins",
    grades: "KG2–G5",
    format: "Print",
    price: "AED 2,100",
    badges: ["Phonics"],
    status: "Draft",
  },
];

/** Kits, manipulatives & bundled resources */
export const catalogueKits: CatalogueProductRow[] = [
  {
    id: "kit-jolly",
    name: "Jolly Phonics KG Kit",
    publisher: "Jolly Phonics",
    grades: "KG1–KG2",
    format: "Kit",
    price: "AED 340",
    badges: ["New partnership"],
    status: "Published",
  },
  {
    id: "kit-stem",
    name: "STEM Lab Discovery Kit G3–G5",
    publisher: "Kodeit",
    grades: "G3–G5",
    format: "Kit",
    price: "AED 1,850",
    badges: ["Our Brand", "NCC"],
    status: "Published",
  },
  {
    id: "kit-robotics",
    name: "Primary Robotics Starter Set",
    publisher: "Kodeit",
    grades: "G4–G8",
    format: "Kit",
    price: "AED 2,400",
    badges: ["STEM"],
    status: "Published",
  },
  {
    id: "kit-math",
    name: "Math Manipulatives — Complete G1–G6",
    publisher: "McGraw Hill",
    grades: "G1–G6",
    format: "Kit",
    price: "AED 980",
    badges: ["Bundle"],
    status: "Published",
  },
  {
    id: "kit-art",
    name: "Middle School Art & Craft Supply Pack",
    publisher: "Panworld",
    grades: "G6–G9",
    format: "Kit",
    price: "AED 620",
    badges: ["Draft listing"],
    status: "Draft",
  },
];

export const catalogueByTab: Record<CatalogueTab, CatalogueProductRow[]> = {
  textbooks: catalogueTextbooks,
  library: catalogueLibraryBooks,
  kits: catalogueKits,
};
