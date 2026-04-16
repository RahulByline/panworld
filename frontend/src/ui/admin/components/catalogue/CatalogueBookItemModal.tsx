import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AdminModal } from "../AdminModal";
import { Button } from "../../../components/Button";
import { UploadZone } from "./CatalogueModals";
import { inp, lbl, row2 } from "../formStyles";
import type { CatalogueLineItem } from "../../../../data/admin/catalogue";
export type CatalogueSeriesItemCreateInput = {
  resourceType: "TEXTBOOK" | "LIBRARY_BOOK" | "TEACHER_GUIDE" | "PRACTICE_BOOK" | "KIT" | "DIGITAL_LICENSE" | "ASSESSMENT" | "BROCHURE" | "OTHER";
  title: string;
  subject?: string;
  gradeLabel: string;
  internalSku?: string;
  isbn?: string;
  format: string;
  price: number;
  currency: string;
  priceUnit: string;
  status: CatalogueLineItem["status"];
  materialLinkUrl?: string;
  inventoryNote?: string;
  coverImageFile?: File;
  materialFile?: File;
  onProgress?: (pct: number) => void;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved: (msg: string) => void;
  mode: "add" | "edit";
  onAdd?: (item: CatalogueLineItem) => void;
  category?: "textbooks" | "library" | "kits";
  onCreateItem?: (input: CatalogueSeriesItemCreateInput) => Promise<void>;
};

const empty = () => ({
  title: "",
  isbn: "",
  status: "Published" as CatalogueLineItem["status"],
});

const GRADES = ["", "KG Level 1", "KG Level 2", "KG Level 3", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];
const SUBJECTS = ["Science", "Mathematics", "English / ELA", "Social Sciences", "ICT", "Arabic", "Islamic Studies"];
const PRICE_UNITS = ["/ student", "/ licence", "/ title", "/ set", "/ bundle", "/ classroom"];

function CreatableSelect({ value, onChange, options, placeholder, addLabel }: { value: string, onChange: (v: string) => void, options: string[], placeholder?: string, addLabel: string }) {
  const [isCustom, setIsCustom] = useState(() => !options.includes(value) && value !== "");

  if (isCustom) {
    return (
      <div className="flex w-full items-center gap-2">
        <input
          className={inp}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoFocus
        />
        <button type="button" className="shrink-0 text-[11px] font-semibold text-[#5C5A55] hover:text-red-500" onClick={() => { setIsCustom(false); onChange(""); }}>Cancel</button>
      </div>
    );
  }

  return (
    <select
      className={inp}
      value={options.includes(value) ? value : ""}
      onChange={(e) => {
        if (e.target.value === "__ADD_NEW__") {
          setIsCustom(true);
          onChange("");
        } else {
          onChange(e.target.value);
        }
      }}
    >
      <option value="">{placeholder || "Select..."}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
      <option value="__ADD_NEW__" className="font-semibold text-[#0A3D62]">{addLabel}</option>
    </select>
  );
}

export function CatalogueBookItemModal({ open, onClose, onSaved, mode, onAdd, category, onCreateItem }: Props) {
  const { t } = useTranslation();
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [internalSku, setInternalSku] = useState("");
  const [resourceType, setResourceType] = useState<CatalogueSeriesItemCreateInput["resourceType"]>("TEXTBOOK");
  const [subject, setSubject] = useState("");
  const [materialSource, setMaterialSource] = useState<"link" | "file">("link");
  const [materialLinkUrl, setMaterialLinkUrl] = useState("");
  const [inventoryNote, setInventoryNote] = useState("");
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [materialFile, setMaterialFile] = useState<File | null>(null);

  const [format, setFormat] = useState("Print");
  const [currency, setCurrency] = useState("AED");
  const [price, setPrice] = useState("");
  const [priceUnit, setPriceUnit] = useState("/ student");
  const [otherLabel, setOtherLabel] = useState("");
  const [gradeMode, setGradeMode] = useState<"single" | "range">("single");
  const [singleGrade, setSingleGrade] = useState("");
  const [gradeFrom, setGradeFrom] = useState("");
  const [gradeTo, setGradeTo] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (open) {
      setForm(empty());
      setErrors({});
      setInternalSku("");
      setResourceType(category === "library" ? "LIBRARY_BOOK" : category === "kits" ? "KIT" : "TEXTBOOK");
      setSubject("");
      setMaterialSource("link");
      setMaterialLinkUrl("");
      setInventoryNote("");
      setCoverImageFile(null);
      setMaterialFile(null);
      setFormat("Print");
      setCurrency("AED");
      setPrice("");
      setPriceUnit("/ student");
      setOtherLabel("");
      setGradeMode("single");
      setSingleGrade("");
      setGradeFrom("");
      setGradeTo("");
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [open, category]);

  function set<K extends keyof ReturnType<typeof empty>>(k: K, v: ReturnType<typeof empty>[K]) {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: "" }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Required";
    if (gradeMode === "single" && !singleGrade) e.grade = "Required";
    if (gradeMode === "range" && !gradeFrom && !gradeTo) e.grade = "Required";
    if (resourceType === "OTHER" && !otherLabel.trim()) e.otherLabel = "Required";
    if (resourceType !== "BROCHURE" && (!price.trim() || Number.isNaN(Number(price.trim())))) e.price = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit(asDraft: boolean) {
    if (!validate()) return;
    const isBrochure = resourceType === "BROCHURE";

    const calculatedGradeLabel = gradeMode === "single" ? singleGrade : (!gradeFrom && !gradeTo) ? "" : gradeFrom === gradeTo ? gradeFrom : `${gradeFrom}–${gradeTo}`;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const basePayload = {
        resourceType,
        title: form.title.trim(),
        subject: subject.trim() || undefined,
        gradeLabel: calculatedGradeLabel,
        internalSku: internalSku.trim() || undefined,
        status: (asDraft ? "Draft" : "Published") as CatalogueLineItem["status"],
        materialLinkUrl: materialSource === "link" ? (materialLinkUrl.trim() || undefined) : undefined,
        inventoryNote: inventoryNote.trim() || undefined,
        coverImageFile: coverImageFile || undefined,
        materialFile: materialSource === "file" ? (materialFile || undefined) : undefined,
        onProgress: (pct: number) => setUploadProgress(pct),
      };

      if (isBrochure) {
        if (onCreateItem) {
          await onCreateItem({
            ...basePayload,
            format: "Digital",
            price: 0,
            currency: "AED",
            priceUnit: "",
          });
        } else {
          onAdd?.({
            id: `li-${Date.now()}`,
            title: basePayload.title,
            gradeLabel: basePayload.gradeLabel,
            price: "Free",
            priceUnit: "",
            status: basePayload.status,
          });
        }
      } else {
        if (onCreateItem) {
          await onCreateItem({
            ...basePayload,
            format,
            price: Number(price),
            currency,
            priceUnit,
            isbn: form.isbn || undefined,
          });
        } else {
          onAdd?.({
            id: `li-${Date.now()}`,
            title: basePayload.title,
            gradeLabel: basePayload.gradeLabel,
            isbn: form.isbn || undefined,
            price: `${currency} ${price}`,
            priceUnit,
            status: basePayload.status,
          });
        }
      }
      onSaved(asDraft ? t("admin.pages.catalogueFolder.bookModalSavedDraft") : t("admin.pages.catalogueFolder.bookModalSavedPublish"));
      onClose();
    } catch (err: any) {
      console.error("Upload error:", err);
      const msg = err?.response?.data?.error?.message || "Could not save line item right now. Please try again.";
      onSaved(msg);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }

  const title = mode === "add" ? t("admin.pages.catalogueFolder.bookModalTitleAdd") : t("admin.pages.catalogueFolder.bookModalTitleEdit");

  return (
    <AdminModal open={open} onClose={onClose} title={title} wide
      footer={
        <div className="flex flex-wrap justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isUploading}>{t("common.cancel")}</Button>
          <Button type="button" variant="secondary" onClick={() => submit(true)} disabled={isUploading}>
            {isUploading ? "Uploading..." : t("admin.catalogueModals.saveDraft")}
          </Button>
          <Button 
            type="button" 
            className="bg-[#0A3D62] text-white hover:bg-[#071E36] min-w-[120px]" 
            onClick={() => submit(false)}
            disabled={isUploading}
          >
            {isUploading ? `Uploading ${uploadProgress}%` : t("admin.pages.catalogueFolder.bookModalSave")}
          </Button>
        </div>
      }
    >
      {isUploading && (
        <div className="mb-4 overflow-hidden rounded-full bg-[#FAFAF8] ring-1 ring-[#E2E0D9]">
          <div 
            className="h-2 bg-[#0A3D62] transition-all duration-300 ease-out" 
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}
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
        <p className="mt-1.5 mb-3 text-[12px] leading-relaxed text-[#5C5A55]">{t("admin.pages.catalogueFolder.bookModalMaterialHint")}</p>

        <div className="flex items-center gap-4 mb-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input type="radio" checked={materialSource === "link"} onChange={() => setMaterialSource("link")} className="text-[#0A3D62]" />
            Provide Direct Link
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input type="radio" checked={materialSource === "file"} onChange={() => setMaterialSource("file")} className="text-[#0A3D62]" />
            Upload File
          </label>
        </div>

        {materialSource === "link" ? (
          <div className="mt-2">
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
        ) : (
          <div className="mt-2">
            <label className={lbl}>{t("admin.pages.catalogueFolder.bookModalFileUpload")}</label>
            <UploadZone
              icon="📎"
              title={t("admin.pages.catalogueFolder.bookModalFileUploadTitle")}
              sub={t("admin.pages.catalogueFolder.bookModalFileUploadSub")}
              accept=".pdf,.ppt,.pptx,.xls,.xlsx,.csv,.doc,.docx,.zip"
              onFileChange={setMaterialFile}
            />
          </div>
        )}
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
            {category === "library" ? <option value="LIBRARY_BOOK">Library Book</option> : category === "kits" ? <option value="KIT">Kit Item</option> : <option value="TEXTBOOK">Textbook</option>}
            <option value="BROCHURE">Brochure / Catalogue</option>
            <option value="OTHER">Other (Specify)</option>
          </select>
        </div>
        {resourceType === "OTHER" ? (
          <div>
            <label className={lbl}>Specify Resource Type</label>
            <input className={inp} value={otherLabel} onChange={(e) => setOtherLabel(e.target.value)} placeholder="" />
            {errors.otherLabel ? <p className="mt-1 text-xs text-red-500">{errors.otherLabel}</p> : null}
          </div>
        ) : (
          <div>
            <label className={lbl}>Subject</label>
            <CreatableSelect value={subject} onChange={setSubject} options={SUBJECTS} placeholder="— Select Subject —" addLabel="+ Add Subject" />
          </div>
        )}
      </div>

      <div className={`${row2} mt-3`}>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className={lbl}>{t("admin.pages.catalogueFolder.bookModalGradeOrBand")} *</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5 text-xs text-[#5C5A55] cursor-pointer">
                <input type="radio" className="text-[#0A3D62]" checked={gradeMode === "single"} onChange={() => setGradeMode("single")} /> {t("admin.catalogueModals.singleGrade")}
              </label>
              <label className="flex items-center gap-1.5 text-xs text-[#5C5A55] cursor-pointer">
                <input type="radio" className="text-[#0A3D62]" checked={gradeMode === "range"} onChange={() => setGradeMode("range")} /> {t("admin.catalogueModals.gradeRange")}
              </label>
            </div>
          </div>
          {gradeMode === "single" ? (
            <select className={inp} value={singleGrade} onChange={(e) => setSingleGrade(e.target.value)}>
              {GRADES.map((g) => <option key={g} value={g}>{g === "" ? "— Select Grade —" : g}</option>)}
            </select>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <select className={inp} value={gradeFrom} onChange={(e) => setGradeFrom(e.target.value)}>
                {GRADES.map((g) => <option key={g} value={g}>{g === "" ? "— Grade From —" : g}</option>)}
              </select>
              <select className={inp} value={gradeTo} onChange={(e) => setGradeTo(e.target.value)}>
                {GRADES.map((g) => <option key={g} value={g}>{g === "" ? "— Grade To —" : g}</option>)}
              </select>
            </div>
          )}
          {errors.grade ? <p className="mt-1 text-xs text-red-500">{errors.grade}</p> : null}
        </div>
        <div>
          <label className={lbl}>{t("admin.pages.catalogueFolder.bookModalInternalSku")}</label>
          <input className={inp} placeholder="PW-TB-XXXXX" value={internalSku} onChange={(e) => setInternalSku(e.target.value)} />
        </div>
      </div>

      {resourceType !== "BROCHURE" && (
        <div className="mt-5 border-t border-[#E2E0D9] pt-4">
          <div className="text-[11px] font-bold uppercase tracking-wide text-[#5C5A55] mb-3">
            Item Pricing
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div>
              <label className={lbl}>{t("admin.pages.catalogueFolder.bookModalFormat")}</label>
              <input className={inp} value={format} onChange={(e) => setFormat(e.target.value)} placeholder="Print / Digital / PPT..." />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className={lbl}>{t("admin.pages.catalogueFolder.bookModalListPrice")} *</label>
              <div className="flex gap-1">
                <select className={`${inp} w-[70px] px-1`} value={currency} onChange={(e) => setCurrency(e.target.value)}>
                  <option value="AED">AED</option>
                  <option value="SAR">SAR</option>
                  <option value="USD">USD</option>
                </select>
                <input className={inp} type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" />
              </div>
              {errors.price ? <p className="mt-1 text-xs text-red-500">{errors.price}</p> : null}
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className={lbl}>{t("admin.pages.catalogueFolder.bookModalPriceUnit")} *</label>
              <CreatableSelect
                value={priceUnit}
                onChange={setPriceUnit}
                options={PRICE_UNITS}
                placeholder="— None —"
                addLabel="+ Add custom unit"
              />
            </div>
            <div>
              <label className={lbl}>{t("admin.pages.catalogueFolder.bookModalIsbn")}</label>
              <input className={inp} value={form.isbn} onChange={(e) => set("isbn", e.target.value)} placeholder="978-X-XXX-XXXXX-X" />
            </div>
          </div>
        </div>
      )}

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
