/** Account managers — operations view (not in original school-only mockups). */
export type AccountManagerRow = {
  name: string;
  region: string;
  activeSchools: number;
  openRfqs: number;
  pipelineAed: string;
};

export const accountManagers: AccountManagerRow[] = [
  { name: "Rania Khalil", region: "UAE · North", activeSchools: 38, openRfqs: 11, pipelineAed: "AED 890K" },
  { name: "Omar Hassan", region: "UAE · Dubai", activeSchools: 28, openRfqs: 7, pipelineAed: "AED 520K" },
  { name: "Priya Nair", region: "UAE · Abu Dhabi", activeSchools: 22, openRfqs: 4, pipelineAed: "AED 310K" },
  { name: "Layla Al Mansoori", region: "KSA · Riyadh", activeSchools: 14, openRfqs: 2, pipelineAed: "AED 180K" },
];
