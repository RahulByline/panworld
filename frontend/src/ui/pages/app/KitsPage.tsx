import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { catalogueHaystack, catalogueKits, getCatalogueFolder, type CatalogueLineItem } from "../../../data/admin/catalogue";
import { useAdminToast } from "../../admin/hooks/useAdminToast";
import { CatalogueEbookPreviewModal } from "../../admin/components/catalogue/CatalogueEbookPreviewModal";
import { CatalogueFolderDetailView } from "../../admin/components/catalogue/CatalogueFolderDetailView";
import { CatalogueProductCard } from "../../admin/components/catalogue/CatalogueProductCard";
import { PwPageHeader } from "../../panworld/PwPageHeader";

export function KitsPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { show, Toast } = useAdminToast();
  const [q, setQ] = useState("");
  const [ebookPreviewItem, setEbookPreviewItem] = useState<CatalogueLineItem | null>(null);

  const products = useMemo(() => catalogueKits.filter((p) => p.status === "Published"), []);
  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return products.filter((p) => (needle ? catalogueHaystack(p, "kits").includes(needle) : true));
  }, [q, products]);

  const folderId = searchParams.get("folder");
  const folderProductRaw = folderId ? getCatalogueFolder("kits", folderId) : undefined;
  const folderProduct = folderProductRaw?.status === "Published" ? folderProductRaw : undefined;

  const openFolder = (id: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("folder", id);
      return next;
    });
  };

  const closeFolder = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("folder");
      return next;
    });
  };

  if (folderProduct) {
    return (
      <div className="font-sans">
        <Toast />
        <CatalogueFolderDetailView
          tab="kits"
          mode="school"
          product={folderProduct}
          t={t}
          onBack={closeFolder}
          onAddBook={() => undefined}
          onEditFolder={() => undefined}
          onViewItem={(itemId) => {
            const item = folderProduct.lineItems.find((li) => li.id === itemId);
            if (item) setEbookPreviewItem(item);
          }}
          onAddToWishlist={() => show(t("mvpPages.catalogue.addWishlist"))}
          onAddToRfq={() => show(t("mvpPages.catalogue.addRfq"))}
        />
        <CatalogueEbookPreviewModal
          open={ebookPreviewItem !== null}
          onClose={() => setEbookPreviewItem(null)}
          lineItem={ebookPreviewItem}
          folderName={folderProduct.name}
        />
      </div>
    );
  }

  return (
    <div>
      <Toast />
      <PwPageHeader title={t("nav.kits")} subtitle={t("mvpPages.kits.subtitle")} />

      <div className="mb-6 flex flex-wrap items-end gap-2 rounded-xl border border-[#E2E0D9] bg-[#FAFAF8] p-3 sm:p-4">
        <div className="relative min-w-[min(100%,220px)] flex-[1_1_220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9A9890]" />
          <input
            type="search"
            className="w-full rounded-lg border border-[#E2E0D9] bg-white py-2.5 pl-9 pr-3 text-sm text-[#1A1917] outline-none focus:border-[#0A3D62]"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("admin.pages.catalogueSegment.searchKits")}
            aria-label={t("admin.pages.catalogueSegment.searchKits")}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
        {rows.map((p) => (
          <CatalogueProductCard
            key={p.id}
            tab="kits"
            mode="school"
            product={p}
            t={t}
            onOpenFolder={() => openFolder(p.id)}
            onEdit={() => undefined}
            onArchive={() => undefined}
            onPublish={() => undefined}
            onAddToWishlist={() => show(t("mvpPages.catalogue.addWishlist"))}
            onAddToRfq={() => show(t("mvpPages.catalogue.addRfq"))}
          />
        ))}
      </div>
    </div>
  );
}
