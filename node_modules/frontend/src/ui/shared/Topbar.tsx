import { Bell, LogOut, Search, ShieldCheck, UserRound } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../store/auth.store";
import { Button } from "../components/Button";
import { LanguageToggle } from "./LanguageToggle";
import { Input } from "../components/Input";

export function Topbar() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user)!;
  const school = useAuthStore((s) => s.school);
  const logout = useAuthStore((s) => s.logout);

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="flex items-center justify-between gap-3 px-4 py-3 md:px-6">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-900">{t("nav.dashboard")}</div>
          <div className="truncate text-xs text-slate-600">
            {school?.name ? (
              <>
                <span className="font-semibold text-slate-800">{school.name}</span>
                <span className="mx-1">•</span>
              </>
            ) : null}
            {user.firstName} {user.lastName} • {user.email}
          </div>
        </div>

        <div className="hidden w-full max-w-md items-center md:flex">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input placeholder="Search…" className="pl-9" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <LanguageToggle />
          </div>
          <Button type="button" variant="secondary" size="sm" className="gap-2">
            <Bell size={16} />
            <span className="hidden md:inline">0</span>
          </Button>
          <Button type="button" variant="secondary" size="sm" className="gap-2">
            <ShieldCheck size={16} />
            <span className="hidden md:inline">{user.role}</span>
          </Button>
          <Button type="button" variant="secondary" size="sm" className="gap-2 md:hidden">
            <UserRound size={16} />
          </Button>
          <Button type="button" variant="ghost" size="sm" className="gap-2" onClick={() => void logout()}>
            <LogOut size={16} />
            <span className="hidden md:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

