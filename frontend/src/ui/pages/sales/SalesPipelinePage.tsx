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
            <div className="text-[10px] uppercase text-[#5C5A55]">{t("salesPortal.pipeline.pipelineLabel")}</div>
            <div className="text-lg font-bold text-[#1E8449]">AED 842K</div>
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
          <div className="pw-kanban-card border-s-[3px] border-[#1E8449]">
            <div className="mb-0.5 text-[12.5px] font-semibold">{t("salesPortal.pipeline.quoteTitle")}</div>
            <div className="mb-1.5 text-[11.5px] text-[#5C5A55]">{t("salesPortal.pipeline.quoteSub")}</div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#9A9890]">{t("salesPortal.pipeline.quoteReady")}</span>
              <button type="button" className="pw-btn pw-btn-xs bg-[#1E8449] text-white hover:opacity-95">
                {t("salesPortal.pipeline.approved")}
              </button>
            </div>
          </div>
        </KanbanCol>
        <KanbanCol title={t("salesPortal.pipeline.colOrdered")} count={3} accent="success">
          <div className="pw-kanban-card opacity-70">
            <div className="mb-0.5 text-[12.5px] font-semibold">{t("salesPortal.pipeline.ord1Title")}</div>
            <div className="mb-1.5 text-[11.5px] text-[#5C5A55]">{t("salesPortal.pipeline.ord1Sub")}</div>
            <div className="text-[11px] text-[#1E8449]">{t("salesPortal.pipeline.ord1Date")}</div>
          </div>
          <div className="pw-kanban-card opacity-70">
            <div className="mb-0.5 text-[12.5px] font-semibold">{t("salesPortal.pipeline.ord2Title")}</div>
            <div className="mb-1.5 text-[11.5px] text-[#5C5A55]">{t("salesPortal.pipeline.ord2Sub")}</div>
            <div className="text-[11px] text-[#1E8449]">{t("salesPortal.pipeline.ord2Date")}</div>
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
  const badgeBg = accent === "success" ? "bg-[#1E8449]" : accent === "brand" ? "bg-[#1A5276]" : "bg-[#E8912D]";
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
      <div className="mb-1.5 text-[11.5px] text-[#5C5A55]">{sub}</div>
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-[#9A9890]">{date}</span>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
            danger ? "bg-[#FDEDEC] text-[#C0392B]" : ageWarn ? "bg-[#FDEBD0] text-[#8B5A1A]" : "bg-[#F5F4F0] text-[#5C5A55]"
          }`}
        >
          {age}
        </span>
      </div>
    </div>
  );
}
