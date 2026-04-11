export type TicketStatus = "SLA Breach" | "Open" | "In Progress";

export type SupportTicketRow = {
  id: string;
  school: string;
  issue: string;
  platform: string;
  status: TicketStatus;
  openSince: string;
  highlight?: boolean;
  action: "escalate" | "assign" | "view";
};

export const supportSummary = {
  open: 5,
  inProgress: 3,
  resolved30d: 42,
  avgResolution: "3.2 hrs",
  avgResolutionSub: "Within SLA",
};

export const supportTickets: SupportTicketRow[] = [
  {
    id: "TK-0198",
    school: "Al Noor International",
    issue: "ConnectED login error G3 class",
    platform: "ConnectED",
    status: "SLA Breach",
    openSince: "6 Apr · 28hrs",
    highlight: true,
    action: "escalate",
  },
  {
    id: "TK-0195",
    school: "GEMS Dubai",
    issue: "StudySync roster sync failure",
    platform: "StudySync",
    status: "SLA Breach",
    openSince: "5 Apr · 52hrs",
    highlight: true,
    action: "escalate",
  },
  {
    id: "TK-0200",
    school: "Taaleem Group",
    issue: "Achieve3000 Lexile mismatch",
    platform: "Achieve3000",
    status: "Open",
    openSince: "8 Apr · 2hrs",
    action: "assign",
  },
  {
    id: "TK-0201",
    school: "Repton Dubai",
    issue: "PDF sample not downloading",
    platform: "Portal",
    status: "In Progress",
    openSince: "8 Apr · 1hr",
    action: "view",
  },
  {
    id: "TK-0202",
    school: "Nord Anglia",
    issue: "Cannot add users to portal",
    platform: "Portal",
    status: "Open",
    openSince: "9 Apr · 30min",
    action: "assign",
  },
];
