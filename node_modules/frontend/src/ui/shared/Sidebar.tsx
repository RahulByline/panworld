import { Fragment, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { LucideIcon } from "lucide-react";
import {
  Award,
  BarChart3,
  BookOpen,
  ClipboardList,
  FolderOpen,
  GraduationCap,
  Heart,
  Landmark,
  LayoutDashboard,
  LifeBuoy,
  Map as MapIcon,
  Megaphone,
  Mic,
  Microscope,
  Package,
  PlayCircle,
  Receipt,
  RefreshCw,
  ShoppingBag,
  TrendingUp,
  UserCog,
  Users,
} from "lucide-react";
import { useAuthStore } from "../../store/auth.store";
import { cn } from "../utils/cn";
import type { UserRole } from "../../types/domain";

type GateCtx = { role: UserRole; isPublisher: boolean; isAdmin: boolean };

type NavGroup = "discover" | "programs" | "operations";

const GROUP_ORDER: NavGroup[] = ["discover", "programs", "operations"];

const GROUP_LABEL_KEY: Record<NavGroup, string> = {
  discover: "nav.sectionMain",
  programs: "nav.sectionLearning",
  operations: "nav.sectionOperations",
};

type NavItem = {
  to: string;
  labelKey: string;
  icon: LucideIcon;
  group: NavGroup;
  gate?: (ctx: GateCtx) => boolean;
};

const NAV_ITEMS: NavItem[] = [
  { to: "/app", labelKey: "nav.dashboard", icon: LayoutDashboard, group: "discover" },
  { to: "/app/catalogue", labelKey: "nav.cmsTextbooks", icon: BookOpen, group: "discover", gate: (c) => !c.isPublisher },
  { to: "/app/library", labelKey: "nav.libraryBooks", icon: Landmark, group: "discover", gate: (c) => !c.isPublisher },
  { to: "/app/kits", labelKey: "nav.kits", icon: Microscope, group: "discover", gate: (c) => !c.isPublisher },
  { to: "/app/curriculum-mapping", labelKey: "nav.curriculumMapping", icon: MapIcon, group: "discover", gate: (c) => !c.isPublisher },
  { to: "/app/demo-hub", labelKey: "nav.demoHub", icon: PlayCircle, group: "discover", gate: (c) => !c.isPublisher },
  { to: "/app/wishlist", labelKey: "nav.wishlist", icon: Heart, group: "discover", gate: (c) => !c.isPublisher },
  { to: "/app/announcements", labelKey: "nav.announcements", icon: Megaphone, group: "discover" },
  { to: "/app/contacts", labelKey: "nav.contactDirectory", icon: Users, group: "discover", gate: (c) => !c.isPublisher },
  { to: "/app/training", labelKey: "nav.productTraining", icon: GraduationCap, group: "programs", gate: (c) => !c.isPublisher },
  { to: "/app/assessment", labelKey: "nav.assessment", icon: BarChart3, group: "programs", gate: (c) => !c.isPublisher },
  { to: "/app/analytics", labelKey: "nav.analytics", icon: TrendingUp, group: "programs" },
  { to: "/app/webinars", labelKey: "nav.pdWebinars", icon: Mic, group: "programs", gate: (c) => !c.isPublisher },
  { to: "/app/resources", labelKey: "nav.resources", icon: FolderOpen, group: "programs", gate: (c) => !c.isPublisher },
  { to: "/app/samples", labelKey: "nav.samples", icon: Package, group: "programs", gate: (c) => !c.isPublisher },
  { to: "/app/certificates", labelKey: "nav.myCertificates", icon: Award, group: "programs", gate: (c) => !c.isPublisher },
  { to: "/app/support", labelKey: "nav.support", icon: LifeBuoy, group: "programs", gate: (c) => !c.isPublisher },
  { to: "/app/rfq", labelKey: "nav.rfqOrders", icon: ClipboardList, group: "operations", gate: (c) => !c.isPublisher },
  { to: "/app/orders", labelKey: "nav.orderHistory", icon: ShoppingBag, group: "operations", gate: (c) => !c.isPublisher },
  { to: "/app/invoices", labelKey: "nav.invoices", icon: Receipt, group: "operations", gate: (c) => !c.isPublisher },
  { to: "/app/users", labelKey: "nav.userManagement", icon: UserCog, group: "operations", gate: (c) => !c.isPublisher || c.isAdmin },
  { to: "/app/sync-logs", labelKey: "nav.syncLogs", icon: RefreshCw, group: "operations", gate: (c) => c.isAdmin },
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
  const [logoFailed, setLogoFailed] = useState(false);

  const ctx: GateCtx = useMemo(
    () => ({
      role: user.role,
      isPublisher: user.role === "PUBLISHER",
      isAdmin: user.role === "PANWORLD_ADMIN",
    }),
    [user.role],
  );

  const visibleNav = useMemo(() => NAV_ITEMS.filter((i) => !i.gate || i.gate(ctx)), [ctx]);

  const navSections = useMemo(() => {
    const byGroup = new Map<NavGroup, NavItem[]>();
    for (const item of visibleNav) {
      const list = byGroup.get(item.group) ?? [];
      list.push(item);
      byGroup.set(item.group, list);
    }
    return GROUP_ORDER.filter((g) => (byGroup.get(g)?.length ?? 0) > 0).map((group) => ({
      group,
      labelKey: GROUP_LABEL_KEY[group],
      items: byGroup.get(group)!,
    }));
  }, [visibleNav]);

  const roleLabel = useMemo(() => {
    const r = user.role.replace(/_/g, " ");
    return r.charAt(0) + r.slice(1).toLowerCase();
  }, [user.role]);

  return (
    <aside
      className={cn(
        "pw-school-sidebar fixed inset-y-0 z-[100] flex w-[240px] flex-col transition-transform duration-300 ease-out md:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
      )}
    >
      <div className="border-b border-[var(--pw-border)] bg-white/50 px-5 py-4 backdrop-blur-sm">
        {!logoFailed ? (
          <div>
            <img
              src="/images.png"
              alt="Panworld Education"
              className="h-9 w-auto max-w-full object-contain object-left"
              onError={() => setLogoFailed(true)}
            />
            <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--pw-text-muted)]">
              {t("navMvp.portalSubtitle")}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#7ec8e8] via-[#5cadce] to-[#4a9d7a] font-serif text-lg font-semibold text-white shadow-sm ring-1 ring-white/90">
              P
              <span className="absolute end-0.5 top-0.5 h-2 w-2 rounded-full bg-[#d64545] ring-1 ring-white/90" aria-hidden />
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-semibold leading-tight text-[var(--pw-text)]">Panworld</div>
              <div className="text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--pw-text-muted)]">
                {t("navMvp.portalSubtitle")}
              </div>
            </div>
          </div>
        )}
      </div>

      <nav
        className="flex-1 overflow-y-auto px-2.5 pb-4 pt-3"
        aria-label={t("navMvp.portalSubtitle")}
      >
        {navSections.map(({ group, labelKey, items }) => (
          <Fragment key={group}>
            <div className="pw-nav-section-label">{t(labelKey)}</div>
            {items.map((item) => {
              const active = navActive(item.to, pathname, search);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={onNavigate}
                  className={cn(
                    "mb-0.5 flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] leading-snug no-underline transition-colors",
                    active
                      ? "bg-[var(--pw-muted)] font-medium text-[var(--pw-text)] ring-1 ring-[var(--pw-border)]"
                      : "font-normal text-[var(--pw-text-secondary)] hover:bg-[var(--pw-muted)] hover:text-[var(--pw-text)]",
                  )}
                >
                  <Icon
                    size={16}
                    className={cn(
                      "w-5 shrink-0",
                      active ? "text-[var(--pw-logo-blue)]" : "text-[var(--pw-text-muted)]",
                    )}
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  <span className="min-w-0 flex-1 truncate">{t(item.labelKey)}</span>
                </Link>
              );
            })}
          </Fragment>
        ))}
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
            <div className="truncate text-[11px] text-[var(--pw-text-muted)]">{school?.name ?? roleLabel}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
