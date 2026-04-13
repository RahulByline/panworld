import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, BookOpen, KeyRound, Lock, ShieldAlert } from "lucide-react";
import type { TFunction } from "i18next";
import type { CatalogueProductRow, CatalogueTab } from "../../../../data/admin/catalogue";
import {
  DEMO_CMS_FOLDER_PASSWORD,
  defaultLineItemCoverUrl,
  kitMetaLineParts,
  libraryMetaLineParts,
  textbookMetaLineParts,
} from "../../../../data/admin/catalogue";
import { Button } from "../../../components/Button";
import { cn } from "../../../utils/cn";
import { getCatalogueCardIcon } from "./catalogueCardIcons";
import { HEADER_BG } from "./catalogueFolderHeader";

type Props = {
  tab: CatalogueTab;
  product: CatalogueProductRow;
  t: TFunction;
  mode?: "admin" | "school";
  onBack: () => void;
  onAddBook: () => void;
  onEditFolder: () => void;
  onViewItem: (itemId: string) => void;
  onAddToWishlist?: (itemId: string) => void;
  onAddToRfq?: (itemId: string) => void;
};

function folderMetaParts(tab: CatalogueTab, p: CatalogueProductRow) {
  if (tab === "textbooks") return textbookMetaLineParts(p);
  if (tab === "library") return libraryMetaLineParts(p);
  return kitMetaLineParts(p);
}

function FolderPasswordGate({
  t,
  folderName,
  onUnlocked,
}: {
  t: TFunction;
  folderName: string;
  onUnlocked: () => void;
}) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (value.trim() === DEMO_CMS_FOLDER_PASSWORD) {
      onUnlocked();
      setError(false);
    } else {
      setError(true);
    }
  }

  return (
    <div
      className="w-full max-w-md rounded-2xl border border-[#E2E0D9] bg-white p-8 shadow-xl"
      role="dialog"
      aria-modal="true"
      aria-labelledby="folder-password-gate-title"
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#0A3D62]/10">
          <Lock className="h-7 w-7 text-[#0A3D62]" aria-hidden />
        </div>
        <h2 id="folder-password-gate-title" className="text-lg font-bold text-[#1A1917]">
          {t("admin.pages.catalogueFolder.passwordGateTitle")}
        </h2>
        <p className="mt-1 text-[13px] font-semibold text-[#0A3D62]">{folderName}</p>
        <p className="mt-2 text-[13px] leading-relaxed text-[#5C5A55]">{t("admin.pages.catalogueFolder.passwordGateBody")}</p>
      </div>
      <form onSubmit={submit} className="mt-6 space-y-3">
        <input
          type="password"
          inputMode="numeric"
          autoComplete="off"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(false);
          }}
          placeholder={t("admin.pages.catalogueFolder.passwordGatePlaceholder")}
          className="w-full rounded-lg border border-[#E2E0D9] px-3 py-2.5 text-center font-mono text-lg tracking-widest outline-none focus:border-[#0A3D62]"
          maxLength={12}
          aria-invalid={error}
        />
        {error ? <p className="text-center text-sm text-red-600">{t("admin.pages.catalogueFolder.passwordGateError")}</p> : null}
        <Button type="submit" className="w-full bg-[#0A1628] text-white hover:bg-[#071E36]">
          {t("admin.pages.catalogueFolder.passwordGateSubmit")}
        </Button>
        <p className="text-center text-[11px] text-[#9A9890]">{t("admin.pages.catalogueFolder.passwordGateHint")}</p>
      </form>
    </div>
  );
}

function statusClass(s: CatalogueProductRow["lineItems"][0]["status"]): string {
  if (s === "Published") return "bg-emerald-100 text-emerald-900";
  if (s === "Draft") return "bg-amber-100 text-amber-950";
  return "bg-stone-200 text-stone-700";
}

function LineItemCover({ itemId, src, title }: { itemId: string; src?: string; title: string }) {
  const [broken, setBroken] = useState(false);
  const url = src ?? defaultLineItemCoverUrl(itemId);
  if (broken) {
    return (
      <div className="flex h-full min-h-0 w-full flex-col items-center justify-center gap-2 bg-[#ECEAE4] px-2 text-center text-[#9A9890]">
        <BookOpen className="h-9 w-9 shrink-0 opacity-55" strokeWidth={1.25} aria-hidden />
        <span className="line-clamp-3 text-[10px] font-medium leading-snug text-[#5C5A55]">{title}</span>
      </div>
    );
  }
  return (
    <img
      src={url}
      alt=""
      className="h-full w-full object-cover"
      loading="lazy"
      onError={() => setBroken(true)}
    />
  );
}

export function CatalogueFolderDetailView({
  tab,
  product: p,
  t,
  mode = "admin",
  onBack,
  onAddBook,
  onEditFolder,
  onViewItem,
  onAddToWishlist,
  onAddToRfq,
}: Props) {
  const CardIcon = getCatalogueCardIcon(p.cardIcon);
  const headerBg = HEADER_BG[p.headerKey] ?? HEADER_BG.default;
  const needsPasswordGate = p.folderAccess?.passwordProtected === true;
  const [gateUnlocked, setGateUnlocked] = useState(false);
  const canViewFolder = !needsPasswordGate || gateUnlocked;
  const metaParts = folderMetaParts(tab, p);

  useEffect(() => {
    setGateUnlocked(false);
  }, [p.id]);

  const showPasswordModal = needsPasswordGate && !gateUnlocked;

  useEffect(() => {
    if (!showPasswordModal) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showPasswordModal]);

  return (
    <div className="relative font-sans">
      <div className="relative z-[110]">
        <button
          type="button"
          onClick={onBack}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#0A3D62] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {t("admin.pages.catalogueFolder.back")}
        </button>
      </div>

      {showPasswordModal ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/35 backdrop-blur-md" aria-hidden />
          <div className="relative z-10 flex w-full max-w-md flex-col">
            <FolderPasswordGate t={t} folderName={p.name} onUnlocked={() => setGateUnlocked(true)} />
          </div>
        </div>
      ) : null}

      {canViewFolder ? (
        <>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 flex-1 gap-4">
          <div
            className={cn(
              "flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl ring-1 ring-[#0A3D62]/10",
              headerBg,
            )}
          >
            <CardIcon className="h-9 w-9 text-[#0A3D62]" strokeWidth={1.35} />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-[#0A3D62]">{p.name}</h1>
            <p className="mt-1 text-[13px] leading-relaxed">
              <span className="font-semibold text-[#0A3D62]">{metaParts.publisher}</span>
              <span className="text-[#94a3a0]"> · </span>
              <span className="text-[#5C5A55]">{metaParts.rest}</span>
            </p>
            <p className="mt-1 text-[12px] text-[#9A9890]">{p.folderDetailSummary}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {p.badges.map((b) => (
                <span
                  key={b}
                  className="rounded-md bg-[#0A3D62]/[0.08] px-2 py-0.5 text-[10px] font-bold uppercase text-[#062a47]"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
        {mode === "school" ? (
          <div className="flex shrink-0 flex-wrap gap-2">
            <Button type="button" variant="secondary" size="sm" className="border-[#DDD9D2]" onClick={() => onAddToWishlist?.(p.id)}>
              {t("mvpPages.catalogue.addWishlist")}
            </Button>
            <Button type="button" size="sm" className="bg-[#0A1628] text-white hover:bg-[#071E36]" onClick={() => onAddToRfq?.(p.id)}>
              {t("mvpPages.catalogue.addRfq")}
            </Button>
          </div>
        ) : (
          <div className="flex shrink-0 flex-wrap gap-2">
            <Button type="button" variant="secondary" size="sm" className="border-[#DDD9D2]" onClick={onEditFolder}>
              {t("admin.pages.catalogueFolder.editFolder")}
            </Button>
            <Button type="button" size="sm" className="bg-[#0A1628] text-white hover:bg-[#071E36]" onClick={onAddBook}>
              {t("admin.pages.catalogueFolder.addBook")}
            </Button>
          </div>
        )}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-[#E2E0D9] bg-[#FAFAF8] p-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#5C5A55]">
            <Lock className="h-4 w-4 text-[#0A3D62]" aria-hidden />
            {t("admin.pages.catalogueFolder.accessTitle")}
          </div>
          <p className="mt-2 text-[13px] text-[#5C5A55]">{t("admin.pages.catalogueFolder.accessBody")}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold",
                p.folderAccess?.passwordProtected ? "bg-amber-100 text-amber-950" : "bg-emerald-50 text-emerald-900",
              )}
            >
              <KeyRound className="h-3.5 w-3.5" aria-hidden />
              {p.folderAccess?.passwordProtected
                ? t("admin.pages.catalogueFolder.passwordProtectedOn")
                : t("admin.pages.catalogueFolder.passwordProtectedOff")}
            </span>
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold",
                p.folderAccess?.schoolAccessExpired ? "bg-red-100 text-red-900" : "bg-emerald-50 text-emerald-900",
              )}
            >
              <ShieldAlert className="h-3.5 w-3.5" aria-hidden />
              {p.folderAccess?.schoolAccessExpired
                ? t("admin.pages.catalogueFolder.schoolAccessExpired")
                : t("admin.pages.catalogueFolder.schoolAccessActive")}
            </span>
          </div>
          <p className="mt-2 text-[11px] text-[#9A9890]">{t("admin.pages.catalogueFolder.accessFootnote")}</p>
        </div>
        <div className="rounded-xl border border-dashed border-[#C4BFB5] bg-white p-4">
          <div className="text-xs font-bold uppercase tracking-wide text-[#5C5A55]">{t("admin.pages.catalogueFolder.pricingModel")}</div>
          <p className="mt-2 text-[13px] leading-relaxed text-[#5C5A55]">{t("admin.pages.catalogueFolder.pricingModelBody")}</p>
          <div className="mt-2 text-sm font-semibold text-[#1A1917]">{p.folderPriceLabel}</div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#E2E0D9] bg-[#FAFAF8]">
        <div className="border-b border-[#E2E0D9] bg-[#F5F4F0] px-4 py-3">
          <h2 className="text-sm font-bold text-[#1A1917]">
            {t("admin.pages.catalogueFolder.itemsTitleCards", { count: p.lineItems.length })}
          </h2>
          <p className="mt-0.5 text-[11px] text-[#5C5A55]">{t("admin.pages.catalogueFolder.itemsCardsHint")}</p>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {p.lineItems.map((row) => (
              <article
                key={row.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-[#E2E0D9] bg-white shadow-sm"
              >
                <div className="relative aspect-[3/4] w-full shrink-0 overflow-hidden bg-[#F5F4F0]">
                  <LineItemCover itemId={row.id} src={row.coverImageUrl} title={row.title} />
                </div>
                <div className="flex flex-1 flex-col p-3">
                  <div className="text-[10px] font-bold uppercase tracking-wide text-[#0A3D62]">{row.gradeLabel}</div>
                  <h3 className="mt-1 line-clamp-3 min-h-[3.25rem] text-[13px] font-bold leading-snug text-[#1A1917]">
                    {row.title}
                  </h3>
                  <div className="mt-2 font-mono text-[11px] leading-tight text-[#5C5A55]">{row.isbn ?? "—"}</div>
                  <div className="mt-1.5 text-[13px] font-semibold text-[#1A1917]">
                    {row.price}
                    {row.priceUnit ? <span className="font-medium text-[#5C5A55]"> {row.priceUnit}</span> : null}
                  </div>
                  {mode === "admin" ? (
                    <div className="mt-2">
                      <span className={cn("rounded-md px-2 py-0.5 text-[10px] font-bold uppercase", statusClass(row.status))}>
                        {row.status}
                      </span>
                    </div>
                  ) : null}
                  <div className="mt-3 border-t border-[#ECEAE4] pt-3">
                    <div className="grid grid-cols-1 gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="w-full"
                        onClick={() => onViewItem(row.id)}
                      >
                        {t("common.view")}
                      </Button>
                      {mode === "school" ? (
                        <>
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            className="w-full"
                            onClick={() => onAddToWishlist?.(row.id)}
                          >
                            {t("mvpPages.catalogue.addWishlist")}
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            className="w-full bg-[#0A1628] text-white hover:bg-[#071E36]"
                            onClick={() => onAddToRfq?.(row.id)}
                          >
                            {t("mvpPages.catalogue.addRfq")}
                          </Button>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-[11px] text-[#9A9890]">{t("admin.pages.catalogueFolder.demoHint")}</p>
        </>
      ) : null}
    </div>
  );
}
