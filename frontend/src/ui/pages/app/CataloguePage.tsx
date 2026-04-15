import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useLocation, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  catalogueHaystack,
  catalogueTextbooks,
  getCatalogueFolder,
  type CatalogueLineItem,
  type CatalogueProductRow,
} from "../../../data/admin/catalogue";
import { TB_CURRICULUM_OPTIONS, TB_FORMAT_OPTIONS, TB_GRADE_OPTIONS, TB_PUBLISHER_OPTIONS } from "../../../data/admin/catalogueFilterConfig";
import { useAdminToast } from "../../admin/hooks/useAdminToast";
import { CatalogueEbookPreviewModal } from "../../admin/components/catalogue/CatalogueEbookPreviewModal";
import { CatalogueFolderDetailView } from "../../admin/components/catalogue/CatalogueFolderDetailView";
import { CatalogueProductCard } from "../../admin/components/catalogue/CatalogueProductCard";
import { PwPageHeader } from "../../panworld/PwPageHeader";
import { cn } from "../../utils/cn";
function matchesPublisher(p: CatalogueProductRow, sel: string): boolean {
  if (sel.startsWith("All ")) return true;
  if (p.publisher === sel) return true;
  if (sel === "Kodeit" && p.publisher.includes("Kodeit")) return true;
  if (sel === "Oxford" && p.publisher.includes("Oxford")) return true;
  return false;
}

function matchesGradeBuckets(p: CatalogueProductRow, sel: string): boolean {
  if (sel.startsWith("All ")) return true;
  return p.gradeBuckets?.includes(sel) ?? false;
}

export function CataloguePage() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { show, Toast } = useAdminToast();
  const [q, setQ] = useState("");
  const [tbPub, setTbPub] = useState<string>(TB_PUBLISHER_OPTIONS[0]);
  const [tbGrade, setTbGrade] = useState<string>(TB_GRADE_OPTIONS[0]);
  const [tbCurr, setTbCurr] = useState<string>(TB_CURRICULUM_OPTIONS[0]);
  const [tbFmt, setTbFmt] = useState<string>(TB_FORMAT_OPTIONS[0]);
  const [visible, setVisible] = useState(9);
  const [ebookPreviewItem, setEbookPreviewItem] = useState<CatalogueLineItem | null>(null);
  const prevPathRef = useRef<string | null>(null);

  const products = useMemo(() => catalogueTextbooks.filter((p) => p.status === "Published"), []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return products.filter((p) => {
      if (needle && !catalogueHaystack(p, "textbooks").includes(needle)) return false;
      if (!matchesPublisher(p, tbPub)) return false;
      if (!matchesGradeBuckets(p, tbGrade)) return false;
      if (tbCurr !== TB_CURRICULUM_OPTIONS[0] && p.curriculum !== tbCurr) return false;
      if (tbFmt !== TB_FORMAT_OPTIONS[0] && p.format !== tbFmt) return false;
      return true;
    });
  }, [products, q, tbPub, tbGrade, tbCurr, tbFmt]);

  useEffect(() => {
    setVisible(9);
  }, [q, tbPub, tbGrade, tbCurr, tbFmt]);

  useEffect(() => {
    if (prevPathRef.current !== null && prevPathRef.current !== pathname) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.delete("folder");
        return next;
      });
    }
    prevPathRef.current = pathname;
  }, [pathname, setSearchParams]);

  const folderId = searchParams.get("folder");
  const folderProductRaw = folderId ? getCatalogueFolder("textbooks", folderId) : undefined;
  const folderProduct = folderProductRaw?.status === "Published" ? folderProductRaw : undefined;

  useEffect(() => {
    if (folderId && !folderProduct) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.delete("folder");
        return next;
      });
    }
  }, [folderId, folderProduct, setSearchParams]);

  const slice = filtered.slice(0, visible);

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

  const selCls =
    "min-w-[130px] max-w-full rounded-lg border border-[#E2E0D9] bg-[#F5F4F0] px-3 py-2 text-[13px] text-[#1A1917] outline-none focus:border-[#0A3D62] sm:min-w-[140px]";

  if (folderProduct) {
    return (
      <div className="font-sans">
        <Toast />
        <CatalogueFolderDetailView
          tab="textbooks"
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
    <div className="font-sans">
      <Toast />
      <PwPageHeader
        title={t("admin.pages.catalogueTextbooks.title")}
        subtitle={t("admin.pages.catalogueTextbooks.subtitle")}
        right={<span className="pw-status pw-status-active">{t("mvpPages.catalogue.productCount", { count: filtered.length })}</span>}
      />

      <div className="mb-6 flex flex-wrap items-end gap-2 rounded-xl border border-[#E2E0D9] bg-[#FAFAF8] p-3 sm:p-4">
        <div className="relative min-w-[min(100%,220px)] flex-[1_1_220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9A9890]" />
          <input
            type="search"
            className="w-full rounded-lg border border-[#E2E0D9] bg-white py-2.5 pl-9 pr-3 text-sm text-[#1A1917] outline-none focus:border-[#0A3D62]"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("admin.pages.catalogueSegment.searchTextbooks")}
            aria-label={t("admin.pages.catalogueSegment.searchTextbooks")}
          />
        </div>
        <select className={selCls} value={tbPub} onChange={(e) => setTbPub(e.target.value)}>
          {TB_PUBLISHER_OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <select className={selCls} value={tbGrade} onChange={(e) => setTbGrade(e.target.value)}>
          {TB_GRADE_OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <select className={selCls} value={tbCurr} onChange={(e) => setTbCurr(e.target.value)}>
          {TB_CURRICULUM_OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <select className={selCls} value={tbFmt} onChange={(e) => setTbFmt(e.target.value)}>
          {TB_FORMAT_OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>

      {slice.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#E2E0D9] bg-[#FAFAF8] py-16 text-center text-sm text-[#5C5A55]">
          {t("admin.pages.catalogueSegment.noResults")}
        </div>
      ) : (
        <div className={cn("grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3")}>
          {slice.map((p) => (
            <CatalogueProductCard
              key={p.id}
              tab="textbooks"
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
      )}

      {filtered.length > visible ? (
        <div className="mt-7 text-center">
          <button type="button" className="pw-btn pw-btn-outline" onClick={() => setVisible((v) => v + 9)}>
            {t("mvpPages.catalogue.loadMore")}
          </button>
        </div>
      ) : null}
    </div>
  );
}
