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
    <div className="mb-1 mt-3 px-4 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/30 first:mt-0">
      {t(titleKey)}
    </div>
  );
}

function NavBlock({ items }: { items: NavItem[] }) {
  const { t } = useTranslation();
  return (
    <nav className="space-y-px px-2.5">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === "/admin"}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-2.5 rounded-md px-3 py-2 text-[13.5px] font-normal transition-colors",
              isActive
                ? "bg-white/[0.13] font-medium text-white"
                : "text-white/60 hover:bg-white/[0.07] hover:text-white",
            )
          }
        >
          <item.icon size={15} className="w-5 shrink-0 text-center opacity-90" />
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
        </NavLink>
      ))}
    </nav>
  );
}

export function AdminSidebar() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user)!;
  const logout = useAuthStore((s) => s.logout);
  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() || "A";

  return (
    <aside className="fixed left-0 top-0 z-[100] flex h-screen w-[252px] flex-col overflow-y-auto bg-[#071E36] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex items-center gap-2.5 border-b border-white/[0.08] px-5 py-5">
        <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-lg font-['DM_Serif_Display',serif] text-lg text-white">
          <img src="/src/assets/logo.png" alt="Panworld Admin" className="h-7 w-auto" />
        </div>
        <div className="min-w-0">
          <div className="text-[13px] font-semibold leading-tight text-white">Panworld Admin</div>
          <div className="text-[10px] font-light uppercase tracking-[0.08em] text-white/40">Portal Management</div>
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

      <div className="border-t border-white/[0.08] px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-[#512DA8] text-[11px] font-semibold text-white">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[12.5px] font-medium text-white/80">
              {user.firstName} {user.lastName}
            </div>
            <div className="text-[11px] text-white/40">{t("admin.nav.roleLabel")}</div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void logout()}
          className="mt-3 w-full rounded-md border border-white/10 py-1.5 text-center text-xs text-white/70 hover:bg-white/5"
        >
          {t("admin.nav.signOut")}
        </button>
      </div>
    </aside>
  );
}
