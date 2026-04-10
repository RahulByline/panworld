import { useState } from "react";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";

export function ProfileCompletionPage() {
  const [done, setDone] = useState(false);

  return (
    <div>
      <div className="text-lg font-semibold">First login profile completion</div>
      <div className="mt-1 text-sm text-slate-600">
        Demo placeholder: collects school profile, curriculum, grades, subjects, and language preferences.
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4">
        <Card className="p-5">
          <div className="text-sm font-semibold">School profile</div>
          <div className="mt-1 text-xs text-slate-600">
            Curriculum selection, grades offered, subjects, school size, country, preferred language.
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">Curriculum: American</div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">Country: UAE</div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">Grades: 1–12</div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">Size: 1,200 students</div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="text-sm font-semibold">Onboarding checklist</div>
          <div className="mt-3 space-y-2 text-sm">
            {[
              "Complete school profile",
              "Browse catalogue",
              "Try a demo",
              "Request sample or demo",
              "Add product to wishlist",
              "Submit first RFQ",
              "Add HOD and teachers",
              "Watch one training video",
              "Register for webinar"
            ].map((x, i) => (
              <div key={x} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2">
                <div className="text-slate-700">{x}</div>
                <div className="text-xs text-slate-500">{i < 2 ? "Done" : "Pending"}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {done ? (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Profile completed. You can now continue.
        </div>
      ) : null}

      <div className="mt-6 flex gap-2">
        <Button type="button" className="w-full" onClick={() => setDone(true)}>
          Save & continue
        </Button>
        <Button type="button" variant="secondary" className="w-full" onClick={() => setDone(false)}>
          Reset
        </Button>
      </div>
    </div>
  );
}

