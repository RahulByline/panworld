import { useTranslation } from "react-i18next";
import { AdminPageHeader } from "../../admin/components/AdminPageHeader";
import { Button } from "../../components/Button";
import { adminInvoices } from "../../../data/admin/operationsMock";
import { useAdminToast } from "../../admin/hooks/useAdminToast";

export function AdminInvoicesPage() {
  const { t } = useTranslation();
  const { show, Toast } = useAdminToast();

  return (
    <div className="font-sans">
      <Toast />
      <AdminPageHeader
        title={t("admin.pages.invoices.title")}
        subtitle={t("admin.pages.invoices.subtitle")}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={() => show(t("admin.pages.invoices.sync"))}>
              {t("admin.pages.orders.sync")}
            </Button>
            <Button type="button" variant="secondary" size="sm" onClick={() => show(t("admin.pages.invoices.export"))}>
              {t("common.export")}
            </Button>
          </div>
        }
      />

      <div className="overflow-hidden rounded-2xl border border-[#E2E0D9] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-[13.5px]">
            <thead className="border-b border-[#E2E0D9] bg-[#F5F4F0] text-[11px] font-semibold uppercase tracking-wide text-[#5C5A55]">
              <tr>
                <th className="px-4 py-3">{t("admin.pages.invoices.colId")}</th>
                <th className="px-4 py-3">{t("admin.pages.rfq.colSchool")}</th>
                <th className="px-4 py-3">{t("admin.pages.invoices.colIssued")}</th>
                <th className="px-4 py-3">{t("admin.pages.rfq.colValue")}</th>
                <th className="px-4 py-3">{t("common.status")}</th>
                <th className="px-4 py-3 text-right">{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E0D9]">
              {adminInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-[#FAFAF8]">
                  <td className="px-4 py-3 font-mono text-xs font-semibold">{inv.id}</td>
                  <td className="px-4 py-3">{inv.school}</td>
                  <td className="px-4 py-3">{inv.issuedAt}</td>
                  <td className="px-4 py-3">{inv.amountAed}</td>
                  <td className="px-4 py-3">{inv.status}</td>
                  <td className="px-4 py-3 text-right">
                    <Button type="button" variant="secondary" size="sm" onClick={() => show(t("admin.pages.invoices.pdf"))}>
                      PDF
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
