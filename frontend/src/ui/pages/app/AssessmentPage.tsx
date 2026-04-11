import { useTranslation } from "react-i18next";
import { PwPageHeader } from "../../panworld/PwPageHeader";
import { cn } from "../../utils/cn";

const RESULT_ROWS = [
  { assessment: "Mid-Term 2", subject: "Science", grade: "G5", students: "124", score: "78%", scoreClass: "text-[#1E8449]", date: "18 Mar 2026" },
  { assessment: "Mid-Term 2", subject: "Mathematics", grade: "G5", students: "124", score: "72%", scoreClass: "text-[#0A3D62]", date: "15 Mar 2026" },
  { assessment: "Quiz 4", subject: "ELA", grade: "G3", students: "98", score: "81%", scoreClass: "text-[#1E8449]", date: "12 Mar 2026" },
  { assessment: "Mid-Term 2", subject: "Social Sciences", grade: "G6", students: "108", score: "65%", scoreClass: "text-[#E8912D]", date: "10 Mar 2026" },
];

export function AssessmentPage() {
  const { t } = useTranslation();

  return (
    <div>
      <PwPageHeader
        title={t("nav.assessment")}
        subtitle={t("mvpPages.assessment.subtitle")}
        right={
          <button type="button" className="pw-btn pw-btn-primary">
            {t("mvpPages.assessment.launchFull")}
          </button>
        }
      />

      <div className="pw-grid-4 mb-8">
        <div className="pw-stat-card">
          <div className="pw-stat-label">{t("mvpPages.assessment.studentsAssessed")}</div>
          <div className="pw-stat-value">847</div>
          <div className="pw-stat-sub">{t("mvpPages.assessment.acrossGrades")}</div>
        </div>
        <div className="pw-stat-card">
          <div className="pw-stat-label">{t("mvpPages.assessment.avgScore")}</div>
          <div className="pw-stat-value text-[#1E8449]">74%</div>
          <div className="pw-stat-sub">{t("mvpPages.assessment.scoreHint")}</div>
        </div>
        <div className="pw-stat-card">
          <div className="pw-stat-label">{t("mvpPages.assessment.assessmentsCompleted")}</div>
          <div className="pw-stat-value">12</div>
          <div className="pw-stat-sub">{t("mvpPages.assessment.thisYear")}</div>
        </div>
        <div className="pw-stat-card">
          <div className="pw-stat-label">{t("mvpPages.assessment.nextAssessment")}</div>
          <div className="pw-stat-value text-lg">May 15</div>
          <div className="pw-stat-sub">{t("mvpPages.assessment.nextAssessmentSub")}</div>
        </div>
      </div>

      <div className="pw-card mb-6">
        <div className="mb-3.5 text-sm font-semibold text-[#1A1917]">{t("mvpPages.assessment.recentResults")}</div>
        <table className="pw-data-table">
          <thead>
            <tr>
              <th>{t("mvpPages.assessment.colAssessment")}</th>
              <th>{t("mvpPages.assessment.colSubject")}</th>
              <th>{t("mvpPages.assessment.colGrade")}</th>
              <th>{t("mvpPages.assessment.colStudents")}</th>
              <th>{t("mvpPages.assessment.colAvgScore")}</th>
              <th>{t("mvpPages.assessment.colDate")}</th>
            </tr>
          </thead>
          <tbody>
            {RESULT_ROWS.map((r) => (
              <tr key={`${r.assessment}-${r.subject}-${r.date}`}>
                <td className="font-semibold">{r.assessment}</td>
                <td>{r.subject}</td>
                <td>{r.grade}</td>
                <td>{r.students}</td>
                <td className={cn("font-semibold", r.scoreClass)}>{r.score}</td>
                <td className="text-[#9A9890]">{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-2xl border-2 border-dashed border-[#E2E0D9] bg-white px-6 py-10 text-center">
        <div className="mb-2 text-3xl">📊</div>
        <div className="mb-1.5 text-[15px] font-medium text-[#1A1917]">{t("mvpPages.assessment.ssoTitle")}</div>
        <div className="mb-4 text-[13px] text-[#5C5A55]">{t("mvpPages.assessment.ssoBody")}</div>
        <a href="https://app.legato-metronome.com" target="_blank" rel="noopener noreferrer">
        <button type="button" className="pw-btn pw-btn-primary">
          {t("mvpPages.assessment.openPortal")}
        </button>
        </a>
      </div>
    </div>
  );
}