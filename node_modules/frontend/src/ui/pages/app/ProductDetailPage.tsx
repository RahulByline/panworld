import { Link, useParams } from "react-router-dom";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { mockProducts } from "../../../mock/data";
import { useAuthStore } from "../../../store/auth.store";
import { KnowledgeProductCard, knowledgeCardThemeFromId } from "../../school/KnowledgeProductCard";

export function ProductDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const school = useAuthStore((s) => s.school);
  const country = school?.country;
  const p = mockProducts.find((x) => x.id === id) ?? null;

  if (!p) {
    return (
      <div className="pw-card p-6">
        <div className="text-sm font-semibold text-[var(--pw-text)]">{t("mvpPages.catalogue.notFoundTitle")}</div>
        <div className="mt-3">
          <Link to="/app/catalogue" className="pw-btn pw-btn-outline no-underline">
            {t("mvpPages.catalogue.backToCatalogue")}
          </Link>
        </div>
      </div>
    );
  }

  const unit = country === "KSA" ? "SAR" : "AED";
  const priceNum = Math.round(p.price * (country === "KSA" ? 1.03 : 1));
  const price = `${unit} ${priceNum}`;
  const priceLine = `${price} / ${t("mvpPages.catalogue.perStudent")}`;

  return (
    <div className="space-y-5">
      <Link
        to="/app/catalogue"
        className="inline-block text-sm font-medium text-[var(--pw-text-secondary)] no-underline hover:text-[var(--pw-text)]"
      >
        ← {t("mvpPages.catalogue.backToCatalogue")}
      </Link>

      <KnowledgeProductCard
        className="pw-kc-card--detail-hero"
        title={p.name}
        eyebrow={t("app.schoolDashboard.recentCatalogueEyebrow")}
        body={`${p.publisher} • ${p.grades ?? "—"} • ${p.format} • ${p.curriculum ?? "—"}`}
        priceLine={priceLine}
        ctaLine={t("app.schoolDashboard.recentCatalogueCta")}
        theme={knowledgeCardThemeFromId(p.id)}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="pw-card lg:col-span-2">
          <div className="text-sm font-semibold text-[var(--pw-text)]">{t("mvpPages.catalogue.detailOverview")}</div>
          <div className="mt-2 text-sm text-[var(--pw-text-secondary)]">{t("mvpPages.catalogue.detailOverviewBody")}</div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-[var(--pw-radius)] border border-[var(--pw-border)] bg-[var(--pw-muted)] p-3">
              <div className="text-xs text-[var(--pw-text-muted)]">{t("mvpPages.catalogue.detailType")}</div>
              <div className="mt-1 font-semibold text-[var(--pw-text)]">{p.type}</div>
            </div>
            <div className="rounded-[var(--pw-radius)] border border-[var(--pw-border)] bg-[var(--pw-muted)] p-3">
              <div className="text-xs text-[var(--pw-text-muted)]">{t("mvpPages.catalogue.detailEdition")}</div>
              <div className="mt-1 font-semibold text-[var(--pw-text)]">{p.edition}</div>
            </div>
            <div className="rounded-[var(--pw-radius)] border border-[var(--pw-border)] bg-[var(--pw-muted)] p-3">
              <div className="text-xs text-[var(--pw-text-muted)]">{t("mvpPages.catalogue.detailGrades")}</div>
              <div className="mt-1 font-semibold text-[var(--pw-text)]">{p.grades ?? "—"}</div>
            </div>
            <div className="rounded-[var(--pw-radius)] border border-[var(--pw-border)] bg-[var(--pw-muted)] p-3">
              <div className="text-xs text-[var(--pw-text-muted)]">{t("mvpPages.catalogue.detailFormat")}</div>
              <div className="mt-1 font-semibold text-[var(--pw-text)]">{p.format}</div>
            </div>
          </div>

          <div className="mt-5 rounded-[var(--pw-radius-lg)] border border-[var(--pw-border)] bg-white p-4">
            <div className="text-sm font-semibold text-[var(--pw-text)]">{t("mvpPages.catalogue.detailCurriculumTitle")}</div>
            <div className="mt-1 text-xs text-[var(--pw-text-muted)]">{t("mvpPages.catalogue.detailCurriculumSub")}</div>
            <ul className="mt-3 list-disc ps-5 text-sm text-[var(--pw-text-secondary)]">
              <li>{t("mvpPages.catalogue.detailBulletStandards")}</li>
              <li>{t("mvpPages.catalogue.detailBulletTraining")}</li>
              <li>
                {t("mvpPages.catalogue.detailBulletRegions")}: {p.countryRelevance.join(", ")}
              </li>
            </ul>
          </div>
        </div>

        <div className="pw-card">
          <div className="text-xs text-[var(--pw-text-muted)]">{t("mvpPages.catalogue.detailSku")}</div>
          <div className="text-sm font-semibold text-[var(--pw-text)]">{p.sku}</div>

          <div className="mt-4 text-sm font-semibold text-[var(--pw-text)]">{t("mvpPages.catalogue.detailPricing")}</div>
          <div className="mt-1 text-2xl font-semibold text-[var(--pw-text)]">{price}</div>
          <div className="mt-1 text-xs text-[var(--pw-text-muted)]">{t("mvpPages.catalogue.detailPriceNote")}</div>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center justify-between rounded-[var(--pw-radius)] border border-[var(--pw-border)] bg-[var(--pw-muted)] px-3 py-2">
              <span className="text-[var(--pw-text-secondary)]">{t("mvpPages.catalogue.detailNcc")}</span>
              <span className="font-semibold text-[var(--pw-text)]">{p.nccApproved ? t("mvpPages.catalogue.yes") : t("mvpPages.catalogue.no")}</span>
            </div>
            <div className="flex items-center justify-between rounded-[var(--pw-radius)] border border-[var(--pw-border)] bg-[var(--pw-muted)] px-3 py-2">
              <span className="text-[var(--pw-text-secondary)]">{t("mvpPages.catalogue.detailCurriculumLabel")}</span>
              <span className="font-semibold text-[var(--pw-text)]">{p.curriculum}</span>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-2">
            <button type="button" className="pw-btn pw-btn-primary">
              {t("mvpPages.catalogue.accessDemo")}
            </button>
            <Link to="/app/rfq" className="pw-btn pw-btn-primary no-underline inline-flex items-center justify-center gap-1.5">
              <Plus className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {t("mvpPages.catalogue.addRfq")}
            </Link>
            <button type="button" className="pw-btn pw-btn-outline">
              {t("mvpPages.catalogue.requestSample")}
            </button>
            <button type="button" className="pw-btn pw-btn-outline">
              {t("mvpPages.catalogue.addWishlist")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
