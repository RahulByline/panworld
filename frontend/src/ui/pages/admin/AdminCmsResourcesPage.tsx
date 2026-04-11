import { useTranslation } from "react-i18next";
import { FileText } from "lucide-react";
import { AdminPageHeader } from "../../admin/components/AdminPageHeader";
import { Button } from "../../components/Button";
import { resourceLibraryItems } from "../../../data/admin/resourceLibrary";

export function AdminCmsResourcesPage() {
  const { t } = useTranslation();

  return (
    <div className="font-sans">
      <AdminPageHeader
        title={t("admin.pages.resources.title")}
        subtitle={t("admin.pages.resources.subtitle")}
        actions={
          <Button type="button" className="bg-[#0A3D62] hover:bg-[#071E36]">
            {t("admin.pages.resources.upload")}
          </Button>
        }
      />

      <div className="divide-y divide-[#E2E0D9] rounded-2xl border border-[#E2E0D9] bg-white">
        {resourceLibraryItems.map((row, i) => (
          <div key={i} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <div
                className={`flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-lg text-[#0A3D62] ${row.iconBg}`}
              >
                <FileText size={22} strokeWidth={1.75} aria-hidden />
              </div>
              <div>
                <div className="text-[14px] font-semibold text-[#1A1917]">{row.title}</div>
                <div className="mt-0.5 text-[12px] text-[#5C5A55]">{row.meta}</div>
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
              <span className="rounded-full bg-[#E2E0D9] px-2.5 py-1 text-xs font-medium text-[#5C5A55]">
                {row.tone === "published" ? t("admin.pages.resources.published") : t("admin.pages.resources.draft")}
              </span>
              {row.tone === "draft" ? (
                <Button type="button" size="sm" className="bg-[#0A3D62] hover:bg-[#071E36]">
                  {t("admin.pages.announcements.publish")}
                </Button>
              ) : (
                <Button type="button" variant="ghost" size="sm">
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
