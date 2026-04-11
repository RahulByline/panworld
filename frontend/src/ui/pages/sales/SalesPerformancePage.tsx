import { useTranslation } from "react-i18next";
import { PwPageHeader } from "../../panworld/PwPageHeader";

export function SalesPerformancePage() {
  const { t } = useTranslation();

  return (
    <div>
      <PwPageHeader title={t("salesPortal.titles.performance")} subtitle={t("salesPortal.performance.subtitle")} />
      <div className="pw-mapping-placeholder">
        <p className="mb-2 text-[15px] font-medium text-[var(--pw-text)]">{t("salesPortal.performance.comingTitle")}</p>
        <p className="text-[13.5px] text-[var(--pw-text-secondary)]">{t("salesPortal.performance.comingBody")}</p>
      </div>
    </div>
  );
}
