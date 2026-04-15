/** Kanban column keys aligned with panworld_admin.html RFQ page */
export type RfqKanbanColumnKey = "submitted" | "quoted" | "approved" | "delivered";

export type RfqKanbanCard = {
  rfqId: string;
  title: string;
  meta1: string;
  meta2: string;
  accountManager: string;
  publisher: string;
  territory: "UAE" | "KSA";
  /** 0–100; shown as pipeline progress bar. Falls back to column default if omitted. */
  progress?: number;
  /** Shown in card footer next to calendar icon */
  footerDate?: string;
  isNew?: boolean;
  pendingBadge?: string;
  pendingTone?: "warn" | "muted";
  fulfillment?: string;
  fulfillmentTone?: "success" | "brand";
  successBorder?: boolean;
  showReviewCta?: boolean;
};

export type RfqKanbanColumn = {
  key: RfqKanbanColumnKey;
  count: number | string;
  countTone?: "warn" | "success" | "default";
  cards: RfqKanbanCard[];
};

export const rfqPipelinePageStats = {
  active: 34,
  urgent: 8,
};

export const rfqStageFilterOptions = [
  "All Stages",
  "Submitted",
  "Reviewed",
  "Quoted",
  "Approved",
  "Ordered",
  "Delivered",
] as const;

export const rfqAmFilterOptions = ["All AMs", "Rania Khalil", "Ahmed Al-Rashidi", "Sara Nasser"] as const;

export const rfqPublisherFilterOptions = [
  "All Publishers",
  "McGraw Hill",
  "Kodeit",
  "StudySync",
  "Pearson",
  "Oxford",
  "Jolly Phonics",
  "Cambridge",
] as const;

export const rfqTerritoryFilterOptions = ["All Territories", "UAE", "Saudi Arabia"] as const;

export const rfqDateFilterOptions = ["Any Date", "Due this week", "Due this month", "Overdue"] as const;

export const rfqKanbanColumns: RfqKanbanColumn[] = [
  {
    key: "submitted",
    count: 8,
    countTone: "warn",
    cards: [
      {
        rfqId: "PW-2026-082",
        title: "Al Noor · Inspire Science G4–G6",
        meta1: "RFQ #PW-2026-082 · AED est. 45,000",
        meta2: "Rania Khalil · Submitted: Today 9:42 AM",
        accountManager: "Rania Khalil",
        publisher: "McGraw Hill",
        territory: "UAE",
        progress: 28,
        footerDate: "11 Apr 2026",
        isNew: true,
        showReviewCta: true,
      },
      {
        rfqId: "PW-2026-081",
        title: "GEMS Dubai · StudySync G6–G12",
        meta1: "RFQ #PW-2026-081 · AED est. 28,000",
        meta2: "Rania Khalil · Submitted: Yesterday",
        accountManager: "Rania Khalil",
        publisher: "StudySync",
        territory: "UAE",
        progress: 22,
        footerDate: "10 Apr 2026",
        showReviewCta: true,
      },
      {
        rfqId: "PW-2026-080",
        title: "King Faisal · Kodeit Social Sciences",
        meta1: "RFQ #PW-2026-080 · SAR est. 62,000",
        meta2: "Ahmed Al-Rashidi · 2 days ago",
        accountManager: "Ahmed Al-Rashidi",
        publisher: "Kodeit",
        territory: "KSA",
        progress: 35,
        footerDate: "9 Apr 2026",
        showReviewCta: true,
      },
    ],
  },
  {
    key: "quoted",
    count: 11,
    countTone: "default",
    cards: [
      {
        rfqId: "PW-2026-075",
        title: "Taaleem Brighton · Reveal Math G1–G6",
        meta1: "RFQ #PW-2026-075 · AED 67,500",
        meta2: "Quote sent 5 Apr · Awaiting approval",
        accountManager: "Rania Khalil",
        publisher: "McGraw Hill",
        territory: "UAE",
        progress: 52,
        footerDate: "5 Apr 2026",
        pendingBadge: "6 days pending",
        pendingTone: "warn",
      },
      {
        rfqId: "PW-2026-074",
        title: "Aldar Academy · Jolly Phonics KG",
        meta1: "RFQ #PW-2026-074 · AED 12,800",
        meta2: "Quote sent 6 Apr · Awaiting approval",
        accountManager: "Sara Nasser",
        publisher: "Jolly Phonics",
        territory: "UAE",
        progress: 48,
        footerDate: "6 Apr 2026",
        pendingBadge: "5 days pending",
        pendingTone: "muted",
      },
    ],
  },
  {
    key: "approved",
    count: 15,
    countTone: "success",
    cards: [
      {
        rfqId: "PW-2026-068",
        title: "SABIS Dubai · Wonders ELA KG–G5",
        meta1: "RFQ #PW-2026-068 · AED 89,000",
        meta2: "Approved 2 Apr · Processing",
        accountManager: "Rania Khalil",
        publisher: "McGraw Hill",
        territory: "UAE",
        progress: 78,
        footerDate: "2 Apr 2026",
        fulfillment: "In Warehouse",
        fulfillmentTone: "success",
        successBorder: true,
      },
      {
        rfqId: "PW-2026-065",
        title: "Nord Anglia · Cambridge Primary",
        meta1: "RFQ #PW-2026-065 · AED 44,000",
        meta2: "Approved 28 Mar · Dispatched",
        accountManager: "Sara Nasser",
        publisher: "Cambridge",
        territory: "UAE",
        progress: 82,
        footerDate: "28 Mar 2026",
        fulfillment: "Dispatched",
        fulfillmentTone: "brand",
        successBorder: true,
      },
    ],
  },
  {
    key: "delivered",
    count: "47 this month",
    countTone: "default",
    cards: [
      {
        rfqId: "PW-2026-060",
        title: "GEMS Wellington · Inspire Science G1–G4",
        meta1: "RFQ #PW-2026-060 · AED 156,000",
        meta2: "Delivered 5 Apr 2026",
        accountManager: "Rania Khalil",
        publisher: "McGraw Hill",
        territory: "UAE",
        progress: 100,
        footerDate: "5 Apr 2026",
        fulfillment: "Delivered ✓",
        fulfillmentTone: "success",
      },
    ],
  },
];

export const rfqCreateSchoolOptions = [
  "Al Noor International School",
  "GEMS Wellington International",
  "King Faisal International School",
  "Taaleem Brighton",
  "Aldar Academy",
  "SABIS Dubai",
  "Ajman Academy",
];

export const rfqCreateProductOptions = [
  "Inspire Science G1–G8",
  "Reveal Math 2025",
  "Kodeit Social Sciences G1–G12",
  "StudySync ELA G6–G12",
  "Achieve3000 Platform",
  "Oxford Reading Tree",
  "Jolly Phonics KG1 Kit",
  "Science Lab Kit",
];

/** Detail fixture for view modal (matches HTML #PW-2026-082) */
export const rfqDetailFixture = {
  rfqId: "PW-2026-082",
  school: "Al Noor International",
  schoolSub: "Dubai, UAE · American",
  submittedBy: "Sarah Al-Mansoori",
  submittedBySub: "HOD Science · 11 Apr 9:42 AM",
  accountManager: "Rania Khalil",
  accountManagerSub: "UAE Territory",
  estValue: "AED 45,000",
  requiredBy: "1 September 2026",
  budget: "AED 40,000–50,000",
  decisionMaker: "School Principal",
  lineItems: [
    {
      product: "Inspire Science",
      publisher: "McGraw Hill",
      grade: "G4–G6",
      format: "Blended",
      qty: "180 sets",
      notes: "Urgent — new academic year",
    },
    {
      product: "ConnectED Digital Licences",
      publisher: "McGraw Hill",
      grade: "G4–G6",
      format: "Digital",
      qty: "180",
      notes: "Need by Aug 2026",
    },
    {
      product: "Science Lab Kit",
      publisher: "McGraw Hill",
      grade: "G4–G6",
      format: "Kit",
      qty: "6 kits",
      notes: "One per section",
    },
  ],
  quoteRows: [
    { item: "Inspire Science G4–G6 (Blended)", unit: 89, qty: 180, subtotal: "AED 16,020" },
    { item: "ConnectED Digital Licences (1yr)", unit: 120, qty: 180, subtotal: "AED 21,600" },
    { item: "Science Lab Kit G4–G6", unit: 480, qty: 6, subtotal: "AED 2,880" },
  ],
  discountPct: 10,
  validUntil: "2026-05-11",
  totalAfterDiscount: "AED 36,450",
  threads: [
    {
      who: "Sarah Al-Mansoori (School)",
      when: "11 Apr · 9:42 AM",
      tone: "brand" as const,
      body: "Hi, we need Inspire Science G4–G6 for 180 students starting September. Please include ConnectED digital licences and lab kits. We already have G1–G3 from last year. Budget is around AED 45K. Please send a quote ASAP.",
      attachments: ["Requirement_Sheet.pdf (240 KB)", "Student_Count_G4G6.xlsx (18 KB)"],
    },
    {
      who: "Rania Khalil (Panworld)",
      when: "11 Apr · 10:15 AM",
      tone: "success" as const,
      body: "Hi Sarah, thanks for the RFQ! I've reviewed the requirements and will prepare a quote including the blended bundle (print + ConnectED) and 6 lab kits. I'll also check with McGraw Hill for any volume discount on 180+ sets. Will have the quote ready by end of today.",
    },
    {
      who: "Sarah Al-Mansoori (School)",
      when: "11 Apr · 11:30 AM",
      tone: "brand" as const,
      body: "Great, thank you! One thing — our Principal also asked if we can get a sample kit first for the science department to review before the full order. Is that possible?",
    },
    {
      who: "Rania Khalil (Panworld)",
      when: "11 Apr · 11:45 AM",
      tone: "success" as const,
      body: "Absolutely! I'll arrange a sample kit to be sent to your school this week. In the meantime, I'll share the ConnectED demo credentials so your teachers can explore the digital platform.",
    },
  ],
  timeline: [
    { dot: "success" as const, when: "11 Apr 9:42 AM", text: "RFQ submitted by Sarah Al-Mansoori via portal" },
    { dot: "brand" as const, when: "11 Apr 9:43 AM", text: "Auto-assigned to Rania Khalil (UAE territory)" },
    { dot: "brand" as const, when: "11 Apr 9:43 AM", text: "WhatsApp confirmation sent to school via Wati.io" },
    { dot: "success" as const, when: "11 Apr 10:15 AM", text: "Rania replied to school — acknowledged RFQ" },
    { dot: "accent" as const, when: "11 Apr 11:30 AM", text: "School requested sample kit · Sarah Al-Mansoori" },
    { dot: "success" as const, when: "11 Apr 11:45 AM", text: "Sample request logged · Rania confirmed via WhatsApp" },
    { dot: "warn" as const, when: "Now", text: "Awaiting quote upload — stage: Under Review", urgent: true },
  ],
  internalNotes:
    "Large potential account. School has been using Inspire G1–G3 since 2024. High conversion probability. Check with MH for volume pricing on 180+ blended sets.",
};
