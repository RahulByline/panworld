import { Link } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Banknote,
  BarChart3,
  BookCopy,
  BookOpen,
  BookText,
  Building2,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ClipboardList,
  ExternalLink,
  FlaskConical,
  Gem,
  Gift,
  GraduationCap,
  Heart,
  HeartHandshake,
  Languages,
  Library,
  Info,
  LifeBuoy,
  Link2,
  Mail,
  Map,
  MessageCircle,
  MonitorPlay,
  Package,
  Plus,
  Ruler,
  ShoppingBag,
  Sparkles,
  User as UserIcon,
} from "lucide-react";
import { cn } from "../../../utils/cn";
import { KnowledgeProductCard, knowledgeCardTheme } from "../../../school/KnowledgeProductCard";
import type { School, User } from "../../../../types/domain";
import {
  featuredNewTitles,
  featuredTitlesListTabs,
  publisherQuickAccess,
  recommendedForYou,
  schoolAccountManager,
  schoolChecklistAccordionSections,
  schoolDashboardAnnouncements,
  schoolDashboardChecklistSummary,
  schoolOverviewStats,
  schoolRecentActivity,
  schoolRecentCatalogue,
  schoolRfqPipeline,
  schoolWishlistPreview,
  type SchoolAnnouncement,
  type FeaturedTitlesTabId,
  type SchoolChecklistAccordionSection,
  type SchoolProductHighlight,
} from "../../../../data/school/dashboard";

/** Duplicated slides for seamless infinite horizontal scroll */
const RECENT_CATALOGUE_MARQUEE_COPIES = 3;
const RECENT_CATALOGUE_MARQUEE_SPEED = 0.42;

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function sectionRequirementStats(section: SchoolChecklistAccordionSection) {
  const total = section.subItems.length;
  const done = section.subItems.filter((i) => i.done).length;
  return { done, total, allDone: done === total };
}

function SchoolChecklistAccordion({ school }: { school: School }) {
  const { t } = useTranslation();
  const { done: doneCount, total: totalCount } = schoolDashboardChecklistSummary;
  const pct = totalCount === 0 ? 0 : Math.round((doneCount / totalCount) * 100);
  const allComplete = doneCount === totalCount && totalCount > 0;

  const [openSectionId, setOpenSectionId] = useState<string | null>(() => {
    const firstIncomplete = schoolChecklistAccordionSections.find((s) => !sectionRequirementStats(s).allDone);
    return (firstIncomplete ?? schoolChecklistAccordionSections[0])?.id ?? null;
  });

  const toggleSection = (id: string) => {
    setOpenSectionId((cur) => (cur === id ? null : id));
  };

  const scrollToOverview = () => {
    document.getElementById("pw-dash-overview-anchor")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const helpLinks = [
    { key: "app.schoolDashboard.checklistAccordion.linkOnboarding", href: "https://www.panworld.ae" },
    { key: "app.schoolDashboard.checklistAccordion.linkCatalogue", href: "https://www.panworld.ae" },
    { key: "app.schoolDashboard.checklistAccordion.linkRfq", href: "https://www.panworld.ae" },
  ] as const;

  return (
    <div className="pw-checklist-accordion-panel">
      <div className="pw-checklist-acc-head">
        <h2 className="pw-checklist-acc-title">{t("app.schoolDashboard.checklistAccordion.panelTitle", { name: school.name })}</h2>
      </div>

      <div className="pw-checklist-acc-status-row">
        <span className={cn("pw-checklist-acc-status-label", allComplete && "pw-checklist-acc-status-label--complete")}>
          {allComplete ? t("app.schoolDashboard.checklistAccordion.statusComplete") : t("app.schoolDashboard.checklistAccordion.statusInProgress")}
        </span>
        <span className="pw-checklist-acc-fraction">{t("app.schoolDashboard.checklistAccordion.fractionDone", { done: doneCount, total: totalCount })}</span>
      </div>

      <div
        className="pw-checklist-acc-progress-track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label={t("app.schoolDashboard.checklistTitle")}
      >
        <div
          className={cn(
            "pw-checklist-acc-progress-fill",
            allComplete ? "pw-checklist-acc-progress-fill--complete" : "pw-checklist-acc-progress-fill--active",
          )}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="pw-checklist-acc-list">
        {schoolChecklistAccordionSections.map((section) => {
          const { done, total, allDone } = sectionRequirementStats(section);
          const expanded = openSectionId === section.id;
          const panelId = `checklist-acc-${section.id}`;
          return (
            <div key={section.id} className={cn("pw-checklist-acc-section", expanded && "pw-checklist-acc-section--open")}>
              <button
                type="button"
                id={`${panelId}-btn`}
                className="pw-checklist-acc-trigger"
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => toggleSection(section.id)}
              >
                <span className={cn("pw-checklist-acc-node", allDone && "pw-checklist-acc-node--done")} aria-hidden>
                  {allDone ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : null}
                </span>
                <span className="pw-checklist-acc-trigger-title">{t(section.titleKey)}</span>
                <span className="pw-checklist-acc-trigger-right">
                  <span className="pw-checklist-acc-req-count">{t("app.schoolDashboard.checklistAccordion.requirementsLine", { done, total })}</span>
                  {expanded ? (
                    <ChevronUp className="pw-checklist-acc-chevron h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
                  ) : (
                    <ChevronDown className="pw-checklist-acc-chevron h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
                  )}
                </span>
              </button>
              {expanded ? (
                <div id={panelId} className="pw-checklist-acc-panel" role="region" aria-labelledby={`${panelId}-btn`}>
                  <ul className="pw-checklist-acc-sublist">
                    {section.subItems.map((sub) => (
                      <li key={sub.id} className="pw-checklist-acc-sub">
                        <span className={cn("pw-checklist-acc-sub-node", sub.done && "pw-checklist-acc-sub-node--done")} aria-hidden>
                          {sub.done ? <Check className="h-2.5 w-2.5" strokeWidth={3} /> : null}
                        </span>
                        <div className="pw-checklist-acc-sub-copy">
                          <div className="pw-checklist-acc-sub-label">{t(sub.labelKey)}</div>
                          <div className="pw-checklist-acc-sub-trail">({t(sub.trailKey)})</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  {section.subItems.some((x) => x.catalogueCta) ? (
                    <Link to="/app/catalogue" className="pw-btn pw-btn-primary pw-btn-sm mt-3 inline-flex items-center gap-1.5">
                      {t("app.schoolDashboard.browseCatalogue")}
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 opacity-95" aria-hidden />
                    </Link>
                  ) : null}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="pw-checklist-acc-info">
        <div className="pw-checklist-acc-info-icon" aria-hidden>
          <Info className="h-5 w-5" strokeWidth={2} />
        </div>
        <div className="pw-checklist-acc-info-copy">
          <div className="pw-checklist-acc-info-title">{t("app.schoolDashboard.checklistAccordion.infoTitle")}</div>
          <p className="pw-checklist-acc-info-body">{t("app.schoolDashboard.checklistAccordion.infoBody")}</p>
          <ul className="pw-checklist-acc-info-linklist">
            {helpLinks.map(({ key, href }) => (
              <li key={key}>
                <a href={href} target="_blank" rel="noreferrer" className="pw-checklist-acc-info-link">
                  {t(key)}
                  <ExternalLink className="h-3 w-3 shrink-0 opacity-80" strokeWidth={2} aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="pw-checklist-acc-footer">
        <button type="button" className="pw-btn pw-btn-primary" onClick={scrollToOverview}>
          {t("app.schoolDashboard.checklistAccordion.footerCta")}
        </button>
      </div>
    </div>
  );
}

function RecommendedShareEarnCard({ school }: { school: School }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const inviteUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/register?ref=${encodeURIComponent(school.id)}`;
  }, [school.id]);

  const copyLink = () => {
    if (!inviteUrl) return;
    void navigator.clipboard.writeText(inviteUrl).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    });
  };

  const steps: { icon: LucideIcon; textKey: string }[] = [
    { icon: HeartHandshake, textKey: "app.schoolDashboard.recoShare.step1" },
    { icon: Gem, textKey: "app.schoolDashboard.recoShare.step2" },
    { icon: Gift, textKey: "app.schoolDashboard.recoShare.step3" },
  ];

  return (
    <div className="pw-reco-share-card pw-reco-panel">
      <div className="pw-reco-share-hero" aria-hidden />
      <div className="px-5 pb-5 pt-2">
        <h3 className="text-lg font-bold tracking-tight text-slate-800">{t("app.schoolDashboard.recoShare.title")}</h3>
        <p className="mt-4 text-xs font-medium text-slate-500">{t("app.schoolDashboard.recoShare.howTitle")}</p>
        <ul className="mt-2.5 space-y-3.5">
          {steps.map(({ icon: Icon, textKey }) => (
            <li key={textKey} className="flex gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-50 text-[var(--pw-brand)] ring-1 ring-sky-100">
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />
              </span>
              <span className="flex min-w-0 flex-1 items-center text-[13px] leading-snug text-slate-800">{t(textKey)}</span>
            </li>
          ))}
        </ul>
        <p className="mb-1.5 mt-6 text-xs font-medium text-slate-500">{t("app.schoolDashboard.recoShare.linkLabel")}</p>
        <div className="flex items-center gap-2 rounded-full border border-sky-200/90 bg-sky-50 px-3 py-2">
          <Link2 className="h-4 w-4 shrink-0 text-slate-500" strokeWidth={1.75} aria-hidden />
          <span className="min-w-0 flex-1 truncate text-left font-mono text-[11px] text-slate-600" dir="ltr">
            {inviteUrl || "—"}
          </span>
          <button
            type="button"
            onClick={copyLink}
            className="shrink-0 rounded-full bg-[#0f172a] px-3.5 py-1.5 text-[11px] font-medium lowercase tracking-wide text-white transition hover:bg-slate-900"
          >
            {copied ? t("app.schoolDashboard.recoShare.copied") : t("app.schoolDashboard.recoShare.copy")}
          </button>
        </div>
      </div>
    </div>
  );
}

function recoBadgeClass(badge: SchoolProductHighlight["badge"]): string | undefined {
  if (!badge) return undefined;
  if (badge === "ed2025") return "pw-reco-badge--ed2025";
  if (badge === "newEd") return "pw-reco-badge--newEd";
  if (badge === "ourBrand") return "pw-reco-badge--ourBrand";
  if (badge === "newPartner" || badge === "newArabic") return "pw-reco-badge--newPartner";
  return undefined;
}

const PUB_IMG: Record<SchoolProductHighlight["pubClass"], string> = {
  mcgraw: "pub-mcgraw",
  achieve: "pub-achieve",
  studysync: "pub-studysync",
  kodeit: "pub-kodeit",
  jolly: "pub-jolly",
};

const dashIcon = { className: "h-3.5 w-3.5 shrink-0 opacity-90", strokeWidth: 2, "aria-hidden": true as const };

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

function pipelineToneClass(tone: (typeof schoolRfqPipeline)[number]["tone"]) {
  if (tone === "brand") return "pw-tone-brand";
  if (tone === "accent") return "pw-tone-accent";
  if (tone === "success") return "pw-tone-success";
  return "pw-tone-muted";
}

function DashboardProductGraphic({ productId, reco }: { productId: string; reco?: boolean }) {
  const common = reco
    ? { size: 48, strokeWidth: 1.2, className: "text-slate-600", "aria-hidden": true as const }
    : { size: 36, strokeWidth: 1.5, className: "text-[var(--pw-brand-mid)] opacity-85", "aria-hidden": true as const };
  switch (productId) {
    case "inspireScience":
      return <FlaskConical {...common} />;
    case "achieveEla":
      return <MonitorPlay {...common} />;
    case "studysyncG68":
      return <BookCopy {...common} />;
    case "kodeitSocSci":
      return <Building2 {...common} />;
    case "jollyKg":
      return <BookText {...common} />;
    case "revealMath":
      return <Ruler {...common} />;
    case "studysyncGcc":
      return <Languages {...common} />;
    default:
      return <BookOpen {...common} />;
  }
}

function PublisherQuickIcon({ publisherId }: { publisherId: string }) {
  const s = 22;
  const c = "text-[var(--pw-text-secondary)]";
  const common = { size: s, className: c, strokeWidth: 2, "aria-hidden": true as const };
  switch (publisherId) {
    case "mcgraw":
      return <BookOpen {...common} />;
    case "kodeit":
      return <Building2 {...common} />;
    case "studysync":
      return <BookCopy {...common} />;
    case "achieve":
      return <BarChart3 {...common} />;
    case "oxford":
      return <Library {...common} />;
    default:
      return <BookOpen {...common} />;
  }
}

function AnnDot({ a }: { a: SchoolAnnouncement }) {
  const cls =
    a.tone === "brand"
      ? "bg-[var(--pw-logo-blue)]"
      : a.tone === "success"
        ? "bg-[var(--pw-logo-green)]"
        : "bg-[var(--pw-logo-amber)]";
  return <span className={cn("pw-ann-dot", cls)} />;
}

const FEATURED_TITLE_ACCENTS = ["green", "blue", "purple"] as const;
type FeaturedTitleAccent = (typeof FEATURED_TITLE_ACCENTS)[number];

function featuredTitleAccent(index: number): FeaturedTitleAccent {
  return FEATURED_TITLE_ACCENTS[index % FEATURED_TITLE_ACCENTS.length] ?? "green";
}

function featuredTitlesForTab(tabId: FeaturedTitlesTabId): SchoolProductHighlight[] {
  const def = featuredTitlesListTabs.find((x) => x.id === tabId);
  if (!def) return featuredNewTitles;
  return featuredNewTitles.filter((p) => def.productIds.includes(p.id));
}

function FeaturedTitleCard({
  p,
  country,
  t,
  accentIndex,
}: {
  p: SchoolProductHighlight;
  country: string | undefined;
  t: (k: string, o?: Record<string, string | number>) => string;
  accentIndex: number;
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

  const recoMod = recoBadgeClass(p.badge);
  const subLine = t(p.productSubKey).replace(/\s*·\s*/g, " • ");
  const accent = featuredTitleAccent(accentIndex);

  return (
    <Link
      to="/app/catalogue"
      className="pw-featured-title-card focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2d5a30] focus-visible:ring-offset-2"
    >
      <div className={cn("pw-featured-title-card__icon", `pw-featured-title-card__icon--${accent}`)} aria-hidden>
        <ShoppingBag className="pw-featured-title-card__icon-svg" strokeWidth={1.65} />
      </div>
      <div className="pw-featured-title-card__main">
        {badgeKey ? <span className={cn("pw-reco-badge", recoMod)}>{t(badgeKey)}</span> : null}
        <div className="pw-featured-title-card__title">{t(p.productTitleKey)}</div>
        <div className="pw-featured-title-card__meta">{subLine}</div>
        <div className="pw-featured-title-card__price">
          {productPrice(p, country)}
          {t(unitKey)}
        </div>
      </div>
      <ChevronRight className="pw-featured-title-card__chev shrink-0" strokeWidth={2} aria-hidden />
    </Link>
  );
}

function FeaturedTitlesTabbedList({
  country,
  t,
}: {
  country: string | undefined;
  t: (k: string, o?: Record<string, string | number>) => string;
}) {
  const [tabId, setTabId] = useState<FeaturedTitlesTabId>("all");
  const rows = useMemo(() => featuredTitlesForTab(tabId), [tabId]);

  return (
    <div className="pw-featured-titles-list">
      <div className="pw-featured-tabs" role="tablist" aria-label={t("app.schoolDashboard.featuredTabs.aria")}>
        {featuredTitlesListTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`pw-featured-tab-${tab.id}`}
            aria-selected={tabId === tab.id}
            aria-controls="pw-featured-tabpanel"
            tabIndex={tabId === tab.id ? 0 : -1}
            className={cn("pw-featured-tab", tabId === tab.id && "pw-featured-tab--active")}
            onClick={() => setTabId(tab.id)}
          >
            {t(tab.titleKey)}
          </button>
        ))}
      </div>
      <div
        id="pw-featured-tabpanel"
        role="tabpanel"
        aria-labelledby={`pw-featured-tab-${tabId}`}
        className="pw-featured-tabpanel"
      >
        <ul className="pw-featured-list" role="list">
          {rows.map((p, i) => (
            <li key={p.id} className="pw-featured-list__item">
              <FeaturedTitleCard p={p} country={country} t={t} accentIndex={i} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
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

  const recoMod = recoBadgeClass(p.badge);

  const subLine = t(p.productSubKey).replace(/\s*·\s*/g, " • ");
  const priceLine = `${productPrice(p, country)}${t(unitKey)}`;

  return (
    <div className={cn("pw-reco-product-card", "pw-reco-panel")}>
      <Link to="/app/catalogue" className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pw-brand)] focus-visible:ring-offset-2">
        <div className={cn("pw-reco-share-hero", "pw-reco-share-hero--product", PUB_IMG[p.pubClass])}>
          {badgeKey ? (
            <div className="pw-reco-visual-badge">
              <span className={cn("pw-reco-badge", recoMod)}>{t(badgeKey)}</span>
            </div>
          ) : null}
          <div className="pw-reco-visual-icon">
            <DashboardProductGraphic productId={p.id} reco />
          </div>
        </div>
      </Link>
      <div className="px-5 pb-5 pt-2">
        <Link
          to="/app/catalogue"
          className="block no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pw-brand)] focus-visible:ring-offset-2"
        >
          <h3 className="text-lg font-bold tracking-tight text-slate-800">{t(p.productTitleKey)}</h3>
        </Link>
        <p className="mt-4 text-xs font-medium text-slate-500">{t("app.schoolDashboard.recoProduct.detailsTitle")}</p>
        <ul className="mt-2.5 space-y-3.5">
          <li className="flex gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-50 text-[var(--pw-brand)] ring-1 ring-sky-100">
              <BookText className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />
            </span>
            <span className="flex min-w-0 flex-1 items-center text-[13px] leading-snug text-slate-800">{subLine}</span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-50 text-[var(--pw-brand)] ring-1 ring-sky-100">
              <Banknote className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />
            </span>
            <span className="flex min-w-0 flex-1 items-center text-[13px] font-semibold leading-snug text-slate-800">{priceLine}</span>
          </li>
        </ul>
        <p className="mb-1.5 mt-6 text-xs font-medium text-slate-500">{t("app.schoolDashboard.recoProduct.actionsTitle")}</p>
        <div className="flex items-stretch gap-2">
          <Link
            to="/app/rfq"
            className="inline-flex min-h-[38px] flex-1 items-center justify-center gap-1.5 rounded-full bg-[#0f172a] px-3 text-[11px] font-medium tracking-wide text-white no-underline transition hover:bg-slate-900"
          >
            <Plus className="h-3.5 w-3.5 shrink-0" strokeWidth={2.25} aria-hidden />
            {t("app.schoolDashboard.rfqCta")}
          </Link>
          <Link
            to="/app/wishlist"
            className="inline-flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full border border-sky-200/90 bg-sky-50 text-slate-500 no-underline transition hover:bg-white hover:text-slate-700"
            aria-label={t("app.schoolDashboard.wishlistCtaAria")}
            title={t("app.schoolDashboard.wishlistCtaAria")}
          >
            <Heart className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  );
}

function RecentCatalogueRowCard({
  p,
  country,
  t,
  visualIndex,
}: {
  p: SchoolProductHighlight;
  country: string | undefined;
  t: (k: string, o?: Record<string, string | number>) => string;
  visualIndex: number;
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

  const recoMod = recoBadgeClass(p.badge);
  const subLine = t(p.productSubKey).replace(/\s*·\s*/g, " • ");

  return (
    <KnowledgeProductCard
      to="/app/catalogue"
      title={t(p.productTitleKey)}
      eyebrow={t("app.schoolDashboard.recentCatalogueEyebrow")}
      body={subLine}
      priceLine={`${productPrice(p, country)}${t(unitKey)}`}
      ctaLine={t("app.schoolDashboard.recentCatalogueCta")}
      theme={knowledgeCardTheme(visualIndex)}
      badge={badgeKey ? <span className={cn("pw-kc-badge", "pw-reco-badge", recoMod)}>{t(badgeKey)}</span> : undefined}
    />
  );
}

export function SchoolPartnerDashboard({ user, school }: { user: User; school: School }) {
  const { t } = useTranslation();
  const recentCatalogueScrollRef = useRef<HTMLDivElement>(null);
  const marqueeHoverPauseRef = useRef(false);

  const recentCatalogueLoop = useMemo(
    () =>
      Array.from({ length: RECENT_CATALOGUE_MARQUEE_COPIES }, (_, copy) =>
        schoolRecentCatalogue.map((p) => ({ p, copy, key: `${p.id}__m${copy}` })),
      ).flat(),
    [schoolRecentCatalogue],
  );

  const recentCatVisualIndexById = useMemo(() => {
    const m: Record<string, number> = {};
    schoolRecentCatalogue.forEach((p, i) => {
      m[p.id] = i;
    });
    return m;
  }, [schoolRecentCatalogue]);

  useEffect(() => {
    const el = recentCatalogueScrollRef.current;
    if (!el || prefersReducedMotion() || schoolRecentCatalogue.length === 0) return;

    let rafId = 0;
    const copies = RECENT_CATALOGUE_MARQUEE_COPIES;

    const tick = () => {
      if (!document.hidden && !marqueeHoverPauseRef.current) {
        const segment = el.scrollWidth / copies;
        if (segment > 1) {
          el.scrollLeft += RECENT_CATALOGUE_MARQUEE_SPEED;
          while (el.scrollLeft >= segment - 0.5) {
            el.scrollLeft -= segment;
          }
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [schoolRecentCatalogue.length, recentCatalogueLoop.length]);

  const scrollRecentCatalogue = (direction: -1 | 1) => {
    const el = recentCatalogueScrollRef.current;
    if (!el) return;
    const slide = el.querySelector<HTMLElement>("[data-pw-recent-slide]");
    const gap = 22;
    const step = (slide?.offsetWidth ?? 360) + gap;
    const isRtl = getComputedStyle(el).direction === "rtl";
    const factor = isRtl ? -1 : 1;
    el.scrollBy({
      left: factor * direction * step,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  };

  const displayName = `${user.firstName}`.trim() || user.email;
  const locationLabel = countryToLocationLabel(school.country);

  const greetingKey = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "app.schoolDashboard.greetingMorning" as const;
    if (h < 17) return "app.schoolDashboard.greetingAfternoon" as const;
    return "app.schoolDashboard.greetingEvening" as const;
  }, []);

  const stats = schoolOverviewStats;

  return (
    <div className="space-y-6">
      <div className="pw-top-banner">
        <div className="pw-top-banner__greeting">{t(greetingKey)}</div>
        <div className="pw-top-banner__title-row">
          <span>{t("app.schoolDashboard.welcomeBack", { name: displayName })}</span>
          <UserIcon className="h-[22px] w-[22px] shrink-0" strokeWidth={1.75} aria-hidden />
        </div>
        <div className="pw-top-banner__meta">
          {t("app.schoolDashboard.schoolLine", {
            name: school.name,
            curriculum: school.curriculumType,
            location: locationLabel,
          })}
        </div>
      </div>

      <div id="pw-dash-overview-anchor" className="pw-card pw-dash-overview scroll-mt-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-sm font-semibold text-[var(--pw-text)]">{t("app.schoolDashboard.overviewTitle")}</div>
            <div className="mt-0.5 text-xs text-[var(--pw-text-secondary)]">{t("app.schoolDashboard.overviewSub")}</div>
          </div>
        </div>
        <div className="pw-dash-stat-grid">
          <Link to="/app/rfq" className="pw-dash-stat pw-dash-stat--tl-brand">
            <div className="pw-dash-stat-value">{stats.openRfqs}</div>
            <div className="pw-dash-stat-label">{t("app.schoolDashboard.statOpenRfqs")}</div>
            <div className="pw-dash-stat-hint">{t("app.schoolDashboard.statOpenRfqsHint")}</div>
          </Link>
          <Link to="/app/rfq" className="pw-dash-stat pw-dash-stat--tl-alert">
            <div className="pw-dash-stat-value pw-tone-alert">{stats.quotesAwaiting}</div>
            <div className="pw-dash-stat-label">{t("app.schoolDashboard.statQuotesAwaiting")}</div>
            <div className="pw-dash-stat-hint">{t("app.schoolDashboard.statQuotesAwaitingHint")}</div>
          </Link>
          <Link to="/app/orders" className="pw-dash-stat pw-dash-stat--tl-success">
            <div className="pw-dash-stat-value pw-tone-success">{stats.activeOrders}</div>
            <div className="pw-dash-stat-label">{t("app.schoolDashboard.statActiveOrders")}</div>
            <div className="pw-dash-stat-hint">{t("app.schoolDashboard.statActiveOrdersHint")}</div>
          </Link>
          <Link to="/app/samples" className="pw-dash-stat pw-dash-stat--tl-accent">
            <div className="pw-dash-stat-value pw-tone-accent">{stats.samplesInProgress}</div>
            <div className="pw-dash-stat-label">{t("app.schoolDashboard.statSamples")}</div>
            <div className="pw-dash-stat-hint">{t("app.schoolDashboard.statSamplesHint")}</div>
          </Link>
          <Link to="/app/training" className="pw-dash-stat pw-dash-stat--tl-success">
            <div className="pw-dash-stat-value pw-tone-success">{stats.trainingCompletionPct}%</div>
            <div className="pw-dash-stat-label">{t("app.schoolDashboard.statTraining")}</div>
            <div className="pw-dash-stat-hint">{t("app.schoolDashboard.statTrainingHint")}</div>
          </Link>
          <Link to="/app/support" className="pw-dash-stat pw-dash-stat--tl-muted">
            <div className="pw-dash-stat-value pw-tone-muted">{stats.openSupportTickets}</div>
            <div className="pw-dash-stat-label">{t("app.schoolDashboard.statSupport")}</div>
            <div className="pw-dash-stat-hint">{t("app.schoolDashboard.statSupportHint")}</div>
          </Link>
        </div>
        <div className="pw-dash-shortcuts">
          <span className="self-center pe-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--pw-text-muted)]">
            {t("app.schoolDashboard.shortcutsLabel")}
          </span>
          <Link to="/app/catalogue" className="pw-dash-shortcut">
            <BookOpen {...dashIcon} />
            {t("app.schoolDashboard.shortcutCatalogue")}
          </Link>
          <Link to="/app/rfq" className="pw-dash-shortcut">
            <ClipboardList {...dashIcon} />
            {t("app.schoolDashboard.shortcutRfq")}
          </Link>
          <Link to="/app/wishlist" className="pw-dash-shortcut">
            <Heart {...dashIcon} />
            {t("app.schoolDashboard.shortcutWishlist")}
          </Link>
          <Link to="/app/samples" className="pw-dash-shortcut">
            <Package {...dashIcon} />
            {t("app.schoolDashboard.shortcutSamples")}
          </Link>
          <Link to="/app/training" className="pw-dash-shortcut">
            <GraduationCap {...dashIcon} />
            {t("app.schoolDashboard.shortcutTraining")}
          </Link>
          <Link to="/app/analytics" className="pw-dash-shortcut">
            <BarChart3 {...dashIcon} />
            {t("app.schoolDashboard.shortcutAnalytics")}
          </Link>
          <Link to="/app/support" className="pw-dash-shortcut">
            <LifeBuoy {...dashIcon} />
            {t("app.schoolDashboard.shortcutSupport")}
          </Link>
        </div>
      </div>

      <div className="pw-recent-featured-row">
        <div className="pw-recent-catalogue-panel">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="text-sm font-semibold text-[var(--pw-text)]">{t("app.schoolDashboard.recentCatalogueTitle")}</div>
              <div className="mt-0.5 text-xs text-[var(--pw-text-secondary)]">{t("app.schoolDashboard.recentCatalogueSub")}</div>
            </div>
            <Link to="/app/catalogue" className="pw-btn pw-btn-ghost pw-btn-xs self-start sm:shrink-0">
              {t("app.schoolDashboard.browseAll")}
            </Link>
          </div>
          <div
            className="pw-recent-catalogue-carousel pw-recent-catalogue-carousel--marquee"
            onMouseEnter={() => {
              marqueeHoverPauseRef.current = true;
            }}
            onMouseLeave={() => {
              marqueeHoverPauseRef.current = false;
            }}
          >
            <button
              type="button"
              className="pw-recent-cat-carousel-btn pw-recent-cat-carousel-btn--prev"
              onClick={() => scrollRecentCatalogue(-1)}
              aria-label={t("app.schoolDashboard.recentCatalogueScrollPrev")}
            >
              <ChevronLeft className="h-5 w-5 shrink-0" strokeWidth={2} aria-hidden />
            </button>
            <div
              ref={recentCatalogueScrollRef}
              className="pw-recent-catalogue-track pw-recent-catalogue-track--marquee"
              role="list"
              aria-label={t("app.schoolDashboard.recentCatalogueListLabel")}
            >
              {recentCatalogueLoop.map(({ p, key }) => (
                <div key={key} role="listitem" data-pw-recent-slide>
                  <RecentCatalogueRowCard
                    p={p}
                    country={school.country}
                    t={t}
                    visualIndex={recentCatVisualIndexById[p.id] ?? 0}
                  />
                </div>
              ))}
            </div>
            <button
              type="button"
              className="pw-recent-cat-carousel-btn pw-recent-cat-carousel-btn--next"
              onClick={() => scrollRecentCatalogue(1)}
              aria-label={t("app.schoolDashboard.recentCatalogueScrollNext")}
            >
              <ChevronRight className="h-5 w-5 shrink-0" strokeWidth={2} aria-hidden />
            </button>
          </div>
        </div>

        <aside className="pw-card pw-featured-titles-panel" aria-label={t("app.schoolDashboard.featuredTitle")}>
          <div className="pw-featured-titles-panel__head">
            <div className="pw-featured-titles-panel__title">{t("app.schoolDashboard.featuredTitle")}</div>
            <div className="pw-featured-titles-panel__sub">{t("app.schoolDashboard.featuredSub")}</div>
          </div>
          <FeaturedTitlesTabbedList country={school.country} t={t} />
        </aside>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="flex flex-col gap-5 lg:col-span-2">
          <div className="pw-card">
            <SchoolChecklistAccordion school={school} />
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:col-span-1">
          <div className="pw-am-card">
            <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--pw-text-muted)]">
              {t("app.schoolDashboard.amTitle")}
            </div>
            <div className="mb-3 flex items-center gap-3">
              <div className="pw-am-avatar">{schoolAccountManager.initials}</div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-[var(--pw-text)]">{schoolAccountManager.name}</div>
                <div className="text-[11.5px] text-[var(--pw-text-secondary)]">{schoolAccountManager.roleLine}</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <a href={`https://wa.me/${schoolAccountManager.whatsappE164}`} target="_blank" rel="noreferrer" className="pw-wa-btn">
                <MessageCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
                {t("app.schoolDashboard.amWhatsApp")}
              </a>
              <a href={`mailto:${schoolAccountManager.email}`} className="pw-am-email-btn">
                <Mail className="h-3.5 w-3.5 shrink-0 text-[var(--pw-text-secondary)]" aria-hidden />
                {t("app.schoolDashboard.amEmail")}
              </a>
            </div>
          </div>

          <div className="pw-card flex flex-1 flex-col">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div className="text-sm font-semibold text-[var(--pw-text)]">{t("app.schoolDashboard.latestUpdates")}</div>
              <Link to="/app/announcements" className="pw-btn pw-btn-ghost pw-btn-xs">
                {t("app.schoolDashboard.viewAll")}
              </Link>
            </div>
            {schoolDashboardAnnouncements.map((a) => (
              <div key={a.id} className="pw-ann-row">
                <AnnDot a={a} />
                <div className="min-w-0">
                  <div className="text-[13.5px] font-medium text-[var(--pw-text)]">{t(a.titleKey)}</div>
                  <div className="ann-meta mt-0.5 text-[11.5px] text-[var(--pw-text-muted)]">{t(a.metaKey)}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="pw-card">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div className="text-sm font-semibold text-[var(--pw-text)]">
                {t("app.schoolDashboard.wishlistTitle")}{" "}
                <span className="pw-badge pw-badge-brand ms-1.5">{t("app.schoolDashboard.wishlistBadge", { count: schoolWishlistPreview.itemCount })}</span>
              </div>
              <Link to="/app/wishlist" className="pw-btn pw-btn-ghost pw-btn-xs">
                {t("app.schoolDashboard.viewAll")}
              </Link>
            </div>
            <div className="mb-2.5 text-[13px] text-[var(--pw-text-secondary)]">{t("app.schoolDashboard.wishlistStale", { count: schoolWishlistPreview.staleCount })}</div>
            <Link to="/app/rfq" className="pw-btn pw-btn-primary pw-btn-full inline-flex items-center justify-center gap-1.5">
              {t("app.schoolDashboard.convertAllRfq")}
              <ArrowRight className="h-3.5 w-3.5 shrink-0 opacity-95" aria-hidden />
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="pw-card">
          <div className="mb-4 flex flex-col gap-0.5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="text-sm font-semibold text-[var(--pw-text)]">{t("app.schoolDashboard.pipelineTitle")}</div>
              <div className="text-xs text-[var(--pw-text-secondary)]">{t("app.schoolDashboard.pipelineSub")}</div>
            </div>
            <Link to="/app/rfq" className="pw-btn pw-btn-ghost pw-btn-xs mt-1 inline-flex items-center gap-1 sm:mt-0">
              {t("app.schoolDashboard.pipelineCta")}
              <ArrowRight className="h-3 w-3 shrink-0 opacity-80" aria-hidden />
            </Link>
          </div>
          <div className="pw-pipeline-grid">
            {schoolRfqPipeline.map((stage) => (
              <div key={stage.id} className={cn("pw-pipeline-cell", pipelineToneClass(stage.tone))}>
                <div className="pw-pipeline-count">{stage.count}</div>
                <div className="pw-pipeline-label">{t(stage.labelKey)}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="pw-card flex flex-col">
          <div className="mb-1 flex items-center justify-between gap-2">
            <div className="text-sm font-semibold text-[var(--pw-text)]">{t("app.schoolDashboard.activityTitle")}</div>
            <Link to="/app/analytics" className="pw-btn pw-btn-ghost pw-btn-xs">
              {t("app.schoolDashboard.activityAnalytics")}
            </Link>
          </div>
          <div className="text-xs text-[var(--pw-text-secondary)]">{t("app.schoolDashboard.activitySub")}</div>
          <div className="mt-2">
            {schoolRecentActivity.map((row) => (
              <Link key={row.id} to={row.to} className="pw-activity-row">
                <div className="min-w-0">
                  <div className="text-[13.5px] font-medium text-[var(--pw-text)]">{t(row.titleKey)}</div>
                  <div className="mt-0.5 text-[11.5px] text-[var(--pw-text-muted)]">{t(row.metaKey)}</div>
                </div>
                <ChevronRight className="pw-activity-chevron h-4 w-4 shrink-0 text-[var(--pw-text-muted)]" aria-hidden />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <section>
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <Sparkles className="h-[18px] w-[18px] shrink-0 text-[var(--pw-brand)]" strokeWidth={1.75} aria-hidden />
              <div className="text-[15px] font-bold tracking-tight text-[var(--pw-brand)]">
                {t("app.schoolDashboard.recommendedTitle")}
              </div>
              <span className="pw-ai-pill">{t("app.schoolDashboard.aiBadge")}</span>
            </div>
            <div className="max-w-2xl text-[12.5px] leading-relaxed text-[var(--pw-text-secondary)]">
              {t("app.schoolDashboard.recommendedSub")}
            </div>
          </div>
          <Link to="/app/catalogue" className="pw-btn pw-btn-outline pw-btn-sm self-start">
            {t("app.schoolDashboard.browseAll")}
          </Link>
        </div>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-stretch">
          <RecommendedShareEarnCard school={school} />
          <div className="min-w-0 flex-1">
            <div className="pw-carousel pw-carousel--reco">{recommendedForYou.map((p) => (
              <ProductCarouselCard key={p.id} p={p} country={school.country} t={t} />
            ))}</div>
          </div>
        </div>
      </section>

      <div className="pw-curriculum-cta">
        <div className="flex shrink-0 items-center justify-center text-[#fff]" aria-hidden>
          <Map className="h-10 w-10 opacity-95" strokeWidth={1.5} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[15px] font-semibold">{t("app.schoolDashboard.curriculumMapTitle")}</div>
          <p className="mt-1 text-[13px] opacity-90">{t("app.schoolDashboard.curriculumMapSub")}</p>
        </div>
        <Link to="/app/curriculum-mapping" className="pw-btn pw-btn-accent inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap">
          {t("app.schoolDashboard.startMapping")}
          <ArrowRight className="h-3.5 w-3.5 shrink-0 opacity-95" aria-hidden />
        </Link>
      </div>

      <div className="pw-card">
        <div className="mb-3.5 text-sm font-semibold text-[var(--pw-text)]">{t("app.schoolDashboard.publishersTitle")}</div>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-5">
          {publisherQuickAccess.map((pub) => (
            <Link
              key={pub.id}
              to="/app/catalogue"
              className={cn("pw-pub-grid-item", pub.highlight && "pw-highlight")}
            >
              <div className="mb-1.5 flex justify-center">
                <PublisherQuickIcon publisherId={pub.id} />
              </div>
              <div className={cn("text-[11.5px] font-medium leading-tight text-[var(--pw-text-secondary)]", pub.highlight && "font-semibold text-[var(--pw-brand)]")}>
                {t(pub.labelKey)}
              </div>
              {pub.ourBrand ? <div className="mt-0.5 text-[10px] font-medium text-[var(--pw-brand)] opacity-70">{t("app.schoolDashboard.ourBrand")}</div> : null}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
