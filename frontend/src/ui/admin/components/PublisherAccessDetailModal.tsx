import type { TFunction } from "i18next";
import { Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminModal } from "./AdminModal";
import { Button } from "../../components/Button";
import {
  type PublisherAccessRow,
  type PublisherAccessSchoolShare,
  schoolShareAvatarPalette,
  schoolShareInitials,
} from "../../../data/admin/publisherAccess";
import { cn } from "../../utils/cn";

function isShareEnabled(s: PublisherAccessSchoolShare): boolean {
  return s.accessEnabled !== false;
}

function SchoolShareAvatar({ share }: { share: PublisherAccessSchoolShare }) {
  const [imgFailed, setImgFailed] = useState(false);
  const palette = schoolShareAvatarPalette(share.schoolId);
  const initials = schoolShareInitials(share.schoolName);
  const showImage = Boolean(share.logoUrl) && !imgFailed;

  if (showImage) {
    return (
      <img
        src={share.logoUrl}
        alt=""
        loading="lazy"
        className="h-10 w-10 shrink-0 rounded-lg object-cover ring-1 ring-[#E2E0D9]"
        onError={() => setImgFailed(true)}
      />
    );
  }

  return (
    <div
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[12px] font-bold leading-none ring-1 ring-[#E2E0D9]"
      style={{
        background: `linear-gradient(135deg, ${palette.from}, ${palette.to})`,
        color: palette.text,
      }}
      aria-hidden
    >
      {initials}
    </div>
  );
}

function statusBadgeClass(status: PublisherAccessSchoolShare["accessStatus"]): string {
  if (status === "active") return "bg-emerald-100 text-emerald-900 ring-1 ring-emerald-600/25";
  if (status === "expiring") return "bg-amber-100 text-amber-950 ring-1 ring-amber-600/25";
  return "bg-red-100 text-red-900 ring-1 ring-red-600/20";
}

function statusLabel(status: PublisherAccessSchoolShare["accessStatus"], t: TFunction): string {
  if (status === "active") return t("admin.pages.publisherAccess.shareStatusActive");
  if (status === "expiring") return t("admin.pages.publisherAccess.shareStatusExpiring");
  return t("admin.pages.publisherAccess.shareStatusExpired");
}

function statusBadgeClassForShare(s: PublisherAccessSchoolShare): string {
  if (!isShareEnabled(s)) return "bg-slate-200 text-slate-800 ring-1 ring-slate-500/20";
  return statusBadgeClass(s.accessStatus);
}

function statusLabelForShare(s: PublisherAccessSchoolShare, t: TFunction): string {
  if (!isShareEnabled(s)) return t("admin.pages.publisherAccess.shareStatusDisabled");
  return statusLabel(s.accessStatus, t);
}

type ShareStatusFilter = "all" | PublisherAccessSchoolShare["accessStatus"];
type AccessFilter = "all" | "enabled" | "disabled";

type Props = {
  open: boolean;
  onClose: () => void;
  row: PublisherAccessRow | null;
  t: TFunction;
};

function ShareAccessToggle({
  share,
  t,
  onChange,
}: {
  share: PublisherAccessSchoolShare;
  t: TFunction;
  onChange: (schoolId: string, enabled: boolean) => void;
}) {
  const on = isShareEnabled(share);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      title={on ? t("admin.pages.publisherAccess.accessToggleDisable") : t("admin.pages.publisherAccess.accessToggleEnable")}
      aria-label={t("admin.pages.publisherAccess.accessToggleAria", { school: share.schoolName })}
      onClick={() => onChange(share.schoolId, !on)}
      className={cn(
        "relative inline-flex h-7 w-[2.75rem] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#0A3D62]/35",
        on ? "bg-[#1E8449]" : "bg-[#B0AEA8]",
      )}
    >
      <span
        className={cn(
          "pointer-events-none absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
          on ? "translate-x-[1.15rem]" : "translate-x-0",
        )}
      />
    </button>
  );
}

export function PublisherAccessDetailModal({ open, onClose, row, t }: Props) {
  const [q, setQ] = useState("");
  const [territory, setTerritory] = useState<string>("all");
  const [shareStatus, setShareStatus] = useState<ShareStatusFilter>("all");
  const [accessFilter, setAccessFilter] = useState<AccessFilter>("all");
  const [localShares, setLocalShares] = useState<PublisherAccessSchoolShare[]>([]);

  useEffect(() => {
    if (open && row) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQ("");
      setTerritory("all");
      setShareStatus("all");
      setAccessFilter("all");
      setLocalShares(
        row.schoolShares.map((s) => ({
          ...s,
          accessEnabled: s.accessEnabled !== false,
        })),
      );
    }
  }, [open, row]);

  const setShareAccessEnabled = useCallback((schoolId: string, enabled: boolean) => {
    setLocalShares((prev) =>
      prev.map((s) => (s.schoolId === schoolId ? { ...s, accessEnabled: enabled } : s)),
    );
  }, []);

  const territories = useMemo(() => {
    const set = new Set(localShares.map((s) => s.territory));
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [localShares]);

  const filteredShares = useMemo(() => {
    let list = localShares;
    const needle = q.trim().toLowerCase();
    if (needle) {
      list = list.filter((s) =>
        [s.schoolName, s.territory, s.schoolId].join(" ").toLowerCase().includes(needle),
      );
    }
    if (territory !== "all") {
      list = list.filter((s) => s.territory === territory);
    }
    if (shareStatus !== "all") {
      list = list.filter((s) => {
        if (!isShareEnabled(s)) return false;
        return s.accessStatus === shareStatus;
      });
    }
    if (accessFilter === "enabled") {
      list = list.filter((s) => isShareEnabled(s));
    } else if (accessFilter === "disabled") {
      list = list.filter((s) => !isShareEnabled(s));
    }
    return list;
  }, [localShares, q, territory, shareStatus, accessFilter]);

  if (!row) return null;

  const shares = localShares;
  const selCls =
    "min-w-0 flex-1 rounded-lg border border-[#E2E0D9] bg-[#FAFAF8] px-3 py-2 text-[13px] text-[#1A1917] shadow-sm outline-none transition hover:border-[#C4C2BC] focus:border-[#0A3D62] focus:ring-2 focus:ring-[#0A3D62]/15 sm:min-w-[130px]";

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title={`${row.title}${t("admin.pages.publisherAccess.detailTitleSuffix")}`}
      extraWide
      footer={
        <div className="flex justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            {t("common.close")}
          </Button>
        </div>
      }
    >
      {row.subtitle ? (
        <p className="text-[13px] font-medium text-[#5C5A55]">{row.subtitle}</p>
      ) : null}
      <p className="mt-2 text-[13px] leading-relaxed text-[#5C5A55]">{t("admin.pages.publisherAccess.detailIntro")}</p>
      <p className="mt-2 break-all font-mono text-[12px] text-[#1A1917]">{row.accessLine}</p>

      {shares.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-[#E2E0D9] bg-[#FAFAF8] px-4 py-8 text-center text-sm text-[#5C5A55]">
          {t("admin.pages.publisherAccess.detailEmpty")}
        </p>
      ) : (
        <>
          <p className="mt-3 text-[12px] leading-relaxed text-[#5C5A55]">
            {t("admin.pages.publisherAccess.detailAccessOverrideNote")}
          </p>
          <div className="mt-5 flex flex-col gap-3 rounded-xl border border-[#E2E0D9] bg-[#FAFAF8]/80 p-3 sm:p-4">
            <div className="relative min-h-10 w-full">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9A9890]"
                strokeWidth={2}
                aria-hidden
              />
              <input
                type="search"
                className="h-10 w-full rounded-lg border border-[#E2E0D9] bg-white py-2 pl-10 pr-3 text-sm text-[#1A1917] outline-none transition placeholder:text-[#9A9890] focus:border-[#0A3D62] focus:ring-2 focus:ring-[#0A3D62]/12"
                placeholder={t("admin.pages.publisherAccess.detailSearchPlaceholder")}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                aria-label={t("admin.pages.publisherAccess.detailSearchPlaceholder")}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                className={selCls}
                value={territory}
                onChange={(e) => setTerritory(e.target.value)}
                aria-label={t("admin.pages.publisherAccess.detailFilterTerritory")}
              >
                <option value="all">
                  {t("admin.pages.publisherAccess.detailFilterTerritory")}:{" "}
                  {t("admin.pages.publisherAccess.detailFilterAllTerritories")}
                </option>
                {territories.map((terr) => (
                  <option key={terr} value={terr}>
                    {terr}
                  </option>
                ))}
              </select>
              <select
                className={selCls}
                value={shareStatus}
                onChange={(e) => setShareStatus(e.target.value as ShareStatusFilter)}
                aria-label={t("admin.pages.publisherAccess.detailFilterShareStatus")}
              >
                <option value="all">
                  {t("admin.pages.publisherAccess.detailFilterShareStatus")}: {t("admin.pages.publisherAccess.filterAll")}
                </option>
                <option value="active">{t("admin.pages.publisherAccess.shareStatusActive")}</option>
                <option value="expiring">{t("admin.pages.publisherAccess.shareStatusExpiring")}</option>
                <option value="expired">{t("admin.pages.publisherAccess.shareStatusExpired")}</option>
              </select>
              <select
                className={selCls}
                value={accessFilter}
                onChange={(e) => setAccessFilter(e.target.value as AccessFilter)}
                aria-label={t("admin.pages.publisherAccess.detailFilterAccess")}
              >
                <option value="all">
                  {t("admin.pages.publisherAccess.detailFilterAccess")}: {t("admin.pages.publisherAccess.detailFilterAccessAll")}
                </option>
                <option value="enabled">{t("admin.pages.publisherAccess.detailFilterAccessEnabled")}</option>
                <option value="disabled">{t("admin.pages.publisherAccess.detailFilterAccessDisabled")}</option>
              </select>
            </div>
            <p className="text-[12px] text-[#5C5A55]">
              {t("admin.pages.publisherAccess.detailSharesResults", {
                shown: filteredShares.length,
                total: shares.length,
              })}
            </p>
          </div>

          {filteredShares.length === 0 ? (
            <p className="mt-4 rounded-xl border border-dashed border-[#E2E0D9] bg-white px-4 py-8 text-center text-sm text-[#5C5A55]">
              {t("admin.pages.publisherAccess.detailNoFilterMatch")}
            </p>
          ) : (
            <div className="mt-4 overflow-x-auto rounded-xl border border-[#E2E0D9]">
              <table className="w-full min-w-[820px] border-collapse text-left text-[13px]">
                <thead className="border-b border-[#E2E0D9] bg-[#F5F4F0] text-[11px] font-semibold uppercase tracking-wide text-[#5C5A55]">
                  <tr>
                    <th className="px-4 py-3">{t("admin.pages.publisherAccess.colSchoolShare")}</th>
                    <th className="px-4 py-3">{t("admin.pages.publisherAccess.colTerritory")}</th>
                    <th className="px-4 py-3">{t("admin.pages.publisherAccess.colValidFrom")}</th>
                    <th className="px-4 py-3">{t("admin.pages.publisherAccess.colValidUntil")}</th>
                    <th className="px-4 py-3">{t("admin.pages.publisherAccess.colShareStatus")}</th>
                    <th className="px-4 py-3">{t("admin.pages.publisherAccess.colShareAccess")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ECEAE4] bg-white">
                  {filteredShares.map((s) => (
                    <tr
                      key={s.schoolId}
                      className={cn(
                        "hover:bg-[#FAFAF8]",
                        !isShareEnabled(s) && "bg-[#F5F4F0]/80 opacity-[0.92]",
                      )}
                    >
                      <td className="px-4 py-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <SchoolShareAvatar share={s} />
                          <span
                            className={cn(
                              "min-w-0 font-medium leading-snug text-[#1A1917]",
                              !isShareEnabled(s) && "text-[#6B6960]",
                            )}
                          >
                            {s.schoolName}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[#5C5A55]">{s.territory}</td>
                      <td className="px-4 py-3 text-[#5C5A55]">{s.validFrom}</td>
                      <td className="px-4 py-3 font-medium text-[#1A1917]">{s.validUntil}</td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-flex rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                            statusBadgeClassForShare(s),
                          )}
                        >
                          {statusLabelForShare(s, t)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <ShareAccessToggle share={s} t={t} onChange={setShareAccessEnabled} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      <p className="mt-4 text-[11px] leading-relaxed text-[#9A9890]">{t("admin.pages.publisherAccess.detailFootnote")}</p>
    </AdminModal>
  );
}
