import { useTranslation } from "react-i18next";
import { AdminPageHeader } from "../../admin/components/AdminPageHeader";
import { AdminStatCard } from "../../admin/components/AdminStatCard";
import { whatsappLogRows, whatsappSummary } from "../../../data/admin/whatsappLogs";

export function AdminWhatsappLogsPage() {
  const { t } = useTranslation();

  return (
    <div className="font-sans">
      <AdminPageHeader
        title={t("admin.pages.whatsapp.title")}
        subtitle={t("admin.pages.whatsapp.subtitle")}
        actions={
          <select className="h-10 rounded-lg border border-[#E2E0D9] bg-white px-3 text-sm">
            <option>{t("admin.pages.whatsapp.filterAll")}</option>
            <option>{t("admin.pages.whatsapp.filterAccess")}</option>
            <option>{t("admin.pages.whatsapp.filterRfq")}</option>
            <option>{t("admin.pages.whatsapp.filterQuote")}</option>
            <option>{t("admin.pages.whatsapp.filterCert")}</option>
          </select>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label={t("admin.pages.whatsapp.statSent")} value={whatsappSummary.sent30d} />
        <AdminStatCard
          label={t("admin.pages.whatsapp.statDelivered")}
          value={whatsappSummary.delivered}
          sub={whatsappSummary.deliveredPct}
          valueClassName="text-[#1E8449]"
        />
        <AdminStatCard
          label={t("admin.pages.whatsapp.statOpened")}
          value={whatsappSummary.opened}
          sub={whatsappSummary.openedSub}
          valueClassName="text-[#0A3D62]"
        />
        <AdminStatCard label={t("admin.pages.whatsapp.statFailed")} value={whatsappSummary.failed} valueClassName="text-[#C0392B]" />
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#E2E0D9] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-[13.5px]">
            <thead className="border-b border-[#E2E0D9] bg-[#F5F4F0] text-[11px] font-semibold uppercase tracking-wide text-[#5C5A55]">
              <tr>
                <th className="px-4 py-3">{t("admin.pages.whatsapp.colTemplate")}</th>
                <th className="px-4 py-3">{t("admin.pages.whatsapp.colSchool")}</th>
                <th className="px-4 py-3">{t("admin.pages.whatsapp.colRecipient")}</th>
                <th className="px-4 py-3">{t("admin.pages.whatsapp.colSent")}</th>
                <th className="px-4 py-3">{t("common.status")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E0D9]">
              {whatsappLogRows.map((row, i) => (
                <tr key={i} className="hover:bg-[#FAFAF8]">
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-[#D6EAF8] px-2.5 py-1 text-xs font-medium text-[#0A3D62]">{row.template}</span>
                  </td>
                  <td className="px-4 py-3">{row.school}</td>
                  <td className="px-4 py-3 font-mono text-[12px]">{row.recipient}</td>
                  <td className="px-4 py-3 text-[#5C5A55]">{row.sent}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium text-[#1E8449]">{row.status}</span>
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
