import { useMemo } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from "recharts";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { usePortalMock } from "./mockHooks";

function makeTrend(values: number[]) {
  return values.map((v, idx) => ({ name: `W${idx + 1}`, value: v }));
}

export function AnalyticsPage() {
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
      { label: "Orders", value: String(orders.length), hint: "Last 180 days" },
      { label: "RFQs", value: String(rfqs.length), hint: "Open + closed" },
      { label: "Invoices", value: String(invoices.length), hint: "Issued" },
      { label: "Tickets", value: String(tickets.length), hint: "Support queue" },
    ],
    [orders.length, rfqs.length, invoices.length, tickets.length],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-2xl font-semibold text-slate-900">Analytics</div>
          <div className="mt-1 text-sm text-slate-600">Overview charts and operational metrics.</div>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="secondary">
            Schedule report
          </Button>
          <Button type="button">Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label} className="p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">{k.label}</div>
            <div className="mt-1 text-2xl font-semibold text-slate-900">{k.value}</div>
            <div className="mt-1 text-xs text-slate-500">{k.hint}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="text-sm font-semibold text-slate-900">Orders trend</div>
          <div className="mt-3 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={orderTrend}>
                <defs>
                  <linearGradient id="ordersFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f172a" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#0f172a" fill="url(#ordersFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-5">
          <div className="text-sm font-semibold text-slate-900">RFQs trend</div>
          <div className="mt-3 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={rfqTrend}>
                <defs>
                  <linearGradient id="rfqFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1d4ed8" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#1d4ed8" fill="url(#rfqFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <div className="text-sm font-semibold text-slate-900">Department completion</div>
        <div className="mt-3 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={deptBars}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="v" fill="#0f172a" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

