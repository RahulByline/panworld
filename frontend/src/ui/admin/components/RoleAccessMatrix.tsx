import type { TFunction } from "i18next";
import { Check, Minus } from "lucide-react";
import {
  ACCESS_MATRIX_COLUMNS,
  accessMatrixRows,
  type AccessMatrixCell,
  type AccessMatrixRoleColumn,
} from "../../../data/admin/accessControlMatrix";
import { cn } from "../../utils/cn";

function Cell({ v, t }: { v: AccessMatrixCell; t: TFunction }) {
  if (v === "yes") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#1E8449]">
        <Check className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden />
        {t("admin.accessMatrix.val.yes")}
      </span>
    );
  }
  if (v === "request") {
    return <span className="text-[13px] font-medium text-[#B7791F]">{t("admin.accessMatrix.val.request")}</span>;
  }
  return (
    <span className="inline-flex items-center gap-1 text-[13px] text-[#B0ADA5]" title={t("admin.accessMatrix.val.no")}>
      <Minus className="h-4 w-4" strokeWidth={2} aria-hidden />
      {t("admin.accessMatrix.val.dash")}
    </span>
  );
}

function colClass(col: AccessMatrixRoleColumn) {
  if (col === "sales") return "bg-[#F7F9FC]";
  if (col === "schoolAdmin") return "bg-[#FAFAF8]";
  return "";
}

export function RoleAccessMatrix({ t }: { t: TFunction }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#E2E0D9] bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[880px] border-collapse text-left text-[13px]">
          <thead className="border-b border-[#E2E0D9] bg-[#F5F4F0] text-[11px] font-semibold uppercase tracking-wide text-[#5C5A55]">
            <tr>
              <th className="min-w-[220px] px-4 py-3">{t("admin.accessMatrix.colCapability")}</th>
              {ACCESS_MATRIX_COLUMNS.map((col) => (
                <th key={col} className={cn("px-4 py-3", colClass(col))}>
                  {t(`admin.accessMatrix.col.${col}`)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ECEAE4]">
            {accessMatrixRows.map((row) => (
              <tr key={row.id} className="hover:bg-[#FAFAF8]/80">
                <td className="px-4 py-3 align-top">
                  <div className="font-medium text-[#1A1917]">{t(row.labelKey)}</div>
                  {row.hintKey ? <div className="mt-1 text-[11px] leading-snug text-[#9A9890]">{t(row.hintKey)}</div> : null}
                </td>
                {ACCESS_MATRIX_COLUMNS.map((col) => (
                  <td key={col} className={cn("px-4 py-3 align-top", colClass(col))}>
                    <Cell v={row[col]} t={t} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="border-t border-[#ECEAE4] px-4 py-3 text-[12px] leading-relaxed text-[#5C5A55]">{t("admin.accessMatrix.footnote")}</p>
    </div>
  );
}
