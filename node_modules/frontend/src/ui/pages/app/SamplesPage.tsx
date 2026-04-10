import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "../../components/Card";
import { Input } from "../../components/Input";
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

export function SamplesPage() {
  const { samples } = usePortalMock();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"All" | (typeof samples)[number]["status"]>("All");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const filteredAll = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return samples
      .filter((x) => (status === "All" ? true : x.status === status))
      .filter((x) => (qq ? `${x.productName} ${x.publisher} ${x.requestNo}`.toLowerCase().includes(qq) : true))
      .sort((a, b) => b.requestedAt.localeCompare(a.requestedAt));
  }, [samples, q, status]);

  const total = filteredAll.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    setPage(1);
  }, [q, status]);

  useEffect(() => {
    setPage((p) => Math.min(Math.max(1, p), totalPages));
  }, [totalPages]);

  const rows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredAll.slice(start, start + pageSize);
  }, [filteredAll, page]);

  const pageFrom = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const pageTo = Math.min(total, page * pageSize);
  const pageNumbers = useMemo(() => {
    const windowSize = 5;
    const half = Math.floor(windowSize / 2);
    let start = Math.max(1, page - half);
    let end = Math.min(totalPages, start + windowSize - 1);
    start = Math.max(1, end - windowSize + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [page, totalPages]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-2xl font-semibold text-slate-900">Sample requests</div>
          <div className="mt-1 text-sm text-slate-600">Track sample requests with realistic status timeline.</div>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="secondary">
            New request
          </Button>
          <Button type="button">Export</Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search product name…" />
          <select
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300"
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
          >
            <option value="All">All statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Approved">Approved</option>
            <option value="Dispatched">Dispatched</option>
            <option value="Delivered">Delivered</option>
          </select>
          <div className="flex items-center justify-end text-sm text-slate-600">
            Showing{" "}
            <span className="mx-1 font-semibold text-slate-900">
              {pageFrom}–{pageTo}
            </span>{" "}
            of <span className="ml-1 font-semibold text-slate-900">{total}</span>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {rows.map((x) => (
          <Card key={x.id} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="truncate text-sm font-semibold text-slate-900">{x.productName}</div>
                  <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                    {x.requestNo}
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-600">
                  <span className="font-medium text-slate-800">{x.publisher}</span>
                  <span>•</span>
                  <span>Qty {x.qty}</span>
                  {x.grades ? (
                    <>
                      <span>•</span>
                      <span>G {x.grades}</span>
                    </>
                  ) : null}
                  {x.subject ? (
                    <>
                      <span>•</span>
                      <span>{x.subject}</span>
                    </>
                  ) : null}
                </div>
              </div>
              <div className={"shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold " + statusPill(x.status)}>{x.status}</div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-slate-50 px-3 py-2">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Requested</div>
                <div className="mt-1 text-sm font-semibold text-slate-900">{fmtDate(x.requestedAt)}</div>
              </div>
              <div className="rounded-xl bg-slate-50 px-3 py-2">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Last update</div>
                <div className="mt-1 text-sm font-semibold text-slate-900">{fmtDate(x.lastUpdatedAt)}</div>
              </div>
              <div className="rounded-xl bg-slate-50 px-3 py-2">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">ETA</div>
                <div className="mt-1 text-sm font-semibold text-slate-900">{x.expectedBy ? fmtDate(x.expectedBy) : "—"}</div>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Timeline</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {x.timeline.map((t, idx) => (
                  <span key={idx} className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700">
                    {t.status} <span className="font-normal text-slate-500">({fmtDate(t.at)})</span>
                  </span>
                ))}
              </div>
            </div>

            {x.notes ? (
              <div className="mt-4 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Notes</div>
                <div className="mt-1">{x.notes}</div>
              </div>
            ) : null}

            <div className="mt-4 flex justify-end gap-2">
              <Link to={`/app/samples/${x.id}`}>
                <Button type="button" variant="secondary" size="sm">
                  Details
                </Button>
              </Link>
              <Link to={`/app/samples/${x.id}/follow-up`}>
                <Button type="button" size="sm">
                  Follow up
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-slate-600">
            Page <span className="font-semibold text-slate-900">{page}</span> of{" "}
            <span className="font-semibold text-slate-900">{totalPages}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              Prev
            </Button>

            {pageNumbers.map((n) => (
              <Button key={n} type="button" size="sm" variant={n === page ? "primary" : "secondary"} onClick={() => setPage(n)}>
                {n}
              </Button>
            ))}

            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

