import { useTranslation } from "react-i18next";
import { AdminModal } from "../AdminModal";
import { Button } from "../../../components/Button";
import { rfqCreateProductOptions, rfqCreateSchoolOptions } from "../../../../data/admin/rfqPipeline";

const inp = "w-full rounded-lg border border-[#E2E0D9] bg-white px-3 py-2 text-sm outline-none focus:border-[#0A3D62]";
const lbl = "mb-1 block text-xs font-medium text-[#5C5A55]";
const section = "mt-4 border-t border-[#ECEAE4] pt-4 text-xs font-bold uppercase tracking-wide text-[#5C5A55]";

type Props = {
  open: boolean;
  onClose: () => void;
  onToast: (msg: string) => void;
};

export function RfqCreateModal({ open, onClose, onToast }: Props) {
  const { t } = useTranslation();

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title={t("admin.pages.rfq.createModalTitle")}
      wide
      footer={
        <div className="flex flex-wrap justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button type="button" variant="secondary" onClick={() => { onToast(t("admin.pages.rfq.toastDraftSaved")); onClose(); }}>
            {t("admin.pages.rfq.saveDraft")}
          </Button>
          <Button type="button" className="bg-[#0A3D62] text-white hover:bg-[#071E36]" onClick={() => { onToast(t("admin.pages.rfq.toastCreated")); onClose(); }}>
            {t("admin.pages.rfq.createRfqBtn")}
          </Button>
        </div>
      }
    >
      <div className="max-h-[min(70vh,640px)] overflow-y-auto pe-1">
        <div className="rounded-lg bg-[#FFF8E7] px-3.5 py-2.5 text-[12.5px] font-medium text-[#B7791F]">{t("admin.pages.rfq.createWarn")}</div>

        <div className={section}>{t("admin.pages.rfq.createSectionSchool")}</div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <label className={lbl}>{t("admin.pages.rfq.createSchool")} *</label>
            <select className={inp} defaultValue="">
              <option value="">{t("admin.pages.rfq.selectSchool")}</option>
              {rfqCreateSchoolOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={lbl}>{t("admin.pages.rfq.createRequestedBy")}</label>
            <input className={inp} placeholder={t("admin.pages.rfq.createRequestedByPh")} />
          </div>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <label className={lbl}>{t("admin.pages.rfq.createAm")}</label>
            <select className={inp} defaultValue="Rania Khalil">
              <option value="Rania Khalil">Rania Khalil (UAE)</option>
              <option value="Ahmed Al-Rashidi">Ahmed Al-Rashidi (KSA)</option>
              <option value="Sara Nasser">Sara Nasser (UAE)</option>
            </select>
          </div>
          <div>
            <label className={lbl}>{t("admin.pages.rfq.createRequiredBy")}</label>
            <input className={inp} type="date" />
          </div>
        </div>

        <div className={section}>{t("admin.pages.rfq.createSectionProducts")}</div>
        <div className="mt-3 rounded-xl border border-[#E2E0D9] bg-[#FAFAF8] p-3">
          <div className="mb-2 text-[11px] font-semibold uppercase text-[#9A9890]">{t("admin.pages.rfq.createItemN", { n: 1 })}</div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className={lbl}>{t("admin.pages.rfq.colProduct")} *</label>
              <select className={inp} defaultValue="">
                <option value="">{t("admin.pages.rfq.selectProduct")}</option>
                {rfqCreateProductOptions.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={lbl}>{t("admin.pages.rfq.colQty")} *</label>
              <input className={inp} type="number" placeholder={t("admin.pages.rfq.qtyPh")} />
            </div>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <label className={lbl}>{t("admin.pages.rfq.createGradeRange")}</label>
              <input className={inp} placeholder="G4–G6" />
            </div>
            <div>
              <label className={lbl}>{t("admin.pages.rfq.colFormat")}</label>
              <select className={inp} defaultValue="Print">
                <option>Print</option>
                <option>Digital</option>
                <option>Blended</option>
              </select>
            </div>
          </div>
          <div className="mt-3">
            <label className={lbl}>{t("admin.pages.rfq.colNotes")}</label>
            <input className={inp} placeholder={t("admin.pages.rfq.createNotesPh")} />
          </div>
        </div>
        <Button type="button" variant="secondary" size="sm" className="mt-2" onClick={() => onToast(t("admin.pages.rfq.toastRowAdded"))}>
          {t("admin.pages.rfq.addProductRow")}
        </Button>

        <div className={section}>{t("admin.pages.rfq.createSectionMore")}</div>
        <div className="mt-3">
          <label className={lbl}>{t("admin.pages.rfq.createInternalNotes")}</label>
          <textarea className={`${inp} min-h-[80px]`} placeholder={t("admin.pages.rfq.createInternalNotesPh")} />
        </div>
        <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-[#5C5A55]">
          <input type="checkbox" className="rounded border-[#E2E0D9]" defaultChecked />
          {t("admin.pages.rfq.toggleOdooLead")}
        </label>
        <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm text-[#5C5A55]">
          <input type="checkbox" className="rounded border-[#E2E0D9]" defaultChecked />
          {t("admin.pages.rfq.toggleWaConfirm")}
        </label>
      </div>
    </AdminModal>
  );
}
