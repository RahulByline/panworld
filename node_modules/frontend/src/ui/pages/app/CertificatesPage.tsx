import { useMemo, useState } from "react";
import { Card } from "../../components/Card";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { usePortalMock } from "./mockHooks";

export function CertificatesPage() {
  const { certificates } = usePortalMock();
  const [q, setQ] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const rows = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return certificates
      .filter((x) => (verifiedOnly ? x.verified : true))
      .filter((x) => (qq ? (x.certificateNo + " " + x.title).toLowerCase().includes(qq) : true))
      .sort((a, b) => b.issuedAt.localeCompare(a.issuedAt));
  }, [certificates, q, verifiedOnly]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-2xl font-semibold text-slate-900">Certificates</div>
          <div className="mt-1 text-sm text-slate-600">Issued certificates with verification and downloads.</div>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="secondary">
            Verify
          </Button>
          <Button type="button">Export</Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by certificate no/title…" />
          <label className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700">
            <input type="checkbox" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} />
            Verified only
          </label>
          <div className="flex items-center justify-end text-sm text-slate-600">{rows.length} records</div>
        </div>
      </Card>

      <Card className="p-2">
        <div className="overflow-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Certificate</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Issued</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((x) => (
                <tr key={x.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-semibold text-slate-900">{x.certificateNo}</td>
                  <td className="px-4 py-3 text-slate-700">{x.title}</td>
                  <td className="px-4 py-3 text-slate-700">{new Date(x.issuedAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    {x.verified ? (
                      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-900">Verified</span>
                    ) : (
                      <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-900">Unverified</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button type="button" size="sm" variant="secondary">
                      Download
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

