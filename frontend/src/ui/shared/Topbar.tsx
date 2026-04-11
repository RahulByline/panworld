import { Link, useLocation } from "react-router-dom";
import { Menu, MessageCircle } from "lucide-react";
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

      <div className="flex items-center gap-2.5 md:gap-2.5">
        <LanguageToggle variant="mvp" />

        {school ? (
          <button
            type="button"
            className="hidden max-w-[200px] items-center gap-2 rounded-full bg-[#F5F4F0] py-1.5 ps-1.5 pe-3 text-[12.5px] text-[#1A1917] md:flex"
          >
            <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[#E8912D] text-[9px] font-semibold text-white">
              {schoolInitials(school.name)}
            </span>
            <span className="truncate">{school.name}</span>
          </button>
        ) : null}

        <button
          type="button"
          className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[#E2E0D9] bg-white text-[#1A1917] transition hover:bg-[#F5F4F0]"
          aria-label="Notifications"
        >
          🔔
          <span className="absolute right-1.5 top-1.5 h-[7px] w-[7px] rounded-full border-[1.5px] border-white bg-[#E8912D]" />
        </button>

        <Link
          to="/app/support"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[#E2E0D9] bg-white text-[#1A1917] no-underline transition hover:bg-[#F5F4F0]"
          aria-label={t("nav.support")}
        >
          <MessageCircle size={18} className="text-[#5C5A55]" />
        </Link>
        <button
          type="button"
          className="rounded-md border border-[#E2E0D9] bg-white px-3 py-1.5 text-[13px] font-medium text-[#C0392B] transition hover:bg-[#F5F4F0]"
          onClick={() => void logout()}
        >
          {t("common.logout")}
        </button>
      </div>
    </header>
  );
}
