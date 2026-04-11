import { useTranslation } from "react-i18next";
import { AdminPageHeader } from "../../admin/components/AdminPageHeader";
import { AdminStatCard } from "../../admin/components/AdminStatCard";
import { Button } from "../../components/Button";
import { integrationHealth, integrationSummary, odooSyncLogRows } from "../../../data/admin/integrations";

function healthClass(s: "OK" | "Warning" | "Error") {
  if (s === "OK") return "bg-[#D5F5E3] text-[#1E8449]";
  if (s === "Warning") return "bg-[#FDEBD0] text-[#7D4E10]";
  return "bg-[#FDEDEC] text-[#C0392B]";
}

export function AdminIntegrationsPage() {
  const { t } = useTranslation();

  return (
    <div className="font-sans">
      <AdminPageHeader
        title={t("admin.pages.integrations.title")}
        subtitle={t("admin.pages.integrations.subtitle")}
        actions={
          <Button type="button" variant="secondary" size="sm">
            {t("admin.pages.integrations.runSync")}
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        <AdminStatCard label={t("admin.pages.integrations.statOdoo")} value={integrationSummary.odooLastFull} />
        <AdminStatCard
          label={t("admin.pages.integrations.statWati")}
          value={integrationSummary.watiConnected ? t("admin.pages.integrations.connected") : "—"}
          valueClassName={integrationSummary.watiConnected ? "text-[#1E8449]" : undefined}
        />
        <AdminStatCard
          label={t("admin.pages.integrations.statErrors")}
          value={integrationSummary.apiErrors24h}
          valueClassName="text-[#E8912D]"
        />
      </div>

      <div className="mb-6 rounded-2xl border border-[#E2E0D9] bg-white p-5">
        <div className="mb-4 text-sm font-semibold">{t("admin.pages.integrations.systemsTitle")}</div>
        <div className="divide-y divide-[#E2E0D9]">
          {integrationHealth.map((row) => (
            <div key={row.id} className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="font-semibold text-[#1A1917]">{row.system}</div>
                <div className="text-xs text-[#5C5A55]">{row.role}</div>
                {row.detail ? <div className="mt-1 text-xs text-[#9A9890]">{row.detail}</div> : null}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm text-[#5C5A55]">
                  {t("admin.pages.integrations.lastActivity")}: {row.lastSync}
                </span>
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${healthClass(row.status)}`}>
                  {row.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#E2E0D9] bg-white">
        <div className="border-b border-[#E2E0D9] px-5 py-4">
          <div className="text-sm font-semibold">{t("admin.pages.integrations.odooLogTitle")}</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-[13.5px]">
            <thead className="border-b border-[#E2E0D9] bg-[#F5F4F0] text-[11px] font-semibold uppercase tracking-wide text-[#5C5A55]">
              <tr>
                <th className="px-4 py-3">{t("admin.pages.integrations.colId")}</th>
                <th className="px-4 py-3">{t("admin.pages.integrations.colType")}</th>
                <th className="px-4 py-3">{t("admin.pages.integrations.colRecords")}</th>
                <th className="px-4 py-3">{t("admin.pages.integrations.colDuration")}</th>
                <th className="px-4 py-3">{t("admin.pages.integrations.colAt")}</th>
                <th className="px-4 py-3">{t("common.status")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E0D9]">
              {odooSyncLogRows.map((row) => (
                <tr key={row.id} className="hover:bg-[#FAFAF8]">
                  <td className="px-4 py-3 font-mono text-xs">{row.id}</td>
                  <td className="px-4 py-3">{row.type}</td>
                  <td className="px-4 py-3">{row.records}</td>
                  <td className="px-4 py-3">{row.duration}</td>
                  <td className="px-4 py-3 text-[#5C5A55]">{row.at}</td>
                  <td className="px-4 py-3 text-xs font-medium text-[#1E8449]">{row.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
