import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PwPageHeader } from "../../panworld/PwPageHeader";
import { cn } from "../../utils/cn";

type Tab = "upcoming" | "recorded" | "kodeit";

export function WebinarsPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>("upcoming");

  return (
    <div>
      <PwPageHeader title={t("nav.pdWebinars")} subtitle={t("mvpPages.webinars.subtitle")} />

      <div className="pw-tabs mb-5 w-fit">
        <button type="button" className={cn("pw-tab", tab === "upcoming" && "pw-active")} onClick={() => setTab("upcoming")}>
          {t("mvpPages.webinars.tabUpcoming")}
        </button>
        <button type="button" className={cn("pw-tab", tab === "recorded" && "pw-active")} onClick={() => setTab("recorded")}>
          {t("mvpPages.webinars.tabRecorded")}
        </button>
        <button type="button" className={cn("pw-tab", tab === "kodeit" && "pw-active")} onClick={() => setTab("kodeit")}>
          {t("mvpPages.webinars.tabKodeit")}
        </button>
      </div>

      {tab === "upcoming" ? (
        <>
          <div className="pw-grid-2 mb-8 gap-4">
            <div className="pw-card border-s-4 border-[#E8912D]">
              <div className="mb-2 flex flex-wrap items-center gap-1.5">
                <span className="pw-badge pw-badge-accent">{t("mvpPages.webinars.live")}</span>
                <span className="text-xs text-[#9A9890]">14 May 2026 · 10:00 AM GST</span>
              </div>
              <div className="mb-1 text-[15px] font-semibold text-[#1A1917]">Inspire Science — Hands-on Labs in the Classroom</div>
              <div className="mb-3 text-[13px] text-[#5C5A55]">McGraw Hill · Presenter: Dr. Sarah Chen · 45 min + Q&A</div>
              <div className="flex flex-wrap gap-2">
                <button type="button" className="pw-btn pw-btn-primary pw-btn-sm">
                  {t("mvpPages.webinars.register")}
                </button>
                <button type="button" className="pw-btn pw-btn-outline pw-btn-sm">
                  {t("mvpPages.webinars.addCalendar")}
                </button>
              </div>
            </div>
            <div className="pw-card border-s-4 border-[#7B1FA2]">
              <div className="mb-2 flex flex-wrap items-center gap-1.5">
                <span className="pw-badge pw-badge-new">Kodeit</span>
                <span className="text-xs text-[#9A9890]">21 May 2026 · 2:00 PM GST</span>
              </div>
              <div className="mb-1 text-[15px] font-semibold text-[#1A1917]">Differentiated Instruction — Workshop Series Part 1</div>
              <div className="mb-3 text-[13px] text-[#5C5A55]">Kodeit Academy · Presenter: Lena Abdallah · 60 min</div>
              <div className="flex flex-wrap gap-2">
                <button type="button" className="pw-btn pw-btn-primary pw-btn-sm">
                  {t("mvpPages.webinars.register")}
                </button>
                <button type="button" className="pw-btn pw-btn-outline pw-btn-sm">
                  {t("mvpPages.webinars.addCalendar")}
                </button>
              </div>
            </div>
            <div className="pw-card border-s-4 border-[#0A3D62]">
              <div className="mb-2 flex flex-wrap items-center gap-1.5">
                <span className="pw-badge pw-badge-brand">StudySync</span>
                <span className="text-xs text-[#9A9890]">28 May 2026 · 11:00 AM GST</span>
              </div>
              <div className="mb-1 text-[15px] font-semibold text-[#1A1917]">StudySync — Arabic UI Walkthrough for Teachers</div>
              <div className="mb-3 text-[13px] text-[#5C5A55]">StudySync · Bilingual session · 40 min</div>
              <button type="button" className="pw-btn pw-btn-primary pw-btn-sm">
                {t("mvpPages.webinars.register")}
              </button>
            </div>
          </div>

          <div className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-[#5C5A55]">{t("mvpPages.webinars.kodeitPaidTitle")}</div>
          <div className="pw-grid-3">
            <KodeitCourse
              highlight
              title="Differentiated Instruction in the American Curriculum Classroom"
              meta="7 modules · ~7 hours · Certificate included"
              price="AED 350"
              purple
              enrolLabel={t("mvpPages.webinars.enrol")}
            />
            <KodeitCourse
              title="Digital Tools Integration for Teachers"
              meta="8 modules · ~8 hours · Certificate included"
              price="AED 300"
              hint={t("mvpPages.webinars.freeLicenceHint")}
              enrolLabel={t("mvpPages.webinars.enrol")}
            />
            <KodeitCourse
              title="Assessment for Learning & Data-Driven Teaching"
              meta="7 modules · ~7 hours · Certificate included"
              price="AED 350"
              enrolLabel={t("mvpPages.webinars.enrol")}
            />
          </div>
        </>
      ) : null}

      {tab === "recorded" ? (
        <div className="pw-mapping-placeholder max-w-lg">
          <p className="mb-4 text-[13.5px] text-[#5C5A55]">{t("mvpPages.webinars.recordedPlaceholder")}</p>
          <button type="button" className="pw-btn pw-btn-primary">
            {t("mvpPages.webinars.browseRecorded")}
          </button>
        </div>
      ) : null}

      {tab === "kodeit" ? (
        <>
          <div className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-[#5C5A55]">{t("mvpPages.webinars.kodeitPaidTitle")}</div>
          <div className="pw-grid-3">
            <KodeitCourse
              highlight
              title="Differentiated Instruction in the American Curriculum Classroom"
              meta="7 modules · ~7 hours · Certificate included"
              price="AED 350"
              purple
              enrolLabel={t("mvpPages.webinars.enrol")}
            />
            <KodeitCourse
              title="Digital Tools Integration for Teachers"
              meta="8 modules · ~8 hours · Certificate included"
              price="AED 300"
              hint={t("mvpPages.webinars.freeLicenceHint")}
              enrolLabel={t("mvpPages.webinars.enrol")}
            />
            <KodeitCourse
              title="Assessment for Learning & Data-Driven Teaching"
              meta="7 modules · ~7 hours · Certificate included"
              price="AED 350"
              enrolLabel={t("mvpPages.webinars.enrol")}
            />
          </div>
        </>
      ) : null}
    </div>
  );
}

function KodeitCourse({
  title,
  meta,
  price,
  hint,
  highlight,
  purple,
  enrolLabel,
}: {
  title: string;
  meta: string;
  price: string;
  hint?: string;
  highlight?: boolean;
  purple?: boolean;
  enrolLabel: string;
}) {
  const { t } = useTranslation();
  return (
    <div className={cn("pw-card", (highlight || purple) && "border-2 border-[#7B1FA2]")}>
      {highlight ? (
        <div className="mb-2">
          <span className="pw-badge pw-badge-new">{t("mvpPages.webinars.mostPopular")}</span>
        </div>
      ) : null}
      <div className="mb-1 text-[15px] font-semibold text-[#1A1917]">{title}</div>
      <div className="mb-2.5 text-[12.5px] text-[#5C5A55]">{meta}</div>
      {hint ? (
        <div className="mb-3 flex flex-wrap items-baseline gap-2">
          <span className="text-lg font-bold text-[#0A3D62]">{price}</span>
          <span className="text-[11px] font-medium text-[#1E8449]">{hint}</span>
        </div>
      ) : (
        <div className={cn("mb-3 text-lg font-bold", purple ? "text-[#7B1FA2]" : "text-[#0A3D62]")}>{price}</div>
      )}
      <button
        type="button"
        className={cn(
          "pw-btn pw-btn-sm pw-btn-full",
          purple ? "border-0 bg-[#7B1FA2] text-white hover:opacity-95" : "pw-btn-primary",
        )}
      >
        {enrolLabel}
      </button>
    </div>
  );
}
