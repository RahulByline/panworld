import { useTranslation } from "react-i18next";
import { AdminPageHeader } from "../../admin/components/AdminPageHeader";
import { Button } from "../../components/Button";
import { publisherPartners } from "../../../data/admin/publishers";

function statusClass(s: (typeof publisherPartners)[0]["status"]) {
  if (s === "Active") return "bg-[#D5F5E3] text-[#1E8449]";
  if (s === "Onboarding") return "bg-[#FDEBD0] text-[#7D4E10]";
  return "bg-[#E2E0D9] text-[#5C5A55]";
}

export function AdminPublishersPage() {
  const { t } = useTranslation();

  return (
    <div className="font-sans">
      <AdminPageHeader
        title={t("admin.pages.publishers.title")}
        subtitle={t("admin.pages.publishers.subtitle")}
        actions={
          <Button type="button" className="bg-[#0A3D62] hover:bg-[#071E36]">
            {t("admin.pages.publishers.add")}
          </Button>
        }
      />

      <div className="overflow-hidden rounded-2xl border border-[#E2E0D9] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse text-left text-[13.5px]">
            <thead className="border-b border-[#E2E0D9] bg-[#F5F4F0] text-[11px] font-semibold uppercase tracking-wide text-[#5C5A55]">
              <tr>
                <th className="px-4 py-3">{t("admin.pages.publishers.colPublisher")}</th>
                <th className="px-4 py-3">{t("admin.pages.publishers.colTerritory")}</th>
                <th className="px-4 py-3">{t("admin.pages.publishers.colContact")}</th>
                <th className="px-4 py-3">{t("admin.pages.publishers.colSchools")}</th>
                <th className="px-4 py-3">{t("common.status")}</th>
                <th className="px-4 py-3 text-right">{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E0D9]">
              {publisherPartners.map((row) => (
                <tr key={row.id} className="hover:bg-[#FAFAF8]">
                  <td className="px-4 py-3 font-semibold">{row.name}</td>
                  <td className="px-4 py-3 text-[#5C5A55]">{row.territory}</td>
                  <td className="px-4 py-3 font-mono text-[12px] text-[#0A3D62]">{row.contact}</td>
                  <td className="px-4 py-3">{row.activeSchools}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClass(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button type="button" variant="secondary" size="sm">
                      {t("common.edit")}
                    </Button>
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
