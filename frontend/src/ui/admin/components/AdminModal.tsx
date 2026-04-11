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
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-modal-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={cn(
          "flex max-h-[min(90vh,880px)] w-full flex-col overflow-hidden rounded-2xl border border-[#E2E0D9] bg-white shadow-xl",
          extraWide && "max-w-5xl",
          wide && !extraWide && "max-w-3xl",
          !wide && !extraWide && "max-w-lg",
        )}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[#E2E0D9] px-5 py-4">
          <h2 id="admin-modal-title" className="text-[15px] font-semibold text-[#0A3D62]">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-[#5C5A55] hover:bg-[#F5F4F0]"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer ? <div className="shrink-0 border-t border-[#E2E0D9] px-5 py-3">{footer}</div> : null}
      </div>
    </div>,
    document.body,
  );
}
