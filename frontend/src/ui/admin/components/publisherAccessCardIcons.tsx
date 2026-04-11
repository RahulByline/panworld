import type { LucideIcon } from "lucide-react";
import { BarChart3, BookOpen, Building2, KeyRound, MessageSquareText } from "lucide-react";
import type { PublisherAccessCardIconId } from "../../../data/admin/publisherAccess";

const MAP: Record<PublisherAccessCardIconId, LucideIcon> = {
  mcgraw: BookOpen,
  kodeit: Building2,
  studysync: MessageSquareText,
  achieve: BarChart3,
  default: KeyRound,
};

export function getPublisherAccessCardIcon(id: PublisherAccessCardIconId): LucideIcon {
  return MAP[id] ?? MAP.default;
}
