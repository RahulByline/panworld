import { Link, useParams } from "react-router-dom";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { useAuthStore } from "../../../store/auth.store";
import { makeMockRfqs } from "../../../mock/data";

function money(n: number) {
  return n.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 });
}

export function RfqDetailPage() {
  const { id } = useParams();
  const school = useAuthStore((s) => s.school);
  const rfq = makeMockRfqs(school?.country ?? "UAE").find((x) => x.id === id) ?? null;

  if (!rfq) {
    return (
      <Card className="p-6">
        <div className="text-sm font-semibold">RFQ not found</div>
        <div className="mt-3">
          <Link to="/app/rfq">
            <Button type="button" variant="secondary">
              Back to RFQs
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-xs text-slate-500">{new Date(rfq.createdAt).toLocaleString()}</div>
          <div className="mt-1 text-2xl font-semibold text-slate-900">{rfq.rfqNo}</div>
          <div className="mt-1 text-sm text-slate-600">
            Status: <span className="font-semibold text-slate-900">{rfq.status}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="secondary">
            Upload file
          </Button>
          <Button type="button">Approve</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="text-sm font-semibold text-slate-900">Items</div>
          <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200">
            <div className="grid grid-cols-12 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-600">
              <div className="col-span-7">Product</div>
              <div className="col-span-2 text-right">Qty</div>
              <div className="col-span-3 text-right">Line total</div>
            </div>
            {rfq.items.map((it, idx) => (
              <div key={idx} className="grid grid-cols-12 border-t border-slate-100 px-4 py-3 text-sm">
                <div className="col-span-7 font-medium text-slate-900">{it.productName}</div>
                <div className="col-span-2 text-right text-slate-600">{it.qty}</div>
                <div className="col-span-3 text-right font-semibold text-slate-900">{money(it.qty * it.unitPrice)}</div>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-sm font-semibold text-slate-900">Approval notes</div>
            <div className="mt-2 text-sm text-slate-700">
              HOD and Procurement can add notes, attach supporting documents, and route for CEO approval depending on thresholds.
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="text-sm font-semibold text-slate-900">Totals</div>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <span className="text-slate-600">Subtotal</span>
              <span className="font-semibold text-slate-900">{money(rfq.subtotal)}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <span className="text-slate-600">VAT</span>
              <span className="font-semibold text-slate-900">{money(rfq.vat)}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-3">
              <span className="text-slate-700">Total</span>
              <span className="text-lg font-semibold text-slate-900">{money(rfq.total)}</span>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-2">
            <Button type="button">Download quotation</Button>
            <Button type="button" variant="secondary">
              Reject
            </Button>
            <Link to="/app/rfq">
              <Button type="button" variant="ghost" className="w-full">
                Back
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

