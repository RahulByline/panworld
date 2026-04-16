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

/** Single purchasable SKU inside a catalogue folder (grade book, kit component, library band, etc.) */
export type CatalogueLineItem = {
  id: string;
  title: string;
  /** e.g. G1, Stage 3, Component A */
  gradeLabel: string;
  /** Per-item ISBN where applicable */
  isbn?: string;
  price: string;
  priceUnit?: string;
  status: CatalogueProductStatus;
  /** Short description shown on the card (max 3 lines) */
  description?: string;
  /** Tag pills shown on the card e.g. ["Science", "Print", "American"] */
  tags?: string[];
  /** Cover on line-item cards (uploaded URL; demo uses a stable placeholder) */
  coverImageUrl?: string;
  /**
   * URL shown inside the e-book preview iframe (PDF or vendor reader).
   * If omitted, `getEbookPreviewUrl` uses PDF.js with a public demo PDF.
   */
  ebookPreviewUrl?: string;
};

/** Small public PDF for demo iframe preview (CORS-friendly). */
const EBOOK_DEMO_PDF_FALLBACK = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

/** Resolves the iframe `src` for catalogue line-item “View” (e-book) preview. */
export function getEbookPreviewUrl(lineItem: CatalogueLineItem): string {
  const u = lineItem.ebookPreviewUrl?.trim();
  if (u) return u;
  return `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(EBOOK_DEMO_PDF_FALLBACK)}`;
}

/**
 * Curated book / education stock placeholders (Unsplash). Picked deterministically by `itemId`
 * so each line item keeps a stable cover without random irrelevant Picsum results.
 * Replace with uploaded URLs from CMS in production.
 */
const LINE_ITEM_COVER_PLACEHOLDER_POOL: readonly string[] = [
  "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=280&h=360&fit=crop&q=82",
  "https://images.unsplash.com/photo-1499332347742-4946bddc7d94?w=280&h=360&fit=crop&q=82",
  "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=280&h=360&fit=crop&q=82",
  "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=280&h=360&fit=crop&q=82",
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=280&h=360&fit=crop&q=82",
  "https://images.unsplash.com/photo-1590412701565-55de7fad7cab?w=280&h=360&fit=crop&q=82",
  "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=280&h=360&fit=crop&q=82",
  "https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=280&h=360&fit=crop&q=82",
  "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=280&h=360&fit=crop&q=82",
  "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=280&h=360&fit=crop&q=82",
  "https://images.unsplash.com/photo-1526243741027-444d633d7365?w=280&h=360&fit=crop&q=82",
  "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=280&h=360&fit=crop&q=82",
];

function hashStringToPositiveInt(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function defaultLineItemCoverUrl(itemId: string): string {
  const i = hashStringToPositiveInt(itemId) % LINE_ITEM_COVER_PLACEHOLDER_POOL.length;
  return LINE_ITEM_COVER_PLACEHOLDER_POOL[i]!;
}

/** Folder-level access policy (admin configures; school portal demo uses this) */
export type CatalogueFolderAccess = {
  passwordProtected: boolean;
  /** Demo: school licence expired — show “request access” on portal */
  schoolAccessExpired?: boolean;
};

/** Admin CMS demo: unlock password-protected folders in the catalogue UI */
export const DEMO_CMS_FOLDER_PASSWORD = "1234";

export type CatalogueProductRow = {
  id: string;
  name: string;
  publisher: string;
  grades: string;
  format: string;
  /** Legacy single-line price; folder views use `folderPriceLabel` + `lineItems` */
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
  /** Second-level SKUs — pricing & ISBN live here */
  lineItems: CatalogueLineItem[];
  /** Card summary: e.g. "8 titles · From AED 85" */
  folderPriceLabel: string;
  /** Card subtitle under meta: folder scope */
  folderDetailSummary: string;
  folderAccess?: CatalogueFolderAccess;
};

function metaLine(publisher: string, format: string, grades: string, curriculum: string) {
  return `${publisher} · ${format} · ${grades} · ${curriculum}`;
}

function tbItems(
  folderId: string,
  seriesName: string,
  fromG: number,
  toG: number,
  basePrice: number,
  tags: string[] = [],
): CatalogueLineItem[] {
  const out: CatalogueLineItem[] = [];
  let i = 0;
  const tbDescriptions = [
    "Comprehensive student edition covering core concepts with hands-on activities, visual aids, and formative assessments aligned to curriculum standards.",
    "Engaging grade-level content with inquiry-based lessons, real-world connections, and differentiated support for all learners.",
    "Standards-aligned student book featuring rich visuals, guided practice, and end-of-unit reviews to reinforce key learning objectives.",
    "Interactive student edition with STEM integration, collaborative projects, and digital extension activities for deeper understanding.",
  ];
  for (let g = fromG; g <= toG; g++) {
    const p = basePrice + i * 2;
    const id = `${folderId}-g${g}`;
    out.push({
      id,
      title: `${seriesName} — Grade ${g} (Student)`,
      gradeLabel: `G${g}`,
      isbn: `978-1-265-${String(12000 + i).padStart(5, "0")}-X`,
      price: `AED ${p}`,
      priceUnit: "/ student",
      status: "Published",
      description: tbDescriptions[i % tbDescriptions.length],
      tags: [`G${g}`, ...tags],
      coverImageUrl: defaultLineItemCoverUrl(id),
    });
    i++;
  }
  return out;
}

function digitalLicenceItems(folderId: string, series: string, fromG: number, toG: number): CatalogueLineItem[] {
  const out: CatalogueLineItem[] = [];
  let i = 0;
  for (let g = fromG; g <= toG; g++) {
    const id = `${folderId}-g${g}`;
    out.push({
      id,
      title: `${series} — Grade ${g} licence`,
      gradeLabel: `G${g}`,
      isbn: undefined,
      price: `AED ${110 + i * 3}`,
      priceUnit: "/ licence",
      status: "Draft",
      coverImageUrl: defaultLineItemCoverUrl(id),
    });
    i++;
  }
  return out;
}

function libStageItems(folderId: string, prefix: string, stages: string[], base: number): CatalogueLineItem[] {
  const libDescriptions = [
    "A carefully levelled reading collection with decodable texts, rich illustrations, and comprehension activities to build fluency.",
    "Engaging fiction and non-fiction titles selected to develop vocabulary, reading stamina, and a love of books.",
    "Stage-appropriate stories and informational texts with guided reading notes and discussion prompts for classroom use.",
  ];
  return stages.map((st, i) => {
    const id = `${folderId}-s${i + 1}`;
    return {
      id,
      title: `${prefix} — ${st}`,
      gradeLabel: st,
      isbn: `978-0-19-${84000 + i}-X`,
      price: `AED ${base + i * 4}`,
      priceUnit: "/ title",
      status: "Published" as const,
      description: libDescriptions[i % libDescriptions.length],
      tags: [st, "Library", "English"],
      coverImageUrl: defaultLineItemCoverUrl(id),
    };
  });
}

function kitComponentItems(
  folderId: string,
  labels: { label: string; title: string; price: number; unit?: string }[],
): CatalogueLineItem[] {
  return labels.map((c, i) => {
    const id = `${folderId}-c${i + 1}`;
    return {
      id,
      title: c.title,
      gradeLabel: c.label,
      isbn: `978-KIT-${pad(i + 1, 4)}`,
      price: `AED ${c.price}`,
      priceUnit: c.unit,
      status: "Published" as const,
      coverImageUrl: defaultLineItemCoverUrl(id),
    };
  });
}

function pad(n: number, len: number) {
  return String(n).padStart(len, "0");
}

/** Core curriculum — textbooks & courseware */
export const catalogueTextbooks: CatalogueProductRow[] = [
  {
    id: "tb-inspire",
    name: "Inspire Science G1–G8",
    publisher: "McGraw Hill",
    grades: "G1–G8",
    format: "Blended",
    price: "—",
    badges: ["New Ed."],
    status: "Published",
    cardIcon: "scienceCore",
    headerKey: "mh",
    detailLine: "Folder · 8 grade-level student books",
    curriculum: "American",
    gradeBuckets: ["G1–G3", "G4–G6", "G7–G9"],
    lineItems: tbItems("tb-inspire", "Inspire Science", 1, 8, 85, ["Science", "Print", "American"]),
    folderPriceLabel: "8 titles · From AED 85",
    folderDetailSummary: "ISBN & price are set per grade-level book",
    folderAccess: { passwordProtected: true, schoolAccessExpired: false },
  },
  {
    id: "tb-reveal",
    name: "Reveal Math 2025",
    publisher: "McGraw Hill",
    grades: "G1–G12",
    format: "Blended",
    price: "—",
    badges: ["2025 Ed."],
    status: "Published",
    cardIcon: "math",
    headerKey: "math",
    detailLine: "Folder · 12 grade-level volumes",
    curriculum: "American",
    gradeBuckets: ["G1–G3", "G4–G6", "G7–G9", "G10–G12"],
    lineItems: tbItems("tb-reveal", "Reveal Math", 1, 12, 92, ["Maths", "Print", "American"]),
    folderPriceLabel: "12 titles · From AED 92",
    folderDetailSummary: "Each grade has its own ISBN and list price",
    folderAccess: { passwordProtected: false },
  },
  {
    id: "tb-kodeit-ss",
    name: "Kodeit Social Sciences G1–G12",
    publisher: "Kodeit Global",
    grades: "All Grades",
    format: "Print",
    price: "—",
    badges: ["Our Brand", "NCC"],
    status: "Published",
    cardIcon: "socialStudies",
    headerKey: "kodeit",
    detailLine: "Folder · 12 print student books",
    curriculum: "UAE + Saudi",
    gradeBuckets: ["G1–G3", "G4–G6", "G7–G9", "G10–G12"],
    lineItems: tbItems("tb-kodeit-ss", "Kodeit Social Sciences", 1, 12, 72, ["Social Studies", "Print", "UAE"]),
    folderPriceLabel: "12 titles · From AED 72",
    folderDetailSummary: "Per-grade ISBN (NCC) and school pricing",
    folderAccess: { passwordProtected: false },
  },
  {
    id: "tb-studysync",
    name: "StudySync ELA G6–G12",
    publisher: "StudySync",
    grades: "G6–G12",
    format: "Digital",
    price: "—",
    badges: ["Digital"],
    status: "Draft",
    cardIcon: "digitalLearning",
    headerKey: "digital",
    detailLine: "Folder · digital licences by grade",
    curriculum: "American",
    gradeBuckets: ["G7–G9", "G10–G12"],
    lineItems: digitalLicenceItems("tb-studysync", "StudySync ELA", 6, 12),
    folderPriceLabel: "7 licences · From AED 110",
    folderDetailSummary: "Platform licence per grade band (no print ISBN)",
    folderAccess: { passwordProtected: true, schoolAccessExpired: false },
  },
  {
    id: "tb-wonders",
    name: "Wonders 2024",
    publisher: "McGraw Hill",
    grades: "G1–G6",
    format: "Blended",
    price: "—",
    badges: ["Core ELA"],
    status: "Published",
    cardIcon: "ela",
    headerKey: "mh",
    detailLine: "Folder · 6 grade-level ELA bundles",
    curriculum: "American",
    gradeBuckets: ["G1–G3", "G4–G6"],
    lineItems: tbItems("tb-wonders", "Wonders", 1, 6, 80, ["English", "Print", "American"]),
    folderPriceLabel: "6 titles · From AED 80",
    folderDetailSummary: "Student bundle per grade",
    folderAccess: { passwordProtected: false },
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
    price: "—",
    badges: [],
    status: "Published",
    cardIcon: "readingSeries",
    headerKey: "oxford",
    detailLine: "Folder · 6 stage packs",
    curriculum: metaLine("Oxford", "Lexile 200–500", "English", "Fiction"),
    readingLevel: "Lexile 200–400",
    genre: "Fiction",
    language: "English",
    gradeBuckets: ["G1–G3"],
    lineItems: libStageItems(
      "lb-ort",
      "Oxford Reading Tree",
      ["Stage 1", "Stage 2", "Stage 3", "Stage 4", "Stage 5", "Stage 6"],
      22,
    ),
    folderPriceLabel: "6 packs · From AED 22",
    folderDetailSummary: "ISBN & price per stage pack",
    folderAccess: { passwordProtected: false },
  },
  {
    id: "lb-scholastic",
    name: "Scholastic Classroom Libraries — Middle",
    publisher: "Scholastic",
    grades: "G6–G8",
    format: "Print",
    price: "—",
    badges: ["150 titles"],
    status: "Published",
    cardIcon: "libraryBundle",
    headerKey: "scholastic",
    detailLine: "Folder · 8 shelf bundles (demo)",
    curriculum: metaLine("Scholastic", "Lexile 600–800", "English", "Fiction"),
    readingLevel: "Lexile 600–800",
    genre: "Fiction",
    language: "English",
    gradeBuckets: ["G7–G9"],
    lineItems: Array.from({ length: 8 }, (_, i) => {
      const id = `lb-scholastic-b${i + 1}`;
      return {
        id,
        title: `Middle shelf bundle ${i + 1} (18–20 titles)`,
        gradeLabel: `B${i + 1}`,
        isbn: `978-0-54-${60000 + i}-X`,
        price: `AED ${380 + i * 25}`,
        priceUnit: "/ bundle",
        status: "Published" as const,
        coverImageUrl: defaultLineItemCoverUrl(id),
      };
    }),
    folderPriceLabel: "8 bundles · From AED 380",
    folderDetailSummary: "Each bundle priced separately",
    folderAccess: { passwordProtected: false },
  },
  {
    id: "lb-ng",
    name: "National Geographic Ladders — Science",
    publisher: "Cengage",
    grades: "G4–G8",
    format: "Print",
    price: "—",
    badges: ["Non-fiction", "ELL"],
    status: "Published",
    cardIcon: "scienceReaders",
    headerKey: "teal",
    detailLine: "Folder · 6 leveled sets",
    curriculum: metaLine("Cengage", "Lexile 400–600", "English", "Non-Fiction"),
    readingLevel: "Lexile 400–600",
    genre: "Non-Fiction",
    language: "English",
    gradeBuckets: ["G4–G6", "G7–G9"],
    lineItems: Array.from({ length: 6 }, (_, i) => {
      const id = `lb-ng-l${i + 1}`;
      return {
        id,
        title: `Ladders Science — Level ${i + 1} (set of 10)`,
        gradeLabel: `L${i + 1}`,
        isbn: `978-1-305-${45000 + i}-X`,
        price: `AED ${290 + i * 15}`,
        priceUnit: "/ set",
        status: "Published" as const,
        coverImageUrl: defaultLineItemCoverUrl(id),
      };
    }),
    folderPriceLabel: "6 sets · From AED 290",
    folderDetailSummary: "ISBN per leveled set",
    folderAccess: { passwordProtected: false },
  },
  {
    id: "lb-arabic",
    name: "Arabic Leveled Library — Band A–C",
    publisher: "Panworld",
    grades: "G1–G4",
    format: "Print",
    price: "—",
    badges: ["Arabic", "NCC"],
    status: "Published",
    cardIcon: "arabicLibrary",
    headerKey: "amber",
    detailLine: "Folder · 6 band crates",
    curriculum: metaLine("Panworld", "Band A–C", "Arabic", "Arabic Literature"),
    readingLevel: "Lexile 200–400",
    genre: "Arabic Literature",
    language: "Arabic",
    gradeBuckets: ["G1–G3", "G4–G6"],
    lineItems: Array.from({ length: 6 }, (_, i) => {
      const id = `lb-arabic-c${i + 1}`;
      return {
        id,
        title: `Arabic band crate ${String.fromCharCode(65 + i)} (6 titles)`,
        gradeLabel: `C${i + 1}`,
        isbn: `978-9-948-${300 + i}-X`,
        price: `AED ${180 + i * 12}`,
        priceUnit: "/ crate",
        status: "Published" as const,
        coverImageUrl: defaultLineItemCoverUrl(id),
      };
    }),
    folderPriceLabel: "6 crates · From AED 180",
    folderDetailSummary: "Per-crate ISBN and pricing",
    folderAccess: { passwordProtected: false },
  },
  {
    id: "lb-bigcat",
    name: "Collins Big Cat — Extended Pack",
    publisher: "Collins",
    grades: "KG2–G5",
    format: "Print",
    price: "—",
    badges: ["Phonics"],
    status: "Draft",
    cardIcon: "levelledPack",
    headerKey: "teal",
    detailLine: "Folder · 6 phonics bands",
    curriculum: metaLine("Collins", "Levelled", "English", "Non-Fiction"),
    readingLevel: "Lexile 400–600",
    genre: "Non-Fiction",
    language: "English",
    gradeBuckets: ["KG1/KG2", "G1–G3", "G4–G6"],
    lineItems: Array.from({ length: 6 }, (_, i) => {
      const id = `lb-bigcat-p${i + 1}`;
      return {
        id,
        title: `Big Cat Phonics — Band ${i + 1} (4 books)`,
        gradeLabel: `P${i + 1}`,
        isbn: `978-0-00-${82000 + i}-X`,
        price: `AED ${320 + i * 20}`,
        priceUnit: "/ band",
        status: "Draft" as const,
        coverImageUrl: defaultLineItemCoverUrl(id),
      };
    }),
    folderPriceLabel: "6 bands · From AED 320",
    folderDetailSummary: "Per-band listing",
    folderAccess: { passwordProtected: false },
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
    price: "—",
    badges: ["New partnership", "Phonics Kit"],
    status: "Published",
    cardIcon: "phonicsKit",
    headerKey: "jolly",
    detailLine: "Folder · 5 orderable components",
    curriculum: "Jolly Phonics · KG1 classroom set",
    kitType: "Phonics Kit",
    kitDetailLine: "Student books, teacher guide, sound cards, workbooks",
    gradeBuckets: ["KG1/KG2"],
    lineItems: kitComponentItems("kit-jolly", [
      { label: "Set A", title: "Student books classroom set (30)", price: 120, unit: "/ set" },
      { label: "Set B", title: "Teacher guide & lesson pack", price: 85 },
      { label: "Set C", title: "Sound cards + flash pack", price: 45 },
      { label: "Set D", title: "Workbooks (consumable)", price: 95, unit: "/ pack" },
      { label: "Set E", title: "Training & onboarding USB", price: 35 },
    ]),
    folderPriceLabel: "5 SKUs · From AED 35",
    folderDetailSummary: "Component ISBN and price (not one lump price)",
    folderAccess: { passwordProtected: false },
  },
  {
    id: "kit-stem",
    name: "STEM Lab Discovery Kit G3–G5",
    publisher: "Kodeit",
    grades: "G3–G5",
    format: "Kit",
    price: "—",
    badges: ["Our Brand", "NCC", "STEM"],
    status: "Published",
    cardIcon: "stemLab",
    headerKey: "stem",
    detailLine: "Folder · 4 classroom bundles",
    curriculum: "Kodeit · 24-student set · Inquiry STEM",
    kitType: "STEM",
    kitDetailLine: "18 components · MOQ 1",
    gradeBuckets: ["G1–G3", "G4–G6"],
    lineItems: kitComponentItems("kit-stem", [
      { label: "G3", title: "STEM Lab — Grade 3 classroom refill", price: 520 },
      { label: "G4", title: "STEM Lab — Grade 4 classroom refill", price: 540 },
      { label: "G5", title: "STEM Lab — Grade 5 classroom refill", price: 560 },
      { label: "Add-on", title: "Consumables annual pack", price: 180 },
    ]),
    folderPriceLabel: "4 SKUs · From AED 180",
    folderDetailSummary: "Per-grade refill and consumables",
    folderAccess: { passwordProtected: false },
  },
  {
    id: "kit-robotics",
    name: "Primary Robotics Starter Set",
    publisher: "Kodeit",
    grades: "G4–G8",
    format: "Kit",
    price: "—",
    badges: ["STEM"],
    status: "Published",
    cardIcon: "robotics",
    headerKey: "robotics",
    detailLine: "Folder · 4 purchase options",
    curriculum: "Kodeit · Classroom pack · Coding intro",
    kitType: "Collaboration Kit",
    kitDetailLine: "12 bots · curriculum maps",
    gradeBuckets: ["G4–G6", "G7–G9"],
    lineItems: kitComponentItems("kit-robotics", [
      { label: "6-bot", title: "Starter — 6 bots + curriculum", price: 1200 },
      { label: "12-bot", title: "Classroom — 12 bots + curriculum", price: 2100 },
      { label: "Field", title: "Competition field add-on", price: 420 },
      { label: "Train", title: "Teacher PD session (1 day)", price: 1800 },
    ]),
    folderPriceLabel: "4 SKUs · From AED 420",
    folderDetailSummary: "Bots, field, and services priced separately",
    folderAccess: { passwordProtected: false },
  },
  {
    id: "kit-math",
    name: "Science Lab Kit — G4 Unit 1",
    publisher: "McGraw Hill",
    grades: "G4",
    format: "Kit",
    price: "—",
    badges: ["Science Kit"],
    status: "Published",
    cardIcon: "scienceLabKit",
    headerKey: "mh",
    detailLine: "Folder · 5 order lines",
    curriculum: "McGraw Hill · 30-student set · Inspire Science aligned",
    kitType: "Science Lab Kit",
    kitDetailLine: "24 components · MOQ: 1 · Consumables available",
    gradeBuckets: ["G4–G6"],
    lineItems: kitComponentItems("kit-math", [
      { label: "Core", title: "Unit 1 core materials (30 students)", price: 480 },
      { label: "Glass", title: "Glassware replacement set", price: 120 },
      { label: "Safety", title: "Safety goggles classroom pack", price: 90 },
      { label: "Chem", title: "Consumable chemicals refill", price: 65 },
      { label: "Digital", title: "Digital lab simulations add-on", price: 220, unit: "/ year" },
    ]),
    folderPriceLabel: "5 SKUs · From AED 65",
    folderDetailSummary: "Core kit + consumables + digital add-on",
    folderAccess: { passwordProtected: false },
  },
  {
    id: "kit-art",
    name: "Middle School Art & Craft Supply Pack",
    publisher: "Panworld",
    grades: "G6–G9",
    format: "Kit",
    price: "—",
    badges: ["Draft listing"],
    status: "Draft",
    cardIcon: "artSupplies",
    headerKey: "art",
    detailLine: "Folder · 5 material bundles",
    curriculum: "Panworld · Art & craft bundle",
    kitType: "Collaboration Kit",
    kitDetailLine: "Supplies for 30 students",
    gradeBuckets: ["G7–G9"],
    lineItems: kitComponentItems("kit-art", [
      { label: "Paper", title: "Paper & sketch pack", price: 120 },
      { label: "Paint", title: "Acrylic & brush set", price: 210 },
      { label: "Craft", title: "Craft consumables (bulk)", price: 95 },
      { label: "Clay", title: "Clay & tools", price: 140 },
      { label: "Storage", title: "Classroom storage caddies", price: 85 },
    ]),
    folderPriceLabel: "5 SKUs · From AED 85",
    folderDetailSummary: "Per-bundle pricing",
    folderAccess: { passwordProtected: false },
  },
];

export const catalogueByTab: Record<CatalogueTab, CatalogueProductRow[]> = {
  textbooks: catalogueTextbooks,
  library: catalogueLibraryBooks,
  kits: catalogueKits,
};

export function getCatalogueFolder(tab: CatalogueTab, id: string): CatalogueProductRow | undefined {
  return catalogueByTab[tab].find((p) => p.id === id);
}

/** Meta line for textbooks (publisher · format · grades · curriculum) */
export function textbookMetaLine(p: CatalogueProductRow): string {
  return `${p.publisher} · ${p.format} · ${p.grades} · ${p.curriculum}`;
}

/** Split meta for UI: publisher highlighted separately from the rest */
export function textbookMetaLineParts(p: CatalogueProductRow): { publisher: string; rest: string } {
  return { publisher: p.publisher, rest: `${p.format} · ${p.grades} · ${p.curriculum}` };
}

/** Library cards use `curriculum` field as full meta line */
export function libraryMetaLine(p: CatalogueProductRow): string {
  return p.curriculum;
}

export function libraryMetaLineParts(p: CatalogueProductRow): { publisher: string; rest: string } {
  return { publisher: p.publisher, rest: p.curriculum };
}

/** Kits: curriculum field holds prod-meta */
export function kitMetaLine(p: CatalogueProductRow): string {
  return p.curriculum;
}

export function kitMetaLineParts(p: CatalogueProductRow): { publisher: string; rest: string } {
  return { publisher: p.publisher, rest: p.curriculum };
}

/** Search across folder + line items */
export function catalogueHaystack(p: CatalogueProductRow, tab: CatalogueTab): string {
  const meta = tab === "textbooks" ? textbookMetaLine(p) : tab === "library" ? libraryMetaLine(p) : kitMetaLine(p);
  const items = p.lineItems.map((li) => `${li.title} ${li.gradeLabel} ${li.isbn ?? ""} ${li.price}`).join(" ");
  return [p.name, p.publisher, p.grades, p.format, p.detailLine, meta, p.readingLevel ?? "", p.genre ?? "", items].join(" ").toLowerCase();
}
