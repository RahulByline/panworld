import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import type { LucideIcon } from "lucide-react";
import { BadgeCheck, ClipboardList, Flag, Inbox, Plus, Search } from "lucide-react";
import { AdminPageHeader } from "../../admin/components/AdminPageHeader";
import { Button } from "../../components/Button";
import { RfqCreateModal } from "../../admin/components/rfq/RfqCreateModal";
import { RfqViewModal } from "../../admin/components/rfq/RfqViewModal";
import {
  rfqAmFilterOptions,
  rfqKanbanColumns,
  rfqPipelinePageStats,
  rfqPublisherFilterOptions,
  rfqStageFilterOptions,
  rfqTerritoryFilterOptions,
  type RfqKanbanCard,
  type RfqKanbanColumn,
  type RfqKanbanColumnKey,
} from "../../../data/admin/rfqPipeline";
import { useAdminToast } from "../../admin/hooks/useAdminToast";
import { cn } from "../../utils/cn";

const COL_ICON: Record<RfqKanbanColumnKey, LucideIcon> = {
  submitted: Inbox,
  quoted: ClipboardList,
  approved: BadgeCheck,
  delivered: Flag,
};

const COL_HEADER_GRADIENT: Record<RfqKanbanColumnKey, string> = {
  submitted: "from-[#6B8BFF] to-[#4F6AF6]",
  quoted: "from-[#FFC14D] to-[#F5A524]",
  approved: "from-[#57D9A3] to-[#36B37E]",
  delivered: "from-[#6B778C] to-[#505F79]",
};

function cardPriorityPill(card: RfqKanbanCard, t: TFunction): { label: string; className: string } {
  if (card.pendingTone === "warn") {
    return { label: t("admin.pages.rfq.cardPriUrgent"), className: "bg-[#FFEBE6] text-[#BF2600]" };
  }
  if (card.showReviewCta) {
    return { label: t("admin.pages.rfq.cardPriQuoteReview"), className: "bg-[#DEEBFF] text-[#0747A6]" };
  }
  if (card.isNew) {
    return { label: t("admin.pages.rfq.cardPriNew"), className: "bg-[#EAE6FF] text-[#403294]" };
  }
  if (card.fulfillment?.includes("Delivered")) {
    return { label: t("admin.pages.rfq.cardPriFulfilled"), className: "bg-[#E3FCEF] text-[#006644]" };
  }
  return { label: t("admin.pages.rfq.cardPriStandard"), className: "bg-[#F4F5F7] text-[#5E6C84]" };
}

function territoryMatch(filter: string, card: RfqKanbanCard): boolean {
  if (filter === "All Territories") return true;
  if (filter === "UAE") return card.territory === "UAE";
  if (filter === "Saudi Arabia") return card.territory === "KSA";
  return true;
}

function stageAllowsColumn(stage: string, colKey: RfqKanbanColumnKey): boolean {
  if (stage === "All Stages") return true;
  if (stage === "Submitted" || stage === "Reviewed") return colKey === "submitted";
  if (stage === "Quoted") return colKey === "quoted";
  if (stage === "Approved" || stage === "Ordered") return colKey === "approved";
  if (stage === "Delivered") return colKey === "delivered";
  return true;
}

function cardMatchesSearch(card: RfqKanbanCard, q: string): boolean {
  if (!q.trim()) return true;
  const s = q.trim().toLowerCase();
  return (
    card.title.toLowerCase().includes(s) ||
    card.meta1.toLowerCase().includes(s) ||
    card.meta2.toLowerCase().includes(s) ||
    card.rfqId.toLowerCase().includes(s)
  );
}

export function AdminRfqPipelinePage() {
  const { t } = useTranslation();
  const { show, Toast } = useAdminToast();
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState<string>(rfqStageFilterOptions[0]);
  const [am, setAm] = useState<string>(rfqAmFilterOptions[0]);
  const [publisher, setPublisher] = useState<string>(rfqPublisherFilterOptions[0]);
  const [territory, setTerritory] = useState<string>(rfqTerritoryFilterOptions[0]);
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [viewCard, setViewCard] = useState<RfqKanbanCard | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const filteredColumns = useMemo(() => {
    return rfqKanbanColumns
      .filter((col) => stageAllowsColumn(stage, col.key))
      .map((col): RfqKanbanColumn => {
        let cards = col.cards.filter(
          (c) =>
            (am === "All AMs" || c.accountManager === am) &&
            (publisher === "All Publishers" || c.publisher === publisher) &&
            territoryMatch(territory, c) &&
            cardMatchesSearch(c, search),
        );
        if (sort === "oldest") cards = [...cards].reverse();
        return { ...col, cards };
      });
  }, [stage, am, publisher, territory, search, sort]);

  const sel =
    "h-10 min-w-0 flex-1 rounded-xl border border-[#DFE1E6] bg-[#FAFBFC] px-3 text-sm text-[#172B4D] shadow-sm outline-none transition hover:border-[#B3BAC5] focus:border-[#4F6AF6] focus:ring-2 focus:ring-[#4F6AF6]/20 sm:min-w-[148px]";

  return (
    <div className="font-sans">
      <Toast />
      <AdminPageHeader
        title={t("admin.pages.rfq.title")}
        subtitle={t("admin.pages.rfq.subtitleKanban", {
          active: rfqPipelinePageStats.active,
          urgent: rfqPipelinePageStats.urgent,
        })}
        actions={
          <>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="rounded-xl border-[#DFE1E6] shadow-sm"
              onClick={() => show(t("admin.pages.rfq.toastExport"))}
            >
              {t("admin.pages.rfq.export")}
            </Button>
            <Button
              type="button"
              size="sm"
              className="rounded-xl bg-[#4F6AF6] text-white shadow-sm hover:bg-[#3D5AE8]"
              onClick={() => setCreateOpen(true)}
            >
              {t("admin.pages.rfq.createRfq")}
            </Button>
          </>
        }
      />

      <div className="mb-5 rounded-2xl border border-[#DFE1E6] bg-white p-4 shadow-[0_1px_3px_rgba(9,30,66,0.08)]">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative min-h-10 min-w-0 flex-[2] lg:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#7A869A]" strokeWidth={2} aria-hidden />
            <input
              type="search"
              className="h-10 w-full rounded-xl border border-[#DFE1E6] bg-[#FAFBFC] py-2 pl-10 pr-3 text-sm text-[#172B4D] outline-none transition placeholder:text-[#7A869A] focus:border-[#4F6AF6] focus:bg-white focus:ring-2 focus:ring-[#4F6AF6]/15"
              placeholder={t("admin.pages.rfq.searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2 sm:flex-nowrap lg:flex-1">
            <select className={sel} value={stage} onChange={(e) => setStage(e.target.value)} aria-label={t("admin.pages.rfq.filterStageAria")}>
              {rfqStageFilterOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
            <select className={sel} value={am} onChange={(e) => setAm(e.target.value)} aria-label={t("admin.pages.rfq.filterAmAria")}>
              {rfqAmFilterOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
            <select className={sel} value={publisher} onChange={(e) => setPublisher(e.target.value)} aria-label={t("admin.pages.rfq.filterPublisherAria")}>
              {rfqPublisherFilterOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
            <select className={sel} value={territory} onChange={(e) => setTerritory(e.target.value)} aria-label={t("admin.pages.rfq.filterTerritoryAria")}>
              {rfqTerritoryFilterOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] text-[#5E6C84]">{t("admin.pages.rfq.kanbanBoardHint")}</p>
        <label className="flex items-center gap-2 text-[13px] font-medium text-[#172B4D]">
          <span className="text-[#5E6C84]">{t("admin.pages.rfq.sortBy")}</span>
          <select
            className="h-9 rounded-xl border border-[#DFE1E6] bg-white px-3 text-sm font-medium text-[#172B4D] shadow-sm outline-none focus:border-[#4F6AF6] focus:ring-2 focus:ring-[#4F6AF6]/20"
            value={sort}
            onChange={(e) => setSort(e.target.value as "newest" | "oldest")}
          >
            <option value="newest">{t("admin.pages.rfq.sortNewest")}</option>
            <option value="oldest">{t("admin.pages.rfq.sortOldest")}</option>
          </select>
        </label>
      </div>

      <section className="rounded-2xl bg-[#EBECF0] p-3 sm:p-4" aria-label={t("admin.pages.rfq.boardAria")}>
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch] xl:grid xl:grid-cols-4 xl:gap-4 xl:overflow-visible xl:pb-0">
          {filteredColumns.map((col) => {
            const Icon = COL_ICON[col.key];
            const visibleCount = col.cards.length;
            return (
              <div
                key={col.key}
                className="flex w-[min(100vw-2rem,320px)] shrink-0 snap-start flex-col sm:w-[300px] xl:min-h-[min(640px,calc(100vh-300px))] xl:w-auto xl:min-w-0"
              >
                <div
                  className={cn(
                    "mb-3 flex items-center justify-between gap-2 rounded-2xl bg-gradient-to-r px-4 py-3.5 text-white shadow-[0_2px_6px_rgba(9,30,66,0.12)]",
                    COL_HEADER_GRADIENT[col.key],
                  )}
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                      <Icon className="size-[18px] text-white" strokeWidth={2} aria-hidden />
                    </span>
                    <h2 className="truncate text-[15px] font-bold tracking-tight">{t(`admin.pages.rfq.kanban.${col.key}`)}</h2>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="rounded-full bg-white/95 px-2.5 py-1 text-[12px] font-bold tabular-nums text-[#172B4D] shadow-sm">
                      {visibleCount}
                    </span>
                    <button
                      type="button"
                      className="flex size-9 items-center justify-center rounded-xl bg-white/20 text-white transition hover:bg-white/30"
                      aria-label={t("admin.pages.rfq.kanbanAddRfq")}
                      onClick={() => setCreateOpen(true)}
                    >
                      <Plus className="size-5" strokeWidth={2.5} aria-hidden />
                    </button>
                  </div>
                </div>

                <div className="flex min-h-[min(400px,48vh)] flex-1 flex-col gap-3 rounded-2xl bg-[#DFE1E6]/60 p-2.5 xl:min-h-0">
                  {col.cards.length === 0 ? (
                    <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-[#B3BAC5] bg-white/70 px-4 py-12 text-center text-[13px] leading-relaxed text-[#5E6C84]">
                      {t("admin.pages.rfq.emptyColumn")}
                    </div>
                  ) : (
                    col.cards.map((card) => {
                      const pri = cardPriorityPill(card, t);
                      return (
                        <div
                          key={card.rfqId}
                          role="button"
                          tabIndex={0}
                          onClick={() => setViewCard(card)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setViewCard(card);
                            }
                          }}
                          className={cn(
                            "w-full cursor-pointer rounded-2xl border border-[#DFE1E6] bg-white p-4 text-left shadow-[0_1px_2px_rgba(9,30,66,0.08)] transition hover:border-[#B3BAC5] hover:shadow-[0_4px_14px_rgba(9,30,66,0.12)]",
                            card.successBorder && "ring-2 ring-[#36B37E]/35",
                          )}
                        >
                          <div className="mb-2.5 flex items-start justify-between gap-2">
                            <span className={cn("rounded-lg px-2 py-0.5 text-[11px] font-semibold", pri.className)}>{pri.label}</span>
                          </div>
                          <h3 className="text-[15px] font-semibold leading-snug tracking-tight text-[#172B4D]">{card.title}</h3>
                          <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-[#5E6C84]">
                            {card.meta1}
                            <span className="text-[#97A0AF]"> · </span>
                            {card.meta2}
                          </p>
                          {card.pendingBadge ? (
                            <p className="mt-2 text-[12px] font-medium text-[#BF2600]">{card.pendingBadge}</p>
                          ) : null}
                          {card.fulfillment ? (
                            <p className="mt-1 text-[12px] font-medium text-[#006644]">{card.fulfillment}</p>
                          ) : null}

                          {card.showReviewCta ? (
                            <div className="mt-4">
                              <Button
                                type="button"
                                size="sm"
                                className="h-9 w-full rounded-xl bg-[#4F6AF6] text-xs font-semibold text-white shadow-sm hover:bg-[#3D5AE8]"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setViewCard(card);
                                }}
                              >
                                {t("admin.pages.rfq.reviewQuote")}
                              </Button>
                            </div>
                          ) : null}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <RfqViewModal open={!!viewCard} onClose={() => setViewCard(null)} card={viewCard} t={t} onToast={show} />
      <RfqCreateModal open={createOpen} onClose={() => setCreateOpen(false)} onToast={show} />
    </div>
  );
}
