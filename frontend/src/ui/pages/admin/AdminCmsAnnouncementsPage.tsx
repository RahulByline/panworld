import { useTranslation } from "react-i18next";
import { AdminPageHeader } from "../../admin/components/AdminPageHeader";
import { Button } from "../../components/Button";
import { cmsAnnouncements } from "../../../data/admin/cmsAnnouncements";

export function AdminCmsAnnouncementsPage() {
  const { t } = useTranslation();

  return (
    <div className="font-sans">
      <AdminPageHeader
        title={t("admin.pages.announcements.title")}
        subtitle={t("admin.pages.announcements.subtitle")}
        actions={
          <Button type="button" className="bg-[#0A3D62] hover:bg-[#071E36]">
            {t("admin.pages.announcements.new")}
          </Button>
        }
      />

      <div className="divide-y divide-[#E2E0D9] rounded-2xl border border-[#E2E0D9] bg-white">
        {cmsAnnouncements.map((a, i) => (
          <div key={i} className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4 px-5 py-4">
            <div className="flex gap-3">
              <div
                className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                  a.tone === "pinned" ? "bg-[#E8912D]" : a.tone === "live" ? "bg-[#1E8449]" : "bg-[#E2E0D9]"
                }`}
              />
              <div>
                <div className="text-[14px] font-semibold text-[#1A1917]">{a.title}</div>
                <div className="mt-0.5 text-[12.5px] text-[#5C5A55]">{a.meta}</div>
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
              {a.badge ? (
                <span className="rounded-full bg-[#FDEBD0] px-2.5 py-1 text-xs font-medium text-[#7D4E10]">{a.badge}</span>
              ) : null}
              {a.tone === "draft" ? (
                <>
                  <Button type="button" variant="secondary" size="sm">
                    {t("common.edit")}
                  </Button>
                  <Button type="button" size="sm" className="bg-[#0A3D62] hover:bg-[#071E36]">
                    {t("admin.pages.announcements.publish")}
                  </Button>
                </>
              ) : (
                <Button type="button" variant="secondary" size="sm">
                  {t("common.edit")}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
