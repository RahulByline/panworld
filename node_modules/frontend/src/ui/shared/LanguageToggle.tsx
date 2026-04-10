import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../store/auth.store";
import { Button } from "../components/Button";

export function LanguageToggle() {
  const { i18n, t } = useTranslation();
  const setLanguage = useAuthStore((s) => s.setLanguage);

  const isAr = i18n.language === "ar";

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

