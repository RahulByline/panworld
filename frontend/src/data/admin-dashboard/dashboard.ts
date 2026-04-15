import { accountManagers } from "../admin/accountManagers";

/** Catalogue counts shown on admin dashboard overview */
export const catalogueCounts = {
  textbooks: 240,
  library: 94,
  kits: 18,
};

export type PublisherCoverageRow = { name: string; count: number; pct: number; barClass: "brand" | "accent" | "success" };

export const publisherCoverageRows: PublisherCoverageRow[] = [
  { name: "McGraw Hill", count: 102, pct: 85, barClass: "brand" },
  { name: "Kodeit Global", count: 48, pct: 60, barClass: "accent" },
  { name: "Oxford", count: 31, pct: 35, barClass: "brand" },
  { name: "Others (7)", count: 59, pct: 70, barClass: "success" },
];

export type RfqPipelineStage = {
  id: string;
  count: number;
  variant: "warn" | "brand" | "success" | "muted";
};

/** Stage counts — labels come from i18n */
export const rfqPipelineStages: RfqPipelineStage[] = [
  { id: "submitted", count: 8, variant: "warn" },
  { id: "quoted", count: 11, variant: "brand" },
  { id: "approved", count: 15, variant: "success" },
  { id: "closed", count: 47, variant: "muted" },
];

export type ActivityLogEntry = {
  id: string;
  timeKey: string;
  timeFallback: string;
  messageKey: string;
  actorKey: string;
  dot: "brand" | "success" | "accent" | "danger" | "purple";
};

export const dashboardActivityLog: ActivityLogEntry[] = [
  {
    id: "1",
    timeKey: "admin.dashboard.logTime942",
    timeFallback: "9:42 AM",
    messageKey: "admin.dashboard.logMsg1",
    actorKey: "admin.dashboard.logActor1",
    dot: "brand",
  },
  {
    id: "2",
    timeKey: "admin.dashboard.logTime915",
    timeFallback: "9:15 AM",
    messageKey: "admin.dashboard.logMsg2",
    actorKey: "admin.dashboard.logActor2",
    dot: "success",
  },
  {
    id: "3",
    timeKey: "admin.dashboard.logTime855",
    timeFallback: "8:55 AM",
    messageKey: "admin.dashboard.logMsg3",
    actorKey: "admin.dashboard.logActor3",
    dot: "accent",
  },
  {
    id: "4",
    timeKey: "admin.dashboard.logTime830",
    timeFallback: "8:30 AM",
    messageKey: "admin.dashboard.logMsg4",
    actorKey: "admin.dashboard.logActor4",
    dot: "danger",
  },
  {
    id: "5",
    timeKey: "admin.dashboard.logYesterday",
    timeFallback: "Yesterday",
    messageKey: "admin.dashboard.logMsg5",
    actorKey: "admin.dashboard.logActor5",
    dot: "purple",
  },
];

export type SupportSlaRow = {
  id: string;
  school: string;
  sla: "breach" | "warn" | "ok";
  slaLabelKey: string;
  slaLabelFallback: string;
  status: "open" | "progress" | "resolved";
  statusKey: string;
};

export const dashboardSupportTickets: SupportSlaRow[] = [
  { id: "ST-488", school: "Taaleem Brighton", sla: "breach", slaLabelKey: "admin.dashboard.slaBreach", slaLabelFallback: "BREACH", status: "open", statusKey: "admin.pages.support.filterOpen" },
  { id: "ST-487", school: "GEMS Wellington", sla: "warn", slaLabelKey: "admin.dashboard.slaWarn", slaLabelFallback: "3h 10m", status: "progress", statusKey: "admin.pages.support.filterProgress" },
  { id: "ST-486", school: "Aldar Academy", sla: "ok", slaLabelKey: "admin.dashboard.slaOk", slaLabelFallback: "OK", status: "resolved", statusKey: "admin.pages.support.filterResolved" },
  { id: "ST-485", school: "SABIS Dubai", sla: "ok", slaLabelKey: "admin.dashboard.slaOk", slaLabelFallback: "OK", status: "resolved", statusKey: "admin.pages.support.filterResolved" },
];

/** Top-row KPI values (schools filled from API when available) */
export const dashboardHeadlineStats = {
  /** Count of account managers / sales roster (kept in sync with `accountManagers`) */
  activeSalespeople: accountManagers.length,
  openRfqs: 34,
  openRfqsAlert: "8 need action",
  openTickets: 5,
  ticketsSla: "2 breaching SLA",
  certsIssued: 312,
  certsTrend: "↑ 47 this week",
  schoolsTrend: "↑ 12 this month",
};

/** Sales aggregates (team-wide) */
export const salesAggregateStats = {
  teamPipelineAed: "AED 2.1M",
  pipelineTrend: "↑ 14% vs last month",
  rfqsWonMtd: 23,
  rfqsWonHint: "Across all AMs",
  demosBookedWeek: 18,
  demosHint: "Scheduled touchpoints",
  avgFirstResponseHrs: "4.2h",
  responseHint: "RFQ first reply (30d avg)",
  newSchoolsAssigned30d: 12,
  schoolsAssignedHint: "Net new territory assignments",
};

export type SalesTeamMemberStat = {
  name: string;
  region: string;
  schools: number;
  openRfqs: number;
  pipelineAed: string;
  wonMtd: number;
  meetingsWeek: number;
  trend: string;
  trendUp: boolean;
};

export const salesTeamDashboard: SalesTeamMemberStat[] = [
  { name: "Rania Khalil", region: "UAE · North", schools: 38, openRfqs: 11, pipelineAed: "AED 890K", wonMtd: 7, meetingsWeek: 14, trend: "+12%", trendUp: true },
  { name: "Omar Hassan", region: "UAE · Dubai", schools: 28, openRfqs: 7, pipelineAed: "AED 520K", wonMtd: 5, meetingsWeek: 11, trend: "+4%", trendUp: true },
  { name: "Priya Nair", region: "UAE · Abu Dhabi", schools: 22, openRfqs: 4, pipelineAed: "AED 310K", wonMtd: 4, meetingsWeek: 9, trend: "—", trendUp: true },
  { name: "Layla Al Mansoori", region: "KSA · Riyadh", schools: 14, openRfqs: 2, pipelineAed: "AED 180K", wonMtd: 2, meetingsWeek: 6, trend: "+8%", trendUp: true },
];

/** Legacy — kept for other imports if any */
export const recentRfqRequests = [
  {
    av: "AN",
    avClass: "bg-[#D6EAF8] text-[#0A3D62]",
    title: "Al Noor Int'l — Inspire Science G1–G8",
    meta: "420 students · Submitted 1 Apr",
  },
  {
    av: "GD",
    avClass: "bg-[#E8F5E9] text-[#1E8449]",
    title: "GEMS Dubai — Reveal Math + Wonders",
    meta: "680 students · Submitted 5 Apr",
  },
  {
    av: "TL",
    avClass: "bg-[#EDE7F6] text-[#512DA8]",
    title: "Taaleem — StudySync GCC Ed. G6–G12",
    meta: "300 licences · Submitted 7 Apr",
  },
];

export const publisherEngagementBars = [
  { name: "McGraw Hill", pct: 74, fill: "success" as const },
  { name: "Kodeit", pct: 61, fill: "brand" as const },
  { name: "StudySync", pct: 48, fill: "accent" as const },
  { name: "Achieve3000", pct: 32, fill: "accent" as const },
];

export const schoolActivityRows = [
  { school: "Al Noor International", country: "UAE", phase: "Phase 1+2+3", login: "Today", rfqs: "3", train: "68%", trainClass: "text-[#1E8449]" },
  { school: "GEMS World Academy", country: "UAE", phase: "Phase 1+2", login: "Yesterday", rfqs: "1", train: "52%", trainClass: "text-[#0A3D62]" },
  { school: "Al Faisaliyah School", country: "KSA", phase: "Phase 1", login: "3 days ago", rfqs: "0", train: "20%", trainClass: "text-[#E8912D]" },
  { school: "Taaleem Group", country: "UAE", phase: "Phase 1+2+3", login: "Today", rfqs: "2", train: "81%", trainClass: "text-[#1E8449]" },
];
