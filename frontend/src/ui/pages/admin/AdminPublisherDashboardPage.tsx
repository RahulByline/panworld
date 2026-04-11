import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AdminPageHeader } from "../../admin/components/AdminPageHeader";
import { publisherDashboardKpis } from "../../../data/admin/publisherDashboard";

export function AdminPublisherDashboardPage() {
  const { t } = useTranslation();

  return (
    <div className="font-sans">
      <AdminPageHeader title={t("admin.pages.pubDash.title")} subtitle={t("admin.pages.pubDash.subtitle")} />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {publisherDashboardKpis.map((p) => (
          <div key={p.name} className="rounded-2xl border border-[#E2E0D9] bg-white p-5">
            <div className="text-sm font-semibold text-[#0A3D62]">{p.name}</div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div>
                <div className="text-[11px] font-semibold uppercase text-[#5C5A55]">{t("admin.pages.pubDash.accesses")}</div>
                <div className="text-xl font-bold">{p.accesses30d}</div>
              </div>
              <div>
                <div className="text-[11px] font-semibold uppercase text-[#5C5A55]">{t("admin.pages.pubDash.rfqs")}</div>
                <div className="text-xl font-bold">{p.rfqs}</div>
              </div>
            </div>
            <div className="mt-2 text-sm font-medium text-[#1E8449]">{p.pipelineAed}</div>
            <div className="text-xs text-[#5C5A55]">{t("admin.pages.pubDash.trend", { v: p.trend })}</div>
          </div>
        ))}
      </div>

      <p className="text-sm text-[#5C5A55]">
        <Link className="font-medium text-[#0A3D62] underline" to="/admin/publishers">
          {t("admin.pages.pubDash.managePublishers")}
        </Link>
        {" · "}
        <Link className="font-medium text-[#0A3D62] underline" to="/admin/analytics">
          {t("admin.pages.pubDash.openAnalytics")}
        </Link>
      </p>
    </div>
  );
}
