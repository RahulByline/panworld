export type PublisherAccessRow = {
  title: string;
  subtitle?: string;
  type: "Static" | "School-specific";
  accessLine: string;
  accesses30d: number;
  lastTested: string;
  lastTone: "ok" | "warn" | "expired";
  action: "test" | "pending" | "renew";
  pendingCount?: number;
};

export const publisherAccessRows: PublisherAccessRow[] = [
  {
    title: "McGraw Hill ConnectED",
    subtitle: "Inspire Science, Reveal Math, Wonders",
    type: "Static",
    accessLine: "access@mcgraw.com / PanAccess25!",
    accesses30d: 128,
    lastTested: "8 Apr 2026",
    lastTone: "ok",
    action: "test",
  },
  {
    title: "Kodeit Platform",
    subtitle: "Social Sciences, KG, ICT",
    type: "Static",
    accessLine: "kodeit-access / KodeitPan2026",
    accesses30d: 45,
    lastTested: "7 Apr 2026",
    lastTone: "ok",
    action: "test",
  },
  {
    title: "StudySync",
    subtitle: "School-specific provisioning",
    type: "School-specific",
    accessLine: "Provisioned within 24hrs of request",
    accesses30d: 84,
    lastTested: "9 Apr 2026",
    lastTone: "ok",
    action: "pending",
    pendingCount: 3,
  },
  {
    title: "Achieve3000",
    type: "Static",
    accessLine: "achieve-pan / Achieve3000!",
    accesses30d: 62,
    lastTested: "Expired 5 Apr",
    lastTone: "expired",
    action: "renew",
  },
];
