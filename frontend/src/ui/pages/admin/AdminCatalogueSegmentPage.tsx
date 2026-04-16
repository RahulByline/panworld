import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, Navigate, useLocation, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LayoutGrid, LayoutList, Search } from "lucide-react";
import { Button } from "../../components/Button";
import {
  catalogueByTab,
  catalogueHaystack,
  type CatalogueLineItem,
  type CatalogueProductRow,
  type CatalogueTab,
} from "../../../data/admin/catalogue";
import {
  KIT_GRADE_OPTIONS,
  KIT_PUBLISHER_OPTIONS,
  KIT_TYPE_OPTIONS,
  LIB_GENRE_OPTIONS,
  LIB_LANGUAGE_OPTIONS,
  LIB_PUBLISHER_OPTIONS,
  LIB_READING_OPTIONS,
  TB_CURRICULUM_OPTIONS,
  TB_FORMAT_OPTIONS,
  TB_GRADE_OPTIONS,
  TB_PUBLISHER_OPTIONS,
  TB_STATUS_OPTIONS,
} from "../../../data/admin/catalogueFilterConfig";
import { cn } from "../../utils/cn";
import { useAdminToast } from "../../admin/hooks/useAdminToast";
import { api } from "../../../services/api";
import {
  KitCatalogueModal,
  LibraryCatalogueModal,
  TextbookProductModal,
  type TextbookSeriesCreateInput,
} from "../../admin/components/catalogue/CatalogueModals";
import {
  CatalogueBookItemModal,
  type CatalogueSeriesItemCreateInput,
} from "../../admin/components/catalogue/CatalogueBookItemModal";
import { CatalogueEbookPreviewModal } from "../../admin/components/catalogue/CatalogueEbookPreviewModal";
import { CatalogueFolderDetailView } from "../../admin/components/catalogue/CatalogueFolderDetailView";
import { CatalogueProductCard } from "../../admin/components/catalogue/CatalogueProductCard";

function tabFromPath(pathname: string): CatalogueTab | null {
  if (pathname.includes("/cms/library")) return "library";
  if (pathname.includes("/cms/kits")) return "kits";
  if (pathname.includes("/cms/textbooks")) return "textbooks";
  return null;
}

function matchesPublisher(p: CatalogueProductRow, sel: string, tab: CatalogueTab): boolean {
  if (sel.startsWith("All ")) return true;
  if (p.publisher === sel) return true;
  if (sel === "Kodeit" && p.publisher.includes("Kodeit")) return true;
  if (sel === "Oxford" && p.publisher.includes("Oxford")) return true;
  if (tab === "library" && sel === "HarperCollins" && p.publisher.includes("Collins")) return true;
  return false;
}

function matchesGradeBuckets(p: CatalogueProductRow, sel: string): boolean {
  if (sel.startsWith("All ")) return true;
  return p.gradeBuckets?.includes(sel) ?? false;
}

type ApiSeries = {
  id: string;
  name: string;
  publisher: string;
  format: string;
  curriculumType: string;
  subject: string;
  gradeFrom: string;
  gradeTo: string;
  description: string | null;
  detailLine: string | null;
  status: CatalogueProductRow["status"];
  badges: string[];
};

type ApiSeriesItem = {
  id: string;
  resourceType?: string;
  title: string;
  subject?: string | null;
  gradeLabel: string;
  isbn?: string | null;
  listPrice: number;
  priceUnit: string;
  status: CatalogueLineItem["status"];
  coverImageUrl?: string | null;
  materialLinkUrl?: string | null;
  materialFileUrl?: string | null;
};

function mapApiSeriesToRow(series: ApiSeries, items: ApiSeriesItem[], marketingCount = 0): CatalogueProductRow {
  function fixUrl(url?: string | null) {
    if (!url) return undefined;
    if (url.includes("/files/") && !url.includes("/api/files/")) {
      return url.replace("/files/", "/api/files/");
    }
    return url;
  }

  const lineItems: CatalogueLineItem[] = items.map((it) => ({
    id: it.id,
    title: it.resourceType && it.resourceType !== "BROCHURE" ? `${it.title} (${it.resourceType.replaceAll("_", " ")})` : it.title,
    gradeLabel: it.gradeLabel,
    isbn: it.isbn || undefined,
    price: it.resourceType === "BROCHURE" ? "Free" : `AED ${Number(it.listPrice)}`,
    priceUnit: it.resourceType === "BROCHURE" ? "" : it.priceUnit,
    status: it.status,
    coverImageUrl: fixUrl(it.coverImageUrl) || undefined,
    ebookPreviewUrl: fixUrl(it.materialFileUrl) || fixUrl(it.materialLinkUrl) || undefined,
  }));
  const min = items.length ? Math.min(...items.map((x) => Number(x.listPrice))) : null;
  return {
    id: series.id,
    name: series.name,
    publisher: series.publisher,
    grades: `${series.gradeFrom}–${series.gradeTo}`,
    format: series.format,
    price: min == null ? "AED —" : `AED ${min}`,
    badges: series.badges || [],
    status: series.status,
    cardIcon: "default",
    headerKey: "default",
    detailLine:
      series.detailLine ||
      `${series.subject}${items.some((x) => x.subject) ? ` · ${items.filter((x) => x.subject).length} subject-tagged resources` : ""}${marketingCount ? ` · ${marketingCount} marketing assets` : ""}`,
    curriculum: series.curriculumType,
    gradeBuckets: [`${series.gradeFrom}–${series.gradeTo}`],
    lineItems,
    folderPriceLabel:
      min == null
        ? `${lineItems.length} title${lineItems.length === 1 ? "" : "s"}`
        : `${lineItems.length} title${lineItems.length === 1 ? "" : "s"} · From AED ${min}`,
    folderDetailSummary: series.description || series.subject,
    folderAccess: { passwordProtected: false },
  };
}

export function AdminCatalogueSegmentPage() {
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();
  const { show, Toast } = useAdminToast();

  const tab = tabFromPath(pathname);
  const [viewList, setViewList] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [q, setQ] = useState("");
  const [tbPub, setTbPub] = useState<string>(TB_PUBLISHER_OPTIONS[0]);
  const [tbGrade, setTbGrade] = useState<string>(TB_GRADE_OPTIONS[0]);
  const [tbCurr, setTbCurr] = useState<string>(TB_CURRICULUM_OPTIONS[0]);
  const [tbFmt, setTbFmt] = useState<string>(TB_FORMAT_OPTIONS[0]);
  const [tbStat, setTbStat] = useState<string>(TB_STATUS_OPTIONS[0]);

  const [libRead, setLibRead] = useState<string>(LIB_READING_OPTIONS[0]);
  const [libGenre, setLibGenre] = useState<string>(LIB_GENRE_OPTIONS[0]);
  const [libLang, setLibLang] = useState<string>(LIB_LANGUAGE_OPTIONS[0]);
  const [libPub, setLibPub] = useState<string>(LIB_PUBLISHER_OPTIONS[0]);

  const [kitType, setKitType] = useState<string>(KIT_TYPE_OPTIONS[0]);
  const [kitPub, setKitPub] = useState<string>(KIT_PUBLISHER_OPTIONS[0]);
  const [kitGrade, setKitGrade] = useState<string>(KIT_GRADE_OPTIONS[0]);

  const meta = useMemo(() => {
    if (tab === "textbooks")
      return {
        title: t("admin.pages.catalogueTextbooks.title"),
        subtitle: t("admin.pages.catalogueTextbooks.subtitle"),
        add: t("admin.pages.catalogueTextbooks.add"),
        searchPh: t("admin.pages.catalogueSegment.searchTextbooks"),
      };
    if (tab === "library")
      return {
        title: t("admin.pages.catalogueLibrary.title"),
        subtitle: t("admin.pages.catalogueLibrary.subtitle"),
        add: t("admin.pages.catalogueLibrary.add"),
        searchPh: t("admin.pages.catalogueSegment.searchLibrary"),
      };
    return {
      title: t("admin.pages.catalogueKits.title"),
      subtitle: t("admin.pages.catalogueKits.subtitle"),
      add: t("admin.pages.catalogueKits.add"),
      searchPh: t("admin.pages.catalogueSegment.searchKits"),
    };
  }, [t, tab]);

  const [extraProducts, setExtraProducts] = useState<Record<CatalogueTab, CatalogueProductRow[]>>({
    textbooks: [],
    library: [],
    kits: [],
  });
  const [textbookProducts, setTextbookProducts] = useState<CatalogueProductRow[]>([]);

  const products =
    tab === "textbooks"
      ? [...textbookProducts, ...(extraProducts.textbooks ?? [])]
      : [...catalogueByTab[tab ?? "textbooks"], ...(extraProducts[tab ?? "textbooks"] ?? [])];

  function handleAddCatalogue(row: CatalogueProductRow) {
    const activeTab = tab ?? "textbooks";
    setExtraProducts((prev) => ({ ...prev, [activeTab]: [row, ...prev[activeTab]] }));
  }

  function handleAddLineItem(item: CatalogueLineItem) {
    const currentFolderId = new URLSearchParams(window.location.search).get("folder");
    if (!tab || !currentFolderId) return;
    setExtraProducts((prev) => {
      const list = prev[tab].map((p) => {
        if (p.id !== currentFolderId) return p;
        const updated = [...p.lineItems, item];
        return {
          ...p,
          lineItems: updated,
          folderPriceLabel: `${updated.length} title${updated.length === 1 ? "" : "s"} · From ${item.price}`,
        };
      });
      return { ...prev, [tab]: list };
    });
  }

  async function loadTextbookSeries() {
    try {
      const listRes = await api.get<{ ok: boolean; data: { series: ApiSeries[] } }>("admin/catalogue/series", {
        params: { category: "textbooks" },
      });
      if (!listRes.data?.ok) {
        setTextbookProducts([]);
        return;
      }
      const rows = await Promise.all(
        listRes.data.data.series.map(async (s) => {
          const detailRes = await api.get<{
            ok: boolean;
            data: { items: ApiSeriesItem[]; marketingElements: Array<{ id: string }> };
          }>(`admin/catalogue/series/${s.id}`);
          const items = detailRes.data?.ok ? detailRes.data.data.items : [];
          const marketingCount = detailRes.data?.ok ? detailRes.data.data.marketingElements.length : 0;
          return mapApiSeriesToRow(s, items, marketingCount);
        }),
      );
      setTextbookProducts(rows);
    } catch {
      setTextbookProducts([]);
    }
  }

  useEffect(() => {
    if (tab === "textbooks") void loadTextbookSeries();
  }, [tab]);

  async function handleCreateTextbookSeries(input: TextbookSeriesCreateInput) {
    const res = await api.post<{ ok: boolean; data: { series: { id: string } } }>("admin/catalogue/series", {
      category: "textbooks",
      name: input.name,
      publisher: input.publisher,
      format: input.format,
      curriculum: input.curriculum,
      subject: input.subject,
      gradeFrom: input.gradeFrom,
      gradeTo: input.gradeTo,
      description: input.description,
      detailLine: input.detailLine,
      status: input.status,
      badges: input.badges,
      territories: input.territories,
    });
    const seriesId = res.data?.data?.series?.id;
    if (!seriesId) return;
    await Promise.all(
      input.marketingElements.map((m) =>
        api.post(`admin/catalogue/series/${seriesId}/marketing-elements`, {
          assetType: m.assetType,
          title: m.title,
          assetUrl: m.assetUrl,
          audienceStage: m.audienceStage,
          status: "Published",
        }),
      ),
    );
    await loadTextbookSeries();
  }

  async function handleCreateSeriesItem(input: CatalogueSeriesItemCreateInput) {
    const currentFolderId = new URLSearchParams(window.location.search).get("folder");
    if (!currentFolderId) return;
    const hasFiles = Boolean(input.coverImageFile || input.materialFile);
    if (hasFiles) {
      const fd = new FormData();
      fd.append("resourceType", input.resourceType);
      fd.append("title", input.title);
      if (input.subject) fd.append("subject", input.subject);
      fd.append("gradeLabel", input.gradeLabel);
      if (input.internalSku) fd.append("internalSku", input.internalSku);
      if (input.isbn) fd.append("isbn", input.isbn);
      fd.append("format", input.format);
      fd.append("price", String(input.price));
      fd.append("currencyCode", input.currency);
      fd.append("priceUnit", input.priceUnit);
      fd.append("status", input.status);
      if (input.materialLinkUrl) fd.append("materialLinkUrl", input.materialLinkUrl);
      if (input.inventoryNote) fd.append("inventoryNote", input.inventoryNote);
       if (input.coverImageFile) fd.append("coverImage", input.coverImageFile);
      if (input.materialFile) fd.append("materialFile", input.materialFile);
      await api.post(`admin/catalogue/series/${currentFolderId}/items`, fd, {
        onUploadProgress: (ev) => {
          if (ev.total) input.onProgress?.(Math.round((ev.loaded * 100) / ev.total));
        },
      });
    } else {
      await api.post(`admin/catalogue/series/${currentFolderId}/items`, {
        ...input,
        currencyCode: input.currency,
      }, {
        onUploadProgress: (ev) => {
          if (ev.total) input.onProgress?.(Math.round((ev.loaded * 100) / ev.total));
        },
      });
    }
    await loadTextbookSeries();
  }

  const filtered = useMemo(() => {
    if (!tab) return [];
    const needle = q.trim().toLowerCase();
    return products.filter((p) => {
      if (needle && !catalogueHaystack(p, tab).includes(needle)) return false;

      if (tab === "textbooks") {
        if (!matchesPublisher(p, tbPub, "textbooks")) return false;
        if (!matchesGradeBuckets(p, tbGrade)) return false;
        if (tbCurr !== TB_CURRICULUM_OPTIONS[0] && p.curriculum !== tbCurr) return false;
        if (tbFmt !== TB_FORMAT_OPTIONS[0] && p.format !== tbFmt) return false;
        if (tbStat !== TB_STATUS_OPTIONS[0] && p.status !== tbStat) return false;
      } else if (tab === "library") {
        if (libRead !== LIB_READING_OPTIONS[0] && p.readingLevel !== libRead) return false;
        if (libGenre !== LIB_GENRE_OPTIONS[0] && p.genre !== libGenre) return false;
        if (libLang !== LIB_LANGUAGE_OPTIONS[0] && p.language !== libLang) return false;
        if (!matchesPublisher(p, libPub, "library")) return false;
      } else if (tab === "kits") {
        if (kitType !== KIT_TYPE_OPTIONS[0]) {
          if (kitType === "STEM") {
            if (p.kitType !== "STEM" && !p.badges.some((b) => b.includes("STEM"))) return false;
          } else if (p.kitType !== kitType) {
            return false;
          }
        }
        if (!matchesPublisher(p, kitPub, "kits")) return false;
        if (!matchesGradeBuckets(p, kitGrade)) return false;
      }
      return true;
    });
  }, [
    products,
    tab,
    q,
    tbPub,
    tbGrade,
    tbCurr,
    tbFmt,
    tbStat,
    libRead,
    libGenre,
    libLang,
    libPub,
    kitType,
    kitPub,
    kitGrade,
  ]);

  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [ebookPreviewItem, setEbookPreviewItem] = useState<CatalogueLineItem | null>(null);

  const folderId = searchParams.get("folder");
  const folderProduct = tab && folderId
    ? products.find((p) => p.id === folderId)
    : undefined;

  const prevPathRef = useRef<string | null>(null);
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

  useEffect(() => {
    if (folderId && tab && !products.find((p) => p.id === folderId)) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.delete("folder");
        return next;
      });
    }
  }, [folderId, tab, products, setSearchParams]);

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

  if (!tab) return <Navigate to="/admin/cms/textbooks" replace />;

  if (folderProduct) {
    return (
      <div className="font-sans">
        <Toast />
        <CatalogueFolderDetailView
          tab={tab}
          product={folderProduct}
          t={t}
          onBack={closeFolder}
          onAddBook={() => setBookModalOpen(true)}
          onEditFolder={() => setEditOpen(true)}
          onViewItem={(itemId) => {
            const item = folderProduct.lineItems.find((li) => li.id === itemId);
            if (item) setEbookPreviewItem(item);
          }}
        />
        <CatalogueEbookPreviewModal
          open={ebookPreviewItem !== null}
          onClose={() => setEbookPreviewItem(null)}
          lineItem={ebookPreviewItem}
          folderName={folderProduct.name}
        />
        <CatalogueBookItemModal
          open={bookModalOpen}
          onClose={() => setBookModalOpen(false)}
          onSaved={show}
          mode="add"
          category={tab}
          onAdd={handleAddLineItem}
          onCreateItem={tab === "textbooks" ? handleCreateSeriesItem : undefined}
        />
        {tab === "textbooks" ? (
          <TextbookProductModal open={editOpen} onClose={() => setEditOpen(false)} onSaved={show} mode="edit" />
        ) : tab === "library" ? (
          <LibraryCatalogueModal open={editOpen} onClose={() => setEditOpen(false)} onSaved={show} mode="edit" />
        ) : (
          <KitCatalogueModal open={editOpen} onClose={() => setEditOpen(false)} onSaved={show} mode="edit" />
        )}
      </div>
    );
  }

  const selCls = "min-w-[130px] max-w-full rounded-lg border border-[#E2E0D9] bg-[#F5F4F0] px-3 py-2 text-[13px] text-[#1A1917] outline-none focus:border-[#0A3D62] sm:min-w-[140px]";

  return (
    <div className="font-sans">
      <Toast />

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0A3D62]">{meta.title}</h1>
          <p className="mt-1 max-w-3xl text-[13px] leading-relaxed text-[#5C5A55]">{meta.subtitle}</p>
        </div>
        <Button type="button" size="sm" className="shrink-0 bg-[#0A1628] text-white hover:bg-[#071E36]" onClick={() => setAddOpen(true)}>
          {meta.add}
        </Button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {(
          [
            ["textbooks", t("admin.pages.catalogue.tabTextbooks")],
            ["library", t("admin.pages.catalogue.tabLibrary")],
            ["kits", t("admin.pages.catalogue.tabKits")],
          ] as const
        ).map(([k, label]) => (
          <NavLink
            key={k}
            to={`/admin/cms/${k}`}
            className={({ isActive }) =>
              cn(
                "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
                isActive ? "border-[#0A3D62] bg-[#0A3D62] text-white" : "border-[#E2E0D9] bg-white text-[#5C5A55] hover:bg-[#F5F4F0]",
              )
            }
          >
            {label}
          </NavLink>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap items-end gap-2 rounded-xl border border-[#E2E0D9] bg-[#FAFAF8] p-3 sm:p-4">
        <div className="relative min-w-[min(100%,220px)] flex-[1_1_220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9A9890]" />
          <input
            type="search"
            className="w-full rounded-lg border border-[#E2E0D9] bg-white py-2.5 pl-9 pr-3 text-sm text-[#1A1917] outline-none focus:border-[#0A3D62]"
            placeholder={meta.searchPh}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label={meta.searchPh}
          />
        </div>

        {tab === "textbooks" ? (
          <>
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
            <select className={selCls} value={tbStat} onChange={(e) => setTbStat(e.target.value)}>
              {TB_STATUS_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </>
        ) : tab === "library" ? (
          <>
            <select className={selCls} value={libRead} onChange={(e) => setLibRead(e.target.value)}>
              {LIB_READING_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
            <select className={selCls} value={libGenre} onChange={(e) => setLibGenre(e.target.value)}>
              {LIB_GENRE_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
            <select className={selCls} value={libLang} onChange={(e) => setLibLang(e.target.value)}>
              {LIB_LANGUAGE_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
            <select className={selCls} value={libPub} onChange={(e) => setLibPub(e.target.value)}>
              {LIB_PUBLISHER_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </>
        ) : (
          <>
            <select className={selCls} value={kitType} onChange={(e) => setKitType(e.target.value)}>
              {KIT_TYPE_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
            <select className={selCls} value={kitPub} onChange={(e) => setKitPub(e.target.value)}>
              {KIT_PUBLISHER_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
            <select className={selCls} value={kitGrade} onChange={(e) => setKitGrade(e.target.value)}>
              {KIT_GRADE_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </>
        )}

        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="ml-auto shrink-0 border-[#DDD9D2] bg-white"
          onClick={() => setViewList((v) => !v)}
        >
          {viewList ? (
            <>
              <LayoutGrid className="mr-1.5 inline h-4 w-4" />
              {t("admin.pages.catalogueSegment.cardView")}
            </>
          ) : (
            <>
              <LayoutList className="mr-1.5 inline h-4 w-4" />
              {t("admin.pages.catalogueSegment.listView")}
            </>
          )}
        </Button>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#E2E0D9] bg-[#FAFAF8] py-16 text-center text-sm text-[#5C5A55]">
          {t("admin.pages.catalogueSegment.noResults")}
        </div>
      ) : viewList ? (
        <div className="overflow-hidden rounded-2xl border border-[#E2E0D9] bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse text-left text-[13.5px]">
              <thead className="border-b border-[#E2E0D9] bg-[#F5F4F0] text-[11px] font-semibold uppercase tracking-wide text-[#5C5A55]">
                <tr>
                  <th className="px-4 py-3">{t("admin.pages.catalogue.colProduct")}</th>
                  <th className="px-4 py-3">{t("admin.pages.catalogue.colPublisher")}</th>
                  <th className="px-4 py-3">{t("admin.pages.catalogue.colGrades")}</th>
                  <th className="px-4 py-3">{t("admin.pages.catalogue.colFormat")}</th>
                  <th className="px-4 py-3">{t("admin.pages.catalogueSegment.colDetail")}</th>
                  <th className="px-4 py-3">{t("admin.pages.catalogue.colPrice")}</th>
                  <th className="px-4 py-3">{t("admin.pages.catalogueSegment.colStatus")}</th>
                  <th className="px-4 py-3 text-right">{t("common.actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E0D9]">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FAFAF8]">
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        className="text-left font-semibold text-[#0A3D62] hover:underline"
                        onClick={() => openFolder(p.id)}
                      >
                        {p.name}
                      </button>
                    </td>
                    <td className="px-4 py-3">{p.publisher}</td>
                    <td className="px-4 py-3">{p.grades}</td>
                    <td className="px-4 py-3">{p.format}</td>
                    <td className="max-w-[200px] truncate px-4 py-3 text-[#5C5A55]" title={p.detailLine}>
                      {p.detailLine}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {p.lineItems.length > 0 ? p.folderPriceLabel : `${p.price}${p.priceUnit ?? ""}`}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "rounded-md px-2 py-0.5 text-[10px] font-bold uppercase",
                          p.status === "Published" && "bg-emerald-100 text-emerald-800",
                          p.status === "Draft" && "bg-amber-100 text-amber-900",
                          p.status === "Archived" && "bg-[#ECEAE4] text-[#5C5A55]",
                        )}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex flex-wrap justify-end gap-2">
                        <Button type="button" variant="secondary" size="sm" onClick={() => openFolder(p.id)}>
                          {t("common.view")}
                        </Button>
                        <Button type="button" size="sm" className="bg-[#0A3D62] text-white hover:bg-[#071E36]" onClick={() => setEditOpen(true)}>
                          {t("common.edit")}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
          {filtered.map((p) => (
            <CatalogueProductCard
              key={p.id}
              tab={tab}
              product={p}
              t={t}
              onOpenFolder={() => openFolder(p.id)}
              onEdit={() => setEditOpen(true)}
              onArchive={() => show(t("admin.pages.catalogueSegment.archived"))}
              onPublish={() => show(t("admin.pages.catalogueSegment.published"))}
            />
          ))}
        </div>
      )}

      {tab === "textbooks" ? (
        <>
          <TextbookProductModal
            open={addOpen}
            onClose={() => setAddOpen(false)}
            onSaved={show}
            mode="add"
            onAdd={handleAddCatalogue}
            onCreateSeries={handleCreateTextbookSeries}
          />
          <TextbookProductModal open={editOpen} onClose={() => setEditOpen(false)} onSaved={show} mode="edit" />
        </>
      ) : tab === "library" ? (
        <>
          <LibraryCatalogueModal open={addOpen} onClose={() => setAddOpen(false)} onSaved={show} mode="add" />
          <LibraryCatalogueModal open={editOpen} onClose={() => setEditOpen(false)} onSaved={show} mode="edit" />
        </>
      ) : (
        <>
          <KitCatalogueModal open={addOpen} onClose={() => setAddOpen(false)} onSaved={show} mode="add" />
          <KitCatalogueModal open={editOpen} onClose={() => setEditOpen(false)} onSaved={show} mode="edit" />
        </>
      )}
    </div>
  );
}
