import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";
import { mockProducts } from "../../../mock/data";
import { useAuthStore } from "../../../store/auth.store";
import { pubClassFromPublisher, stableEmoji } from "../../../data/school/mvpUi";
import { PwPageHeader } from "../../panworld/PwPageHeader";
import { cn } from "../../utils/cn";

type LibRow = {
  id: string;
  title: string;
  sub: string;
  tags: string[];
  price: string;
  emoji: string;
  pubClass?: string;
  bg?: string;
};

const STATIC_LIBRARY: LibRow[] = [
  { id: "s_l1", title: "Oxford Reading Tree", sub: "Oxford · Lexile 200–500 · English", tags: ["Fiction", "G1–G3"], price: "AED 28 / set", emoji: "📖", pubClass: "pub-oxford" },
  { id: "s_l2", title: "Collins Big Cats", sub: "Collins · Levelled Readers · English", tags: ["Non-Fiction", "G1–G5"], price: "AED 22 / book", emoji: "📚", pubClass: "pub-collins" },
  { id: "s_l3", title: "STEM Readers Series", sub: "Pearson · Lexile 600–900 · English", tags: ["STEM", "G5–G9"], price: "AED 35 / book", emoji: "📗", bg: "#FFF8E1" },
  { id: "s_l4", title: "Islamic Studies Readers", sub: "Oxford · Arabic & English · Bilingual", tags: ["Islamic Studies", "KG–G6"], price: "AED 30 / book", emoji: "🌙", bg: "#E8F5E9" },
];

export function LibraryPage() {
  const { t } = useTranslation();
  const school = useAuthStore((s) => s.school);
  const country = school?.country;
  const [q, setQ] = useState("");

  const dynamicRows = useMemo((): LibRow[] => {
    return mockProducts
      .filter((p) => p.type === "LIBRARY")
      .filter((p) => (country ? p.countryRelevance.includes(country) : true))
      .slice(0, 8)
      .map((p) => ({
        id: `m_${p.id}`,
        title: p.name,
        sub: `${p.publisher} · ${p.edition}`,
        tags: [p.subject ?? "Reading", p.grades ?? "—"],
        price: `${country === "KSA" ? "SAR" : "AED"} ${Math.round(p.price)} / book`,
        emoji: stableEmoji(p.name),
        pubClass: pubClassFromPublisher(p.publisher),
      }));
  }, [country]);

  const rows = useMemo(() => {
    const merged = [...STATIC_LIBRARY, ...dynamicRows];
    const qq = q.trim().toLowerCase();
    return merged.filter((r) => (qq ? `${r.title} ${r.sub}`.toLowerCase().includes(qq) : true));
  }, [q, dynamicRows]);

  return (
    <div>
      <PwPageHeader title={t("nav.libraryBooks")} subtitle={t("mvpPages.library.subtitle")} />

      <div className="pw-filter-bar">
        <div className="relative min-w-[200px] max-w-[320px] flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9A9890]" size={14} />
          <input
            className="pw-search-input w-full ps-9"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("mvpPages.library.searchPlaceholder")}
          />
        </div>
        <select className="pw-filter-select" defaultValue="all">
          <option value="all">All Reading Levels</option>
          <option>Lexile 200–400 (G1–G2)</option>
          <option>Lexile 400–600 (G3–G4)</option>
          <option>Lexile 600–800 (G5–G7)</option>
          <option>Lexile 800–1000 (G8–G10)</option>
          <option>Lexile 1000+ (G11–G12)</option>
        </select>
        <select className="pw-filter-select" defaultValue="all">
          <option value="all">All Genres</option>
          <option>Fiction</option>
          <option>Non-Fiction</option>
          <option>STEM</option>
          <option>Islamic Studies</option>
          <option>Arabic Literature</option>
        </select>
        <select className="pw-filter-select" defaultValue="all">
          <option value="all">All Languages</option>
          <option>English</option>
          <option>Arabic</option>
          <option>Bilingual</option>
        </select>
        <select className="pw-filter-select" defaultValue="all">
          <option value="all">All Publishers</option>
          <option>Oxford</option>
          <option>Cambridge</option>
          <option>Collins</option>
          <option>Pearson</option>
        </select>
      </div>

      <div className="pw-grid-4">
        {rows.map((r) => (
          <div key={r.id} className="pw-product-card">
            <div className={cn("pw-product-img !h-[120px]", r.pubClass)} style={r.bg ? { background: r.bg } : undefined}>
              {r.emoji}
            </div>
            <div className="pw-product-body">
              <div className="pw-product-title">{r.title}</div>
              <div className="pw-product-sub">{r.sub}</div>
              <div className="mb-2 flex flex-wrap gap-1">
                {r.tags.map((tag) => (
                  <span key={tag} className="pw-tag">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="pw-product-price">{r.price}</div>
              <div className="pw-product-actions">
                <Link to="/app/rfq" className="pw-btn pw-btn-primary pw-btn-xs no-underline">
                  {t("mvpPages.library.libraryRfqCta")}
                </Link>
                <button type="button" className="pw-btn pw-btn-outline pw-btn-xs">
                  ♡
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pw-card mt-6 border-[#0A3D62]/15 bg-[#D6EAF8]">
        <div className="flex flex-col items-stretch gap-4 md:flex-row md:items-center md:gap-3">
          <div className="text-2xl">📋</div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-[#0A3D62]">{t("mvpPages.library.bannerTitle")}</div>
            <div className="mt-0.5 text-[13px] text-[#1A5276]">{t("mvpPages.library.bannerBody")}</div>
          </div>
          <Link to="/app/rfq" className="pw-btn pw-btn-primary pw-btn-sm shrink-0 whitespace-nowrap no-underline">
            {t("mvpPages.library.viewLibraryRfq")}
          </Link>
        </div>
      </div>
    </div>
  );
}
