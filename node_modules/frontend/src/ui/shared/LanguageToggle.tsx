import { useTranslation } from "react-i18next";
import { cn } from "../utils/cn";
import { useAuthStore } from "../../store/auth.store";
import { Button } from "../components/Button";

export function LanguageToggle({ variant = "default" }: { variant?: "default" | "mvp" }) {
  const { i18n, t } = useTranslation();
  const setLanguage = useAuthStore((s) => s.setLanguage);

  const isAr = i18n.language === "ar";

  if (variant === "mvp") {
    return (
      <div className="flex gap-0.5 rounded-[20px] bg-[var(--pw-muted)] p-0.5 ring-1 ring-[var(--pw-border)]/50">
        <button
          type="button"
          className={cn(
            "rounded-2xl px-3 py-1 text-xs font-medium transition-colors",
            !isAr ? "bg-white text-[var(--pw-brand)] shadow-sm" : "text-[var(--pw-text-secondary)] hover:text-[var(--pw-text)]",
          )}
          onClick={() => {
            void i18n.changeLanguage("en");
            setLanguage("en");
          }}
        >
          EN
        </button>
        <button
          type="button"
          className={cn(
            "rounded-2xl px-3 py-1 text-xs font-medium transition-colors",
            isAr ? "bg-white text-[var(--pw-brand)] shadow-sm" : "text-[var(--pw-text-secondary)] hover:text-[var(--pw-text)]",
          )}
          onClick={() => {
            void i18n.changeLanguage("ar");
            setLanguage("ar");
          }}
        >
          عربي
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="text-xs text-slate-500">{t("common.language")}</div>
      <Button
        type="button"
        variant={isAr ? "secondary" : "primary"}
        size="sm"
        onClick={() => {
          void i18n.changeLanguage("en");
          setLanguage("en");
        }}
      >
        {t("common.english")}
      </Button>
      <Button
        type="button"
        variant={isAr ? "primary" : "secondary"}
        size="sm"
        onClick={() => {
          void i18n.changeLanguage("ar");
          setLanguage("ar");
        }}
      >
        {t("common.arabic")}
      </Button>
    </div>
  );
}
