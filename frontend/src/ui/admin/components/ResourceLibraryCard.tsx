import type { TFunction } from "i18next";
import { cn } from "../../utils/cn";
import { Button } from "../../components/Button";
import type { ResourceRow } from "../../../data/admin/resourceLibrary";
import { getResourceLibraryIconForFormat } from "./resourceLibraryCardIcons";
import { Bookmark, BadgeCheck } from "lucide-react";

type Props = {
  row: ResourceRow;
  t: TFunction;
  onPublish: () => void;
  onEdit: () => void;
  onDownload: () => void;
};

/** Pull size, downloads, format out of the meta string for the stats row */
function parseMetaStats(meta: string) {
  const parts = meta.split("·").map((s) => s.trim());
  // parts[0] = publisher, parts[1] = format label, rest = size / downloads / etc.
  const stats = parts.slice(2).filter(Boolean);
  return stats;
}

const BANNER_COLORS: Record<string, string> = {
  pdf:    "from-[#FF6B6B]/20 to-[#FF6B6B]/5 text-[#C0392B]",
  pptx:   "from-[#FF9A3C]/20 to-[#FF9A3C]/5 text-[#D35400]",
  docx:   "from-[#4A90D9]/20 to-[#4A90D9]/5 text-[#1A5276]",
  xlsx:   "from-[#27AE60]/20 to-[#27AE60]/5 text-[#1E8449]",
  sheet:  "from-[#27AE60]/20 to-[#27AE60]/5 text-[#1E8449]",
  audio:  "from-[#9B59B6]/20 to-[#9B59B6]/5 text-[#6C3483]",
  video:  "from-[#2980B9]/20 to-[#2980B9]/5 text-[#1A5276]",
  image:  "from-[#F39C12]/20 to-[#F39C12]/5 text-[#9A7D0A]",
  zip:    "from-[#7F8C8D]/20 to-[#7F8C8D]/5 text-[#4D5656]",
  folder: "from-[#F1C40F]/20 to-[#F1C40F]/5 text-[#9A7D0A]",
  link:   "from-[#1ABC9C]/20 to-[#1ABC9C]/5 text-[#0E6655]",
  other:  "from-[#BDC3C7]/20 to-[#BDC3C7]/5 text-[#5D6D7E]",
};

export function ResourceLibraryCard({ row, t, onPublish, onEdit, onDownload }: Props) {
  const Icon = getResourceLibraryIconForFormat(row.formatKind);
  const isDraft = row.tone === "draft";
  const isLink = row.formatKind === "link";
  const isFolder = row.formatKind === "folder";
  const bannerColor = BANNER_COLORS[row.formatKind] ?? BANNER_COLORS.other;
  const stats = parseMetaStats(row.meta);

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-[#E2E0D9] bg-white shadow-sm">

      {/* Banner area — coloured gradient with large icon, like the photo in the reference */}
      <div className={cn("relative flex h-56 items-center justify-center bg-gradient-to-b", bannerColor)}>
        <Icon className="h-14 w-14 opacity-80" strokeWidth={1.1} />
        {/* Bookmark / save button top-right */}
        <button
          type="button"
          aria-label="Save resource"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/70 text-[#5C5A55] backdrop-blur-sm hover:bg-white"
          onClick={onEdit}
        >
          <Bookmark className="h-4 w-4" />
        </button>
        {/* Format pill bottom-left */}
        <span className="absolute bottom-3 left-3 rounded-full bg-white/80 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#1A1917] backdrop-blur-sm">
          {row.formatLabel}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-4">

        {/* Top content */}
        <div>
          {/* Title + status badge */}
          <div className="flex items-start gap-1.5">
            <h3 className="flex-1 text-[14px] font-bold leading-snug text-[#1A1917]">{row.title}</h3>
            <BadgeCheck
              className={cn("mt-0.5 h-4 w-4 shrink-0", isDraft ? "text-[#B7791F]" : "text-[#2980B9]")}
              aria-label={isDraft ? "Draft" : "Published"}
            />
          </div>

          {/* Publisher as subtitle */}
          <p className="mt-1 text-[12px] leading-snug text-[#5C5A55]">{row.publisher}</p>

          {/* Description — 2 lines */}
          {row.description ? (
            <p className="mt-1.5 line-clamp-2 text-[12px] leading-snug text-[#5C5A55]">{row.description}</p>
          ) : null}

          {/* Stats row */}
          {stats.length > 0 ? (
            <div className="mt-3 flex items-center divide-x divide-[#E2E0D9]">
              {stats.map((s, i) => (
                <div key={i} className={cn("flex flex-col items-center px-3 first:pl-0 last:pr-0", i === 0 && "pl-0")}>
                  <span className="text-[13px] font-bold text-[#1A1917]">{s.split(" ")[0]}</span>
                  <span className="text-[10px] text-[#9A9890]">{s.split(" ").slice(1).join(" ") || "—"}</span>
                </div>
              ))}
            </div>
          ) : null}

          {/* Our brand tag */}
          {row.ourBrand ? (
            <div className="mt-2">
              <span className="inline-flex items-center rounded-full border border-[#C5B8E0] bg-[#F3F0FA] px-2.5 py-0.5 text-[11px] font-semibold text-[#5E35B1]">
                {t("admin.pages.publisherAccess.ourBrandBadge")}
              </span>
            </div>
          ) : null}
        </div>

        {/* CTA button — pinned to bottom */}
        <div className="mt-0">
          {isDraft ? (
            <Button
              type="button"
              className="w-full rounded-full bg-[#0A1628] text-white hover:bg-[#071E36]"
              onClick={onPublish}
            >
              {t("admin.pages.resources.publish")}
            </Button>
          ) : (
            <Button
              type="button"
              className="w-full rounded-full bg-[#0A1628] text-white hover:bg-[#071E36]"
              onClick={onDownload}
            >
              {isFolder ? "Open folder" : isLink ? t("admin.pages.resources.openLink") : t("admin.pages.resources.download")}
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
