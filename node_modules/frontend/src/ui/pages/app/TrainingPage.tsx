import { useMemo, useState } from "react";
import { Card } from "../../components/Card";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { usePortalMock } from "./mockHooks";

function ProgressBar({ pct }: { pct: number }) {
  const cl = pct >= 80 ? "bg-emerald-500" : pct >= 40 ? "bg-amber-500" : "bg-slate-900";
  return (
    <div className="h-2 w-full rounded-full bg-slate-100">
      <div className={"h-2 rounded-full " + cl} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function TrainingPage() {
  const { training } = usePortalMock();
  const [q, setQ] = useState("");
  const [publisher, setPublisher] = useState<string>("All");

  const publishers = useMemo(() => ["All", ...Array.from(new Set(training.map((t) => t.publisher)))], [training]);

  const rows = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return training
      .filter((t) => (publisher === "All" ? true : t.publisher === publisher))
      .filter((t) => (qq ? (t.title + " " + t.description + " " + t.tags.join(" ")).toLowerCase().includes(qq) : true))
      .sort((a, b) => b.progressPct - a.progressPct);
  }, [training, q, publisher]);

  const avg = useMemo(() => {
    if (!rows.length) return 0;
    return Math.round(rows.reduce((s, x) => s + x.progressPct, 0) / rows.length);
  }, [rows]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-2xl font-semibold text-slate-900">Training</div>
          <div className="mt-1 text-sm text-slate-600">Publisher training series with progress tracking.</div>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="secondary">
            Assign training
          </Button>
          <Button type="button">Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold text-slate-900">Training catalogue</div>
            <div className="text-sm text-slate-600">Avg. completion: {avg}%</div>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search training…" />
            <select
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300"
              value={publisher}
              onChange={(e) => setPublisher(e.target.value)}
            >
              {publishers.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <div className="flex items-center justify-end text-sm text-slate-600">{rows.length} series</div>
          </div>

          <div className="mt-4 space-y-3">
            {rows.map((t) => (
              <Card key={t.id} className="p-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{t.title}</div>
                    <div className="mt-1 text-sm text-slate-600">
                      {t.publisher} • {t.totalVideos} videos
                    </div>
                    <div className="mt-2 text-sm text-slate-700">{t.description}</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {t.tags.map((x) => (
                        <span key={x} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                          {x}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="w-full md:w-56">
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span>Progress</span>
                      <span className="font-semibold text-slate-900">{t.progressPct}%</span>
                    </div>
                    <div className="mt-2">
                      <ProgressBar pct={t.progressPct} />
                    </div>
                    <div className="mt-3 flex justify-end">
                      <Button type="button" size="sm">
                        Continue
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="text-sm font-semibold text-slate-900">Next best actions</div>
          <div className="mt-3 space-y-2 text-sm text-slate-700">
            <div className="rounded-xl bg-slate-50 p-3">Assign onboarding series to new teachers.</div>
            <div className="rounded-xl bg-slate-50 p-3">Schedule HOD follow-up for series below 40% completion.</div>
            <div className="rounded-xl bg-slate-50 p-3">Download implementation checklist & share internally.</div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button type="button" variant="secondary" size="sm">
              Remind
            </Button>
            <Button type="button" size="sm">
              Create plan
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

