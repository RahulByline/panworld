import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { mockProducts } from "../../../mock/data";
import { useAuthStore } from "../../../store/auth.store";
import { PwPageHeader } from "../../panworld/PwPageHeader";
import { KnowledgeProductCard, knowledgeCardThemeFromId } from "../../school/KnowledgeProductCard";
import { cn } from "../../utils/cn";

const CURRICULUM_TABS = [
  { id: "american", label: "American (US)" },
  { id: "british", label: "British / Cambridge" },
  { id: "ib", label: "IB" },
  { id: "uae", label: "UAE MOE" },
  { id: "saudi", label: "Saudi NCC" },
  { id: "all", label: "All" },
] as const;

const PUB_CHIPS: { id: string; label: string }[] = [
  { id: "all", label: "All Publishers" },
  { id: "mcgraw", label: "McGraw Hill" },
  { id: "kodeit", label: "Kodeit Global ✦" },
  { id: "studysync", label: "StudySync" },
  { id: "achieve", label: "Achieve3000" },
  { id: "oxford", label: "Oxford" },
  { id: "cambridge", label: "Cambridge" },
  { id: "pearson", label: "Pearson / Savvas" },
  { id: "collins", label: "Collins" },
];

function matchesCurriculum(curriculum: string | undefined, tab: (typeof CURRICULUM_TABS)[number]["id"]): boolean {
  if (tab === "all") return true;
  const c = (curriculum ?? "").toLowerCase();
  if (tab === "american") return c.includes("american") || c.includes("us");
  if (tab === "british") return c.includes("british") || c.includes("cambridge");
  if (tab === "ib") return c.includes("ib");
  if (tab === "uae") return c.includes("uae") || c.includes("moe");
  if (tab === "saudi") return c.includes("saudi") || c.includes("ncc");
  return true;
}

function matchesPubChip(publisher: string, chip: string): boolean {
  if (chip === "all") return true;
  const p = publisher.toLowerCase();
  const needle: Record<string, string> = {
    mcgraw: "mcgraw",
    kodeit: "kodeit",
    studysync: "studysync",
    achieve: "achieve",
    oxford: "oxford",
    cambridge: "cambridge",
    pearson: "pearson",
    collins: "collins",
  };
  return p.includes(needle[chip] ?? chip);
}

export function CataloguePage() {
  const { t } = useTranslation();
  const school = useAuthStore((s) => s.school);

  const [curriculumTab, setCurriculumTab] = useState<(typeof CURRICULUM_TABS)[number]["id"]>("american");
  const [pubChip, setPubChip] = useState("all");
  const [q, setQ] = useState("");
  const [grade, setGrade] = useState("all");
  const [subject, setSubject] = useState("all");
  const [format, setFormat] = useState("all");
  const [visible, setVisible] = useState(12);

  const country = school?.country;

  const pool = useMemo(() => {
    return mockProducts.filter((p) => p.type === "TEXTBOOK").filter((p) => (country ? p.countryRelevance.includes(country) : true));
  }, [country]);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return pool
      .filter((p) => matchesCurriculum(p.curriculum, curriculumTab))
      .filter((p) => matchesPubChip(p.publisher, pubChip))
      .filter((p) => {
        if (grade === "all") return true;
        const g = (p.grades ?? "").toLowerCase();
        if (grade === "kg") return g.includes("kg") || g.includes("k");
        if (grade === "g1") return g.includes("1") || g.includes("2") || g.includes("3");
        if (grade === "g4") return g.includes("4") || g.includes("5") || g.includes("6");
        if (grade === "g7") return g.includes("7") || g.includes("8") || g.includes("9");
        if (grade === "g10") return g.includes("10") || g.includes("11") || g.includes("12");
        return true;
      })
      .filter((p) => {
        if (subject === "all") return true;
        return (p.subject ?? "").toLowerCase().includes(subject);
      })
      .filter((p) => {
        if (format === "all") return true;
        return p.format.toLowerCase().includes(format);
      })
      .filter((p) => (qq ? `${p.name} ${p.publisher} ${p.sku}`.toLowerCase().includes(qq) : true));
  }, [pool, curriculumTab, pubChip, q, grade, subject, format]);

  useEffect(() => {
    setVisible(12);
  }, [curriculumTab, pubChip, q, grade, subject, format, country]);

  const slice = filtered.slice(0, visible);

  const sub = t("mvpPages.catalogue.subtitle", {
    curriculum: school?.curriculumType ?? "American",
  });

  return (
    <div>
      <PwPageHeader
        title={t("nav.catalogueLong")}
        subtitle={sub}
        right={<span className="pw-status pw-status-active">{t("mvpPages.catalogue.productCount", { count: filtered.length })}</span>}
      />

      <div className="pw-tabs">
        {CURRICULUM_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={cn("pw-tab", curriculumTab === tab.id && "pw-active")}
            onClick={() => setCurriculumTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="pw-pub-row">
        {PUB_CHIPS.map((chip) => (
          <button
            key={chip.id}
            type="button"
            className={cn("pw-pub-chip", pubChip === chip.id && "pw-active")}
            onClick={() => setPubChip(chip.id)}
          >
            {chip.label}
          </button>
        ))}
      </div>

      <div className="pw-filter-bar">
        <div className="relative min-w-[200px] max-w-[320px] flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 z-[1] -translate-y-1/2 text-[#9A9890]" size={14} />
          <input
            className="pw-search-input w-full ps-9"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("mvpPages.catalogue.searchPlaceholder")}
          />
        </div>
        <select className="pw-filter-select" value={grade} onChange={(e) => setGrade(e.target.value)}>
          <option value="all">{t("mvpPages.catalogue.allGrades")}</option>
          <option value="kg">{t("mvpPages.catalogue.gradeKg")}</option>
          <option value="g1">{t("mvpPages.catalogue.gradeG1")}</option>
          <option value="g4">{t("mvpPages.catalogue.gradeG4")}</option>
          <option value="g7">{t("mvpPages.catalogue.gradeG7")}</option>
          <option value="g10">{t("mvpPages.catalogue.gradeG10")}</option>
        </select>
        <select className="pw-filter-select" value={subject} onChange={(e) => setSubject(e.target.value)}>
          <option value="all">{t("mvpPages.catalogue.allSubjects")}</option>
          <option value="science">{t("mvpPages.catalogue.subjScience")}</option>
          <option value="math">{t("mvpPages.catalogue.subjMath")}</option>
          <option value="english">{t("mvpPages.catalogue.subjEnglish")}</option>
          <option value="social">{t("mvpPages.catalogue.subjSocial")}</option>
          <option value="arabic">{t("mvpPages.catalogue.subjArabic")}</option>
          <option value="ict">{t("mvpPages.catalogue.subjIct")}</option>
        </select>
        <select className="pw-filter-select" value={format} onChange={(e) => setFormat(e.target.value)}>
          <option value="all">{t("mvpPages.catalogue.allFormats")}</option>
          <option value="print">{t("mvpPages.catalogue.fmtPrint")}</option>
          <option value="digital">{t("mvpPages.catalogue.fmtDigital")}</option>
          <option value="blend">{t("mvpPages.catalogue.fmtBlended")}</option>
        </select>
        <div className="ms-auto flex gap-1.5">
          <button type="button" className="pw-btn pw-btn-outline pw-btn-sm" aria-label="Grid">
            ⊞
          </button>
          <button type="button" className="pw-btn pw-btn-outline pw-btn-sm" aria-label="List">
            ☰
          </button>
        </div>
      </div>

      <div className="pw-grid-3">
        {slice.map((p) => {
          const unit = country === "KSA" ? "SAR" : "AED";
          const price = `${unit} ${Math.round(p.price * (country === "KSA" ? 1.03 : 1))}`;
          return (
            <KnowledgeProductCard
              key={p.id}
              to={`/app/catalogue/${p.id}`}
              className="pw-kc-card--catalogue-grid"
              title={p.name}
              eyebrow={t("app.schoolDashboard.recentCatalogueEyebrow")}
              body={`${p.publisher} • ${p.grades ?? "—"} • ${p.format}`}
              priceLine={`${price} / ${t("mvpPages.catalogue.perStudent")}`}
              ctaLine={t("app.schoolDashboard.recentCatalogueCta")}
              theme={knowledgeCardThemeFromId(p.id)}
              badge={
                p.nccApproved ? (
                  <span className="pw-kc-badge">
                    <span className="pw-badge pw-badge-ncc">NCC Approved</span>
                  </span>
                ) : undefined
              }
            />
          );
        })}
      </div>

      {filtered.length > visible ? (
        <div className="mt-7 text-center">
          <button type="button" className="pw-btn pw-btn-outline" onClick={() => setVisible((v) => v + 12)}>
            {t("mvpPages.catalogue.loadMore")}
          </button>
        </div>
      ) : null}
    </div>
  );
}
