/** File / link kind for icons and filters. */
export type ResourceFormatKind = "pdf" | "pptx" | "docx" | "link" | "sheet" | "other";

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
  },
  {
    id: "res-reveal-lessons",
    title: "Reveal Math — Lesson Plan Templates G3–G8",
    meta: "McGraw Hill · PPTX · 5.1 MB · 19 downloads",
    publisher: "McGraw Hill",
    formatKind: "pptx",
    formatLabel: "PPTX",
    tone: "published",
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
  },
  {
    id: "res-oxford-handbook",
    title: "Oxford Reading Tree — placement handbook",
    meta: "Oxford · DOCX · 890 KB · 12 downloads",
    publisher: "Oxford",
    formatKind: "docx",
    formatLabel: "DOCX",
    tone: "published",
  },
  {
    id: "res-studysync-roster",
    title: "StudySync — district roster template",
    meta: "StudySync · Sheet · XLSX · 420 KB · 7 downloads",
    publisher: "StudySync",
    formatKind: "sheet",
    formatLabel: "XLSX",
    tone: "published",
  },
  {
    id: "res-jolly-kg",
    title: "Jolly Phonics KG Kit Implementation Guide",
    meta: "Jolly Phonics · PDF · Draft · Not published yet",
    publisher: "Jolly Phonics",
    formatKind: "pdf",
    formatLabel: "PDF",
    tone: "draft",
  },
];

export const RESOURCE_FORMAT_KINDS: ResourceFormatKind[] = ["pdf", "pptx", "docx", "link", "sheet", "other"];

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
