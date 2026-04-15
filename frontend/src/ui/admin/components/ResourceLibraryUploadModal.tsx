import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AdminModal } from "./AdminModal";
import { Button } from "../../components/Button";
import { RESOURCE_UPLOAD_PUBLISHERS_SEED } from "../../../data/admin/resourceLibrary";
import type { ResourceFormatKind } from "../../../data/admin/resourceLibrary";
import { UploadCloud, ImagePlus, X } from "lucide-react";
import { inp, lbl } from "./formStyles";

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved: (msg: string) => void;
};

const FORMAT_OPTIONS: { value: ResourceFormatKind; label: string }[] = [
  { value: "pdf",    label: "PDF" },
  { value: "pptx",   label: "PowerPoint (PPTX)" },
  { value: "docx",   label: "Word (DOCX)" },
  { value: "xlsx",   label: "Excel (XLSX)" },
  { value: "audio",  label: "Audio (MP3 / WAV)" },
  { value: "video",  label: "Video (MP4 / MOV)" },
  { value: "image",  label: "Image (PNG / JPG)" },
  { value: "zip",    label: "Archive (ZIP)" },
  { value: "folder", label: "Folder (shared link)" },
  { value: "link",   label: "External Link" },
  { value: "other",  label: "Other" },
];

const ACCEPTED: Record<string, string> = {
  pdf:    ".pdf",
  pptx:   ".ppt,.pptx",
  docx:   ".doc,.docx",
  xlsx:   ".xls,.xlsx",
  audio:  ".mp3,.wav,.aac,.m4a",
  video:  ".mp4,.mov,.avi,.mkv",
  image:  ".png,.jpg,.jpeg,.webp,.gif",
  zip:    ".zip,.rar,.7z",
  other:  "*",
};

export function ResourceLibraryUploadModal({ open, onClose, onSaved }: Props) {
  const { t } = useTranslation();

  const [title, setTitle]           = useState("");
  const [publisher, setPublisher]   = useState("");
  const [formatKind, setFormatKind] = useState<ResourceFormatKind>("pdf");
  const [linkUrl, setLinkUrl]       = useState("");
  const [notes, setNotes]           = useState("");
  const [fileName, setFileName]     = useState("");
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [errors, setErrors]         = useState<Record<string, string>>({});

  const fileRef  = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  const isExternal = formatKind === "link" || formatKind === "folder";

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    setFileName(f ? f.name : "");
  }

  function handleCover(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setCoverPreview(url);
  }

  function removeCover() {
    setCoverPreview(null);
    if (coverRef.current) coverRef.current.value = "";
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!title.trim())   errs.title     = "Title is required.";
    if (!publisher)      errs.publisher = "Publisher is required.";
    if (isExternal && !linkUrl.trim()) errs.linkUrl = "URL is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function save() {
    if (!validate()) return;
    onSaved(t("admin.resourcesUploadModal.saved", { title: title.trim() }));
    closeAndReset();
  }

  function closeAndReset() {
    setTitle(""); setPublisher(""); setFormatKind("pdf");
    setLinkUrl(""); setNotes(""); setFileName("");
    setCoverPreview(null); setErrors({});
    onClose();
  }

  return (
    <AdminModal
      open={open}
      onClose={closeAndReset}
      title="Upload resource"
      wide
      footer={
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={closeAndReset}>
            {t("common.cancel")}
          </Button>
          <Button
            type="button"
            className="rounded-xl bg-[#0A1628] px-5 text-white hover:bg-[#071E36]"
            onClick={save}
          >
            Add resource
          </Button>
        </div>
      }
    >
      <div className="space-y-4">

        {/* Title */}
        <div>
          <label className={lbl}>Title *</label>
          <input
            className={inp}
            value={title}
            onChange={(e) => { setTitle(e.target.value); setErrors((p) => ({ ...p, title: "" })); }}
            placeholder="e.g. Inspire Science scope & sequence"
          />
          {errors.title ? <p className="mt-1 text-xs text-red-500">{errors.title}</p> : null}
        </div>

        {/* Publisher + Resource type */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={lbl}>Publisher *</label>
            <select
              className={inp}
              value={publisher}
              onChange={(e) => { setPublisher(e.target.value); setErrors((p) => ({ ...p, publisher: "" })); }}
            >
              <option value="">— Select publisher —</option>
              {RESOURCE_UPLOAD_PUBLISHERS_SEED.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            {errors.publisher ? <p className="mt-1 text-xs text-red-500">{errors.publisher}</p> : null}
          </div>
          <div>
            <label className={lbl}>Resource type *</label>
            <select
              className={inp}
              value={formatKind}
              onChange={(e) => { setFormatKind(e.target.value as ResourceFormatKind); setFileName(""); setLinkUrl(""); }}
            >
              {FORMAT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* File upload OR URL */}
        {isExternal ? (
          <div>
            <label className={lbl}>
              {formatKind === "folder" ? "Folder URL *" : "Link URL *"}
            </label>
            <input
              className={inp}
              type="url"
              value={linkUrl}
              onChange={(e) => { setLinkUrl(e.target.value); setErrors((p) => ({ ...p, linkUrl: "" })); }}
              placeholder={formatKind === "folder" ? "https://drive.google.com/…" : "https://…"}
            />
            {formatKind === "folder" ? (
              <p className="mt-1 text-xs text-[#9A9890]">Paste a shared Google Drive, OneDrive, or Dropbox folder link.</p>
            ) : null}
            {errors.linkUrl ? <p className="mt-1 text-xs text-red-500">{errors.linkUrl}</p> : null}
          </div>
        ) : (
          <div>
            <label className={lbl}>File</label>
            <div
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#D4D0C8] bg-[#FAFAF8] px-4 py-6 text-center transition-colors hover:border-[#0A3D62] hover:bg-[#F0F4F8]"
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files?.[0];
                if (f) setFileName(f.name);
              }}
            >
              <UploadCloud className="h-8 w-8 text-[#0A3D62]/50" strokeWidth={1.25} />
              {fileName ? (
                <p className="text-[13px] font-medium text-[#1A1917]">{fileName}</p>
              ) : (
                <>
                  <p className="text-[13px] font-medium text-[#1A1917]">
                    Drag & drop or <span className="text-[#0A3D62] underline">browse</span>
                  </p>
                  <p className="text-[11px] text-[#9A9890]">
                    PDF, PPTX, DOCX, XLSX, MP3, MP4, PNG, ZIP and more
                  </p>
                </>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              className="hidden"
              accept={ACCEPTED[formatKind] ?? "*"}
              onChange={handleFile}
            />
          </div>
        )}

        {/* Cover image upload */}
        <div>
          <label className={lbl}>Cover image <span className="font-normal text-[#9A9890]">(optional)</span></label>
          {coverPreview ? (
            <div className="relative inline-block">
              <img src={coverPreview} alt="Cover preview" className="h-32 w-48 rounded-xl object-cover ring-1 ring-[#E2E0D9]" />
              <button
                type="button"
                onClick={removeCover}
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow ring-1 ring-[#E2E0D9] hover:bg-red-50"
                aria-label="Remove cover"
              >
                <X className="h-3.5 w-3.5 text-[#5C5A55]" />
              </button>
            </div>
          ) : (
            <div
              className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-[#D4D0C8] bg-[#FAFAF8] px-4 py-4 transition-colors hover:border-[#0A3D62] hover:bg-[#F0F4F8]"
              onClick={() => coverRef.current?.click()}
            >
              <ImagePlus className="h-6 w-6 shrink-0 text-[#0A3D62]/50" strokeWidth={1.25} />
              <div>
                <p className="text-[13px] font-medium text-[#1A1917]">Upload a cover image</p>
                <p className="text-[11px] text-[#9A9890]">PNG, JPG or WEBP · Recommended 800×600</p>
              </div>
            </div>
          )}
          <input
            ref={coverRef}
            type="file"
            className="hidden"
            accept=".png,.jpg,.jpeg,.webp"
            onChange={handleCover}
          />
        </div>

        {/* Description */}
        <div>
          <label className={lbl}>Description <span className="font-normal text-[#9A9890]">(optional)</span></label>
          <textarea
            className={`${inp} min-h-[72px] resize-none`}
            placeholder="Brief description shown on the resource card (2 lines)..."
            maxLength={200}
          />
          <p className="mt-1 text-[11px] text-[#9A9890]">Max 200 characters. First 2 lines will be visible on the card.</p>
        </div>

        {/* Notes */}
        <div>
          <label className={lbl}>Notes for schools <span className="font-normal text-[#9A9890]">(optional)</span></label>
          <textarea
            className={`${inp} min-h-[90px] resize-y`}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional description or usage notes..."
          />
        </div>

      </div>
    </AdminModal>
  );
}
