import { useMemo, useState } from "react";
import { Card } from "../../components/Card";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { usePortalMock } from "./mockHooks";

function rolePill(r: string) {
  if (r === "CEO") return "bg-slate-900 text-white";
  if (r === "MANAGEMENT") return "bg-indigo-100 text-indigo-900";
  if (r === "HOD") return "bg-sky-100 text-sky-900";
  if (r === "PROCUREMENT") return "bg-amber-100 text-amber-900";
  return "bg-emerald-100 text-emerald-900";
}

export function UsersPage() {
  const { users } = usePortalMock();
  const [q, setQ] = useState("");
  const [activeOnly, setActiveOnly] = useState(false);

  const rows = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return users
      .filter((u) => (activeOnly ? u.active : true))
      .filter((u) => (qq ? (u.name + " " + u.email + " " + u.role).toLowerCase().includes(qq) : true))
      .sort((a, b) => b.lastLoginAt.localeCompare(a.lastLoginAt));
  }, [users, q, activeOnly]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-2xl font-semibold text-slate-900">Users & settings</div>
          <div className="mt-1 text-sm text-slate-600">User directory with role assignment and activation.</div>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="secondary">
            Invite user
          </Button>
          <Button type="button">Export</Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name/email/role…" />
          <label className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700">
            <input type="checkbox" checked={activeOnly} onChange={(e) => setActiveOnly(e.target.checked)} />
            Active only
          </label>
          <div className="flex items-center justify-end text-sm text-slate-600">{rows.length} users</div>
        </div>
      </Card>

      <Card className="p-2">
        <div className="overflow-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Last login</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-semibold text-slate-900">{u.name}</td>
                  <td className="px-4 py-3 text-slate-700">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={"rounded-full px-2.5 py-1 text-xs font-semibold " + rolePill(u.role)}>{u.role}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{u.department ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-700">{new Date(u.lastLoginAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    {u.active ? (
                      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-900">Active</span>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">Inactive</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button type="button" size="sm" variant="secondary">
                      Edit
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

