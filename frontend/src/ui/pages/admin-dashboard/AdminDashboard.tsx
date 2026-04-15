import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/auth.store";
import { api } from "../../../services/api";
import {
  catalogueCounts,
  dashboardActivityLog,
  dashboardHeadlineStats,
  dashboardSupportTickets,
  publisherCoverageRows,
  rfqPipelineStages,
  salesAggregateStats,
  salesTeamDashboard,
} from "../../../data/admin-dashboard";
import { useAdminToast } from "../../admin/hooks/useAdminToast";
import { Button } from "../../components/Button";
import { cn } from "../../utils/cn";

export function AdminDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user)!;
  const { show, Toast } = useAdminToast();
  const [schoolCount, setSchoolCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get<{ ok: boolean; data: { schools: unknown[] } }>("admin/schools");
        if (!cancelled && res.data?.ok) setSchoolCount(res.data.data.schools.length);
      } catch {
        if (!cancelled) setSchoolCount(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return t("admin.dashboard.greetMorningEmoji", { name: user.firstName });
    if (h < 18) return t("admin.dashboard.greetAfternoonEmoji", { name: user.firstName });
    return t("admin.dashboard.greetEveningEmoji", { name: user.firstName });
  }, [t, user.firstName]);

  const subLine = useMemo(() => {
    const now = new Date();
    const weekday = now.toLocaleDateString(undefined, { weekday: "long" });
    const rest = now.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
    return t("admin.dashboard.pageSubLine", { weekday, date: rest });
  }, [t]);

  const displaySchools = schoolCount ?? 147;

  return (
    <div className="font-sans text-[#1A1917]">
      <Toast />

      {/* Page header — matches panworld_admin dashboard */}
      <div className="mb-5 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-['DM_Serif_Display',serif] text-xl font-bold text-[#0A3D62] sm:text-[22px]">{greeting}</h1>
          <p className="mt-1 text-[13px] text-[#847F79]">{subLine}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" size="sm" onClick={() => show(t("admin.dashboard.exportToast"))}>
            {t("admin.dashboard.exportReport")}
          </Button>
          <Button type="button" size="sm" className="bg-[#E8912D] text-white hover:bg-[#d67a20]" onClick={() => show(t("admin.dashboard.quickAddToast"))}>
            {t("admin.dashboard.quickAdd")}
          </Button>
        </div>
      </div>

      {/* Row of 5 headline stats */}
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-3.5">
        <StatCard
          label={t("admin.dashboard.statSchools")}
          value={String(displaySchools)}
          trend={dashboardHeadlineStats.schoolsTrend}
          trendVariant="up"
        />
        <StatCard
          label={t("admin.dashboard.statSalespeople")}
          value={String(dashboardHeadlineStats.activeSalespeople)}
          trend={t("admin.dashboard.statSalespeopleTrend")}
          trendVariant="up"
        />
        <StatCard
          label={t("admin.dashboard.statRfqs")}
          value={String(dashboardHeadlineStats.openRfqs)}
          trend={dashboardHeadlineStats.openRfqsAlert}
          trendVariant="danger"
          valueClass="text-[#E8912D]"
        />
        <StatCard
          label={t("admin.dashboard.statTickets")}
          value={String(dashboardHeadlineStats.openTickets)}
          trend={dashboardHeadlineStats.ticketsSla}
          trendVariant="danger"
          valueClass="text-[#BE3A3A]"
        />
        <StatCard
          label={t("admin.dashboard.statCerts")}
          value={String(dashboardHeadlineStats.certsIssued)}
          trend={dashboardHeadlineStats.certsTrend}
          trendVariant="up"
          valueClass="text-[#0D7A5F]"
          className="col-span-2 lg:col-span-1"
        />
      </div>

      {/* Sales — team aggregates */}
      <div className="mb-5 rounded-[14px] border border-[#DDD9D2] bg-white p-4 sm:p-5">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[13.5px] font-semibold text-[#1A1917]">{t("admin.dashboard.salesSectionTitle")}</h2>
            <p className="text-xs text-[#847F79]">{t("admin.dashboard.salesSectionSub")}</p>
          </div>
          <Link
            to="/admin/account-managers"
            className="w-fit rounded-md border border-[#DDD9D2] px-3 py-1.5 text-xs font-medium hover:bg-[#F7F5F2]"
          >
            {t("admin.dashboard.salesManageTeam")}
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <SalesMini
            label={t("admin.dashboard.salesTeamPipeline")}
            value={salesAggregateStats.teamPipelineAed}
            hint={salesAggregateStats.pipelineTrend}
          />
          <SalesMini
            label={t("admin.dashboard.salesWonMtd")}
            value={String(salesAggregateStats.rfqsWonMtd)}
            hint={salesAggregateStats.rfqsWonHint}
          />
          <SalesMini
            label={t("admin.dashboard.salesDemosWeek")}
            value={String(salesAggregateStats.demosBookedWeek)}
            hint={salesAggregateStats.demosHint}
          />
          <SalesMini
            label={t("admin.dashboard.salesAvgResponse")}
            value={salesAggregateStats.avgFirstResponseHrs}
            hint={salesAggregateStats.responseHint}
          />
        </div>
        <p className="mt-3 text-xs text-[#847F79]">
          {t("admin.dashboard.salesNewSchools", { n: salesAggregateStats.newSchoolsAssigned30d })} · {salesAggregateStats.schoolsAssignedHint}
        </p>
      </div>

      {/* Catalogue overview | RFQ pipeline */}
      <div className="mb-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-[14px] border border-[#DDD9D2] bg-white p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[13.5px] font-semibold">{t("admin.dashboard.catalogueTitle")}</h2>
            <Link to="/admin/cms/textbooks" className="rounded-md border border-[#DDD9D2] px-2.5 py-1 text-xs font-medium hover:bg-[#F7F5F2]">
              {t("admin.dashboard.manageArrow")}
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            <CatalogueMini value={catalogueCounts.textbooks} label={t("admin.dashboard.catTextbooks")} onNavigate={() => navigate("/admin/cms/textbooks")} />
            <CatalogueMini value={catalogueCounts.library} label={t("admin.dashboard.catLibrary")} onNavigate={() => navigate("/admin/cms/library")} />
            <CatalogueMini value={catalogueCounts.kits} label={t("admin.dashboard.catKits")} onNavigate={() => navigate("/admin/cms/kits")} />
          </div>
          <div className="my-4 border-t border-[#DDD9D2]" />
          <div className="mb-2.5 text-[12.5px] text-[#847F79]">{t("admin.dashboard.publisherCoverage")}</div>
          <div className="flex flex-col gap-1.5">
            {publisherCoverageRows.map((row) => (
              <div key={row.name} className="flex items-center justify-between gap-2 text-[12.5px]">
                <span>{row.name}</span>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-[120px] overflow-hidden rounded-sm bg-[#EBE8E3]">
                    <div
                      className={cn(
                        "h-full rounded-sm",
                        row.barClass === "brand" && "bg-[#0A3D62]",
                        row.barClass === "accent" && "bg-[#E8912D]",
                        row.barClass === "success" && "bg-[#0D7A5F]",
                      )}
                      style={{ width: `${row.pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-xs text-[#847F79]">{row.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[14px] border border-[#DDD9D2] bg-white p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[13.5px] font-semibold">{t("admin.dashboard.rfqPipelineTitle")}</h2>
            <Link to="/admin/rfq" className="rounded-md border border-[#DDD9D2] px-2.5 py-1 text-xs font-medium hover:bg-[#F7F5F2]">
              {t("admin.dashboard.viewAllArrow")}
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {rfqPipelineStages.map((stage) => (
              <RfqStageRow key={stage.id} stage={stage} t={t} />
            ))}
          </div>
        </div>
      </div>

      {/* Sales team table */}
      <div className="mb-5 overflow-hidden rounded-[14px] border border-[#DDD9D2] bg-white">
        <div className="flex flex-col gap-2 border-b border-[#DDD9D2] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-[13.5px] font-semibold">{t("admin.dashboard.salesTeamTableTitle")}</h2>
          <Link to="/admin/assignments" className="text-xs font-medium text-[#0A3D62] underline">
            {t("admin.dashboard.salesViewAssignments")}
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse text-left text-[13px]">
            <thead className="border-b border-[#DDD9D2] bg-[#F7F5F2] text-[11px] font-semibold uppercase tracking-wide text-[#847F79]">
              <tr>
                <th className="px-4 py-3">{t("admin.pages.accountManagers.colName")}</th>
                <th className="px-4 py-3">{t("admin.pages.accountManagers.colRegion")}</th>
                <th className="px-4 py-3">{t("admin.dashboard.salesColSchools")}</th>
                <th className="px-4 py-3">{t("admin.dashboard.salesColOpenRfqs")}</th>
                <th className="px-4 py-3">{t("admin.dashboard.salesColPipeline")}</th>
                <th className="px-4 py-3">{t("admin.dashboard.salesColWonMtd")}</th>
                <th className="px-4 py-3">{t("admin.dashboard.salesColMeetings")}</th>
                <th className="px-4 py-3">{t("admin.dashboard.salesColTrend")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDD9D2]">
              {salesTeamDashboard.map((row) => (
                <tr key={row.name} className="hover:bg-[#FAFAF8]">
                  <td className="px-4 py-3 font-semibold">{row.name}</td>
                  <td className="px-4 py-3 text-[#5C5A55]">{row.region}</td>
                  <td className="px-4 py-3">{row.schools}</td>
                  <td className="px-4 py-3">{row.openRfqs}</td>
                  <td className="px-4 py-3 font-medium text-[#0D7A5F]">{row.pipelineAed}</td>
                  <td className="px-4 py-3">{row.wonMtd}</td>
                  <td className="px-4 py-3">{row.meetingsWeek}</td>
                  <td className={cn("px-4 py-3 font-medium", row.trendUp && row.trend !== "—" ? "text-[#0D7A5F]" : "text-[#847F79]")}>
                    {row.trend}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent activity | Support SLA */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-[14px] border border-[#DDD9D2] bg-white p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[13.5px] font-semibold">{t("admin.dashboard.activityLogTitle")}</h2>
            <span className="rounded-full bg-[#F7F5F2] px-2.5 py-0.5 text-[11px] font-medium text-[#847F79]">{t("admin.dashboard.activityBadge")}</span>
          </div>
          <div className="flex flex-col gap-3">
            {dashboardActivityLog.map((entry) => (
              <div key={entry.id} className="flex gap-3">
                <span
                  className={cn(
                    "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                    entry.dot === "brand" && "bg-[#1368AA]",
                    entry.dot === "success" && "bg-[#0D7A5F]",
                    entry.dot === "accent" && "bg-[#E8912D]",
                    entry.dot === "danger" && "bg-[#BE3A3A]",
                    entry.dot === "purple" && "bg-[#6B3FA0]",
                  )}
                />
                <div className="min-w-0">
                  <div className="text-xs text-[#847F79]">{t(entry.timeKey, { defaultValue: entry.timeFallback })}</div>
                  <div className="text-[13px] font-medium leading-snug">{t(entry.messageKey)}</div>
                  <div className="text-xs text-[#847F79]">{t(entry.actorKey)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[14px] border border-[#DDD9D2] bg-white p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[13.5px] font-semibold">{t("admin.dashboard.supportSlaTitle")}</h2>
            <Link to="/admin/support" className="rounded-md border border-[#DDD9D2] px-2.5 py-1 text-xs font-medium hover:bg-[#F7F5F2]">
              {t("admin.dashboard.manageArrow")}
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[320px] border-collapse text-[13px]">
              <thead>
                <tr className="border-b border-[#DDD9D2] text-left text-[11px] font-semibold uppercase tracking-wide text-[#847F79]">
                  <th className="pb-2 pr-2">{t("admin.dashboard.colTicket")}</th>
                  <th className="pb-2 pr-2">{t("admin.dashboard.colSchool")}</th>
                  <th className="pb-2 pr-2">SLA</th>
                  <th className="pb-2">{t("common.status")}</th>
                </tr>
              </thead>
              <tbody>
                {dashboardSupportTickets.map((row) => (
                  <tr key={row.id} className="border-b border-[#DDD9D2] last:border-0">
                    <td className="py-2.5 pr-2 font-semibold">#{row.id}</td>
                    <td className="py-2.5 pr-2">{row.school}</td>
                    <td className="py-2.5 pr-2">
                      <span
                        className={cn(
                          "font-semibold",
                          row.sla === "breach" && "text-[#BE3A3A]",
                          row.sla === "warn" && "text-[#B06B00]",
                          row.sla === "ok" && "text-[#0D7A5F]",
                        )}
                      >
                        {t(row.slaLabelKey, { defaultValue: row.slaLabelFallback })}
                      </span>
                    </td>
                    <td className="py-2.5">
                      <TicketStatusPill status={row.status} label={t(row.statusKey)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  trend,
  trendVariant,
  valueClass,
  className,
}: {
  label: string;
  value: string;
  trend: string;
  trendVariant: "up" | "danger";
  valueClass?: string;
  className?: string;
}) {
  return (
    <div className={cn("rounded-[14px] border border-[#DDD9D2] bg-white px-4 py-3.5", className)}>
      <div className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#847F79]">{label}</div>
      <div className={cn("mt-1.5 font-['DM_Serif_Display',serif] text-[26px] font-bold leading-none text-[#0A3D62]", valueClass)}>{value}</div>
      <div
        className={cn(
          "mt-1.5 text-xs",
          trendVariant === "up" && "text-[#0D7A5F]",
          trendVariant === "danger" && "text-[#BE3A3A]",
        )}
      >
        {trend}
      </div>
    </div>
  );
}

function SalesMini({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-xl border border-[#E2E0D9] bg-[#F7F5F2] px-3 py-3">
      <div className="text-[10px] font-semibold uppercase tracking-wide text-[#847F79]">{label}</div>
      <div className="mt-1 font-['DM_Serif_Display',serif] text-lg font-bold text-[#0A3D62] sm:text-xl">{value}</div>
      <div className="mt-0.5 text-[11px] text-[#5C5A55]">{hint}</div>
    </div>
  );
}

function CatalogueMini({ value, label, onNavigate }: { value: number; label: string; onNavigate: () => void }) {
  return (
    <button
      type="button"
      onClick={onNavigate}
      className="w-full cursor-pointer rounded-lg border border-[#DDD9D2] bg-[#F7F5F2] px-3 py-3 text-center transition hover:border-[#0A3D62]/40 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D62]/35"
    >
      <div className="font-['DM_Serif_Display',serif] text-[22px] font-bold text-[#0A3D62]">{value}</div>
      <div className="mt-1 text-[11px] text-[#847F79]">{label}</div>
    </button>
  );
}

function RfqStageRow({ stage, t }: { stage: (typeof rfqPipelineStages)[0]; t: (k: string, o?: Record<string, unknown>) => string }) {
  const titleKey = `admin.dashboard.rfqStage.${stage.id}.title`;
  const subKey = `admin.dashboard.rfqStage.${stage.id}.sub`;
  const styles = {
    warn: "border border-[#F5D78A]/40 bg-[#FEF3D0]",
    brand: "bg-[#E1EEF9]",
    success: "bg-[#D5F0E8]",
    muted: "border border-[#DDD9D2] bg-[#F7F5F2]",
  };
  const titleColors = {
    warn: "text-[#B06B00]",
    brand: "text-[#134074]",
    success: "text-[#0D7A5F]",
    muted: "text-[#4A4845]",
  };
  const showSub = stage.id !== "closed";
  return (
    <div className={cn("flex items-center justify-between rounded-lg px-3 py-2.5", styles[stage.variant])}>
      <div>
        <div className={cn("text-[13px] font-semibold", titleColors[stage.variant])}>{t(titleKey)}</div>
        {showSub ? <div className="text-xs text-[#847F79]">{t(subKey, { count: stage.count })}</div> : null}
      </div>
      <div className="font-['DM_Serif_Display',serif] text-[22px] font-bold text-[#0A3D62]">{stage.count}</div>
    </div>
  );
}

function TicketStatusPill({ status, label }: { status: string; label: string }) {
  const cls =
    status === "open"
      ? "bg-rose-100 text-rose-800"
      : status === "progress"
        ? "bg-amber-100 text-amber-900"
        : "bg-[#E1EEF9] text-[#0A3D62]";
  return <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold", cls)}>{label}</span>;
}
