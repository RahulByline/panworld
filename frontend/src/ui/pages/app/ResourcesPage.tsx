import { useTranslation } from "react-i18next";
import { PwPageHeader } from "../../panworld/PwPageHeader";

const ROWS: { emoji: string; bg: string; title: string; sub: string }[] = [
  { emoji: "📄", bg: "#FEF3C7", title: "Inspire Science — UAE Scope & Sequence G1–G8", sub: "McGraw Hill · PDF · 2.4 MB · Updated Mar 2026" },
  { emoji: "📊", bg: "#E3F2FD", title: "Reveal Math — Lesson Plan Templates", sub: "McGraw Hill · PPT · 5.1 MB" },
  { emoji: "📋", bg: "#EDE7F6", title: "Kodeit Social Sciences — Curriculum Map G1–G12", sub: "Kodeit Global · PDF · 1.8 MB" },
  { emoji: "📝", bg: "#E3F2FD", title: "StudySync — Lesson Builder Quick-Start Guide", sub: "StudySync · PDF · 980 KB" },
  { emoji: "📈", bg: "#E8F5E9", title: "Achieve3000 — Differentiation Guide for Teachers", sub: "Achieve3000 · PDF · 1.2 MB" },
  { emoji: "👨‍👩‍👧", bg: "#FBE9E7", title: "Jolly Phonics — Parent Orientation Guide", sub: "Jolly Phonics · PDF · 720 KB" },
];

export function ResourcesPage() {
  const { t } = useTranslation();

  return (
    <div>
      <PwPageHeader title={t("nav.resources")} subtitle={t("mvpPages.resourceLibrary.subtitle")} />

      <div className="pw-filter-bar mb-5">
        <input className="pw-search-input max-w-[280px] flex-1" type="search" placeholder={t("mvpPages.resourceLibrary.searchPlaceholder")} readOnly />
        <select className="pw-filter-select" defaultValue="all">
          <option value="all">{t("mvpPages.resourceLibrary.allPublishers")}</option>
          <option>McGraw Hill</option>
          <option>Kodeit</option>
          <option>StudySync</option>
        </select>
        <select className="pw-filter-select" defaultValue="all">
          <option value="all">{t("mvpPages.resourceLibrary.allTypes")}</option>
          <option>PDF</option>
          <option>PPT</option>
          <option>Video</option>
          <option>Worksheet</option>
        </select>
        <select className="pw-filter-select" defaultValue="all">
          <option value="all">{t("mvpPages.resourceLibrary.allSubjects")}</option>
          <option>Science</option>
          <option>Mathematics</option>
          <option>ELA</option>
        </select>
      </div>

      <div className="pw-card p-0">
        {ROWS.map((r) => (
          <div key={r.title} className="pw-resource-row px-4">
            <div className="pw-resource-icon" style={{ background: r.bg }}>
              {r.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-[#1A1917]">{r.title}</div>
              <div className="text-xs text-[#5C5A55]">{r.sub}</div>
            </div>
            <button type="button" className="pw-btn pw-btn-outline pw-btn-sm shrink-0">
              {t("mvpPages.resourceLibrary.download")}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
