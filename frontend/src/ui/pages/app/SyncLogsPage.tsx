import { useMemo, useState } from "react";
import { Card } from "../../components/Card";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { usePortalMock } from "./mockHooks";

function statusPill(s: string) {
  return s === "OK" ? "bg-emerald-100 text-emerald-900" : "bg-rose-100 text-rose-900";
}

export function SyncLogsPage() {
  const { syncLogs } = usePortalMock();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"All" | "OK" | "ERROR">("All");

  const rows = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return syncLogs
      .filter((x) => (status === "All" ? true : x.status === status))
      .filter((x) => (qq ? (x.message + " " + x.direction + " " + x.system).toLowerCase().includes(qq) : true))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [syncLogs, q, status]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-2xl font-semibold text-slate-900">Sync logs</div>
          <div className="mt-1 text-sm text-slate-600">Integration visibility for Odoo.</div>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="secondary">
            Run sync
          </Button>
          <Button type="button">Export</Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search message/system/direction…" />
          <select
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300"
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
          >
            <option value="All">All</option>
            <option value="OK">OK</option>
            <option value="ERROR">ERROR</option>
          </select>
          <div className="flex items-center justify-end text-sm text-slate-600">{rows.length} entries</div>
        </div>
      </Card>

      <Card className="p-2">
        <div className="overflow-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">System</th>
                <th className="px-4 py-3">Direction</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((x) => (
                <tr key={x.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-700">{new Date(x.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3 text-slate-700">{x.system}</td>
                  <td className="px-4 py-3 text-slate-700">{x.direction}</td>
                  <td className="px-4 py-3">
                    <span className={"rounded-full px-2.5 py-1 text-xs font-semibold " + statusPill(x.status)}>{x.status}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{x.message}</td>
                  <td className="px-4 py-3 text-right">
                    <Button type="button" size="sm" variant="secondary">
                      View payload
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

