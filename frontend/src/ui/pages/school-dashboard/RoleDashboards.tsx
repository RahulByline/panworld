import { useMemo } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { mockProducts, makeMockInvoices, makeMockRfqs, mockTickets } from "../../../mock/data";
import type { UserRole } from "../../../types/domain";

function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-[var(--pw-border)] bg-[var(--pw-muted)] p-4 shadow-sm">
      <div className="text-[11.5px] font-medium uppercase tracking-wide text-[var(--pw-text-secondary)]">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-[var(--pw-text)]">{value}</div>
      {hint ? <div className="mt-1 text-xs text-[var(--pw-text-secondary)]">{hint}</div> : null}
    </div>
  );
}

export function RoleDashboard({
  role,
  contextLabel,
  country,
}: {
  role: UserRole;
  contextLabel: string;
  /** School country code (e.g. UAE, KSA); drives mock VAT and product filters. */
  country: string | null;
}) {
  const usageTrend = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => ({
        day: `D${i + 1}`,
        usage: Math.round(52 + Math.sin(i / 2) * 18 + (i % 4) * 4),
        training: Math.round(28 + Math.cos(i / 3) * 12 + (i % 3) * 3),
      })),
    [],
  );

  const deptBars = useMemo(
    () => [
      { dept: "English", completion: 78, engagement: 66 },
      { dept: "Math", completion: 71, engagement: 61 },
      { dept: "Science", completion: 64, engagement: 57 },
      { dept: "Arabic", completion: 58, engagement: 54 },
      { dept: "ICT", completion: 49, engagement: 46 },
    ],
    [],
  );

  const rfqs = useMemo(() => makeMockRfqs(country ?? "UAE"), [country]);
  const invoices = useMemo(() => makeMockInvoices(country ?? "UAE"), [country]);

  const topProducts = useMemo(() => {
    const filtered = mockProducts.filter((p) => (country ? p.countryRelevance.includes(country) : true));
    return filtered
      .filter((p) => p.type === "TEXTBOOK" || p.type === "KIT")
      .slice(0, 5)
      .map((p, idx) => ({ rank: idx + 1, name: p.name, publisher: p.publisher, price: p.price }));
  }, [country]);

  const headline =
    role === "TEACHER"
      ? "Your teaching readiness"
      : role === "HOD"
        ? "Department adoption & engagement"
        : role === "MANAGEMENT"
          ? "School operational snapshot"
          : role === "CEO"
            ? "Executive KPIs"
            : role === "PROCUREMENT"
              ? "Procurement pipeline"
              : role === "PANWORLD_ADMIN"
                ? "Panworld operations"
                : "Publisher analytics (scoped)";

  const stats =
    role === "TEACHER"
      ? [
          { label: "Onboarding", value: "62%", hint: "Checklist completion" },
          { label: "Training progress", value: "54%", hint: "Across assigned series" },
          { label: "Upcoming webinars", value: "2", hint: "Registered/Recommended" },
          { label: "Certificates", value: "4", hint: "Earned this year" },
        ]
      : role === "HOD"
        ? [
            { label: "Dept completion", value: "71%", hint: "Weighted by teachers" },
            { label: "Engagement score", value: "63", hint: "Usage + training + webinars" },
            { label: "Wishlist → RFQ", value: "18", hint: "Items ready to convert" },
            { label: "Open tickets", value: "5", hint: "Across department" },
          ]
        : role === "MANAGEMENT"
          ? [
              { label: "Active departments", value: "9", hint: "With weekly activity" },
              { label: "Training completion", value: "68%", hint: "School-wide" },
              { label: "Orders YTD", value: "12", hint: "Confirmed orders" },
              { label: "Outstanding invoices", value: "6", hint: "Require action" },
            ]
          : role === "CEO"
            ? [
                { label: "Adoption index", value: "74", hint: "Executive composite" },
                { label: "RFQs active", value: "9", hint: "Across pipeline" },
                { label: "Order value YTD", value: country === "KSA" ? "SAR 2.3M" : "AED 2.1M", hint: "Mock totals" },
                { label: "Teacher engagement", value: "67", hint: "Trend improving" },
              ]
            : role === "PROCUREMENT"
              ? [
                  { label: "RFQs in pipeline", value: "7", hint: "Submitted → Approved" },
                  { label: "Deliveries pending", value: "3", hint: "Tracking available" },
                  { label: "Outstanding invoices", value: "6", hint: "Due in 7–30 days" },
                  { label: "Approvals waiting", value: "4", hint: "CEO threshold" },
                ]
              : role === "PANWORLD_ADMIN"
                ? [
                    { label: "Total schools", value: "1,248", hint: "Active tenants" },
                    { label: "Active users", value: "18,420", hint: "Weekly active" },
                    { label: "RFQ funnel", value: "2.1k", hint: "Last 30 days" },
                    { label: "Support SLA", value: "93%", hint: "Within target" },
                  ]
                : [
                    { label: "Catalogue views", value: "48k", hint: "Last 30 days" },
                    { label: "Demo requests", value: "312", hint: "For your products" },
                    { label: "RFQs", value: "88", hint: "Containing your SKU" },
                    { label: "Training completion", value: "61%", hint: "Across adopters" },
                  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-sm text-[var(--pw-text-secondary)]">{contextLabel}</div>
          <div className="mt-1 font-serif text-2xl font-semibold text-[var(--pw-text)]">{headline}</div>
          <div className="mt-1 text-sm text-[var(--pw-text-secondary)]">
            {country ? (country === "KSA" ? "Saudi configuration (Arabic default, VAT 15%, NCC highlights)" : "UAE configuration (English default, VAT 5%)") : "Partner demo mode"}
          </div>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="secondary" className="border-[var(--pw-border)] bg-white text-[var(--pw-text)] hover:bg-[var(--pw-muted)]">
            Export
          </Button>
          <Button type="button" className="bg-[var(--pw-brand)] hover:bg-[var(--pw-brand-deep)]">
            Quick action
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} hint={s.hint} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <Card className="border-[var(--pw-border)] bg-white p-5 shadow-sm lg:col-span-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-[var(--pw-text)]">Usage & training trend</div>
              <div className="mt-1 text-xs text-[var(--pw-text-secondary)]">Last 14 days — used across dashboards for consistency.</div>
            </div>
            <div className="text-xs text-[var(--pw-text-muted)]">{country === "KSA" ? "VAT 15%" : country === "UAE" ? "VAT 5%" : "—"}</div>
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={usageTrend} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="usage" stroke="#1e3a8a" fill="#1e3a8a" fillOpacity={0.12} />
                <Area type="monotone" dataKey="training" stroke="#2563eb" fill="#2563eb" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="border-[var(--pw-border)] bg-white p-5 shadow-sm">
          <div className="text-sm font-semibold text-[var(--pw-text)]">Top products</div>
          <div className="mt-1 text-xs text-[var(--pw-text-secondary)]">AI-style recommendations, country-aware.</div>
          <div className="mt-4 space-y-2">
            {topProducts.map((p) => (
              <div key={p.rank} className="rounded-xl border border-[var(--pw-border)] bg-white px-3 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-[var(--pw-text)]">
                      {p.rank}. {p.name}
                    </div>
                    <div className="mt-1 text-xs text-[var(--pw-text-secondary)]">{p.publisher}</div>
                  </div>
                  <div className="shrink-0 text-right text-xs font-semibold text-[var(--pw-text)]">{p.price.toFixed(2)}</div>
                </div>
                <div className="mt-3">
                  <Button type="button" size="sm" variant="secondary" className="border-[var(--pw-border)] bg-white hover:bg-[var(--pw-muted)]">
                    Open
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {role === "HOD" || role === "MANAGEMENT" || role === "CEO" || role === "PANWORLD_ADMIN" ? (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <Card className="border-[var(--pw-border)] bg-white p-5 shadow-sm lg:col-span-2">
            <div className="text-sm font-semibold text-[var(--pw-text)]">Completion & engagement by department</div>
            <div className="mt-1 text-xs text-[var(--pw-text-secondary)]">Used on leadership dashboards.</div>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptBars}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dept" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="completion" fill="#1e3a8a" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="engagement" fill="#2563eb" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="border-[var(--pw-border)] bg-white p-5 shadow-sm">
            <div className="text-sm font-semibold text-[var(--pw-text)]">Operational queue</div>
            <div className="mt-1 text-xs text-[var(--pw-text-secondary)]">RFQs, invoices, tickets.</div>
            <div className="mt-4 space-y-2 text-sm text-[var(--pw-text)]">
              <div className="rounded-xl border border-[var(--pw-border)] bg-[var(--pw-muted)] px-3 py-2">
                RFQs: <span className="font-semibold">{rfqs.slice(0, 4).length}</span> requiring review
              </div>
              <div className="rounded-xl border border-[var(--pw-border)] bg-[var(--pw-muted)] px-3 py-2">
                Invoices: <span className="font-semibold">{invoices.filter((x) => x.status === "OUTSTANDING").length}</span> outstanding
              </div>
              <div className="rounded-xl border border-[var(--pw-border)] bg-[var(--pw-muted)] px-3 py-2">
                Tickets: <span className="font-semibold">{mockTickets.filter((x) => x.status !== "RESOLVED").length}</span> open/in progress
              </div>
              <div className="mt-3">
                <Button type="button" variant="secondary" size="sm" className="border-[var(--pw-border)] bg-white hover:bg-[var(--pw-muted)]">
                  Open queue
                </Button>
              </div>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
}

