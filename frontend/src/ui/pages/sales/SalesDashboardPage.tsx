import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../../store/auth.store";
import { cn } from "../../utils/cn";

export function SalesDashboardPage() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user)!;

  const greetingKey = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "salesPortal.dashboard.greetingMorning" as const;
    if (h < 17) return "salesPortal.dashboard.greetingAfternoon" as const;
    return "salesPortal.dashboard.greetingEvening" as const;
  }, []);

  return (
    <div>
      <div className="pw-top-banner mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-1 text-xs uppercase tracking-wider opacity-60">{t("salesPortal.dashboard.bannerMeta")}</div>
            <div className="font-serif text-[26px] leading-tight">
              {t(greetingKey, { name: user.firstName })}
            </div>
            <div className="mt-1 text-[13px] opacity-80">{t("salesPortal.dashboard.bannerHint")}</div>
          </div>
          <div className="text-end sm:ps-4">
            <div className="text-[40px] font-bold leading-none">8</div>
            <div className="text-xs opacity-60">{t("salesPortal.dashboard.mySchoolsCount")}</div>
          </div>
        </div>
      </div>

      <div className="pw-grid-4 mb-6">
        <div className="pw-stat-card">
          <div className="pw-stat-label">{t("salesPortal.dashboard.statPipeline")}</div>
          <div className="pw-stat-value text-[#1E8449]">AED 842K</div>
          <div className="pw-stat-sub">{t("salesPortal.dashboard.statPipelineSub")}</div>
        </div>
        <div className="pw-stat-card">
          <div className="pw-stat-label">{t("salesPortal.dashboard.statOrders")}</div>
          <div className="pw-stat-value text-[#1A5276]">AED 1.2M</div>
        </div>
        <div className="pw-stat-card">
          <div className="pw-stat-label">{t("salesPortal.dashboard.statDemoRate")}</div>
          <div className="pw-stat-value text-[#E8912D]">32%</div>
          <div className="pw-stat-sub">{t("salesPortal.dashboard.statDemoRateSub")}</div>
        </div>
        <div className="pw-stat-card">
          <div className="pw-stat-label">{t("salesPortal.dashboard.statEngagement")}</div>
          <div className="pw-stat-value">{t("salesPortal.dashboard.statEngagementValue")}</div>
          <div className="pw-stat-sub">{t("salesPortal.dashboard.statEngagementSub")}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="pw-card">
          <div className="mb-3.5 text-sm font-semibold text-[#1A1917]">{t("salesPortal.dashboard.followUpTitle")}</div>
          <div className="mb-2 rounded-[10px] border border-[#FDEBD0] bg-[#FFF8F0] p-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-[13.5px] font-semibold">{t("salesPortal.dashboard.task1Title")}</div>
                <div className="text-xs text-[#5C5A55]">{t("salesPortal.dashboard.task1Sub")}</div>
              </div>
              <button type="button" className="pw-btn pw-btn-accent pw-btn-xs shrink-0">
                {t("salesPortal.dashboard.whatsapp")}
              </button>
            </div>
          </div>
          <div className="mb-2 rounded-[10px] border border-[#D5F5E3] bg-[#F0FFF4] p-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-[13.5px] font-semibold">{t("salesPortal.dashboard.task2Title")}</div>
                <div className="text-xs text-[#5C5A55]">{t("salesPortal.dashboard.task2Sub")}</div>
              </div>
              <button type="button" className="pw-btn pw-btn-xs shrink-0 bg-[#1E8449] text-white hover:opacity-95">
                {t("salesPortal.dashboard.followUp")}
              </button>
            </div>
          </div>
          <div className="rounded-[10px] bg-[#F5F4F0] p-3">
            <div className="text-[13.5px] font-semibold">{t("salesPortal.dashboard.task3Title")}</div>
            <div className="text-xs text-[#5C5A55]">{t("salesPortal.dashboard.task3Sub")}</div>
          </div>
        </div>

        <div className="pw-card">
          <div className="mb-3.5 text-sm font-semibold text-[#1A1917]">{t("salesPortal.dashboard.activityTitle")}</div>
          <ActivityRow initials="AN" sub={t("salesPortal.dashboard.act1Sub")} title={t("salesPortal.dashboard.act1Title")} badge="RFQ" badgeClass="bg-[#FDEBD0] text-[#8B5A1A]" />
          <ActivityRow initials="GD" sub={t("salesPortal.dashboard.act2Sub")} title={t("salesPortal.dashboard.act2Title")} badge={t("salesPortal.dashboard.badgeApproved")} badgeClass="bg-[#D5F5E3] text-[#145A32]" bg="bg-[#E8F5E9]" textColor="text-[#1E8449]" />
          <ActivityRow initials="RE" sub={t("salesPortal.dashboard.act3Sub")} title={t("salesPortal.dashboard.act3Title")} badge={t("salesPortal.dashboard.badgeDemo")} badgeClass="bg-[#D6EAF8] text-[#1A5276]" bg="bg-[#EDE7F6]" textColor="text-[#512DA8]" />
          <ActivityRow initials="TL" sub={t("salesPortal.dashboard.act4Sub")} title={t("salesPortal.dashboard.act4Title")} badge={t("salesPortal.dashboard.badgeWishlist")} badgeClass="bg-[#F5F4F0] text-[#5C5A55]" bg="bg-[#FDEBD0]" textColor="text-[#E8912D]" last />
        </div>
      </div>
    </div>
  );
}

function ActivityRow({
  initials,
  title,
  sub,
  badge,
  badgeClass,
  bg,
  textColor,
  last,
}: {
  initials: string;
  title: string;
  sub: string;
  badge: string;
  badgeClass: string;
  bg?: string;
  textColor?: string;
  last?: boolean;
}) {
  return (
    <div className={`flex items-center gap-2.5 py-2.5 ${last ? "" : "border-b border-[#E2E0D9]"}`}>
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold ${bg ?? "bg-[#D6EAF8]"} ${textColor ?? "text-[#1A5276]"}`}
      >
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-medium text-[#1A1917]">{title}</div>
        <div className="text-[11.5px] text-[#5C5A55]">{sub}</div>
      </div>
      <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold", badgeClass)}>{badge}</span>
    </div>
  );
}
