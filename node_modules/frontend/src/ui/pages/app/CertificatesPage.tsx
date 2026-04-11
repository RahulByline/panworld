import { useTranslation } from "react-i18next";
import { PwPageHeader } from "../../panworld/PwPageHeader";

export function CertificatesPage() {
  const { t } = useTranslation();

  return (
    <div>
      <PwPageHeader
        title={t("nav.myCertificates")}
        subtitle={t("mvpPages.certificatesPage.subtitle")}
        right={
          <div className="pw-stat-card pw-stat-inline">
            <span className="text-base">🏅</span>
            <div>
              <div className="text-[11px] text-[#5C5A55]">{t("mvpPages.certificatesPage.totalEarned")}</div>
              <div className="text-lg font-bold text-[#0A3D62]">4</div>
            </div>
          </div>
        }
      />

      <div className="pw-grid-2">
        <div className="pw-cert-card">
          <div className="mb-2">
            <span className="pw-badge pw-badge-success">Product Training</span>
          </div>
          <div className="mb-1 text-base font-semibold text-[#1A1917]">ConnectED Platform Mastery</div>
          <div className="mb-2.5 text-[13px] text-[#5C5A55]">McGraw Hill · Completed 12 Feb 2026 · 4 CPD hours</div>
          <div className="mb-3 text-xs text-[#9A9890]">Certificate ID: PW-CERT-2026-0412</div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="pw-btn pw-btn-primary pw-btn-sm">
              {t("mvpPages.certificatesPage.downloadPdf")}
            </button>
            <button type="button" className="pw-btn pw-btn-outline pw-btn-sm">
              {t("mvpPages.certificatesPage.share")}
            </button>
          </div>
        </div>

        <div className="pw-cert-card">
          <div className="mb-2">
            <span className="pw-badge pw-badge-new">Kodeit Academy</span>
          </div>
          <div className="mb-1 text-base font-semibold text-[#1A1917]">Differentiated Instruction — American Curriculum</div>
          <div className="mb-2.5 text-[13px] text-[#5C5A55]">Kodeit Academy · Completed 5 Mar 2026 · 7 CPD hours</div>
          <div className="mb-3 text-xs text-[#9A9890]">Certificate ID: PW-CERT-2026-0587</div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="pw-btn pw-btn-primary pw-btn-sm">
              {t("mvpPages.certificatesPage.downloadPdf")}
            </button>
            <button type="button" className="pw-btn pw-btn-outline pw-btn-sm">
              {t("mvpPages.certificatesPage.share")}
            </button>
          </div>
        </div>

        <div className="pw-cert-card">
          <div className="mb-2">
            <span className="pw-badge pw-badge-brand">Webinar</span>
          </div>
          <div className="mb-1 text-base font-semibold text-[#1A1917]">Inspire Science — Lab Safety Best Practices</div>
          <div className="mb-2.5 text-[13px] text-[#5C5A55]">McGraw Hill Webinar · Attended 20 Jan 2026 · 1 CPD hour</div>
          <div className="mb-3 text-xs text-[#9A9890]">Certificate ID: PW-CERT-2026-0198</div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="pw-btn pw-btn-primary pw-btn-sm">
              {t("mvpPages.certificatesPage.downloadPdf")}
            </button>
            <button type="button" className="pw-btn pw-btn-outline pw-btn-sm">
              {t("mvpPages.certificatesPage.share")}
            </button>
          </div>
        </div>

        <div className="pw-cert-card">
          <div className="mb-2">
            <span className="pw-badge pw-badge-success">Product Training</span>
          </div>
          <div className="mb-1 text-base font-semibold text-[#1A1917]">Inspire Science G1–G4 Mastery</div>
          <div className="mb-2.5 text-[13px] text-[#5C5A55]">
            McGraw Hill · {t("mvpPages.certificatesPage.inProgress")}
          </div>
          <div className="pw-progress-bar mb-2">
            <div className="pw-progress-fill" style={{ width: "87%" }} />
          </div>
          <div className="text-xs font-medium text-[#E8912D]">{t("mvpPages.certificatesPage.almostThere")}</div>
        </div>
      </div>
    </div>
  );
}
