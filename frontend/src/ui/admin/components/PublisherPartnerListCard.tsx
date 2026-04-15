import type { TFunction } from "i18next";
import { BookOpen } from "lucide-react";
import { useEffect, useState, type CSSProperties } from "react";
import { Button } from "../../components/Button";
import {
  publisherInitials,
  resolvePublisherBrandAccent,
  type PublisherPartnerRow,
} from "../../../data/admin/publishers";
import { cn } from "../../utils/cn";
import { publisherStatusClass, publisherStatusLabel } from "./PublisherPartnerModals";

function extractEstYear(partnerSince?: string): string | null {
  if (!partnerSince?.trim()) return null;
  const m = partnerSince.match(/(\d{4})/);
  return m ? m[1] : partnerSince.trim();
}

function leftPanelBackground(accent: string): CSSProperties {
  return {
    background: `linear-gradient(145deg, color-mix(in srgb, ${accent} 22%, #FFFCF7) 0%, color-mix(in srgb, ${accent} 9%, #EDE8DC) 100%)`,
  };
}

function initialsTileStyle(accent: string): CSSProperties {
  return {
    backgroundColor: `color-mix(in srgb, ${accent} 30%, white)`,
    color: accent,
    boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${accent} 35%, transparent)`,
  };
}

function PublisherCardLogoPanel({
  logoUrl,
  accent,
  name,
}: {
  logoUrl?: string;
  accent: string;
  name: string;
}) {
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    setFailed(false);
  }, [logoUrl]);
  const showImg = Boolean(logoUrl) && !failed;
  const initials = publisherInitials(name);

  if (showImg) {
    return (
      <div
        className="relative flex h-full min-h-[132px] w-full items-center justify-center overflow-hidden"
        style={leftPanelBackground(accent)}
      >
        <img
          src={logoUrl}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div
      className="flex h-full min-h-[132px] w-full items-center justify-center p-4"
      style={leftPanelBackground(accent)}
    >
      <div
        className="flex h-[88px] w-[88px] items-center justify-center rounded-xl text-2xl font-bold tracking-tight"
        style={initialsTileStyle(accent)}
      >
        {initials}
      </div>
    </div>
  );
}

type Props = {
  row: PublisherPartnerRow;
  t: TFunction;
  onOpenDetail: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function PublisherPartnerListCard({ row, t, onOpenDetail, onEdit, onDelete }: Props) {
  const year = extractEstYear(row.partnerSince);
  const accent = resolvePublisherBrandAccent(row);

  return (
    <article
      role="button"
      tabIndex={0}
      className={cn(
        "group relative flex cursor-pointer overflow-hidden rounded-xl border-2 bg-[#FFFDF5] transition",
        "hover:shadow-lg focus-visible:outline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#5C5A55]/25",
      )}
      style={{
        borderColor: accent,
        boxShadow: `0 4px 20px color-mix(in srgb, ${accent} 14%, transparent)`,
      }}
      onClick={onOpenDetail}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpenDetail();
        }
      }}
    >
      <div className="relative w-[35%] min-w-[100px] shrink-0 sm:w-[36%]">
        <PublisherCardLogoPanel logoUrl={row.logoUrl} accent={accent} name={row.name} />
      </div>

      <div className="relative flex min-w-0 flex-1 flex-col justify-center bg-white px-3 py-3 sm:px-4 sm:py-4">
        <div className="absolute right-3 top-3 z-10 flex gap-1.5">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="border-[#E8E0D5] bg-white/95 text-[#4B3621] hover:bg-white"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            {t("common.edit")}
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="border-[#F0D0CF] bg-white/95 text-[#B42318] hover:bg-[#FFF6F6]"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            {t("admin.pages.publishers.delete")}
          </Button>
        </div>

        <div className="mb-2 flex items-center justify-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: accent }}>
            {t("admin.pages.publishers.cardEst")}
          </span>
          <BookOpen className="h-5 w-5 shrink-0" strokeWidth={1.35} aria-hidden style={{ color: accent }} />
          {year ? (
            <span className="font-serif text-[12px] font-bold tabular-nums" style={{ color: accent }}>
              {year}
            </span>
          ) : (
            <span className="text-[11px] font-semibold opacity-60" style={{ color: accent }}>
              —
            </span>
          )}
        </div>

        <h2 className="text-center font-serif text-[1.08rem] font-bold leading-tight text-[#4B3621] sm:text-[1.2rem]">
          {row.name}
        </h2>

        <div className="mt-2 flex items-center justify-center gap-1.5">
          <span className="h-px w-6 max-w-[20%] shrink sm:w-10" style={{ backgroundColor: `color-mix(in srgb, ${accent} 45%, transparent)` }} aria-hidden />
          <span
            className="text-center text-[10px] font-semibold uppercase tracking-[0.2em] sm:text-[11px]"
            style={{ color: accent }}
          >
            {t("admin.pages.publishers.cardTagline")}
          </span>
          <span className="h-px w-6 max-w-[20%] shrink sm:w-10" style={{ backgroundColor: `color-mix(in srgb, ${accent} 45%, transparent)` }} aria-hidden />
        </div>

        <p className="mt-1 text-center text-[10px] leading-snug text-[#6B5344] sm:text-[11px]">{row.territory}</p>

        <div
          className="mt-2.5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 border-t pt-2 text-[10px] text-[#5C5A55]"
          style={{ borderColor: `color-mix(in srgb, ${accent} 22%, #E8E0D5)` }}
        >
          <span className="font-mono text-[9px] text-[#0A3D62] sm:text-[10px]">{row.contact}</span>
          <span className="text-[#C4B8A8]" aria-hidden>
            ·
          </span>
          <span className="tabular-nums">
            {t("admin.pages.publishers.colSchools")}: {row.activeSchools}
          </span>
          <span className="text-[#C4B8A8]" aria-hidden>
            ·
          </span>
          <span
            className={cn(
              "inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
              publisherStatusClass(row.status),
            )}
          >
            {publisherStatusLabel(row.status, t)}
          </span>
        </div>
      </div>
    </article>
  );
}
