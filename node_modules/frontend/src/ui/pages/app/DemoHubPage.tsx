import { useTranslation } from "react-i18next";
import { PwPageHeader } from "../../panworld/PwPageHeader";
import { cn } from "../../utils/cn";

const HISTORY = [
  { publisher: "McGraw Hill", product: "Inspire Science G4", date: "3 Apr 2026" },
  { publisher: "Kodeit", product: "Social Sciences G5", date: "28 Mar 2026" },
  { publisher: "Achieve3000", product: "Literacy Platform", date: "20 Mar 2026" },
];

export function DemoHubPage() {
  const { t } = useTranslation();

  return (
    <div>
      <PwPageHeader title={t("mvpPages.demo.title")} subtitle={t("mvpPages.demo.subtitle")} />

      <div className="mb-6 flex flex-wrap items-center gap-3 rounded-[10px] border border-[#E2E0D9] bg-[#F5F4F0] px-4 py-3.5">
        <span className="text-lg">⚡</span>
        <div className="min-w-0 text-[13.5px]">
          <span className="font-medium text-[#1A1917]">{t("mvpPages.demo.instantTitle")}</span>{" "}
          <span className="text-[#5C5A55]">{t("mvpPages.demo.instantBody")}</span>
        </div>
      </div>

      <div className="pw-grid-3 mb-8">
        <DemoBlock
          icon="📗"
          pub="pub-mcgraw"
          title="McGraw Hill ConnectED"
          sub="4 products · Inspire Science, Reveal Math, Wonders, Treasures"
          tag1="Shared login"
          tag2={t("mvpPages.demo.instantDelivered")}
          status="ok"
          cta={t("mvpPages.demo.accessDemo")}
          ctaClass="pw-btn-primary"
        />
        <DemoBlock
          icon="🏫"
          pub="pub-kodeit"
          title="Kodeit Global"
          sub="3 products · Social Sciences, KG Programme, ICT"
          tag1="Shared login"
          tag2={t("mvpPages.demo.instantDelivered")}
          status="ok"
          cta={t("mvpPages.demo.accessDemo")}
          ctaClass="bg-[#7B1FA2] text-white border-0 hover:opacity-95"
          border
          badge="Our Brand"
        />
        <DemoBlock
          icon="💬"
          pub="pub-studysync"
          title="StudySync"
          sub="1 product · ELA Platform G6–G12"
          tag1="School-specific"
          tag2={t("mvpPages.demo.provision24")}
          status="pending"
          cta={t("mvpPages.demo.requestDemo")}
          ctaClass="pw-btn-outline"
        />
        <DemoBlock
          icon="📈"
          pub="pub-achieve"
          title="Achieve3000"
          sub="1 product · Literacy Platform G1–G12"
          tag1="Shared login"
          tag2={t("mvpPages.demo.instantDelivered")}
          status="ok"
          cta={t("mvpPages.demo.accessDemo")}
          ctaClass="pw-btn-outline"
        />
        <DemoBlock
          icon="🏫"
          pub="pub-powerschool"
          title="PowerSchool"
          sub="SIS + LMS platform"
          tag1="School-specific"
          tag2={t("mvpPages.demo.provision24")}
          status="pending"
          cta={t("mvpPages.demo.requestDemo")}
          ctaClass="pw-btn-outline"
        />
        <DemoBlock
          icon="📕"
          pub="pub-oxford"
          title="Oxford University Press"
          sub="Primary & Secondary curriculum"
          tag1="Shared login"
          tag2={t("mvpPages.demo.instantDelivered")}
          status="ok"
          cta={t("mvpPages.demo.accessDemo")}
          ctaClass="pw-btn-outline"
        />
      </div>

      <div className="pw-card">
        <div className="mb-3.5 text-sm font-semibold text-[#1A1917]">{t("mvpPages.demo.accessHistory")}</div>
        <table className="pw-data-table">
          <thead>
            <tr>
              <th>Publisher</th>
              <th>Product</th>
              <th>Date Accessed</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {HISTORY.map((row) => (
              <tr key={row.publisher + row.date}>
                <td>
                  <strong>{row.publisher}</strong>
                </td>
                <td>{row.product}</td>
                <td className="text-[#5C5A55]">{row.date}</td>
                <td>
                  <span className="pw-status pw-status-active">Credentials sent</span>
                </td>
                <td>
                  <button type="button" className="pw-btn pw-btn-outline pw-btn-xs">
                    {t("mvpPages.demo.resend")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DemoBlock({
  icon,
  pub,
  title,
  sub,
  tag1,
  tag2,
  status,
  cta,
  ctaClass,
  border,
  badge,
}: {
  icon: string;
  pub: string;
  title: string;
  sub: string;
  tag1: string;
  tag2: string;
  status: "ok" | "pending";
  cta: string;
  ctaClass: string;
  border?: boolean;
  badge?: string;
}) {
  return (
    <div className={cn("pw-demo-card", border && "border-2 border-[#7B1FA2]")}>
      <div className="flex items-start justify-between gap-2">
        <div className={cn("pw-demo-icon", pub)}>{icon}</div>
        {badge ? <span className="pw-badge pw-badge-new">{badge}</span> : null}
      </div>
      <div className="mt-2 text-sm font-semibold text-[#1A1917]">{title}</div>
      <div className="mb-3 text-xs text-[#5C5A55]">{sub}</div>
      <div className="mb-3 flex flex-wrap gap-1.5">
        <span className="pw-tag text-[11px]">{tag1}</span>
        <span className={cn("pw-status text-[11px] px-2 py-0.5", status === "ok" ? "pw-status-active" : "pw-status-pending")}>{tag2}</span>
      </div>
      <button type="button" className={cn("pw-btn pw-btn-sm w-full", ctaClass)}>
        {cta}
      </button>
    </div>
  );
}
