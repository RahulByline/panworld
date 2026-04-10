import { useMemo, useState } from "react";
import { Card } from "../../components/Card";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { usePortalMock } from "./mockHooks";

function typeLabel(t: string) {
  if (t === "ACCOUNT_MANAGER") return "Account manager";
  if (t === "REGIONAL_MANAGER") return "Regional manager";
  return "Publisher rep";
}

export function ContactsPage() {
  const { contacts } = usePortalMock();
  const [q, setQ] = useState("");
  const [type, setType] = useState<"All" | (typeof contacts)[number]["type"]>("All");

  const rows = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return contacts
      .filter((c) => (type === "All" ? true : c.type === type))
      .filter((c) => (qq ? (c.name + " " + c.title + " " + (c.email ?? "")).toLowerCase().includes(qq) : true));
  }, [contacts, q, type]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-2xl font-semibold text-slate-900">Contacts</div>
          <div className="mt-1 text-sm text-slate-600">Your Panworld team and publisher representatives.</div>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="secondary">
            Add contact
          </Button>
          <Button type="button">Export</Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name/email…" />
          <select
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300"
            value={type}
            onChange={(e) => setType(e.target.value as any)}
          >
            <option value="All">All types</option>
            <option value="ACCOUNT_MANAGER">Account managers</option>
            <option value="REGIONAL_MANAGER">Regional managers</option>
            <option value="PUBLISHER_REP">Publisher reps</option>
          </select>
          <div className="flex items-center justify-end text-sm text-slate-600">{rows.length} contacts</div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {rows.map((c) => (
          <Card key={c.id} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-slate-900">{c.name}</div>
                <div className="mt-1 text-sm text-slate-600">
                  {typeLabel(c.type)} • {c.title}
                </div>
                <div className="mt-2 text-xs text-slate-500">Territories: {c.territories.join(", ")}</div>
              </div>
              <Button type="button" variant="ghost" size="sm">
                Message
              </Button>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-2 text-sm text-slate-700 md:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-3">
                <div className="text-xs font-semibold text-slate-600">Email</div>
                <div className="mt-1">{c.email ?? "—"}</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <div className="text-xs font-semibold text-slate-600">WhatsApp</div>
                <div className="mt-1">{c.whatsapp ?? "—"}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

