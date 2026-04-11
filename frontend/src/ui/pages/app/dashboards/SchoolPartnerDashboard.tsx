import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "../../../utils/cn";
import type { School, User } from "../../../../types/domain";
import {
  featuredNewTitles,
  publisherQuickAccess,
  recommendedForYou,
  schoolAccountManager,
  schoolDashboardAnnouncements,
  schoolDashboardChecklistSummary,
  schoolGettingStartedChecklist,
  schoolWishlistPreview,
  type SchoolAnnouncement,
  type SchoolProductHighlight,
} from "../../../../data/school/dashboard";

const PUB_IMG: Record<SchoolProductHighlight["pubClass"], string> = {
  mcgraw: "pub-mcgraw",
  achieve: "pub-achieve",
  studysync: "pub-studysync",
  kodeit: "pub-kodeit",
  jolly: "pub-jolly",
};

function countryToLocationLabel(country: string | undefined): string {
  if (!country) return "";
  const c = country.toUpperCase();
  if (c === "UAE") return "Dubai, UAE";
  if (c === "KSA") return "Riyadh, Saudi Arabia";
  if (c === "OM") return "Muscat, Oman";
  if (c === "BH") return "Manama, Bahrain";
  if (c === "KW") return "Kuwait City, Kuwait";
  if (c === "QA") return "Doha, Qatar";
  return country;
}

function formatSchoolMoney(amount: number, country: string | undefined) {
  const c = (country ?? "UAE").toUpperCase();
  const currency = c === "KSA" ? "SAR" : "AED";
  return new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
}

function productPrice(p: SchoolProductHighlight, country: string | undefined) {
  const c = (country ?? "UAE").toUpperCase();
  const amount = c === "KSA" ? p.priceSar : p.priceAed;
  return formatSchoolMoney(amount, country);
}

function AnnDot({ a }: { a: SchoolAnnouncement }) {
  const cls =
    a.tone === "brand"
      ? "bg-[#512DA8]"
      : a.tone === "success"
        ? "bg-[#1E8449]"
        : "bg-[#E8912D]";
  return <span className={cn("pw-ann-dot", cls)} />;
}

function ProductCarouselCard({
  p,
  country,
  t,
}: {
  p: SchoolProductHighlight;
  country: string | undefined;
  t: (k: string, o?: Record<string, string | number>) => string;
}) {
  const badgeKey =
    p.badge === "newEd"
      ? "app.schoolDashboard.badges.newEd"
      : p.badge === "ourBrand"
        ? "app.schoolDashboard.badges.ourBrand"
        : p.badge === "newPartner"
          ? "app.schoolDashboard.badges.newPartner"
          : p.badge === "newArabic"
            ? "app.schoolDashboard.badges.newArabic"
            : p.badge === "ed2025"
              ? "app.schoolDashboard.badges.ed2025"
              : null;

  const unitKey =
    p.priceUnitKey === "perStudent"
      ? "app.schoolDashboard.priceUnits.perStudent"
      : p.priceUnitKey === "perLicence"
        ? "app.schoolDashboard.priceUnits.perLicence"
        : "app.schoolDashboard.priceUnits.perClassroom";

  const badgeClass =
    p.badge === "newEd" || p.badge === "ed2025"
      ? "pw-badge-accent"
      : p.badge === "ourBrand"
        ? "pw-badge-brand"
        : p.badge === "newPartner" || p.badge === "newArabic"
          ? "pw-badge-new"
          : "pw-badge-accent";

  return (
    <div className="pw-product-card">
      <Link to="/app/catalogue" className="block">
        <div className={cn("pw-product-img", PUB_IMG[p.pubClass])}>
          {p.emoji}
          {badgeKey ? (
            <div className="pw-product-badges">
              <span className={cn("pw-badge", badgeClass)}>{t(badgeKey)}</span>
            </div>
          ) : null}
        </div>
      </Link>
      <div className="pw-product-body">
        <div className="pw-product-title">{t(p.productTitleKey)}</div>
        <div className="pw-product-sub">{t(p.productSubKey)}</div>
        <div className="pw-product-price">
          {productPrice(p, country)}
          {t(unitKey)}
        </div>
        <div className="pw-product-actions">
          <Link to="/app/rfq" className="pw-btn pw-btn-primary pw-btn-xs">
            {t("app.schoolDashboard.rfqCta")}
          </Link>
          <Link to="/app/wishlist" className="pw-btn pw-btn-outline pw-btn-xs">
            {t("app.schoolDashboard.wishlistCta")}
          </Link>
        </div>
      </div>
    </div>
  );
}

export function SchoolPartnerDashboard({ user, school }: { user: User; school: School }) {
  const { t } = useTranslation();
  const displayName = `${user.firstName}`.trim() || user.email;
  const locationLabel = countryToLocationLabel(school.country);

  const greetingKey = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "app.schoolDashboard.greetingMorning" as const;
    if (h < 17) return "app.schoolDashboard.greetingAfternoon" as const;
    return "app.schoolDashboard.greetingEvening" as const;
  }, []);

  const pct = Math.round((schoolDashboardChecklistSummary.done / schoolDashboardChecklistSummary.total) * 100);

  return (
    <div className="space-y-6">
      {/* Top banner — match HTML gradient strip */}
      <div className="pw-top-banner">
        <div className="text-[12px] font-medium uppercase tracking-[0.08em] opacity-80">{t(greetingKey)}</div>
        <div className="mt-1 font-serif text-[26px] leading-tight">{t("app.schoolDashboard.welcomeBack", { name: displayName })}</div>
        <div className="mt-1.5 text-[13.5px] opacity-85">
          {t("app.schoolDashboard.schoolLine", {
            name: school.name,
            curriculum: school.curriculumType,
            location: locationLabel,
          })}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="pw-card">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-[#1A1917]">{t("app.schoolDashboard.checklistTitle")}</div>
              <div className="mt-0.5 text-xs text-[#5C5A55]">
                {t("app.schoolDashboard.checklistProgress", {
                  done: schoolDashboardChecklistSummary.done,
                  total: schoolDashboardChecklistSummary.total,
                })}
              </div>
            </div>
            <div className="text-[22px] font-bold text-[#E8912D]">{pct}%</div>
          </div>
          <div className="pw-progress mb-4">
            <div className="pw-progress-fill pw-accent-fill" style={{ width: `${pct}%` }} />
          </div>
          {schoolGettingStartedChecklist.map((row) => (
            <div key={row.id} className="pw-checklist-row">
              <div
                className={cn(
                  "pw-check-circle",
                  row.state === "done" && "pw-done",
                  row.state === "active" && "pw-active",
                )}
              >
                {row.state === "done" ? "✓" : ""}
              </div>
              <div className="min-w-0 flex-1">
                <div
                  className={cn(
                    "text-[13.5px]",
                    row.state === "done" && "text-[#5C5A55] line-through",
                    row.state === "active" && "font-medium text-[#1A1917]",
                    row.state === "todo" && "text-[#5C5A55]",
                  )}
                >
                  {t(row.labelKey)}
                </div>
                {row.catalogueCta ? (
                  <Link to="/app/catalogue" className="pw-btn pw-btn-primary pw-btn-sm mt-1.5 inline-flex">
                    {t("app.schoolDashboard.browseCatalogue")}
                  </Link>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <div className="pw-am-card">
            <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-white/50">
              {t("app.schoolDashboard.amTitle")}
            </div>
            <div className="mb-3 flex items-center gap-3">
              <div className="pw-am-avatar">{schoolAccountManager.initials}</div>
              <div className="min-w-0">
                <div className="text-sm font-semibold">{schoolAccountManager.name}</div>
                <div className="text-[11.5px] opacity-60">{schoolAccountManager.roleLine}</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <a href={`https://wa.me/${schoolAccountManager.whatsappE164}`} target="_blank" rel="noreferrer" className="pw-wa-btn">
                💬 {t("app.schoolDashboard.amWhatsApp")}
              </a>
              <a
                href={`mailto:${schoolAccountManager.email}`}
                className="inline-flex items-center rounded-md border border-white/20 bg-white/15 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/25"
              >
                ✉ {t("app.schoolDashboard.amEmail")}
              </a>
            </div>
          </div>

          <div className="pw-card flex flex-1 flex-col">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div className="text-sm font-semibold text-[#1A1917]">{t("app.schoolDashboard.latestUpdates")}</div>
              <Link to="/app/announcements" className="pw-btn pw-btn-ghost pw-btn-xs">
                {t("app.schoolDashboard.viewAll")}
              </Link>
            </div>
            {schoolDashboardAnnouncements.map((a) => (
              <div key={a.id} className="pw-ann-row">
                <AnnDot a={a} />
                <div className="min-w-0">
                  <div className="text-[13.5px] font-medium text-[#1A1917]">{t(a.titleKey)}</div>
                  <div className="ann-meta mt-0.5 text-[11.5px] text-[#9A9890]">{t(a.metaKey)}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="pw-card">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div className="text-sm font-semibold text-[#1A1917]">
                {t("app.schoolDashboard.wishlistTitle")}{" "}
                <span className="pw-badge pw-badge-brand ms-1.5">{t("app.schoolDashboard.wishlistBadge", { count: schoolWishlistPreview.itemCount })}</span>
              </div>
              <Link to="/app/wishlist" className="pw-btn pw-btn-ghost pw-btn-xs">
                {t("app.schoolDashboard.viewAll")}
              </Link>
            </div>
            <div className="mb-2.5 text-[13px] text-[#5C5A55]">{t("app.schoolDashboard.wishlistStale", { count: schoolWishlistPreview.staleCount })}</div>
            <Link to="/app/rfq" className="pw-btn pw-btn-primary pw-btn-full">
              {t("app.schoolDashboard.convertAllRfq")}
            </Link>
          </div>
        </div>
      </div>

      <section>
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-sm font-semibold text-[#1A1917]">{t("app.schoolDashboard.recommendedTitle")}</div>
            <div className="mt-0.5 text-xs text-[#5C5A55]">{t("app.schoolDashboard.recommendedSub")}</div>
          </div>
          <Link to="/app/catalogue" className="pw-btn pw-btn-outline pw-btn-sm self-start">
            {t("app.schoolDashboard.browseAll")}
          </Link>
        </div>
        <div className="pw-carousel">{recommendedForYou.map((p) => (
          <ProductCarouselCard key={p.id} p={p} country={school.country} t={t} />
        ))}</div>
      </section>

      <section>
        <div className="mb-3">
          <div className="text-sm font-semibold text-[#1A1917]">{t("app.schoolDashboard.featuredTitle")}</div>
          <div className="mt-0.5 text-xs text-[#5C5A55]">{t("app.schoolDashboard.featuredSub")}</div>
        </div>
        <div className="pw-carousel">{featuredNewTitles.map((p) => (
          <ProductCarouselCard key={p.id} p={p} country={school.country} t={t} />
        ))}</div>
      </section>

      <div className="pw-curriculum-cta">
        <div className="text-4xl" aria-hidden>
          🗺
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[15px] font-semibold">{t("app.schoolDashboard.curriculumMapTitle")}</div>
          <p className="mt-1 text-[13px] opacity-90">{t("app.schoolDashboard.curriculumMapSub")}</p>
        </div>
        <Link to="/app/curriculum-mapping" className="pw-btn pw-btn-accent shrink-0 whitespace-nowrap">
          {t("app.schoolDashboard.startMapping")}
        </Link>
      </div>

      <div className="pw-card">
        <div className="mb-3.5 text-sm font-semibold text-[#1A1917]">{t("app.schoolDashboard.publishersTitle")}</div>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-5">
          {publisherQuickAccess.map((pub) => (
            <Link
              key={pub.id}
              to="/app/catalogue"
              className={cn("pw-pub-grid-item", pub.highlight && "pw-highlight")}
            >
              <div className="mb-1.5 text-[22px]">{pub.icon}</div>
              <div className={cn("text-[11.5px] font-medium leading-tight text-[#5C5A55]", pub.highlight && "font-semibold text-[#0A3D62]")}>
                {t(pub.labelKey)}
              </div>
              {pub.ourBrand ? <div className="mt-0.5 text-[10px] font-medium text-[#0A3D62] opacity-70">{t("app.schoolDashboard.ourBrand")}</div> : null}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
