import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../store/auth.store";
import { cn } from "../utils/cn";

function initials(first: string, last: string) {
  const a = first.trim().charAt(0);
  const b = last.trim().charAt(0);
  return `${a}${b}`.toUpperCase() || "AM";
}

const NAV: { to: string; labelKey: string; icon: string }[] = [
  { to: "/app", labelKey: "salesPortal.nav.dashboard", icon: "⊞" },
  { to: "/app/sales/schools", labelKey: "salesPortal.nav.schools", icon: "🏫" },
  { to: "/app/sales/pipeline", labelKey: "salesPortal.nav.pipeline", icon: "📊" },
  { to: "/app/sales/signals", labelKey: "salesPortal.nav.signals", icon: "🎯" },
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

  return (
    <aside
      className={cn(
        "fixed inset-y-0 z-[100] flex w-[240px] flex-col bg-[#0A3D62] transition-transform duration-300 ease-out md:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
      )}
    >
      <div className="flex items-center gap-2.5 border-b border-white/10 px-5 py-5">
        <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-lg bg-[#E8912D] font-serif text-lg font-normal text-white">
          P
        </div>
        <div className="min-w-0">
          <div className="text-[13px] font-semibold leading-tight text-white">{t("salesPortal.brandTitle")}</div>
          <div className="text-[10px] font-light uppercase tracking-[0.08em] text-white/40">{t("salesPortal.brandSub")}</div>
        </div>
      </div>

      <div className="mx-4 mb-1 mt-3 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/35">{t("salesPortal.sectionWork")}</div>
      <nav className="flex-1 overflow-y-auto px-2.5 pb-3">
        {NAV.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "mb-px flex cursor-pointer items-center gap-2.5 rounded-md px-3 py-2.5 text-[13.5px] no-underline transition-colors",
              active(item.to) ? "bg-white/15 font-medium text-white" : "font-normal text-white/65 hover:bg-white/[0.08] hover:text-white",
            )}
          >
            <span className="w-5 shrink-0 text-center text-[15px]">{item.icon}</span>
            <span className="min-w-0 flex-1 truncate">{t(item.labelKey)}</span>
          </Link>
        ))}

        <div className="mx-2 mb-1 mt-4 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/35">{t("salesPortal.sectionReports")}</div>
        <Link
          to="/app/sales/performance"
          onClick={onNavigate}
          className={cn(
            "mb-px flex cursor-pointer items-center gap-2.5 rounded-md px-3 py-2.5 text-[13.5px] no-underline transition-colors",
            active("/app/sales/performance")
              ? "bg-white/15 font-medium text-white"
              : "font-normal text-white/65 hover:bg-white/[0.08] hover:text-white",
          )}
        >
          <span className="w-5 shrink-0 text-center text-[15px]">📈</span>
          <span className="min-w-0 flex-1 truncate">{t("salesPortal.nav.performance")}</span>
        </Link>
      </nav>

      <div className="border-t border-white/10 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-[#E8912D] text-[11px] font-semibold text-white">
            {initials(user.firstName, user.lastName)}
          </div>
          <div className="min-w-0">
            <div className="truncate text-[12.5px] font-medium text-white/80">
              {user.firstName} {user.lastName}
            </div>
            <div className="truncate text-[11px] text-white/40">{t("salesPortal.sidebarRole")}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
