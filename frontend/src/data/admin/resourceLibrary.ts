/** File / link kind for icons and filters. */
export type ResourceFormatKind =
  | "pdf"
  | "pptx"
  | "docx"
  | "xlsx"
  | "link"
  | "sheet"
  | "audio"
  | "video"
  | "image"
  | "zip"
  | "folder"
  | "other";

export type ResourceRow = {
  id: string;
  title: string;
  meta: string;
  /** Publisher name for display and filtering. */
  publisher: string;
  formatKind: ResourceFormatKind;
  /** Badge text (e.g. PDF, PPTX, Link). */
  formatLabel: string;
  tone: "published" | "draft";
  ourBrand?: boolean;
  /** Short description shown on the card (2 lines max) */
  description?: string;
};

export const resourceLibraryItems: ResourceRow[] = [
  {
    id: "res-inspire-scope",
    title: "Inspire Science UAE Scope & Sequence G1–G8",
    meta: "McGraw Hill · PDF · 2.4 MB · 38 downloads",
    publisher: "McGraw Hill",
    formatKind: "pdf",
    formatLabel: "PDF",
    tone: "published",
    description: "Full scope and sequence document covering all units and learning objectives for Grades 1–8 aligned to the UAE curriculum.",
  },
  {
    id: "res-reveal-lessons",
    title: "Reveal Math — Lesson Plan Templates G3–G8",
    meta: "McGraw Hill · PPTX · 5.1 MB · 19 downloads",
    publisher: "McGraw Hill",
    formatKind: "pptx",
    formatLabel: "PPTX",
    tone: "published",
    description: "Ready-to-use editable lesson plan templates for Grades 3–8, structured around the Reveal Math instructional model.",
  },
  {
    id: "res-kodeit-map",
    title: "Kodeit Social Sciences Curriculum Map G1–G12",
    meta: "Kodeit · PDF · 1.8 MB · 24 downloads",
    publisher: "Kodeit",
    formatKind: "pdf",
    formatLabel: "PDF",
    tone: "published",
    ourBrand: true,
    description: "Comprehensive curriculum map outlining units, key concepts, and assessment checkpoints across all grade levels.",
  },
  {
    id: "res-kodeit-portal",
    title: "Kodeit teacher portal — quick start",
    meta: "Kodeit · External link · SSO guide",
    publisher: "Kodeit",
    formatKind: "link",
    formatLabel: "Link",
    tone: "published",
    ourBrand: true,
    description: "Step-by-step SSO setup guide for teachers accessing the Kodeit portal for the first time.",
  },
  {
    id: "res-oxford-handbook",
    title: "Oxford Reading Tree — placement handbook",
    meta: "Oxford · DOCX · 890 KB · 12 downloads",
    publisher: "Oxford",
    formatKind: "docx",
    formatLabel: "DOCX",
    tone: "published",
    description: "Guidance for placing students at the correct reading stage using Oxford Reading Tree assessment tools.",
  },
  {
    id: "res-studysync-roster",
    title: "StudySync — district roster template",
    meta: "StudySync · Sheet · XLSX · 420 KB · 7 downloads",
    publisher: "StudySync",
    formatKind: "sheet",
    formatLabel: "XLSX",
    tone: "published",
    description: "Standardised roster template for importing student and teacher accounts into the StudySync platform.",
  },
  {
    id: "res-jolly-kg",
    title: "Jolly Phonics KG Kit Implementation Guide",
    meta: "Jolly Phonics · PDF · Draft · Not published yet",
    publisher: "Jolly Phonics",
    formatKind: "pdf",
    formatLabel: "PDF",
    tone: "draft",
    description: "Implementation guide for setting up the Jolly Phonics KG kit in the classroom. Pending final review.",
  },
  {
    id: "res-inspire-audio",
    title: "Inspire Science — Grade 3 Audio Tracks",
    meta: "McGraw Hill · MP3 · 48 MB · 11 downloads",
    publisher: "McGraw Hill",
    formatKind: "audio",
    formatLabel: "MP3",
    tone: "published",
    description: "Audio narration tracks for all Grade 3 Inspire Science student edition chapters, ideal for read-aloud support.",
  },
  {
    id: "res-reveal-video",
    title: "Reveal Math — Instructional Video Series G5",
    meta: "McGraw Hill · MP4 · 320 MB · 9 downloads",
    publisher: "McGraw Hill",
    formatKind: "video",
    formatLabel: "MP4",
    tone: "published",
    description: "Short instructional videos for each Grade 5 unit, designed for flipped classroom or intervention use.",
  },
  {
    id: "res-oxford-tracker",
    title: "Oxford Reading Tree — Progress Tracker",
    meta: "Oxford · XLSX · 210 KB · 17 downloads",
    publisher: "Oxford",
    formatKind: "xlsx",
    formatLabel: "XLSX",
    tone: "published",
    description: "Class-level reading progress tracker with automatic stage calculations and colour-coded attainment bands.",
  },
  {
    id: "res-cambridge-assets",
    title: "Cambridge Primary — Classroom Assets Pack",
    meta: "Cambridge · ZIP · 85 MB · 6 downloads",
    publisher: "Cambridge",
    formatKind: "zip",
    formatLabel: "ZIP",
    tone: "published",
    description: "Printable posters, word walls, and display materials for Cambridge Primary classrooms across all subjects.",
  },
  {
    id: "res-pearson-folder",
    title: "Pearson Edexcel — Teacher Resource Folder",
    meta: "Pearson · Folder · 14 files · 3 downloads",
    publisher: "Pearson",
    formatKind: "folder",
    formatLabel: "Folder",
    tone: "published",
    description: "Shared folder containing mark schemes, past papers, and teacher guides for Pearson Edexcel programmes.",
  },
  {
    id: "res-kodeit-banner",
    title: "Kodeit — School Marketing Banner Pack",
    meta: "Kodeit · PNG/JPG · 12 MB · 5 downloads",
    publisher: "Kodeit",
    formatKind: "image",
    formatLabel: "Image",
    tone: "published",
    ourBrand: true,
    description: "High-resolution banner and social media assets for schools to promote Kodeit programmes to parents.",
  },
  {
    id: "res-achieve-word",
    title: "Achieve3000 — Differentiation Planning Template",
    meta: "Achieve3000 · DOCX · 340 KB · 8 downloads",
    publisher: "Achieve3000",
    formatKind: "docx",
    formatLabel: "DOCX",
    tone: "draft",
    description: "Editable planning template to help teachers design differentiated reading lessons using Achieve3000 articles.",
  },
];

export const RESOURCE_FORMAT_KINDS: ResourceFormatKind[] = [
  "pdf", "pptx", "docx", "xlsx", "link", "sheet", "audio", "video", "image", "zip", "folder", "other",
];

export function uniqueResourcePublishers(items: ResourceRow[]): string[] {
  return [...new Set(items.map((r) => r.publisher))].sort((a, b) => a.localeCompare(b));
}

export const RESOURCE_UPLOAD_PUBLISHERS_SEED = [
  "McGraw Hill",
  "Kodeit",
  "Oxford",
  "Cambridge",
  "Pearson",
  "StudySync",
  "Achieve3000",
  "Jolly Phonics",
  "Other",
] as const;
