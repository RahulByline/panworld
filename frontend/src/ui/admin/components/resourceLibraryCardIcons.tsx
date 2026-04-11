import type { LucideIcon } from "lucide-react";
import { FileText, FileType, Link2, Presentation, Table2 } from "lucide-react";
import type { ResourceFormatKind } from "../../../data/admin/resourceLibrary";

const BY_KIND: Record<ResourceFormatKind, LucideIcon> = {
  pdf: FileText,
  pptx: Presentation,
  docx: FileText,
  link: Link2,
  sheet: Table2,
  other: FileType,
};

export function getResourceLibraryIconForFormat(kind: ResourceFormatKind): LucideIcon {
  return BY_KIND[kind] ?? BY_KIND.other;
}
