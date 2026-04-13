import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  BarChart3,
  School,
  ClipboardList,
  LifeBuoy,
  BookOpen,
  Library,
  Package,
  Megaphone,
  KeyRound,
  FolderOpen,
  MessageCircle,
  Users,
  ScrollText,
  Building2,
  Plug,
  UserCircle,
  Pin,
  ShoppingCart,
  FileText,
  Mails,
  Video,
  Award,
  LineChart,
  Link2,
  Settings,
} from "lucide-react";
import { useAuthStore } from "../../store/auth.store";
import { cn } from "../utils/cn";

type NavItem = { to: string; labelKey: string; icon: React.ComponentType<{ size?: number; className?: string }>; badge?: string; badgeDanger?: boolean };

const OVERVIEW: NavItem[] = [
  { to: "/admin", labelKey: "admin.nav.dashboard", icon: LayoutDashboard },
  { to: "/admin/analytics", labelKey: "admin.nav.analytics", icon: BarChart3, badge: "Live" },
];

const CATALOG: NavItem[] = [
  { to: "/admin/cms/textbooks", labelKey: "admin.nav.cmsTextbooks", icon: BookOpen },
  { to: "/admin/cms/library", labelKey: "admin.nav.cmsLibrary", icon: Library },
  { to: "/admin/cms/kits", labelKey: "admin.nav.cmsKits", icon: Package },
  { to: "/admin/cms/publisher-access", labelKey: "admin.nav.publisherAccess", icon: KeyRound },
  { to: "/admin/cms/resources", labelKey: "admin.nav.cmsResources", icon: FolderOpen },
  { to: "/admin/cms/announcements", labelKey: "admin.nav.cmsAnnouncements", icon: Megaphone },
];

const SCHOOLS_PEOPLE: NavItem[] = [
  { to: "/admin/schools", labelKey: "admin.nav.schools", icon: School, badge: "147" },
  { to: "/admin/users", labelKey: "admin.nav.users", icon: UserCircle },
  { to: "/admin/account-managers", labelKey: "admin.nav.salesTeam", icon: Users },
  { to: "/admin/assignments", labelKey: "admin.nav.assignments", icon: Pin },
];

const OPERATIONS: NavItem[] = [
  { to: "/admin/rfq", labelKey: "admin.nav.rfq", icon: ClipboardList, badge: "8", badgeDanger: true },
  { to: "/admin/orders", labelKey: "admin.nav.orders", icon: ShoppingCart },
  { to: "/admin/invoices", labelKey: "admin.nav.invoices", icon: FileText },
  { to: "/admin/samples", labelKey: "admin.nav.samples", icon: Mails },
  { to: "/admin/support", labelKey: "admin.nav.support", icon: LifeBuoy, badge: "5", badgeDanger: true },
  { to: "/admin/webinars", labelKey: "admin.nav.webinars", icon: Video },
  { to: "/admin/certifications", labelKey: "admin.nav.certifications", icon: Award },
];

const PLATFORM: NavItem[] = [
  { to: "/admin/publishers", labelKey: "admin.nav.publishers", icon: Building2 },
  { to: "/admin/publisher-dashboard", labelKey: "admin.nav.publisherDashboard", icon: LineChart },
  { to: "/admin/integrations", labelKey: "admin.nav.integrations", icon: Plug },
];

const AUTO: NavItem[] = [
  { to: "/admin/whatsapp-logs", labelKey: "admin.nav.whatsapp", icon: MessageCircle },
  { to: "/admin/odoo", labelKey: "admin.nav.odoo", icon: Link2 },
];

const SYSTEM: NavItem[] = [
  { to: "/admin/audit-log", labelKey: "admin.nav.systemLogs", icon: ScrollText },
  { to: "/admin/settings", labelKey: "admin.nav.settings", icon: Settings },
];

function Section({ titleKey }: { titleKey: string }) {
  const { t } = useTranslation();
  return (
    <div className="px-3 pb-1 pt-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400 first:pt-3">{t(titleKey)}</div>
  );
}

function NavBlock({ items }: { items: NavItem[] }) {
  const { t } = useTranslation();
  return (
    <nav className="space-y-0.5 px-2.5">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === "/admin"}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-[13.5px] transition-colors",
              isActive
                ? "bg-sky-50 font-medium text-blue-600 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.12)]"
                : "font-normal text-slate-600 hover:bg-slate-100/90 hover:text-slate-900",
            )
          }
        >
          {({ isActive }) => (
            <>
              <item.icon size={18} className={cn("shrink-0", isActive ? "text-blue-600" : "text-slate-400")} aria-hidden />
              <span className="min-w-0 flex-1 truncate">{t(item.labelKey)}</span>
              {item.badge ? (
                <span
                  className={cn(
                    "shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold text-white",
                    item.badgeDanger ? "bg-[#C0392B]" : "bg-[#E8912D]",
                  )}
                >
                  {item.badge}
                </span>
              ) : null}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

const SIDEBAR_W = 268;

export function AdminSidebar() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user)!;
  const logout = useAuthStore((s) => s.logout);
  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() || "PA";

  return (
    <aside
      className="fixed left-0 top-0 z-[100] flex h-screen w-[268px] flex-col overflow-y-auto border-r border-slate-200/90 bg-[#F4F6F9] [scrollbar-width:thin] [scrollbar-color:rgba(148,163,184,0.5)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300/70"
    >
      <div className="flex shrink-0 items-center gap-3 border-b border-slate-200/90 bg-[#F4F6F9] px-4 py-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-slate-200/80">
          <img src="/src/assets/logo.png" alt="" className="h-7 w-auto object-contain" />
        </div>
        <div className="min-w-0">
          <div className="truncate text-[14px] font-semibold leading-tight text-slate-800">{t("admin.nav.brandTitle")}</div>
          <div className="mt-0.5 truncate text-[10px] font-medium uppercase tracking-[0.14em] text-slate-400">
            {t("admin.nav.brandSubtitle")}
          </div>
        </div>
      </div>

      <div className="flex-1 py-2">
        <Section titleKey="admin.nav.sectionOverview" />
        <NavBlock items={OVERVIEW} />
        <Section titleKey="admin.nav.sectionCatalog" />
        <NavBlock items={CATALOG} />
        <Section titleKey="admin.nav.sectionSchoolsPeople" />
        <NavBlock items={SCHOOLS_PEOPLE} />
        <Section titleKey="admin.nav.sectionOperations" />
        <NavBlock items={OPERATIONS} />
        <Section titleKey="admin.nav.sectionPlatform" />
        <NavBlock items={PLATFORM} />
        <Section titleKey="admin.nav.sectionAutomation" />
        <NavBlock items={AUTO} />
        <Section titleKey="admin.nav.sectionSystem" />
        <NavBlock items={SYSTEM} />
      </div>

      <div className="mt-auto shrink-0 border-t border-slate-200/90 bg-[#F0F2F6] px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0A3D62] text-[11px] font-semibold text-white shadow-sm ring-2 ring-white">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-semibold text-slate-800">
              {user.firstName} {user.lastName}
            </div>
            <div className="truncate text-[11px] text-slate-500">{t("admin.nav.roleLabel")}</div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void logout()}
          className="mt-3 w-full rounded-lg border border-slate-200 bg-white py-2 text-center text-[13px] font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
        >
          {t("admin.nav.signOut")}
        </button>
      </div>
    </aside>
  );
}

export const ADMIN_SIDEBAR_WIDTH_PX = SIDEBAR_W;
