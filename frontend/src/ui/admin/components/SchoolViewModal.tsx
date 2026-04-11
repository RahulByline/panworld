import type { TFunction } from "i18next";
import { Package } from "lucide-react";
import { Button } from "../../components/Button";
import { assignableProductTypeLabelKey, type AssignableProduct, type AssignableProductType } from "../../../data/admin/assignableCatalogue";

/** Pills aligned with admin reference: textbook = white on mint; digital/kit as spec */
const CHIP_TONE: Record<AssignableProductType, string> = {
  textbook: "bg-emerald-500 text-white",
  digital: "bg-sky-100 text-sky-800",
  kit: "bg-amber-100 text-amber-800",
  library: "bg-violet-100 text-violet-900",
};

export type SchoolViewRow = {
  id: string;
  name: string;
  country: string;
  curriculumType: string;
};

function statsFromSchoolId(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (Math.imul(31, h) + id.charCodeAt(i)) | 0;
  const n = Math.abs(h);
  return {
    activeUsers: 8 + (n % 15),
    openRfqs: 1 + (n % 4),
    certs: 20 + (n % 40),
    demos: 5 + (n % 12),
    students: 800 + (n % 900),
    ordersAed: ((n % 180) + 40) * 1000,
  };
}

type SchoolViewModalProps = {
  open: boolean;
  onClose: () => void;
  t: TFunction;
  school: SchoolViewRow | null;
  accountManager: string;
  assignedProducts: AssignableProduct[];
  onAssignProducts: () => void;
  onImpersonate: () => void;
  onViewRfqs: () => void;
  onViewOrders: () => void;
  onDeactivate: () => void;
  onEdit: () => void;
  onSaveChanges: () => void;
};

export function SchoolViewModal({
  open,
  onClose,
  t,
  school,
  accountManager,
  assignedProducts,
  onAssignProducts,
  onImpersonate,
  onViewRfqs,
  onViewOrders,
  onDeactivate,
  onEdit,
  onSaveChanges,
}: SchoolViewModalProps) {
  if (!open) return null;

  const stats = school ? statsFromSchoolId(school.id) : null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-10 pb-10"
      role="dialog"
      aria-modal="true"
      aria-labelledby="view-school-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-3xl rounded-2xl border border-[#E2E0D9] bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E2E0D9] bg-white px-6 py-4">
          <h2 id="view-school-title" className="font-['DM_Serif_Display',serif] text-xl text-[#1A1917]">
            {school?.name ?? "—"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[#5C5A55] hover:bg-[#F5F4F0]"
            aria-label={t("admin.schools.close")}
          >
            ✕
          </button>
        </div>

        <div className="max-h-[min(75vh,820px)] overflow-y-auto px-6 py-5">
          {!school ? (
            <div className="py-12 text-center text-sm text-[#9A9890]">{t("common.loading")}</div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-[#5C5A55]">{t("admin.schools.view.territory")}</div>
                  <div className="mt-1 text-sm font-medium text-[#1A1917]">{school.country}</div>
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-[#5C5A55]">{t("admin.schools.view.curriculum")}</div>
                  <div className="mt-1 text-sm font-medium text-[#1A1917]">{school.curriculumType || "—"}</div>
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-[#5C5A55]">{t("admin.schools.view.phaseAccess")}</div>
                  <span className="mt-2 inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-900">
                    {t("admin.schools.view.phaseBadge")}
                  </span>
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-[#5C5A55]">{t("admin.schools.view.accountManager")}</div>
                  <div className="mt-1 text-sm font-medium text-[#1A1917]">{accountManager}</div>
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-[#5C5A55]">{t("admin.schools.view.studentCount")}</div>
                  <div className="mt-1 text-sm font-medium text-[#1A1917]">~{stats?.students.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-[#5C5A55]">{t("admin.schools.view.ordersYtd")}</div>
                  <div className="mt-1 text-sm font-semibold text-emerald-700">
                    {t("admin.schools.view.ordersHint", { amount: stats?.ordersAed.toLocaleString() ?? "—" })}
                  </div>
                </div>
              </div>

              <div className="my-6 border-t border-[#E2E0D9]" />

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <div className="rounded-xl border border-[#E2E0D9] bg-[#FAFAF8] p-3">
                  <div className="text-xs text-[#5C5A55]">{t("admin.schools.view.statActiveUsers")}</div>
                  <div className="mt-1 font-['DM_Serif_Display',serif] text-lg font-bold text-[#0A3D62]">{stats?.activeUsers}</div>
                </div>
                <div className="rounded-xl border border-[#E2E0D9] bg-[#FAFAF8] p-3">
                  <div className="text-xs text-[#5C5A55]">{t("admin.schools.view.statOpenRfqs")}</div>
                  <div className="mt-1 font-['DM_Serif_Display',serif] text-lg font-bold text-amber-700">{stats?.openRfqs}</div>
                </div>
                <div className="rounded-xl border border-[#E2E0D9] bg-[#FAFAF8] p-3">
                  <div className="text-xs text-[#5C5A55]">{t("admin.schools.view.statCerts")}</div>
                  <div className="mt-1 font-['DM_Serif_Display',serif] text-lg font-bold text-emerald-700">{stats?.certs}</div>
                </div>
                <div className="rounded-xl border border-[#E2E0D9] bg-[#FAFAF8] p-3">
                  <div className="text-xs text-[#5C5A55]">{t("admin.schools.view.statDemos")}</div>
                  <div className="mt-1 font-['DM_Serif_Display',serif] text-lg font-bold text-[#0A3D62]">{stats?.demos}</div>
                </div>
              </div>

              <div className="my-6 border-t border-[#E2E0D9]" />

              <div className="text-[13px] font-semibold text-[#1A1917]">
                <span className="mr-1">📦</span>
                {t("admin.schools.assignProducts.sectionTitle")}
              </div>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {assignedProducts.length === 0 ? (
                  <span className="text-sm text-[#9A9890]">{t("admin.schools.assignProducts.bannerNone")}</span>
                ) : (
                  assignedProducts.map((p) => (
                    <div
                      key={p.id}
                      className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-[#DDD9D2] bg-[#FAFAF8] px-3 py-1.5 text-[12.5px] text-[#1A1917]"
                    >
                      <span className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase ${CHIP_TONE[p.type]}`}>
                        {t(assignableProductTypeLabelKey(p.type))}
                      </span>
                      <span className="min-w-0 truncate">{p.title}</span>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-3.5 flex flex-wrap gap-2">
                <Button type="button" size="sm" className="bg-[#0A3D62] hover:bg-[#071E36]" onClick={onAssignProducts}>
                  <Package className="mr-1.5 inline h-4 w-4" />
                  {t("admin.schools.assignProducts.assignBtn")}
                </Button>
                <Button type="button" variant="secondary" size="sm" className="border-[#DDD9D2]" onClick={onImpersonate}>
                  {t("admin.schools.assignProducts.impersonate")}
                </Button>
                <Button type="button" variant="secondary" size="sm" className="border-[#DDD9D2]" onClick={onViewRfqs}>
                  {t("admin.schools.assignProducts.viewRfqs")}
                </Button>
                <Button type="button" variant="secondary" size="sm" className="border-[#DDD9D2]" onClick={onViewOrders}>
                  {t("admin.schools.assignProducts.viewOrders")}
                </Button>
                <Button type="button" size="sm" className="bg-rose-600 text-white hover:bg-rose-700" onClick={onDeactivate}>
                  {t("admin.schools.assignProducts.deactivate")}
                </Button>
              </div>

              <div className="mt-6 flex justify-end border-t border-[#E2E0D9] pt-4">
                <Button type="button" variant="secondary" size="sm" className="border-[#DDD9D2]" onClick={onEdit}>
                  {t("admin.schools.view.editSchool")}
                </Button>
              </div>
            </>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-[#E2E0D9] px-6 py-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            {t("admin.schools.view.close")}
          </Button>
          <Button type="button" className="bg-[#0A3D62] hover:bg-[#071E36]" onClick={onSaveChanges}>
            {t("admin.schools.view.saveChanges")}
          </Button>
        </div>
      </div>
    </div>
  );
}
