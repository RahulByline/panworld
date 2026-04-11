import { useEffect, useMemo, useState } from "react";
import type { TFunction } from "i18next";
import { AdminModal } from "./AdminModal";
import { Button } from "../../components/Button";
import {
  ASSIGNABLE_PRODUCTS,
  ASSIGN_PRODUCT_PUBLISHERS,
  ASSIGN_PRODUCT_SUBJECTS,
  ASSIGN_PRODUCT_TYPES,
  PUBLISHER_FILTER_ALL,
  SUBJECT_FILTER_ALL,
  TYPE_FILTER_ALL,
  type AssignableProduct,
} from "../../../data/admin/assignableCatalogue";

type SchoolOption = { id: string; name: string };

type AssignProductsToSchoolModalProps = {
  open: boolean;
  onClose: () => void;
  t: TFunction;
  schools: SchoolOption[];
  /** School pre-selected when opening from edit profile */
  initialSchoolId: string | null;
  accountManagerLabel: (schoolId: string) => string;
  getAssignments: (schoolId: string) => string[];
  onSave: (schoolId: string, productIds: string[]) => void;
};

export function AssignProductsToSchoolModal({
  open,
  onClose,
  t,
  schools,
  initialSchoolId,
  accountManagerLabel,
  getAssignments,
  onSave,
}: AssignProductsToSchoolModalProps) {
  const [schoolId, setSchoolId] = useState<string>("");
  const [draftIds, setDraftIds] = useState<Set<string>>(() => new Set());
  const [publisher, setPublisher] = useState<string>(PUBLISHER_FILTER_ALL);
  const [subject, setSubject] = useState<string>(SUBJECT_FILTER_ALL);
  const [type, setType] = useState<string>(TYPE_FILTER_ALL);
  const [accessLevel, setAccessLevel] = useState<string>("full");
  const [validUntil, setValidUntil] = useState<string>("2027-08-31");
  const [notes, setNotes] = useState<string>("");
  const [notifyWa, setNotifyWa] = useState(true);

  useEffect(() => {
    if (!open) return;
    const first = initialSchoolId && schools.some((s) => s.id === initialSchoolId) ? initialSchoolId : schools[0]?.id ?? "";
    setSchoolId(first);
    setDraftIds(new Set(getAssignments(first)));
    setPublisher(PUBLISHER_FILTER_ALL);
    setSubject(SUBJECT_FILTER_ALL);
    setType(TYPE_FILTER_ALL);
    setAccessLevel("full");
    setValidUntil("2027-08-31");
    setNotes("");
    setNotifyWa(true);
  }, [open, initialSchoolId, schools, getAssignments]);

  const filteredProducts = useMemo(() => {
    return ASSIGNABLE_PRODUCTS.filter((p) => {
      if (publisher !== PUBLISHER_FILTER_ALL && p.publisher !== publisher) return false;
      if (subject !== SUBJECT_FILTER_ALL && p.subject !== subject) return false;
      if (type !== TYPE_FILTER_ALL && p.type !== type) return false;
      return true;
    });
  }, [publisher, subject, type]);

  function toggleId(id: string) {
    setDraftIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function assignedSummary(ids: string[]) {
    const labels = ids
      .map((id) => ASSIGNABLE_PRODUCTS.find((p) => p.id === id)?.title)
      .filter(Boolean) as string[];
    return labels.slice(0, 6).join(", ");
  }

  const baselineAssigned = schoolId ? getAssignments(schoolId) : [];
  const bannerCount = baselineAssigned.length;
  const bannerText =
    bannerCount > 0
      ? t("admin.schools.assignProducts.bannerAssigned", {
          count: bannerCount,
          names: assignedSummary(baselineAssigned),
        })
      : t("admin.schools.assignProducts.bannerNone");

  function onSubmitSave() {
    if (!schoolId) return;
    onSave(schoolId, Array.from(draftIds));
    onClose();
  }

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title={t("admin.schools.assignProducts.modalTitle")}
      wide
      footer={
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button type="button" className="bg-[#0A3D62] hover:bg-[#071E36]" onClick={onSubmitSave}>
            {t("admin.schools.assignProducts.saveBtn")}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wide text-[#5C5A55]">
              {t("admin.schools.assignProducts.fieldSchool")} <span className="text-rose-600">*</span>
            </label>
            <select
              className="mt-1.5 h-11 w-full rounded-xl border border-[#E2E0D9] bg-white px-3 text-sm"
              value={schoolId}
              onChange={(e) => {
                const next = e.target.value;
                setSchoolId(next);
                setDraftIds(new Set(getAssignments(next)));
              }}
            >
              {schools.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-[#5C5A55]">
              {t("admin.schools.assignProducts.fieldAccountManager")}
            </div>
            <div className="mt-3 text-sm font-semibold text-[#1A1917]">{schoolId ? accountManagerLabel(schoolId) : "—"}</div>
          </div>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-[12.5px] text-emerald-900">
          ✓ {bannerText}
        </div>

        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wide text-[#9A9890]">
            {t("admin.schools.assignProducts.filterSection")}
          </div>
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            <select
              className="h-10 w-full rounded-lg border border-[#E2E0D9] bg-white px-2 text-[12.5px]"
              value={publisher}
              onChange={(e) => setPublisher(e.target.value)}
            >
              {ASSIGN_PRODUCT_PUBLISHERS.map((p) => (
                <option key={p} value={p}>
                  {p === PUBLISHER_FILTER_ALL ? t("admin.schools.assignProducts.filterPublisherAll") : p}
                </option>
              ))}
            </select>
            <select
              className="h-10 w-full rounded-lg border border-[#E2E0D9] bg-white px-2 text-[12.5px]"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              {ASSIGN_PRODUCT_SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s === SUBJECT_FILTER_ALL ? t("admin.schools.assignProducts.filterSubjectAll") : s}
                </option>
              ))}
            </select>
            <select
              className="h-10 w-full rounded-lg border border-[#E2E0D9] bg-white px-2 text-[12.5px]"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              {ASSIGN_PRODUCT_TYPES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {t(opt.labelKey)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="max-h-[240px] overflow-y-auto rounded-xl border border-[#E2E0D9] bg-white p-1.5">
          <div className="flex flex-col gap-0.5">
            {filteredProducts.map((p) => (
              <ProductRow key={p.id} product={p} checked={draftIds.has(p.id)} onToggle={() => toggleId(p.id)} t={t} />
            ))}
            {filteredProducts.length === 0 ? (
              <p className="px-2 py-4 text-center text-sm text-[#9A9890]">{t("admin.schools.assignProducts.emptyFilter")}</p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wide text-[#5C5A55]">
              {t("admin.schools.assignProducts.fieldAccessLevel")}
            </label>
            <select
              className="mt-1.5 h-11 w-full rounded-xl border border-[#E2E0D9] bg-white px-3 text-sm"
              value={accessLevel}
              onChange={(e) => setAccessLevel(e.target.value)}
            >
              <option value="full">{t("admin.schools.assignProducts.accessFull")}</option>
              <option value="browse">{t("admin.schools.assignProducts.accessBrowse")}</option>
              <option value="trial">{t("admin.schools.assignProducts.accessTrial")}</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wide text-[#5C5A55]">
              {t("admin.schools.assignProducts.fieldValidUntil")}
            </label>
            <input
              type="date"
              className="mt-1.5 h-11 w-full rounded-xl border border-[#E2E0D9] bg-white px-3 text-sm"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wide text-[#5C5A55]">{t("admin.schools.assignProducts.fieldNotes")}</label>
          <textarea
            className="mt-1.5 min-h-[72px] w-full rounded-xl border border-[#E2E0D9] bg-white px-3 py-2 text-sm"
            placeholder={t("admin.schools.assignProducts.notesPh")}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-[#1A1917]">
          <input type="checkbox" className="rounded border-[#E2E0D9]" checked={notifyWa} onChange={(e) => setNotifyWa(e.target.checked)} />
          {t("admin.schools.assignProducts.notifyWhatsApp")}
        </label>
      </div>
    </AdminModal>
  );
}

function ProductRow({
  product,
  checked,
  onToggle,
  t,
}: {
  product: AssignableProduct;
  checked: boolean;
  onToggle: () => void;
  t: TFunction;
}) {
  const rowBg = checked ? "bg-emerald-50" : "bg-white";

  return (
    <label className={`flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 ${rowBg}`}>
      <input type="checkbox" checked={checked} onChange={onToggle} className="rounded border-[#E2E0D9]" />
      <span className="min-w-0 flex-1 text-[13px]">
        <span className="font-semibold text-[#1A1917]">{product.title}</span>
        <span className="text-[#5C5A55]"> · {product.publisher}</span>
      </span>
      <span
        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
          checked ? "bg-emerald-200 text-emerald-900" : "bg-[#ECEAE4] text-[#5C5A55]"
        }`}
      >
        {checked ? t("admin.schools.assignProducts.badgeAssigned") : t("admin.schools.assignProducts.badgeNotAssigned")}
      </span>
    </label>
  );
}
