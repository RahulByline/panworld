import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../../store/auth.store";
import { api } from "../../../services/api";

const DEMO_RFQS = [
  {
    av: "AN",
    avClass: "bg-[#D6EAF8] text-[#0A3D62]",
    title: "Al Noor Int'l — Inspire Science G1–G8",
    meta: "420 students · Submitted 1 Apr",
  },
  {
    av: "GD",
    avClass: "bg-[#E8F5E9] text-[#1E8449]",
    title: "GEMS Dubai — Reveal Math + Wonders",
    meta: "680 students · Submitted 5 Apr",
  },
  {
    av: "TL",
    avClass: "bg-[#EDE7F6] text-[#512DA8]",
    title: "Taaleem — StudySync GCC Ed. G6–G12",
    meta: "300 licences · Submitted 7 Apr",
  },
];

const PUBLISHER_BARS = [
  { name: "McGraw Hill", pct: 74, fill: "success" as const },
  { name: "Kodeit", pct: 61, fill: "brand" as const },
  { name: "StudySync", pct: 48, fill: "accent" as const },
  { name: "Achieve3000", pct: 32, fill: "accent" as const },
];

const ACTIVITY_ROWS = [
  { school: "Al Noor International", country: "UAE", phase: "Phase 1+2+3", login: "Today", rfqs: "3", train: "68%", trainClass: "text-[#1E8449]" },
  { school: "GEMS World Academy", country: "UAE", phase: "Phase 1+2", login: "Yesterday", rfqs: "1", train: "52%", trainClass: "text-[#0A3D62]" },
  { school: "Al Faisaliyah School", country: "KSA", phase: "Phase 1", login: "3 days ago", rfqs: "0", train: "20%", trainClass: "text-[#E8912D]" },
  { school: "Taaleem Group", country: "UAE", phase: "Phase 1+2+3", login: "Today", rfqs: "2", train: "81%", trainClass: "text-[#1E8449]" },
];

export function AdminDashboard() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user)!;
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
    if (h < 12) return t("admin.dashboard.greetMorning", { name: user.firstName });
    if (h < 18) return t("admin.dashboard.greetAfternoon", { name: user.firstName });
    return t("admin.dashboard.greetEvening", { name: user.firstName });
  }, [t, user.firstName]);

  const bannerMetaLine = useMemo(() => {
    const date = new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
    return t("admin.dashboard.bannerMeta", { date });
  }, [t]);

  const displaySchools = schoolCount ?? "142";

  return (
    <div className="font-sans">
      <div className="mb-6 rounded-2xl bg-gradient-to-br from-[#071E36] to-[#0A3D62] px-7 py-6 text-white">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-1 text-xs uppercase tracking-[0.08em] text-white/60">{bannerMetaLine}</div>
            <div className="font-['DM_Serif_Display',serif] text-2xl sm:text-[26px]">{greeting}</div>
            <div className="mt-1 text-sm text-white/75">{t("admin.dashboard.bannerSub")}</div>
          </div>
          <div className="text-right">
            <div className="text-[40px] font-bold leading-none">{displaySchools}</div>
            <div className="text-xs text-white/60">{t("admin.dashboard.registeredSchools")}</div>
          </div>
        </div>
      </div>

      <div className="mb-5">
        <div className="mb-2.5 text-[13px] font-semibold uppercase tracking-[0.06em] text-[#5C5A55]">{t("admin.dashboard.aiAlerts")}</div>
        <div className="mb-2 flex flex-col gap-2 rounded-lg bg-gradient-to-br from-[#7B1FA2] to-[#512DA8] px-4 py-3 text-white sm:flex-row sm:items-center sm:gap-3">
          <span className="text-lg">⚠</span>
          <div className="min-w-0 flex-1">
            <div className="text-[13.5px] font-semibold">{t("admin.dashboard.alert1Title")}</div>
            <div className="text-xs opacity-80">{t("admin.dashboard.alert1Sub")}</div>
          </div>
          <button type="button" className="shrink-0 rounded-md bg-white/15 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/25">
            {t("admin.dashboard.flagAm")}
          </button>
        </div>
        <div className="flex flex-col gap-2 rounded-lg bg-gradient-to-br from-[#7B1FA2] to-[#512DA8] px-4 py-3 text-white sm:flex-row sm:items-center sm:gap-3">
          <span className="text-lg">📈</span>
          <div className="min-w-0 flex-1">
            <div className="text-[13.5px] font-semibold">{t("admin.dashboard.alert2Title")}</div>
            <div className="text-xs opacity-80">{t("admin.dashboard.alert2Sub")}</div>
          </div>
          <button type="button" className="shrink-0 rounded-md bg-white/15 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/25">
            {t("admin.dashboard.notifyAms")}
          </button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard value={String(displaySchools)} label={t("admin.dashboard.kpiSchools")} change={t("admin.dashboard.kpiSchoolsChange")} tone="brand" />
        <KpiCard value="AED 1.8M" label={t("admin.dashboard.kpiPipeline")} change={t("admin.dashboard.kpiPipelineChange")} tone="success" />
        <KpiCard value="28%" label={t("admin.dashboard.kpiConversion")} change={t("admin.dashboard.kpiConversionChange")} tone="accent" />
        <KpiCard value="5" label={t("admin.dashboard.kpiTickets")} change={t("admin.dashboard.kpiTicketsChange")} tone="danger" />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#E2E0D9] bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm font-semibold">{t("admin.dashboard.recentRfqs")}</div>
            <Link to="/admin/rfq" className="rounded-md border border-[#E2E0D9] bg-white px-2.5 py-1 text-xs font-medium text-[#1A1917] hover:bg-[#F5F4F0]">
              {t("admin.dashboard.viewAll")}
            </Link>
          </div>
          <div className="divide-y divide-[#E2E0D9]">
            {DEMO_RFQS.map((r) => (
              <div key={r.title} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${r.avClass}`}>{r.av}</div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13.5px] font-medium">{r.title}</div>
                  <div className="text-xs text-[#5C5A55]">{r.meta}</div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FDEBD0] px-2.5 py-1 text-xs font-medium text-[#7D4E10]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#E8912D]" />
                  {t("admin.dashboard.statusAwaiting")}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#E2E0D9] bg-white p-5">
          <div className="mb-4 text-sm font-semibold">{t("admin.dashboard.trainingByPublisher")}</div>
          <div className="space-y-3">
            {PUBLISHER_BARS.map((p) => (
              <div key={p.name}>
                <div className="mb-1 flex justify-between text-[12.5px]">
                  <span>{p.name}</span>
                  <span className="font-semibold">{p.pct}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-sm bg-[#E2E0D9]">
                  <div
                    className={`h-full rounded-sm ${
                      p.fill === "success"
                        ? "bg-[#1E8449]"
                        : p.fill === "accent"
                          ? "bg-[#E8912D]"
                          : "bg-[#0A3D62]"
                    }`}
                    style={{ width: `${p.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[#E2E0D9] bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm font-semibold">{t("admin.dashboard.recentActivity")}</div>
          <Link to="/admin/schools" className="rounded-md border border-[#E2E0D9] bg-white px-2.5 py-1 text-xs font-medium hover:bg-[#F5F4F0]">
            {t("admin.dashboard.allSchools")}
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-[13.5px]">
            <thead>
              <tr className="border-b border-[#E2E0D9] text-left text-[11px] font-semibold uppercase tracking-wide text-[#5C5A55]">
                <th className="pb-2 pr-3">{t("admin.dashboard.colSchool")}</th>
                <th className="pb-2 pr-3">{t("admin.dashboard.colCountry")}</th>
                <th className="pb-2 pr-3">{t("admin.dashboard.colPhase")}</th>
                <th className="pb-2 pr-3">{t("admin.dashboard.colLogin")}</th>
                <th className="pb-2 pr-3">{t("admin.dashboard.colRfqs")}</th>
                <th className="pb-2">{t("admin.dashboard.colTraining")}</th>
              </tr>
            </thead>
            <tbody>
              {ACTIVITY_ROWS.map((row) => (
                <tr key={row.school} className="border-b border-[#E2E0D9] last:border-0 hover:bg-[#FAFAF8]">
                  <td className="py-3 pr-3 font-semibold">{row.school}</td>
                  <td className="py-3 pr-3">{row.country}</td>
                  <td className="py-3 pr-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        row.phase.includes("1+2+3")
                          ? "bg-[#D6EAF8] text-[#0A3D62]"
                          : row.phase === "Phase 1"
                            ? "bg-[#F5F4F0] text-[#5C5A55]"
                            : "bg-[#D6EAF8] text-[#0A3D62]"
                      }`}
                    >
                      {row.phase}
                    </span>
                  </td>
                  <td className="py-3 pr-3 text-[#5C5A55]">{row.login}</td>
                  <td className="py-3 pr-3">{row.rfqs}</td>
                  <td className={`py-3 font-semibold ${row.trainClass}`}>{row.train}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  value,
  label,
  change,
  tone,
}: {
  value: string;
  label: string;
  change: string;
  tone: "brand" | "success" | "accent" | "danger";
}) {
  const valueColor =
    tone === "brand"
      ? "text-[#0A3D62]"
      : tone === "success"
        ? "text-[#1E8449]"
        : tone === "accent"
          ? "text-[#E8912D]"
          : "text-[#C0392B]";
  return (
    <div className="rounded-xl border border-[#E2E0D9] bg-[#F5F4F0] p-4">
      <div className={`text-[26px] font-semibold leading-none ${valueColor}`}>{value}</div>
      <div className="mt-1 text-[11.5px] font-medium uppercase tracking-wide text-[#5C5A55]">{label}</div>
      <div className="mt-1 text-xs text-[#5C5A55]">{change}</div>
    </div>
  );
}
