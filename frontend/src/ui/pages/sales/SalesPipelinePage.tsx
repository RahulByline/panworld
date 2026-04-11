import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { PwPageHeader } from "../../panworld/PwPageHeader";

export function SalesPipelinePage() {
  const { t } = useTranslation();

  return (
    <div>
      <PwPageHeader
        title={t("salesPortal.titles.pipeline")}
        subtitle={t("salesPortal.pipeline.subtitle")}
        right={
          <div className="pw-stat-inline pw-stat-card py-2">
            <div className="text-[10px] uppercase text-[var(--pw-text-secondary)]">{t("salesPortal.pipeline.pipelineLabel")}</div>
            <div className="text-lg font-bold text-[var(--pw-success)]">AED 842K</div>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <KanbanCol title={t("salesPortal.pipeline.colSubmitted")} count={2}>
          <KanbanCard title={t("salesPortal.pipeline.k1Title")} sub={t("salesPortal.pipeline.k1Sub")} date="8 Apr" age="1d" />
          <KanbanCard title={t("salesPortal.pipeline.k2Title")} sub={t("salesPortal.pipeline.k2Sub")} date="8 Apr" age="1d" />
        </KanbanCol>
        <KanbanCol title={t("salesPortal.pipeline.colReview")} count={2} accent="brand">
          <KanbanCard title={t("salesPortal.pipeline.k3Title")} sub={t("salesPortal.pipeline.k3Sub")} date="5 Apr" age="4d" ageWarn />
          <KanbanCard title={t("salesPortal.pipeline.k4Title")} sub={t("salesPortal.pipeline.k4Sub")} date="1 Apr" age="8d ⚠" danger />
        </KanbanCol>
        <KanbanCol title={t("salesPortal.pipeline.colQuote")} count={1} accent="success">
          <div className="pw-kanban-card border-s-[3px] border-[var(--pw-success)]">
            <div className="mb-0.5 text-[12.5px] font-semibold">{t("salesPortal.pipeline.quoteTitle")}</div>
            <div className="mb-1.5 text-[11.5px] text-[var(--pw-text-secondary)]">{t("salesPortal.pipeline.quoteSub")}</div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[var(--pw-text-muted)]">{t("salesPortal.pipeline.quoteReady")}</span>
              <button type="button" className="pw-btn pw-btn-xs bg-[var(--pw-success)] text-white hover:opacity-95">
                {t("salesPortal.pipeline.approved")}
              </button>
            </div>
          </div>
        </KanbanCol>
        <KanbanCol title={t("salesPortal.pipeline.colOrdered")} count={3} accent="success">
          <div className="pw-kanban-card opacity-70">
            <div className="mb-0.5 text-[12.5px] font-semibold">{t("salesPortal.pipeline.ord1Title")}</div>
            <div className="mb-1.5 text-[11.5px] text-[var(--pw-text-secondary)]">{t("salesPortal.pipeline.ord1Sub")}</div>
            <div className="text-[11px] text-[var(--pw-success)]">{t("salesPortal.pipeline.ord1Date")}</div>
          </div>
          <div className="pw-kanban-card opacity-70">
            <div className="mb-0.5 text-[12.5px] font-semibold">{t("salesPortal.pipeline.ord2Title")}</div>
            <div className="mb-1.5 text-[11.5px] text-[var(--pw-text-secondary)]">{t("salesPortal.pipeline.ord2Sub")}</div>
            <div className="text-[11px] text-[var(--pw-success)]">{t("salesPortal.pipeline.ord2Date")}</div>
          </div>
        </KanbanCol>
      </div>
    </div>
  );
}

function KanbanCol({
  title,
  count,
  children,
  accent,
}: {
  title: string;
  count: number;
  children: ReactNode;
  accent?: "brand" | "success";
}) {
  const badgeBg =
    accent === "success" ? "bg-[var(--pw-success)]" : accent === "brand" ? "bg-[var(--pw-logo-blue)]" : "bg-[var(--pw-accent)]";
  return (
    <div className="pw-kanban-col">
      <div className="pw-kanban-header">
        <span>{title}</span>
        <span className={`rounded-[10px] px-1.5 py-0.5 text-[11px] text-white ${badgeBg}`}>{count}</span>
      </div>
      {children}
    </div>
  );
}

function KanbanCard({
  title,
  sub,
  date,
  age,
  ageWarn,
  danger,
}: {
  title: string;
  sub: string;
  date: string;
  age: string;
  ageWarn?: boolean;
  danger?: boolean;
}) {
  return (
    <div className="pw-kanban-card">
      <div className="mb-0.5 text-[12.5px] font-semibold">{title}</div>
      <div className="mb-1.5 text-[11.5px] text-[var(--pw-text-secondary)]">{sub}</div>
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-[var(--pw-text-muted)]">{date}</span>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
            danger
              ? "bg-[var(--pw-alert-light)] text-[var(--pw-alert)]"
              : ageWarn
                ? "bg-[var(--pw-accent-light)] text-[var(--pw-accent)]"
                : "bg-[var(--pw-muted)] text-[var(--pw-text-secondary)]"
          }`}
        >
          {age}
        </span>
      </div>
    </div>
  );
}
