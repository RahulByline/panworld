import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { useAuthStore } from "../../../store/auth.store";
import { makeMockRfqs } from "../../../mock/data";

function money(n: number) {
  return n.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 });
}

export function RfqPage() {
  const school = useAuthStore((s) => s.school);
  const [status, setStatus] = useState<"ALL" | "SUBMITTED" | "REVIEWED" | "QUOTED" | "APPROVED" | "ORDERED" | "DELIVERED">("ALL");

  const rfqs = useMemo(() => makeMockRfqs(school?.country ?? "UAE"), [school?.country]);
  const filtered = rfqs.filter((r) => (status === "ALL" ? true : r.status === status));

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-2xl font-semibold text-slate-900">RFQ workflow</div>
          <div className="mt-1 text-sm text-slate-600">Submit → Review → Quote → Approve → Order → Deliver.</div>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="secondary">
            Upload files
          </Button>
          <Button type="button">Create RFQ</Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap gap-2">
          {(["ALL", "SUBMITTED", "REVIEWED", "QUOTED", "APPROVED", "ORDERED", "DELIVERED"] as const).map((s) => (
            <Button key={s} type="button" size="sm" variant={status === s ? "primary" : "secondary"} onClick={() => setStatus(s)}>
              {s}
            </Button>
          ))}
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="grid grid-cols-12 gap-0 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600">
          <div className="col-span-3">RFQ No</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-3">Created</div>
          <div className="col-span-2 text-right">Total</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>
        {filtered.slice(0, 18).map((r) => (
          <div key={r.id} className="grid grid-cols-12 items-center gap-0 border-b border-slate-100 px-4 py-3 text-sm">
            <div className="col-span-3 font-semibold text-slate-900">{r.rfqNo}</div>
            <div className="col-span-2">
              <span className="rounded-full border border-slate-200 bg-white px-2 py-1 text-xs">{r.status}</span>
            </div>
            <div className="col-span-3 text-slate-600">{new Date(r.createdAt).toLocaleDateString()}</div>
            <div className="col-span-2 text-right font-semibold text-slate-900">{money(r.total)}</div>
            <div className="col-span-2 text-right">
              <Link to={`/app/rfq/${r.id}`}>
                <Button type="button" size="sm" variant="secondary">
                  View
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

