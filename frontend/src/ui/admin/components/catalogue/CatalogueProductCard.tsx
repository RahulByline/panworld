import type { TFunction } from "i18next";
import { Heart, X } from "lucide-react";
import { Button } from "../../../components/Button";
import type { CatalogueProductRow, CatalogueTab } from "../../../../data/admin/catalogue";
import {
  defaultLineItemCoverUrl,
  kitMetaLineParts,
  libraryMetaLineParts,
  textbookMetaLineParts,
} from "../../../../data/admin/catalogue";
import { knowledgeCardThemeFromId } from "../../../school/KnowledgeProductCard";
import { cn } from "../../../utils/cn";
import { stripHtml, truncate } from "../../../utils/text";

function collageCoverUrls(p: CatalogueProductRow): string[] {
  return [0, 1, 2, 3].map((i) => {
    const li = p.lineItems[i];
    if (li) return li.coverImageUrl ?? defaultLineItemCoverUrl(li.id);
    return defaultLineItemCoverUrl(`${p.id}-collage-${i}`);
  });
}

function FolderCoverCollage({ product }: { product: CatalogueProductRow }) {
  const urls = collageCoverUrls(product);
  return (
    <div className="pw-kc-right pw-kc-right--collage" aria-hidden>
      <div className="pw-kc-collage-grid">
        {urls.map((src, i) => (
          <div key={`${product.id}-collage-${i}`} className="pw-kc-collage-cell">
            <img src={src} alt="" loading="lazy" decoding="async" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Pastel fill + strong text + light ring — matches admin reference cards */
function contentBadgeClass(label: string): string {
  const s = label.toLowerCase();
  if (s.includes("partner")) return "bg-purple-500/[0.16] text-purple-950 ring-1 ring-purple-600/20";
  if (s.includes("phonics")) return "bg-teal-500/[0.18] text-teal-950 ring-1 ring-teal-600/22";
  if (s.includes("science kit")) return "bg-sky-500/[0.18] text-sky-950 ring-1 ring-sky-600/22";
  if (s === "stem") return "bg-amber-400/[0.35] text-amber-950 ring-1 ring-amber-600/25";
  if (s.includes("our brand")) return "bg-[#0A3D62]/[0.12] text-[#062a47] ring-1 ring-[#0A3D62]/25";
  if (s.includes("digital")) return "bg-blue-500/[0.15] text-blue-950 ring-1 ring-blue-600/22";
  if (s.includes("new ed") || s.includes("2025")) return "bg-amber-500/[0.2] text-amber-950 ring-1 ring-amber-600/25";
  if (s.includes("ncc")) return "bg-violet-500/[0.15] text-violet-950 ring-1 ring-violet-600/20";
  if (s.includes("core ela")) return "bg-indigo-500/[0.15] text-indigo-950 ring-1 ring-indigo-600/22";
  if (s.includes("draft")) return "bg-orange-400/[0.22] text-orange-950 ring-1 ring-orange-500/25";
  if (s.includes("arabic")) return "bg-emerald-600/[0.14] text-emerald-950 ring-1 ring-emerald-700/20";
  if (s.includes("non-fiction") || s.includes("non fiction") || s.includes("ell")) return "bg-slate-500/[0.12] text-slate-900 ring-1 ring-slate-500/18";
  if (s.includes("fiction") || s.includes("leveled")) return "bg-cyan-500/[0.12] text-cyan-950 ring-1 ring-cyan-600/18";
  if (/\d+\s*titles?|bundle|phonics\b/i.test(label)) return "bg-stone-500/[0.1] text-stone-800 ring-1 ring-stone-500/15";
  return "bg-amber-500/[0.18] text-amber-950 ring-1 ring-amber-600/22";
}

function inStockBadgeClass(): string {
  return "bg-emerald-500/[0.18] text-emerald-950 ring-1 ring-emerald-600/30";
}

function statusBadgeClass(status: CatalogueProductRow["status"]): string {
  if (status === "Published") return "bg-emerald-500/[0.14] text-emerald-900 ring-1 ring-emerald-600/28";
  if (status === "Draft") return "bg-[#F59E0B]/[0.2] text-[#78350f] ring-1 ring-amber-600/30";
  return "bg-stone-400/[0.15] text-stone-800 ring-1 ring-stone-500/20";
}

function Tag({ children, className }: { children: string; className: string }) {
  return (
    <span
      className={`inline-flex max-w-full items-center rounded-md px-2 py-1 text-[9px] font-extrabold uppercase leading-none tracking-[0.06em] ${className}`}
    >
      {children}
    </span>
  );
}

function metaPartsForTab(tab: CatalogueTab, p: CatalogueProductRow) {
  if (tab === "textbooks") return textbookMetaLineParts(p);
  if (tab === "library") return libraryMetaLineParts(p);
  return kitMetaLineParts(p);
}

function detailForTab(tab: CatalogueTab, p: CatalogueProductRow): string {
  if (p.lineItems.length > 0) return p.folderDetailSummary;
  if (tab === "kits" && p.kitDetailLine) return p.kitDetailLine;
  return p.detailLine;
}

function eyebrowForTab(tab: CatalogueTab, t: TFunction): string {
  if (tab === "textbooks") return t("admin.pages.catalogueCard.eyebrowTextbook");
  if (tab === "library") return t("admin.pages.catalogueCard.eyebrowLibrary");
  return t("admin.pages.catalogueCard.eyebrowKit");
}

type Props = {
  tab: CatalogueTab;
  product: CatalogueProductRow;
  t: TFunction;
  /** `wishlist`: school card with remove (✕) instead of heart */
  mode?: "admin" | "school" | "wishlist";
  onEdit: () => void;
  onArchive: () => void;
  onPublish: () => void;
  onOpenFolder: () => void;
  onAddToWishlist?: () => void;
  onAddToRfq?: () => void;
  onRemoveFromWishlist?: () => void;
};

export function CatalogueProductCard({
  tab,
  product: p,
  t,
  mode = "admin",
  onEdit,
  onArchive,
  onPublish,
  onOpenFolder,
  onAddToWishlist,
  onAddToRfq,
  onRemoveFromWishlist,
}: Props) {
  const showStock = tab === "kits" && p.status === "Published";
  const theme = knowledgeCardThemeFromId(p.id);
  const eyebrow = eyebrowForTab(tab, t);
  const subLine = `${eyebrow} · ${p.curriculum}`;
  const metaParts = metaPartsForTab(tab, p);

  return (
    <div
      className={cn("pw-kc-card pw-kc-card--catalogue-grid pw-kc-card--admin-cms", `pw-kc-card--${theme}`)}
      role="group"
      aria-label={p.name}
    >
      <div className="pw-kc-left">
        <div className="pw-kc-left-inner">
          <div className="pw-kc-badge flex flex-wrap items-start justify-between gap-2">
            <div className="flex min-w-0 flex-1 flex-wrap content-start gap-1.5">
              {p.badges.map((b) => (
                <Tag key={b} className={contentBadgeClass(b)}>
                  {b.toUpperCase()}
                </Tag>
              ))}
              {showStock ? (
                <Tag className={inStockBadgeClass()}>{t("admin.pages.catalogueSegment.inStock").toUpperCase()}</Tag>
              ) : null}
            </div>
            {mode === "admin" ? <Tag className={`shrink-0 ${statusBadgeClass(p.status)}`}>{p.status.toUpperCase()}</Tag> : null}
          </div>

          <div className="pw-kc-subtitle">{subLine}</div>

          <button
            type="button"
            className="pw-kc-title block w-full cursor-pointer border-0 bg-transparent p-0 text-left font-inherit hover:opacity-90"
            onClick={onOpenFolder}
          >
            {p.name}
          </button>

          <p className="pw-kc-body pw-kc-body--meta">
            <span className="pw-kc-publisher">{metaParts.publisher}</span>
            <span className="pw-kc-meta-sep"> · </span>
            <span className="pw-kc-meta-rest">{metaParts.rest}</span>
          </p>
          {detailForTab(tab, p) ? (
            <p className="mt-0.5 text-[11px] font-light leading-snug text-[#78909c]" title={stripHtml(detailForTab(tab, p))}>
              {truncate(stripHtml(detailForTab(tab, p)), 160)}
            </p>
          ) : null}

          <p className="pw-kc-price">
            {p.lineItems.length > 0 ? (
              <span>{p.folderPriceLabel}</span>
            ) : (
              <>
                {p.price}
                {p.priceUnit ? <span className="font-semibold text-[#5C5A55]"> {p.priceUnit}</span> : null}
              </>
            )}
          </p>

          {mode === "school" || mode === "wishlist" ? (
            <div className="pw-kc-admin-actions flex flex-nowrap items-center gap-2">
              <Button type="button" variant="secondary" size="sm" className="rounded-lg border-[#D4D0C8] bg-white" onClick={onOpenFolder}>
                {t("common.view")}
              </Button>
              {mode === "wishlist" ? (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  aria-label={t("mvpPages.wishlist.removeAria")}
                  title={t("mvpPages.wishlist.removeAria")}
                  className="min-w-0 rounded-lg border-[#D4D0C8] bg-white px-2.5 text-[#9A9890] hover:text-red-700"
                  onClick={onRemoveFromWishlist}
                >
                  <X className="h-4 w-4" aria-hidden />
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  aria-label={t("mvpPages.catalogue.addWishlist")}
                  title={t("mvpPages.catalogue.addWishlist")}
                  className="min-w-0 rounded-lg border-[#D4D0C8] bg-white px-2.5"
                  onClick={onAddToWishlist}
                >
                  <Heart className="h-4 w-4" aria-hidden />
                </Button>
              )}
              <Button
                type="button"
                size="sm"
                className="whitespace-nowrap rounded-lg bg-[#0A1628] text-white hover:bg-[#071E36]"
                onClick={onAddToRfq}
              >
                {t("mvpPages.catalogue.addRfq")}
              </Button>
            </div>
          ) : (
            <div className="pw-kc-admin-actions">
              <Button type="button" variant="secondary" size="sm" className="rounded-lg border-[#D4D0C8] bg-white" onClick={onOpenFolder}>
                {t("common.view")}
              </Button>
              <Button type="button" size="sm" className="rounded-lg bg-[#0A1628] text-white hover:bg-[#071E36]" onClick={onEdit}>
                {t("common.edit")}
              </Button>
              {p.status === "Draft" ? (
                <Button type="button" size="sm" className="rounded-lg bg-emerald-600 text-white hover:bg-emerald-700" onClick={onPublish}>
                  {t("admin.pages.catalogueSegment.publish")}
                </Button>
              ) : p.status === "Published" ? (
                <button
                  type="button"
                  className="rounded-lg px-2 py-1.5 text-xs font-medium text-[#9A9890] underline-offset-2 hover:text-[#5C5A55] hover:underline"
                  onClick={onArchive}
                >
                  {t("admin.pages.catalogueSegment.archive")}
                </button>
              ) : null}
            </div>
          )}
        </div>
      </div>

      <FolderCoverCollage product={p} />
    </div>
  );
}
