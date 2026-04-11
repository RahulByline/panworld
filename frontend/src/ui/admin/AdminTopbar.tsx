import { Bell } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { LanguageToggle } from "../shared/LanguageToggle";

const TITLE_KEYS: { prefix: string; key: string }[] = [
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
    <header className="sticky top-0 z-50 flex h-[60px] items-center gap-4 border-b border-[var(--pw-border)] bg-white/95 px-6 shadow-[0_1px_0_rgba(15,23,42,0.06)] backdrop-blur-sm md:px-7">
      <h1 className="flex-1 text-[15px] font-medium text-[var(--pw-text)]">{t(titleKey)}</h1>
      <div className="flex items-center gap-2">
        <span className="hidden rounded-full bg-[var(--pw-accent-light)] px-3 py-1 text-xs font-semibold text-[var(--pw-accent)] ring-1 ring-[var(--pw-border)]/40 sm:inline">
          {t("admin.top.superAdmin")}
        </span>
        <LanguageToggle />
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-md border border-[var(--pw-border)] bg-white text-[var(--pw-text-secondary)] transition hover:bg-[var(--pw-muted)]"
          aria-label="Notifications"
        >
          <Bell size={18} className="text-[var(--pw-brand)]" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full border border-white bg-[var(--pw-accent)]" />
        </button>
      </div>
    </header>
  );
}
