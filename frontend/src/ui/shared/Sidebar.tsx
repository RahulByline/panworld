import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../store/auth.store";
import { cn } from "../utils/cn";
import type { UserRole } from "../../types/domain";

type GateCtx = { role: UserRole; isPublisher: boolean; isAdmin: boolean };
type NavItem = { to: string; labelKey: string; icon: string; gate?: (ctx: GateCtx) => boolean };
type NavSection = { phaseKey: string; items: NavItem[] };

const NAV: NavSection[] = [
  {
    phaseKey: "navMvp.phase1",
    items: [
      { to: "/app", labelKey: "nav.dashboard", icon: "⊞" },
      { to: "/app/catalogue", labelKey: "nav.catalogueLong", icon: "📚", gate: (c) => !c.isPublisher },
      { to: "/app/library", labelKey: "nav.libraryBooks", icon: "🏛", gate: (c) => !c.isPublisher },
      { to: "/app/kits", labelKey: "nav.kits", icon: "🔬", gate: (c) => !c.isPublisher },
      { to: "/app/curriculum-mapping", labelKey: "nav.curriculumMapping", icon: "🗺", gate: (c) => !c.isPublisher },
      { to: "/app/demo-hub", labelKey: "nav.demoHub", icon: "▶", gate: (c) => !c.isPublisher },
      { to: "/app/wishlist", labelKey: "nav.wishlist", icon: "♡", gate: (c) => !c.isPublisher },
      { to: "/app/announcements", labelKey: "nav.announcements", icon: "📣" },
      { to: "/app/contacts", labelKey: "nav.contactDirectory", icon: "👥", gate: (c) => !c.isPublisher },
    ],
  },
  {
    phaseKey: "navMvp.phase2",
    items: [
      { to: "/app/training", labelKey: "nav.productTraining", icon: "🎓", gate: (c) => !c.isPublisher },
      { to: "/app/assessment", labelKey: "nav.assessment", icon: "📊", gate: (c) => !c.isPublisher },
      { to: "/app/analytics", labelKey: "nav.analytics", icon: "📈" },
      { to: "/app/webinars", labelKey: "nav.pdWebinars", icon: "🎤", gate: (c) => !c.isPublisher },
      { to: "/app/resources", labelKey: "nav.resources", icon: "📁", gate: (c) => !c.isPublisher },
      { to: "/app/samples", labelKey: "nav.samples", icon: "📦", gate: (c) => !c.isPublisher },
      { to: "/app/certificates", labelKey: "nav.myCertificates", icon: "🏅", gate: (c) => !c.isPublisher },
      { to: "/app/support", labelKey: "nav.support", icon: "🛟", gate: (c) => !c.isPublisher },
    ],
  },
  {
    phaseKey: "navMvp.phase3",
    items: [
      { to: "/app/rfq", labelKey: "nav.rfqOrders", icon: "📋", gate: (c) => !c.isPublisher },
      { to: "/app/orders", labelKey: "nav.orderHistory", icon: "📦", gate: (c) => !c.isPublisher },
      { to: "/app/invoices", labelKey: "nav.invoices", icon: "🧾", gate: (c) => !c.isPublisher },
      { to: "/app/users", labelKey: "nav.userManagement", icon: "⚙", gate: (c) => !c.isPublisher || c.isAdmin },
      { to: "/app/sync-logs", labelKey: "nav.syncLogs", icon: "🎧", gate: (c) => c.isAdmin },
    ],
  },
];

function navActive(to: string, pathname: string, search: string): boolean {
  if (to === "/app") {
    const p = pathname.replace(/\/$/, "") || "/app";
    return p === "/app";
  }
  const [rawPath, rawQs] = to.split("?");
  const path = rawPath.replace(/\/$/, "") || "/app";
  const p = pathname.replace(/\/$/, "") || "/app";
  const cur = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  if (rawQs) {
    const want = new URLSearchParams(rawQs);
    if (p !== path) return false;
    for (const [k, v] of want.entries()) {
      if (cur.get(k) !== v) return false;
    }
    return true;
  }
  if (path === "/app/catalogue") {
    return p === "/app/catalogue" && !cur.get("tab");
  }
  return p === path || p.startsWith(`${path}/`);
}

function initials(first: string, last: string): string {
  const a = first.trim().charAt(0);
  const b = last.trim().charAt(0);
  return `${a}${b}`.toUpperCase() || "PW";
}

type SidebarProps = {
  mobileOpen: boolean;
  onNavigate: () => void;
};

export function Sidebar({ mobileOpen, onNavigate }: SidebarProps) {
  const { t } = useTranslation();
  const loc = useLocation();
  const { pathname, search } = loc;
  const user = useAuthStore((s) => s.user)!;
  const school = useAuthStore((s) => s.school);

  const ctx: GateCtx = useMemo(
    () => ({
      role: user.role,
      isPublisher: user.role === "PUBLISHER",
      isAdmin: user.role === "PANWORLD_ADMIN",
    }),
    [user.role],
  );

  const roleLabel = useMemo(() => {
    const r = user.role.replace(/_/g, " ");
    return r.charAt(0) + r.slice(1).toLowerCase();
  }, [user.role]);

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
          <div className="text-[13px] font-semibold leading-tight text-white">Panworld</div>
          <div className="text-[10px] font-light uppercase tracking-[0.08em] text-white/50">{t("navMvp.portalSubtitle")}</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2.5 pb-3 pt-1">
        {NAV.map((section) => {
          const items = section.items.filter((i) => (i.gate ? i.gate(ctx) : true));
          if (!items.length) return null;
          return (
            <div key={section.phaseKey} className="mb-1">
              <div className="mx-2 mb-1 mt-3 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/35 first:mt-0">
                {t(section.phaseKey)}
              </div>
              {items.map((item) => {
                const active = navActive(item.to, pathname, search);
                return (
                  <Link
                    key={`${section.phaseKey}-${item.labelKey}`}
                    to={item.to}
                    onClick={onNavigate}
                    className={cn(
                      "mb-px flex cursor-pointer items-center gap-2.5 rounded-md px-3 py-2.5 text-[13.5px] no-underline transition-colors",
                      active
                        ? "bg-white/15 font-medium text-white"
                        : "font-normal text-white/65 hover:bg-white/[0.08] hover:text-white",
                    )}
                  >
                    <span className="w-5 shrink-0 text-center text-[15px]">{item.icon}</span>
                    <span className="min-w-0 flex-1 truncate">{t(item.labelKey)}</span>
                  </Link>
                );
              })}
            </div>
          );
        })}
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
            <div className="truncate text-[11px] text-white/40">{school?.name ?? roleLabel}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
