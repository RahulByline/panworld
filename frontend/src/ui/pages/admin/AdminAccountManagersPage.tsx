import { useTranslation } from "react-i18next";
import { AdminPageHeader } from "../../admin/components/AdminPageHeader";
import { accountManagers } from "../../../data/admin/accountManagers";

export function AdminAccountManagersPage() {
  const { t } = useTranslation();

  return (
    <div className="font-sans">
      <AdminPageHeader
        title={t("admin.pages.accountManagers.title")}
        subtitle={t("admin.pages.accountManagers.subtitle")}
      />

      <div className="overflow-hidden rounded-2xl border border-[#E2E0D9] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-[13.5px]">
            <thead className="border-b border-[#E2E0D9] bg-[#F5F4F0] text-[11px] font-semibold uppercase tracking-wide text-[#5C5A55]">
              <tr>
                <th className="px-4 py-3">{t("admin.pages.accountManagers.colName")}</th>
                <th className="px-4 py-3">{t("admin.pages.accountManagers.colRegion")}</th>
                <th className="px-4 py-3">{t("admin.pages.accountManagers.colSchools")}</th>
                <th className="px-4 py-3">{t("admin.pages.accountManagers.colRfqs")}</th>
                <th className="px-4 py-3">{t("admin.pages.accountManagers.colPipeline")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E0D9]">
              {accountManagers.map((row) => (
                <tr key={row.name} className="hover:bg-[#FAFAF8]">
                  <td className="px-4 py-3 font-semibold">{row.name}</td>
                  <td className="px-4 py-3">{row.region}</td>
                  <td className="px-4 py-3">{row.activeSchools}</td>
                  <td className="px-4 py-3">{row.openRfqs}</td>
                  <td className="px-4 py-3 font-medium text-[#1E8449]">{row.pipelineAed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
