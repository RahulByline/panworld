import type { LucideIcon } from "lucide-react";
import {
  Atom,
  BookMarked,
  BookOpen,
  BookText,
  Bot,
  DraftingCompass,
  FlaskConical,
  Globe2,
  GraduationCap,
  Languages,
  Layers,
  Library,
  MessageSquare,
  Microscope,
  Palette,
} from "lucide-react";
import type { CatalogueCardIconId } from "../../../../data/admin/catalogueCardIconIds";

const MAP: Record<CatalogueCardIconId, LucideIcon> = {
  scienceCore: Atom,
  math: DraftingCompass,
  socialStudies: Globe2,
  digitalLearning: MessageSquare,
  ela: BookMarked,
  readingSeries: BookOpen,
  libraryBundle: Library,
  scienceReaders: Layers,
  arabicLibrary: Languages,
  levelledPack: BookText,
  phonicsKit: GraduationCap,
  stemLab: FlaskConical,
  robotics: Bot,
  scienceLabKit: Microscope,
  artSupplies: Palette,
  default: BookOpen,
};

export function getCatalogueCardIcon(id: CatalogueCardIconId): LucideIcon {
  return MAP[id] ?? MAP.default;
}
