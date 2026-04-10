import { Link, useParams } from "react-router-dom";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { usePortalMock } from "./mockHooks";

function statusPill(s: string) {
  if (s === "Delivered") return "bg-emerald-100 text-emerald-900";
  if (s === "Dispatched") return "bg-indigo-100 text-indigo-900";
  if (s === "Approved") return "bg-sky-100 text-sky-900";
  if (s === "Reviewed") return "bg-amber-100 text-amber-900";
  return "bg-slate-100 text-slate-800";
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString();
}

export function SampleRequestDetailPage() {
  const { id } = useParams();
  const { samples } = usePortalMock();
  const item = samples.find((s) => s.id === id);

  if (!item) {
    return (
      <Card className="p-5">
        <div className="text-sm font-semibold text-slate-900">Sample request not found</div>
        <div className="mt-2">
          <Link to="/app/samples">
            <Button type="button" variant="secondary" size="sm">
              Back to requests
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <div className="truncate text-2xl font-semibold text-slate-900">{item.productName}</div>
            <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-700">{item.requestNo}</span>
            <span className={"rounded-full px-2.5 py-1 text-xs font-semibold " + statusPill(item.status)}>{item.status}</span>
          </div>
          <div className="mt-1 text-sm text-slate-600">
            {item.publisher} • Qty {item.qty}
            {item.grades ? ` • G ${item.grades}` : ""} {item.subject ? ` • ${item.subject}` : ""}
          </div>
        </div>
        <div className="flex gap-2">
          <Link to={`/app/samples/${item.id}/follow-up`}>
            <Button type="button">Follow up</Button>
          </Link>
          <Link to="/app/samples">
            <Button type="button" variant="secondary">
              Back
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Card className="p-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Requested</div>
          <div className="mt-1 text-sm font-semibold text-slate-900">{fmtDate(item.requestedAt)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Last update</div>
          <div className="mt-1 text-sm font-semibold text-slate-900">{fmtDate(item.lastUpdatedAt)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">ETA</div>
          <div className="mt-1 text-sm font-semibold text-slate-900">{item.expectedBy ? fmtDate(item.expectedBy) : "—"}</div>
        </Card>
      </div>

      {item.notes ? (
        <Card className="p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Notes</div>
          <div className="mt-2 text-sm text-slate-700">{item.notes}</div>
        </Card>
      ) : null}

      <Card className="p-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Timeline</div>
        <div className="mt-3 space-y-2">
          {item.timeline.map((t, idx) => (
            <div key={idx} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
              <span className="font-medium">{t.status}</span>
              <span className="text-xs text-slate-500">{fmtDate(t.at)}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

