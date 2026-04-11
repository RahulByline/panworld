import { useMemo } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from "recharts";
import { useTranslation } from "react-i18next";
import { PwPageHeader } from "../../panworld/PwPageHeader";
import { usePortalMock } from "./mockHooks";

const BRAND = "#0A3D62";
const BRAND_MID = "#1A5276";
const ACCENT = "#E8912D";

function makeTrend(values: number[]) {
  return values.map((v, idx) => ({ name: `W${idx + 1}`, value: v }));
}

export function AnalyticsPage() {
  const { t } = useTranslation();
  const { orders, rfqs, invoices, tickets } = usePortalMock();

  const orderTrend = useMemo(() => makeTrend([12, 10, 14, 16, 15, 18, 20, 17, 21, 19]), []);
  const rfqTrend = useMemo(() => makeTrend([5, 6, 7, 8, 6, 9, 10, 8, 11, 12]), []);
  const deptBars = useMemo(
    () => [
      { name: "English", v: 78 },
      { name: "Math", v: 64 },
      { name: "Science", v: 70 },
      { name: "Arabic", v: 56 },
      { name: "ICT", v: 61 },
    ],
    [],
  );

  const kpis = useMemo(
    () => [
      { label: t("mvpPages.schoolAnalytics.kpiOrders"), value: String(orders.length), hint: t("mvpPages.schoolAnalytics.kpiHint180") },
      { label: t("mvpPages.schoolAnalytics.kpiRfqs"), value: String(rfqs.length), hint: t("mvpPages.schoolAnalytics.kpiHintAll") },
      { label: t("mvpPages.schoolAnalytics.kpiInvoices"), value: String(invoices.length), hint: t("mvpPages.schoolAnalytics.kpiHintIssued") },
      { label: t("mvpPages.schoolAnalytics.kpiTickets"), value: String(tickets.length), hint: t("mvpPages.schoolAnalytics.kpiHintQueue") },
    ],
    [orders.length, rfqs.length, invoices.length, tickets.length, t],
  );

  return (
    <div>
      <PwPageHeader
        title={t("nav.analytics")}
        subtitle={t("mvpPages.schoolAnalytics.subtitle")}
        right={
          <div className="flex flex-wrap gap-2">
            <button type="button" className="pw-btn pw-btn-outline pw-btn-sm">
              {t("mvpPages.schoolAnalytics.scheduleReport")}
            </button>
            <button type="button" className="pw-btn pw-btn-primary pw-btn-sm">
              {t("mvpPages.schoolAnalytics.export")}
            </button>
          </div>
        }
      />

      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="pw-stat-card">
            <div className="pw-stat-label">{k.label}</div>
            <div className="pw-stat-value">{k.value}</div>
            <div className="pw-stat-sub">{k.hint}</div>
          </div>
        ))}
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="pw-card lg:col-span-2">
          <div className="text-sm font-semibold text-[#1A1917]">{t("mvpPages.schoolAnalytics.ordersTrend")}</div>
          <div className="mt-3 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={orderTrend}>
                <defs>
                  <linearGradient id="ordersFillPw" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={BRAND} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={BRAND} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E0D9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke={BRAND} strokeWidth={2} fill="url(#ordersFillPw)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="pw-card">
          <div className="text-sm font-semibold text-[#1A1917]">{t("mvpPages.schoolAnalytics.rfqsTrend")}</div>
          <div className="mt-3 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={rfqTrend}>
                <defs>
                  <linearGradient id="rfqFillPw" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={BRAND_MID} stopOpacity={0.22} />
                    <stop offset="95%" stopColor={BRAND_MID} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E0D9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke={BRAND_MID} strokeWidth={2} fill="url(#rfqFillPw)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="pw-card">
        <div className="text-sm font-semibold text-[#1A1917]">{t("mvpPages.schoolAnalytics.deptCompletion")}</div>
        <div className="mt-3 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={deptBars}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E0D9" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="v" fill={ACCENT} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
