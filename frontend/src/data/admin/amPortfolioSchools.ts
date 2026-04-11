/** Schools that can be assigned to an account manager’s portfolio (UI mock). */

export type PortfolioSchool = {
  id: string;
  name: string;
  country: string;
};

const BASE_NAMES = [
  "Al Noor International School",
  "GEMS Wellington International",
  "King Faisal International",
  "Taaleem Brighton College",
  "Dubai British School",
  "Abu Dhabi International",
  "Sharjah American School",
  "Ajman Academy",
  "Riyadh International School",
  "Jeddah Learning Hub",
  "Greenwood International",
  "Redhill Elementary",
  "SABIS Dubai",
  "Aldar Academy",
  "British School Al Khubairat",
  "Repton Dubai",
  "Dubai College",
  "American School of Dubai",
  "GEMS Dubai American Academy",
  "Kingdom School Riyadh",
];

function buildList(): PortfolioSchool[] {
  const out: PortfolioSchool[] = [];
  let i = 0;
  for (const n of BASE_NAMES) {
    i += 1;
    out.push({
      id: `sch-${i}`,
      name: n,
      country: n.includes("Riyadh") || n.includes("Jeddah") || n.includes("Kingdom") ? "KSA" : "UAE",
    });
  }
  for (let k = 0; k < 95; k++) {
    i += 1;
    const uae = k % 5 !== 0;
    out.push({
      id: `sch-${i}`,
      name: uae ? `Partner School ${k + 1} — UAE` : `Partner School ${k + 1} — KSA`,
      country: uae ? "UAE" : "KSA",
    });
  }
  return out;
}

export const AM_PORTFOLIO_SCHOOLS: PortfolioSchool[] = buildList();

export function portfolioSchoolById(id: string): PortfolioSchool | undefined {
  return AM_PORTFOLIO_SCHOOLS.find((s) => s.id === id);
}
