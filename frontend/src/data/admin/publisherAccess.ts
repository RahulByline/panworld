export type PublisherAccessCardIconId = "mcgraw" | "kodeit" | "studysync" | "achieve" | "default";

/** A school that has been granted this demo / publisher access, with validity window. */
export type PublisherAccessSchoolShare = {
  schoolId: string;
  schoolName: string;
  /** Optional logo URL (CMS upload or school profile). */
  logoUrl?: string;
  territory: string;
  validFrom: string;
  validUntil: string;
  accessStatus: "active" | "expiring" | "expired";
  /**
   * When `false`, access is turned off by an admin for this school, even if valid-until is still in the future.
   * Omit or `true` → access follows the validity window and status above.
   */
  accessEnabled?: boolean;
};

/** Two-letter initials for list avatars when no image loads. */
export function schoolShareInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2 && parts[0][0] && parts[1][0]) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  if (name.trim().length >= 2) return name.trim().slice(0, 2).toUpperCase();
  return (name.trim()[0] ?? "?").toUpperCase();
}

/** Stable gradient colors for initials fallback (from school id). */
export function schoolShareAvatarPalette(schoolId: string): { from: string; to: string; text: string } {
  let h = 0;
  for (let i = 0; i < schoolId.length; i++) h = schoolId.charCodeAt(i) + ((h << 5) - h);
  const hue = Math.abs(h) % 360;
  return {
    from: `hsl(${hue} 42% 92%)`,
    to: `hsl(${hue} 48% 80%)`,
    text: `hsl(${hue} 38% 26%)`,
  };
}

function demoSchoolLogoUrl(schoolName: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(schoolName)}&size=128&background=0A3D62&color=ffffff&bold=true`;
}

export type PublisherAccessRow = {
  id: string;
  title: string;
  subtitle?: string;
  type: "Static" | "School-specific";
  accessLine: string;
  accesses30d: number;
  lastTested: string;
  lastTone: "ok" | "warn" | "expired";
  action: "test" | "pending" | "renew";
  pendingCount?: number;
  /** Highlight card (e.g. Panworld-owned publisher). */
  ourBrand?: boolean;
  cardIcon: PublisherAccessCardIconId;
  /** Publisher logo (CMS upload or CDN). Shown on the demo access card; omit to use default book icon. */
  publisherLogoUrl?: string;
  /** Schools this credential is shared with (demo CMS). */
  schoolShares: PublisherAccessSchoolShare[];
  /** Card stat: short validity summary (e.g. days left figure). */
  validityStat?: string;
  /** When false, this demo credential is off for all schools until re-enabled. */
  credentialEnabled?: boolean;
};

/** Lowercase string for client-side search (title, subtitle, credentials, type, id). */
export function publisherAccessHaystack(row: PublisherAccessRow): string {
  const schoolHay = row.schoolShares.map((s) => `${s.schoolName} ${s.territory}`).join(" ");
  return [
    row.title,
    row.subtitle ?? "",
    row.accessLine,
    row.type,
    row.id,
    row.cardIcon,
    row.publisherLogoUrl ?? "",
    String(row.accesses30d),
    schoolHay,
  ]
    .join(" ")
    .toLowerCase();
}

export const publisherAccessRows: PublisherAccessRow[] = [
  {
    id: "pa-mcgraw",
    title: "McGraw Hill ConnectED",
    subtitle: "Inspire Science, Reveal Math, Wonders",
    type: "Static",
    accessLine: "access@mcgraw.com / PanAccess25!",
    accesses30d: 128,
    lastTested: "8 Apr 2026",
    lastTone: "ok",
    action: "test",
    cardIcon: "mcgraw",
    publisherLogoUrl: "https://logo.clearbit.com/mheducation.com",
    validityStat: "142",
    schoolShares: [
      {
        schoolId: "sch-gems-wellington",
        schoolName: "GEMS Wellington International",
        logoUrl: demoSchoolLogoUrl("GEMS Wellington International"),
        territory: "UAE",
        validFrom: "1 Sept 2025",
        validUntil: "31 Aug 2026",
        accessStatus: "active",
      },
      {
        schoolId: "sch-al-noor",
        schoolName: "Al Noor International School",
        logoUrl: demoSchoolLogoUrl("Al Noor International School"),
        territory: "UAE",
        validFrom: "15 Jan 2026",
        validUntil: "15 Jan 2027",
        accessStatus: "active",
      },
      {
        schoolId: "sch-king-faisal",
        schoolName: "King Faisal International School",
        logoUrl: demoSchoolLogoUrl("King Faisal International School"),
        territory: "KSA",
        validFrom: "1 Mar 2026",
        validUntil: "30 Jun 2026",
        accessStatus: "expiring",
        accessEnabled: false,
      },
    ],
  },
  {
    id: "pa-kodeit",
    title: "Kodeit Platform",
    subtitle: "Social Sciences, KG, ICT",
    type: "Static",
    accessLine: "kodeit-access / KodeitPan2026",
    accesses30d: 45,
    lastTested: "7 Apr 2026",
    lastTone: "ok",
    action: "test",
    ourBrand: true,
    cardIcon: "kodeit",
    publisherLogoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent("Kodeit")}&size=128&background=EDE7F6&color=5E35B1&bold=true`,
    validityStat: "186",
    schoolShares: [
      {
        schoolId: "sch-taaleem",
        schoolName: "Taaleem Brighton College",
        logoUrl: demoSchoolLogoUrl("Taaleem Brighton College"),
        territory: "UAE",
        validFrom: "10 Oct 2025",
        validUntil: "10 Oct 2026",
        accessStatus: "active",
      },
      {
        schoolId: "sch-aldar",
        schoolName: "Aldar Academy",
        logoUrl: demoSchoolLogoUrl("Aldar Academy"),
        territory: "UAE",
        validFrom: "5 Feb 2026",
        validUntil: "5 Aug 2026",
        accessStatus: "expiring",
      },
    ],
  },
  {
    id: "pa-studysync",
    title: "StudySync",
    subtitle: "School-specific provisioning",
    type: "School-specific",
    accessLine: "Provisioned within 24hrs of request",
    accesses30d: 84,
    lastTested: "9 Apr 2026",
    lastTone: "ok",
    action: "pending",
    pendingCount: 3,
    cardIcon: "studysync",
    publisherLogoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent("StudySync")}&size=128&background=f1f5f9&color=0A3D62&bold=true`,
    validityStat: "—",
    schoolShares: [
      {
        schoolId: "sch-sabis",
        schoolName: "SABIS Dubai",
        logoUrl: demoSchoolLogoUrl("SABIS Dubai"),
        territory: "UAE",
        validFrom: "12 Jan 2026",
        validUntil: "12 Jan 2027",
        accessStatus: "active",
      },
      {
        schoolId: "sch-nord",
        schoolName: "Nord Anglia International",
        logoUrl: demoSchoolLogoUrl("Nord Anglia International"),
        territory: "UAE",
        validFrom: "3 Mar 2026",
        validUntil: "1 Sept 2026",
        accessStatus: "active",
      },
    ],
  },
  {
    id: "pa-achieve",
    title: "Achieve3000",
    type: "Static",
    accessLine: "achieve-pan / Achieve3000!",
    accesses30d: 62,
    lastTested: "Expired 5 Apr",
    lastTone: "expired",
    action: "renew",
    cardIcon: "achieve",
    publisherLogoUrl: "https://logo.clearbit.com/achieve3000.com",
    validityStat: "0",
    schoolShares: [
      {
        schoolId: "sch-gems-wellington",
        schoolName: "GEMS Wellington International",
        logoUrl: demoSchoolLogoUrl("GEMS Wellington International"),
        territory: "UAE",
        validFrom: "1 Sept 2024",
        validUntil: "5 Apr 2026",
        accessStatus: "expired",
      },
      {
        schoolId: "sch-ajman",
        schoolName: "Ajman Academy",
        logoUrl: demoSchoolLogoUrl("Ajman Academy"),
        territory: "UAE",
        validFrom: "1 Jan 2025",
        validUntil: "28 Feb 2026",
        accessStatus: "expired",
      },
    ],
  },
];
