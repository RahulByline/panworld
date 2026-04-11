import { useTranslation } from "react-i18next";
import { PwPageHeader } from "../../panworld/PwPageHeader";

export function SalesPerformancePage() {
  const { t } = useTranslation();

  return (
    <div>
      <PwPageHeader title={t("salesPortal.titles.performance")} subtitle={t("salesPortal.performance.subtitle")} />
      <div className="pw-mapping-placeholder">
        <p className="mb-2 text-[15px] font-medium text-[#1A1917]">{t("salesPortal.performance.comingTitle")}</p>
        <p className="text-[13.5px] text-[#5C5A55]">{t("salesPortal.performance.comingBody")}</p>
      </div>
    </div>
  );
}
