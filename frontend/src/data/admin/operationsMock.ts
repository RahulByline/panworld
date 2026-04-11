export type AdminOrderRow = {
  id: string;
  school: string;
  placedAt: string;
  totalAed: string;
  status: string;
  tracking?: string;
};

export const adminOrders: AdminOrderRow[] = [
  {
    id: "ORD-1130",
    school: "King Faisal International",
    placedAt: "10 Apr 2026",
    totalAed: "AED 42,800",
    status: "Processing",
    tracking: "Aramex #7891234",
  },
  {
    id: "ORD-1128",
    school: "Al Noor International",
    placedAt: "9 Apr 2026",
    totalAed: "AED 18,200",
    status: "Shipped",
    tracking: "Aramex #7891108",
  },
  {
    id: "ORD-1125",
    school: "GEMS Wellington",
    placedAt: "8 Apr 2026",
    totalAed: "AED 9,450",
    status: "Delivered",
  },
  {
    id: "ORD-1121",
    school: "Taaleem Brighton",
    placedAt: "5 Apr 2026",
    totalAed: "AED 3,100",
    status: "Sync pending",
  },
];

export type AdminInvoiceRow = {
  id: string;
  school: string;
  issuedAt: string;
  amountAed: string;
  status: string;
};

export const adminInvoices: AdminInvoiceRow[] = [
  { id: "INV-4401", school: "Al Noor International", issuedAt: "10 Apr 2026", amountAed: "AED 18,200", status: "Paid" },
  { id: "INV-4398", school: "GEMS Dubai", issuedAt: "9 Apr 2026", amountAed: "AED 6,400", status: "Open" },
  { id: "INV-4392", school: "King Faisal International", issuedAt: "7 Apr 2026", amountAed: "AED 42,800", status: "Paid" },
  { id: "INV-4385", school: "Taaleem Brighton", issuedAt: "4 Apr 2026", amountAed: "AED 2,890", status: "Overdue" },
];

export type AdminSampleRow = {
  id: string;
  school: string;
  product: string;
  requestedAt: string;
  status: "Pending" | "Approved" | "Shipped" | "Declined";
};

export const adminSamples: AdminSampleRow[] = [
  {
    id: "SMP-221",
    school: "Al Noor International",
    product: "Inspire Science G5",
    requestedAt: "11 Apr 2026",
    status: "Pending",
  },
  {
    id: "SMP-218",
    school: "GEMS Wellington",
    product: "StudySync G6–G8",
    requestedAt: "10 Apr 2026",
    status: "Approved",
  },
  {
    id: "SMP-215",
    school: "King Faisal International",
    product: "Jolly Phonics KG Kit",
    requestedAt: "8 Apr 2026",
    status: "Shipped",
  },
  {
    id: "SMP-209",
    school: "Taaleem Brighton",
    product: "Reveal Math sample pack",
    requestedAt: "5 Apr 2026",
    status: "Declined",
  },
];
