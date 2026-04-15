import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Lock, Plus, ShieldAlert } from "lucide-react";
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
  const fx = country === "KSA" ? 1.03 : 1;
  const priceNum = Math.round(p.price * fx);
  const price = `${unit} ${priceNum}`;
  const priceLine = `${price} / ${t("mvpPages.catalogue.perStudent")}`;

  const lineItems = p.lineItems ?? [];
  const hasFolder = lineItems.length > 0;
  const minItem = hasFolder ? Math.min(...lineItems.map((x) => Math.round(x.price * fx))) : priceNum;
  const heroPriceLine = hasFolder
    ? t("mvpPages.catalogue.folderHeroPrice", { unit, price: minItem })
    : priceLine;

  const [accessRequested, setAccessRequested] = useState(false);

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
        priceLine={heroPriceLine}
        ctaLine={t("app.schoolDashboard.recentCatalogueCta")}
        theme={knowledgeCardThemeFromId(p.id)}
      />

      {p.folderAccess?.accessExpired ? (
        <div className="pw-card flex flex-col gap-3 border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3">
            <ShieldAlert className="h-10 w-10 shrink-0 text-amber-800" aria-hidden />
            <div>
              <div className="text-sm font-semibold text-amber-950">{t("mvpPages.catalogue.accessExpiredTitle")}</div>
              <p className="mt-1 text-sm text-amber-900/90">{t("mvpPages.catalogue.accessExpiredBody")}</p>
              {accessRequested ? (
                <p className="mt-2 text-sm font-medium text-emerald-800">{t("mvpPages.catalogue.accessRequested")}</p>
              ) : null}
            </div>
          </div>
          <button
            type="button"
            className="pw-btn pw-btn-primary shrink-0"
            disabled={accessRequested}
            onClick={() => setAccessRequested(true)}
          >
            {t("mvpPages.catalogue.requestAccess")}
          </button>
        </div>
      ) : null}

      {p.folderAccess?.passwordProtected && !p.folderAccess?.accessExpired ? (
        <div className="flex items-start gap-2 rounded-[var(--pw-radius)] border border-[var(--pw-border)] bg-[var(--pw-muted)] px-3 py-2 text-sm text-[var(--pw-text-secondary)]">
          <Lock className="mt-0.5 h-4 w-4 shrink-0 text-[var(--pw-text-muted)]" aria-hidden />
          {t("mvpPages.catalogue.passwordProtectedHint")}
        </div>
      ) : null}

      {hasFolder ? (
        <div className="pw-card">
          <div className="text-sm font-semibold text-[var(--pw-text)]">{t("mvpPages.catalogue.folderItemsTitle")}</div>
          <p className="mt-1 text-xs text-[var(--pw-text-muted)]">{t("mvpPages.catalogue.folderItemsSub")}</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--pw-border)] text-xs text-[var(--pw-text-muted)]">
                  <th className="py-2 pe-3 font-medium">{t("mvpPages.catalogue.colGrade")}</th>
                  <th className="py-2 pe-3 font-medium">{t("mvpPages.catalogue.colTitle")}</th>
                  <th className="py-2 pe-3 font-medium">{t("mvpPages.catalogue.colIsbn")}</th>
                  <th className="py-2 font-medium">{t("mvpPages.catalogue.colPrice")}</th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map((row) => (
                  <tr key={row.id} className="border-b border-[var(--pw-border)]">
                    <td className="py-2.5 pe-3 font-semibold text-[var(--pw-text)]">{row.gradeLabel}</td>
                    <td className="py-2.5 pe-3 text-[var(--pw-text-secondary)]">{row.title}</td>
                    <td className="py-2.5 pe-3 font-mono text-xs text-[var(--pw-text-muted)]">{row.isbn ?? "—"}</td>
                    <td className="py-2.5 font-medium text-[var(--pw-text)]">
                      {unit} {Math.round(row.price * fx)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

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
          {hasFolder ? (
            <>
              <div className="mt-1 text-sm text-[var(--pw-text-secondary)]">{t("mvpPages.catalogue.folderPricingSidebar")}</div>
              <div className="mt-2 text-2xl font-semibold text-[var(--pw-text)]">
                {unit} {minItem}
                <span className="text-base font-normal text-[var(--pw-text-muted)]"> {t("mvpPages.catalogue.folderPricingFrom")}</span>
              </div>
            </>
          ) : (
            <>
              <div className="mt-1 text-2xl font-semibold text-[var(--pw-text)]">{price}</div>
              <div className="mt-1 text-xs text-[var(--pw-text-muted)]">{t("mvpPages.catalogue.detailPriceNote")}</div>
            </>
          )}

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
