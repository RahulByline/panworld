import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { useAuthStore } from "../../../store/auth.store";

export function AssessmentPage() {
  const user = useAuthStore((s) => s.user);
  const school = useAuthStore((s) => s.school);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-2xl font-semibold text-slate-900">Assessment</div>
          <div className="mt-1 text-sm text-slate-600">Launchpad for assessment access.</div>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="secondary">
            Request access
          </Button>
          <Button type="button">Launch</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <Card className="p-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">User</div>
          <div className="mt-1 text-sm font-semibold text-slate-900">
            {user ? `${user.firstName} ${user.lastName}` : "—"}
          </div>
          <div className="mt-1 text-sm text-slate-600">{user?.role ?? "—"}</div>
        </Card>
        <Card className="p-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">School</div>
          <div className="mt-1 text-sm font-semibold text-slate-900">{school?.name ?? "—"}</div>
          <div className="mt-1 text-sm text-slate-600">{school?.country ?? "—"}</div>
        </Card>
        <Card className="p-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Eligibility</div>
          <div className="mt-1 text-sm font-semibold text-slate-900">Eligible</div>
          <div className="mt-1 text-sm text-slate-600">Based on contract + roster sync.</div>
        </Card>
      </div>

      <Card className="p-5">
        <div className="text-sm font-semibold text-slate-900">Assessment systems</div>
        <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-3">
          {["NCC Assessments", "Publisher Portal", "Internal Benchmarks"].map((x) => (
            <div key={x} className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="text-sm font-semibold text-slate-900">{x}</div>
              <div className="mt-1 text-sm text-slate-600">SSO launch configured in production.</div>
              <div className="mt-3 flex gap-2">
                <Button type="button" size="sm">
                  Launch
                </Button>
                <Button type="button" size="sm" variant="secondary">
                  Help
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

