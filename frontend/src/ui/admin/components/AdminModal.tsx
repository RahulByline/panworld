import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../utils/cn";

type AdminModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
  /** Wider than `wide` — e.g. data-heavy tables */
  extraWide?: boolean;
};

export function AdminModal({ open, onClose, title, children, footer, wide, extraWide }: AdminModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-modal-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={cn(
          "flex max-h-[min(90vh,880px)] w-full flex-col overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/[0.06]",
          extraWide && "max-w-5xl",
          wide && !extraWide && "max-w-3xl",
          !wide && !extraWide && "max-w-lg",
        )}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between px-6 py-5">
          <h2 id="admin-modal-title" className="text-[17px] font-bold text-[#1A1917]">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F5F4F0] text-[#5C5A55] transition hover:bg-[#ECEAE4]"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Divider */}
        <div className="h-px shrink-0 bg-[#F0EEE9]" />

        {/* Body */}
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">{children}</div>

        {/* Footer */}
        {footer ? (
          <>
            <div className="h-px shrink-0 bg-[#F0EEE9]" />
            <div className="shrink-0 bg-[#FAFAF8] px-6 py-4">{footer}</div>
          </>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
