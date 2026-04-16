import { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { AdminModal } from "../AdminModal";
import { Button } from "../../../components/Button";
import { inp, lbl, sec, row2, row3 } from "../formStyles";
import type { CatalogueProductRow } from "../../../../data/admin/catalogue";
import Editor from "react-simple-wysiwyg";

const section = sec;
function Toggle({ label: text, defaultOn }: { label: string; defaultOn?: boolean }) {
  return (
    <label className="flex cursor-pointer items-center gap-2">
      <input type="checkbox" className="h-4 w-4 rounded border-[#E2E0D9] text-[#0A3D62]" defaultChecked={defaultOn ?? false} />
      <span className="text-sm text-[#1A1917]">{text}</span>
    </label>
  );
}

export function UploadZone({
  icon,
  title,
  sub,
  accept = "image/png,image/jpeg,image/webp",
  onFileChange,
}: {
  icon: string;
  title: string;
  sub: string;
  accept?: string;
  onFileChange?: (file: File | null) => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      onFileChange?.(null);
      return;
    }
    setPreview(URL.createObjectURL(file));
    onFileChange?.(file);
  }

  function remove(e: React.MouseEvent) {
    e.stopPropagation();
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
    onFileChange?.(null);
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFile}
      />
      {preview ? (
        <div className="relative inline-block w-full">
          <img
            src={preview}
            alt="Preview"
            className="h-36 w-full rounded-xl object-cover ring-1 ring-[#E2E0D9]"
          />
          <button
            type="button"
            onClick={remove}
            className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow ring-1 ring-[#E2E0D9] hover:bg-red-50"
            aria-label="Remove image"
          >
            <X className="h-3.5 w-3.5 text-[#5C5A55]" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center rounded-xl border-2 border-dashed border-[#E2E0D9] bg-[#F5F4F0] px-4 py-6 text-center transition hover:border-[#0A3D62]/40 hover:bg-[#ECEAE4]"
        >
          <span className="text-2xl">{icon}</span>
          <span className="mt-1 text-sm font-medium text-[#1A1917]">{title}</span>
          <span className="text-xs text-[#5C5A55]">{sub}</span>
        </button>
      )}
    </div>
  );
}

type ModalBase = { open: boolean; onClose: () => void; onSaved: (msg: string) => void };
export type TextbookSeriesCreateInput = {
  name: string;
  publisher: string;
  format: string;
  curriculum: string;
  subject: string;
  gradeFrom: string;
  gradeTo: string;
  description: string;
  detailLine: string;
  status: "Published" | "Draft" | "Archived";
  badges: string[];
  territories: string[];
  marketingElements: Array<{ assetType: string; title: string; assetUrl: string; audienceStage: "PRE_SALES" | "POST_SALES" | "BOTH" }>;
};
type TextbookModalProps = ModalBase & {
  mode: "add" | "edit";
  onAdd?: (row: CatalogueProductRow) => void;
  onCreateSeries?: (input: TextbookSeriesCreateInput) => Promise<void>;
};

const GRADES = ["", "KG Level 1", "KG Level 2", "KG Level 3", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];
const PUBLISHERS = ["McGraw Hill", "Kodeit Global", "StudySync", "Oxford", "Cambridge", "Pearson", "Jolly Phonics"];
const SUBJECTS = ["Science", "Mathematics", "English / ELA", "Social Sciences", "ICT", "Arabic", "Islamic Studies"];

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

const emptyCatalogue = () => ({
  name: "",
  publisher: "",
  subject: "",
  gradeFrom: "",
  gradeTo: "",
  format: "",
  curriculum: "",
  description: "",
  status: "Published" as "Published" | "Draft",
});

export function CatalogueModal({ open, onClose, onSaved, mode: _mode, onAdd }: TextbookModalProps) {
  const [form, setForm] = useState(emptyCatalogue);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) { setForm(emptyCatalogue()); setErrors({}); }
  }, [open]);

  function set<K extends keyof ReturnType<typeof emptyCatalogue>>(k: K, v: ReturnType<typeof emptyCatalogue>[K]) {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: "" }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Catalogue name is required";
    if (!form.publisher) e.publisher = "Publisher is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function submit(asDraft: boolean) {
    if (!validate()) return;
    const id = `tb-${Date.now()}`;
    const grades = (!form.gradeFrom && !form.gradeTo) ? "" : form.gradeFrom === form.gradeTo ? form.gradeFrom : `${form.gradeFrom}–${form.gradeTo}`;
    const newRow: CatalogueProductRow = {
      id,
      name: form.name.trim(),
      publisher: form.publisher,
      grades,
      format: form.format,
      price: "AED —",
      badges: [],
      status: asDraft ? "Draft" : "Published",
      cardIcon: "default",
      headerKey: "default",
      detailLine: form.description.trim().slice(0, 80),
      curriculum: `${form.curriculum} · ${form.subject}`,
      gradeBuckets: [grades],
      lineItems: [],
      folderPriceLabel: "No books yet — add below",
      folderDetailSummary: `${form.subject} · ${grades}`,
      folderAccess: { passwordProtected: false },
    };
    onAdd?.(newRow);
    onSaved(asDraft ? "Catalogue saved as draft." : "Catalogue published.");
    onClose();
  }

  return (
    <AdminModal open={open} onClose={onClose} title="Add catalogue" wide
      footer={
        <div className="flex flex-wrap justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-xl border border-[#E2E0D9] px-4 py-2 text-sm text-[#5C5A55] hover:bg-[#F5F4F0]">Cancel</button>
          <button type="button" onClick={() => submit(true)} className="rounded-xl border border-[#E2E0D9] px-4 py-2 text-sm text-[#1A1917] hover:bg-[#F5F4F0]">Save as draft</button>
          <button type="button" onClick={() => submit(false)} className="rounded-xl bg-[#0A1628] px-5 py-2 text-sm font-semibold text-white hover:bg-[#071E36]">Create catalogue</button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Catalogue name */}
        <div>
          <label className={lbl}>Catalogue name *</label>
          <input className={inp} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Inspire Science G1–G8" />
          {errors.name ? <p className="mt-1 text-xs text-red-500">{errors.name}</p> : null}
        </div>

        {/* Publisher + Format */}
        <div className={row2}>
          <div>
            <label className={lbl}>Publisher *</label>
            <select className={inp} value={form.publisher} onChange={(e) => set("publisher", e.target.value)}>
              <option value="">— Select publisher —</option>
              {PUBLISHERS.map((p) => <option key={p}>{p}</option>)}
            </select>
            {errors.publisher ? <p className="mt-1 text-xs text-red-500">{errors.publisher}</p> : null}
          </div>
          <div>
            <label className={lbl}>Format</label>
            <select className={inp} value={form.format} onChange={(e) => set("format", e.target.value)}>
              <option>Print</option><option>Digital</option><option>Blended</option>
            </select>
          </div>
        </div>

        {/* Subject + Curriculum */}
        <div className={row2}>
          <div>
            <label className={lbl}>Subject</label>
            <select className={inp} value={form.subject} onChange={(e) => set("subject", e.target.value)}>
              <option>Science</option><option>Mathematics</option><option>English / ELA</option>
              <option>Social Sciences</option><option>ICT</option><option>Arabic</option>
            </select>
          </div>
          <div>
            <label className={lbl}>Curriculum</label>
            <select className={inp} value={form.curriculum} onChange={(e) => set("curriculum", e.target.value)}>
              <option>American (US Common Core/NGSS)</option>
              <option>British (Cambridge/UK)</option>
              <option>IB</option><option>UAE MOE</option><option>Saudi NCC</option>
            </select>
          </div>
        </div>

        {/* Grade range */}
        <div className={row2}>
          <div>
            <label className={lbl}>Grade from</label>
            <select className={inp} value={form.gradeFrom} onChange={(e) => set("gradeFrom", e.target.value)}>
              {GRADES.map((g) => <option key={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className={lbl}>Grade to</label>
            <select className={inp} value={form.gradeTo} onChange={(e) => set("gradeTo", e.target.value)}>
              {GRADES.map((g) => <option key={g}>{g}</option>)}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className={lbl}>Description <span className="font-normal text-[#9A9890]">(optional)</span></label>
          <textarea className={`${inp} min-h-[80px] resize-none`} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Brief description of this catalogue series..." />
        </div>

        {/* Cover image */}
        <div>
          <label className={lbl}>Cover image <span className="font-normal text-[#9A9890]">(optional)</span></label>
          <UploadZone icon="🖼" title="Upload catalogue cover" sub="PNG, JPG · shown on the catalogue card" />
        </div>

        {/* Status */}
        <div className="flex gap-6">
          {(["Published", "Draft"] as const).map((s) => (
            <label key={s} className="flex cursor-pointer items-center gap-2 text-sm">
              <input type="radio" checked={form.status === s} onChange={() => set("status", s)} />
              {s}
            </label>
          ))}
        </div>
      </div>
    </AdminModal>
  );
}

const emptyTextbook = () => ({
  publisher: "",
  seriesName: "",
  fullTitle: "",
  edition: "",
  format: "",
  curriculum: "",
  subject: "",
  gradeMode: "single" as "single" | "range",
  singleGrade: "",
  gradeFrom: "",
  gradeTo: "",
  description: "",
  badgeNewEd: false,
  badgeNcc: false,
  badgeKodeit: false,
  badgeMaarif: false,
  territoryUae: true,
  territoryKsa: true,
  status: "Published" as "Published" | "Draft",
});

export function TextbookProductModal({ open, onClose, onSaved, mode: _mode, onAdd, onCreateSeries }: TextbookModalProps) {
  const { t } = useTranslation();
  const [form, setForm] = useState(emptyTextbook);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) { setForm(emptyTextbook()); setErrors({}); }
  }, [open]);

  function set<K extends keyof ReturnType<typeof emptyTextbook>>(k: K, v: ReturnType<typeof emptyTextbook>[K]) {
    setForm((p) => {
      const next = { ...p, [k]: v };
      if (k === "publisher" && v === "Kodeit Global") {
        next.badgeKodeit = true;
      }
      return next;
    });
    setErrors((p) => ({ ...p, [k]: "" }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.publisher) e.publisher = "Required";
    if (!form.seriesName.trim()) e.seriesName = "Required";
    if (!form.fullTitle.trim()) e.fullTitle = "Required";
    if (!form.description.trim()) e.description = "Required";
    if (form.gradeMode === "single" && !form.singleGrade) e.grades = "Required";
    if (form.gradeMode === "range" && !form.gradeFrom && !form.gradeTo) e.grades = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit(asDraft: boolean) {
    if (!validate()) return;
    const id = `tb-${Date.now()}`;
    const grades = form.gradeMode === "single" ? form.singleGrade : (!form.gradeFrom && !form.gradeTo) ? "" : form.gradeFrom === form.gradeTo ? form.gradeFrom : `${form.gradeFrom}–${form.gradeTo}`;
    const badges: string[] = [];
    if (form.badgeNewEd) badges.push("New Ed.");
    if (form.badgeNcc) badges.push("NCC");
    if (form.badgeKodeit) badges.push("Our Brand");
    if (form.badgeMaarif) badges.push("Maarif");
    const newRow: CatalogueProductRow = {
      id,
      name: form.fullTitle.trim(),
      publisher: form.publisher,
      grades,
      format: form.format,
      price: "AED —",
      badges,
      status: asDraft ? "Draft" : "Published",
      cardIcon: "default",
      headerKey: "default",
      detailLine: form.description.trim().slice(0, 80),
      curriculum: `${form.curriculum} · ${form.subject}`,
      gradeBuckets: [grades],
      lineItems: [],
      folderPriceLabel: "No items yet",
      folderDetailSummary: `${form.subject} · ${form.curriculum}`,
      folderAccess: { passwordProtected: false },
    };
    try {
      if (onCreateSeries) {
        await onCreateSeries({
          name: form.fullTitle.trim(),
          publisher: form.publisher,
          format: form.format,
          curriculum: form.curriculum,
          subject: form.subject,
          gradeFrom: form.gradeMode === "single" ? form.singleGrade : form.gradeFrom,
          gradeTo: form.gradeMode === "single" ? form.singleGrade : form.gradeTo,
          description: form.description.trim(),
          detailLine: form.description.trim().slice(0, 80),
          status: asDraft ? "Draft" : "Published",
          badges,
          territories: [form.territoryUae ? "UAE" : "", form.territoryKsa ? "KSA" : ""].filter(Boolean),
          marketingElements: [],
        });
      } else {
        onAdd?.(newRow);
      }
      onSaved(asDraft ? t("admin.catalogueModals.savedDraft") : t("admin.catalogueModals.textbookPublished"));
      onClose();
    } catch {
      onSaved("Could not save catalogue right now. Please try again.");
    }
  }

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title="Add catalogue"
      wide
      footer={
        <div className="flex flex-wrap justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>{t("common.cancel")}</Button>
          <Button type="button" variant="secondary" onClick={() => submit(true)}>{t("admin.catalogueModals.saveDraft")}</Button>
          <Button type="button" className="bg-[#0A3D62] text-white hover:bg-[#071E36]" onClick={() => submit(false)}>
            {t("admin.catalogueModals.publishCatalogue")}
          </Button>
        </div>
      }
    >
      <div className={section}>{t("admin.catalogueModals.sectionIdentity")}</div>
      <div className={row2}>
        <div>
          <label className={lbl}>{t("admin.catalogueModals.publisher")} *</label>
          <select className={inp} value={form.publisher} onChange={(e) => set("publisher", e.target.value)}>
            <option value="">{t("admin.catalogueModals.selectPublisher")}</option>
            {["McGraw Hill", "Kodeit Global", "StudySync", "Oxford", "Cambridge", "Pearson", "Jolly Phonics"].map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
          {errors.publisher ? <p className="mt-1 text-xs text-red-500">{errors.publisher}</p> : null}
        </div>
        <div>
          <label className={lbl}>{t("admin.catalogueModals.seriesName")} *</label>
          <input className={inp} value={form.seriesName} onChange={(e) => set("seriesName", e.target.value)} placeholder={t("admin.catalogueModals.seriesPlaceholder")} />
          {errors.seriesName ? <p className="mt-1 text-xs text-red-500">{errors.seriesName}</p> : null}
        </div>
      </div>
      <div className="mt-4">
        <label className={lbl}>{t("admin.catalogueModals.fullTitle")} *</label>
        <input className={inp} value={form.fullTitle} onChange={(e) => set("fullTitle", e.target.value)} placeholder={t("admin.catalogueModals.fullTitlePh")} />
        {errors.fullTitle ? <p className="mt-1 text-xs text-red-500">{errors.fullTitle}</p> : null}
      </div>
      <div className={`${row2} mt-4`}>
        <div>
          <label className={lbl}>{t("admin.catalogueModals.edition")}</label>
          <input className={inp} value={form.edition} onChange={(e) => set("edition", e.target.value)} placeholder="2025 Edition" />
        </div>
        <div>
          <label className={lbl}>{t("admin.catalogueModals.format")}</label>
          <select className={inp} value={form.format} onChange={(e) => set("format", e.target.value)}>
            <option value="">— Select format —</option><option>Print</option><option>Digital</option><option>Blended</option>
          </select>
        </div>
      </div>

      <div className={section}>{t("admin.catalogueModals.sectionCurriculum")}</div>
      <div className={row2}>
        <div>
          <label className={lbl}>{t("admin.catalogueModals.curriculumType")}</label>
          <select className={inp} value={form.curriculum} onChange={(e) => set("curriculum", e.target.value)}>
            <option value="">— Select curriculum —</option>
            <option>American (US Common Core/NGSS)</option>
            <option>British (Cambridge/UK)</option>
            <option>IB</option><option>UAE MOE</option><option>Saudi NCC</option>
          </select>
        </div>
        <div>
          <label className={lbl}>{t("admin.catalogueModals.subject")}</label>
          <CreatableSelect
            value={form.subject}
            onChange={(v) => set("subject", v)}
            options={SUBJECTS}
            placeholder={t("admin.catalogueModals.selectSubject")}
            addLabel="+ Add Subject"
          />
        </div>
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <label className={lbl}>{t("admin.catalogueModals.gradeRange")} *</label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1.5 text-xs text-[#5C5A55] cursor-pointer">
              <input type="radio" className="text-[#0A3D62]" checked={form.gradeMode === "single"} onChange={() => set("gradeMode", "single")} /> {t("admin.catalogueModals.singleGrade")}
            </label>
            <label className="flex items-center gap-1.5 text-xs text-[#5C5A55] cursor-pointer">
              <input type="radio" className="text-[#0A3D62]" checked={form.gradeMode === "range"} onChange={() => set("gradeMode", "range")} /> {t("admin.catalogueModals.gradeModeRange")}
            </label>
          </div>
        </div>

        {form.gradeMode === "single" ? (
          <select className={inp} value={form.singleGrade} onChange={(e) => set("singleGrade", e.target.value)}>
            {GRADES.map((g) => <option key={g} value={g}>{g === "" ? t("admin.catalogueModals.selectGrade") : g}</option>)}
          </select>
        ) : (
          <div className={`${row2}`}>
            <div>
              <label className="mb-1 block text-[11px] text-[#9A9890]">{t("admin.catalogueModals.gradeFrom")}</label>
              <select className={inp} value={form.gradeFrom} onChange={(e) => set("gradeFrom", e.target.value)}>
                {GRADES.map((g) => <option key={g} value={g}>{g === "" ? t("admin.catalogueModals.selectGrade") : g}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] text-[#9A9890]">{t("admin.catalogueModals.gradeTo")}</label>
              <select className={inp} value={form.gradeTo} onChange={(e) => set("gradeTo", e.target.value)}>
                {GRADES.map((g) => <option key={g} value={g}>{g === "" ? t("admin.catalogueModals.selectGrade") : g}</option>)}
              </select>
            </div>
          </div>
        )}
        {errors.grades ? <p className="mt-1 text-xs text-red-500">{errors.grades}</p> : null}
      </div>

      <div className={section}>{t("admin.catalogueModals.sectionBadges")}</div>
      <div className="flex flex-col gap-2">
        {([["badgeNewEd", t("admin.catalogueModals.badgeNewEd")], ["badgeNcc", t("admin.catalogueModals.badgeNcc")], ["badgeKodeit", t("admin.catalogueModals.badgeKodeit")], ["badgeMaarif", t("admin.catalogueModals.badgeMaarif")]] as const).map(([k, label]) => (
          <label key={k} className="flex cursor-pointer items-center gap-2">
            <input type="checkbox" className="h-4 w-4 rounded border-[#E2E0D9] text-[#0A3D62]" checked={form[k]} onChange={(e) => set(k, e.target.checked)} />
            <span className="text-sm text-[#1A1917]">{label}</span>
          </label>
        ))}
      </div>

      <div className={section}>{t("admin.catalogueModals.sectionContent")}</div>
      <div>
        <label className={lbl}>{t("admin.catalogueModals.description")} *</label>
        <div className="mt-1 bg-white">
          <Editor containerProps={{ style: { height: '160px', overflowY: 'auto' } }} value={form.description} onChange={(e) => set("description", e.target.value)} />
        </div>
        {errors.description ? <p className="mt-2 text-xs text-red-500">{errors.description}</p> : null}
      </div>

      <div className={`${section} mt-14`}>{t("admin.catalogueModals.sectionMedia")}</div>
      <p className="mb-2 text-[12px] text-[#5C5A55]">{t("admin.catalogueModals.folderMediaHint")}</p>
      <div>
        <label className={lbl}>{t("admin.catalogueModals.folderListingImage")}</label>
        <UploadZone icon="🖼" title={t("admin.catalogueModals.uploadFolderCover")} sub="PNG, JPG · optional · folder card in catalogue" />
      </div>

      <div className={section}>{t("admin.catalogueModals.sectionTerritory")}</div>
      <div className="flex flex-col gap-2 sm:flex-row sm:gap-8">
        <label className="flex cursor-pointer items-center gap-2">
          <input type="checkbox" className="h-4 w-4 rounded border-[#E2E0D9]" checked={form.territoryUae} onChange={(e) => set("territoryUae", e.target.checked)} />
          <span className="text-sm text-[#1A1917]">{t("admin.catalogueModals.territoryUae")}</span>
        </label>
        <label className="flex cursor-pointer items-center gap-2">
          <input type="checkbox" className="h-4 w-4 rounded border-[#E2E0D9]" checked={form.territoryKsa} onChange={(e) => set("territoryKsa", e.target.checked)} />
          <span className="text-sm text-[#1A1917]">{t("admin.catalogueModals.territoryKsa")}</span>
        </label>
      </div>

      <div className={section}>{t("admin.catalogueModals.sectionStatus")}</div>
      <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="radio" name={`pub-status-${open}`} checked={form.status === "Published"} onChange={() => set("status", "Published")} />
          {t("admin.catalogueModals.statusPublished")}
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="radio" name={`pub-status-${open}`} checked={form.status === "Draft"} onChange={() => set("status", "Draft")} />
          {t("admin.catalogueModals.statusDraft")}
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
            {GRADES.map((g) => (
              <option key={g} value={g}>{g === "" ? "— Select grade —" : g}</option>
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
