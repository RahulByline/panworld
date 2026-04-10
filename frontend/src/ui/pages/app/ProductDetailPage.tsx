import { Link, useParams } from "react-router-dom";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { mockProducts } from "../../../mock/data";

export function ProductDetailPage() {
  const { id } = useParams();
  const p = mockProducts.find((x) => x.id === id) ?? null;

  if (!p) {
    return (
      <Card className="p-6">
        <div className="text-sm font-semibold">Product not found</div>
        <div className="mt-3">
          <Link to="/app/catalogue">
            <Button type="button" variant="secondary">
              Back to catalogue
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs text-slate-500">{p.sku}</div>
          <div className="mt-1 text-2xl font-semibold text-slate-900">{p.name}</div>
          <div className="mt-1 text-sm text-slate-600">{p.publisher}</div>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="secondary">
            Access demo
          </Button>
          <Button type="button">Add to RFQ</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="text-sm font-semibold text-slate-900">Overview</div>
          <div className="mt-2 text-sm text-slate-700">
            Product detail including curriculum alignment, country editions, and key differentiation points.
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="text-xs text-slate-500">Type</div>
              <div className="mt-1 font-semibold text-slate-900">{p.type}</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="text-xs text-slate-500">Edition</div>
              <div className="mt-1 font-semibold text-slate-900">{p.edition}</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="text-xs text-slate-500">Grades</div>
              <div className="mt-1 font-semibold text-slate-900">{p.grades ?? "—"}</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="text-xs text-slate-500">Format</div>
              <div className="mt-1 font-semibold text-slate-900">{p.format}</div>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-sm font-semibold text-slate-900">Curriculum mapping</div>
            <div className="mt-1 text-xs text-slate-600">
              Shows why this product is recommended for your curriculum and grade range.
            </div>
            <ul className="mt-3 list-disc pl-5 text-sm text-slate-700">
              <li>Standards alignment coverage: 82%</li>
              <li>Teacher training readiness: strong</li>
              <li>Country relevance: {p.countryRelevance.join(", ")}</li>
            </ul>
          </div>
        </Card>

        <Card className="p-5">
          <div className="text-sm font-semibold text-slate-900">Pricing</div>
          <div className="mt-2 text-3xl font-semibold text-slate-900">{p.price.toFixed(2)}</div>
          <div className="mt-1 text-xs text-slate-600">Indicative price. Final pricing confirmed via quotation.</div>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <span className="text-slate-600">NCC approved</span>
              <span className="font-semibold text-slate-900">{p.nccApproved ? "Yes" : "No"}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <span className="text-slate-600">Curriculum</span>
              <span className="font-semibold text-slate-900">{p.curriculum}</span>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-2">
            <Button type="button">Request sample</Button>
            <Button type="button" variant="secondary">
              Add to wishlist
            </Button>
            <Link to="/app/catalogue">
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

