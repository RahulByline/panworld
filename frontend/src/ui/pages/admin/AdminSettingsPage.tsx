import { useTranslation } from "react-i18next";
import { AdminPageHeader } from "../../admin/components/AdminPageHeader";
import { Button } from "../../components/Button";
import { useAdminToast } from "../../admin/hooks/useAdminToast";

export function AdminSettingsPage() {
  const { t } = useTranslation();
  const { show, Toast } = useAdminToast();
  const inp = "w-full rounded-lg border border-[#E2E0D9] px-3 py-2 text-sm outline-none focus:border-[#0A3D62]";
  const lbl = "mb-1 block text-xs font-medium text-[#5C5A55]";

  return (
    <div className="font-sans">
      <Toast />
      <AdminPageHeader title={t("admin.pages.settings.title")} subtitle={t("admin.pages.settings.subtitle")} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#E2E0D9] bg-white p-5">
          <div className="mb-4 text-sm font-semibold">{t("admin.pages.settings.portal")}</div>
          <div>
            <label className={lbl}>{t("admin.pages.settings.portalName")}</label>
            <input className={inp} defaultValue="Panworld School Partner Portal" />
          </div>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className={lbl}>{t("admin.pages.settings.defaultLangUae")}</label>
              <select className={inp}>
                <option>English</option>
                <option>Arabic</option>
              </select>
            </div>
            <div>
              <label className={lbl}>{t("admin.pages.settings.defaultLangKsa")}</label>
              <select className={inp}>
                <option>Arabic</option>
                <option>English</option>
              </select>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E2E0D9] bg-white p-5">
          <div className="mb-4 text-sm font-semibold">{t("admin.pages.settings.sla")}</div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="h-4 w-4 rounded border-[#E2E0D9]" defaultChecked />
            {t("admin.pages.settings.slaSupport")}
          </label>
          <label className="mt-3 flex items-center gap-2 text-sm">
            <input type="checkbox" className="h-4 w-4 rounded border-[#E2E0D9]" defaultChecked />
            {t("admin.pages.settings.slaRfq")}
          </label>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button type="button" className="bg-[#0A3D62] text-white hover:bg-[#071E36]" onClick={() => show(t("admin.pages.settings.saved"))}>
          {t("admin.pages.settings.saveAll")}
        </Button>
      </div>
    </div>
  );
}
