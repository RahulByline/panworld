import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import type { CatalogueLineItem } from "../../../../data/admin/catalogue";
import { getEbookPreviewUrl } from "../../../../data/admin/catalogue";

type Props = {
  open: boolean;
  onClose: () => void;
  lineItem: CatalogueLineItem | null;
  /** Parent folder / series name (shown in header subtitle). */
  folderName?: string;
};

export function CatalogueEbookPreviewModal({ open, onClose, lineItem, folderName }: Props) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open || !lineItem) return null;

  const src = getEbookPreviewUrl(lineItem);

  return createPortal(
    <div
      className="fixed inset-0 z-[220] flex items-center justify-center bg-black/50 p-3 sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ebook-preview-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="flex max-h-[min(92vh,900px)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-[var(--pw-border,#e2e8f0)] bg-white shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-[var(--pw-border,#e2e8f0)] px-4 py-3 sm:px-5 sm:py-4">
          <div className="min-w-0">
            <h2 id="ebook-preview-title" className="text-[15px] font-semibold leading-snug text-[var(--pw-text,#0f172a)]">
              {t("common.ebookPreview")}
            </h2>
            <p className="mt-0.5 line-clamp-2 text-[13px] font-medium text-[var(--pw-text-secondary,#475569)]">{lineItem.title}</p>
            {folderName ? (
              <p className="mt-0.5 text-[12px] text-[var(--pw-text-muted,#64748b)]">{folderName}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[var(--pw-text-secondary,#475569)] transition hover:bg-[var(--pw-muted,#f8fafc)]"
            aria-label={t("common.close")}
          >
            ✕
          </button>
        </div>

        <div className="min-h-0 flex-1 bg-[#f1f5f9] px-3 pb-3 pt-2 sm:px-4 sm:pb-4">
          <iframe
            title={lineItem.title}
            src={src}
            className="h-[min(78vh,720px)] w-full rounded-xl border border-[var(--pw-border,#e2e8f0)] bg-white shadow-inner"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-downloads allow-popups-to-escape-sandbox"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <p className="mt-2 text-center text-[11px] leading-snug text-[var(--pw-text-muted,#64748b)]">{t("common.ebookPreviewHint")}</p>
        </div>
      </div>
    </div>,
    document.body,
  );
}
