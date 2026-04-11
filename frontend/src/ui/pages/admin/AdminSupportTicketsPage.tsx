import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AlertTriangle, Search } from "lucide-react";
import { AdminPageHeader } from "../../admin/components/AdminPageHeader";
import { AdminStatCard } from "../../admin/components/AdminStatCard";
import { Button } from "../../components/Button";
import { SupportTicketViewModal } from "../../admin/components/support/SupportTicketViewModal";
import { useAdminToast } from "../../admin/hooks/useAdminToast";
import { cn } from "../../utils/cn";
import type { SupportTicketRow, SupportTicketUiStatus } from "../../../data/admin/supportTickets";
import { supportSummary, supportTickets } from "../../../data/admin/supportTickets";

type FilterKey = "all" | "open" | "progress" | "resolved";

function matchesFilter(row: SupportTicketRow, filter: FilterKey): boolean {
  if (filter === "all") return true;
  if (filter === "open") return row.uiStatus === "open";
  if (filter === "progress") return row.uiStatus === "in_progress";
  if (filter === "resolved") return row.uiStatus === "resolved";
  return true;
}

function statusDotClass(status: SupportTicketUiStatus): string {
  if (status === "open") return "bg-[#DE350B]";
  if (status === "in_progress") return "bg-[#E8912D]";
  return "bg-[#0D9488]";
}

function slaTextClass(tone: SupportTicketRow["slaTone"]): string {
  if (tone === "breach") return "font-semibold text-[#C0392B]";
  if (tone === "warn") return "text-[#B7791F]";
  if (tone === "resolved") return "text-[#1E8449]";
  return "text-[#5C5A55]";
}

export function AdminSupportTicketsPage() {
  const { t } = useTranslation();
  const { show, Toast } = useAdminToast();
  const [filter, setFilter] = useState<FilterKey>("all");
  const [q, setQ] = useState("");
  const [viewRow, setViewRow] = useState<SupportTicketRow | null>(null);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let rows = supportTickets.filter((r) => matchesFilter(r, filter));
    if (!needle) return rows;
    return rows.filter(
      (r) =>
        r.id.toLowerCase().includes(needle) ||
        r.school.toLowerCase().includes(needle) ||
        r.platform.toLowerCase().includes(needle) ||
        r.issueType.toLowerCase().includes(needle) ||
        r.opened.toLowerCase().includes(needle) ||
        r.slaText.toLowerCase().includes(needle),
    );
  }, [filter, q]);

  const slaCount = supportSummary.slaBreach;

  const statusLabel = (s: SupportTicketUiStatus) => {
    if (s === "open") return t("admin.pages.support.statusUiOpen");
    if (s === "in_progress") return t("admin.pages.support.statusUiProgress");
    return t("admin.pages.support.statusUiResolved");
  };

  return (
    <div className="font-sans">
      <Toast />
      <AdminPageHeader
        title={t("admin.pages.support.title")}
        subtitle={t("admin.pages.support.subtitleSla")}
        actions={
          <Button type="button" className="bg-[#0A3D62] text-white hover:bg-[#071E36]" onClick={() => show(t("admin.pages.support.createTicketToast"))}>
            {t("admin.pages.support.createTicket")}
          </Button>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9A9890]" aria-hidden />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("admin.pages.support.searchTicketsPlaceholder")}
            className="h-10 w-full rounded-lg border border-[#E2E0D9] bg-[#F8F9FA] py-2 pl-9 pr-3 text-sm outline-none focus:border-[#0A3D62] focus:bg-white"
            aria-label={t("admin.pages.support.searchTicketsPlaceholder")}
          />
        </div>
        <select
          className="h-10 rounded-lg border border-[#E2E0D9] bg-white px-3 text-sm shadow-sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value as FilterKey)}
          aria-label={t("common.status")}
        >
          <option value="all">{t("admin.pages.support.filterAll")}</option>
          <option value="open">{t("admin.pages.support.filterOpen")}</option>
          <option value="progress">{t("admin.pages.support.filterProgress")}</option>
          <option value="resolved">{t("admin.pages.support.filterResolved")}</option>
        </select>
      </div>

      {slaCount > 0 && filter !== "resolved" ? (
        <div
          className="mb-4 flex items-start gap-3 rounded-xl border border-[#F5B7B1] bg-[#FDEDEC] px-4 py-3 text-sm text-[#7B241C]"
          role="status"
        >
          <AlertTriangle className="mt-0.5 size-5 shrink-0" aria-hidden />
          <span>{t("admin.pages.support.slaAlert", { count: slaCount })}</span>
        </div>
      ) : null}

      <div className="mb-6 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <AdminStatCard label={t("admin.pages.support.statOpen")} value={supportSummary.open} valueClassName="text-[#C0392B]" />
        <AdminStatCard label={t("admin.pages.support.statProgress")} value={supportSummary.inProgress} valueClassName="text-[#E8912D]" />
        <AdminStatCard label={t("admin.pages.support.statResolved")} value={supportSummary.resolved30d} valueClassName="text-[#1E8449]" />
        <AdminStatCard
          label={t("admin.pages.support.statAvg")}
          value={supportSummary.avgResolution}
          sub={t("admin.pages.support.statAvgSub")}
        />
        <AdminStatCard label={t("admin.pages.support.statSla")} value={supportSummary.slaBreach} valueClassName="text-[#C0392B]" />
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#E2E0D9] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] border-collapse text-left text-[13.5px]">
            <thead className="border-b border-[#E2E0D9] bg-[#F5F4F0] text-[11px] font-semibold uppercase tracking-wide text-[#5C5A55]">
              <tr>
                <th className="px-4 py-3">{t("admin.pages.support.colTicket")}</th>
                <th className="px-4 py-3">{t("admin.pages.support.colSchool")}</th>
                <th className="px-4 py-3">{t("admin.pages.support.colPlatform")}</th>
                <th className="px-4 py-3">{t("admin.pages.support.issueType")}</th>
                <th className="px-4 py-3">{t("admin.pages.support.colOpened")}</th>
                <th className="px-4 py-3">{t("admin.pages.support.colSla")}</th>
                <th className="px-4 py-3">{t("admin.pages.support.colAssigned")}</th>
                <th className="px-4 py-3">{t("common.status")}</th>
                <th className="px-4 py-3 text-right">{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E0D9]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-sm text-[#5C5A55]">
                    {t("admin.pages.support.emptySearch")}
                  </td>
                </tr>
              ) : (
                filtered.map((row) => (
                  <tr
                    key={row.id}
                    className={cn("transition-colors", row.rowHighlight ? "bg-[#FDEAEA]" : "hover:bg-[#FAFAF8]")}
                  >
                    <td className="px-4 py-3 font-mono text-xs font-semibold">#{row.id}</td>
                    <td className="px-4 py-3">{row.school}</td>
                    <td className="px-4 py-3 text-[#5C5A55]">{row.platform}</td>
                    <td className="px-4 py-3">{row.issueType}</td>
                    <td className="px-4 py-3 text-[#5C5A55]">{row.opened}</td>
                    <td className={cn("px-4 py-3 text-[12.5px]", slaTextClass(row.slaTone))}>{row.slaText}</td>
                    <td className={cn("px-4 py-3", !row.assignedTo && "font-medium text-[#C0392B]")}>
                      {row.assignedTo ?? t("admin.pages.support.notAssigned")}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-2">
                        <span className={cn("size-2 shrink-0 rounded-full", statusDotClass(row.uiStatus))} aria-hidden />
                        <span className="text-sm font-medium text-[#1A1917]">{statusLabel(row.uiStatus)}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex flex-wrap justify-end gap-1">
                        {row.actions.includes("assign_now") ? (
                          <Button type="button" size="sm" className="bg-[#C0392B] hover:bg-[#A93226]" onClick={() => setViewRow(row)}>
                            {t("admin.pages.support.assignNow")}
                          </Button>
                        ) : null}
                        {row.actions.includes("view") ? (
                          <Button type="button" variant="secondary" size="sm" onClick={() => setViewRow(row)}>
                            {t("common.view")}
                          </Button>
                        ) : null}
                        {row.actions.includes("resolve") ? (
                          <Button
                            type="button"
                            size="sm"
                            className="bg-[#0D9488] text-white hover:bg-[#0F766E]"
                            onClick={() => show(t("admin.pages.support.toastResolved"))}
                          >
                            {t("admin.pages.support.resolve")}
                          </Button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <SupportTicketViewModal open={!!viewRow} onClose={() => setViewRow(null)} row={viewRow} t={t} onToast={show} />
    </div>
  );
}
