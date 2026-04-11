import type { CSSProperties, ReactNode } from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PwPageHeader } from "../../panworld/PwPageHeader";
import { cn } from "../../utils/cn";

const FILTERS = [
  { id: "all", key: "mvpPages.announcements.filterAll" },
  { id: "publisher", key: "mvpPages.announcements.filterPublisher" },
  { id: "titles", key: "mvpPages.announcements.filterTitles" },
  { id: "promo", key: "mvpPages.announcements.filterPromo" },
  { id: "events", key: "mvpPages.announcements.filterEvents" },
] as const;

export function AnnouncementsPage() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [digest, setDigest] = useState(true);

  return (
    <div>
      <PwPageHeader
        title={t("mvpPages.announcements.title")}
        subtitle={t("mvpPages.announcements.subtitle")}
        right={
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-[#5C5A55]">{t("mvpPages.announcements.weeklyDigest")}</span>
            <button
              type="button"
              role="switch"
              aria-checked={digest}
              className={cn("relative h-[22px] w-10 rounded-full transition-colors", digest ? "bg-[#0A3D62]" : "bg-[#E2E0D9]")}
              onClick={() => setDigest((d) => !d)}
            >
              <span
                className={cn(
                  "absolute top-0.5 h-[18px] w-[18px] rounded-full bg-white transition-all",
                  digest ? "end-0.5" : "start-0.5",
                )}
              />
            </button>
          </div>
        }
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={cn("pw-btn pw-btn-sm", filter === f.id ? "pw-btn-primary" : "pw-btn-outline")}
            onClick={() => setFilter(f.id)}
          >
            {t(f.key)}
          </button>
        ))}
      </div>

      <div
        className="mb-5 rounded-2xl p-5 text-white"
        style={{ background: "linear-gradient(135deg,#4A148C,#7B1FA2)" }}
      >
        <div className="mb-1.5 text-[10px] font-medium uppercase tracking-wider opacity-60">{t("mvpPages.announcements.pinnedMeta")}</div>
        <div className="mb-1.5 font-serif text-lg">{t("mvpPages.announcements.pinnedTitle")}</div>
        <p className="mb-3.5 text-[13.5px] opacity-90">{t("mvpPages.announcements.pinnedBody")}</p>
        <Link to="/app/kits" className="pw-btn pw-btn-sm border border-white/30 bg-white/20 text-white no-underline hover:bg-white/30">
          {t("mvpPages.announcements.exploreKits")}
        </Link>
      </div>

      <div className="pw-card divide-y divide-[#E2E0D9] p-0">
        <AnnRow
          badge="New Titles"
          badgeClass="pw-badge-accent"
          date="5 Apr 2026"
          title="Reveal Math 2025 Edition — Now Available"
          body="McGraw Hill's updated Reveal Math series includes new UAE scope & sequence alignment and updated digital tools on ConnectED."
          action={
            <Link to="/app/catalogue" className="pw-btn pw-btn-outline pw-btn-sm shrink-0 no-underline">
              View in Catalogue
            </Link>
          }
        />
        <AnnRow
          badge="Promotion"
          badgeClass="pw-badge-success"
          date="1 Apr 2026"
          title="Achieve3000 Early Bird — 15% off until 31 May 2026"
          body="Schools ordering Achieve3000 licences before 31 May receive a 15% discount on Year 1 licences. Submit your RFQ to lock in the price."
          action={
            <Link to="/app/rfq" className="pw-btn pw-btn-accent pw-btn-sm shrink-0 no-underline">
              Submit RFQ
            </Link>
          }
        />
        <AnnRow
          badge="Publisher News"
          badgeClass="pw-badge-brand"
          date="28 Mar 2026"
          title="StudySync adds Arabic language support for UI"
          body="StudySync's platform now offers an Arabic interface option for students and teachers in the GCC region — rolling out to all schools in April 2026."
          action={
            <button type="button" className="pw-btn pw-btn-outline pw-btn-sm shrink-0">
              Request Demo
            </button>
          }
        />
        <AnnRow
          badge="Events"
          badgeClass="rounded-full px-2 py-0.5 text-[11px] font-semibold"
          badgeStyle={{ background: "#FFF3E0", color: "#8B4513" }}
          date="20 Mar 2026"
          title="Panworld Education Forum — Dubai · 14 May 2026"
          body="Annual partner forum at Atlantis The Palm. Publisher presentations, curriculum workshops, and networking dinner. All Panworld school partners invited."
          action={
            <button type="button" className="pw-btn pw-btn-outline pw-btn-sm shrink-0">
              Register →
            </button>
          }
        />
      </div>
    </div>
  );
}

function AnnRow({
  badge,
  badgeClass,
  badgeStyle,
  date,
  title,
  body,
  action,
}: {
  badge: string;
  badgeClass?: string;
  badgeStyle?: CSSProperties;
  date: string;
  title: string;
  body: string;
  action: ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between gap-3 px-4 py-4 sm:flex-row sm:items-start">
      <div className="min-w-0">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <span className={cn("pw-badge", badgeClass)} style={badgeStyle}>
            {badge}
          </span>
          <span className="text-xs text-[#9A9890]">{date}</span>
        </div>
        <div className="mb-1 text-[15px] font-semibold text-[#1A1917]">{title}</div>
        <div className="text-[13.5px] text-[#5C5A55]">{body}</div>
      </div>
      {action}
    </div>
  );
}
