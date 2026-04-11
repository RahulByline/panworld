import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AdminPageHeader } from "../../admin/components/AdminPageHeader";
import { Button } from "../../components/Button";
import { AdminModal } from "../../admin/components/AdminModal";
import { adminSamples } from "../../../data/admin/operationsMock";
import { useAdminToast } from "../../admin/hooks/useAdminToast";

export function AdminSamplesPage() {
  const { t } = useTranslation();
  const { show, Toast } = useAdminToast();
  const [logOpen, setLogOpen] = useState(false);

  const inp = "w-full rounded-lg border border-[#E2E0D9] px-3 py-2 text-sm outline-none focus:border-[#0A3D62]";
  const lbl = "mb-1 block text-xs font-medium text-[#5C5A55]";

  return (
    <div className="font-sans">
      <Toast />
      <AdminPageHeader
        title={t("admin.pages.samples.title")}
        subtitle={t("admin.pages.samples.subtitle")}
        actions={
          <Button type="button" className="bg-[#0A3D62] text-white hover:bg-[#071E36]" onClick={() => setLogOpen(true)}>
            {t("admin.pages.samples.log")}
          </Button>
        }
      />

      <div className="overflow-hidden rounded-2xl border border-[#E2E0D9] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-[13.5px]">
            <thead className="border-b border-[#E2E0D9] bg-[#F5F4F0] text-[11px] font-semibold uppercase tracking-wide text-[#5C5A55]">
              <tr>
                <th className="px-4 py-3">{t("admin.pages.samples.colId")}</th>
                <th className="px-4 py-3">{t("admin.pages.rfq.colSchool")}</th>
                <th className="px-4 py-3">{t("admin.pages.samples.colProduct")}</th>
                <th className="px-4 py-3">{t("admin.pages.samples.colRequested")}</th>
                <th className="px-4 py-3">{t("common.status")}</th>
                <th className="px-4 py-3 text-right">{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E0D9]">
              {adminSamples.map((s) => (
                <tr key={s.id} className="hover:bg-[#FAFAF8]">
                  <td className="px-4 py-3 font-mono text-xs font-semibold">{s.id}</td>
                  <td className="px-4 py-3">{s.school}</td>
                  <td className="px-4 py-3">{s.product}</td>
                  <td className="px-4 py-3">{s.requestedAt}</td>
                  <td className="px-4 py-3">{s.status}</td>
                  <td className="px-4 py-3 text-right">
                    {s.status === "Pending" ? (
                      <div className="flex flex-wrap justify-end gap-1">
                        <Button type="button" size="sm" className="bg-[#1E8449] text-white hover:bg-[#16693a]" onClick={() => show(t("admin.pages.samples.approved"))}>
                          {t("admin.pages.samples.approve")}
                        </Button>
                        <Button type="button" variant="danger" size="sm" onClick={() => show(t("admin.pages.samples.declined"))}>
                          {t("admin.pages.samples.decline")}
                        </Button>
                      </div>
                    ) : s.status === "Shipped" ? (
                      <Button type="button" variant="secondary" size="sm" onClick={() => show(t("admin.pages.samples.track"))}>
                        {t("admin.pages.samples.trackBtn")}
                      </Button>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AdminModal
        open={logOpen}
        onClose={() => setLogOpen(false)}
        title={t("admin.pages.samples.logTitle")}
        footer={
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setLogOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button
              type="button"
              className="bg-[#0A3D62] text-white hover:bg-[#071E36]"
              onClick={() => {
                show(t("admin.pages.samples.logged"));
                setLogOpen(false);
              }}
            >
              {t("admin.pages.samples.submitLog")}
            </Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className={lbl}>{t("admin.pages.rfq.colSchool")}</label>
            <select className={inp}>
              <option>Al Noor International</option>
              <option>GEMS Wellington</option>
            </select>
          </div>
          <div>
            <label className={lbl}>{t("admin.pages.samples.colProduct")}</label>
            <input className={inp} placeholder="Product name" />
          </div>
        </div>
        <div className="mt-3">
          <label className={lbl}>{t("admin.pages.samples.notes")}</label>
          <textarea className={`${inp} min-h-[80px]`} />
        </div>
      </AdminModal>
    </div>
  );
}
