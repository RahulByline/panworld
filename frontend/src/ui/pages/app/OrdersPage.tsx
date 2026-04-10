import { useMemo, useState } from "react";
import { Card } from "../../components/Card";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { usePortalMock } from "./mockHooks";

function statusPill(s: string) {
  if (s === "Delivered") return "bg-emerald-100 text-emerald-900";
  if (s === "Dispatched") return "bg-indigo-100 text-indigo-900";
  if (s === "Processing") return "bg-amber-100 text-amber-900";
  return "bg-slate-100 text-slate-800";
}

export function OrdersPage() {
  const { orders } = usePortalMock();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"All" | (typeof orders)[number]["status"]>("All");

  const rows = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return orders
      .filter((x) => (status === "All" ? true : x.status === status))
      .filter((x) => (qq ? (x.orderNo + " " + x.trackingNo).toLowerCase().includes(qq) : true))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [orders, q, status]);

  const totalValue = useMemo(() => rows.reduce((s, x) => s + x.total, 0), [rows]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-2xl font-semibold text-slate-900">Orders</div>
          <div className="mt-1 text-sm text-slate-600">Order history with delivery tracking.</div>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="secondary">
            New order
          </Button>
          <Button type="button">Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <Card className="p-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Orders</div>
          <div className="mt-1 text-2xl font-semibold text-slate-900">{rows.length}</div>
        </Card>
        <Card className="p-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total value</div>
          <div className="mt-1 text-2xl font-semibold text-slate-900">{totalValue.toLocaleString()}</div>
        </Card>
        <Card className="p-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Most used courier</div>
          <div className="mt-1 text-2xl font-semibold text-slate-900">Aramex</div>
        </Card>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search order no / tracking…" />
          <select
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300"
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
          >
            <option value="All">All statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Processing">Processing</option>
            <option value="Dispatched">Dispatched</option>
            <option value="Delivered">Delivered</option>
          </select>
          <div className="flex items-center justify-end text-sm text-slate-600">{rows.length} orders</div>
        </div>
      </Card>

      <Card className="p-2">
        <div className="overflow-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Courier</th>
                <th className="px-4 py-3">Tracking</th>
                <th className="px-4 py-3">ETA</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((x) => (
                <tr key={x.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-semibold text-slate-900">{x.orderNo}</td>
                  <td className="px-4 py-3">
                    <span className={"rounded-full px-2.5 py-1 text-xs font-semibold " + statusPill(x.status)}>{x.status}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{new Date(x.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-slate-700">{x.courier}</td>
                  <td className="px-4 py-3 text-slate-700">{x.trackingNo}</td>
                  <td className="px-4 py-3 text-slate-700">{new Date(x.eta).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <Button type="button" size="sm" variant="secondary">
                      Track
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

