import { useMemo, useState } from "react";
import { Card } from "../../components/Card";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { useAuthStore } from "../../../store/auth.store";
import { mockProducts } from "../../../mock/data";

type Step = 1 | 2 | 3;

export function CurriculumMappingPage() {
  const school = useAuthStore((s) => s.school);
  const country = (school?.country ?? "UAE") as "UAE" | "KSA";
  const [step, setStep] = useState<Step>(1);
  const [gradeBand, setGradeBand] = useState("G6–G9");
  const [subject, setSubject] = useState("English");
  const [q, setQ] = useState("");

  const candidates = useMemo(() => {
    const qq = q.trim().toLowerCase();
    const pool = mockProducts.filter((p) => p.countryRelevance.includes(country)).slice(0, 30);
    return pool
      .filter((p) => (qq ? (p.name + " " + p.publisher).toLowerCase().includes(qq) : true))
      .map((p, idx) => ({
        id: p.id,
        name: p.name,
        publisher: p.publisher,
        score: Math.max(62, 92 - idx),
        notes:
          subject === "English"
            ? "Aligned to reading/writing objectives; strong teacher resources."
            : "Strong assessments + pacing; integration-ready.",
      }));
  }, [country, q, subject]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-2xl font-semibold text-slate-900">Curriculum mapping</div>
          <div className="mt-1 text-sm text-slate-600">Guided wizard that outputs recommendations.</div>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="secondary" onClick={() => setStep(1)}>
            Reset
          </Button>
          <Button type="button">Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <Card className="p-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Step</div>
          <div className="mt-1 text-2xl font-semibold text-slate-900">{step}/3</div>
          <div className="mt-1 text-sm text-slate-600">{country} configuration</div>
        </Card>
        <Card className="p-5 lg:col-span-2">
          <div className="text-sm font-semibold text-slate-900">Inputs</div>
          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
            <select
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300"
              value={gradeBand}
              onChange={(e) => setGradeBand(e.target.value)}
              disabled={step !== 1}
            >
              <option>G1–G5</option>
              <option>G6–G9</option>
              <option>G10–G12</option>
            </select>
            <select
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={step !== 1}
            >
              <option>English</option>
              <option>Math</option>
              <option>Science</option>
              <option>Arabic</option>
            </select>
            <Button type="button" onClick={() => setStep(2)} disabled={step !== 1}>
              Generate
            </Button>
          </div>
          <div className="mt-3 text-sm text-slate-700">
            Grade band: <span className="font-semibold">{gradeBand}</span> • Subject: <span className="font-semibold">{subject}</span>
          </div>
        </Card>
      </div>

      {step >= 2 ? (
        <Card className="p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-900">Recommended products</div>
              <div className="mt-1 text-sm text-slate-600">Ranked shortlist with rationale.</div>
            </div>
            <div className="flex gap-2">
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search results…" />
              <Button type="button" onClick={() => setStep(3)} disabled={step !== 2}>
                Build plan
              </Button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
            {candidates.slice(0, 10).map((c) => (
              <Card key={c.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{c.name}</div>
                    <div className="mt-1 text-sm text-slate-600">{c.publisher}</div>
                    <div className="mt-2 text-sm text-slate-700">{c.notes}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Fit</div>
                    <div className="mt-1 text-2xl font-semibold text-slate-900">{c.score}%</div>
                  </div>
                </div>
                <div className="mt-3 flex justify-end gap-2">
                  <Button type="button" size="sm" variant="secondary">
                    Add to wishlist
                  </Button>
                  <Button type="button" size="sm">
                    Add to RFQ
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      ) : null}

      {step >= 3 ? (
        <Card className="p-5">
          <div className="text-sm font-semibold text-slate-900">Implementation plan</div>
          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
            {[
              { title: "Week 1", body: "Kickoff, license provisioning, and access checks." },
              { title: "Week 2–3", body: "Teacher onboarding + classroom pilots." },
              { title: "Week 4", body: "Data review + scale-up decision." },
            ].map((x) => (
              <div key={x.title} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-sm font-semibold text-slate-900">{x.title}</div>
                <div className="mt-1 text-sm text-slate-700">{x.body}</div>
              </div>
            ))}
          </div>
        </Card>
      ) : null}
    </div>
  );
}

