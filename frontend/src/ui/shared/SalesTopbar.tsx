import { useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
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
        "fixed top-0 z-50 flex h-[60px] items-center gap-4 border-b border-[#E2E0D9] bg-white px-4 md:start-[240px] md:px-7",
        "start-0 end-0",
      )}
    >
      <button
        type="button"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[#E2E0D9] bg-white text-[#1A1917] md:hidden"
        aria-label="Open menu"
        onClick={onMenuClick}
      >
        <Menu size={18} />
      </button>

      <div className="min-w-0 flex-1 text-[15px] font-medium text-[#1A1917]">{t(titleKey)}</div>

      <div className="flex flex-wrap items-center gap-2 md:gap-2.5">
        <button
          type="button"
          className="rounded-md border border-[#E2E0D9] bg-white px-3 py-1.5 text-[13px] font-medium text-[#C0392B] transition hover:bg-[#F5F4F0]"
          onClick={() => void logout()}
        >
          {t("common.logout")}
        </button>

        <div className="hidden rounded-full bg-[#FDEBD0] px-3 py-1.5 text-xs font-semibold text-[#E8912D] sm:block">
          {t("salesPortal.topbar.regionBadge")}
        </div>

        <LanguageToggle variant="mvp" />

        <button
          type="button"
          className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[#E2E0D9] bg-white text-[#1A1917] transition hover:bg-[#F5F4F0]"
          aria-label="Notifications"
        >
          🔔
          <span className="absolute right-1.5 top-1.5 h-[7px] w-[7px] rounded-full border-[1.5px] border-white bg-[#E8912D]" />
        </button>
      </div>
    </header>
  );
}
