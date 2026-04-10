import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  BarChart3,
  BookOpen,
  Boxes,
  ClipboardList,
  FileText,
  Gauge,
  GraduationCap,
  Headphones,
  LayoutDashboard,
  Megaphone,
  Package,
  ScrollText,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Ticket,
  Users,
  Video,
} from "lucide-react";
import { useAuthStore } from "../../store/auth.store";
import { cn } from "../utils/cn";
import type { UserRole } from "../../types/domain";

type NavItem = { labelKey: string; to: string; gate?: (ctx: GateCtx) => boolean };
type GateCtx = { role: UserRole; isPublisher: boolean; isAdmin: boolean };

const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  "nav.dashboard": LayoutDashboard,
  "nav.catalogue": Boxes,
  "nav.wishlist": Sparkles,
  "nav.curriculumMapping": ScrollText,
  "nav.demoHub": Gauge,
  "nav.announcements": Megaphone,
  "nav.contacts": Users,
  "nav.training": GraduationCap,
  "nav.support": Ticket,
  "nav.webinars": Video,
  "nav.resources": BookOpen,
  "nav.samples": Package,
  "nav.certificates": ShieldCheck,
  "nav.assessment": ClipboardList,
  "nav.analytics": BarChart3,
  "nav.rfq": FileText,
  "nav.orders": ShoppingCart,
  "nav.invoices": FileText,
  "nav.users": Settings,
  "nav.syncLogs": Headphones,
};

export function Sidebar() {
  const { t } = useTranslation();
  const loc = useLocation();
  const user = useAuthStore((s) => s.user)!;

  const ctx: GateCtx = {
    role: user.role,
    isPublisher: user.role === "PUBLISHER",
    isAdmin: user.role === "PANWORLD_ADMIN",
  };

  const groups: { headerKey: string; items: NavItem[] }[] = [
    {
      headerKey: "nav.dashboard",
      items: [
        { labelKey: "nav.dashboard", to: "/app" },
        { labelKey: "nav.catalogue", to: "/app/catalogue", gate: (c) => !c.isPublisher },
        { labelKey: "nav.wishlist", to: "/app/wishlist", gate: (c) => !c.isPublisher },
        { labelKey: "nav.curriculumMapping", to: "/app/curriculum-mapping", gate: (c) => !c.isPublisher },
        { labelKey: "nav.demoHub", to: "/app/demo-hub", gate: (c) => !c.isPublisher },
        { labelKey: "nav.announcements", to: "/app/announcements" },
        { labelKey: "nav.contacts", to: "/app/contacts", gate: (c) => !c.isPublisher },
      ],
    },
    {
      headerKey: "nav.training",
      items: [
        { labelKey: "nav.training", to: "/app/training", gate: (c) => !c.isPublisher },
        { labelKey: "nav.support", to: "/app/support", gate: (c) => !c.isPublisher },
        { labelKey: "nav.webinars", to: "/app/webinars", gate: (c) => !c.isPublisher },
        { labelKey: "nav.resources", to: "/app/resources", gate: (c) => !c.isPublisher },
        { labelKey: "nav.samples", to: "/app/samples", gate: (c) => !c.isPublisher },
        { labelKey: "nav.certificates", to: "/app/certificates", gate: (c) => !c.isPublisher },
        { labelKey: "nav.assessment", to: "/app/assessment", gate: (c) => !c.isPublisher },
        { labelKey: "nav.analytics", to: "/app/analytics" },
      ],
    },
    {
      headerKey: "nav.rfq",
      items: [
        { labelKey: "nav.rfq", to: "/app/rfq", gate: (c) => !c.isPublisher },
        { labelKey: "nav.orders", to: "/app/orders", gate: (c) => !c.isPublisher },
        { labelKey: "nav.invoices", to: "/app/invoices", gate: (c) => !c.isPublisher },
        { labelKey: "nav.users", to: "/app/users", gate: (c) => !c.isPublisher || c.isAdmin },
        { labelKey: "nav.syncLogs", to: "/app/sync-logs", gate: (c) => c.isAdmin },
      ],
    },
  ];

  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 overflow-hidden border-r border-slate-200 bg-white md:block">
      <div className="px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
            <img src="/images.png" alt="Panworld Education" className="h-7 w-auto" />
          </div>
          <div className="text-xs font-semibold tracking-wider text-slate-500">PANWORLD</div>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
          <div className="truncate">
            <span className="font-medium text-slate-900">
              {user.firstName} {user.lastName}
            </span>
          </div>
          <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700">{user.role}</span>
        </div>
      </div>

      <nav className="px-3 pb-5">
        {groups.map((g) => {
          const visible = g.items.filter((i) => (i.gate ? i.gate(ctx) : true));
          if (!visible.length) return null;
          return (
            <div key={g.headerKey} className="mb-4">
              <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">{t(g.headerKey)}</div>
              <div className="space-y-1">
                {visible.map((item) => {
                  const active = loc.pathname === item.to || (item.to !== "/app" && loc.pathname.startsWith(item.to));
                  const Icon = ICONS[item.labelKey] ?? LayoutDashboard;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={cn(
                        "group flex items-center justify-between rounded-xl px-3 py-2 text-sm transition",
                        active ? "bg-slate-900 text-white shadow-sm" : "text-slate-700 hover:bg-slate-100",
                      )}
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <Icon size={16} className={cn("shrink-0", active ? "text-white" : "text-slate-500 group-hover:text-slate-700")} />
                        <span className="truncate">{t(item.labelKey)}</span>
                      </span>
                      {item.gate && !item.gate(ctx) ? (
                        <span className="text-[11px] opacity-70">Locked</span>
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

