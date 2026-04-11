export type IntegrationHealthRow = {
  id: string;
  system: string;
  role: string;
  lastSync: string;
  status: "OK" | "Warning" | "Error";
  detail?: string;
};

export const integrationSummary = {
  odooLastFull: "9 Apr 2026 · 06:12 GST",
  watiConnected: true,
  apiErrors24h: 2,
};

export const integrationHealth: IntegrationHealthRow[] = [
  {
    id: "int-odoo",
    system: "Odoo ERP",
    role: "Orders · invoices · schools",
    lastSync: "9 Apr 2026 · 06:12",
    status: "OK",
    detail: "Last delta: 412 records",
  },
  {
    id: "int-wati",
    system: "Wati.io (WhatsApp)",
    role: "Templates · delivery webhooks",
    lastSync: "Live",
    status: "OK",
  },
  {
    id: "int-mcgraw",
    system: "McGraw Hill ConnectED API",
    role: "Demo seat provisioning",
    lastSync: "8 Apr 2026 · 22:40",
    status: "Warning",
    detail: "Rate limit 2/3 quota",
  },
  {
    id: "int-sso",
    system: "School SSO (Azure B2C)",
    role: "Optional school IdP",
    lastSync: "—",
    status: "OK",
    detail: "3 schools connected",
  },
];

export const odooSyncLogRows = [
  { id: "sync-9821", type: "Delta", records: 412, duration: "38s", at: "9 Apr 06:12", result: "Success" },
  { id: "sync-9818", type: "Full", records: "18,204", duration: "4m 12s", at: "8 Apr 22:00", result: "Success" },
  { id: "sync-9815", type: "Delta", records: 96, duration: "12s", at: "8 Apr 18:45", result: "Success" },
  { id: "sync-9810", type: "Delta", records: 0, duration: "3s", at: "8 Apr 14:02", result: "No changes" },
];
