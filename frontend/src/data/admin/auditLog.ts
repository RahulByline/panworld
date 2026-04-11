export type AuditLogRow = {
  id: string;
  at: string;
  actor: string;
  action: string;
  target: string;
};

export const auditLogEntries: AuditLogRow[] = [
  {
    id: "aud-1042",
    at: "9 Apr 2026 · 15:42",
    actor: "R. Khalil",
    action: "Updated school profile",
    target: "Al Noor International",
  },
  {
    id: "aud-1041",
    at: "9 Apr 2026 · 14:18",
    actor: "System",
    action: "Odoo sync completed",
    target: "Delta · 412 records",
  },
  {
    id: "aud-1040",
    at: "9 Apr 2026 · 11:05",
    actor: "Super Admin",
    action: "Published announcement",
    target: "Jolly Phonics partnership",
  },
  {
    id: "aud-1039",
    at: "8 Apr 2026 · 17:30",
    actor: "O. Hassan",
    action: "RFQ status → Quote ready",
    target: "RFQ-0089",
  },
  {
    id: "aud-1038",
    at: "8 Apr 2026 · 09:12",
    actor: "Super Admin",
    action: "Added publisher access record",
    target: "McGraw Hill ConnectED",
  },
];
