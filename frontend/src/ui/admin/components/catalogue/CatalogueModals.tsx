import { useTranslation } from "react-i18next";
import { AdminModal } from "../AdminModal";
import { Button } from "../../../components/Button";

const inp = "w-full rounded-lg border border-[#E2E0D9] bg-white px-3 py-2 text-sm text-[#1A1917] outline-none focus:border-[#0A3D62]";
const lbl = "mb-1 block text-xs font-medium text-[#5C5A55]";
const sec = "mt-4 border-t border-[#E2E0D9] pt-3 text-[11px] font-bold uppercase tracking-wide text-[#5C5A55]";
const row2 = "grid grid-cols-1 gap-3 sm:grid-cols-2";
const row3 = "grid grid-cols-1 gap-3 sm:grid-cols-3";

function Toggle({ label: text, defaultOn }: { label: string; defaultOn?: boolean }) {
  return (
    <label className="flex cursor-pointer items-center gap-2">
      <input type="checkbox" className="h-4 w-4 rounded border-[#E2E0D9] text-[#0A3D62]" defaultChecked={defaultOn ?? false} />
      <span className="text-sm text-[#1A1917]">{text}</span>
    </label>
  );
}

export function UploadZone({ icon, title, sub }: { icon: string; title: string; sub: string }) {
  return (
    <button
      type="button"
      className="flex w-full flex-col items-center rounded-xl border-2 border-dashed border-[#E2E0D9] bg-[#F5F4F0] px-4 py-6 text-center transition hover:border-[#0A3D62]/40"
    >
      <span className="text-2xl">{icon}</span>
      <span className="mt-1 text-sm font-medium text-[#1A1917]">{title}</span>
      <span className="text-xs text-[#5C5A55]">{sub}</span>
    </button>
  );
}

type ModalBase = { open: boolean; onClose: () => void; onSaved: (msg: string) => void };

export function TextbookCatalogueModal({ open, onClose, onSaved, mode }: ModalBase & { mode: "add" | "edit" }) {
  const { t } = useTranslation();
  const title = mode === "add" ? t("admin.catalogueModals.textbookAdd") : t("admin.catalogueModals.textbookEdit");
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
              onSaved(t("admin.catalogueModals.savedDraft"));
              onClose();
            }}
          >
            {t("admin.catalogueModals.saveDraft")}
          </Button>
          <Button
            type="button"
            className="bg-[#0A3D62] text-white hover:bg-[#071E36]"
            onClick={() => {
              onSaved(t("admin.catalogueModals.textbookPublished"));
              onClose();
            }}
          >
            {t("admin.catalogueModals.publishTextbook")}
          </Button>
        </div>
      }
    >
      <p className="rounded-lg border border-[#E2E0D9] bg-[#FAFAF8] px-3 py-2.5 text-[13px] leading-relaxed text-[#5C5A55]">
        {t("admin.catalogueModals.folderSeriesHint")}
      </p>
      <div className={sec}>{t("admin.catalogueModals.sectionIdentity")}</div>
      <div className={row2}>
        <div>
          <label className={lbl}>{t("admin.catalogueModals.publisher")} *</label>
          <select className={inp} defaultValue="">
            <option value="">{t("admin.catalogueModals.selectPublisher")}</option>
            <option>McGraw Hill</option>
            <option>Kodeit Global</option>
            <option>StudySync</option>
            <option>Oxford</option>
            <option>Cambridge</option>
          </select>
        </div>
        <div>
          <label className={lbl}>{t("admin.catalogueModals.seriesName")} *</label>
          <input className={inp} placeholder={t("admin.catalogueModals.seriesPlaceholder")} />
        </div>
      </div>
      <div className="mt-3">
        <label className={lbl}>{t("admin.catalogueModals.fullTitle")} *</label>
        <input className={inp} placeholder={t("admin.catalogueModals.fullTitlePh")} />
      </div>
      <div className={`${row2} mt-3`}>
        <div>
          <label className={lbl}>{t("admin.catalogueModals.edition")}</label>
          <input className={inp} placeholder="2025 Edition" />
        </div>
        <div>
          <label className={lbl}>{t("admin.catalogueModals.format")} *</label>
          <select className={inp}>
            <option>Print</option>
            <option>Digital</option>
            <option>Blended</option>
          </select>
        </div>
      </div>
      <div className={sec}>{t("admin.catalogueModals.sectionCurriculum")}</div>
      <div className={row2}>
        <div>
          <label className={lbl}>{t("admin.catalogueModals.curriculumType")} *</label>
          <select className={inp}>
            <option>American (US Common Core/NGSS)</option>
            <option>British (Cambridge/UK)</option>
            <option>IB</option>
            <option>UAE MOE</option>
            <option>Saudi NCC</option>
          </select>
        </div>
        <div>
          <label className={lbl}>{t("admin.catalogueModals.subject")} *</label>
          <select className={inp}>
            <option>Science</option>
            <option>Mathematics</option>
            <option>English / ELA</option>
            <option>Social Sciences</option>
            <option>ICT</option>
          </select>
        </div>
      </div>
      <div className={row2}>
        <div>
          <label className={lbl}>{t("admin.catalogueModals.gradeFrom")} *</label>
          <select className={inp}>
            {["KG1", "KG2", "G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8", "G9", "G10", "G11", "G12"].map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={lbl}>{t("admin.catalogueModals.gradeTo")} *</label>
          <select className={inp}>
            {["G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8", "G9", "G10", "G11", "G12"].map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
        </div>
      </div>
      <div className={sec}>{t("admin.catalogueModals.sectionBadges")}</div>
      <div className="flex flex-col gap-2">
        <Toggle label={t("admin.catalogueModals.badgeNewEd")} />
        <Toggle label={t("admin.catalogueModals.badgeNcc")} />
        <Toggle label={t("admin.catalogueModals.badgeKodeit")} />
        <Toggle label={t("admin.catalogueModals.badgeMaarif")} />
      </div>
      <div className={sec}>{t("admin.catalogueModals.sectionContent")}</div>
      <div>
        <label className={lbl}>{t("admin.catalogueModals.description")} *</label>
        <textarea className={`${inp} min-h-[88px]`} placeholder={t("admin.catalogueModals.descriptionPh")} />
      </div>
      <div>
        <label className={lbl}>{t("admin.catalogueModals.toc")}</label>
        <textarea className={`${inp} min-h-[72px]`} placeholder={t("admin.catalogueModals.tocPh")} />
      </div>
      <div className={sec}>{t("admin.catalogueModals.sectionMedia")}</div>
      <p className="mb-2 text-[12px] text-[#5C5A55]">{t("admin.catalogueModals.folderMediaHint")}</p>
      <div>
        <label className={lbl}>{t("admin.catalogueModals.folderListingImage")}</label>
        <UploadZone icon="🖼" title={t("admin.catalogueModals.uploadFolderCover")} sub="PNG, JPG · optional · folder card in catalogue" />
      </div>
      <div className={sec}>{t("admin.catalogueModals.sectionTerritory")}</div>
      <div className="flex flex-col gap-2 sm:flex-row sm:gap-8">
        <Toggle label={t("admin.catalogueModals.territoryUae")} defaultOn />
        <Toggle label={t("admin.catalogueModals.territoryKsa")} defaultOn />
      </div>
      <div className={sec}>{t("admin.catalogueModals.sectionStatus")}</div>
      <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="radio" name="pub-status" defaultChecked /> {t("admin.catalogueModals.statusPublished")}
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="radio" name="pub-status" /> {t("admin.catalogueModals.statusDraft")}
        </label>
      </div>
    </AdminModal>
  );
}

export function LibraryCatalogueModal({ open, onClose, onSaved, mode }: ModalBase & { mode: "add" | "edit" }) {
  const { t } = useTranslation();
  const title = mode === "add" ? t("admin.catalogueModals.libraryAdd") : t("admin.catalogueModals.libraryEdit");
  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title={title}
      wide
      footer={
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            type="button"
            className="bg-[#0A3D62] text-white hover:bg-[#071E36]"
            onClick={() => {
              onSaved(t("admin.catalogueModals.librarySaved"));
              onClose();
            }}
          >
            {t("admin.catalogueModals.addBook")}
          </Button>
        </div>
      }
    >
      <div className={row2}>
        <div>
          <label className={lbl}>{t("admin.catalogueModals.publisher")} *</label>
          <select className={inp}>
            <option>Oxford</option>
            <option>Cambridge</option>
            <option>Collins</option>
            <option>Pearson</option>
          </select>
        </div>
        <div>
          <label className={lbl}>{t("admin.catalogueModals.bookTitle")} *</label>
          <input className={inp} placeholder={t("admin.catalogueModals.bookTitlePh")} />
        </div>
      </div>
      <div className={row2}>
        <div>
          <label className={lbl}>{t("admin.catalogueModals.lexile")}</label>
          <select className={inp}>
            <option>200–400 (G1–G2)</option>
            <option>400–600 (G3–G4)</option>
            <option>600–800 (G5–G7)</option>
            <option>800–1000 (G8–G10)</option>
          </select>
        </div>
        <div>
          <label className={lbl}>{t("admin.catalogueModals.genre")} *</label>
          <select className={inp}>
            <option>Fiction</option>
            <option>Non-Fiction</option>
            <option>STEM</option>
            <option>Arabic Literature</option>
          </select>
        </div>
      </div>
      <div className={row2}>
        <div>
          <label className={lbl}>{t("admin.catalogueModals.language")} *</label>
          <select className={inp}>
            <option>English</option>
            <option>Arabic</option>
            <option>Bilingual</option>
          </select>
        </div>
        <div>
          <label className={lbl}>{t("admin.catalogueModals.priceAed")} *</label>
          <input className={inp} type="number" placeholder="0.00" />
        </div>
      </div>
      <div className={row2}>
        <div>
          <label className={lbl}>{t("admin.catalogueModals.numTitles")}</label>
          <input className={inp} type="number" placeholder="30" />
        </div>
        <div>
          <label className={lbl}>{t("admin.catalogueModals.curriculumAlign")}</label>
          <select className={inp}>
            <option>American</option>
            <option>British</option>
            <option>IB</option>
            <option>UAE MOE</option>
            <option>General</option>
          </select>
        </div>
      </div>
      <div>
        <label className={lbl}>{t("admin.catalogueModals.description")}</label>
        <textarea className={`${inp} min-h-[80px]`} placeholder={t("admin.catalogueModals.libraryDescPh")} />
      </div>
      <div>
        <label className={lbl}>{t("admin.catalogueModals.coverImage")}</label>
        <UploadZone icon="🖼" title={t("admin.catalogueModals.uploadCover")} sub="PNG, JPG · max 5MB" />
      </div>
    </AdminModal>
  );
}

export function KitCatalogueModal({ open, onClose, onSaved, mode }: ModalBase & { mode: "add" | "edit" }) {
  const { t } = useTranslation();
  const title = mode === "add" ? t("admin.catalogueModals.kitAdd") : t("admin.catalogueModals.kitEdit");
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
              onSaved(t("admin.catalogueModals.savedDraft"));
              onClose();
            }}
          >
            {t("admin.catalogueModals.saveDraft")}
          </Button>
          <Button
            type="button"
            className="bg-[#0A3D62] text-white hover:bg-[#071E36]"
            onClick={() => {
              onSaved(t("admin.catalogueModals.kitSaved"));
              onClose();
            }}
          >
            {t("admin.catalogueModals.addKit")}
          </Button>
        </div>
      }
    >
      <div className={sec}>{t("admin.catalogueModals.kitIdentity")}</div>
      <div className={row2}>
        <div>
          <label className={lbl}>{t("admin.catalogueModals.publisher")} *</label>
          <select className={inp}>
            <option>McGraw Hill</option>
            <option>Jolly Phonics</option>
            <option>Kodeit Global</option>
          </select>
        </div>
        <div>
          <label className={lbl}>{t("admin.catalogueModals.kitType")} *</label>
          <select className={inp}>
            <option>Science Lab Kit</option>
            <option>Phonics Kit</option>
            <option>English Collaboration Kit</option>
          </select>
        </div>
      </div>
      <div>
        <label className={lbl}>{t("admin.catalogueModals.kitName")} *</label>
        <input className={inp} placeholder={t("admin.catalogueModals.kitNamePh")} />
      </div>
      <div className={row3}>
        <div>
          <label className={lbl}>{t("admin.catalogueModals.alignedProduct")}</label>
          <input className={inp} placeholder="Inspire Science" />
        </div>
        <div>
          <label className={lbl}>{t("admin.catalogueModals.gradeLevel")} *</label>
          <select className={inp}>
            {["KG1", "KG2", "G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8"].map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={lbl}>{t("admin.catalogueModals.unitTerm")}</label>
          <input className={inp} placeholder="Unit 1" />
        </div>
      </div>
      <div className={sec}>{t("admin.catalogueModals.pricingStock")}</div>
      <div className={row3}>
        <div>
          <label className={lbl}>{t("admin.catalogueModals.priceKit")} *</label>
          <input className={inp} type="number" placeholder="0.00" />
        </div>
        <div>
          <label className={lbl}>{t("admin.catalogueModals.minOrder")}</label>
          <input className={inp} type="number" defaultValue={1} />
        </div>
        <div>
          <label className={lbl}>{t("admin.catalogueModals.stockUnits")}</label>
          <input className={inp} type="number" placeholder="0" />
        </div>
      </div>
      <div className={row2}>
        <div>
          <label className={lbl}>{t("admin.catalogueModals.setSize")}</label>
          <input className={inp} placeholder="30 student set" />
        </div>
        <div>
          <label className={lbl}>{t("admin.catalogueModals.curriculumAlign")}</label>
          <select className={inp}>
            <option>American (NGSS)</option>
            <option>British</option>
            <option>UAE MOE</option>
            <option>Saudi NCC</option>
          </select>
        </div>
      </div>
      <div className={sec}>{t("admin.catalogueModals.kitContents")}</div>
      <div>
        <label className={lbl}>{t("admin.catalogueModals.contentsList")} *</label>
        <textarea className={`${inp} min-h-[100px]`} placeholder={t("admin.catalogueModals.contentsPh")} />
      </div>
      <label className="mt-2 flex items-center gap-2 text-sm">
        <input type="checkbox" className="h-4 w-4 rounded border-[#E2E0D9]" />
        {t("admin.catalogueModals.replenishment")}
      </label>
      <div className="mt-2">
        <label className={lbl}>{t("admin.catalogueModals.replenishDetails")}</label>
        <input className={inp} placeholder={t("admin.catalogueModals.replenishPh")} />
      </div>
      <div className={sec}>{t("admin.catalogueModals.sectionMedia")}</div>
      <div className={row2}>
        <div>
          <label className={lbl}>{t("admin.catalogueModals.kitPhoto")} *</label>
          <UploadZone icon="📷" title={t("admin.catalogueModals.uploadKit")} sub="PNG, JPG · max 10MB" />
        </div>
        <div className="flex flex-col gap-2 pt-6">
          <Toggle label={t("admin.catalogueModals.badgePartner")} />
          <Toggle label={t("admin.catalogueModals.badgeNcc")} />
        </div>
      </div>
    </AdminModal>
  );
}
