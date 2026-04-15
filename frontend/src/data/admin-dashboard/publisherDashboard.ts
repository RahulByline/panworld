export type PublisherKpi = { name: string; accesses30d: number; rfqs: number; pipelineAed: string; trend: string };

export const publisherDashboardKpis: PublisherKpi[] = [
  { name: "McGraw Hill", accesses30d: 1840, rfqs: 62, pipelineAed: "AED 1.2M", trend: "+12%" },
  { name: "StudySync", accesses30d: 920, rfqs: 34, pipelineAed: "AED 540K", trend: "+40%" },
  { name: "Kodeit Global", accesses30d: 410, rfqs: 18, pipelineAed: "AED 210K", trend: "+5%" },
  { name: "Oxford University Press", accesses30d: 380, rfqs: 14, pipelineAed: "AED 180K", trend: "—" },
];
