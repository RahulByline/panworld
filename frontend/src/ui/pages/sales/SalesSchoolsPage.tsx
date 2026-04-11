import { useTranslation } from "react-i18next";
import { PwPageHeader } from "../../panworld/PwPageHeader";

export function SalesSchoolsPage() {
  const { t } = useTranslation();

  return (
    <div>
      <PwPageHeader
        title={t("salesPortal.titles.schools")}
        subtitle={t("salesPortal.schools.subtitle")}
        right={
          <select className="pw-filter-select max-w-[200px]" defaultValue="all">
            <option value="all">{t("salesPortal.schools.filterAll")}</option>
            <option>{t("salesPortal.schools.filterHigh")}</option>
            <option>{t("salesPortal.schools.filterMedium")}</option>
            <option>{t("salesPortal.schools.filterLow")}</option>
          </select>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SchoolCard
          initials="AN"
          name={t("salesPortal.schools.s1Name")}
          meta={t("salesPortal.schools.s1Meta")}
          engagement="high"
          rfqs="3"
          wish="8"
          train="68%"
          lastLogin={t("salesPortal.schools.lastToday")}
          actions="default"
        />
        <SchoolCard
          initials="GD"
          name={t("salesPortal.schools.s2Name")}
          meta={t("salesPortal.schools.s2Meta")}
          engagement="high"
          avatarClass="!bg-[#E8F5E9] !text-[#1E8449]"
          rfqs="1"
          wish="5"
          train="52%"
          lastLogin={t("salesPortal.schools.lastYesterday")}
          actions="approved"
        />
        <SchoolCard
          initials="RE"
          name={t("salesPortal.schools.s3Name")}
          meta={t("salesPortal.schools.s3Meta")}
          engagement="medium"
          avatarClass="!bg-[#EDE7F6] !text-[#512DA8]"
          rfqs="1"
          wish="3"
          train="28%"
          lastLogin={t("salesPortal.schools.last2d")}
          actions="default"
        />
        <SchoolCard
          initials="NA"
          name={t("salesPortal.schools.s4Name")}
          meta={t("salesPortal.schools.s4Meta")}
          engagement="inactive"
          avatarClass="!bg-[#FDEDEC] !text-[#C0392B]"
          rfqs="0"
          wish="1"
          train="5%"
          lastLogin={t("salesPortal.schools.last7d")}
          actions="inactive"
        />
      </div>
    </div>
  );
}

function SchoolCard({
  initials,
  name,
  meta,
  engagement,
  avatarClass,
  rfqs,
  wish,
  train,
  lastLogin,
  actions,
}: {
  initials: string;
  name: string;
  meta: string;
  engagement: "high" | "medium" | "inactive";
  avatarClass?: string;
  rfqs: string;
  wish: string;
  train: string;
  lastLogin: string;
  actions: "default" | "approved" | "inactive";
}) {
  const { t } = useTranslation();
  return (
    <div className="pw-school-card">
      <div className="mb-3 flex items-center gap-2.5">
        <div className={avatarClass ? `pw-school-avatar ${avatarClass}` : "pw-school-avatar"}>{initials}</div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-[#1A1917]">{name}</div>
          <div className="text-xs text-[#5C5A55]">{meta}</div>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className={`h-2.5 w-2.5 shrink-0 rounded-full ${
              engagement === "high" ? "bg-[#1E8449]" : engagement === "medium" ? "bg-[#1A5276]" : "bg-[#C0392B]"
            }`}
          />
          <span
            className={`text-[11.5px] font-medium ${
              engagement === "high" ? "text-[#1E8449]" : engagement === "medium" ? "text-[#1A5276]" : "text-[#C0392B]"
            }`}
          >
            {engagement === "high"
              ? t("salesPortal.schools.engHigh")
              : engagement === "medium"
                ? t("salesPortal.schools.engMedium")
                : t("salesPortal.schools.engInactive")}
          </span>
        </div>
      </div>
      <div className="mb-3 grid grid-cols-4 gap-2">
        <MiniStat label={t("salesPortal.schools.miniRfqs")} value={rfqs} valueClass="text-[#1A5276]" />
        <MiniStat label={t("salesPortal.schools.miniWish")} value={wish} valueClass="text-[#E8912D]" />
        <MiniStat label={t("salesPortal.schools.miniTrain")} value={train} valueClass="text-[#1E8449]" />
        <MiniStat label={t("salesPortal.schools.miniLogin")} value={lastLogin} valueClass="text-[#1A1917]" />
      </div>
      <div className="flex flex-wrap gap-1.5">
        <button type="button" className="pw-btn pw-btn-primary pw-btn-xs">
          {t("salesPortal.schools.viewPortal")}
        </button>
        <button type="button" className="pw-btn pw-btn-outline pw-btn-xs">
          {t("salesPortal.schools.whatsapp")}
        </button>
        {actions === "default" ? (
          <button type="button" className="pw-btn pw-btn-outline pw-btn-xs">
            {t("salesPortal.schools.rfqs", { n: rfqs })}
          </button>
        ) : null}
        {actions === "approved" ? (
          <button type="button" className="pw-btn pw-btn-xs bg-[#1E8449] text-white hover:opacity-95">
            {t("salesPortal.schools.quoteApproved")}
          </button>
        ) : null}
        {actions === "inactive" ? (
          <button type="button" className="pw-btn pw-btn-danger pw-btn-xs">
            {t("salesPortal.schools.reengage")}
          </button>
        ) : null}
      </div>
    </div>
  );
}

function MiniStat({ label, value, valueClass }: { label: string; value: string; valueClass: string }) {
  return (
    <div className="rounded-md bg-[#F5F4F0] px-1 py-2 text-center">
      <div className={`text-lg font-bold ${valueClass}`}>{value}</div>
      <div className="text-[10px] text-[#5C5A55]">{label}</div>
    </div>
  );
}
