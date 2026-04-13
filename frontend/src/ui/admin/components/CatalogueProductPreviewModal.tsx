import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { AdminModal } from "./AdminModal";
import { Button } from "../../components/Button";
import type { CatalogueProductRow } from "../../../data/admin/catalogue";

export function CatalogueProductPreviewModal({
  open,
  onClose,
  product,
}: {
  open: boolean;
  onClose: () => void;
  product: CatalogueProductRow | null;
}) {
  const { t } = useTranslation();
  if (!product) return null;
  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title={product.name}
      wide
      footer={
        <div className="flex flex-wrap justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            {t("admin.schools.close")}
          </Button>
          <Link to="/app/catalogue" target="_blank" rel="noreferrer" className="inline-flex">
            <Button type="button" variant="secondary">
              {t("admin.cataloguePreview.openSchoolPortal")}
            </Button>
          </Link>
        </div>
      }
    >
      <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs font-semibold uppercase text-[#847F79]">{t("admin.pages.catalogue.colPublisher")}</dt>
          <dd className="font-medium">{product.publisher}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase text-[#847F79]">{t("admin.pages.catalogue.colGrades")}</dt>
          <dd>{product.grades}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase text-[#847F79]">{t("admin.pages.catalogue.colFormat")}</dt>
          <dd>{product.format}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase text-[#847F79]">{t("admin.pages.catalogue.colPrice")}</dt>
          <dd className="font-semibold">
            {product.lineItems.length > 0 ? product.folderPriceLabel : product.price}
            {product.lineItems.length > 0 ? (
              <span className="mt-1 block text-[11px] font-normal text-[#847F79]">
                {t("admin.cataloguePreview.folderPricingHint")}
              </span>
            ) : null}
          </dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-xs font-semibold uppercase text-[#847F79]">{t("common.status")}</dt>
          <dd>{product.status}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="mb-1 text-xs font-semibold uppercase text-[#847F79]">{t("admin.pages.catalogue.colBadges")}</dt>
          <dd className="flex flex-wrap gap-1">
            {product.badges.map((b) => (
              <span key={b} className="rounded-full bg-[#FDEBD0] px-2 py-0.5 text-[11px] font-medium text-[#7D4E10]">
                {b}
              </span>
            ))}
          </dd>
        </div>
      </dl>
      <p className="mt-4 text-xs text-[#847F79]">{t("admin.cataloguePreview.hint")}</p>
    </AdminModal>
  );
}
