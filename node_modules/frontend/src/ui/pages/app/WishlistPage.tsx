import { useMemo, useState } from "react";
import { Card } from "../../components/Card";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { useAuthStore } from "../../../store/auth.store";
import { mockProducts } from "../../../mock/data";

export function WishlistPage() {
  const school = useAuthStore((s) => s.school);
  const country = (school?.country ?? "UAE") as "UAE" | "KSA";
  const [q, setQ] = useState("");
  const [type, setType] = useState<"All" | "DIGITAL" | "PRINT" | "UNIFORM">("All");

  const base = useMemo(() => {
    // Use existing product mocks as wishlist items
    return mockProducts
      .filter((p) => p.countryRelevance.includes(country))
      .slice(0, 18)
      .map((p, i) => ({
        id: `wl_${p.id}`,
        productId: p.id,
        name: p.name,
        publisher: p.publisher,
        type: p.type,
        addedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * (i + 1)).toISOString(),
        notes: i % 3 === 0 ? "Shortlisted for term 1 rollout." : i % 3 === 1 ? "Compare pricing options." : "Need sample/demo access.",
      }));
  }, [country]);

  const rows = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return base
      .filter((x) => (type === "All" ? true : x.type === type))
      .filter((x) => (qq ? (x.name + " " + x.publisher + " " + x.notes).toLowerCase().includes(qq) : true))
      .sort((a, b) => b.addedAt.localeCompare(a.addedAt));
  }, [base, q, type]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-2xl font-semibold text-slate-900">Wishlist</div>
          <div className="mt-1 text-sm text-slate-600">Shortlist items and convert into RFQs.</div>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="secondary">
            Create RFQ
          </Button>
          <Button type="button">Export</Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search wishlist…" />
          <select
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300"
            value={type}
            onChange={(e) => setType(e.target.value as any)}
          >
            <option value="All">All types</option>
            <option value="DIGITAL">Digital</option>
            <option value="PRINT">Print</option>
            <option value="UNIFORM">Uniform</option>
          </select>
          <div className="flex items-center justify-end text-sm text-slate-600">{rows.length} items</div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {rows.map((x) => (
          <Card key={x.id} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-slate-900">{x.name}</div>
                <div className="mt-1 text-sm text-slate-600">{x.publisher}</div>
                <div className="mt-2 text-xs text-slate-500">Added: {new Date(x.addedAt).toLocaleDateString()}</div>
              </div>
              <Button type="button" size="sm" variant="secondary">
                Remove
              </Button>
            </div>
            <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">{x.notes}</div>
            <div className="mt-4 flex justify-end gap-2">
              <Button type="button" size="sm" variant="secondary">
                View product
              </Button>
              <Button type="button" size="sm">
                Add to RFQ
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

