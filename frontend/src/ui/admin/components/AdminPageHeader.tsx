import type { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
};

export function AdminPageHeader({ title, subtitle, actions }: Props) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 className="font-['DM_Serif_Display',serif] text-[22px] text-[#1A1917]">{title}</h2>
        {subtitle ? <p className="mt-1 text-[13px] text-[#5C5A55]">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
