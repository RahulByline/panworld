import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { PwPageHeader } from "../../panworld/PwPageHeader";
import { usePortalMock } from "./mockHooks";
import { cn } from "../../utils/cn";

function formatForProduct(name: string) {
  return name.toLowerCase().includes("kit") ? "Kit" : "Print";
}

function statusLabel(status: string, t: (k: string) => string) {
  if (status === "Dispatched") return t("mvpPages.sampleRequests.statusDispatched");
  if (status === "Delivered") return t("mvpPages.sampleRequests.statusDelivered");
  if (status === "Reviewed" || status === "Submitted") return t("mvpPages.sampleRequests.statusReview");
  return status;
}

function StatusPill({ status }: { status: string }) {
  const { t } = useTranslation();
  const display = statusLabel(status, t);
  const pending =
    status === "Dispatched" ||
    status === "Reviewed" ||
    status === "Submitted" ||
    status === "Approved";
  return <span className={cn("pw-status", pending ? "pw-status-pending" : "pw-status-active")}>{display}</span>;
}

export function SamplesPage() {
  const { t } = useTranslation();
  const { samples } = usePortalMock();

  const rows = useMemo(() => samples.slice(0, 12), [samples]);

  return (
    <div>
      <PwPageHeader
        title={t("nav.samples")}
        subtitle={t("mvpPages.sampleRequests.subtitle")}
        right={
          <button type="button" className="pw-btn pw-btn-primary">
            {t("mvpPages.sampleRequests.newRequest")}
          </button>
        }
      />

      <div className="pw-card">
        <div className="mb-3.5 text-sm font-semibold text-[#1A1917]">{t("mvpPages.sampleRequests.activeRequests")}</div>
        <table className="pw-data-table">
          <thead>
            <tr>
              <th>{t("mvpPages.sampleRequests.colProduct")}</th>
              <th>{t("mvpPages.sampleRequests.colPublisher")}</th>
              <th>{t("mvpPages.sampleRequests.colFormat")}</th>
              <th>{t("mvpPages.sampleRequests.colStatus")}</th>
              <th>{t("mvpPages.sampleRequests.colRequested")}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((x) => (
              <tr key={x.id}>
                <td className="font-semibold">{x.productName}</td>
                <td>{x.publisher}</td>
                <td>{formatForProduct(x.productName)}</td>
                <td>
                  <StatusPill status={x.status} />
                </td>
                <td className="text-[#9A9890]">{new Date(x.requestedAt).toLocaleDateString()}</td>
                <td className="text-end">
                  {x.status === "Dispatched" ? (
                    <button type="button" className="pw-btn pw-btn-outline pw-btn-xs">
                      {t("mvpPages.sampleRequests.track")}
                    </button>
                  ) : x.status === "Delivered" ? (
                    <span className="text-xs text-[#1E8449]">
                      {t("mvpPages.sampleRequests.received", { date: new Date(x.lastUpdatedAt).toLocaleDateString() })}
                    </span>
                  ) : x.status === "Reviewed" || x.status === "Submitted" ? (
                    <div className="flex justify-end gap-2">
                      <Link to={`/app/samples/${x.id}`} className="pw-btn pw-btn-outline pw-btn-xs no-underline">
                        {t("mvpPages.sampleRequests.track")}
                      </Link>
                      <button type="button" className="pw-btn pw-btn-ghost pw-btn-xs">
                        {t("mvpPages.sampleRequests.cancel")}
                      </button>
                    </div>
                  ) : (
                    <Link to={`/app/samples/${x.id}`} className="pw-btn pw-btn-outline pw-btn-xs no-underline">
                      {t("mvpPages.sampleRequests.view")}
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
