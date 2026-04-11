export type OrderOdooState = "synced" | "error";

export type AdminOrderListRow = {
  id: string;
  school: string;
  productsSummary: string;
  value: string;
  status: string;
  tracking?: string;
  expectedDelivery: string;
  odoo: OrderOdooState;
};

export type OrderLineItem = {
  product: string;
  publisher: string;
  qty: string;
  unitPrice: string;
  subtotal: string;
};

export type OrderTimelineStep = {
  date: string;
  text: string;
};

export type AdminOrderDetail = {
  id: string;
  school: string;
  schoolSub: string;
  orderValue: string;
  statusLabel: string;
  lineItems: OrderLineItem[];
  rfqRef: string;
  invoiceId: string;
  invoicePaid: boolean;
  accountManager: string;
  odooSynced: boolean;
  odooSoId: string;
  timeline: OrderTimelineStep[];
  adminNotes: string;
};

export const adminOrdersList: AdminOrderListRow[] = [
  {
    id: "ORD-2026-1142",
    school: "GEMS Wellington",
    productsSummary: "Inspire Science G1–G4 (240 sets)",
    value: "AED 156,000",
    status: "Delivered",
    tracking: "Aramex #7891234",
    expectedDelivery: "5 Apr 2026 ✓",
    odoo: "synced",
  },
  {
    id: "ORD-2026-1138",
    school: "Al Noor International",
    productsSummary: "Reveal Math G3–G8 (180 sets)",
    value: "AED 98,500",
    status: "Dispatched",
    tracking: "Aramex #7891108",
    expectedDelivery: "13 Apr 2026",
    odoo: "synced",
  },
  {
    id: "ORD-2026-1135",
    school: "Taaleem Brighton",
    productsSummary: "Wonders ELA KG–G5 (300 sets)",
    value: "AED 89,000",
    status: "Processing",
    expectedDelivery: "16 Apr 2026",
    odoo: "synced",
  },
  {
    id: "ORD-2026-1130",
    school: "King Faisal Intl",
    productsSummary: "Kodeit SS G1–G12 (1,200 sets)",
    value: "SAR 210,000",
    status: "Partial Delivery",
    tracking: "Aramex #7890845",
    expectedDelivery: "Remaining: 18 Apr",
    odoo: "error",
  },
];

const detail1142: AdminOrderDetail = {
  id: "ORD-2026-1142",
  school: "GEMS Wellington International",
  schoolSub: "Dubai, UAE · British",
  orderValue: "AED 156,000",
  statusLabel: "Delivered",
  lineItems: [
    { product: "Inspire Science G1–G2", publisher: "McGraw Hill", qty: "80 sets", unitPrice: "AED 89", subtotal: "AED 7,120" },
    { product: "Inspire Science G3–G4", publisher: "McGraw Hill", qty: "80 sets", unitPrice: "AED 89", subtotal: "AED 7,120" },
    { product: "ConnectED Digital Licences", publisher: "McGraw Hill", qty: "240 licences", unitPrice: "AED 120", subtotal: "AED 28,800" },
    { product: "Science Lab Kit G1–G4", publisher: "McGraw Hill", qty: "24 kits", unitPrice: "AED 480", subtotal: "AED 11,520" },
  ],
  rfqRef: "#PW-2026-060",
  invoiceId: "INV-2026-0892",
  invoicePaid: true,
  accountManager: "Rania Khalil",
  odooSynced: true,
  odooSoId: "SO-2026-1142",
  timeline: [
    { date: "28 Mar", text: "Order confirmed" },
    { date: "1 Apr", text: "In warehouse — packing" },
    { date: "3 Apr", text: "Dispatched — Aramex #7891234" },
    { date: "5 Apr", text: "Delivered to GEMS Wellington · Signed: Admin Office" },
  ],
  adminNotes: "Large order — delivered on time. School confirmed receipt of all items.",
};

const detail1138: AdminOrderDetail = {
  ...detail1142,
  id: "ORD-2026-1138",
  school: "Al Noor International School",
  schoolSub: "Dubai, UAE · American",
  orderValue: "AED 98,500",
  statusLabel: "Dispatched",
  lineItems: [
    { product: "Reveal Math G3–G5", publisher: "McGraw Hill", qty: "120 sets", unitPrice: "AED 95", subtotal: "AED 11,400" },
    { product: "Reveal Math G6–G8", publisher: "McGraw Hill", qty: "60 sets", unitPrice: "AED 98", subtotal: "AED 5,880" },
  ],
  rfqRef: "#PW-2026-055",
  invoiceId: "INV-2026-0880",
  invoicePaid: false,
  timeline: [
    { date: "5 Apr", text: "Order confirmed" },
    { date: "7 Apr", text: "Picking in warehouse" },
    { date: "8 Apr", text: "Dispatched — Aramex #7891108" },
  ],
  adminNotes: "",
};

const detail1135: AdminOrderDetail = {
  ...detail1142,
  id: "ORD-2026-1135",
  school: "Taaleem Brighton",
  schoolSub: "Abu Dhabi, UAE · British",
  orderValue: "AED 89,000",
  statusLabel: "Processing",
  lineItems: [
    { product: "Wonders ELA KG–G5", publisher: "McGraw Hill", qty: "300 sets", unitPrice: "AED 120", subtotal: "AED 36,000" },
  ],
  rfqRef: "#PW-2026-071",
  invoiceId: "—",
  invoicePaid: false,
  odooSoId: "SO-2026-1135",
  timeline: [
    { date: "10 Apr", text: "Order confirmed" },
    { date: "11 Apr", text: "Awaiting stock allocation" },
  ],
  adminNotes: "School requested consolidated shipment.",
};

const detail1130: AdminOrderDetail = {
  ...detail1142,
  id: "ORD-2026-1130",
  school: "King Faisal International School",
  schoolSub: "Riyadh, KSA · American",
  orderValue: "SAR 210,000",
  statusLabel: "Partial Delivery",
  lineItems: [
    { product: "Kodeit Social Sciences G1–G6", publisher: "Kodeit", qty: "600 sets", unitPrice: "SAR 95", subtotal: "SAR 57,000" },
    { product: "Kodeit Social Sciences G7–G12", publisher: "Kodeit", qty: "600 sets", unitPrice: "SAR 102", subtotal: "SAR 61,200" },
  ],
  rfqRef: "#PW-2026-048",
  invoiceId: "INV-2026-0871",
  invoicePaid: false,
  odooSynced: false,
  odooSoId: "SO-2026-1130",
  timeline: [
    { date: "28 Mar", text: "Order confirmed" },
    { date: "30 Mar", text: "Partial dispatch — batch 1" },
    { date: "2 Apr", text: "Aramex #7890845 — 720 sets delivered" },
    { date: "Pending", text: "Remaining quantities — sync error blocking Odoo update" },
  ],
  adminNotes: "Retry sync after KSA VAT line fix.",
};

const orderDetailsById: Record<string, AdminOrderDetail> = {
  "ORD-2026-1142": detail1142,
  "ORD-2026-1138": detail1138,
  "ORD-2026-1135": detail1135,
  "ORD-2026-1130": detail1130,
};

export function getOrderDetail(id: string): AdminOrderDetail | null {
  return orderDetailsById[id] ?? null;
}
