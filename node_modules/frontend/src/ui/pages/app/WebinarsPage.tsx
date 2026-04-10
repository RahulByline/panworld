import { useMemo, useState } from "react";
import { Card } from "../../components/Card";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { usePortalMock } from "./mockHooks";

export function WebinarsPage() {
  const { webinars } = usePortalMock();
  const [q, setQ] = useState("");
  const [mode, setMode] = useState<"All" | "Live" | "Recorded">("All");

  const rows = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return webinars
      .filter((w) => (mode === "All" ? true : w.mode === mode))
      .filter((w) => (qq ? (w.title + " " + w.publisher).toLowerCase().includes(qq) : true))
      .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  }, [webinars, q, mode]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-2xl font-semibold text-slate-900">Webinars</div>
          <div className="mt-1 text-sm text-slate-600">Upcoming sessions and recordings.</div>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="secondary">
            Register
          </Button>
          <Button type="button">Export</Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by title/publisher…" />
          <select
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300"
            value={mode}
            onChange={(e) => setMode(e.target.value as any)}
          >
            <option value="All">All</option>
            <option value="Live">Live</option>
            <option value="Recorded">Recorded</option>
          </select>
          <div className="flex items-center justify-end text-sm text-slate-600">{rows.length} sessions</div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {rows.map((w) => {
          const starts = new Date(w.startsAt);
          const isPast = starts.getTime() < Date.now();
          return (
            <Card key={w.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900">{w.title}</div>
                  <div className="mt-1 text-sm text-slate-600">{w.publisher}</div>
                  <div className="mt-2 text-xs text-slate-500">
                    {starts.toLocaleString()} • {w.durationMin} min • {w.mode}
                  </div>
                </div>
                <Button type="button" size="sm" variant={isPast ? "secondary" : "primary"}>
                  {isPast ? "Watch" : w.registered ? "Registered" : "Register"}
                </Button>
              </div>
              <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                {isPast
                  ? "Recording available."
                  : "Add to calendar, invite colleagues, and prepare questions."}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

