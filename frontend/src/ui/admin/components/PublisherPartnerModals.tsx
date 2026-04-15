import type { TFunction } from "i18next";
import { BookOpen } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { AdminModal } from "./AdminModal";
import { Button } from "../../components/Button";
import { globalTerritoryOptions, type PublisherPartnerRow } from "../../../data/admin/publishers";
import { cn } from "../../utils/cn";

const MAX_LOGO_BYTES = 2 * 1024 * 1024;

function emptyDraft(): PublisherPartnerRow {
  return {
    id: "",
    name: "",
    territory: "",
    contact: "",
    activeSchools: 0,
    status: "Active",
    website: "",
    phone: "",
    description: "",
    productsFocus: "",
    partnerSince: "",
    brandAccent: "#0A3D62",
  };
}

function cloneRow(row: PublisherPartnerRow): PublisherPartnerRow {
  return { ...row };
}

export function publisherStatusLabel(status: PublisherPartnerRow["status"], t: TFunction): string {
  if (status === "Active") return t("admin.pages.publishers.statusActive");
  if (status === "Onboarding") return t("admin.pages.publishers.statusOnboarding");
  return t("admin.pages.publishers.statusPaused");
}

export function publisherStatusClass(status: PublisherPartnerRow["status"]): string {
  if (status === "Active") return "bg-[#D5F5E3] text-[#1E8449]";
  if (status === "Onboarding") return "bg-[#FDEBD0] text-[#7D4E10]";
  return "bg-[#E2E0D9] text-[#5C5A55]";
}

export function PublisherLogoThumb({
  logoUrl,
  size = "sm",
}: {
  logoUrl?: string;
  name?: string;
  size?: "sm" | "md" | "lg";
}) {
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    setFailed(false);
  }, [logoUrl]);
  const dim = size === "lg" ? "h-16 w-16" : size === "md" ? "h-10 w-10" : "h-8 w-8";
  const showImg = Boolean(logoUrl) && !failed;
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-50 ring-1 ring-black/[0.06]",
        dim,
      )}
      aria-hidden
    >
      {showImg ? (
        <img
          src={logoUrl}
          alt=""
          className="h-full w-full object-contain p-1"
          onError={() => setFailed(true)}
          loading="lazy"
        />
      ) : (
        <BookOpen className={cn(size === "lg" ? "h-8 w-8" : "h-4 w-4", "text-[#0A3D62]")} strokeWidth={1.5} />
      )}
    </div>
  );
}

type FormProps = {
  open: boolean;
  onClose: () => void;
  initial: PublisherPartnerRow | null;
  onSave: (row: PublisherPartnerRow) => void;
  t: TFunction;
};

export function PublisherPartnerFormModal({ open, onClose, initial, onSave, t }: FormProps) {
  const formId = useId();
  const [draft, setDraft] = useState<PublisherPartnerRow>(emptyDraft);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    if (initial) {
      setDraft(cloneRow(initial));
    } else {
      setDraft(emptyDraft());
    }
  }, [open, initial?.id]);

  const isEdit = Boolean(initial?.id);
  const territoryOptions = [...globalTerritoryOptions];
  const normalizedCurrentTerritory = draft.territory.trim();
  const hasCurrentInPreset = territoryOptions.some((opt) => opt.toLowerCase() === normalizedCurrentTerritory.toLowerCase());

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > MAX_LOGO_BYTES) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setDraft((d) => ({ ...d, logoUrl: dataUrl }));
    };
    reader.readAsDataURL(file);
  }

  function submit() {
    const name = draft.name.trim();
    const territory = draft.territory.trim();
    const contact = draft.contact.trim();
    if (!name || !territory || !contact) {
      setError(t("admin.pages.publishers.validationRequired"));
      return;
    }
    setError(null);
    const id = isEdit ? draft.id : `pub-${Date.now()}`;
    const activeSchools = Number.isFinite(draft.activeSchools) ? Math.max(0, Math.floor(Number(draft.activeSchools))) : 0;
    onSave({
      ...draft,
      id,
      name,
      territory,
      contact,
      activeSchools,
      website: draft.website?.trim() || undefined,
      phone: draft.phone?.trim() || undefined,
      description: draft.description?.trim() || undefined,
      productsFocus: draft.productsFocus?.trim() || undefined,
      partnerSince: draft.partnerSince?.trim() || undefined,
      logoUrl: draft.logoUrl || undefined,
      brandAccent: draft.brandAccent?.trim() || undefined,
    });
    onClose();
  }

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title={isEdit ? t("admin.pages.publishers.formEditTitle") : t("admin.pages.publishers.formCreateTitle")}
      wide
      footer={
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button type="button" className="bg-[#0A3D62] hover:bg-[#071E36]" onClick={submit}>
            {t("admin.pages.publishers.savePublisher")}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {error ? <p className="text-sm text-red-700">{error}</p> : null}

        <div className="rounded-xl border border-[#E2E0D9] bg-[#FAFAF8] p-4">
          <label className="text-xs font-semibold uppercase tracking-wide text-[#5C5A55]" htmlFor={`${formId}-logo`}>
            {t("admin.pages.publishers.fieldLogo")}
          </label>
          <p className="mt-1 text-[12px] text-[#9A9890]">{t("admin.pages.publishers.logoHint")}</p>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            <PublisherLogoThumb logoUrl={draft.logoUrl} size="lg" />
            <div className="flex flex-wrap gap-2">
              <label className="inline-flex cursor-pointer rounded-lg border border-[#E2E0D9] bg-white px-3 py-2 text-[13px] font-medium text-[#0A3D62] shadow-sm hover:bg-[#F5F4F0]">
                <input id={`${formId}-logo`} type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={handleFile} />
                {t("admin.pages.publishers.logoChoose")}
              </label>
              {draft.logoUrl ? (
                <Button type="button" variant="secondary" size="sm" onClick={() => setDraft((d) => ({ ...d, logoUrl: undefined }))}>
                  {t("admin.pages.publishers.logoRemove")}
                </Button>
              ) : null}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#E2E0D9] bg-[#FAFAF8] p-4">
          <label className="text-xs font-semibold uppercase tracking-wide text-[#5C5A55]" htmlFor={`${formId}-accent`}>
            {t("admin.pages.publishers.fieldBrandAccent")}
          </label>
          <p className="mt-1 text-[12px] text-[#9A9890]">{t("admin.pages.publishers.brandAccentHint")}</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <input
              id={`${formId}-accent`}
              type="color"
              className="h-10 w-14 cursor-pointer rounded border border-[#E2E0D9] bg-white p-0.5"
              value={/^#[0-9A-Fa-f]{6}$/.test(draft.brandAccent ?? "") ? draft.brandAccent : "#0A3D62"}
              onChange={(e) => setDraft((d) => ({ ...d, brandAccent: e.target.value }))}
              aria-label={t("admin.pages.publishers.fieldBrandAccent")}
            />
            <input
              type="text"
              className="min-w-[8rem] flex-1 rounded-lg border border-[#E2E0D9] bg-white px-3 py-2 font-mono text-[13px] text-[#1A1917] outline-none focus:border-[#0A3D62] focus:ring-2 focus:ring-[#0A3D62]/15"
              placeholder="#0A3D62"
              value={draft.brandAccent ?? ""}
              onChange={(e) => setDraft((d) => ({ ...d, brandAccent: e.target.value }))}
              spellCheck={false}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-xs font-semibold text-[#5C5A55]">{t("admin.pages.publishers.fieldName")}</span>
            <input
              className="mt-1 w-full rounded-lg border border-[#E2E0D9] bg-white px-3 py-2 text-[13px] text-[#1A1917] outline-none focus:border-[#0A3D62] focus:ring-2 focus:ring-[#0A3D62]/15"
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              autoComplete="organization"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-[#5C5A55]">{t("admin.pages.publishers.fieldTerritory")}</span>
            <select
              className="mt-1 w-full rounded-lg border border-[#E2E0D9] bg-white px-3 py-2 text-[13px] text-[#1A1917] outline-none focus:border-[#0A3D62] focus:ring-2 focus:ring-[#0A3D62]/15"
              value={draft.territory}
              onChange={(e) => setDraft((d) => ({ ...d, territory: e.target.value }))}
            >
              <option value="" disabled>
                {t("admin.pages.publishers.fieldTerritory")}
              </option>
              {territoryOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
              {normalizedCurrentTerritory && !hasCurrentInPreset ? (
                <option value={normalizedCurrentTerritory}>{normalizedCurrentTerritory}</option>
              ) : null}
            </select>
          </label>
          <label className="block md:col-span-2">
            <span className="text-xs font-semibold text-[#5C5A55]">{t("admin.pages.publishers.fieldContact")}</span>
            <input
              type="email"
              className="mt-1 w-full rounded-lg border border-[#E2E0D9] bg-white px-3 py-2 font-mono text-[13px] text-[#1A1917] outline-none focus:border-[#0A3D62] focus:ring-2 focus:ring-[#0A3D62]/15"
              value={draft.contact}
              onChange={(e) => setDraft((d) => ({ ...d, contact: e.target.value }))}
              autoComplete="email"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-[#5C5A55]">{t("admin.pages.publishers.fieldPhone")}</span>
            <input
              className="mt-1 w-full rounded-lg border border-[#E2E0D9] bg-white px-3 py-2 text-[13px] text-[#1A1917] outline-none focus:border-[#0A3D62] focus:ring-2 focus:ring-[#0A3D62]/15"
              value={draft.phone ?? ""}
              onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))}
              autoComplete="tel"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-[#5C5A55]">{t("admin.pages.publishers.fieldWebsite")}</span>
            <input
              className="mt-1 w-full rounded-lg border border-[#E2E0D9] bg-white px-3 py-2 text-[13px] text-[#1A1917] outline-none focus:border-[#0A3D62] focus:ring-2 focus:ring-[#0A3D62]/15"
              value={draft.website ?? ""}
              onChange={(e) => setDraft((d) => ({ ...d, website: e.target.value }))}
              placeholder="https://"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-[#5C5A55]">{t("admin.pages.publishers.fieldStatus")}</span>
            <select
              className="mt-1 w-full rounded-lg border border-[#E2E0D9] bg-white px-3 py-2 text-[13px] text-[#1A1917] outline-none focus:border-[#0A3D62] focus:ring-2 focus:ring-[#0A3D62]/15"
              value={draft.status}
              onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value as PublisherPartnerRow["status"] }))}
            >
              <option value="Active">{t("admin.pages.publishers.statusActive")}</option>
              <option value="Onboarding">{t("admin.pages.publishers.statusOnboarding")}</option>
              <option value="Paused">{t("admin.pages.publishers.statusPaused")}</option>
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-[#5C5A55]">{t("admin.pages.publishers.fieldActiveSchools")}</span>
            <input
              type="number"
              min={0}
              className="mt-1 w-full rounded-lg border border-[#E2E0D9] bg-white px-3 py-2 text-[13px] text-[#1A1917] outline-none focus:border-[#0A3D62] focus:ring-2 focus:ring-[#0A3D62]/15"
              value={draft.activeSchools}
              onChange={(e) => setDraft((d) => ({ ...d, activeSchools: Number(e.target.value) }))}
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-[#5C5A55]">{t("admin.pages.publishers.fieldPartnerSince")}</span>
            <input
              className="mt-1 w-full rounded-lg border border-[#E2E0D9] bg-white px-3 py-2 text-[13px] text-[#1A1917] outline-none focus:border-[#0A3D62] focus:ring-2 focus:ring-[#0A3D62]/15"
              value={draft.partnerSince ?? ""}
              onChange={(e) => setDraft((d) => ({ ...d, partnerSince: e.target.value }))}
              placeholder="e.g. 2020"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-xs font-semibold text-[#5C5A55]">{t("admin.pages.publishers.fieldProductsFocus")}</span>
          <input
            className="mt-1 w-full rounded-lg border border-[#E2E0D9] bg-white px-3 py-2 text-[13px] text-[#1A1917] outline-none focus:border-[#0A3D62] focus:ring-2 focus:ring-[#0A3D62]/15"
            value={draft.productsFocus ?? ""}
            onChange={(e) => setDraft((d) => ({ ...d, productsFocus: e.target.value }))}
          />
        </label>

        <label className="block">
          <span className="text-xs font-semibold text-[#5C5A55]">{t("admin.pages.publishers.fieldDescription")}</span>
          <textarea
            rows={4}
            className="mt-1 w-full resize-y rounded-lg border border-[#E2E0D9] bg-white px-3 py-2 text-[13px] leading-relaxed text-[#1A1917] outline-none focus:border-[#0A3D62] focus:ring-2 focus:ring-[#0A3D62]/15"
            value={draft.description ?? ""}
            onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
          />
        </label>
      </div>
    </AdminModal>
  );
}

type DetailProps = {
  open: boolean;
  onClose: () => void;
  row: PublisherPartnerRow | null;
  onEdit: () => void;
  t: TFunction;
};

export function PublisherPartnerDetailModal({ open, onClose, row, onEdit, t }: DetailProps) {
  if (!open || !row) return null;

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title={t("admin.pages.publishers.detailTitle")}
      extraWide
      footer={
        <div className="flex flex-wrap justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            {t("common.close")}
          </Button>
          <Button type="button" className="bg-[#0A3D62] hover:bg-[#071E36]" onClick={onEdit}>
            {t("admin.pages.publishers.editFromDetail")}
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        <section className="rounded-2xl border border-[#E2E0D9] bg-[#FAFAF8] p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <PublisherLogoThumb logoUrl={row.logoUrl} size="lg" />
            <div className="min-w-0 flex-1">
              <h3 className="text-2xl font-bold text-[#0F0F0F]">{row.name}</h3>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium", publisherStatusClass(row.status))}>
                  {publisherStatusLabel(row.status, t)}
                </span>
                {row.partnerSince ? (
                  <span className="inline-flex rounded-full border border-[#E2E0D9] bg-white px-2.5 py-0.5 text-xs font-medium text-[#5C5A55]">
                    {t("admin.pages.publishers.detailSince")}: {row.partnerSince}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-[#E2E0D9] bg-white p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#9A9890]">{t("admin.pages.publishers.detailTerritory")}</p>
            <p className="mt-1 text-[13px] font-medium text-[#1A1917]">{row.territory}</p>
          </div>
          <div className="rounded-xl border border-[#E2E0D9] bg-white p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#9A9890]">{t("admin.pages.publishers.detailSchools")}</p>
            <p className="mt-1 text-[16px] font-bold tabular-nums text-[#1A1917]">{row.activeSchools}</p>
          </div>
          <div className="rounded-xl border border-[#E2E0D9] bg-white p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#9A9890]">{t("admin.pages.publishers.detailContact")}</p>
            <p className="mt-1 break-all font-mono text-[13px] text-[#0A3D62]">{row.contact}</p>
          </div>
        </section>

        <section className="rounded-2xl border border-[#E2E0D9] bg-white p-4">
          <h4 className="text-[11px] font-semibold uppercase tracking-wide text-[#9A9890]">{t("common.details")}</h4>
          <dl className="mt-3 grid gap-4 sm:grid-cols-2">
            {row.phone ? (
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-[#9A9890]">{t("admin.pages.publishers.detailPhone")}</dt>
                <dd className="mt-1 text-[13px] text-[#1A1917]">{row.phone}</dd>
              </div>
            ) : null}
            {row.website ? (
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-[#9A9890]">{t("admin.pages.publishers.detailWebsite")}</dt>
                <dd className="mt-1">
                  <a href={row.website.startsWith("http") ? row.website : `https://${row.website}`} className="break-all text-[13px] text-[#0A3D62] underline" target="_blank" rel="noreferrer">
                    {row.website}
                  </a>
                </dd>
              </div>
            ) : null}
          </dl>
        </section>

        {row.productsFocus ? (
          <section className="rounded-2xl border border-[#E2E0D9] bg-white p-4">
            <h4 className="text-[11px] font-semibold uppercase tracking-wide text-[#9A9890]">{t("admin.pages.publishers.detailProducts")}</h4>
            <p className="mt-2 text-[13px] leading-relaxed text-[#5C5A55]">{row.productsFocus}</p>
          </section>
        ) : null}

        {row.description ? (
          <section className="rounded-2xl border border-[#E2E0D9] bg-white p-4">
            <h4 className="text-[11px] font-semibold uppercase tracking-wide text-[#9A9890]">{t("admin.pages.publishers.detailDescription")}</h4>
            <p className="mt-2 whitespace-pre-wrap text-[13px] leading-relaxed text-[#5C5A55]">{row.description}</p>
          </section>
        ) : null}
      </div>
    </AdminModal>
  );
}
