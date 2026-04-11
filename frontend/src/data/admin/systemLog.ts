export type SystemLogSeverity = "Info" | "Warning" | "Error" | "Critical";

export type SystemLogRow = {
  id: string;
  at: string;
  eventType: string;
  actor: string;
  context: string;
  description: string;
  severity: SystemLogSeverity;
  ip: string;
};

export const systemLogRows: SystemLogRow[] = [
  {
    id: "sl-1",
    at: "11 Apr 9:42 AM",
    eventType: "RFQ Submitted",
    actor: "Sarah Al-Mansoori",
    context: "Al Noor International",
    description: "RFQ #PW-2026-082 submitted for Inspire Science G4–G6 · AED est. 45,000",
    severity: "Info",
    ip: "197.x.x.x",
  },
  {
    id: "sl-2",
    at: "11 Apr 9:38 AM",
    eventType: "Odoo Sync",
    actor: "System",
    context: "All",
    description: "Scheduled sync complete — Orders: 12 updated, Invoices: 8 updated",
    severity: "Info",
    ip: "Internal",
  },
  {
    id: "sl-3",
    at: "11 Apr 9:35 AM",
    eventType: "Sync Error",
    actor: "System",
    context: "Odoo CRM",
    description: "Contact record conflict: Ahmed Al-Rashidi — Odoo duplicate ID 4821 vs 4918",
    severity: "Error",
    ip: "Internal",
  },
  {
    id: "sl-4",
    at: "11 Apr 9:15 AM",
    eventType: "Certificate Issued",
    actor: "System",
    context: "Al Noor International",
    description: "CERT-2026-0312 issued to Sarah Al-Mansoori for Inspire Science training · WhatsApp sent",
    severity: "Info",
    ip: "Internal",
  },
  {
    id: "sl-5",
    at: "11 Apr 8:55 AM",
    eventType: "Demo Accessed",
    actor: "HOD User",
    context: "GEMS Dubai",
    description: "Demo login requested for StudySync G6–G12 — credentials auto-sent via email + WhatsApp",
    severity: "Info",
    ip: "185.x.x.x",
  },
  {
    id: "sl-6",
    at: "11 Apr 8:30 AM",
    eventType: "SLA Breach",
    actor: "System",
    context: "Taaleem Brighton",
    description: "Support Ticket #ST-488 breached 4h SLA — Escalation alert sent to Mohamed Hassan",
    severity: "Critical",
    ip: "Internal",
  },
  {
    id: "sl-7",
    at: "10 Apr 4:12 PM",
    eventType: "Admin Action",
    actor: "Zara Al-Ahmad",
    context: "Catalogue",
    description: 'Textbook "Reveal Math 2025" published — status changed from Draft to Live',
    severity: "Info",
    ip: "10.x.x.x",
  },
  {
    id: "sl-8",
    at: "10 Apr 2:00 PM",
    eventType: "User Login",
    actor: "Ahmed Al-Kaabi",
    context: "GEMS Wellington",
    description: "School CEO dashboard accessed — Dubai, UAE",
    severity: "Info",
    ip: "94.x.x.x",
  },
];
