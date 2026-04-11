export type AnnouncementRow = {
  title: string;
  meta: string;
  tone: "pinned" | "live" | "draft";
  badge?: string;
};

export const cmsAnnouncements: AnnouncementRow[] = [
  {
    title: "Jolly Phonics New Partnership Launch",
    meta: "Pinned · All schools · Published 1 Apr 2026",
    tone: "pinned",
    badge: "Pinned",
  },
  {
    title: "Reveal Math 2025 Edition Now Available",
    meta: "All schools · Published 28 Mar 2026",
    tone: "live",
  },
  {
    title: "StudySync Arabic UI — Now Live for GCC Schools",
    meta: "Draft · Scheduled 15 Apr 2026",
    tone: "draft",
    badge: "Draft",
  },
];
