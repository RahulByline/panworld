import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Award, Building2, CalendarDays, Search, ShieldCheck } from "lucide-react";
import { AdminPageHeader } from "../../admin/components/AdminPageHeader";
import { AdminStatCard } from "../../admin/components/AdminStatCard";
import { Button } from "../../components/Button";
import { certSummary, certificationsIssued } from "../../../data/admin/webinarsCerts";
import { useAdminToast } from "../../admin/hooks/useAdminToast";
import { cn } from "../../utils/cn";

export function AdminCertificationsPage() {
  const { t } = useTranslation();
  const { show, Toast } = useAdminToast();
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return certificationsIssued;
    return certificationsIssued.filter(
      (c) =>
        c.id.toLowerCase().includes(needle) ||
        c.recipient.toLowerCase().includes(needle) ||
        c.school.toLowerCase().includes(needle) ||
        c.course.toLowerCase().includes(needle),
    );
  }, [q]);

  return (
    <div className="font-sans">
      <Toast />
      <AdminPageHeader
        title={t("admin.pages.certs.title")}
        subtitle={t("admin.pages.certs.subtitle")}
        actions={
          <Button type="button" variant="secondary" size="sm" onClick={() => show(t("admin.pages.certs.export"))}>
            {t("common.export")}
          </Button>
        }
      />

      <div className="mb-4 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        <AdminStatCard label={t("admin.pages.certs.statIssued")} value={certSummary.issued30d} valueClassName="text-[#0A3D62]" />
        <AdminStatCard label={t("admin.pages.certs.statSchools")} value={certSummary.schoolsCount} valueClassName="text-[#1E8449]" />
        <AdminStatCard label={t("admin.pages.certs.statVerified")} value={t("admin.pages.certs.verifiedYes")} />
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9A9890]" aria-hidden />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("admin.pages.certs.searchPlaceholder")}
          className="h-10 w-full rounded-lg border border-[#E2E0D9] bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-[#0A3D62]"
          aria-label={t("admin.pages.certs.searchPlaceholder")}
        />
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-[#E2E0D9] bg-[#FAFAF8] px-4 py-10 text-center text-sm text-[#5C5A55]">
          {t("admin.pages.certs.emptySearch")}
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filtered.map((c) => (
            <li
              key={c.id}
              className="relative overflow-hidden rounded-2xl border border-[#E2E0D9] bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div
                className={cn(
                  "flex items-center gap-3 px-5 py-4",
                  "bg-gradient-to-r from-[#0A3D62] to-[#134F7A] text-white",
                )}
              >
                <div className="flex size-11 items-center justify-center rounded-xl bg-white/15">
                  <Award className="size-6 text-[#F4D03F]" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-mono text-[11px] font-medium uppercase tracking-wider text-white/80">{c.id}</p>
                  <p className="truncate text-lg font-semibold leading-tight">{c.recipient}</p>
                </div>
              </div>

              <div className="space-y-3 px-5 py-4">
                <p className="flex items-start gap-2 text-sm text-[#5C5A55]">
                  <Building2 className="mt-0.5 size-4 shrink-0 text-[#9A9890]" aria-hidden />
                  <span>{c.school}</span>
                </p>
                <p className="text-[15px] font-medium leading-snug text-[#1A1917]">{c.course}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-[#5C5A55]">
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays className="size-3.5" aria-hidden />
                    {c.issuedAt}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F6EF] px-2 py-0.5 font-medium text-[#1E8449]">
                    <ShieldCheck className="size-3.5" aria-hidden />
                    {t("admin.pages.certs.hours", { count: c.hours })}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 border-t border-[#ECEAE4] pt-4">
                  <Button
                    type="button"
                    className="bg-[#0A3D62] text-white hover:bg-[#071E36]"
                    size="sm"
                    onClick={() => show(t("admin.pages.certs.whatsapp"))}
                  >
                    {t("admin.pages.certs.resend")}
                  </Button>
                  <Button type="button" variant="secondary" size="sm" onClick={() => show(t("admin.pages.certs.toastPdf"))}>
                    {t("admin.pages.certs.viewPdf")}
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
