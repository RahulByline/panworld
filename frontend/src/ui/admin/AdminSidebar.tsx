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
  Users,
  ScrollText,
  Building2,
  Plug,
} from "lucide-react";
import { useAuthStore } from "../../store/auth.store";
import { cn } from "../utils/cn";

type NavItem = { to: string; labelKey: string; icon: React.ComponentType<{ size?: number; className?: string }> };

const OVERVIEW: NavItem[] = [
  { to: "/admin", labelKey: "admin.nav.dashboard", icon: LayoutDashboard },
  { to: "/admin/analytics", labelKey: "admin.nav.analytics", icon: BarChart3 },
  { to: "/admin/account-managers", labelKey: "admin.nav.accountManagers", icon: Users },
  { to: "/admin/audit-log", labelKey: "admin.nav.auditLog", icon: ScrollText },
];

const SCHOOLS: NavItem[] = [
  { to: "/admin/schools", labelKey: "admin.nav.schools", icon: School },
  { to: "/admin/rfq", labelKey: "admin.nav.rfq", icon: ClipboardList },
  { to: "/admin/support", labelKey: "admin.nav.support", icon: LifeBuoy },
];

const PLATFORM: NavItem[] = [
  { to: "/admin/publishers", labelKey: "admin.nav.publishers", icon: Building2 },
  { to: "/admin/integrations", labelKey: "admin.nav.integrations", icon: Plug },
];

const CMS: NavItem[] = [
  { to: "/admin/cms/catalogue", labelKey: "admin.nav.cmsCatalogue", icon: BookOpen },
  { to: "/admin/cms/announcements", labelKey: "admin.nav.cmsAnnouncements", icon: Megaphone },
  { to: "/admin/cms/publisher-access", labelKey: "admin.nav.publisherAccess", icon: KeyRound },
  { to: "/admin/cms/resources", labelKey: "admin.nav.cmsResources", icon: FolderOpen },
];

const AUTO: NavItem[] = [{ to: "/admin/whatsapp-logs", labelKey: "admin.nav.whatsapp", icon: MessageCircle }];

function Section({ titleKey }: { titleKey: string }) {
  const { t } = useTranslation();
  return <div className="pw-nav-section-label">{t(titleKey)}</div>;
}

function NavBlock({ items }: { items: NavItem[] }) {
  const { t } = useTranslation();
  return (
    <>
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/admin"}
            className={({ isActive }) =>
              cn(
                "mb-0.5 flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] leading-snug no-underline transition-colors",
                isActive
                  ? "bg-[var(--pw-muted)] font-medium text-[var(--pw-text)] ring-1 ring-[var(--pw-border)]"
                  : "font-normal text-[var(--pw-text-secondary)] hover:bg-[var(--pw-muted)] hover:text-[var(--pw-text)]",
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={16}
                  className={cn(
                    "w-5 shrink-0",
                    isActive ? "text-[var(--pw-logo-blue)]" : "text-[var(--pw-text-muted)]",
                  )}
                />
                <span className="truncate">{t(item.labelKey)}</span>
              </>
            )}
          </NavLink>
        );
      })}
    </>
  );
}

export function AdminSidebar() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user)!;
  const logout = useAuthStore((s) => s.logout);
  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() || "A";

  return (
    <aside className="pw-school-sidebar fixed left-0 top-0 z-[100] flex h-screen w-[240px] flex-col">
      <div className="border-b border-[var(--pw-border)] bg-white/50 px-5 py-4 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center overflow-hidden rounded-xl">
            <img src="/images.png" alt="Panworld Admin" className="h-7 w-auto max-w-full object-contain" />
          </div>
          <div className="min-w-0">
            <div className="text-[13px] font-semibold leading-tight text-[var(--pw-text)]">Panworld Admin</div>
            <div className="text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--pw-text-muted)]">
              Portal Management
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2.5 pb-4 pt-3">
        <Section titleKey="admin.nav.sectionOverview" />
        <NavBlock items={OVERVIEW} />
        <Section titleKey="admin.nav.sectionSchools" />
        <NavBlock items={SCHOOLS} />
        <Section titleKey="admin.nav.sectionPlatform" />
        <NavBlock items={PLATFORM} />
        <Section titleKey="admin.nav.sectionCms" />
        <NavBlock items={CMS} />
        <Section titleKey="admin.nav.sectionAutomation" />
        <NavBlock items={AUTO} />
      </div>

      <div className="border-t border-[var(--pw-border)] bg-white/40 px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-[var(--pw-brand)] text-[11px] font-semibold text-white ring-2 ring-[var(--pw-brand-light)]">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[12.5px] font-medium text-[var(--pw-text)]">
              {user.firstName} {user.lastName}
            </div>
            <div className="truncate text-[11px] text-[var(--pw-text-muted)]">{t("admin.nav.roleLabel")}</div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void logout()}
          className="mt-3 w-full rounded-md border border-[var(--pw-border)] bg-white py-1.5 text-center text-xs font-medium text-[var(--pw-text-secondary)] transition hover:bg-[var(--pw-muted)]"
        >
          {t("admin.nav.signOut")}
        </button>
      </div>
    </aside>
  );
}
