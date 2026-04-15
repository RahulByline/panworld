import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import type { LucideIcon } from "lucide-react";
import { BadgeCheck, Calendar, ClipboardList, Flag, Inbox, MoreHorizontal, Plus, Search } from "lucide-react";
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

/** Default pipeline % when card has no explicit progress (matches column stage). */
const COLUMN_DEFAULT_PROGRESS: Record<RfqKanbanColumnKey, number> = {
  submitted: 25,
  quoted: 50,
  approved: 75,
  delivered: 100,
};

const COL_BAR: Record<RfqKanbanColumnKey, string> = {
  submitted: "#2563eb",
  quoted: "#ea580c",
  approved: "#16a34a",
  delivered: "#475569",
};

const COL_DOT: Record<RfqKanbanColumnKey, string> = {
  submitted: "bg-[#2563eb]",
  quoted: "bg-[#ea580c]",
  approved: "bg-[#16a34a]",
  delivered: "bg-[#475569]",
};

/** Section chrome: header gradient + tinted column well (matches Kanban column identity). */
const COL_THEME: Record<
  RfqKanbanColumnKey,
  {
    header: string;
    iconWrap: string;
    countBadge: string;
    plusBtn: string;
    columnWell: string;
    emptyWell: string;
    addCard: string;
    barTrack: string;
  }
> = {
  submitted: {
    header: "bg-gradient-to-r from-[#3b82f6] via-[#2563eb] to-[#1d4ed8]",
    iconWrap: "bg-white/20 text-white ring-1 ring-white/35 shadow-sm backdrop-blur-[2px]",
    countBadge: "bg-white text-[#1d4ed8] ring-1 ring-white/90 shadow-sm",
    plusBtn: "bg-white/20 text-white hover:bg-white/30",
    columnWell: "bg-[#eff6ff]/95 border border-[#bfdbfe]/80",
    emptyWell: "border-[#93c5fd]/60 bg-[#dbeafe]/50 text-[#1e40af]",
    addCard: "border-[#93c5fd]/70 bg-[#eff6ff]/50 text-[#1d4ed8] hover:border-[#60a5fa] hover:bg-[#dbeafe]/60",
    barTrack: "bg-blue-100/90",
  },
  quoted: {
    header: "bg-gradient-to-r from-[#fb923c] via-[#f97316] to-[#ea580c]",
    iconWrap: "bg-white/20 text-white ring-1 ring-white/35 shadow-sm backdrop-blur-[2px]",
    countBadge: "bg-white text-[#c2410c] ring-1 ring-white/90 shadow-sm",
    plusBtn: "bg-white/20 text-white hover:bg-white/30",
    columnWell: "bg-[#fff7ed]/95 border border-[#fed7aa]/90",
    emptyWell: "border-[#fdba74]/70 bg-[#ffedd5]/50 text-[#9a3412]",
    addCard: "border-[#fdba74]/80 bg-[#fff7ed]/60 text-[#c2410c] hover:border-[#fb923c] hover:bg-[#ffedd5]/80",
    barTrack: "bg-orange-100/90",
  },
  approved: {
    header: "bg-gradient-to-r from-[#4ade80] via-[#22c55e] to-[#16a34a]",
    iconWrap: "bg-white/20 text-white ring-1 ring-white/35 shadow-sm backdrop-blur-[2px]",
    countBadge: "bg-white text-[#15803d] ring-1 ring-white/90 shadow-sm",
    plusBtn: "bg-white/20 text-white hover:bg-white/30",
    columnWell: "bg-[#f0fdf4]/95 border border-[#bbf7d0]/90",
    emptyWell: "border-[#86efac]/70 bg-[#dcfce7]/50 text-[#166534]",
    addCard: "border-[#86efac]/80 bg-[#f0fdf4]/60 text-[#15803d] hover:border-[#4ade80] hover:bg-[#dcfce7]/80",
    barTrack: "bg-emerald-100/90",
  },
  delivered: {
    header: "bg-gradient-to-r from-[#64748b] via-[#475569] to-[#334155]",
    iconWrap: "bg-white/15 text-white ring-1 ring-white/30 shadow-sm backdrop-blur-[2px]",
    countBadge: "bg-white text-[#334155] ring-1 ring-white/90 shadow-sm",
    plusBtn: "bg-white/15 text-white hover:bg-white/25",
    columnWell: "bg-[#f8fafc]/95 border border-[#cbd5e1]/90",
    emptyWell: "border-[#94a3b8]/60 bg-[#f1f5f9]/70 text-[#334155]",
    addCard: "border-[#94a3b8]/70 bg-[#f8fafc]/80 text-[#475569] hover:border-[#64748b] hover:bg-[#f1f5f9]",
    barTrack: "bg-slate-200/90",
  },
};

function amInitials(name: string): string {
  const p = name.trim().split(/\s+/).filter(Boolean);
  if (p.length >= 2) return `${p[0]!.charAt(0)}${p[p.length - 1]!.charAt(0)}`.toUpperCase();
  return name.slice(0, 2).toUpperCase() || "AM";
}

function cardProgressPct(card: RfqKanbanCard, colKey: RfqKanbanColumnKey): number {
  const n = card.progress ?? COLUMN_DEFAULT_PROGRESS[colKey];
  return Math.min(100, Math.max(0, n));
}

function cardPriorityPill(card: RfqKanbanCard, t: TFunction): { label: string; className: string } {
  if (card.pendingTone === "warn") {
    return { label: t("admin.pages.rfq.cardPriUrgent"), className: "bg-[var(--pw-alert-light)] text-[var(--pw-alert)]" };
  }
  if (card.showReviewCta) {
    return { label: t("admin.pages.rfq.cardPriQuoteReview"), className: "bg-[var(--pw-brand-light)] text-[var(--pw-brand)]" };
  }
  if (card.isNew) {
    return { label: t("admin.pages.rfq.cardPriNew"), className: "bg-[var(--pw-brand-light)] text-[var(--pw-brand-deep)]" };
  }
  if (card.fulfillment?.includes("Delivered")) {
    return { label: t("admin.pages.rfq.cardPriFulfilled"), className: "bg-[var(--pw-success-light)] text-[var(--pw-success)]" };
  }
  return { label: t("admin.pages.rfq.cardPriStandard"), className: "bg-[var(--pw-muted)] text-[var(--pw-text-secondary)]" };
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
    "h-10 min-w-0 flex-1 rounded-full border border-[var(--pw-border)] bg-[var(--pw-muted)]/80 px-3 text-sm text-[var(--pw-text)] shadow-sm outline-none transition hover:border-[var(--pw-text-muted)] focus:border-[var(--pw-logo-blue)] focus:ring-2 focus:ring-[var(--pw-logo-blue)]/20 sm:min-w-[148px]";

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
              className="rounded-full border-[var(--pw-border)] shadow-sm"
              onClick={() => show(t("admin.pages.rfq.toastExport"))}
            >
              {t("admin.pages.rfq.export")}
            </Button>
            <Button
              type="button"
              size="sm"
              className="rounded-full bg-[var(--pw-brand)] text-white shadow-sm hover:bg-[var(--pw-brand-deep)]"
              onClick={() => setCreateOpen(true)}
            >
              {t("admin.pages.rfq.createRfq")}
            </Button>
          </>
        }
      />

      <div className="mb-5 rounded-3xl border border-[var(--pw-border)] bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative min-h-10 min-w-0 flex-[2] lg:max-w-xl">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--pw-text-muted)]"
              strokeWidth={2}
              aria-hidden
            />
            <input
              type="search"
              className="h-11 w-full rounded-full border border-[var(--pw-border)] bg-[var(--pw-muted)]/60 py-2 pl-10 pr-4 text-sm text-[var(--pw-text)] outline-none transition placeholder:text-[var(--pw-text-muted)] focus:border-[var(--pw-logo-blue)] focus:bg-white focus:ring-2 focus:ring-[var(--pw-logo-blue)]/15"
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

      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] text-[var(--pw-text-secondary)]">{t("admin.pages.rfq.kanbanBoardHint")}</p>
        <label className="flex items-center gap-2 text-[13px] font-medium text-[var(--pw-text)]">
          <span className="text-[var(--pw-text-secondary)]">{t("admin.pages.rfq.sortBy")}</span>
          <select
            className="h-9 rounded-full border border-[var(--pw-border)] bg-white px-3 text-sm font-medium text-[var(--pw-text)] shadow-sm outline-none focus:border-[var(--pw-logo-blue)] focus:ring-2 focus:ring-[var(--pw-logo-blue)]/20"
            value={sort}
            onChange={(e) => setSort(e.target.value as "newest" | "oldest")}
          >
            <option value="newest">{t("admin.pages.rfq.sortNewest")}</option>
            <option value="oldest">{t("admin.pages.rfq.sortOldest")}</option>
          </select>
        </label>
      </div>

      <section
        className="rounded-2xl bg-[#f1f5f9]/80 p-3 sm:p-4 ring-1 ring-[#e2e8f0]/80"
        aria-label={t("admin.pages.rfq.boardAria")}
      >
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch] xl:grid xl:grid-cols-4 xl:gap-4 xl:overflow-visible xl:pb-0">
          {filteredColumns.map((col) => {
            const HeaderIcon = COL_ICON[col.key];
            const visibleCount = col.cards.length;
            const theme = COL_THEME[col.key];

            return (
              <div
                key={col.key}
                className="flex w-[min(100vw-2rem,340px)] shrink-0 snap-start flex-col overflow-hidden rounded-2xl shadow-[0_1px_3px_rgba(15,23,42,0.08)] sm:w-[320px] xl:min-h-[min(640px,calc(100vh-320px))] xl:w-auto xl:min-w-0"
              >
                <div className={cn("flex items-center justify-between gap-2 px-3.5 py-3.5 sm:px-4", theme.header)}>
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span
                      className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl", theme.iconWrap)}
                    >
                      <HeaderIcon className="size-[18px]" strokeWidth={2} aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <h2 className="truncate text-[15px] font-bold tracking-tight text-white drop-shadow-sm">
                        {t(`admin.pages.rfq.kanban.${col.key}`)}
                      </h2>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <span
                      className={cn(
                        "flex h-8 min-w-[2rem] items-center justify-center rounded-full px-2 text-[12px] font-bold tabular-nums",
                        theme.countBadge,
                      )}
                    >
                      {visibleCount}
                    </span>
                    <button
                      type="button"
                      className={cn(
                        "flex size-9 items-center justify-center rounded-full transition",
                        theme.plusBtn,
                      )}
                      aria-label={t("admin.pages.rfq.kanbanAddRfq")}
                      onClick={() => setCreateOpen(true)}
                    >
                      <Plus className="size-5" strokeWidth={2.25} aria-hidden />
                    </button>
                  </div>
                </div>

                <div
                  className={cn(
                    "flex min-h-[min(420px,50vh)] flex-1 flex-col gap-2 rounded-b-2xl p-2.5 xl:min-h-0",
                    theme.columnWell,
                  )}
                >
                  {col.cards.length === 0 ? (
                    <div
                      className={cn(
                        "flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed px-4 py-14 text-center text-[13px] leading-relaxed",
                        theme.emptyWell,
                      )}
                    >
                      {t("admin.pages.rfq.emptyColumn")}
                    </div>
                  ) : (
                    col.cards.map((card) => {
                      const pri = cardPriorityPill(card, t);
                      const progress = cardProgressPct(card, col.key);
                      const barColor = COL_BAR[col.key];
                      const dotClass = COL_DOT[col.key];

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
                            "group w-full cursor-pointer rounded-xl border border-[var(--pw-border)] bg-white px-3 py-2.5 text-left shadow-[0_1px_2px_rgba(15,23,42,0.05)] transition hover:border-[var(--pw-text-muted)] hover:shadow-[0_6px_18px_rgba(15,23,42,0.07)]",
                            card.successBorder && "ring-2 ring-[var(--pw-success)]/25",
                          )}
                        >
                          <div className="flex gap-2">
                            <span className={cn("mt-1 size-1.5 shrink-0 rounded-full", dotClass)} aria-hidden />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-1.5">
                                <h3 className="text-[14px] font-semibold leading-tight tracking-tight text-[var(--pw-text)]">{card.title}</h3>
                                <button
                                  type="button"
                                  className="-me-1 -mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full text-[var(--pw-text-muted)] opacity-80 transition hover:bg-[var(--pw-muted)] hover:text-[var(--pw-text)] group-hover:opacity-100"
                                  aria-label={t("admin.pages.rfq.cardMenuAria")}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setViewCard(card);
                                  }}
                                >
                                  <MoreHorizontal className="size-4" strokeWidth={2} />
                                </button>
                              </div>
                              <div className="mt-1 flex flex-wrap items-center gap-1">
                                <span className={cn("rounded px-1.5 py-px text-[9px] font-semibold uppercase tracking-wide", pri.className)}>
                                  {pri.label}
                                </span>
                              </div>
                              <p className="mt-1 text-[12px] font-medium leading-snug text-[var(--pw-text-secondary)]">
                                {card.publisher} · {card.territory === "KSA" ? "Saudi Arabia" : "UAE"}
                              </p>
                              <p className="mt-0.5 line-clamp-2 text-[12px] leading-snug text-[var(--pw-text-muted)]">
                                {card.meta1}
                                <span className="text-[var(--pw-border)]"> · </span>
                                {card.meta2}
                              </p>
                            </div>
                          </div>

                          <div className="mt-2.5">
                            <div className="mb-1 flex items-center justify-between text-[10px] font-medium text-[var(--pw-text-secondary)]">
                              <span>{t("admin.pages.rfq.kanbanProgress")}</span>
                              <span className="tabular-nums text-[var(--pw-text)]">{progress}%</span>
                            </div>
                            <div className={cn("h-1.5 overflow-hidden rounded-full", theme.barTrack)}>
                              <div
                                className="h-full rounded-full transition-[width]"
                                style={{ width: `${progress}%`, backgroundColor: barColor }}
                              />
                            </div>
                          </div>

                          <div className="mt-2.5 flex items-center justify-between border-t border-[var(--pw-border)]/70 pt-2">
                            <div className="flex items-center gap-1 text-[11px] text-[var(--pw-text-secondary)]">
                              <Calendar className="size-3 shrink-0 text-[var(--pw-text-muted)]" strokeWidth={2} aria-hidden />
                              <span>{card.footerDate ?? "—"}</span>
                            </div>
                            <div className="flex -space-x-2" title={card.accountManager}>
                              <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[var(--pw-brand)] text-[9px] font-bold text-white shadow-sm">
                                {amInitials(card.accountManager)}
                              </span>
                            </div>
                          </div>

                          {card.pendingBadge ? (
                            <p className="mt-2 text-[11px] font-medium leading-tight text-[var(--pw-alert)]">{card.pendingBadge}</p>
                          ) : null}
                          {card.fulfillment ? (
                            <p className="mt-1 text-[11px] font-medium leading-tight text-[var(--pw-success)]">{card.fulfillment}</p>
                          ) : null}

                          {card.showReviewCta ? (
                            <div className="mt-2.5">
                              <Button
                                type="button"
                                size="sm"
                                className="h-8 w-full rounded-lg bg-[#1d4ed8] text-[11px] font-semibold text-white shadow-sm hover:bg-[#1e40af]"
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

                  <button
                    type="button"
                    onClick={() => setCreateOpen(true)}
                    className={cn(
                      "flex w-full flex-col items-center justify-center gap-0.5 rounded-xl border-2 border-dashed py-4 text-[12px] font-semibold transition",
                      theme.addCard,
                    )}
                  >
                    <Plus className="size-4 opacity-80" strokeWidth={2.25} />
                    {t("admin.pages.rfq.addRfqCard")}
                  </button>
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
