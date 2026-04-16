import type { TFunction } from "i18next";
import { Check } from "lucide-react";
import type { CatalogueProductRow, CatalogueTab } from "../../../../data/admin/catalogue";

const CHIP_TONE: Record<string, string> = {
  textbook: "bg-emerald-500 text-white",
  digital: "bg-sky-100 text-sky-800",
  kit: "bg-amber-100 text-amber-800",
  library: "bg-violet-100 text-violet-900",
};

function getTypeLabel(tab: CatalogueTab, t: TFunction): string {
  if (tab === "textbooks") return t("admin.schools.assignProducts.chipTextbook");
  if (tab === "library") return t("admin.schools.assignProducts.chipLibrary");
  return t("admin.schools.assignProducts.chipKit");
}

type Props = {
  tab: CatalogueTab;
  product: CatalogueProductRow;
  t: TFunction;
  selected?: boolean;
  onSelect?: () => void;
};

export function SimpleProductCard({
  tab,
  product: p,
  t,
  selected = false,
  onSelect,
}: Props) {
  const typeLabel = getTypeLabel(tab, t);
  const typeKey = tab === "textbooks" ? "textbook" : tab === "library" ? "library" : "kit";
  const isKits = tab === "kits";

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative overflow-hidden flex flex-col items-start gap-3 rounded-[28px] border p-5 text-left transition-all ${
        selected
          ? isKits
            ? "border-[#2f63c7] bg-gradient-to-br from-[#f7f2e8] via-[#eef2fb] to-[#f7f2e8] shadow-[0_22px_60px_rgba(28,46,102,0.14)]"
            : "border-red-500 bg-red-50 shadow-md"
          : isKits
            ? "border-[#e3e0d7] bg-gradient-to-br from-[#f7f2e8] to-[#eef2fb] hover:border-[#2f63c7] shadow-[0_22px_60px_rgba(28,46,102,0.14)]"
            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      {isKits && (
        <>
          <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-[#324a97] to-transparent opacity-20 rounded-br-full"></div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#3550ab] to-transparent opacity-20 rounded-bl-full"></div>
          <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-[#2b3f8f] to-transparent opacity-20 rounded-tl-full"></div>
        </>
      )}
      <div className="flex items-start gap-3 relative z-10 w-full">
        <div className="mt-0.5">
          {selected ? (
            <div className={`flex h-7 w-7 items-center justify-center rounded-full text-white shadow-md ${isKits ? "bg-gradient-to-br from-[#2f63c7] to-[#214f9f]" : "bg-red-500"}`}>
              <Check className="h-4 w-4" />
            </div>
          ) : (
            <div className={`flex h-7 w-7 items-center justify-center rounded-full border-2 ${isKits ? "border-[#2f63c7]" : "border-slate-300"}`} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className={`text-sm font-extrabold uppercase tracking-tight ${isKits ? "text-[#23398e]" : "text-slate-800"}`}>{p.name}</div>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider ${CHIP_TONE[typeKey]}`}>
              {typeLabel}
            </span>
            <span className={`text-xs font-semibold ${isKits ? "text-[#53618e]" : "text-slate-600"}`}>{p.publisher}</span>
            <span className={`text-xs font-semibold ${isKits ? "text-[#53618e]" : "text-slate-600"}`}>{p.format}</span>
          </div>
        </div>
      </div>
      {isKits && (
        <div className="relative z-10 w-full">
          <div className="h-[4px] w-[60px] rounded-full bg-[#334ba0]"></div>
        </div>
      )}
    </button>
  );
}
