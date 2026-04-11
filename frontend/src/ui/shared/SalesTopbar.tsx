import { useLocation } from "react-router-dom";
import { Bell, Menu } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../store/auth.store";
import { LanguageToggle } from "./LanguageToggle";
import { salesRouteTitleKey } from "./salesRouteTitle";
import { cn } from "../utils/cn";

type SalesTopbarProps = {
  onMenuClick: () => void;
};

export function SalesTopbar({ onMenuClick }: SalesTopbarProps) {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const logout = useAuthStore((s) => s.logout);
  const titleKey = salesRouteTitleKey(pathname);

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

      <div className="flex flex-wrap items-center gap-2 md:gap-2.5">
        <LanguageToggle variant="mvp" />

        <div className="hidden rounded-full bg-[var(--pw-accent-light)] px-3 py-1.5 text-xs font-semibold text-[var(--pw-accent)] ring-1 ring-[var(--pw-border)]/40 sm:block">
          {t("salesPortal.topbar.regionBadge")}
        </div>

        <button
          type="button"
          className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[var(--pw-border)] bg-white text-[var(--pw-text-secondary)] transition hover:bg-[var(--pw-muted)]"
          aria-label="Notifications"
        >
          <Bell size={18} className="text-[var(--pw-brand)]" aria-hidden />
          <span className="absolute right-1.5 top-1.5 h-[7px] w-[7px] rounded-full border-[1.5px] border-white bg-[var(--pw-accent)]" />
        </button>

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
