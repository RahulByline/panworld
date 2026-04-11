import { AM_PORTFOLIO_SCHOOLS } from "./amPortfolioSchools";

/** Account managers — sales team view (UI mock; portfolio drives “schools” count). */
export type AccountManagerTerritory = "UAE" | "SA" | "BOTH";

export type AccountManagerRow = {
  id: string;
  name: string;
  title: string;
  /** Shown under name, e.g. "UAE · North" */
  region: string;
  territory: AccountManagerTerritory;
  email: string;
  mobile: string;
  visibleToSchools: boolean;
  openRfqs: number;
  pipelineAed: string;
  assignedSchoolIds: string[];
};

function idsRange(startIndex: number, count: number): string[] {
  return AM_PORTFOLIO_SCHOOLS.slice(startIndex, startIndex + count).map((s) => s.id);
}

export const accountManagersSeed: AccountManagerRow[] = [
  {
    id: "am-rania",
    name: "Rania Khalil",
    title: "Senior Account Manager",
    region: "UAE · North",
    territory: "UAE",
    email: "r.khalil@panworld.ae",
    mobile: "+971 50 123 4567",
    visibleToSchools: true,
    openRfqs: 11,
    pipelineAed: "AED 890K",
    assignedSchoolIds: idsRange(0, 38),
  },
  {
    id: "am-omar",
    name: "Omar Hassan",
    title: "Account Manager",
    region: "UAE · Dubai",
    territory: "UAE",
    email: "o.hassan@panworld.ae",
    mobile: "+971 55 987 6543",
    visibleToSchools: true,
    openRfqs: 7,
    pipelineAed: "AED 520K",
    assignedSchoolIds: idsRange(38, 28),
  },
  {
    id: "am-priya",
    name: "Priya Nair",
    title: "Account Manager",
    region: "UAE · Abu Dhabi",
    territory: "UAE",
    email: "p.nair@panworld.ae",
    mobile: "+971 56 111 2233",
    visibleToSchools: true,
    openRfqs: 4,
    pipelineAed: "AED 310K",
    assignedSchoolIds: idsRange(66, 22),
  },
  {
    id: "am-layla",
    name: "Layla Al Mansoori",
    title: "Account Manager",
    region: "KSA · Riyadh",
    territory: "SA",
    email: "l.mansoori@panworld.ae",
    mobile: "+966 50 444 8899",
    visibleToSchools: true,
    openRfqs: 2,
    pipelineAed: "AED 180K",
    assignedSchoolIds: idsRange(88, 14),
  },
];

/** @deprecated use accountManagersSeed — kept for any import compatibility */
export const accountManagers = accountManagersSeed;
