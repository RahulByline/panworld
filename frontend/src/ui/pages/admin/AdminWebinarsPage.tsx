import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Clock, Library, Users, Video } from "lucide-react";
import { AdminPageHeader } from "../../admin/components/AdminPageHeader";
import { AdminStatCard } from "../../admin/components/AdminStatCard";
import { Button } from "../../components/Button";
import { AdminModal } from "../../admin/components/AdminModal";
import { webinarSummary, webinarsPast, webinarsUpcoming } from "../../../data/admin/webinarsCerts";
import { useAdminToast } from "../../admin/hooks/useAdminToast";
import { cn } from "../../utils/cn";

const PUBLISHERS = ["McGraw Hill", "Kodeit Global", "StudySync", "Oxford", "Jolly Phonics", "Panworld (General)"] as const;
const LANGUAGES = ["English", "Arabic", "English + Arabic"] as const;

export function AdminWebinarsPage() {
  const { t } = useTranslation();
  const { show, Toast } = useAdminToast();
  const [tab, setTab] = useState<"up" | "past">("up");
  const [schedOpen, setSchedOpen] = useState(false);
  const [waReminder, setWaReminder] = useState(true);
  const [autoCert, setAutoCert] = useState(true);

  const inp = "w-full rounded-lg border border-[#E2E0D9] bg-white px-3 py-2 text-sm outline-none focus:border-[#0A3D62]";
  const lbl = "mb-1 block text-[11px] font-semibold uppercase tracking-wide text-[#5C5A55]";
  const req = <span className="text-[#C0392B]"> *</span>;
  const list = tab === "up" ? webinarsUpcoming : webinarsPast;

  return (
    <div className="font-sans">
      <Toast />
      <AdminPageHeader
        title={t("admin.pages.webinars.title")}
        subtitle={t("admin.pages.webinars.subtitle")}
        actions={
          <Button type="button" className="bg-[#0A3D62] text-white hover:bg-[#071E36]" onClick={() => setSchedOpen(true)}>
            {t("admin.pages.webinars.schedule")}
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        <AdminStatCard
          label={t("admin.pages.webinars.statUpcoming")}
          value={webinarSummary.upcomingCount}
          valueClassName="text-[#0A3D62]"
        />
        <AdminStatCard
          label={t("admin.pages.webinars.statRegistrations")}
          value={webinarSummary.registeredTotal}
          valueClassName="text-[#1E8449]"
        />
        <AdminStatCard
          label={t("admin.pages.webinars.statPastRecorded")}
          value={webinarSummary.pastRecorded}
          sub={t("admin.pages.webinars.tabPast")}
        />
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setTab("up")}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
            tab === "up" ? "border-[#0A3D62] bg-[#0A3D62] text-white shadow-sm" : "border-[#E2E0D9] bg-white hover:bg-[#FAFAF8]",
          )}
        >
          <Video className="size-4 opacity-90" aria-hidden />
          {t("admin.pages.webinars.tabUp")}
        </button>
        <button
          type="button"
          onClick={() => setTab("past")}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
            tab === "past" ? "border-[#0A3D62] bg-[#0A3D62] text-white shadow-sm" : "border-[#E2E0D9] bg-white hover:bg-[#FAFAF8]",
          )}
        >
          <Library className="size-4 opacity-90" aria-hidden />
          {t("admin.pages.webinars.tabPast")}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {list.map((w) => {
          const pct = Math.min(100, Math.round((w.registrations / Math.max(1, w.maxSeats)) * 100));
          return (
            <article
              key={w.id}
              className="flex flex-col rounded-2xl border border-[#E2E0D9] bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-[#E8912D]">{w.host}</div>
                  <h3 className="mt-1 text-lg font-semibold leading-snug text-[#0A3D62]">{w.title}</h3>
                </div>
                <div
                  className={cn(
                    "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
                    w.status === "Upcoming" ? "bg-[#E8F4FD] text-[#0A3D62]" : "bg-[#E8F6EF] text-[#1E8449]",
                  )}
                >
                  {w.status === "Upcoming" ? t("admin.pages.webinars.badgeUpcoming") : t("admin.pages.webinars.badgeCompleted")}
                </div>
              </div>

              <p className="mt-2 flex items-center gap-1.5 text-sm text-[#5C5A55]">
                <Clock className="size-3.5 shrink-0 text-[#9A9890]" aria-hidden />
                {w.startsAt}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#5C5A55]">
                <span className="inline-flex items-center gap-1">
                  <Users className="size-3.5 text-[#9A9890]" aria-hidden />
                  {t("admin.pages.webinars.registrations")}: <strong className="font-semibold text-[#1A1917]">{w.registrations}</strong>
                </span>
                <span>
                  {t("admin.pages.webinars.duration")}:{" "}
                  <strong className="font-semibold text-[#1A1917]">{w.duration}</strong>
                </span>
              </div>

              <div className="mt-3">
                <div className="mb-1 flex justify-between text-xs text-[#5C5A55]">
                  <span>{t("admin.pages.webinars.capacity")}</span>
                  <span className="font-medium text-[#1A1917]">
                    {w.registrations}/{w.maxSeats}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#ECEAE4]">
                  <div
                    className={cn("h-full rounded-full transition-all", pct >= 90 ? "bg-[#E8912D]" : "bg-[#0A3D62]")}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2 border-t border-[#ECEAE4] pt-4">
                {w.status === "Upcoming" ? (
                  <Button type="button" variant="secondary" size="sm" onClick={() => show(t("admin.pages.webinars.editSoon"))}>
                    {t("common.edit")}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    className="bg-[#0A3D62] text-white hover:bg-[#071E36]"
                    size="sm"
                    onClick={() => show(t("admin.pages.webinars.toastWatch"))}
                  >
                    {t("admin.pages.webinars.watchRecording")}
                  </Button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <AdminModal
        open={schedOpen}
        onClose={() => setSchedOpen(false)}
        title={t("admin.pages.webinars.modalTitlePd")}
        wide
        footer={
          <div className="flex w-full flex-wrap items-center justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setSchedOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                show(t("admin.pages.webinars.toastDraftSaved"));
                setSchedOpen(false);
              }}
            >
              {t("admin.pages.webinars.saveDraft")}
            </Button>
            <Button
              type="button"
              className="bg-[#0A3D62] text-white hover:bg-[#071E36]"
              onClick={() => {
                show(t("admin.pages.webinars.toastPublishedFull"));
                setSchedOpen(false);
              }}
            >
              {t("admin.pages.webinars.schedulePublish")}
            </Button>
          </div>
        }
      >
        <div>
          <label className={lbl}>
            {t("admin.pages.webinars.fieldTitleEn")}
            {req}
          </label>
          <input className={inp} placeholder={t("admin.pages.webinars.fieldTitleEnPh")} />
        </div>
        <div className="mt-3">
          <label className={lbl}>{t("admin.pages.webinars.fieldTitleAr")}</label>
          <input className={inp} dir="rtl" placeholder={t("admin.pages.webinars.fieldTitleArPh")} />
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className={lbl}>{t("admin.pages.webinars.fieldPublisher")}</label>
            <select className={inp} defaultValue={PUBLISHERS[0]}>
              {PUBLISHERS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={lbl}>{t("admin.pages.webinars.fieldLanguage")}</label>
            <select className={inp} defaultValue={LANGUAGES[0]}>
              {LANGUAGES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className={lbl}>
              {t("admin.pages.webinars.fieldWhen")}
              {req}
            </label>
            <input className={inp} type="datetime-local" />
          </div>
          <div>
            <label className={lbl}>{t("admin.pages.webinars.fieldDuration")}</label>
            <input className={inp} type="number" min={15} step={5} defaultValue={60} />
          </div>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className={lbl}>{t("admin.pages.webinars.fieldAttendanceCap")}</label>
            <input className={inp} type="number" min={1} placeholder={t("admin.pages.webinars.fieldAttendanceCapPh")} />
          </div>
          <div>
            <label className={lbl}>{t("admin.pages.webinars.fieldLink")}</label>
            <input className={inp} placeholder="https://zoom.us/..." />
          </div>
        </div>
        <div className="mt-3">
          <label className={lbl}>{t("admin.pages.webinars.fieldDescription")}</label>
          <textarea className={`${inp} min-h-[88px]`} placeholder={t("admin.pages.webinars.fieldDescriptionPh")} />
        </div>
        <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-[#5C5A55]">
          <input type="checkbox" className="rounded border-[#E2E0D9] accent-[#0A3D62]" checked={waReminder} onChange={(e) => setWaReminder(e.target.checked)} />
          {t("admin.pages.webinars.toggleWaReminder")}
        </label>
        <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-[#5C5A55]">
          <input type="checkbox" className="rounded border-[#E2E0D9] accent-[#0A3D62]" checked={autoCert} onChange={(e) => setAutoCert(e.target.checked)} />
          {t("admin.pages.webinars.toggleCert")}
        </label>
      </AdminModal>
    </div>
  );
}
