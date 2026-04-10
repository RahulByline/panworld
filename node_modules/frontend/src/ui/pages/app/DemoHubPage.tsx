import { useMemo, useState } from "react";
import { Card } from "../../components/Card";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { useAuthStore } from "../../../store/auth.store";

type DemoAccess = {
  id: string;
  publisher: string;
  product: string;
  status: "Requested" | "Approved" | "Active" | "Expired";
  createdAt: string;
  notes: string;
};

function statusPill(s: DemoAccess["status"]) {
  if (s === "Active") return "bg-emerald-100 text-emerald-900";
  if (s === "Approved") return "bg-sky-100 text-sky-900";
  if (s === "Expired") return "bg-slate-100 text-slate-700";
  return "bg-amber-100 text-amber-900";
}

export function DemoHubPage() {
  const school = useAuthStore((s) => s.school);
  const country = (school?.country ?? "UAE") as "UAE" | "KSA";
  const [q, setQ] = useState("");

  const rows = useMemo<DemoAccess[]>(() => {
    const base: DemoAccess[] = [
      {
        id: "d1",
        publisher: "Kodeit Global",
        product: "Kodeit Academy",
        status: "Active",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
        notes: "Teacher accounts provisioned.",
      },
      {
        id: "d2",
        publisher: "McGraw Hill",
        product: country === "KSA" ? "KSA NCC English Suite" : "UAE English Suite",
        status: "Approved",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
        notes: "Credentials shared via email.",
      },
      {
        id: "d3",
        publisher: "Oxford",
        product: "Reading Program Demo",
        status: "Requested",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        notes: "Pending approval from publisher rep.",
      },
      {
        id: "d4",
        publisher: "Pearson/Savvas",
        product: "Math Digital Demo",
        status: "Expired",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
        notes: "Demo expired; request extension.",
      },
    ];
    const qq = q.trim().toLowerCase();
    return base.filter((x) => (qq ? (x.publisher + " " + x.product + " " + x.status).toLowerCase().includes(qq) : true));
  }, [q, country]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-2xl font-semibold text-slate-900">Demo hub</div>
          <div className="mt-1 text-sm text-slate-600">Request, manage, and launch publisher demos.</div>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="secondary">
            Request demo
          </Button>
          <Button type="button">Export</Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search demo access…" />
          <div className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700">
            School country: <span className="font-semibold">{country}</span>
          </div>
          <div className="flex items-center justify-end text-sm text-slate-600">{rows.length} entries</div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {rows.map((x) => (
          <Card key={x.id} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-slate-900">{x.product}</div>
                <div className="mt-1 text-sm text-slate-600">{x.publisher}</div>
                <div className="mt-2 text-xs text-slate-500">Requested: {new Date(x.createdAt).toLocaleDateString()}</div>
              </div>
              <span className={"rounded-full px-2.5 py-1 text-xs font-semibold " + statusPill(x.status)}>{x.status}</span>
            </div>
            <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">{x.notes}</div>
            <div className="mt-4 flex justify-end gap-2">
              <Button type="button" size="sm" variant="secondary">
                Credentials
              </Button>
              <Button type="button" size="sm">
                Launch
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

