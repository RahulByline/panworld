export type PublisherAccessCardIconId = "mcgraw" | "kodeit" | "studysync" | "achieve" | "default";

export type PublisherAccessRow = {
  id: string;
  title: string;
  subtitle?: string;
  type: "Static" | "School-specific";
  accessLine: string;
  accesses30d: number;
  lastTested: string;
  lastTone: "ok" | "warn" | "expired";
  action: "test" | "pending" | "renew";
  pendingCount?: number;
  /** Highlight card (e.g. Panworld-owned publisher). */
  ourBrand?: boolean;
  cardIcon: PublisherAccessCardIconId;
};

export const publisherAccessRows: PublisherAccessRow[] = [
  {
    id: "pa-mcgraw",
    title: "McGraw Hill ConnectED",
    subtitle: "Inspire Science, Reveal Math, Wonders",
    type: "Static",
    accessLine: "access@mcgraw.com / PanAccess25!",
    accesses30d: 128,
    lastTested: "8 Apr 2026",
    lastTone: "ok",
    action: "test",
    cardIcon: "mcgraw",
  },
  {
    id: "pa-kodeit",
    title: "Kodeit Platform",
    subtitle: "Social Sciences, KG, ICT",
    type: "Static",
    accessLine: "kodeit-access / KodeitPan2026",
    accesses30d: 45,
    lastTested: "7 Apr 2026",
    lastTone: "ok",
    action: "test",
    ourBrand: true,
    cardIcon: "kodeit",
  },
  {
    id: "pa-studysync",
    title: "StudySync",
    subtitle: "School-specific provisioning",
    type: "School-specific",
    accessLine: "Provisioned within 24hrs of request",
    accesses30d: 84,
    lastTested: "9 Apr 2026",
    lastTone: "ok",
    action: "pending",
    pendingCount: 3,
    cardIcon: "studysync",
  },
  {
    id: "pa-achieve",
    title: "Achieve3000",
    type: "Static",
    accessLine: "achieve-pan / Achieve3000!",
    accesses30d: 62,
    lastTested: "Expired 5 Apr",
    lastTone: "expired",
    action: "renew",
    cardIcon: "achieve",
  },
];
