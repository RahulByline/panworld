import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AdminPageHeader } from "../../admin/components/AdminPageHeader";
import { Button } from "../../components/Button";
import { ResourceLibraryCard } from "../../admin/components/ResourceLibraryCard";
import { ResourceLibraryUploadModal } from "../../admin/components/ResourceLibraryUploadModal";
import {
  resourceLibraryItems,
  uniqueResourcePublishers,
  type ResourceFormatKind,
} from "../../../data/admin/resourceLibrary";
import { useAdminToast } from "../../admin/hooks/useAdminToast";

type StatusFilter = "all" | "published" | "draft";

const inp = "rounded-lg border border-[#E2E0D9] bg-white px-3 py-2 text-sm text-[#1A1917] outline-none focus:border-[#0A3D62]";

export function AdminCmsResourcesPage() {
  const { t } = useTranslation();
  const { show, Toast } = useAdminToast();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [publisherFilter, setPublisherFilter] = useState<string>("all");
  const [formatFilter, setFormatFilter] = useState<ResourceFormatKind | "all">("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const publishers = useMemo(() => uniqueResourcePublishers(resourceLibraryItems), []);

  const filtered = useMemo(() => {
    return resourceLibraryItems.filter((row) => {
      if (publisherFilter !== "all" && row.publisher !== publisherFilter) return false;
      if (formatFilter !== "all" && row.formatKind !== formatFilter) return false;
      if (statusFilter === "published" && row.tone !== "published") return false;
      if (statusFilter === "draft" && row.tone !== "draft") return false;
      return true;
    });
  }, [publisherFilter, formatFilter, statusFilter]);

  return (
    <div className="font-sans">
      <Toast />
      <AdminPageHeader
        title={t("admin.pages.resources.title")}
        subtitle={t("admin.pages.resources.subtitle")}
        actions={
          <Button type="button" className="bg-[#0A3D62] hover:bg-[#071E36]" onClick={() => setUploadOpen(true)}>
            {t("admin.pages.resources.upload")}
          </Button>
        }
      />

      <ResourceLibraryUploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} onSaved={show} />

      <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-[#E2E0D9] bg-[#FAFAF8] p-4 sm:flex-row sm:flex-wrap sm:items-end">
        <div className="min-w-[160px] flex-1 sm:max-w-[220px]">
          <label className="mb-1 block text-xs font-medium text-[#5C5A55]">{t("admin.pages.resources.filterPublisher")}</label>
          <select className={`${inp} w-full`} value={publisherFilter} onChange={(e) => setPublisherFilter(e.target.value)}>
            <option value="all">{t("admin.pages.resources.filterAll")}</option>
            {publishers.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div className="min-w-[140px] flex-1 sm:max-w-[200px]">
          <label className="mb-1 block text-xs font-medium text-[#5C5A55]">{t("admin.pages.resources.filterType")}</label>
          <select
            className={`${inp} w-full`}
            value={formatFilter}
            onChange={(e) => setFormatFilter(e.target.value as ResourceFormatKind | "all")}
          >
            <option value="all">{t("admin.pages.resources.filterAllTypes")}</option>
            <option value="pdf">{t("admin.pages.resources.format.pdf")}</option>
            <option value="pptx">{t("admin.pages.resources.format.pptx")}</option>
            <option value="docx">{t("admin.pages.resources.format.docx")}</option>
            <option value="link">{t("admin.pages.resources.format.link")}</option>
            <option value="sheet">{t("admin.pages.resources.format.sheet")}</option>
            <option value="other">{t("admin.pages.resources.format.other")}</option>
          </select>
        </div>
        <div className="min-w-[140px] flex-1 sm:max-w-[200px]">
          <label className="mb-1 block text-xs font-medium text-[#5C5A55]">{t("admin.pages.resources.filterStatus")}</label>
          <select className={`${inp} w-full`} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}>
            <option value="all">{t("admin.pages.resources.filterAllStatuses")}</option>
            <option value="published">{t("admin.pages.resources.published")}</option>
            <option value="draft">{t("admin.pages.resources.draft")}</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#E2E0D9] bg-white px-6 py-14 text-center text-sm text-[#9A9890]">
          {t("admin.pages.resources.noResults")}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((row) => (
            <ResourceLibraryCard
              key={row.id}
              row={row}
              t={t}
              onPublish={() => show(t("admin.pages.resources.publishedToast", { title: row.title }))}
              onEdit={() => show(t("admin.pages.resources.editToast", { title: row.title }))}
              onDownload={() =>
                show(
                  row.formatKind === "link"
                    ? t("admin.pages.resources.linkOpenedToast", { title: row.title })
                    : t("admin.pages.resources.downloadToast", { title: row.title }),
                )
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
