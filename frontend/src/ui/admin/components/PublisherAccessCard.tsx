import type { TFunction } from "i18next";
import { BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "../../utils/cn";
import type { PublisherAccessRow } from "../../../data/admin/publisherAccess";

function PublisherCardLogo({
  publisherLogoUrl,
  ourBrand,
}: {
  publisherLogoUrl?: string;
  ourBrand?: boolean;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  useEffect(() => {
    setImgFailed(false);
  }, [publisherLogoUrl]);
  const showImg = Boolean(publisherLogoUrl) && !imgFailed;

  return (
    <div
      className={cn(
        "flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl ring-1 ring-black/[0.06]",
        ourBrand ? "bg-[#EDE7F6]" : "bg-slate-50",
      )}
      aria-hidden
    >
      {showImg ? (
        <img
          src={publisherLogoUrl}
          alt=""
          loading="lazy"
          className="h-full w-full object-contain p-2"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <BookOpen
          className={cn("h-7 w-7", ourBrand ? "text-[#5E35B1]" : "text-[#0A3D62]")}
          strokeWidth={1.5}
        />
      )}
    </div>
  );
}

type Props = {
  row: PublisherAccessRow;
  t: TFunction;
  credentialEnabled: boolean;
  onOpenDetail: () => void;
  onToggleCredential: () => void;
  onVerify: () => void;
  onQueue: () => void;
  onRenew: () => void;
  onEdit: () => void;
  onAssignSchool: () => void;
};

function formatValidityStat(value: string | undefined, t: TFunction): string {
  if (value === undefined || value === "") return "—";
  if (value === "—") return "—";
  if (/^\d+$/.test(value)) {
    return `${value}${t("admin.pages.publisherAccess.cardStatDaysSuffix")}`;
  }
  return value;
}

function cardStatusLabel(row: PublisherAccessRow, credentialEnabled: boolean, t: TFunction): string {
  if (!credentialEnabled) return t("admin.pages.publisherAccess.cardStatusCredentialOff");
  if (row.lastTone === "ok") return t("admin.pages.publisherAccess.cardStatusActive");
  if (row.lastTone === "warn") return t("admin.pages.publisherAccess.cardStatusAttention");
  return t("admin.pages.publisherAccess.cardStatusExpiredShort");
}

export function PublisherAccessCard({
  row,
  t,
  credentialEnabled,
  onOpenDetail,
  onToggleCredential,
  onVerify,
  onQueue,
  onRenew,
  onEdit,
  onAssignSchool,
}: Props) {
  const isExpired = row.lastTone === "expired";
  const primaryBrand = row.ourBrand;
  const schoolsCount = row.schoolShares.length;
  const validityDisplay = formatValidityStat(row.validityStat, t);
  const statusDisplay = cardStatusLabel(row, credentialEnabled, t);

  return (
    <article
      className={cn(
        "flex flex-col gap-5 rounded-3xl border bg-white p-6 shadow-[0_8px_32px_rgba(15,23,42,0.07)]",
        primaryBrand && "border-2 border-[#B39DDB] ring-1 ring-[#7E57C2]/15",
        !primaryBrand && isExpired && "border-[#E8B4B4]",
        !primaryBrand && !isExpired && "border-[#E8E6E1]",
        !credentialEnabled && "opacity-[0.92]",
      )}
    >
      <div className="flex gap-4">
        <PublisherCardLogo publisherLogoUrl={row.publisherLogoUrl} ourBrand={primaryBrand} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className="text-lg font-bold leading-snug tracking-tight text-[#0F0F0F]">{row.title}</h3>
            {row.ourBrand ? (
              <span className="shrink-0 rounded-full border border-[#7E57C2]/35 bg-[#F3E5F5] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#5E35B1]">
                {t("admin.pages.publisherAccess.ourBrandBadge")}
              </span>
            ) : null}
          </div>
          {row.subtitle ? (
            <p className="mt-1 text-[13px] font-medium leading-snug text-[#6B6960]">{row.subtitle}</p>
          ) : null}
        </div>
      </div>

      <p className="text-[13px] leading-relaxed text-[#5C5A55]">{row.accessLine}</p>

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="rounded-xl border border-[#ECEAE4] bg-[#FAFAF8] px-2 py-3 text-center shadow-[0_1px_0_rgba(255,255,255,0.9)] sm:px-3">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-[#9A9890]">
            {t("admin.pages.publisherAccess.cardStatSchools")}
          </div>
          <div className="mt-1.5 text-xl font-bold tabular-nums text-[#0F0F0F]">{schoolsCount}</div>
        </div>
        <div className="rounded-xl border border-[#ECEAE4] bg-[#FAFAF8] px-2 py-3 text-center shadow-[0_1px_0_rgba(255,255,255,0.9)] sm:px-3">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-[#9A9890]">
            {t("admin.pages.publisherAccess.cardStatValidity")}
          </div>
          <div className="mt-1.5 text-xl font-bold tabular-nums text-[#0F0F0F]">{validityDisplay}</div>
        </div>
        <div className="rounded-xl border border-[#ECEAE4] bg-[#FAFAF8] px-2 py-3 text-center shadow-[0_1px_0_rgba(255,255,255,0.9)] sm:px-3">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-[#9A9890]">
            {t("admin.pages.publisherAccess.cardStatStatus")}
          </div>
          <div
            className={cn(
              "mt-1.5 text-sm font-bold leading-tight text-[#0F0F0F]",
              !credentialEnabled && "text-[#6B6960]",
              credentialEnabled && row.lastTone === "ok" && "text-[#1E8449]",
              credentialEnabled && row.lastTone === "warn" && "text-[#B85C00]",
              credentialEnabled && row.lastTone === "expired" && "text-[#C0392B]",
            )}
          >
            {statusDisplay}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className="rounded-xl bg-[#0F0F0F] py-3.5 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-[#1a1a1a] focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#0A3D62]/40"
          onClick={onOpenDetail}
        >
          {t("admin.pages.publisherAccess.cardViewDetails")}
        </button>
        <button
          type="button"
          aria-pressed={credentialEnabled}
          aria-label={t("admin.pages.publisherAccess.cardCredentialToggleAria")}
          className={cn(
            "rounded-xl py-3.5 text-center text-sm font-semibold text-white shadow-sm transition focus-visible:outline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0A3D62]/35",
            credentialEnabled ? "bg-[#666666] hover:bg-[#5c5c5c]" : "bg-[#1E8449] hover:bg-[#1a753f]",
          )}
          onClick={onToggleCredential}
        >
          {credentialEnabled
            ? t("admin.pages.publisherAccess.cardCredentialDisable")
            : t("admin.pages.publisherAccess.cardCredentialEnable")}
        </button>
      </div>

      <div className="border-t border-[#ECEAE4] pt-4">
        <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-wide text-[#9A9890]">
          {t("admin.pages.publisherAccess.cardSecondaryActions")}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[12px] font-medium text-[#5C5A55]">
          {row.action === "test" ? (
            <button type="button" className="underline-offset-2 hover:text-[#0A3D62] hover:underline" onClick={onVerify}>
              {t("admin.pages.publisherAccess.test")}
            </button>
          ) : row.action === "pending" ? (
            <button type="button" className="underline-offset-2 hover:text-[#0A3D62] hover:underline" onClick={onQueue}>
              {t("admin.pages.publisherAccess.pending")} ({row.pendingCount ?? 0})
            </button>
          ) : (
            <button type="button" className="underline-offset-2 hover:text-[#0A3D62] hover:underline" onClick={onRenew}>
              {t("admin.pages.publisherAccess.renew")}
            </button>
          )}
          <span className="text-[#D4D2CD]" aria-hidden>
            |
          </span>
          <button
            type="button"
            className="underline-offset-2 hover:text-[#0A3D62] hover:underline"
            onClick={onAssignSchool}
          >
            {t("admin.pages.publisherAccess.assignSchool")}
          </button>
          <span className="text-[#D4D2CD]" aria-hidden>
            |
          </span>
          <button type="button" className="underline-offset-2 hover:text-[#0A3D62] hover:underline" onClick={onEdit}>
            {t("common.edit")}
          </button>
        </div>
      </div>
    </article>
  );
}
