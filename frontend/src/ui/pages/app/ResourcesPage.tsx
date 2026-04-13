import { useTranslation } from "react-i18next";
import { PwPageHeader } from "../../panworld/PwPageHeader";

const ROWS: { title: string; sub: string; imageUrl: string }[] = [
  { title: "Inspire Science — UAE Scope & Sequence G1–G8", sub: "McGraw Hill · PDF · 2.4 MB · Updated Mar 2026", imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=640&h=420&fit=crop&q=82" },
  { title: "Reveal Math — Lesson Plan Templates", sub: "McGraw Hill · PPT · 5.1 MB", imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=640&h=420&fit=crop&q=82" },
  { title: "Kodeit Social Sciences — Curriculum Map G1–G12", sub: "Kodeit Global · PDF · 1.8 MB", imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=640&h=420&fit=crop&q=82" },
  { title: "StudySync — Lesson Builder Quick-Start Guide", sub: "StudySync · PDF · 980 KB", imageUrl: "https://images.unsplash.com/photo-1455885666463-8a2b5f59b8d7?w=640&h=420&fit=crop&q=82" },
  { title: "Achieve3000 — Differentiation Guide for Teachers", sub: "Achieve3000 · PDF · 1.2 MB", imageUrl: "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=640&h=420&fit=crop&q=82" },
  { title: "Jolly Phonics — Parent Orientation Guide", sub: "Jolly Phonics · PDF · 720 KB", imageUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=640&h=420&fit=crop&q=82" },
  { title: "Wonders ELA — Vocabulary Builder Pack G3", sub: "McGraw Hill · Worksheet · 1.1 MB", imageUrl: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=640&h=420&fit=crop&q=82" },
  { title: "Wonders ELA — Reading Assessment Rubrics", sub: "McGraw Hill · PDF · 890 KB", imageUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=640&h=420&fit=crop&q=82" },
  { title: "Reveal Math — Unit 2 Exit Tickets G6", sub: "McGraw Hill · Worksheet · 640 KB", imageUrl: "https://images.unsplash.com/photo-1472289065668-ce650ac443d2?w=640&h=420&fit=crop&q=82" },
  { title: "Reveal Math — Teacher Pacing Calendar", sub: "McGraw Hill · XLSX · 450 KB", imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=640&h=420&fit=crop&q=82" },
  { title: "StudySync — Writing Workshop Slides", sub: "StudySync · PPT · 6.4 MB", imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=640&h=420&fit=crop&q=82" },
  { title: "StudySync — Debate Toolkit Classroom Kit", sub: "StudySync · PDF · 2.1 MB", imageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=640&h=420&fit=crop&q=82" },
  { title: "Achieve3000 — Weekly Planning Board", sub: "Achieve3000 · PPT · 3.2 MB", imageUrl: "https://images.unsplash.com/photo-1494809610410-160faaed4de0?w=640&h=420&fit=crop&q=82" },
  { title: "Achieve3000 — Lexile Target Tracker", sub: "Achieve3000 · XLSX · 510 KB", imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=640&h=420&fit=crop&q=82" },
  { title: "Kodeit Social Sciences — GCC Case Studies", sub: "Kodeit Global · PDF · 2.9 MB", imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=640&h=420&fit=crop&q=82" },
  { title: "Kodeit ICT — Coding Starter Worksheets", sub: "Kodeit Global · Worksheet · 1.6 MB", imageUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=640&h=420&fit=crop&q=82" },
  { title: "Oxford Reading Tree — Guided Reading Notes", sub: "Oxford · PDF · 1.0 MB", imageUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=640&h=420&fit=crop&q=82" },
  { title: "Collins Big Cat — Fluency Practice Cards", sub: "Collins · PDF · 1.7 MB", imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=640&h=420&fit=crop&q=82" },
  { title: "STEM Readers — Lab Reflection Journals", sub: "Pearson · Worksheet · 1.3 MB", imageUrl: "https://images.unsplash.com/photo-1460518451285-97b6aa326961?w=640&h=420&fit=crop&q=82" },
  { title: "Islamic Studies — Term Planner Bilingual", sub: "Panworld · PDF · 840 KB", imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=640&h=420&fit=crop&q=82" },
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

      <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#7A776F]">
        {ROWS.length} resources
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {ROWS.map((r) => (
          <article key={r.title} className="overflow-hidden rounded-2xl border border-[#E2E0D9] bg-white shadow-sm">
            <div className="aspect-[16/10] w-full overflow-hidden bg-[#F5F4F0]">
              <img src={r.imageUrl} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />
            </div>
            <div className="flex min-h-[132px] flex-col p-3">
              <div className="line-clamp-2 text-sm font-semibold text-[#1A1917]">{r.title}</div>
              <div className="mt-1 line-clamp-2 text-xs text-[#5C5A55]">{r.sub}</div>
              <div className="mt-auto flex gap-2 pt-3">
                <button
                  type="button"
                  className="pw-btn pw-btn-outline pw-btn-sm min-w-0 flex-1 shrink-0"
                  onClick={() => window.open(r.imageUrl, "_blank", "noopener,noreferrer")}
                >
                  {t("common.view")}
                </button>
                <button type="button" className="pw-btn pw-btn-primary pw-btn-sm min-w-0 flex-1 shrink-0">
                  {t("mvpPages.resourceLibrary.download")}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
