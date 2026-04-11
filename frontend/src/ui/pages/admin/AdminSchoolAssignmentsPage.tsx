import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { AdminPageHeader } from "../../admin/components/AdminPageHeader";
import { Button } from "../../components/Button";
import { AdminModal } from "../../admin/components/AdminModal";
import { schoolAssignments } from "../../../data/admin/schoolAssignments";
import { useAdminToast } from "../../admin/hooks/useAdminToast";

export function AdminSchoolAssignmentsPage() {
  const { t } = useTranslation();
  const { show, Toast } = useAdminToast();
  const [reassignOpen, setReassignOpen] = useState(false);

  const inp = "w-full rounded-lg border border-[#E2E0D9] px-3 py-2 text-sm outline-none focus:border-[#0A3D62]";
  const lbl = "mb-1 block text-xs font-medium text-[#5C5A55]";

  return (
    <div className="font-sans">
      <Toast />
      <AdminPageHeader
        title={t("admin.pages.assignments.title")}
        subtitle={t("admin.pages.assignments.subtitle")}
        actions={
          <Button type="button" className="bg-[#0A3D62] text-white hover:bg-[#071E36]" onClick={() => setReassignOpen(true)}>
            {t("admin.pages.assignments.reassign")}
          </Button>
        }
      />

      <div className="mb-4 rounded-xl border border-[#E8F0F7] bg-[#F7FAFC] px-4 py-3 text-[13px] leading-relaxed text-[#5C5A55]">
        {t("admin.pages.assignments.accessNote")}{" "}
        <Link to="/admin/users?view=access" className="font-medium text-[#0A3D62] underline">
          {t("admin.pages.assignments.accessNoteLink")}
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#E2E0D9] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-[13.5px]">
            <thead className="border-b border-[#E2E0D9] bg-[#F5F4F0] text-[11px] font-semibold uppercase tracking-wide text-[#5C5A55]">
              <tr>
                <th className="px-4 py-3">{t("admin.dashboard.colSchool")}</th>
                <th className="px-4 py-3">{t("admin.dashboard.colCountry")}</th>
                <th className="px-4 py-3">{t("admin.pages.assignments.colAm")}</th>
                <th className="px-4 py-3">{t("admin.pages.assignments.colOpenRfqs")}</th>
                <th className="px-4 py-3">{t("admin.pages.assignments.colTouch")}</th>
                <th className="px-4 py-3 text-right">{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E0D9]">
              {schoolAssignments.map((row) => (
                <tr key={row.school} className="hover:bg-[#FAFAF8]">
                  <td className="px-4 py-3 font-semibold">{row.school}</td>
                  <td className="px-4 py-3">{row.country}</td>
                  <td className="px-4 py-3">{row.accountManager}</td>
                  <td className="px-4 py-3">{row.openRfqs}</td>
                  <td className="px-4 py-3 text-[#5C5A55]">{row.lastTouch}</td>
                  <td className="px-4 py-3 text-right">
                    <Button type="button" variant="secondary" size="sm" onClick={() => setReassignOpen(true)}>
                      {t("admin.pages.assignments.reassignOne")}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-4 text-sm text-[#5C5A55]">
        <Link to="/admin/account-managers" className="font-medium text-[#0A3D62] underline">
          {t("admin.pages.assignments.linkAm")}
        </Link>
      </p>

      <AdminModal
        open={reassignOpen}
        onClose={() => setReassignOpen(false)}
        title={t("admin.pages.assignments.modalTitle")}
        wide
        footer={
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setReassignOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button
              type="button"
              className="bg-[#0A3D62] text-white hover:bg-[#071E36]"
              onClick={() => {
                show(t("admin.pages.assignments.saved"));
                setReassignOpen(false);
              }}
            >
              {t("admin.pages.assignments.apply")}
            </Button>
          </div>
        }
      >
        <div>
          <label className={lbl}>{t("admin.pages.assignments.pickSchools")}</label>
          <select multiple className={`${inp} min-h-[120px]`} size={4}>
            {schoolAssignments.map((s) => (
              <option key={s.school}>{s.school}</option>
            ))}
          </select>
        </div>
        <div className="mt-3">
          <label className={lbl}>{t("admin.pages.assignments.newAm")}</label>
          <select className={inp}>
            <option>Mohamed Hassan</option>
            <option>Rania Khalil</option>
            <option>Omar Hassan</option>
            <option>Priya Nair</option>
          </select>
        </div>
      </AdminModal>
    </div>
  );
}
