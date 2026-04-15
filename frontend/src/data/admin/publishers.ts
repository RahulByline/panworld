export type PublisherPartnerRow = {
  id: string;
  name: string;
  territory: string;
  contact: string;
  activeSchools: number;
  status: "Active" | "Onboarding" | "Paused";
  /** Data URL, HTTPS URL, or CMS path */
  logoUrl?: string;
  website?: string;
  phone?: string;
  description?: string;
  /** Short line on key programmes / grades */
  productsFocus?: string;
  partnerSince?: string;
  /** Primary brand / logo color (hex or CSS color) — drives card border and left panel tint. */
  brandAccent?: string;
};

/** Fallback accent when `brandAccent` is not set (stable per id). */
export function resolvePublisherBrandAccent(row: Pick<PublisherPartnerRow, "id" | "brandAccent">): string {
  if (row.brandAccent?.trim()) return row.brandAccent.trim();
  let h = 0;
  for (let i = 0; i < row.id.length; i++) h = row.id.charCodeAt(i) + ((h << 5) - h);
  const hue = Math.abs(h) % 360;
  return `hsl(${hue} 48% 42%)`;
}

export function publisherInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2 && parts[0][0] && parts[1][0]) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  const t = name.trim();
  if (t.length >= 2) return t.slice(0, 2).toUpperCase();
  return (t[0] ?? "?").toUpperCase();
}

/** Shared territory presets reused across admin forms/filters. */
export const globalTerritoryOptions = [
  "UAE",
  "Saudi Arabia",
  "KSA",
  "GCC",
  "MEA",
  "Qatar",
  "Oman",
  "Kuwait",
  "Bahrain",
  "Egypt",
  "Jordan",
  "USA",
] as const;

function makePublisherLogoDataUrl(name: string, accent: string): string {
  const initials = publisherInitials(name);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='320' height='180' viewBox='0 0 320 180'>
    <defs>
      <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='white'/>
        <stop offset='100%' stop-color='${accent}' stop-opacity='0.16'/>
      </linearGradient>
    </defs>
    <rect width='320' height='180' fill='url(#g)'/>
    <rect x='104' y='46' width='112' height='88' rx='14' fill='white' stroke='${accent}' stroke-opacity='0.35'/>
    <text x='160' y='99' text-anchor='middle' dominant-baseline='middle' font-size='38' font-family='Inter, Arial, sans-serif' font-weight='700' fill='${accent}'>${initials}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const publisherPartners: PublisherPartnerRow[] = [
  {
    id: "pub-mh",
    name: "McGraw Hill",
    territory: "MEA · K–12",
    contact: "mea.partners@mcgrawhill.com",
    activeSchools: 58,
    status: "Active",
    logoUrl: makePublisherLogoDataUrl("McGraw Hill", "#E31837"),
    website: "https://www.mheducation.com",
    phone: "+971 4 000 0000",
    description:
      "Leading K–12 and higher-ed publisher for American curriculum schools across the Middle East. Portal access covers ConnectED, StudySync integrations, and science/math catalogues.",
    productsFocus: "ConnectED, Reveal Math, Inspire Science, Wonders, StudySync (regional)",
    partnerSince: "2019",
    brandAccent: "#E31837",
  },
  {
    id: "pub-kodeit",
    name: "Kodeit",
    territory: "GCC · K–12",
    contact: "schools@kodeit.com",
    activeSchools: 42,
    status: "Active",
    logoUrl: makePublisherLogoDataUrl("Kodeit", "#5E35B1"),
    website: "https://kodeit.com",
    phone: "+971 2 000 0000",
    description:
      "Panworld partner for social sciences, ICT, and KG resources. Digital-first delivery with school-specific provisioning where required.",
    productsFocus: "Social Sciences, ICT, KG bundles",
    partnerSince: "2021",
    brandAccent: "#5E35B1",
  },
  {
    id: "pub-ss",
    name: "StudySync",
    territory: "GCC · G6–G12",
    contact: "gcc@studysync.com",
    activeSchools: 31,
    status: "Active",
    logoUrl: makePublisherLogoDataUrl("StudySync", "#1565C0"),
    website: "https://www.studysync.com",
    description: "ELA core and supplemental literacy for middle and high school. Often bundled with McGraw Hill contracts in region.",
    productsFocus: "ELA G6–G12, assessments",
    partnerSince: "2020",
    brandAccent: "#1565C0",
  },
  {
    id: "pub-jp",
    name: "Jolly Phonics",
    territory: "UAE · Early years",
    contact: "export@jollylearning.co.uk",
    activeSchools: 12,
    status: "Onboarding",
    logoUrl: makePublisherLogoDataUrl("Jolly Phonics", "#F57C00"),
    website: "https://jollylearning.co.uk",
    description: "Phonics and early literacy programme for FS and lower primary. Onboarding new schools for the 2026 academic year.",
    productsFocus: "Jolly Phonics, Jolly Grammar",
    partnerSince: "2025",
    brandAccent: "#F57C00",
  },
  {
    id: "pub-a3k",
    name: "Achieve3000",
    territory: "MEA · Literacy",
    contact: "partners@achieve3000.com",
    activeSchools: 24,
    status: "Paused",
    logoUrl: makePublisherLogoDataUrl("Achieve3000", "#00A3E0"),
    website: "https://www.achieve3000.com",
    description:
      "Differentiated literacy platform. Partnership paused pending renewed commercial terms; existing licences honoured until renewal window.",
    productsFocus: "Achieve3000 Literacy, ELA interventions",
    partnerSince: "2018",
    brandAccent: "#00A3E0",
  },
];
