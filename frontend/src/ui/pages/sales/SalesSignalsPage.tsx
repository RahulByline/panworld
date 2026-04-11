import { useTranslation } from "react-i18next";
import { PwPageHeader } from "../../panworld/PwPageHeader";

export function SalesSignalsPage() {
  const { t } = useTranslation();

  return (
    <div>
      <PwPageHeader title={t("salesPortal.titles.signals")} subtitle={t("salesPortal.signals.subtitle")} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <div className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-[var(--pw-text-secondary)]">
            {t("salesPortal.signals.hotTitle")}
          </div>
          <SignalRow icon="📗" iconBg="var(--pw-accent-light)" title={t("salesPortal.signals.hot1Title")} sub={t("salesPortal.signals.hot1Sub")} btn="accent" btnLabel={t("salesPortal.signals.followUp")} />
          <SignalRow icon="💬" iconBg="var(--pw-brand-light)" title={t("salesPortal.signals.hot2Title")} sub={t("salesPortal.signals.hot2Sub")} btn="accent" btnLabel={t("salesPortal.signals.call")} />
          <SignalRow icon="🌍" iconBg="var(--pw-brand-light)" title={t("salesPortal.signals.hot3Title")} sub={t("salesPortal.signals.hot3Sub")} btn="outline" btnLabel={t("salesPortal.signals.followUp")} />
        </div>
        <div>
          <div className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-[var(--pw-text-secondary)]">
            {t("salesPortal.signals.nudgeTitle")}
          </div>
          <SignalRow icon="📗" iconBg="var(--pw-accent-light)" title={t("salesPortal.signals.nudge1Title")} sub={t("salesPortal.signals.nudge1Sub")} btn="primary" btnLabel={t("salesPortal.signals.followUp")} />
          <SignalRow icon="📈" iconBg="var(--pw-success-light)" title={t("salesPortal.signals.nudge2Title")} sub={t("salesPortal.signals.nudge2Sub")} btn="primary" btnLabel={t("salesPortal.signals.callNow")} />
          <SignalRow icon="🖥" iconBg="var(--pw-accent-light)" title={t("salesPortal.signals.nudge3Title")} sub={t("salesPortal.signals.nudge3Sub")} btn="outline" btnLabel={t("salesPortal.signals.reengage")} />
        </div>
      </div>
    </div>
  );
}

function SignalRow({
  icon,
  iconBg,
  title,
  sub,
  btn,
  btnLabel,
}: {
  icon: string;
  iconBg: string;
  title: string;
  sub: string;
  btn: "accent" | "primary" | "outline";
  btnLabel: string;
}) {
  const btnCls =
    btn === "accent"
      ? "pw-btn-accent"
      : btn === "primary"
        ? "pw-btn-primary"
        : "pw-btn-outline";
  return (
    <div className="pw-signal-card">
      <div className="pw-signal-icon" style={{ background: iconBg }}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[13.5px] font-semibold text-[var(--pw-text)]">{title}</div>
        <div className="text-xs text-[var(--pw-text-secondary)]">{sub}</div>
      </div>
      <button type="button" className={`pw-btn pw-btn-xs shrink-0 ${btnCls}`}>
        {btnLabel}
      </button>
    </div>
  );
}
