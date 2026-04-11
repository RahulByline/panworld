import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AdminModal } from "./AdminModal";
import { Button } from "../../components/Button";
import { RESOURCE_FORMAT_KINDS, RESOURCE_UPLOAD_PUBLISHERS_SEED } from "../../../data/admin/resourceLibrary";
import type { ResourceFormatKind } from "../../../data/admin/resourceLibrary";

const inp = "w-full rounded-lg border border-[#E2E0D9] bg-white px-3 py-2 text-sm text-[#1A1917] outline-none focus:border-[#0A3D62]";
const lbl = "mb-1 block text-xs font-medium text-[#5C5A55]";

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved: (msg: string) => void;
};

export function ResourceLibraryUploadModal({ open, onClose, onSaved }: Props) {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [publisher, setPublisher] = useState("");
  const [formatKind, setFormatKind] = useState<ResourceFormatKind>("pdf");
  const [linkUrl, setLinkUrl] = useState("");
  const [notes, setNotes] = useState("");

  function closeAndReset() {
    setTitle("");
    setPublisher("");
    setFormatKind("pdf");
    setLinkUrl("");
    setNotes("");
    onClose();
  }

  function save() {
    if (!title.trim() || !publisher) {
      onSaved(t("admin.resourcesUploadModal.validation"));
      return;
    }
    if (formatKind === "link" && !linkUrl.trim()) {
      onSaved(t("admin.resourcesUploadModal.urlRequired"));
      return;
    }
    onSaved(t("admin.resourcesUploadModal.saved", { title: title.trim() }));
    closeAndReset();
  }

  const showFile = formatKind !== "link";

  return (
    <AdminModal
      open={open}
      onClose={closeAndReset}
      title={t("admin.resourcesUploadModal.title")}
      wide
      footer={
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={closeAndReset}>
            {t("common.cancel")}
          </Button>
          <Button type="button" className="bg-[#0A3D62] text-white hover:bg-[#071E36]" onClick={save}>
            {t("admin.resourcesUploadModal.submit")}
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={lbl}>{t("admin.resourcesUploadModal.resourceTitle")} *</label>
          <input className={inp} value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t("admin.resourcesUploadModal.titlePh")} />
        </div>
        <div>
          <label className={lbl}>{t("admin.resourcesUploadModal.publisher")} *</label>
          <select className={inp} value={publisher} onChange={(e) => setPublisher(e.target.value)}>
            <option value="">{t("admin.resourcesUploadModal.selectPublisher")}</option>
            {RESOURCE_UPLOAD_PUBLISHERS_SEED.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={lbl}>{t("admin.resourcesUploadModal.resourceType")} *</label>
          <select className={inp} value={formatKind} onChange={(e) => setFormatKind(e.target.value as ResourceFormatKind)}>
            {RESOURCE_FORMAT_KINDS.map((k) => (
              <option key={k} value={k}>
                {t(`admin.pages.resources.format.${k}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {showFile ? (
        <div className="mt-3">
          <label className={lbl}>{t("admin.resourcesUploadModal.file")}</label>
          <input className={`${inp} py-2 file:me-3 file:rounded-md file:border-0 file:bg-[#E8F0F7] file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-[#0A3D62]`} type="file" />
          <p className="mt-1 text-xs text-[#9A9890]">{t("admin.resourcesUploadModal.fileHint")}</p>
        </div>
      ) : (
        <div className="mt-3">
          <label className={lbl}>{t("admin.resourcesUploadModal.url")} *</label>
          <input className={inp} type="url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://…" />
        </div>
      )}

      <div className="mt-3">
        <label className={lbl}>{t("admin.resourcesUploadModal.notes")}</label>
        <textarea className={`${inp} min-h-[80px]`} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t("admin.resourcesUploadModal.notesPh")} />
      </div>
    </AdminModal>
  );
}
