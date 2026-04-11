export type ResourceRow = {
  title: string;
  meta: string;
  tone: "published" | "draft";
  iconBg: string;
};

export const resourceLibraryItems: ResourceRow[] = [
  {
    title: "Inspire Science UAE Scope & Sequence G1–G8",
    meta: "McGraw Hill · PDF · 2.4 MB · 38 downloads",
    tone: "published",
    iconBg: "bg-amber-100",
  },
  {
    title: "Kodeit Social Sciences Curriculum Map G1–G12",
    meta: "Kodeit · PDF · 1.8 MB · 24 downloads",
    tone: "published",
    iconBg: "bg-[#EDE7F6]",
  },
  {
    title: "Jolly Phonics KG Kit Implementation Guide",
    meta: "Jolly Phonics · PDF · Draft · Not published yet",
    tone: "draft",
    iconBg: "bg-[#F5F4F0]",
  },
];
