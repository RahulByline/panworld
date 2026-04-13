import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { catalogueByTab, type CatalogueProductRow, type CatalogueTab } from "../../../data/admin/catalogue";
import { CatalogueProductCard } from "../../admin/components/catalogue/CatalogueProductCard";
import { useAdminToast } from "../../admin/hooks/useAdminToast";
import { PwPageHeader } from "../../panworld/PwPageHeader";

const WISHLIST_CARD_COUNT = 20;

function publishedFolderPool(): { tab: CatalogueTab; product: CatalogueProductRow }[] {
  const out: { tab: CatalogueTab; product: CatalogueProductRow }[] = [];
  (["textbooks", "library", "kits"] as const).forEach((tab) => {
    catalogueByTab[tab].forEach((p) => {
      if (p.status === "Published") out.push({ tab, product: p });
    });
  });
  return out;
}

function folderHref(tab: CatalogueTab, id: string): string {
  const q = `?folder=${encodeURIComponent(id)}`;
  if (tab === "textbooks") return `/app/catalogue${q}`;
  if (tab === "library") return `/app/library${q}`;
  return `/app/kits${q}`;
}

export function WishlistPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { show, Toast } = useAdminToast();
  const [removed, setRemoved] = useState<Set<string>>(() => new Set());

  const pool = useMemo(() => publishedFolderPool(), []);
  const rows = useMemo(() => {
    if (pool.length === 0) return [];
    return Array.from({ length: WISHLIST_CARD_COUNT }, (_, i) => {
      const { tab, product } = pool[i % pool.length]!;
      return { key: `${product.id}__w${i}`, tab, product };
    });
  }, [pool]);

  const visible = rows.filter((r) => !removed.has(r.key));

  return (
    <div className="font-sans">
      <Toast />
      <PwPageHeader
        title={t("nav.wishlist")}
        subtitle={t("mvpPages.wishlist.subtitle")}
        right={
          <>
            <button type="button" className="pw-btn pw-btn-outline">
              {t("mvpPages.wishlist.shareProcurement")}
            </button>
            <Link to="/app/rfq" className="pw-btn pw-btn-accent no-underline">
              {t("mvpPages.wishlist.convertAll")}
            </Link>
          </>
        }
      />

      <div className="mb-5 flex flex-col gap-3 rounded-[10px] border border-[#F0C080] bg-[#FDEBD0] px-4 py-3.5 md:flex-row md:items-center">
        <span className="text-lg">⏰</span>
        <div className="min-w-0 flex-1 text-[13.5px]">
          <span className="font-medium text-[#7D4E10]">{t("mvpPages.wishlist.nudge")}</span>{" "}
          <span className="text-[#8B5A1A]">{t("mvpPages.wishlist.nudge2")}</span>
        </div>
        <button type="button" className="pw-btn pw-btn-outline pw-btn-xs shrink-0 border-[#F0C080]">
          {t("mvpPages.wishlist.dismiss")}
        </button>
      </div>

      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#7A776F]">
          {t("app.schoolDashboard.wishlistBadge", { count: visible.length })}
        </span>
      </div>

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#E2E0D9] bg-[#FAFAF8] py-16 text-center text-sm text-[#5C5A55]">
          {t("mvpPages.wishlist.empty")}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
          {visible.map((r) => (
            <CatalogueProductCard
              key={r.key}
              tab={r.tab}
              mode="wishlist"
              product={r.product}
              t={t}
              onOpenFolder={() => navigate(folderHref(r.tab, r.product.id))}
              onEdit={() => undefined}
              onArchive={() => undefined}
              onPublish={() => undefined}
              onAddToRfq={() => navigate("/app/rfq")}
              onRemoveFromWishlist={() => {
                setRemoved((prev) => new Set(prev).add(r.key));
                show(t("mvpPages.wishlist.removedToast"));
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
