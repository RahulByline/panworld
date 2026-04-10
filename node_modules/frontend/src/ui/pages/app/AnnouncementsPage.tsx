import { useMemo, useState } from "react";
import { Card } from "../../components/Card";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { usePortalMock } from "./mockHooks";

function pillClass(kind: string) {
  if (kind === "Admin") return "bg-slate-900 text-white";
  if (kind === "Support") return "bg-amber-100 text-amber-900";
  if (kind === "Webinar") return "bg-indigo-100 text-indigo-900";
  if (kind === "Training") return "bg-emerald-100 text-emerald-900";
  return "bg-sky-100 text-sky-900";
}

export function AnnouncementsPage() {
  const { announcements } = usePortalMock();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<"All" | (typeof announcements)[number]["category"]>("All");

  const rows = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return announcements
      .filter((a) => (category === "All" ? true : a.category === category))
      .filter((a) => (qq ? (a.title + " " + a.summary + " " + a.body).toLowerCase().includes(qq) : true))
      .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.createdAt.localeCompare(a.createdAt));
  }, [announcements, q, category]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-2xl font-semibold text-slate-900">Announcements</div>
          <div className="mt-1 text-sm text-slate-600">Pinned updates, product notes, and operational notices.</div>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="secondary">
            Publish
          </Button>
          <Button type="button">Export</Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search announcements…" />
          <select
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300"
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
          >
            <option value="All">All categories</option>
            <option value="Product">Product</option>
            <option value="Training">Training</option>
            <option value="Webinar">Webinar</option>
            <option value="Admin">Admin</option>
            <option value="Support">Support</option>
          </select>
          <div className="flex items-center justify-end text-sm text-slate-600">
            {rows.length} item{rows.length === 1 ? "" : "s"}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {rows.map((a) => (
          <Card key={a.id} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={"rounded-full px-2.5 py-1 text-xs font-semibold " + pillClass(a.category)}>{a.category}</span>
                  {a.pinned ? <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">Pinned</span> : null}
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">{a.title}</div>
                <div className="mt-1 text-xs text-slate-500">{new Date(a.createdAt).toLocaleString()}</div>
              </div>
              <Button type="button" variant="ghost" size="sm">
                View
              </Button>
            </div>

            <div className="mt-3 text-sm text-slate-700">{a.summary}</div>
            <div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">{a.body}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

