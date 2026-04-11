import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PwPageHeader } from "../../panworld/PwPageHeader";
import { cn } from "../../utils/cn";

export function KitsPage() {
  const { t } = useTranslation();

  return (
    <div>
      <PwPageHeader title={t("nav.kits")} subtitle={t("mvpPages.kits.subtitle")} />

      <div
        className="mb-6 flex flex-col gap-4 rounded-2xl p-5 text-white md:flex-row md:items-center"
        style={{
          background: "linear-gradient(135deg,#4A148C,#7B1FA2)",
        }}
      >
        <div className="text-4xl">🔤</div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span className="text-base font-semibold">{t("mvpPages.kits.jollyBannerTitle")}</span>
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-semibold">{t("mvpPages.kits.jollyBannerNew")}</span>
          </div>
          <div className="text-[13px] opacity-90">{t("mvpPages.kits.jollyBannerBody")}</div>
        </div>
        <button type="button" className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-[#4A148C] shrink-0">
          {t("mvpPages.kits.explore")}
        </button>
      </div>

      <div className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-[#5C5A55]">{t("mvpPages.kits.mhScience")}</div>
      <div className="pw-grid-3 mb-10">
        <KitCard
          emoji="🔬"
          pubClass="pub-mcgraw"
          badge={<span className="pw-badge pw-badge-brand">Inspire Science</span>}
          title="Science Lab Kit — G4 Unit 1"
          sub="Hands-on lab kit · 30 student set"
          meta="Contents: 24 components · Consumables replenishment available"
          price="AED 480 / classroom set"
          t={t}
        />
        <KitCard
          emoji="⚗️"
          pubClass="pub-mcgraw"
          title="Science Lab Kit — G5 Unit 2"
          sub="Hands-on lab kit · 30 student set"
          meta="Contents: 31 components · Safety gloves included"
          price="AED 520 / classroom set"
          t={t}
        />
        <KitCard
          emoji="📝"
          pubClass="pub-mcgraw"
          title="English Collaboration Kit"
          sub="Classroom set · Wonders ELA"
          meta="Manipulatives, word cards, visual aids · G1–G4"
          price="AED 290 / classroom set"
          t={t}
        />
      </div>

      <div className="mb-3 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wider text-[#5C5A55]">
        {t("mvpPages.kits.jollySection")}
        <span className="pw-badge pw-badge-new">New</span>
      </div>
      <div className="pw-grid-3">
        <KitCard
          emoji="🔤"
          pubClass="pub-jolly"
          title="Jolly Phonics KG1 Complete Kit"
          sub="Full KG1 phonics set · Classroom edition"
          meta="Student books, teacher guide, sound cards, letter workbooks"
          price="AED 320 / classroom"
          t={t}
        />
        <KitCard
          emoji="🎵"
          pubClass="pub-jolly"
          title="Jolly Phonics KG2 Complete Kit"
          sub="Full KG2 phonics set · Classroom edition"
          meta="Includes decodable readers and parent orientation pack"
          price="AED 345 / classroom"
          t={t}
        />
      </div>
    </div>
  );
}

function KitCard({
  emoji,
  pubClass,
  badge,
  title,
  sub,
  meta,
  price,
  t,
}: {
  emoji: string;
  pubClass: string;
  badge?: ReactNode;
  title: string;
  sub: string;
  meta: string;
  price: string;
  t: (k: string) => string;
}) {
  return (
    <div className="pw-product-card">
      <div className={cn("pw-product-img !h-[130px]", pubClass)}>
        {emoji}
        {badge ? <div className="pw-product-badges">{badge}</div> : null}
      </div>
      <div className="pw-product-body">
        <div className="pw-product-title">{title}</div>
        <div className="pw-product-sub">{sub}</div>
        <div className="mb-2 text-[12px] text-[#5C5A55]">{meta}</div>
        <div className="pw-product-price">{price}</div>
        <div className="pw-product-actions">
          <Link to="/app/rfq" className="pw-btn pw-btn-primary pw-btn-xs inline-flex items-center gap-1 no-underline">
            <Plus className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {t("app.schoolDashboard.rfqCta")}
          </Link>
          <button type="button" className="pw-btn pw-btn-outline pw-btn-xs">
            {t("mvpPages.kits.requestSample")}
          </button>
        </div>
      </div>
    </div>
  );
}
