export type WhatsappLogRow = {
  template: string;
  school: string;
  recipient: string;
  sent: string;
  status: "Delivered" | "Failed";
};

export const whatsappSummary = {
  sent30d: "1,842",
  delivered: "1,798",
  deliveredPct: "97.6%",
  opened: "1,289",
  openedSub: "71.6% open rate",
  failed: 44,
};

export const whatsappLogRows: WhatsappLogRow[] = [
  { template: "Access request", school: "Al Noor International", recipient: "+971 50 234 5678", sent: "9 Apr · 14:32", status: "Delivered" },
  { template: "Quote ready", school: "GEMS Dubai", recipient: "+971 55 112 4567", sent: "9 Apr · 11:15", status: "Delivered" },
  { template: "RFQ submitted", school: "Taaleem Group", recipient: "+971 56 998 2211", sent: "8 Apr · 16:40", status: "Delivered" },
  { template: "Certificate issued", school: "Repton Dubai", recipient: "+971 54 301 8822", sent: "8 Apr · 09:05", status: "Delivered" },
];
