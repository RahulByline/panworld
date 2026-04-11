import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PwPageHeader } from "../../panworld/PwPageHeader";
import { cn } from "../../utils/cn";

const CURR = ["American (US)", "British", "IB", "UAE MOE", "Saudi NCC"] as const;
const GRADES = ["KG", "G1–G3", "G4–G6", "G7–G9", "G10–G12"] as const;
const SUBJECTS = ["Science", "Mathematics", "English / ELA", "Social Sciences", "ICT", "Phonics / KG"] as const;

export function CurriculumMappingPage() {
  const { t } = useTranslation();
  const [curriculum, setCurriculum] = useState<(typeof CURR)[number]>("American (US)");
  const [grades, setGrades] = useState<Set<string>>(new Set(["G1–G3", "G4–G6", "G7–G9"]));
  const [subjects, setSubjects] = useState<Set<string>>(new Set(["Science", "Mathematics", "English / ELA"]));
  const [schoolSize, setSchoolSize] = useState("500–1,000 students");
  const [budget, setBudget] = useState<"value" | "balanced" | "premium">("balanced");
  const [generated, setGenerated] = useState(false);

  function toggleGrade(g: string) {
    setGrades((prev) => {
      const n = new Set(prev);
      if (n.has(g)) n.delete(g);
      else n.add(g);
      return n;
    });
  }

  function toggleSubject(s: string) {
    setSubjects((prev) => {
      const n = new Set(prev);
      if (n.has(s)) n.delete(s);
      else n.add(s);
      return n;
    });
  }

  return (
    <div>
      <PwPageHeader title={t("mvpPages.curriculum.title")} subtitle={t("mvpPages.curriculum.subtitle")} />

      <div className="pw-grid-2 gap-8">
        <div>
          <div className="pw-card mb-4">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#1A1917]">
              <span className="pw-step-num">1</span> {t("mvpPages.curriculum.step1")}
            </div>
            <div className="flex flex-wrap gap-2">
              {CURR.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={cn("pw-btn pw-btn-sm", curriculum === c ? "pw-btn-primary" : "pw-btn-outline")}
                  onClick={() => setCurriculum(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="pw-card mb-4">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#1A1917]">
              <span className="pw-step-num">2</span> {t("mvpPages.curriculum.step2")}
            </div>
            <div className="flex flex-wrap gap-2">
              {GRADES.map((g) => (
                <button
                  key={g}
                  type="button"
                  className={cn("pw-btn pw-btn-sm", grades.has(g) ? "pw-btn-primary" : "pw-btn-outline")}
                  onClick={() => toggleGrade(g)}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="pw-card mb-4">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#1A1917]">
              <span className="pw-step-num">3</span> {t("mvpPages.curriculum.step3")}
            </div>
            <div className="flex flex-wrap gap-2">
              {SUBJECTS.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={cn("pw-btn pw-btn-sm", subjects.has(s) ? "pw-btn-primary" : "pw-btn-outline")}
                  onClick={() => toggleSubject(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="pw-card mb-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#1A1917]">
              <span className="pw-step-num">4</span> {t("mvpPages.curriculum.step4")}
            </div>
            <select
              className="pw-filter-select w-full"
              style={{ backgroundImage: "none", paddingRight: 12 }}
              value={schoolSize}
              onChange={(e) => setSchoolSize(e.target.value)}
            >
              <option>{t("mvpPages.curriculum.schoolSize500")}</option>
              <option>{t("mvpPages.curriculum.schoolSizeUnder")}</option>
              <option>{t("mvpPages.curriculum.schoolSizeMid")}</option>
              <option>{t("mvpPages.curriculum.schoolSizeOver")}</option>
            </select>
          </div>

          <div className="pw-card mb-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#1A1917]">
              <span className="pw-step-num">5</span> {t("mvpPages.curriculum.step5")}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className={cn("pw-btn pw-btn-sm", budget === "value" ? "pw-btn-primary" : "pw-btn-outline")}
                onClick={() => setBudget("value")}
              >
                {t("mvpPages.curriculum.budgetValue")}
              </button>
              <button
                type="button"
                className={cn("pw-btn pw-btn-sm", budget === "balanced" ? "pw-btn-primary" : "pw-btn-outline")}
                onClick={() => setBudget("balanced")}
              >
                {t("mvpPages.curriculum.budgetBalanced")}
              </button>
              <button
                type="button"
                className={cn("pw-btn pw-btn-sm", budget === "premium" ? "pw-btn-primary" : "pw-btn-outline")}
                onClick={() => setBudget("premium")}
              >
                {t("mvpPages.curriculum.budgetPremium")}
              </button>
            </div>
          </div>

          <button type="button" className="pw-btn pw-btn-accent w-full py-3 text-sm" onClick={() => setGenerated(true)}>
            {t("mvpPages.curriculum.generate")}
          </button>
        </div>

        <div>
          {!generated ? (
            <div className="pw-mapping-placeholder rounded-2xl">
              <div className="mb-3 text-4xl opacity-40">✦</div>
              <div className="text-[15px] font-medium text-[#5C5A55]">{t("mvpPages.curriculum.placeholderTitle")}</div>
              <div className="mt-1.5 text-[13px] text-[#9A9890]">{t("mvpPages.curriculum.placeholderSub")}</div>
            </div>
          ) : (
            <div className="pw-card">
              <div className="mb-3 text-sm font-semibold text-[#1A1917]">Recommended stack</div>
              <ul className="space-y-3 text-sm text-[#5C5A55]">
                <li>
                  • <strong className="text-[#1A1917]">{curriculum}</strong> alignment pack for {Array.from(grades).join(", ")}.
                </li>
                <li>
                  • Focus subjects: {Array.from(subjects).join(", ")}.
                </li>
                <li>
                  • School size <strong>{schoolSize}</strong> · Budget: <strong>{budget}</strong>.
                </li>
              </ul>
              <p className="mt-4 text-xs text-[#9A9890]">Demo output — connect to recommendation engine in a later release.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
