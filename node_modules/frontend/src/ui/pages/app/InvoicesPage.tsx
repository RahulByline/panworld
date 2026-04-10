import { useMemo, useState } from "react";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { useAuthStore } from "../../../store/auth.store";
import { makeMockInvoices } from "../../../mock/data";

function money(n: number) {
  return n.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 });
}

export function InvoicesPage() {
  const school = useAuthStore((s) => s.school);
  const [status, setStatus] = useState<"ALL" | "PAID" | "OUTSTANDING">("ALL");

  const invoices = useMemo(() => makeMockInvoices(school?.country ?? "UAE"), [school?.country]);
  const filtered = invoices.filter((i) => (status === "ALL" ? true : i.status === status));

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-2xl font-semibold text-slate-900">Invoices</div>
          <div className="mt-1 text-sm text-slate-600">
            VAT logic: {school?.country === "KSA" ? "15% (KSA)" : "5% (UAE)"} — shown in totals.
          </div>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="secondary">
            Annual statement
          </Button>
          <Button type="button">Export</Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap gap-2">
          {(["ALL", "OUTSTANDING", "PAID"] as const).map((s) => (
            <Button key={s} type="button" size="sm" variant={status === s ? "primary" : "secondary"} onClick={() => setStatus(s)}>
              {s}
            </Button>
          ))}
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="grid grid-cols-12 gap-0 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600">
          <div className="col-span-3">Invoice</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-3">Issued / Due</div>
          <div className="col-span-2 text-right">Total</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>
        {filtered.slice(0, 20).map((inv) => (
          <div key={inv.id} className="grid grid-cols-12 items-center border-b border-slate-100 px-4 py-3 text-sm">
            <div className="col-span-3 font-semibold text-slate-900">{inv.invoiceNo}</div>
            <div className="col-span-2">
              <span
                className={
                  "rounded-full border px-2 py-1 text-xs " +
                  (inv.status === "PAID"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-amber-200 bg-amber-50 text-amber-800")
                }
              >
                {inv.status}
              </span>
            </div>
            <div className="col-span-3 text-slate-600">
              {new Date(inv.issuedAt).toLocaleDateString()} → {new Date(inv.dueAt).toLocaleDateString()}
            </div>
            <div className="col-span-2 text-right font-semibold text-slate-900">{money(inv.total)}</div>
            <div className="col-span-2 text-right">
              <Button type="button" size="sm" variant="secondary">
                Download PDF
              </Button>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

