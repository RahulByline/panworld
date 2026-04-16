import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AdminModal } from "../AdminModal";
import { Button } from "../../../components/Button";
import { UploadZone } from "./CatalogueModals";
import { inp, lbl, row2 } from "../formStyles";
import type { CatalogueLineItem } from "../../../../data/admin/catalogue";
export type CatalogueSeriesItemCreateInput = {
  resourceType: "TEXTBOOK" | "LIBRARY_BOOK" | "TEACHER_GUIDE" | "PRACTICE_BOOK" | "KIT" | "DIGITAL_LICENSE" | "ASSESSMENT" | "OTHER";
  title: string;
  subject?: string;
  gradeLabel: string;
  internalSku?: string;
  isbn?: string;
  format: string;
  price: number;
  priceUnit: string;
  status: CatalogueLineItem["status"];
  materialLinkUrl?: string;
  inventoryNote?: string;
  coverImageFile?: File;
  materialFile?: File;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved: (msg: string) => void;
  mode: "add" | "edit";
  onAdd?: (item: CatalogueLineItem) => void;
  onCreateItem?: (input: CatalogueSeriesItemCreateInput) => Promise<void>;
};

const empty = () => ({
  title: "",
  gradeLabel: "",
  isbn: "",
  price: "",
  priceUnit: "/ student",
  status: "Published" as CatalogueLineItem["status"],
});

export function CatalogueBookItemModal({ open, onClose, onSaved, mode, onAdd, onCreateItem }: Props) {
  const { t } = useTranslation();
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [internalSku, setInternalSku] = useState("");
  const [format, setFormat] = useState("Print");
  const [resourceType, setResourceType] = useState<CatalogueSeriesItemCreateInput["resourceType"]>("TEXTBOOK");
  const [subject, setSubject] = useState("");
  const [materialLinkUrl, setMaterialLinkUrl] = useState("");
  const [inventoryNote, setInventoryNote] = useState("");
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [materialFile, setMaterialFile] = useState<File | null>(null);

  useEffect(() => {
    if (open) {
      setForm(empty());
      setErrors({});
      setInternalSku("");
      setFormat("Print");
      setResourceType("TEXTBOOK");
      setSubject("");
      setMaterialLinkUrl("");
      setInventoryNote("");
      setCoverImageFile(null);
      setMaterialFile(null);
    }
  }, [open]);

  function set<K extends keyof ReturnType<typeof empty>>(k: K, v: ReturnType<typeof empty>[K]) {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: "" }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Required";
    if (!form.gradeLabel.trim()) e.gradeLabel = "Required";
    if (!form.price.trim()) e.price = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit(asDraft: boolean) {
    if (!validate()) return;
    const id = `li-${Date.now()}`;
    const numericPrice = Number(form.price.trim());
    if (Number.isNaN(numericPrice)) {
      setErrors((p) => ({ ...p, price: "Required" }));
      return;
    }
    const item: CatalogueLineItem = {
      id,
      title: form.title.trim(),
      gradeLabel: form.gradeLabel.trim(),
      isbn: form.isbn.trim() || undefined,
      price: `AED ${form.price.trim()}`,
      priceUnit: form.priceUnit,
      status: asDraft ? "Draft" : "Published",
    };
    try {
      if (onCreateItem) {
        await onCreateItem({
          resourceType,
          title: form.title.trim(),
          subject: subject.trim() || undefined,
          gradeLabel: form.gradeLabel.trim(),
          internalSku: internalSku.trim() || undefined,
          isbn: form.isbn.trim() || undefined,
          format,
          price: numericPrice,
          priceUnit: form.priceUnit,
          status: asDraft ? "Draft" : "Published",
          materialLinkUrl: materialLinkUrl.trim() || undefined,
          inventoryNote: inventoryNote.trim() || undefined,
          coverImageFile: coverImageFile || undefined,
          materialFile: materialFile || undefined,
        });
      } else {
        onAdd?.(item);
      }
      onSaved(asDraft ? t("admin.pages.catalogueFolder.bookModalSavedDraft") : t("admin.pages.catalogueFolder.bookModalSavedPublish"));
      onClose();
    } catch {
      onSaved("Could not save line item right now. Please try again.");
    }
  }

  const title = mode === "add" ? t("admin.pages.catalogueFolder.bookModalTitleAdd") : t("admin.pages.catalogueFolder.bookModalTitleEdit");

  return (
    <AdminModal open={open} onClose={onClose} title={title} wide
      footer={
        <div className="flex flex-wrap justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>{t("common.cancel")}</Button>
          <Button type="button" variant="secondary" onClick={() => submit(true)}>{t("admin.catalogueModals.saveDraft")}</Button>
          <Button type="button" className="bg-[#0A3D62] text-white hover:bg-[#071E36]" onClick={() => submit(false)}>
            {t("admin.pages.catalogueFolder.bookModalSave")}
          </Button>
        </div>
      }
    >
      <p className="text-[13px] leading-relaxed text-[#5C5A55]">{t("admin.pages.catalogueFolder.bookModalIntro")}</p>

      <div className="mt-4">
        <label className={lbl}>{t("admin.pages.catalogueFolder.bookModalCover")}</label>
        <UploadZone
          icon="🖼"
          title={t("admin.pages.catalogueFolder.bookModalUploadCover")}
          sub={t("admin.pages.catalogueFolder.bookModalCoverSub")}
          onFileChange={setCoverImageFile}
        />
      </div>

      <div className="mt-5 border-t border-[#E2E0D9] pt-4">
        <div className="text-[11px] font-bold uppercase tracking-wide text-[#5C5A55]">
          {t("admin.pages.catalogueFolder.bookModalMaterialSection")}
        </div>
        <p className="mt-1.5 text-[12px] leading-relaxed text-[#5C5A55]">{t("admin.pages.catalogueFolder.bookModalMaterialHint")}</p>
        <div className="mt-3">
          <label className={lbl}>{t("admin.pages.catalogueFolder.bookModalLinkUrl")}</label>
          <input
            className={inp}
            type="url"
            placeholder={t("admin.pages.catalogueFolder.bookModalLinkPlaceholder")}
            autoComplete="off"
            value={materialLinkUrl}
            onChange={(e) => setMaterialLinkUrl(e.target.value)}
          />
        </div>
        <div className="mt-3">
          <label className={lbl}>{t("admin.pages.catalogueFolder.bookModalFileUpload")}</label>
          <UploadZone
            icon="📎"
            title={t("admin.pages.catalogueFolder.bookModalFileUploadTitle")}
            sub={t("admin.pages.catalogueFolder.bookModalFileUploadSub")}
            accept=".pdf,.ppt,.pptx,.xls,.xlsx,.csv,.doc,.docx,.zip"
            onFileChange={setMaterialFile}
          />
        </div>
      </div>

      {/* Required fields */}
      <div className="mt-4">
        <label className={lbl}>{t("admin.pages.catalogueFolder.bookModalDisplayTitle")} *</label>
        <input className={inp} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder={t("admin.pages.catalogueFolder.bookModalDisplayTitlePh")} />
        {errors.title ? <p className="mt-1 text-xs text-red-500">{errors.title}</p> : null}
      </div>

      <div className={`${row2} mt-3`}>
        <div>
          <label className={lbl}>Resource type *</label>
          <select className={inp} value={resourceType} onChange={(e) => setResourceType(e.target.value as CatalogueSeriesItemCreateInput["resourceType"])}>
            <option value="TEXTBOOK">Textbook</option>
            <option value="LIBRARY_BOOK">Library book</option>
            <option value="TEACHER_GUIDE">Teacher guide</option>
            <option value="PRACTICE_BOOK">Practice book</option>
            <option value="KIT">Kit</option>
            <option value="DIGITAL_LICENSE">Digital license</option>
            <option value="ASSESSMENT">Assessment resource</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
        <div>
          <label className={lbl}>Subject</label>
          <input className={inp} value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Science / Maths / ELA ..." />
        </div>
      </div>

      <div className={`${row2} mt-3`}>
        <div>
          <label className={lbl}>{t("admin.pages.catalogueFolder.bookModalGradeOrBand")} *</label>
          <input className={inp} value={form.gradeLabel} onChange={(e) => set("gradeLabel", e.target.value)} placeholder="G4 · Stage 2 · Component A" />
          {errors.gradeLabel ? <p className="mt-1 text-xs text-red-500">{errors.gradeLabel}</p> : null}
        </div>
        <div>
          <label className={lbl}>{t("admin.pages.catalogueFolder.bookModalInternalSku")}</label>
          <input className={inp} placeholder="PW-TB-XXXXX" value={internalSku} onChange={(e) => setInternalSku(e.target.value)} />
        </div>
      </div>

      <div className={`${row2} mt-3`}>
        <div>
          <label className={lbl}>{t("admin.pages.catalogueFolder.bookModalIsbn")}</label>
          <input className={inp} value={form.isbn} onChange={(e) => set("isbn", e.target.value)} placeholder="978-X-XXX-XXXXX-X" />
        </div>
        <div>
          <label className={lbl}>{t("admin.pages.catalogueFolder.bookModalFormat")}</label>
          <select className={inp} value={format} onChange={(e) => setFormat(e.target.value)}>
            <option>Print</option><option>Digital</option><option>Blended</option><option>Kit component</option>
          </select>
        </div>
      </div>

      <div className={`${row2} mt-3`}>
        <div>
          <label className={lbl}>{t("admin.pages.catalogueFolder.bookModalListPrice")} *</label>
          <input className={inp} type="number" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="0.00" />
          {errors.price ? <p className="mt-1 text-xs text-red-500">{errors.price}</p> : null}
        </div>
        <div>
          <label className={lbl}>{t("admin.pages.catalogueFolder.bookModalPriceUnit")} *</label>
          <select className={inp} value={form.priceUnit} onChange={(e) => set("priceUnit", e.target.value)}>
            <option>/ student</option><option>/ licence</option><option>/ title</option>
            <option>/ set</option><option>/ bundle</option><option>/ classroom</option>
          </select>
        </div>
      </div>

      <div className={`${row2} mt-3`}>
        <div>
          <label className={lbl}>{t("admin.pages.catalogueFolder.bookModalStatus")}</label>
          <select className={inp} value={form.status} onChange={(e) => set("status", e.target.value as CatalogueLineItem["status"])}>
            <option>Published</option><option>Draft</option><option>Archived</option>
          </select>
        </div>
        <div>
          <label className={lbl}>{t("admin.pages.catalogueFolder.bookModalInventoryHint")}</label>
          <input
            className={inp}
            placeholder={t("admin.pages.catalogueFolder.bookModalInventoryPlaceholder")}
            value={inventoryNote}
            onChange={(e) => setInventoryNote(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-[#E2E0D9] bg-[#FAFAF8] p-3 text-[12px] text-[#5C5A55]">
        {t("admin.pages.catalogueFolder.bookModalNote")}
      </div>
    </AdminModal>
  );
}
