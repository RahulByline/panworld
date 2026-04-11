import { useTranslation } from "react-i18next";
import { AdminPageHeader } from "../../admin/components/AdminPageHeader";
import { AdminStatCard } from "../../admin/components/AdminStatCard";
import { Button } from "../../components/Button";
import { analyticsSummary, conversionFunnel, publisherDemoAccesses } from "../../../data/admin/analytics";

function barTone(tone: "success" | "brand" | "accent") {
  if (tone === "success") return "bg-[#1E8449]";
  if (tone === "accent") return "bg-[#E8912D]";
  return "bg-[#0A3D62]";
}

export function AdminAnalyticsPage() {
  const { t } = useTranslation();

  return (
    <div className="font-sans">
      <AdminPageHeader
        title={t("admin.pages.analytics.title")}
        subtitle={t("admin.pages.analytics.subtitle")}
        actions={
          <>
            <select className="h-10 rounded-lg border border-[#E2E0D9] bg-white px-3 text-sm">
              <option>{t("admin.pages.analytics.range30")}</option>
              <option>{t("admin.pages.analytics.range90")}</option>
              <option>{t("admin.pages.analytics.rangeYear")}</option>
            </select>
            <Button type="button" variant="secondary" size="sm">
              {t("common.export")}
            </Button>
          </>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          label={t("admin.pages.analytics.statMas")}
          value={analyticsSummary.monthlyActiveSchools}
          sub={analyticsSummary.monthlyActiveSub}
        />
        <AdminStatCard
          label={t("admin.pages.analytics.statAccess")}
          value={analyticsSummary.demoAccesses}
          sub={analyticsSummary.demoAccessesSub}
        />
        <AdminStatCard
          label={t("admin.pages.analytics.statWishlist")}
          value={analyticsSummary.wishlistAdds}
          sub={analyticsSummary.wishlistSub}
        />
        <AdminStatCard
          label={t("admin.pages.analytics.statCerts")}
          value={analyticsSummary.certificatesIssued}
          sub={analyticsSummary.certificatesSub}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#E2E0D9] bg-white p-5">
          <div className="mb-4 text-sm font-semibold">{t("admin.pages.analytics.publisherAccessTitle")}</div>
          <div className="space-y-3">
            {publisherDemoAccesses.map((p) => (
              <div key={p.name}>
                <div className="mb-1 flex justify-between text-[12.5px]">
                  <span>{p.name}</span>
                  <span className="font-semibold">
                    {p.accesses} {t("admin.pages.analytics.accesses")}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-sm bg-[#E2E0D9]">
                  <div className={`h-full rounded-sm ${barTone(p.tone)}`} style={{ width: `${p.widthPct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#E2E0D9] bg-white p-5">
          <div className="mb-4 text-sm font-semibold">{t("admin.pages.analytics.funnelTitle")}</div>
          <div className="space-y-2">
            {conversionFunnel.map((step) => (
              <div
                key={step.label}
                className={`flex items-center justify-between rounded-lg px-4 py-3 ${step.bg}`}
              >
                <span className="text-[13px] font-medium">{step.label}</span>
                <span className={`text-lg font-bold ${step.textColor}`}>
                  {step.value}
                  {step.sub ? <span className="ml-1 text-xs font-normal opacity-90">{step.sub}</span> : null}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
