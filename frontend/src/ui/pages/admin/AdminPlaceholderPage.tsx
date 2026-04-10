import { useTranslation } from "react-i18next";

export function AdminPlaceholderPage({ titleKey }: { titleKey: string }) {
  const { t } = useTranslation();
  return (
    <div className="rounded-2xl border border-[#E2E0D9] bg-white p-10 text-center">
      <div className="font-['DM_Serif_Display',serif] text-xl text-[#1A1917]">{t(titleKey)}</div>
      <p className="mt-2 text-sm text-[#5C5A55]">{t("admin.placeholder.comingSoon")}</p>
    </div>
  );
}
