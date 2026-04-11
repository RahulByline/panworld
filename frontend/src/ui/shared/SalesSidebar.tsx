import { Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, School, ClipboardList, Crosshair, TrendingUp } from "lucide-react";
import { useAuthStore } from "../../store/auth.store";
import { cn } from "../utils/cn";

function initials(first: string, last: string) {
  const a = first.trim().charAt(0);
  const b = last.trim().charAt(0);
  return `${a}${b}`.toUpperCase() || "AM";
}

const NAV_MAIN: { to: string; labelKey: string; icon: LucideIcon }[] = [
  { to: "/app", labelKey: "salesPortal.nav.dashboard", icon: LayoutDashboard },
  { to: "/app/sales/schools", labelKey: "salesPortal.nav.schools", icon: School },
  { to: "/app/sales/pipeline", labelKey: "salesPortal.nav.pipeline", icon: ClipboardList },
  { to: "/app/sales/signals", labelKey: "salesPortal.nav.signals", icon: Crosshair },
];

const NAV_REPORTS: { to: string; labelKey: string; icon: LucideIcon }[] = [
  { to: "/app/sales/performance", labelKey: "salesPortal.nav.performance", icon: TrendingUp },
];

export function SalesSidebar({ mobileOpen, onNavigate }: { mobileOpen: boolean; onNavigate: () => void }) {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const user = useAuthStore((s) => s.user)!;

  function active(to: string): boolean {
    if (to === "/app") {
      return pathname === "/app" || pathname === "/app/";
    }
    return pathname === to || pathname.startsWith(`${to}/`);
  }

  function renderNav(items: typeof NAV_MAIN) {
    return items.map((item) => {
      const isActive = active(item.to);
      const Icon = item.icon;
      return (
        <Link
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          className={cn(
            "mb-0.5 flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] leading-snug no-underline transition-colors",
            isActive
              ? "bg-[var(--pw-muted)] font-medium text-[var(--pw-text)] ring-1 ring-[var(--pw-border)]"
              : "font-normal text-[var(--pw-text-secondary)] hover:bg-[var(--pw-muted)] hover:text-[var(--pw-text)]",
          )}
        >
          <Icon
            size={16}
            className={cn(
              "w-5 shrink-0",
              isActive ? "text-[var(--pw-logo-blue)]" : "text-[var(--pw-text-muted)]",
            )}
            strokeWidth={1.75}
            aria-hidden
          />
          <span className="min-w-0 flex-1 truncate">{t(item.labelKey)}</span>
        </Link>
      );
    });
  }

  return (
    <aside
      className={cn(
        "pw-school-sidebar fixed inset-y-0 z-[100] flex w-[240px] flex-col transition-transform duration-300 ease-out md:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
      )}
    >
      <div className="border-b border-[var(--pw-border)] bg-white/50 px-5 py-4 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--pw-brand)] font-['DM_Serif_Display',serif] text-lg font-semibold text-white shadow-sm ring-1 ring-[var(--pw-brand-light)]">
            P
          </div>
          <div className="min-w-0">
            <div className="text-[13px] font-semibold leading-tight text-[var(--pw-text)]">{t("salesPortal.brandTitle")}</div>
            <div className="text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--pw-text-muted)]">
              {t("salesPortal.brandSub")}
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2.5 pb-4 pt-3" aria-label={t("salesPortal.brandTitle")}>
        <Fragment>
          <div className="pw-nav-section-label">{t("salesPortal.sectionWork")}</div>
          {renderNav(NAV_MAIN)}
        </Fragment>
        <Fragment>
          <div className="pw-nav-section-label">{t("salesPortal.sectionReports")}</div>
          {renderNav(NAV_REPORTS)}
        </Fragment>
      </nav>

      <div className="border-t border-[var(--pw-border)] bg-white/40 px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-[var(--pw-brand)] text-[11px] font-semibold text-white ring-2 ring-[var(--pw-brand-light)]">
            {initials(user.firstName, user.lastName)}
          </div>
          <div className="min-w-0">
            <div className="truncate text-[12.5px] font-medium text-[var(--pw-text)]">
              {user.firstName} {user.lastName}
            </div>
            <div className="truncate text-[11px] text-[var(--pw-text-muted)]">{t("salesPortal.sidebarRole")}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
