import { Link, useLocation } from "react-router-dom";
import { Bell, Menu, MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../store/auth.store";
import { LanguageToggle } from "./LanguageToggle";
import { routeTitleKey } from "./appRouteTitle";
import { cn } from "../utils/cn";

function schoolInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0]!.charAt(0) + parts[parts.length - 1]!.charAt(0)).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || "SC";
}

type TopbarProps = {
  onMenuClick: () => void;
};

export function Topbar({ onMenuClick }: TopbarProps) {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const school = useAuthStore((s) => s.school);
  const logout = useAuthStore((s) => s.logout);

  const titleKey = routeTitleKey(pathname);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 flex h-[60px] items-center gap-4 border-b border-[var(--pw-border)] bg-white/95 px-4 shadow-[0_1px_0_rgba(15,23,42,0.06)] backdrop-blur-sm md:start-[240px] md:px-7",
        "start-0 end-0",
      )}
    >
      <button
        type="button"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[var(--pw-border)] bg-white text-[var(--pw-text)] md:hidden"
        aria-label="Open menu"
        onClick={onMenuClick}
      >
        <Menu size={18} />
      </button>

      <div className="min-w-0 flex-1 text-[15px] font-medium text-[var(--pw-text)]">{t(titleKey)}</div>

      <div className="flex items-center gap-2.5 md:gap-2.5">
        <LanguageToggle variant="mvp" />

        {school ? (
          <button
            type="button"
            className="hidden max-w-[200px] items-center gap-2 rounded-full bg-[var(--pw-muted)] py-1.5 ps-1.5 pe-3 text-[12.5px] text-[var(--pw-text)] ring-1 ring-[var(--pw-border)]/60 md:flex"
          >
            <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[var(--pw-brand)] text-[9px] font-semibold text-white">
              {schoolInitials(school.name)}
            </span>
            <span className="truncate">{school.name}</span>
          </button>
        ) : null}

        <button
          type="button"
          className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[var(--pw-border)] bg-white text-[var(--pw-text-secondary)] transition hover:bg-[var(--pw-muted)]"
          aria-label="Notifications"
        >
          <Bell size={18} className="text-[var(--pw-brand)]" aria-hidden />
          <span className="absolute right-1.5 top-1.5 h-[7px] w-[7px] rounded-full border-[1.5px] border-white bg-[var(--pw-accent)]" />
        </button>

        <Link
          to="/app/support"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[var(--pw-border)] bg-white text-[var(--pw-text)] no-underline transition hover:bg-[var(--pw-muted)]"
          aria-label={t("nav.support")}
        >
          <MessageCircle size={18} className="text-[var(--pw-text-secondary)]" />
        </Link>
        <button
          type="button"
          className="rounded-md border border-[var(--pw-border)] bg-white px-3 py-1.5 text-[13px] font-medium text-[var(--pw-accent)] transition hover:bg-[var(--pw-muted)]"
          onClick={() => void logout()}
        >
          {t("common.logout")}
        </button>
      </div>
    </header>
  );
}
