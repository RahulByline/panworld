import type { TFunction } from "i18next";
import { cn } from "../../utils/cn";
import { Button } from "../../components/Button";
import type { ResourceRow } from "../../../data/admin/resourceLibrary";
import { getResourceLibraryIconForFormat } from "./resourceLibraryCardIcons";

type Props = {
  row: ResourceRow;
  t: TFunction;
  onPublish: () => void;
  onEdit: () => void;
  onDownload: () => void;
};

export function ResourceLibraryCard({ row, t, onPublish, onEdit, onDownload }: Props) {
  const Icon = getResourceLibraryIconForFormat(row.formatKind);
  const isDraft = row.tone === "draft";
  const isLink = row.formatKind === "link";

  return (
    <article
      className={cn(
        "flex flex-col rounded-2xl border border-[#E2E0D9] bg-white p-4 shadow-[0_1px_3px_rgba(10,61,98,0.06)]",
        isDraft && "border-[#E8DCC8]",
      )}
    >
      <div className="flex gap-3">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ring-1 ring-[#0A3D62]/10",
            isDraft ? "bg-[#FFF8E7] text-[#B7791F]" : "bg-[#F5F4F0] text-[#0A3D62]",
          )}
          aria-hidden
        >
          <Icon className="h-6 w-6" strokeWidth={1.35} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-[15px] font-semibold leading-snug text-[#1A1917]">{row.title}</h3>
          <p className="mt-1 text-[12px] leading-snug text-[#5C5A55]">{row.meta}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium",
            isDraft ? "bg-[#FDEBD0] text-[#7D4E10]" : "bg-[#E8F5E9] text-[#1E8449]",
          )}
        >
          {isDraft ? t("admin.pages.resources.draft") : t("admin.pages.resources.published")}
        </span>
        <span className="inline-flex items-center rounded-full bg-[#E8EAED] px-2.5 py-0.5 text-[11px] font-medium text-[#5C5A55]">
          {row.formatLabel}
        </span>
        <span className="inline-flex items-center rounded-full bg-[#E8EAED] px-2.5 py-0.5 text-[11px] font-medium text-[#5C5A55]">
          {row.publisher}
        </span>
        {row.ourBrand ? (
          <span className="inline-flex items-center rounded-full border border-[#C5B8E0] bg-[#F3F0FA] px-2.5 py-0.5 text-[11px] font-semibold text-[#5E35B1]">
            {t("admin.pages.publisherAccess.ourBrandBadge")}
          </span>
        ) : null}
      </div>

      <div className="mt-4 flex flex-col gap-2 border-t border-[#ECEAE4] pt-4">
        {isDraft ? (
          <Button type="button" className="w-full bg-[#0A3D62] hover:bg-[#071E36] text-white border-0" onClick={onPublish}>
            {t("admin.pages.resources.publish")}
          </Button>
        ) : (
          <Button type="button" variant="secondary" className="w-full" onClick={onDownload}>
            {isLink ? t("admin.pages.resources.openLink") : t("admin.pages.resources.download")}
          </Button>
        )}
        <div className="flex justify-center">
          <Button type="button" variant="ghost" size="sm" className="text-[#5C5A55]" onClick={onEdit}>
            {t("common.edit")}
          </Button>
        </div>
      </div>
    </article>
  );
}
