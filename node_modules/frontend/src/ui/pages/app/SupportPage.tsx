import { useTranslation } from "react-i18next";
import { PwPageHeader } from "../../panworld/PwPageHeader";

const TICKETS: { id: string; title: string; sub: string; status: "open" | "progress" | "resolved" }[] = [
  {
    id: "#TK-0124",
    title: "ConnectED login error for G3 Science class",
    sub: "Platform: ConnectED · Submitted 6 Apr 2026",
    status: "open",
  },
  {
    id: "#TK-0119",
    title: "StudySync student roster not syncing",
    sub: "Platform: StudySync · Submitted 2 Apr 2026",
    status: "progress",
  },
  {
    id: "#TK-0098",
    title: "Achieve3000 Lexile levels not displaying",
    sub: "Platform: Achieve3000 · Resolved 28 Mar 2026",
    status: "resolved",
  },
  {
    id: "#TK-0085",
    title: "Request digital activation codes for Reveal Math G7",
    sub: "Platform: ConnectED · Resolved 20 Mar 2026",
    status: "resolved",
  },
];

export function SupportPage() {
  const { t } = useTranslation();

  return (
    <div>
      <PwPageHeader
        title={t("nav.support")}
        subtitle={t("mvpPages.supportPage.subtitle")}
        right={
          <button type="button" className="pw-btn pw-btn-primary">
            {t("mvpPages.supportPage.newTicket")}
          </button>
        }
      />

      <div className="pw-grid-4 mb-8">
        <div className="pw-stat-card">
          <div className="pw-stat-label">{t("mvpPages.supportPage.openTickets")}</div>
          <div className="pw-stat-value text-[#E8912D]">2</div>
        </div>
        <div className="pw-stat-card">
          <div className="pw-stat-label">{t("mvpPages.supportPage.inProgress")}</div>
          <div className="pw-stat-value text-[#0A3D62]">1</div>
        </div>
        <div className="pw-stat-card">
          <div className="pw-stat-label">{t("mvpPages.supportPage.resolved")}</div>
          <div className="pw-stat-value text-[#1E8449]">8</div>
        </div>
        <div className="pw-stat-card">
          <div className="pw-stat-label">{t("mvpPages.supportPage.avgResponse")}</div>
          <div className="pw-stat-value text-lg">3.2 hrs</div>
        </div>
      </div>

      <div className="pw-card">
        <div className="mb-3.5 text-sm font-semibold text-[#1A1917]">{t("mvpPages.supportPage.myTickets")}</div>
        {TICKETS.map((tk) => (
          <div key={tk.id} className="pw-ticket-row">
            <div className="pw-ticket-id">{tk.id}</div>
            <div className="min-w-0 flex-1">
              <div className="text-[13.5px] font-medium text-[#1A1917]">{tk.title}</div>
              <div className="text-xs text-[#5C5A55]">{tk.sub}</div>
            </div>
            {tk.status === "open" ? (
              <span className="pw-status pw-status-pending">{t("mvpPages.supportPage.statusOpen")}</span>
            ) : tk.status === "progress" ? (
              <span className="rounded-full px-2.5 py-1 text-xs font-medium text-[#0A3D62]" style={{ background: "#D6EAF8" }}>
                {t("mvpPages.supportPage.statusInProgress")}
              </span>
            ) : (
              <span className="pw-status pw-status-active">{t("mvpPages.supportPage.statusResolved")}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
