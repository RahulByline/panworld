import { useTranslation } from "react-i18next";
import { AdminModal } from "../AdminModal";
import { Button } from "../../../components/Button";
import { UploadZone } from "./CatalogueModals";

const inp = "w-full rounded-lg border border-[#E2E0D9] bg-white px-3 py-2 text-sm text-[#1A1917] outline-none focus:border-[#0A3D62]";
const lbl = "mb-1 block text-xs font-medium text-[#5C5A55]";
const row2 = "grid grid-cols-1 gap-3 sm:grid-cols-2";

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved: (msg: string) => void;
  mode: "add" | "edit";
};

export function CatalogueBookItemModal({ open, onClose, onSaved, mode }: Props) {
  const { t } = useTranslation();
  const title =
    mode === "add" ? t("admin.pages.catalogueFolder.bookModalTitleAdd") : t("admin.pages.catalogueFolder.bookModalTitleEdit");

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title={title}
      wide
      footer={
        <div className="flex flex-wrap justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              onSaved(t("admin.pages.catalogueFolder.bookModalSavedDraft"));
              onClose();
            }}
          >
            {t("admin.catalogueModals.saveDraft")}
          </Button>
          <Button
            type="button"
            className="bg-[#0A3D62] text-white hover:bg-[#071E36]"
            onClick={() => {
              onSaved(t("admin.pages.catalogueFolder.bookModalSavedPublish"));
              onClose();
            }}
          >
            {t("admin.pages.catalogueFolder.bookModalSave")}
          </Button>
        </div>
      }
    >
      <p className="text-[13px] leading-relaxed text-[#5C5A55]">{t("admin.pages.catalogueFolder.bookModalIntro")}</p>

      <div className="mt-4">
        <label className={lbl}>{t("admin.pages.catalogueFolder.bookModalCover")}</label>
        <UploadZone icon="🖼" title={t("admin.pages.catalogueFolder.bookModalUploadCover")} sub={t("admin.pages.catalogueFolder.bookModalCoverSub")} />
      </div>

      <div className="mt-5 border-t border-[#E2E0D9] pt-4">
        <div className="text-[11px] font-bold uppercase tracking-wide text-[#5C5A55]">
          {t("admin.pages.catalogueFolder.bookModalMaterialSection")}
        </div>
        <p className="mt-1.5 text-[12px] leading-relaxed text-[#5C5A55]">{t("admin.pages.catalogueFolder.bookModalMaterialHint")}</p>
        <div className="mt-3">
          <label className={lbl}>{t("admin.pages.catalogueFolder.bookModalLinkUrl")}</label>
          <input className={inp} type="url" placeholder={t("admin.pages.catalogueFolder.bookModalLinkPlaceholder")} autoComplete="off" />
        </div>
        <div className="mt-3">
          <label className={lbl}>{t("admin.pages.catalogueFolder.bookModalFileUpload")}</label>
          <UploadZone
            icon="📎"
            title={t("admin.pages.catalogueFolder.bookModalFileUploadTitle")}
            sub={t("admin.pages.catalogueFolder.bookModalFileUploadSub")}
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3">
        <div>
          <label className={lbl}>{t("admin.pages.catalogueFolder.bookModalDisplayTitle")} *</label>
          <input className={inp} placeholder={t("admin.pages.catalogueFolder.bookModalDisplayTitlePh")} />
        </div>
      </div>

      <div className={`${row2} mt-3`}>
        <div>
          <label className={lbl}>{t("admin.pages.catalogueFolder.bookModalGradeOrBand")} *</label>
          <input className={inp} placeholder="G4 · Stage 2 · Component A" />
        </div>
        <div>
          <label className={lbl}>{t("admin.pages.catalogueFolder.bookModalInternalSku")}</label>
          <input className={inp} placeholder="PW-TB-XXXXX" />
        </div>
      </div>

      <div className={`${row2} mt-3`}>
        <div>
          <label className={lbl}>{t("admin.pages.catalogueFolder.bookModalIsbn")}</label>
          <input className={inp} placeholder="978-X-XXX-XXXXX-X" />
        </div>
        <div>
          <label className={lbl}>{t("admin.pages.catalogueFolder.bookModalFormat")}</label>
          <select className={inp} defaultValue="Print">
            <option>Print</option>
            <option>Digital</option>
            <option>Blended</option>
            <option>Kit component</option>
          </select>
        </div>
      </div>

      <div className={`${row2} mt-3`}>
        <div>
          <label className={lbl}>{t("admin.pages.catalogueFolder.bookModalListPrice")} *</label>
          <input className={inp} type="number" placeholder="0.00" />
        </div>
        <div>
          <label className={lbl}>{t("admin.pages.catalogueFolder.bookModalPriceUnit")} *</label>
          <select className={inp} defaultValue="/ student">
            <option>/ student</option>
            <option>/ licence</option>
            <option>/ title</option>
            <option>/ set</option>
            <option>/ bundle</option>
            <option>/ classroom</option>
          </select>
        </div>
      </div>

      <div className={`${row2} mt-3`}>
        <div>
          <label className={lbl}>{t("admin.pages.catalogueFolder.bookModalStatus")}</label>
          <select className={inp} defaultValue="Published">
            <option>Published</option>
            <option>Draft</option>
            <option>Archived</option>
          </select>
        </div>
        <div>
          <label className={lbl}>{t("admin.pages.catalogueFolder.bookModalInventoryHint")}</label>
          <input className={inp} placeholder={t("admin.pages.catalogueFolder.bookModalInventoryPlaceholder")} />
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-[#E2E0D9] bg-[#FAFAF8] p-3 text-[12px] text-[#5C5A55]">
        {t("admin.pages.catalogueFolder.bookModalNote")}
      </div>
    </AdminModal>
  );
}
