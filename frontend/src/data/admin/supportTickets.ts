export type SupportTicketUiStatus = "open" | "in_progress" | "resolved";

export type SupportTicketDetail = {
  slaBanner?: string;
  school: string;
  platform: string;
  issueType: string;
  reportedBy: string;
  description: string;
};

export type SupportTicketRow = {
  id: string;
  school: string;
  platform: string;
  issueType: string;
  opened: string;
  slaText: string;
  slaTone: "breach" | "warn" | "ok" | "resolved";
  assignedTo: string | null;
  uiStatus: SupportTicketUiStatus;
  rowHighlight?: boolean;
  detail: SupportTicketDetail;
  actions: ("assign_now" | "view" | "resolve")[];
};

export const supportSummary = {
  open: 5,
  inProgress: 3,
  resolved30d: 42,
  avgResolution: "3.2 hrs",
  slaBreach: 2,
};

export const supportTickets: SupportTicketRow[] = [
  {
    id: "ST-488",
    school: "Taaleem Brighton",
    platform: "ConnectED",
    issueType: "Rostering",
    opened: "Today 7:00 AM",
    slaText: "BREACH — 2h 42m over",
    slaTone: "breach",
    assignedTo: null,
    uiStatus: "open",
    rowHighlight: true,
    detail: {
      slaBanner:
        "⚠ SLA BREACH — This ticket has been open for 6h 42m. Response required immediately.",
      school: "Taaleem Brighton",
      platform: "ConnectED (McGraw Hill)",
      issueType: "Rostering",
      reportedBy: "HOD — Grade 4 Science",
      description:
        'Students in G4B class (32 students) cannot access ConnectED Inspire Science — showing "Not enrolled" error. Teacher has valid licence. Issue started after class roster update on 10 Apr. Blocking 32 students from accessing digital materials.',
    },
    actions: ["assign_now", "view"],
  },
  {
    id: "ST-487",
    school: "GEMS Wellington",
    platform: "StudySync",
    issueType: "Login Access",
    opened: "Today 6:10 AM",
    slaText: "3h 10m remaining",
    slaTone: "warn",
    assignedTo: "Zara Al-Ahmad",
    uiStatus: "in_progress",
    detail: {
      school: "GEMS Wellington",
      platform: "StudySync",
      issueType: "Login Access",
      reportedBy: "IT Coordinator",
      description:
        "Three teacher accounts show invalid password after SSO upgrade. Cleared cache; issue persists for accounts created before 1 Apr.",
    },
    actions: ["view", "resolve"],
  },
  {
    id: "ST-486",
    school: "Aldar Academy",
    platform: "Achieve3000",
    issueType: "Technical Error",
    opened: "Yesterday 2PM",
    slaText: "Resolved",
    slaTone: "resolved",
    assignedTo: "Tech Team",
    uiStatus: "resolved",
    detail: {
      school: "Aldar Academy",
      platform: "Achieve3000",
      issueType: "Technical Error",
      reportedBy: "HOD English",
      description: "Lexile scores not syncing for G8 cohort. Publisher confirmed API fix deployed 10 Apr.",
    },
    actions: ["view"],
  },
  {
    id: "TK-0198",
    school: "Al Noor International",
    platform: "ConnectED",
    issueType: "Login Access",
    opened: "6 Apr",
    slaText: "BREACH — 28h",
    slaTone: "breach",
    assignedTo: "Zara Al-Ahmad",
    uiStatus: "open",
    rowHighlight: true,
    detail: {
      slaBanner: "⚠ SLA BREACH — First response target missed. Escalate to publisher if unresolved within 2h.",
      school: "Al Noor International",
      platform: "ConnectED (McGraw Hill)",
      issueType: "Login Access",
      reportedBy: "Grade 3 Lead",
      description: "ConnectED login error for G3 class — intermittent 403 on student roster import.",
    },
    actions: ["view", "resolve"],
  },
  {
    id: "TK-0200",
    school: "Taaleem Group",
    platform: "Achieve3000",
    issueType: "Platform Setup",
    opened: "8 Apr",
    slaText: "OK — 2h elapsed",
    slaTone: "ok",
    assignedTo: null,
    uiStatus: "open",
    detail: {
      school: "Taaleem Group",
      platform: "Achieve3000",
      issueType: "Platform Setup",
      reportedBy: "Digital Lead",
      description: "Lexile band mismatch after curriculum mapping update — needs roster refresh from SIS.",
    },
    actions: ["assign_now", "view"],
  },
];
