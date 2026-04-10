import { Bell } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { LanguageToggle } from "../shared/LanguageToggle";

const TITLE_KEYS: { prefix: string; key: string }[] = [
  { prefix: "/admin/schools", key: "admin.titles.schools" },
  { prefix: "/admin/analytics", key: "admin.titles.analytics" },
  { prefix: "/admin/rfq", key: "admin.titles.rfq" },
  { prefix: "/admin/support", key: "admin.titles.support" },
  { prefix: "/admin/cms/catalogue", key: "admin.titles.cmsCatalogue" },
  { prefix: "/admin/cms/announcements", key: "admin.titles.cmsAnnouncements" },
  { prefix: "/admin/cms/demo-credentials", key: "admin.titles.cmsDemo" },
  { prefix: "/admin/cms/resources", key: "admin.titles.cmsResources" },
  { prefix: "/admin/whatsapp-logs", key: "admin.titles.whatsapp" },
];

export function AdminTopbar() {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  let titleKey = "admin.titles.dashboard";
  for (const { prefix, key } of TITLE_KEYS) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      titleKey = key;
      break;
    }
  }

  return (
    <header className="sticky top-0 z-50 flex h-[60px] items-center gap-4 border-b border-[#E2E0D9] bg-white px-6 md:px-7">
      <h1 className="flex-1 text-[15px] font-medium text-[#1A1917]">{t(titleKey)}</h1>
      <div className="flex items-center gap-2">
        <span className="hidden rounded-full bg-[#E8912D]/15 px-3 py-1 text-xs font-semibold text-[#C0761F] sm:inline">
          {t("admin.top.superAdmin")}
        </span>
        <LanguageToggle />
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-md border border-[#E2E0D9] bg-white text-base text-[#5C5A55] hover:bg-[#F5F4F0]"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full border border-white bg-[#C0392B]" />
        </button>
      </div>
    </header>
  );
}
