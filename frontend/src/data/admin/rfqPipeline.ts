export type RfqPipelineStatus = "Submitted" | "Under Review" | "Quoted" | "Quote Ready" | "Approved" | "Ordered";

export type RfqPipelineRow = {
  id: string;
  school: string;
  products: string;
  valueAed: string;
  accountManager: string;
  status: RfqPipelineStatus;
  daysOpen: number;
  action: "respond" | "view";
};

export const rfqPipelineSummary = {
  totalActive: 24,
  pipelineValue: "AED 2.4M",
  awaitingResponse: 8,
  awaitingSub: "Avg 2.1 days pending",
  quoteReady: 5,
  quoteReadySub: "Awaiting school approval",
};

export const accountManagerFilterOptions = ["All AMs", "Rania Khalil", "Omar Hassan", "Priya Nair"];

export const rfqStatusFilterOptions = [
  "All Statuses",
  "Submitted",
  "Under Review",
  "Quoted",
  "Quote Ready",
  "Approved",
  "Ordered",
];

export const rfqPipelineRows: RfqPipelineRow[] = [
  {
    id: "RFQ-0089",
    school: "Al Noor International",
    products: "Inspire Science G1–G8",
    valueAed: "AED 37,380",
    accountManager: "Rania K.",
    status: "Quote Ready",
    daysOpen: 8,
    action: "respond",
  },
  {
    id: "RFQ-0092",
    school: "Al Noor International",
    products: "Reveal Math + Wonders",
    valueAed: "AED 95,880",
    accountManager: "Rania K.",
    status: "Under Review",
    daysOpen: 4,
    action: "respond",
  },
  {
    id: "RFQ-0093",
    school: "GEMS World Academy",
    products: "StudySync G6–G12 GCC Ed.",
    valueAed: "AED 36,000",
    accountManager: "Omar H.",
    status: "Submitted",
    daysOpen: 2,
    action: "respond",
  },
  {
    id: "RFQ-0094",
    school: "Taaleem Group",
    products: "Kodeit Social Sciences G1–G12 · 12 campuses",
    valueAed: "AED 570,000",
    accountManager: "Rania K.",
    status: "Approved",
    daysOpen: 14,
    action: "view",
  },
  {
    id: "RFQ-0095",
    school: "Repton Dubai",
    products: "Oxford Primary ELA + Cambridge Science",
    valueAed: "AED 42,400",
    accountManager: "Priya N.",
    status: "Submitted",
    daysOpen: 1,
    action: "respond",
  },
];
