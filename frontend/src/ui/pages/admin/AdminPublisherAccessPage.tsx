import { useTranslation } from "react-i18next";
import { AdminPageHeader } from "../../admin/components/AdminPageHeader";
import { Button } from "../../components/Button";
import { publisherAccessRows } from "../../../data/admin/publisherAccess";

export function AdminPublisherAccessPage() {
  const { t } = useTranslation();

  return (
    <div className="font-sans">
      <AdminPageHeader
        title={t("admin.pages.publisherAccess.title")}
        subtitle={t("admin.pages.publisherAccess.subtitle")}
        actions={
          <Button type="button" className="bg-[#0A3D62] hover:bg-[#071E36]">
            {t("admin.pages.publisherAccess.add")}
          </Button>
        }
      />

      <div className="overflow-hidden rounded-2xl border border-[#E2E0D9] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] border-collapse text-left text-[13.5px]">
            <thead className="border-b border-[#E2E0D9] bg-[#F5F4F0] text-[11px] font-semibold uppercase tracking-wide text-[#5C5A55]">
              <tr>
                <th className="px-4 py-3">{t("admin.pages.publisherAccess.colPublisher")}</th>
                <th className="px-4 py-3">{t("admin.pages.publisherAccess.colType")}</th>
                <th className="px-4 py-3">{t("admin.pages.publisherAccess.colAccess")}</th>
                <th className="px-4 py-3">{t("admin.pages.publisherAccess.colUses")}</th>
                <th className="px-4 py-3">{t("admin.pages.publisherAccess.colLastTest")}</th>
                <th className="px-4 py-3 text-right">{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E0D9]">
              {publisherAccessRows.map((row) => (
                <tr key={row.title} className="hover:bg-[#FAFAF8]">
                  <td className="px-4 py-3">
                    <div className="font-semibold">{row.title}</div>
                    {row.subtitle ? <div className="text-[11px] text-[#9A9890]">{row.subtitle}</div> : null}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        row.type === "School-specific"
                          ? "rounded-full bg-[#FDEBD0] px-2 py-0.5 text-xs font-medium text-[#7D4E10]"
                          : "rounded-full bg-[#E2E0D9] px-2 py-0.5 text-xs font-medium text-[#5C5A55]"
                      }
                    >
                      {row.type}
                    </span>
                  </td>
                  <td className="max-w-[280px] px-4 py-3 font-mono text-[12px] text-[#1A1917]">{row.accessLine}</td>
                  <td className="px-4 py-3 font-semibold text-[#0A3D62]">{row.accesses30d}</td>
                  <td className="px-4 py-3 text-[12px]">
                    <span
                      className={
                        row.lastTone === "ok"
                          ? "text-[#1E8449]"
                          : row.lastTone === "expired"
                            ? "text-[#C0392B]"
                            : "text-[#E8912D]"
                      }
                    >
                      {row.lastTested}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {row.action === "test" ? (
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="secondary" size="sm">
                          {t("admin.pages.publisherAccess.test")}
                        </Button>
                        <Button type="button" variant="ghost" size="sm">
                          {t("common.edit")}
                        </Button>
                      </div>
                    ) : row.action === "pending" ? (
                      <Button type="button" variant="secondary" size="sm">
                        {t("admin.pages.publisherAccess.pending")} ({row.pendingCount})
                      </Button>
                    ) : (
                      <div className="flex justify-end gap-2">
                        <Button type="button" size="sm" className="bg-[#C0392B] hover:bg-[#A93226]">
                          {t("admin.pages.publisherAccess.renew")}
                        </Button>
                        <Button type="button" variant="ghost" size="sm">
                          {t("common.edit")}
                        </Button>
                      </div>
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
