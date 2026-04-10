import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  BarChart3,
  School,
  ClipboardList,
  LifeBuoy,
  BookOpen,
  Megaphone,
  KeyRound,
  FolderOpen,
  MessageCircle,
} from "lucide-react";
import { useAuthStore } from "../../store/auth.store";
import { cn } from "../utils/cn";

type NavItem = { to: string; labelKey: string; icon: React.ComponentType<{ size?: number; className?: string }> };

const OVERVIEW: NavItem[] = [
  { to: "/admin", labelKey: "admin.nav.dashboard", icon: LayoutDashboard },
  { to: "/admin/analytics", labelKey: "admin.nav.analytics", icon: BarChart3 },
];

const SCHOOLS: NavItem[] = [
  { to: "/admin/schools", labelKey: "admin.nav.schools", icon: School },
  { to: "/admin/rfq", labelKey: "admin.nav.rfq", icon: ClipboardList },
  { to: "/admin/support", labelKey: "admin.nav.support", icon: LifeBuoy },
];

const CMS: NavItem[] = [
  { to: "/admin/cms/catalogue", labelKey: "admin.nav.cmsCatalogue", icon: BookOpen },
  { to: "/admin/cms/announcements", labelKey: "admin.nav.cmsAnnouncements", icon: Megaphone },
  { to: "/admin/cms/demo-credentials", labelKey: "admin.nav.cmsDemo", icon: KeyRound },
  { to: "/admin/cms/resources", labelKey: "admin.nav.cmsResources", icon: FolderOpen },
];

const AUTO: NavItem[] = [{ to: "/admin/whatsapp-logs", labelKey: "admin.nav.whatsapp", icon: MessageCircle }];

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
          <span className="truncate">{t(item.labelKey)}</span>
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
    <aside className="fixed left-0 top-0 z-[100] flex h-screen w-[240px] flex-col bg-[#071E36]">
      <div className="flex items-center gap-2.5 border-b border-white/[0.08] px-5 py-5">
        <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-lg font-['DM_Serif_Display',serif] text-lg text-white">
          <img src="/images.png" alt="Panworld Admin" className="h-7 w-auto" />
        </div>
        <div className="min-w-0">
          <div className="text-[13px] font-semibold leading-tight text-white">Panworld Admin</div>
          <div className="text-[10px] font-light uppercase tracking-[0.08em] text-white/40">Portal Management</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        <Section titleKey="admin.nav.sectionOverview" />
        <NavBlock items={OVERVIEW} />
        <Section titleKey="admin.nav.sectionSchools" />
        <NavBlock items={SCHOOLS} />
        <Section titleKey="admin.nav.sectionCms" />
        <NavBlock items={CMS} />
        <Section titleKey="admin.nav.sectionAutomation" />
        <NavBlock items={AUTO} />
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
