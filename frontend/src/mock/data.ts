import type { CountryCode } from "../types/domain";

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

export type MockProductLineItem = {
  id: string;
  title: string;
  gradeLabel: string;
  isbn?: string;
  price: number;
};

export type MockProduct = {
  id: string;
  sku: string;
  name: string;
  type: "TEXTBOOK" | "LIBRARY" | "KIT" | "RESOURCE" | "UNIFORM";
  publisher: string;
  grades?: string;
  subject?: string;
  curriculum?: string;
  format: string;
  edition: string;
  countryRelevance: CountryCode[];
  nccApproved: boolean;
  price: number;
  /** Series / folder: per-grade SKUs (demo) */
  lineItems?: MockProductLineItem[];
  folderAccess?: {
    passwordProtected: boolean;
    /** School licence expired — show request access (demo) */
    accessExpired?: boolean;
  };
};

export type MockRfq = {
  id: string;
  rfqNo: string;
  status: "SUBMITTED" | "REVIEWED" | "QUOTED" | "APPROVED" | "ORDERED" | "DELIVERED";
  createdAt: string;
  items: { productName: string; qty: number; unitPrice: number }[];
  subtotal: number;
  vat: number;
  total: number;
};

export type MockInvoice = {
  id: string;
  invoiceNo: string;
  status: "OUTSTANDING" | "PAID";
  issuedAt: string;
  dueAt: string;
  subtotal: number;
  vat: number;
  total: number;
};

export type MockTicket = {
  id: string;
  subject: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  createdAt: string;
  lastUpdateAt: string;
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
const subjects = ["English", "Math", "Science", "Arabic", "ICT", "Social Studies"];
const curricula = ["American", "British", "IB", "UAE MOE", "Saudi NCC", "Mixed"];
const formats = ["Print", "Digital", "Print+Digital", "Physical"];
const editionsUAE = ["UAE Edition 2025", "GCC Edition 2024"];
const editionsKSA = ["KSA Edition 2025", "NCC Edition 2024"];

const generatedMockProducts: MockProduct[] = Array.from({ length: 145 }).map((_, i) => {
  const type = pick(r, ["TEXTBOOK", "TEXTBOOK", "TEXTBOOK", "LIBRARY", "KIT", "RESOURCE", "UNIFORM"] as const);
  const pub = pick(r, publishers);
  const gradeMin = int(r, 1, 10);
  const gradeMax = Math.min(12, gradeMin + int(r, 0, 3));
  const ksaFav = r() < 0.45;
  const edition = ksaFav ? pick(r, editionsKSA) : pick(r, editionsUAE);
  const nccApproved = edition.includes("NCC") || (ksaFav && r() < 0.55);
  const subject = pick(r, subjects);
  return {
    id: `p_${pad(i + 1)}`,
    sku: `PW-${type.slice(0, 3)}-${10000 + i}`,
    name:
      type === "LIBRARY"
        ? `${pick(r, ["The Hidden Door", "Moonlight Tales", "Desert Stars", "Ocean Secrets", "The Silver Fox"])}`
        : type === "KIT"
          ? `${subject} Classroom Kit — Grade ${gradeMin}`
          : type === "UNIFORM"
            ? `${pick(r, ["PE Uniform", "School Polo", "Winter Jacket", "Sports Kit"])}`
            : `${pick(r, ["Core", "Mastery", "Foundations", "Excellence", "Skills"])} ${subject} — Grade ${gradeMin}`,
    type,
    publisher: pub,
    grades: type === "UNIFORM" ? undefined : `${gradeMin}–${gradeMax}`,
    subject: type === "UNIFORM" ? undefined : subject,
    curriculum: pick(r, curricula),
    format: type === "KIT" || type === "UNIFORM" ? "Physical" : pick(r, formats),
    edition,
    countryRelevance: ksaFav ? ["KSA", "UAE"] : ["UAE", "KSA"],
    nccApproved,
    price: int(r, 35, type === "KIT" ? 950 : 180) + Math.round(r() * 99) / 100,
  };
});

/** Demo: folder with per-item pricing — open from school catalogue via direct link */
const demoFolderProducts: MockProduct[] = [
  {
    id: "p_inspire_series",
    sku: "PW-TB-INSPIRE-FOLDER",
    name: "Inspire Science G1–G8",
    type: "TEXTBOOK",
    publisher: "McGraw Hill",
    grades: "G1–G8",
    subject: "Science",
    curriculum: "American",
    format: "Blended",
    edition: "2025 UAE Edition",
    countryRelevance: ["UAE", "KSA"],
    nccApproved: true,
    price: 89,
    lineItems: Array.from({ length: 8 }, (_, i) => ({
      id: `p_inspire_series_g${i + 1}`,
      title: `Inspire Science — Grade ${i + 1} (Student)`,
      gradeLabel: `G${i + 1}`,
      isbn: `978-1-265-${String(12000 + i).padStart(5, "0")}-X`,
      price: 85 + i * 2,
    })),
    folderAccess: {
      passwordProtected: true,
      accessExpired: true,
    },
  },
];

export const mockProducts: MockProduct[] = [...generatedMockProducts, ...demoFolderProducts];

export function makeMockRfqs(country: CountryCode) {
  const vatRate = country === "KSA" ? 0.15 : 0.05;
  const list: MockRfq[] = [];
  for (let i = 0; i < 25; i++) {
    const status = pick(r, ["SUBMITTED", "REVIEWED", "QUOTED", "APPROVED", "ORDERED", "DELIVERED"] as const);
    const items = Array.from({ length: int(r, 2, 7) }).map(() => {
      const p = pick(r, mockProducts.filter((x) => x.type !== "UNIFORM"));
      const qty = int(r, 10, 180);
      const unitPrice = Math.round(p.price * 100) / 100;
      return { productName: p.name, qty, unitPrice };
    });
    const subtotal = items.reduce((s, it) => s + it.qty * it.unitPrice, 0);
    const vat = subtotal * vatRate;
    const total = subtotal + vat;
    list.push({
      id: `rfq_${pad(i + 1)}`,
      rfqNo: `RFQ-2026-${pad(i + 1, 6)}`,
      status,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * int(r, 1, 120)).toISOString(),
      items,
      subtotal,
      vat,
      total,
    });
  }
  return list;
}

export function makeMockInvoices(country: CountryCode) {
  const vatRate = country === "KSA" ? 0.15 : 0.05;
  return Array.from({ length: 40 }).map((_, i) => {
    const subtotal = int(r, 18000, 140000);
    const vat = subtotal * vatRate;
    const total = subtotal + vat;
    return {
      id: `inv_${pad(i + 1)}`,
      invoiceNo: `INV-2026-${pad(i + 1, 6)}`,
      status: r() < 0.45 ? "PAID" : "OUTSTANDING",
      issuedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * int(r, 2, 180)).toISOString(),
      dueAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * int(r, 5, 60)).toISOString(),
      subtotal,
      vat,
      total,
    } as MockInvoice;
  });
}

export const mockTickets: MockTicket[] = Array.from({ length: 30 }).map((_, i) => ({
  id: `t_${pad(i + 1)}`,
  subject: `${pick(r, ["Login issue", "Training access", "Demo credentials", "Invoice question", "Assessment launch"])} #${i + 1}`,
  status: pick(r, ["OPEN", "IN_PROGRESS", "RESOLVED"] as const),
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * int(r, 1, 60)).toISOString(),
  lastUpdateAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * int(r, 0, 14)).toISOString(),
}));

