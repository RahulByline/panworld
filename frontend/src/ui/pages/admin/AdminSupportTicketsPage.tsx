import { useTranslation } from "react-i18next";
import { AdminPageHeader } from "../../admin/components/AdminPageHeader";
import { AdminStatCard } from "../../admin/components/AdminStatCard";
import { Button } from "../../components/Button";
import { supportSummary, supportTickets } from "../../../data/admin/supportTickets";

function ticketStatusClass(status: string) {
  if (status === "SLA Breach") return "bg-[#FDEDEC] text-[#C0392B]";
  if (status === "Open") return "bg-[#FDEBD0] text-[#7D4E10]";
  return "bg-[#D6EAF8] text-[#0A3D62]";
}

export function AdminSupportTicketsPage() {
  const { t } = useTranslation();

  return (
    <div className="font-sans">
      <AdminPageHeader
        title={t("admin.pages.support.title")}
        subtitle={t("admin.pages.support.subtitle")}
        actions={
          <select className="h-10 rounded-lg border border-[#E2E0D9] bg-white px-3 text-sm">
            <option>{t("admin.pages.support.filterAll")}</option>
            <option>{t("admin.pages.support.filterOpen")}</option>
            <option>{t("admin.pages.support.filterProgress")}</option>
            <option>{t("admin.pages.support.filterResolved")}</option>
          </select>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label={t("admin.pages.support.statOpen")} value={supportSummary.open} valueClassName="text-[#C0392B]" />
        <AdminStatCard label={t("admin.pages.support.statProgress")} value={supportSummary.inProgress} valueClassName="text-[#E8912D]" />
        <AdminStatCard label={t("admin.pages.support.statResolved")} value={supportSummary.resolved30d} valueClassName="text-[#1E8449]" />
        <AdminStatCard
          label={t("admin.pages.support.statAvg")}
          value={supportSummary.avgResolution}
          sub={supportSummary.avgResolutionSub}
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#E2E0D9] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse text-left text-[13.5px]">
            <thead className="border-b border-[#E2E0D9] bg-[#F5F4F0] text-[11px] font-semibold uppercase tracking-wide text-[#5C5A55]">
              <tr>
                <th className="px-4 py-3">{t("admin.pages.support.colTicket")}</th>
                <th className="px-4 py-3">{t("admin.pages.support.colSchool")}</th>
                <th className="px-4 py-3">{t("admin.pages.support.colIssue")}</th>
                <th className="px-4 py-3">{t("admin.pages.support.colPlatform")}</th>
                <th className="px-4 py-3">{t("common.status")}</th>
                <th className="px-4 py-3">{t("admin.pages.support.colOpenSince")}</th>
                <th className="px-4 py-3 text-right">{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E0D9]">
              {supportTickets.map((row) => (
                <tr key={row.id} className={row.highlight ? "bg-[#FFF8F6]" : "hover:bg-[#FAFAF8]"}>
                  <td className="px-4 py-3 font-mono font-semibold">#{row.id}</td>
                  <td className="px-4 py-3">{row.school}</td>
                  <td className="px-4 py-3">{row.issue}</td>
                  <td className="px-4 py-3 text-[#5C5A55]">{row.platform}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${ticketStatusClass(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#5C5A55]">{row.openSince}</td>
                  <td className="px-4 py-3 text-right">
                    {row.action === "escalate" ? (
                      <Button type="button" size="sm" className="bg-[#C0392B] hover:bg-[#A93226]">
                        {t("admin.pages.support.escalate")}
                      </Button>
                    ) : row.action === "assign" ? (
                      <Button type="button" size="sm" className="bg-[#0A3D62] hover:bg-[#071E36]">
                        {t("admin.pages.support.assign")}
                      </Button>
                    ) : (
                      <Button type="button" variant="secondary" size="sm">
                        {t("common.view")}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
