import type { ReactNode } from "react";

export function PwPageHeader({
  title,
  subtitle,
  right,
  className = "",
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-start ${className}`}>
      <div className="min-w-0">
        <div className="pw-section-title">{title}</div>
        {subtitle ? <div className="pw-section-sub mt-1 max-w-3xl">{subtitle}</div> : null}
      </div>
      {right ? <div className="flex shrink-0 flex-wrap items-center gap-2">{right}</div> : null}
    </div>
  );
}
