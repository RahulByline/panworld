import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import {
  catalogueHaystack,
  catalogueLibraryBooks,
  getCatalogueFolder,
  type CatalogueLineItem,
} from "../../../data/admin/catalogue";
import { useAdminToast } from "../../admin/hooks/useAdminToast";
import { CatalogueEbookPreviewModal } from "../../admin/components/catalogue/CatalogueEbookPreviewModal";
import { CatalogueFolderDetailView } from "../../admin/components/catalogue/CatalogueFolderDetailView";
import { CatalogueProductCard } from "../../admin/components/catalogue/CatalogueProductCard";
import { PwPageHeader } from "../../panworld/PwPageHeader";

export function LibraryPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { show, Toast } = useAdminToast();
  const [q, setQ] = useState("");
  const [ebookPreviewItem, setEbookPreviewItem] = useState<CatalogueLineItem | null>(null);

  const products = useMemo(() => catalogueLibraryBooks.filter((p) => p.status === "Published"), []);

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return products.filter((p) => (needle ? catalogueHaystack(p, "library").includes(needle) : true));
  }, [q, products]);

  const folderId = searchParams.get("folder");
  const folderProductRaw = folderId ? getCatalogueFolder("library", folderId) : undefined;
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
          tab="library"
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
      <PwPageHeader title={t("nav.libraryBooks")} subtitle={t("mvpPages.library.subtitle")} />

      <div className="pw-filter-bar">
        <div className="relative min-w-[200px] max-w-[320px] flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9A9890]" size={14} />
          <input
            className="pw-search-input w-full ps-9"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("mvpPages.library.searchPlaceholder")}
          />
        </div>
        <select className="pw-filter-select" defaultValue="all">
          <option value="all">All Reading Levels</option>
          <option>Lexile 200–400 (G1–G2)</option>
          <option>Lexile 400–600 (G3–G4)</option>
          <option>Lexile 600–800 (G5–G7)</option>
          <option>Lexile 800–1000 (G8–G10)</option>
          <option>Lexile 1000+ (G11–G12)</option>
        </select>
        <select className="pw-filter-select" defaultValue="all">
          <option value="all">All Genres</option>
          <option>Fiction</option>
          <option>Non-Fiction</option>
          <option>STEM</option>
          <option>Islamic Studies</option>
          <option>Arabic Literature</option>
        </select>
        <select className="pw-filter-select" defaultValue="all">
          <option value="all">All Languages</option>
          <option>English</option>
          <option>Arabic</option>
          <option>Bilingual</option>
        </select>
        <select className="pw-filter-select" defaultValue="all">
          <option value="all">All Publishers</option>
          <option>Oxford</option>
          <option>Cambridge</option>
          <option>Collins</option>
          <option>Pearson</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
        {rows.map((p) => (
          <CatalogueProductCard
            key={p.id}
            tab="library"
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
