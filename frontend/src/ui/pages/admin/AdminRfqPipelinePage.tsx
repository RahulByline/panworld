import { useTranslation } from "react-i18next";
import { AdminPageHeader } from "../../admin/components/AdminPageHeader";
import { AdminStatCard } from "../../admin/components/AdminStatCard";
import { Button } from "../../components/Button";
import {
  accountManagerFilterOptions,
  rfqPipelineRows,
  rfqPipelineSummary,
  rfqStatusFilterOptions,
  type RfqPipelineRow,
} from "../../../data/admin/rfqPipeline";

function statusBadgeClass(s: RfqPipelineRow["status"]) {
  if (s === "Quote Ready" || s === "Approved" || s === "Ordered") return "bg-[#D5F5E3] text-[#1E8449]";
  if (s === "Under Review" || s === "Submitted" || s === "Quoted") return "bg-[#FDEBD0] text-[#7D4E10]";
  return "bg-[#E2E0D9] text-[#5C5A55]";
}

export function AdminRfqPipelinePage() {
  const { t } = useTranslation();

  return (
    <div className="font-sans">
      <AdminPageHeader
        title={t("admin.pages.rfq.title")}
        subtitle={t("admin.pages.rfq.subtitle")}
        actions={
          <>
            <select className="h-10 rounded-lg border border-[#E2E0D9] bg-white px-3 text-sm text-[#1A1917]">
              {accountManagerFilterOptions.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
            <select className="h-10 rounded-lg border border-[#E2E0D9] bg-white px-3 text-sm text-[#1A1917]">
              {rfqStatusFilterOptions.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label={t("admin.pages.rfq.statActive")} value={rfqPipelineSummary.totalActive} />
        <AdminStatCard
          label={t("admin.pages.rfq.statPipeline")}
          value={rfqPipelineSummary.pipelineValue}
          valueClassName="text-[#1E8449]"
        />
        <AdminStatCard
          label={t("admin.pages.rfq.statAwaiting")}
          value={rfqPipelineSummary.awaitingResponse}
          sub={rfqPipelineSummary.awaitingSub}
          valueClassName="text-[#E8912D]"
        />
        <AdminStatCard
          label={t("admin.pages.rfq.statQuoteReady")}
          value={rfqPipelineSummary.quoteReady}
          sub={rfqPipelineSummary.quoteReadySub}
          valueClassName="text-[#0A3D62]"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#E2E0D9] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] border-collapse text-left text-[13.5px]">
            <thead className="border-b border-[#E2E0D9] bg-[#F5F4F0] text-[11px] font-semibold uppercase tracking-wide text-[#5C5A55]">
              <tr>
                <th className="px-4 py-3">{t("admin.pages.rfq.colId")}</th>
                <th className="px-4 py-3">{t("admin.pages.rfq.colSchool")}</th>
                <th className="px-4 py-3">{t("admin.pages.rfq.colProducts")}</th>
                <th className="px-4 py-3">{t("admin.pages.rfq.colValue")}</th>
                <th className="px-4 py-3">{t("admin.pages.rfq.colAm")}</th>
                <th className="px-4 py-3">{t("common.status")}</th>
                <th className="px-4 py-3">{t("admin.pages.rfq.colDays")}</th>
                <th className="px-4 py-3 text-right">{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E0D9]">
              {rfqPipelineRows.map((row) => (
                <tr key={row.id} className="hover:bg-[#FAFAF8]">
                  <td className="px-4 py-3 font-semibold">{row.id}</td>
                  <td className="px-4 py-3">{row.school}</td>
                  <td className="px-4 py-3 text-[#5C5A55]">{row.products}</td>
                  <td className="px-4 py-3 font-semibold text-[#1E8449]">{row.valueAed}</td>
                  <td className="px-4 py-3">{row.accountManager}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadgeClass(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{row.daysOpen}</td>
                  <td className="px-4 py-3 text-right">
                    {row.action === "respond" ? (
                      <Button type="button" size="sm" className="bg-[#0A3D62] hover:bg-[#071E36]">
                        {t("admin.pages.rfq.respond")}
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
