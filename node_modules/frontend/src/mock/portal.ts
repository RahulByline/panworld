import type { CountryCode, UserRole } from "../types/domain";
import { mockProducts, makeMockInvoices, makeMockRfqs, mockTickets } from "./data";

type Rand = () => number;
function mulberry32(seed: number): Rand {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function pick<T>(r: Rand, a: T[]): T {
  return a[Math.floor(r() * a.length)]!;
}
function int(r: Rand, min: number, max: number) {
  return Math.floor(r() * (max - min + 1)) + min;
}
function pad(n: number, len = 5) {
  return String(n).padStart(len, "0");
}

export type Announcement = {
  id: string;
  title: string;
  category: "Product" | "Training" | "Webinar" | "Admin" | "Support";
  pinned: boolean;
  createdAt: string;
  summary: string;
  body: string;
};

export type Contact = {
  id: string;
  name: string;
  title: string;
  type: "ACCOUNT_MANAGER" | "REGIONAL_MANAGER" | "PUBLISHER_REP";
  email?: string;
  phone?: string;
  whatsapp?: string;
  territories: CountryCode[];
};

export type TrainingSeries = {
  id: string;
  publisher: string;
  title: string;
  description: string;
  totalVideos: number;
  progressPct: number;
  tags: string[];
};

export type Webinar = {
  id: string;
  title: string;
  publisher: string;
  startsAt: string;
  durationMin: number;
  registered: boolean;
  mode: "Live" | "Recorded";
};

export type ResourceItem = {
  id: string;
  title: string;
  type: "PDF" | "PPT" | "DOC" | "LINK";
  publisher: string;
  premium: boolean;
  downloads: number;
  tags: string[];
  url: string;
};

export type SampleRequest = {
  id: string;
  requestNo: string;
  productName: string;
  publisher: string;
  qty: number;
  grades?: string;
  subject?: string;
  status: "Submitted" | "Reviewed" | "Approved" | "Dispatched" | "Delivered";
  requestedAt: string;
  expectedBy?: string;
  lastUpdatedAt: string;
  notes?: string;
  timeline: { at: string; status: string }[];
};

export type Certificate = {
  id: string;
  certificateNo: string;
  title: string;
  issuedAt: string;
  verified: boolean;
};

export type Order = {
  id: string;
  orderNo: string;
  status: "Confirmed" | "Processing" | "Dispatched" | "Delivered";
  createdAt: string;
  courier: string;
  trackingNo: string;
  eta: string;
  items: number;
  total: number;
};

export type UserRow = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  active: boolean;
  lastLoginAt: string;
};

export type SyncLog = {
  id: string;
  system: "ODOO";
  direction: "PUSH" | "PULL";
  status: "OK" | "ERROR";
  createdAt: string;
  message: string;
};

const r = mulberry32(20260409);
const publishers = [
  "McGraw Hill",
  "Kodeit Global",
  "StudySync",
  "Achieve3000",
  "PowerSchool",
  "Oxford",
  "Cambridge",
  "Pearson/Savvas",
  "Collins",
  "Jolly Phonics",
];

export function getPortalMock(country: CountryCode) {
  const announcements: Announcement[] = Array.from({ length: 18 }).map((_, i) => {
    const cat = pick(r, ["Product", "Training", "Webinar", "Admin", "Support"] as const);
    const pinned = i < 2;
    const titleBase = pick(r, [
      "New UAE Edition Available",
      "KSA NCC Update",
      "Webinar Registration Open",
      "Training Week",
      "Procurement Notice",
      "Support SLA Improvements",
    ]);
    return {
      id: `ann_${pad(i + 1)}`,
      title: `${titleBase} • ${country} • #${i + 1}`,
      category: cat,
      pinned,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * int(r, 1, 60)).toISOString(),
      summary: "Realistic mock announcement with CTA, audience, and deadlines.",
      body:
        "This is a realistic mock announcement. It contains program updates, key dates, and recommended next actions. " +
        "In production, this would include attachments, deep links, and targeted audiences.",
    };
  });

  const contacts: Contact[] = [
    {
      id: "c_am_1",
      name: country === "KSA" ? "Rana Al Harbi" : "James Mitchell",
      title: "Account Manager",
      type: "ACCOUNT_MANAGER",
      email: country === "KSA" ? "rana@panworld.example" : "james@panworld.example",
      phone: country === "KSA" ? "+966 50 000 0000" : "+971 50 000 0000",
      whatsapp: country === "KSA" ? "+966 50 000 0000" : "+971 50 000 0000",
      territories: [country],
    },
    {
      id: "c_rm_1",
      name: country === "KSA" ? "Fahad Al Nasser" : "Priya Shah",
      title: "Regional Manager",
      type: "REGIONAL_MANAGER",
      email: country === "KSA" ? "fahad@panworld.example" : "priya@panworld.example",
      phone: country === "KSA" ? "+966 55 000 0000" : "+971 55 000 0000",
      whatsapp: country === "KSA" ? "+966 55 000 0000" : "+971 55 000 0000",
      territories: [country],
    },
  ];

  // add a few publisher reps
  for (let i = 0; i < 6; i++) {
    const pub = pick(r, publishers);
    contacts.push({
      id: `c_pub_${i + 1}`,
      name: `${pub} Rep ${i + 1}`,
      title: "Publisher Representative",
      type: "PUBLISHER_REP",
      email: `rep${i + 1}@${pub.toLowerCase().replaceAll(" ", "").slice(0, 10)}.example`,
      whatsapp: country === "KSA" ? "+966 56 000 0000" : "+971 56 000 0000",
      territories: [country],
    });
  }

  const training: TrainingSeries[] = Array.from({ length: 20 }).map((_, i) => {
    const pub = pick(r, publishers);
    return {
      id: `tr_${pad(i + 1)}`,
      publisher: pub,
      title: `${pub} Implementation Series ${i + 1}`,
      description: "Structured onboarding series with modules, chapter markers, and completion certificates.",
      totalVideos: int(r, 3, 7),
      progressPct: int(r, 0, 100),
      tags: country === "KSA" ? ["NCC", "KSA rollout"] : ["UAE rollout", "School onboarding"],
    };
  });

  const webinars: Webinar[] = Array.from({ length: 12 }).map((_, i) => {
    const pub = pick(r, publishers);
    const starts = new Date(Date.now() + 1000 * 60 * 60 * 24 * int(r, -20, 45));
    const mode = starts.getTime() < Date.now() ? "Recorded" : "Live";
    return {
      id: `w_${pad(i + 1)}`,
      title: `${pub} Webinar: ${pick(r, ["Differentiation", "Assessment Readiness", "Leadership Rollout", "Data & Reports"])} ${i + 1}`,
      publisher: pub,
      startsAt: starts.toISOString(),
      durationMin: pick(r, [45, 60, 75]),
      registered: r() < 0.35,
      mode,
    };
  });

  const resources: ResourceItem[] = Array.from({ length: 20 }).map((_, i) => {
    const pub = pick(r, publishers);
    const type = pick(r, ["PDF", "PPT", "DOC", "LINK"] as const);
    const title = `Resource Pack ${i + 1}: ${pick(r, ["Lesson Plans", "Assessment Guide", "Admin Checklist", "Rubrics", "Parent Letter"])}`;
    return {
      id: `res_${pad(i + 1)}`,
      title,
      type,
      publisher: pub,
      premium: r() < 0.28,
      downloads: int(r, 20, 420),
      tags: [country, pick(r, ["English", "Math", "Science", "Arabic"])],
      url: `/demo-docs/viewer.html?type=${encodeURIComponent(type)}&title=${encodeURIComponent(title)}&publisher=${encodeURIComponent(pub)}`,
    };
  });

  const samples: SampleRequest[] = Array.from({ length: 25 }).map((_, i) => {
    const p = pick(
      r,
      mockProducts.filter((x) => (country ? x.countryRelevance.includes(country) : true)).filter((x) => x.type !== "UNIFORM"),
    );
    const statuses: SampleRequest["status"][] = ["Submitted", "Reviewed", "Approved", "Dispatched", "Delivered"];
    const status: SampleRequest["status"] = pick(r, statuses);
    const base = new Date(Date.now() - 1000 * 60 * 60 * 24 * int(r, 1, 90));
    const qty = int(r, 1, 6);
    const requestNo = `SR-2026-${pad(i + 1, 6)}`;
    const submittedAt = new Date(base.getTime());
    const reviewedAt = new Date(base.getTime() + 1000 * 60 * 60 * 24 * int(r, 2, 6));
    const approvedAt = new Date(reviewedAt.getTime() + 1000 * 60 * 60 * 24 * int(r, 2, 6));
    const dispatchedAt = new Date(approvedAt.getTime() + 1000 * 60 * 60 * 24 * int(r, 2, 8));
    const deliveredAt = new Date(dispatchedAt.getTime() + 1000 * 60 * 60 * 24 * int(r, 2, 10));

    const byStatus: Record<SampleRequest["status"], { at: Date; status: SampleRequest["status"] }[]> = {
      Submitted: [{ at: submittedAt, status: "Submitted" }],
      Reviewed: [
        { at: submittedAt, status: "Submitted" },
        { at: reviewedAt, status: "Reviewed" },
      ],
      Approved: [
        { at: submittedAt, status: "Submitted" },
        { at: reviewedAt, status: "Reviewed" },
        { at: approvedAt, status: "Approved" },
      ],
      Dispatched: [
        { at: submittedAt, status: "Submitted" },
        { at: reviewedAt, status: "Reviewed" },
        { at: approvedAt, status: "Approved" },
        { at: dispatchedAt, status: "Dispatched" },
      ],
      Delivered: [
        { at: submittedAt, status: "Submitted" },
        { at: reviewedAt, status: "Reviewed" },
        { at: approvedAt, status: "Approved" },
        { at: dispatchedAt, status: "Dispatched" },
        { at: deliveredAt, status: "Delivered" },
      ],
    };

    const timeline = byStatus[status].map((t) => ({ at: t.at.toISOString(), status: t.status }));
    const lastUpdatedAt = timeline[timeline.length - 1]!.at;
    const expectedBy =
      status === "Delivered"
        ? timeline[timeline.length - 1]!.at
        : status === "Dispatched"
          ? deliveredAt.toISOString()
          : status === "Approved"
            ? dispatchedAt.toISOString()
            : undefined;

    const notes =
      r() < 0.55
        ? pick(r, [
            "Please include teacher guide if available.",
            "Deliver to reception between 9am–2pm.",
            "Urgent for upcoming lesson observation.",
            "Need Arabic + English versions if possible.",
            "Requesting latest edition only.",
          ])
        : undefined;
    return {
      id: `samp_${pad(i + 1)}`,
      requestNo,
      productName: p.name,
      publisher: p.publisher,
      qty,
      grades: p.grades,
      subject: p.subject,
      status,
      requestedAt: base.toISOString(),
      expectedBy,
      lastUpdatedAt,
      notes,
      timeline,
    };
  });

  const certificates: Certificate[] = Array.from({ length: 50 }).map((_, i) => ({
    id: `cert_${pad(i + 1)}`,
    certificateNo: `CERT-2026-${pad(i + 1, 6)}`,
    title: pick(r, ["Product Implementation", "Assessment Readiness", "Data & Reporting", "Leadership Rollout"]),
    issuedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * int(r, 1, 220)).toISOString(),
    verified: r() < 0.9,
  }));

  const orders: Order[] = Array.from({ length: 35 }).map((_, i) => {
    const createdAt = new Date(Date.now() - 1000 * 60 * 60 * 24 * int(r, 1, 180));
    const courier = pick(r, ["Aramex", "DHL", "SMSA", "Fetchr"]);
    const status = pick(r, ["Confirmed", "Processing", "Dispatched", "Delivered"] as const);
    const total = int(r, 18000, 160000);
    return {
      id: `ord_${pad(i + 1)}`,
      orderNo: `SO-2026-${pad(i + 1, 6)}`,
      status,
      createdAt: createdAt.toISOString(),
      courier,
      trackingNo: `TRK-${int(r, 10000000, 99999999)}`,
      eta: new Date(createdAt.getTime() + 1000 * 60 * 60 * 24 * int(r, 5, 20)).toISOString(),
      items: int(r, 2, 8),
      total,
    };
  });

  const users: UserRow[] = Array.from({ length: 26 }).map((_, i) => {
    const role = pick(
      r,
      ["TEACHER", "TEACHER", "TEACHER", "HOD", "MANAGEMENT", "CEO", "PROCUREMENT"] as const,
    );
    return {
      id: `u_${pad(i + 1)}`,
      name: `${pick(r, ["Aisha", "Omar", "Sara", "Khalid", "Noor", "Yousef", "Mariam"])} ${pick(r, ["Al Ali", "Hassan", "Khan", "Smith", "Patel", "Al Harbi"])}`,
      email: `user${pad(i + 1)}@school-demo.com`,
      role,
      department: role === "TEACHER" || role === "HOD" ? pick(r, ["English", "Math", "Science", "Arabic", "ICT"]) : undefined,
      active: r() < 0.92,
      lastLoginAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * int(r, 0, 25)).toISOString(),
    };
  });

  const syncLogs: SyncLog[] = Array.from({ length: 20 }).map((_, i) => ({
    id: `sync_${pad(i + 1)}`,
    system: "ODOO",
    direction: pick(r, ["PUSH", "PULL"] as const),
    status: r() < 0.85 ? "OK" : "ERROR",
    createdAt: new Date(Date.now() - 1000 * 60 * 30 * int(r, 1, 400)).toISOString(),
    message: pick(r, ["Sync run completed.", "Delta pull applied.", "Retry scheduled after transient failure.", "Payload validation warning."]),
  }));

  const rfqs = rfqsForCountry(country);
  const invoices = invoicesForCountry(country);

  return {
    announcements,
    contacts,
    training,
    webinars,
    resources,
    samples,
    certificates,
    orders,
    users,
    syncLogs,
    rfqs,
    invoices,
    tickets: mockTickets,
  };
}

function rfqsForCountry(country: CountryCode) {
  return makeMockRfqs(country);
}

function invoicesForCountry(country: CountryCode) {
  return makeMockInvoices(country);
}

