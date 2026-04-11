import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { PwPageHeader } from "../../panworld/PwPageHeader";
import { cn } from "../../utils/cn";

type PubTab = "mcgraw" | "kodeit" | "studysync" | "achieve" | "powerschool";

type VideoRow = {
  id: string;
  pub: PubTab;
  thumbClass: string;
  thumbBg?: string;
  emoji: string;
  title: string;
  meta: string;
  pct: number;
  done: number;
  total: string;
  accent?: "brand" | "accent" | "success";
  doneLabel?: "done" | "percent" | "notStarted";
  cert?: boolean;
};

const VIDEOS: VideoRow[] = [
  {
    id: "v1",
    pub: "mcgraw",
    thumbClass: "pub-mcgraw",
    emoji: "📗",
    title: "Inspire Science — G1–G4",
    meta: "McGraw Hill · 8 videos · 2.5 hrs",
    pct: 87,
    done: 7,
    total: "8",
    accent: "success",
  },
  {
    id: "v2",
    pub: "mcgraw",
    thumbClass: "pub-mcgraw",
    emoji: "📐",
    title: "Reveal Math 2025 — G1–G6",
    meta: "McGraw Hill · 10 videos · 3.2 hrs",
    pct: 60,
    done: 6,
    total: "10",
    accent: "brand",
  },
  {
    id: "v3",
    pub: "mcgraw",
    thumbClass: "pub-mcgraw",
    emoji: "✏️",
    title: "Wonders ELA — KG–G3",
    meta: "McGraw Hill · 6 videos · 1.8 hrs",
    pct: 33,
    done: 2,
    total: "6",
    accent: "accent",
  },
  {
    id: "v4",
    pub: "mcgraw",
    thumbClass: "pub-mcgraw",
    thumbBg: "#E8F5E9",
    emoji: "🖥",
    title: "ConnectED Platform Setup",
    meta: "McGraw Hill · 4 videos · 55 min",
    pct: 100,
    done: 4,
    total: "4",
    accent: "success",
    doneLabel: "done",
    cert: true,
  },
  {
    id: "v5",
    pub: "mcgraw",
    thumbClass: "pub-mcgraw",
    thumbBg: "#FFF8E1",
    emoji: "📜",
    title: "Treasures ELA — G4–G6",
    meta: "McGraw Hill · 5 videos · 1.4 hrs",
    pct: 0,
    done: 0,
    total: "5",
    doneLabel: "notStarted",
  },
];

const PUB_KEYS: { id: PubTab; labelKey: string }[] = [
  { id: "mcgraw", labelKey: "mvpPages.training.pubMcgraw" },
  { id: "kodeit", labelKey: "mvpPages.training.pubKodeit" },
  { id: "studysync", labelKey: "mvpPages.training.pubStudysync" },
  { id: "achieve", labelKey: "mvpPages.training.pubAchieve" },
  { id: "powerschool", labelKey: "mvpPages.training.pubPowerschool" },
];

export function TrainingPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<PubTab>("mcgraw");

  const rows = useMemo(() => VIDEOS.filter((v) => v.pub === tab), [tab]);
  const overall = 68;

  return (
    <div>
      <PwPageHeader
        title={t("nav.productTraining")}
        subtitle={t("mvpPages.training.subtitle")}
        right={
          <div className="pw-stat-card pw-stat-inline">
            <span className="text-base">📊</span>
            <div>
              <div className="text-[11px] text-[#5C5A55]">{t("mvpPages.training.myProgress")}</div>
              <div className="text-base font-bold text-[#0A3D62]">{overall}%</div>
            </div>
          </div>
        }
      />

      <div className="pw-tabs mb-5 w-fit">
        {PUB_KEYS.map((p) => (
          <button
            key={p.id}
            type="button"
            className={cn("pw-tab", tab === p.id && "pw-active")}
            onClick={() => setTab(p.id)}
          >
            {t(p.labelKey)}
          </button>
        ))}
      </div>

      {rows.length === 0 ? (
        <div className="pw-mapping-placeholder text-[13.5px] text-[#5C5A55]">{t("mvpPages.training.moreVideosSoon")}</div>
      ) : (
        <div className="pw-grid-3">
          {rows.map((v) => (
            <div key={v.id} className="cursor-pointer" role="presentation">
              <div className="pw-video-card">
                <div
                  className={cn("pw-video-thumb", v.thumbClass)}
                  style={v.thumbBg ? { background: v.thumbBg } : undefined}
                >
                  {v.emoji}
                  <span className="pw-video-play">▶</span>
                </div>
                <div className="pw-video-body">
                  <div className="mb-0.5 text-sm font-semibold text-[#1A1917]">{v.title}</div>
                  <div className="mb-2 text-xs text-[#5C5A55]">{v.meta}</div>
                  <div className="pw-progress-bar mb-2">
                    <div
                      className={cn(
                        "pw-progress-fill",
                        v.accent === "accent" && "pw-fill-accent",
                        v.accent === "success" && "pw-fill-success",
                      )}
                      style={{ width: `${v.pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-[#5C5A55]">
                    <span>
                      {v.doneLabel === "notStarted"
                        ? t("mvpPages.training.notStarted")
                        : t("mvpPages.training.videosComplete", { done: v.done, total: v.total })}
                    </span>
                    <span
                      className={cn(
                        "font-semibold",
                        v.doneLabel === "done" && "text-[#1E8449]",
                        v.accent === "accent" && v.doneLabel !== "done" && "text-[#E8912D]",
                        v.accent === "success" && v.doneLabel !== "done" && "text-[#1E8449]",
                        v.accent === "brand" && "text-[#0A3D62]",
                      )}
                    >
                      {v.doneLabel === "done"
                        ? t("mvpPages.training.done")
                        : v.pct === 0
                          ? "0%"
                          : `${v.pct}%`}
                    </span>
                  </div>
                  {v.cert ? (
                    <div className="mt-1.5">
                      <span className="pw-badge pw-badge-success text-[10px]">{t("mvpPages.training.certificateEarned")}</span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
