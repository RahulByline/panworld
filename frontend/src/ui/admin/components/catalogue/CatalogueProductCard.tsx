import type { TFunction } from "i18next";
import { Button } from "../../../components/Button";
import type { CatalogueHeaderKey, CatalogueProductRow, CatalogueTab } from "../../../../data/admin/catalogue";
import { kitMetaLine, libraryMetaLine, textbookMetaLine } from "../../../../data/admin/catalogue";
import { getCatalogueCardIcon } from "./catalogueCardIcons";

const HEADER_BG: Record<CatalogueHeaderKey, string> = {
  mh: "bg-[#FFF8E1]",
  math: "bg-[#FFF9C4]",
  kodeit: "bg-[#EDE7F6]",
  digital: "bg-[#E3F2FD]",
  oxford: "bg-[#E8F5E9]",
  teal: "bg-[#E0F2F1]",
  amber: "bg-[#FFF8E1]",
  mint: "bg-[#E8F5E9]",
  jolly: "bg-[#FCE4EC]",
  stem: "bg-[#E8EAF6]",
  robotics: "bg-[#EDE7F6]",
  art: "bg-[#F3F4F6]",
  scholastic: "bg-[#E1F5FE]",
  ng: "bg-[#E0F7FA]",
  default: "bg-[#F5F4F0]",
};

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

function metaForTab(tab: CatalogueTab, p: CatalogueProductRow): string {
  if (tab === "textbooks") return textbookMetaLine(p);
  if (tab === "library") return libraryMetaLine(p);
  return kitMetaLine(p);
}

function detailForTab(tab: CatalogueTab, p: CatalogueProductRow): string {
  if (tab === "kits" && p.kitDetailLine) return p.kitDetailLine;
  return p.detailLine;
}

type Props = {
  tab: CatalogueTab;
  product: CatalogueProductRow;
  t: TFunction;
  onEdit: () => void;
  onView: () => void;
  onArchive: () => void;
  onPublish: () => void;
};

export function CatalogueProductCard({ tab, product: p, t, onEdit, onView, onArchive, onPublish }: Props) {
  const headerBg = HEADER_BG[p.headerKey] ?? HEADER_BG.default;
  const showStock = tab === "kits" && p.status === "Published";
  const CardIcon = getCatalogueCardIcon(p.cardIcon);

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-[#E2E0D9] bg-white shadow-sm">
      <div className={`relative flex min-h-[152px] flex-col ${headerBg}`}>
        <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-2 px-2.5 pt-2.5">
          <div className="flex min-w-0 flex-1 flex-wrap content-start gap-1.5 pr-1">
            {p.badges.map((b) => (
              <Tag key={b} className={contentBadgeClass(b)}>
                {b.toUpperCase()}
              </Tag>
            ))}
            {showStock ? (
              <Tag className={inStockBadgeClass()}>{t("admin.pages.catalogueSegment.inStock").toUpperCase()}</Tag>
            ) : null}
          </div>
          <Tag className={`shrink-0 ${statusBadgeClass(p.status)}`}>{p.status.toUpperCase()}</Tag>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center px-3 pb-3 pt-12">
          <div
            className="flex h-[5.5rem] w-[5.5rem] items-center justify-center rounded-2xl bg-white/95 shadow-[0_6px_20px_rgba(10,61,98,0.1)] ring-1 ring-[#0A3D62]/[0.1]"
            aria-hidden
            title={p.name}
          >
            <CardIcon className="h-[2.4rem] w-[2.4rem] text-[#0A3D62]" strokeWidth={1.35} aria-hidden />
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col border-t border-[#E2E0D9] bg-white p-4">
        <div className="text-[15px] font-bold leading-snug text-[#1A1917]">{p.name}</div>
        <div className="mt-1.5 text-[12px] leading-relaxed text-[#5C5A55]">{metaForTab(tab, p)}</div>
        <div className="mt-1 text-[12px] text-[#9A9890]">{detailForTab(tab, p)}</div>
        <div className="mt-2 text-[13px] font-semibold text-[#1A1917]">
          {p.price}
          {p.priceUnit ? <span className="font-semibold text-[#5C5A55]"> {p.priceUnit}</span> : null}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#ECEAE4] pt-3">
          <Button type="button" size="sm" className="rounded-lg bg-[#0A1628] text-white hover:bg-[#071E36]" onClick={onEdit}>
            {t("common.edit")}
          </Button>
          <Button type="button" variant="secondary" size="sm" className="rounded-lg border-[#D4D0C8] bg-white" onClick={onView}>
            {t("common.view")}
          </Button>
          {p.status === "Draft" ? (
            <Button type="button" size="sm" className="rounded-lg bg-emerald-600 text-white hover:bg-emerald-700" onClick={onPublish}>
              {t("admin.pages.catalogueSegment.publish")}
            </Button>
          ) : p.status === "Published" ? (
            <button
              type="button"
              className="ml-1 text-xs font-medium text-[#9A9890] underline-offset-2 hover:text-[#5C5A55] hover:underline"
              onClick={onArchive}
            >
              {t("admin.pages.catalogueSegment.archive")}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
