import { useMemo, useState } from "react";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { mockTickets } from "../../../mock/data";

export function SupportPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"ALL" | "OPEN" | "IN_PROGRESS" | "RESOLVED">("ALL");

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return mockTickets
      .filter((t) => (status === "ALL" ? true : t.status === status))
      .filter((t) => (qq ? t.subject.toLowerCase().includes(qq) : true))
      .slice(0, 25);
  }, [q, status]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-2xl font-semibold text-slate-900">Support tickets</div>
          <div className="mt-1 text-sm text-slate-600">Conversation view, screenshots upload, and SLA tracking.</div>
        </div>
        <Button type="button">Create ticket</Button>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tickets…" />
          <div className="flex flex-wrap gap-2 md:col-span-2 md:justify-end">
            {(["ALL", "OPEN", "IN_PROGRESS", "RESOLVED"] as const).map((s) => (
              <Button key={s} type="button" size="sm" variant={status === s ? "primary" : "secondary"} onClick={() => setStatus(s)}>
                {s}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <Card className="p-4 lg:col-span-1">
          <div className="text-sm font-semibold text-slate-900">Ticket list</div>
          <div className="mt-3 space-y-2">
            {filtered.map((t) => (
              <div key={t.id} className="rounded-xl border border-slate-200 bg-white px-3 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-slate-900">{t.subject}</div>
                    <div className="mt-1 text-xs text-slate-600">
                      Created {new Date(t.createdAt).toLocaleDateString()} • Updated {new Date(t.lastUpdateAt).toLocaleDateString()}
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-xs">{t.status}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 lg:col-span-2">
          <div className="text-sm font-semibold text-slate-900">Ticket detail</div>
          <div className="mt-1 text-xs text-slate-600">Select a ticket from the list to view the conversation thread.</div>

          <div className="mt-4 space-y-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-semibold text-slate-500">Customer</div>
              <div className="mt-1 text-sm text-slate-800">
                “We can’t access the training videos for Grade 5. The module shows locked.”
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="text-xs font-semibold text-slate-500">Panworld Support</div>
              <div className="mt-1 text-sm text-slate-800">
                “Thanks—this is likely phase gating. Once first order is confirmed, Phase 2 unlocks for purchased products.
                We can update your school access to resolve this.”
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-2 md:flex-row">
            <Input placeholder="Write a message…" />
            <Button type="button">Send</Button>
            <Button type="button" variant="secondary">
              Upload screenshot
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

