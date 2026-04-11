import { useTranslation } from "react-i18next";
import { AdminPageHeader } from "../../admin/components/AdminPageHeader";
import { auditLogEntries } from "../../../data/admin/auditLog";

export function AdminAuditLogPage() {
  const { t } = useTranslation();

  return (
    <div className="font-sans">
      <AdminPageHeader title={t("admin.pages.audit.title")} subtitle={t("admin.pages.audit.subtitle")} />

      <div className="overflow-hidden rounded-2xl border border-[#E2E0D9] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-[13.5px]">
            <thead className="border-b border-[#E2E0D9] bg-[#F5F4F0] text-[11px] font-semibold uppercase tracking-wide text-[#5C5A55]">
              <tr>
                <th className="px-4 py-3">{t("admin.pages.audit.colId")}</th>
                <th className="px-4 py-3">{t("admin.pages.audit.colWhen")}</th>
                <th className="px-4 py-3">{t("admin.pages.audit.colActor")}</th>
                <th className="px-4 py-3">{t("admin.pages.audit.colAction")}</th>
                <th className="px-4 py-3">{t("admin.pages.audit.colTarget")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E0D9]">
              {auditLogEntries.map((row) => (
                <tr key={row.id} className="hover:bg-[#FAFAF8]">
                  <td className="px-4 py-3 font-mono text-xs">{row.id}</td>
                  <td className="px-4 py-3 text-[#5C5A55]">{row.at}</td>
                  <td className="px-4 py-3">{row.actor}</td>
                  <td className="px-4 py-3">{row.action}</td>
                  <td className="px-4 py-3 font-medium text-[#1A1917]">{row.target}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
