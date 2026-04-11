import type { TFunction } from "i18next";
import { cn } from "../../utils/cn";
import { Button } from "../../components/Button";
import type { PublisherAccessRow } from "../../../data/admin/publisherAccess";
import { getPublisherAccessCardIcon } from "./publisherAccessCardIcons";

type Props = {
  row: PublisherAccessRow;
  t: TFunction;
  onVerify: () => void;
  onQueue: () => void;
  onRenew: () => void;
  onEdit: () => void;
  onAssignSchool: () => void;
};

export function PublisherAccessCard({ row, t, onVerify, onQueue, onRenew, onEdit, onAssignSchool }: Props) {
  const Icon = getPublisherAccessCardIcon(row.cardIcon);
  const isExpired = row.lastTone === "expired";
  const primaryBrand = row.ourBrand;

  return (
    <article
      className={cn(
        "flex flex-col rounded-2xl border bg-white p-4 shadow-[0_1px_3px_rgba(10,61,98,0.06)]",
        primaryBrand && "border-2 border-[#7E57C2] shadow-[0_4px_20px_rgba(126,87,194,0.12)]",
        !primaryBrand && isExpired && "border-[#E8B4B4]",
        !primaryBrand && !isExpired && "border-[#E2E0D9]",
      )}
    >
      <div className="flex gap-3">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ring-1 ring-[#0A3D62]/10",
            primaryBrand ? "bg-[#EDE7F6] text-[#5E35B1]" : "bg-[#F5F4F0] text-[#0A3D62]",
          )}
          aria-hidden
        >
          <Icon className="h-6 w-6" strokeWidth={1.35} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className="text-[15px] font-semibold leading-snug text-[#1A1917]">{row.title}</h3>
            {row.ourBrand ? (
              <span className="shrink-0 rounded-full border border-[#7E57C2]/40 bg-[#F3E5F5] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#5E35B1]">
                {t("admin.pages.publisherAccess.ourBrandBadge")}
              </span>
            ) : null}
          </div>
          {row.subtitle ? <p className="mt-1 text-[12px] leading-snug text-[#5C5A55]">{row.subtitle}</p> : null}
        </div>
      </div>

      <p className="mt-3 break-words font-mono text-[11.5px] leading-relaxed text-[#1A1917]">{row.accessLine}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium",
            row.type === "School-specific"
              ? "bg-[#FDEBD0] text-[#7D4E10]"
              : "bg-[#E8EAED] text-[#5C5A55]",
          )}
        >
          {row.type === "School-specific"
            ? t("admin.pages.publisherAccess.loginTypeSchool")
            : t("admin.pages.publisherAccess.loginTypeShared")}
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium",
            row.type === "School-specific" ? "bg-[#FFF3E0] text-[#B85C00]" : "bg-[#E8F5E9] text-[#1E8449]",
          )}
        >
          <span
            className={cn(
              "inline-block h-1.5 w-1.5 rounded-full",
              row.type === "School-specific" ? "bg-[#E8912D]" : "bg-[#27AE60]",
            )}
            aria-hidden
          />
          {row.type === "School-specific"
            ? t("admin.pages.publisherAccess.deliveryDelayed")
            : t("admin.pages.publisherAccess.deliveryInstant")}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[12px]">
        <span className="text-[#5C5A55]">
          {t("admin.pages.publisherAccess.uses30d")}{" "}
          <span className="font-semibold text-[#0A3D62]">{row.accesses30d}</span>
        </span>
        <span className="text-[#5C5A55]">
          {t("admin.pages.publisherAccess.lastVerifiedLabel")}{" "}
          <span
            className={cn(
              "font-medium",
              row.lastTone === "ok" && "text-[#1E8449]",
              row.lastTone === "expired" && "text-[#C0392B]",
              row.lastTone === "warn" && "text-[#E8912D]",
            )}
          >
            {row.lastTested}
          </span>
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-2 border-t border-[#ECEAE4] pt-4">
        {row.action === "test" ? (
          <Button
            type="button"
            className={cn(
              "w-full",
              primaryBrand
                ? "bg-[#6B4C9A] hover:bg-[#5A3D82] text-white border-0"
                : "bg-[#0A3D62] hover:bg-[#071E36] text-white border-0",
            )}
            onClick={onVerify}
          >
            {t("admin.pages.publisherAccess.test")}
          </Button>
        ) : row.action === "pending" ? (
          <Button type="button" variant="secondary" className="w-full" onClick={onQueue}>
            {t("admin.pages.publisherAccess.pending")} ({row.pendingCount ?? 0})
          </Button>
        ) : (
          <Button type="button" className="w-full bg-[#C0392B] hover:bg-[#A93226] text-white border-0" onClick={onRenew}>
            {t("admin.pages.publisherAccess.renew")}
          </Button>
        )}

        <Button type="button" variant="secondary" className="w-full" onClick={onAssignSchool}>
          {t("admin.pages.publisherAccess.assignSchool")}
        </Button>

        <div className="flex justify-center">
          <Button type="button" variant="ghost" size="sm" className="text-[#5C5A55]" onClick={onEdit}>
            {t("common.edit")}
          </Button>
        </div>
      </div>
    </article>
  );
}
