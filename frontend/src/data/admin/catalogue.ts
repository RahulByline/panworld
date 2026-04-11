import type { CatalogueCardIconId } from "./catalogueCardIconIds";

export type CatalogueTab = "textbooks" | "library" | "kits";

export type CatalogueProductStatus = "Published" | "Draft" | "Archived";

/** Pastel header background preset */
export type CatalogueHeaderKey =
  | "mh"
  | "math"
  | "kodeit"
  | "digital"
  | "oxford"
  | "teal"
  | "amber"
  | "mint"
  | "jolly"
  | "stem"
  | "robotics"
  | "art"
  | "scholastic"
  | "ng"
  | "default";

export type CatalogueProductRow = {
  id: string;
  name: string;
  publisher: string;
  grades: string;
  format: string;
  price: string;
  /** e.g. "/ student", "/ licence" */
  priceUnit?: string;
  /** Product badges (New Ed., Our Brand, …) — not status */
  badges: string[];
  status: CatalogueProductStatus;
  /** Default card artwork (Lucide icon in thumbnail frame) */
  cardIcon: CatalogueCardIconId;
  headerKey: CatalogueHeaderKey;
  /** Shown under meta: ISBN line or library detail */
  detailLine: string;
  /** Third line of meta: Publisher · format · grades · curriculum */
  curriculum: string;
  /** Match textbook grade dropdown (any bucket = visible) */
  gradeBuckets?: string[];
  /** Library */
  readingLevel?: string;
  genre?: string;
  language?: string;
  /** Kits */
  kitType?: string;
  kitDetailLine?: string;
};

function metaLine(publisher: string, format: string, grades: string, curriculum: string) {
  return `${publisher} · ${format} · ${grades} · ${curriculum}`;
}

/** Core curriculum — textbooks & courseware */
export const catalogueTextbooks: CatalogueProductRow[] = [
  {
    id: "tb-inspire",
    name: "Inspire Science G1–G8",
    publisher: "McGraw Hill",
    grades: "G1–G8",
    format: "Blended",
    price: "AED 89",
    priceUnit: "/ student",
    badges: ["New Ed."],
    status: "Published",
    cardIcon: "scienceCore",
    headerKey: "mh",
    detailLine: "ISBN: 978-1-265-XXXXX",
    curriculum: "American",
    gradeBuckets: ["G1–G3", "G4–G6", "G7–G9"],
  },
  {
    id: "tb-reveal",
    name: "Reveal Math 2025",
    publisher: "McGraw Hill",
    grades: "G1–G12",
    format: "Blended",
    price: "AED 95",
    priceUnit: "/ student",
    badges: ["2025 Ed."],
    status: "Published",
    cardIcon: "math",
    headerKey: "math",
    detailLine: "ISBN: 978-1-266-XXXXX",
    curriculum: "American",
    gradeBuckets: ["G1–G3", "G4–G6", "G7–G9", "G10–G12"],
  },
  {
    id: "tb-kodeit-ss",
    name: "Kodeit Social Sciences G1–G12",
    publisher: "Kodeit Global",
    grades: "All Grades",
    format: "Print",
    price: "AED 75",
    priceUnit: "/ student",
    badges: ["Our Brand", "NCC"],
    status: "Published",
    cardIcon: "socialStudies",
    headerKey: "kodeit",
    detailLine: "ISBN: 978-9-948-XXXXX",
    curriculum: "UAE + Saudi",
    gradeBuckets: ["G1–G3", "G4–G6", "G7–G9", "G10–G12"],
  },
  {
    id: "tb-studysync",
    name: "StudySync ELA G6–G12",
    publisher: "StudySync",
    grades: "G6–G12",
    format: "Digital",
    price: "AED 120",
    priceUnit: "/ licence",
    badges: ["Digital"],
    status: "Draft",
    cardIcon: "digitalLearning",
    headerKey: "digital",
    detailLine: "No ISBN · Digital Platform",
    curriculum: "American",
    gradeBuckets: ["G7–G9", "G10–G12"],
  },
  {
    id: "tb-wonders",
    name: "Wonders 2024",
    publisher: "McGraw Hill",
    grades: "G1–G6",
    format: "Blended",
    price: "AED 92",
    priceUnit: "/ student",
    badges: ["Core ELA"],
    status: "Published",
    cardIcon: "ela",
    headerKey: "mh",
    detailLine: "ISBN: 978-0-02-XXXXXX",
    curriculum: "American",
    gradeBuckets: ["G1–G3", "G4–G6"],
  },
];

/** School library & leveled reading */
export const catalogueLibraryBooks: CatalogueProductRow[] = [
  {
    id: "lb-ort",
    name: "Oxford Reading Tree Series",
    publisher: "Oxford",
    grades: "G1–G3",
    format: "Print",
    price: "AED 28",
    priceUnit: "/ set",
    badges: [],
    status: "Published",
    cardIcon: "readingSeries",
    headerKey: "oxford",
    detailLine: "30 titles in series",
    curriculum: metaLine("Oxford", "Lexile 200–500", "English", "Fiction"),
    readingLevel: "Lexile 200–400",
    genre: "Fiction",
    language: "English",
    gradeBuckets: ["G1–G3"],
  },
  {
    id: "lb-scholastic",
    name: "Scholastic Classroom Libraries — Middle",
    publisher: "Scholastic",
    grades: "G6–G8",
    format: "Print",
    price: "AED 3,100",
    priceUnit: "",
    badges: ["150 titles"],
    status: "Published",
    cardIcon: "libraryBundle",
    headerKey: "scholastic",
    detailLine: "150 titles · classroom bundle",
    curriculum: metaLine("Scholastic", "Lexile 600–800", "English", "Fiction"),
    readingLevel: "Lexile 600–800",
    genre: "Fiction",
    language: "English",
    gradeBuckets: ["G7–G9"],
  },
  {
    id: "lb-ng",
    name: "National Geographic Ladders — Science",
    publisher: "Cengage",
    grades: "G4–G8",
    format: "Print",
    price: "AED 1,890",
    priceUnit: "",
    badges: ["Non-fiction", "ELL"],
    status: "Published",
    cardIcon: "scienceReaders",
    headerKey: "teal",
    detailLine: "Leveled science readers",
    curriculum: metaLine("Cengage", "Lexile 400–600", "English", "Non-Fiction"),
    readingLevel: "Lexile 400–600",
    genre: "Non-Fiction",
    language: "English",
    gradeBuckets: ["G4–G6", "G7–G9"],
  },
  {
    id: "lb-arabic",
    name: "Arabic Leveled Library — Band A–C",
    publisher: "Panworld",
    grades: "G1–G4",
    format: "Print",
    price: "AED 1,200",
    priceUnit: "",
    badges: ["Arabic", "NCC"],
    status: "Published",
    cardIcon: "arabicLibrary",
    headerKey: "amber",
    detailLine: "36 titles · Arabic + transliteration",
    curriculum: metaLine("Panworld", "Band A–C", "Arabic", "Arabic Literature"),
    readingLevel: "Lexile 200–400",
    genre: "Arabic Literature",
    language: "Arabic",
    gradeBuckets: ["G1–G3", "G4–G6"],
  },
  {
    id: "lb-bigcat",
    name: "Collins Big Cat — Extended Pack",
    publisher: "Collins",
    grades: "KG2–G5",
    format: "Print",
    price: "AED 2,100",
    priceUnit: "",
    badges: ["Phonics"],
    status: "Draft",
    cardIcon: "levelledPack",
    headerKey: "teal",
    detailLine: "24 books available",
    curriculum: metaLine("Collins", "Levelled", "English", "Non-Fiction"),
    readingLevel: "Lexile 400–600",
    genre: "Non-Fiction",
    language: "English",
    gradeBuckets: ["KG1/KG2", "G1–G3", "G4–G6"],
  },
];

/** Kits, manipulatives & bundled resources */
export const catalogueKits: CatalogueProductRow[] = [
  {
    id: "kit-jolly",
    name: "Jolly Phonics KG1 Complete Kit",
    publisher: "Jolly Phonics",
    grades: "KG1–KG2",
    format: "Kit",
    price: "AED 320",
    priceUnit: "/ classroom",
    badges: ["New partnership", "Phonics Kit"],
    status: "Published",
    cardIcon: "phonicsKit",
    headerKey: "jolly",
    detailLine: "Student books, teacher guide, sound cards, workbooks",
    curriculum: "Jolly Phonics · KG1 classroom set",
    kitType: "Phonics Kit",
    kitDetailLine: "Student books, teacher guide, sound cards, workbooks",
    gradeBuckets: ["KG1/KG2"],
  },
  {
    id: "kit-stem",
    name: "STEM Lab Discovery Kit G3–G5",
    publisher: "Kodeit",
    grades: "G3–G5",
    format: "Kit",
    price: "AED 1,850",
    priceUnit: "",
    badges: ["Our Brand", "NCC", "STEM"],
    status: "Published",
    cardIcon: "stemLab",
    headerKey: "stem",
    detailLine: "18 components · MOQ 1 · Consumables pack",
    curriculum: "Kodeit · 24-student set · Inquiry STEM",
    kitType: "STEM",
    kitDetailLine: "18 components · MOQ 1",
    gradeBuckets: ["G1–G3", "G4–G6"],
  },
  {
    id: "kit-robotics",
    name: "Primary Robotics Starter Set",
    publisher: "Kodeit",
    grades: "G4–G8",
    format: "Kit",
    price: "AED 2,400",
    priceUnit: "",
    badges: ["STEM"],
    status: "Published",
    cardIcon: "robotics",
    headerKey: "robotics",
    detailLine: "12 bots · curriculum maps G4–G8",
    curriculum: "Kodeit · Classroom pack · Coding intro",
    kitType: "Collaboration Kit",
    kitDetailLine: "12 bots · curriculum maps",
    gradeBuckets: ["G4–G6", "G7–G9"],
  },
  {
    id: "kit-math",
    name: "Science Lab Kit — G4 Unit 1",
    publisher: "McGraw Hill",
    grades: "G4",
    format: "Kit",
    price: "AED 480",
    priceUnit: "/ classroom",
    badges: ["Science Kit"],
    status: "Published",
    cardIcon: "scienceLabKit",
    headerKey: "mh",
    detailLine: "24 components · MOQ: 1 · Consumables available",
    curriculum: "McGraw Hill · 30-student set · Inspire Science aligned",
    kitType: "Science Lab Kit",
    kitDetailLine: "24 components · MOQ: 1 · Consumables available",
    gradeBuckets: ["G4–G6"],
  },
  {
    id: "kit-art",
    name: "Middle School Art & Craft Supply Pack",
    publisher: "Panworld",
    grades: "G6–G9",
    format: "Kit",
    price: "AED 620",
    priceUnit: "",
    badges: ["Draft listing"],
    status: "Draft",
    cardIcon: "artSupplies",
    headerKey: "art",
    detailLine: "Supplies for 30 students",
    curriculum: "Panworld · Art & craft bundle",
    kitType: "Collaboration Kit",
    kitDetailLine: "Supplies for 30 students",
    gradeBuckets: ["G7–G9"],
  },
];

export const catalogueByTab: Record<CatalogueTab, CatalogueProductRow[]> = {
  textbooks: catalogueTextbooks,
  library: catalogueLibraryBooks,
  kits: catalogueKits,
};

/** Meta line for textbooks (publisher · format · grades · curriculum) */
export function textbookMetaLine(p: CatalogueProductRow): string {
  return `${p.publisher} · ${p.format} · ${p.grades} · ${p.curriculum}`;
}

/** Library cards use `curriculum` field as full meta line */
export function libraryMetaLine(p: CatalogueProductRow): string {
  return p.curriculum;
}

/** Kits: curriculum field holds prod-meta */
export function kitMetaLine(p: CatalogueProductRow): string {
  return p.curriculum;
}
