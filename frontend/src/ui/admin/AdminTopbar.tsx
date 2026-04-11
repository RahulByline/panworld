import { Bell } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { LanguageToggle } from "../shared/LanguageToggle";

const TITLE_KEYS: { prefix: string; key: string }[] = [
  { prefix: "/admin/settings", key: "admin.titles.settings" },
  { prefix: "/admin/publisher-dashboard", key: "admin.titles.publisherDashboard" },
  { prefix: "/admin/assignments", key: "admin.titles.assignments" },
  { prefix: "/admin/certifications", key: "admin.titles.certifications" },
  { prefix: "/admin/webinars", key: "admin.titles.webinars" },
  { prefix: "/admin/samples", key: "admin.titles.samples" },
  { prefix: "/admin/invoices", key: "admin.titles.invoices" },
  { prefix: "/admin/orders", key: "admin.titles.orders" },
  { prefix: "/admin/users", key: "admin.titles.users" },
  { prefix: "/admin/odoo", key: "admin.titles.odoo" },
  { prefix: "/admin/cms/textbooks", key: "admin.titles.cmsTextbooks" },
  { prefix: "/admin/cms/library", key: "admin.titles.cmsLibrary" },
  { prefix: "/admin/cms/kits", key: "admin.titles.cmsKits" },
  { prefix: "/admin/schools", key: "admin.titles.schools" },
  { prefix: "/admin/cms/publisher-access", key: "admin.titles.publisherAccess" },
  { prefix: "/admin/cms/catalogue", key: "admin.titles.cmsCatalogue" },
  { prefix: "/admin/cms/announcements", key: "admin.titles.cmsAnnouncements" },
  { prefix: "/admin/cms/resources", key: "admin.titles.cmsResources" },
  { prefix: "/admin/account-managers", key: "admin.titles.accountManagers" },
  { prefix: "/admin/audit-log", key: "admin.titles.auditLog" },
  { prefix: "/admin/publishers", key: "admin.titles.publishers" },
  { prefix: "/admin/integrations", key: "admin.titles.integrations" },
  { prefix: "/admin/analytics", key: "admin.titles.analytics" },
  { prefix: "/admin/rfq", key: "admin.titles.rfq" },
  { prefix: "/admin/support", key: "admin.titles.support" },
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
