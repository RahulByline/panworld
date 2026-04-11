import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AdminPageHeader } from "../../admin/components/AdminPageHeader";
import { Button } from "../../components/Button";
import { systemLogRows, type SystemLogSeverity } from "../../../data/admin/systemLog";
import { useAdminToast } from "../../admin/hooks/useAdminToast";

export function AdminAuditLogPage() {
  const { t } = useTranslation();
  const { show, Toast } = useAdminToast();
  const [q, setQ] = useState("");
  const [eventType, setEventType] = useState("all");
  const [severity, setSeverity] = useState<"all" | SystemLogSeverity>("all");
  const [range, setRange] = useState("30d");

  const filtered = useMemo(() => {
    return systemLogRows.filter((row) => {
      if (severity !== "all" && row.severity !== severity) return false;
      if (eventType !== "all" && row.eventType !== eventType) return false;
      if (q.trim()) {
        const s = `${row.actor} ${row.description} ${row.context} ${row.eventType}`.toLowerCase();
        if (!s.includes(q.trim().toLowerCase())) return false;
      }
      return true;
    });
  }, [q, eventType, severity]);

  const sel = "rounded-lg border border-[#E2E0D9] bg-white px-3 py-2 text-sm text-[#1A1917] outline-none focus:border-[#0A3D62]";

  const eventTypes = [
    "all",
    "RFQ Submitted",
    "Odoo Sync",
    "Sync Error",
    "Certificate Issued",
    "Demo Accessed",
    "SLA Breach",
    "Admin Action",
    "User Login",
  ] as const;

  return (
    <div className="font-sans">
      <Toast />
      <AdminPageHeader
        title={t("admin.pages.audit.title")}
        subtitle={t("admin.pages.audit.subtitleExtended")}
        actions={
          <Button type="button" variant="secondary" size="sm" onClick={() => show(t("admin.pages.audit.exportCsv"))}>
            {t("admin.pages.audit.exportCsvBtn")}
          </Button>
        }
      />

      <div className="mb-4 flex flex-col gap-2 rounded-2xl border border-[#E2E0D9] bg-white p-4 lg:flex-row lg:flex-wrap lg:items-center">
        <input
          type="search"
          placeholder={t("admin.pages.audit.searchPh")}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="min-w-[200px] flex-1 rounded-lg border border-[#E2E0D9] px-3 py-2 text-sm outline-none focus:border-[#0A3D62]"
        />
        <select className={sel} value={eventType} onChange={(e) => setEventType(e.target.value)}>
          {eventTypes.map((et) => (
            <option key={et} value={et}>
              {et === "all" ? t("admin.pages.audit.filterAllEvents") : et}
            </option>
          ))}
        </select>
        <select className={sel} defaultValue="all">
          <option value="all">{t("admin.pages.audit.filterAllUsers")}</option>
          <option>Zara Al-Ahmad (Admin)</option>
          <option>{t("admin.pages.audit.filterSchoolUsers")}</option>
          <option>{t("admin.pages.audit.filterSystem")}</option>
        </select>
        <select className={sel} defaultValue="all">
          <option value="all">{t("admin.pages.audit.filterAllSchools")}</option>
          <option>Al Noor International</option>
          <option>GEMS Wellington</option>
        </select>
        <select className={sel} value={range} onChange={(e) => setRange(e.target.value)}>
          <option value="24h">{t("admin.pages.audit.range24h")}</option>
          <option value="7d">{t("admin.pages.audit.range7d")}</option>
          <option value="30d">{t("admin.pages.audit.range30d")}</option>
          <option value="custom">{t("admin.pages.audit.rangeCustom")}</option>
        </select>
        <select
          className={sel}
          value={severity}
          onChange={(e) => setSeverity(e.target.value as typeof severity)}
        >
          <option value="all">{t("admin.pages.audit.severityAll")}</option>
          <option value="Info">Info</option>
          <option value="Warning">Warning</option>
          <option value="Error">Error</option>
          <option value="Critical">Critical</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#E2E0D9] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] border-collapse text-left text-[13.5px]">
            <thead className="border-b border-[#E2E0D9] bg-[#F5F4F0] text-[11px] font-semibold uppercase tracking-wide text-[#5C5A55]">
              <tr>
                <th className="px-4 py-3">{t("admin.pages.audit.colTs")}</th>
                <th className="px-4 py-3">{t("admin.pages.audit.colEvent")}</th>
                <th className="px-4 py-3">{t("admin.pages.audit.colActor")}</th>
                <th className="px-4 py-3">{t("admin.pages.audit.colContext")}</th>
                <th className="px-4 py-3">{t("admin.pages.audit.colDesc")}</th>
                <th className="px-4 py-3">{t("admin.pages.audit.colSeverity")}</th>
                <th className="px-4 py-3">{t("admin.pages.audit.colIp")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E0D9]">
              {filtered.map((row) => (
                <tr key={row.id} className="hover:bg-[#FAFAF8]">
                  <td className="whitespace-nowrap px-4 py-3 text-[#5C5A55]">{row.at}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-[#E1EEF9] px-2 py-0.5 text-[11px] font-semibold text-[#0A3D62]">{row.eventType}</span>
                  </td>
                  <td className="px-4 py-3">{row.actor}</td>
                  <td className="px-4 py-3">{row.context}</td>
                  <td className="max-w-[280px] px-4 py-3">{row.description}</td>
                  <td className="px-4 py-3">
                    <SeverityBadge s={row.severity} />
                  </td>
                  <td className="px-4 py-3 text-xs text-[#5C5A55]">{row.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SeverityBadge({ s }: { s: SystemLogSeverity }) {
  const cls =
    s === "Critical" || s === "Error"
      ? "bg-rose-100 text-rose-800"
      : s === "Warning"
        ? "bg-amber-100 text-amber-900"
        : "bg-[#F5F4F0] text-[#5C5A55]";
  return <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${cls}`}>{s}</span>;
}
