import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PwPageHeader } from "../../panworld/PwPageHeader";
import { pubClassFromPublisher } from "../../../data/school/mvpUi";
import { cn } from "../../utils/cn";

const ROWS: {
  id: string;
  title: string;
  sub: string;
  emoji: string;
  pub: string;
  tags: ReactNode;
}[] = [
  {
    id: "w1",
    title: "Inspire Science G1–G8",
    sub: "McGraw Hill · Blended · AED 89/student",
    emoji: "📗",
    pub: "McGraw Hill",
    tags: (
      <>
        <span className="pw-tag">Science</span>
        <span className="pw-tag">G1–G8</span>
        <span className="pw-badge pw-badge-accent text-[10.5px]">Added 32 days ago</span>
      </>
    ),
  },
  {
    id: "w2",
    title: "Achieve3000 Literacy Platform",
    sub: "Achieve3000 · Digital · AED 145/licence",
    emoji: "📈",
    pub: "Achieve3000",
    tags: (
      <>
        <span className="pw-tag">ELA</span>
        <span className="pw-tag">G1–G12</span>
        <span className="pw-badge pw-badge-accent text-[10.5px]">Added 31 days ago</span>
      </>
    ),
  },
  {
    id: "w3",
    title: "StudySync ELA G6–G12",
    sub: "StudySync · Digital · AED 120/licence",
    emoji: "💬",
    pub: "StudySync",
    tags: (
      <>
        <span className="pw-tag">ELA</span>
        <span className="pw-tag">G6–G12</span>
        <span className="pw-tag">12 days ago</span>
      </>
    ),
  },
  {
    id: "w4",
    title: "Kodeit Social Sciences G1–G12",
    sub: "Kodeit Global · Print · AED 75/student",
    emoji: "🌍",
    pub: "Kodeit Global",
    tags: (
      <>
        <span className="pw-tag">Social Sciences</span>
        <span className="pw-badge pw-badge-brand text-[10px]">Our Brand</span>
        <span className="pw-tag">8 days ago</span>
      </>
    ),
  },
  {
    id: "w5",
    title: "Jolly Phonics KG1–KG2 Kit",
    sub: "Jolly Phonics · Print Kit · AED 320/classroom",
    emoji: "🔤",
    pub: "Jolly Phonics",
    tags: (
      <>
        <span className="pw-tag">Phonics</span>
        <span className="pw-tag">KG</span>
        <span className="pw-badge pw-badge-new text-[10px]">New Partner</span>
        <span className="pw-tag">2 days ago</span>
      </>
    ),
  },
];

export function WishlistPage() {
  const { t } = useTranslation();

  return (
    <div>
      <PwPageHeader
        title={t("nav.wishlist")}
        subtitle={t("mvpPages.wishlist.subtitle")}
        right={
          <>
            <button type="button" className="pw-btn pw-btn-outline">
              {t("mvpPages.wishlist.shareProcurement")}
            </button>
            <Link to="/app/rfq" className="pw-btn pw-btn-accent no-underline">
              {t("mvpPages.wishlist.convertAll")}
            </Link>
          </>
        }
      />

      <div
        className="mb-5 flex flex-col gap-3 rounded-[10px] border border-[#F0C080] bg-[#FDEBD0] px-4 py-3.5 md:flex-row md:items-center"
      >
        <span className="text-lg">⏰</span>
        <div className="min-w-0 flex-1 text-[13.5px]">
          <span className="font-medium text-[#7D4E10]">{t("mvpPages.wishlist.nudge")}</span>{" "}
          <span className="text-[#8B5A1A]">{t("mvpPages.wishlist.nudge2")}</span>
        </div>
        <button type="button" className="pw-btn pw-btn-outline pw-btn-xs shrink-0 border-[#F0C080]">
          {t("mvpPages.wishlist.dismiss")}
        </button>
      </div>

      <div className="pw-card">
        {ROWS.map((r, i) => (
          <div key={r.id} className="pw-wishlist-row">
            <div className={cn("pw-wishlist-img", pubClassFromPublisher(r.pub))}>{r.emoji}</div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-[#1A1917]">{r.title}</div>
              <div className="mb-1.5 text-[12.5px] text-[#5C5A55]">{r.sub}</div>
              <div className="flex flex-wrap gap-1.5">{r.tags}</div>
            </div>
            <div className="flex shrink-0 gap-1.5">
              <Link to="/app/rfq" className="pw-btn pw-btn-primary pw-btn-xs inline-flex items-center gap-1 no-underline">
                <Plus className="h-3.5 w-3.5 shrink-0" aria-hidden />
                {t("app.schoolDashboard.rfqCta")}
              </Link>
              {i === 4 ? (
                <Link to="/app/kits" className="pw-btn pw-btn-outline pw-btn-xs no-underline">
                  {t("mvpPages.wishlist.view")}
                </Link>
              ) : (
                <Link to="/app/catalogue" className="pw-btn pw-btn-outline pw-btn-xs no-underline">
                  {t("mvpPages.wishlist.view")}
                </Link>
              )}
              <button type="button" className="pw-btn pw-btn-ghost pw-btn-xs">
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
