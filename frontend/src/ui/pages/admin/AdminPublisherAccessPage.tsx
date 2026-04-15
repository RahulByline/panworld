import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AdminPageHeader } from "../../admin/components/AdminPageHeader";
import { Button } from "../../components/Button";
import {
  PublisherAssignSchoolModal,
  PublisherCredentialAddModal,
  PublisherCredentialEditModal,
} from "../../admin/components/PublisherCredentialModals";
import { PublisherAccessCard } from "../../admin/components/PublisherAccessCard";
import { PublisherAccessDetailModal } from "../../admin/components/PublisherAccessDetailModal";
import {
  publisherAccessHaystack,
  publisherAccessRows,
  type PublisherAccessRow,
} from "../../../data/admin/publisherAccess";
import { useAdminToast } from "../../admin/hooks/useAdminToast";
import { cn } from "../../utils/cn";

type ToneFilter = "all" | PublisherAccessRow["lastTone"];
type LoginFilter = "all" | PublisherAccessRow["type"];
type ActionFilter = "all" | PublisherAccessRow["action"];
type DeliveryFilter = "all" | "instant" | "delayed";
type BrandFilter = "all" | "ours";

function rowMatchesFilters(
  row: PublisherAccessRow,
  q: string,
  tone: ToneFilter,
  login: LoginFilter,
  action: ActionFilter,
  delivery: DeliveryFilter,
  brand: BrandFilter,
): boolean {
  const needle = q.trim().toLowerCase();
  if (needle && !publisherAccessHaystack(row).includes(needle)) return false;
  if (tone !== "all" && row.lastTone !== tone) return false;
  if (login !== "all" && row.type !== login) return false;
  if (action !== "all" && row.action !== action) return false;
  if (delivery === "instant" && row.type !== "Static") return false;
  if (delivery === "delayed" && row.type !== "School-specific") return false;
  if (brand === "ours" && !row.ourBrand) return false;
  return true;
}

export function AdminPublisherAccessPage() {
  const { t } = useTranslation();
  const { show, Toast } = useAdminToast();
  const [addOpen, setAddOpen] = useState(false);
  const [editRow, setEditRow] = useState<PublisherAccessRow | null>(null);
  const [assignRow, setAssignRow] = useState<PublisherAccessRow | null>(null);
  const [detailRow, setDetailRow] = useState<PublisherAccessRow | null>(null);

  const [q, setQ] = useState("");
  const [tone, setTone] = useState<ToneFilter>("all");
  const [login, setLogin] = useState<LoginFilter>("all");
  const [action, setAction] = useState<ActionFilter>("all");
  const [delivery, setDelivery] = useState<DeliveryFilter>("all");
  const [brand, setBrand] = useState<BrandFilter>("all");
  const [credentialEnabledById, setCredentialEnabledById] = useState<Record<string, boolean>>({});

  const rowsWithCredentialState = useMemo(
    () =>
      publisherAccessRows.map((r) => ({
        ...r,
        credentialEnabled:
          credentialEnabledById[r.id] !== undefined
            ? credentialEnabledById[r.id]!
            : (r.credentialEnabled ?? true),
      })),
    [credentialEnabledById],
  );

  const filtered = useMemo(
    () =>
      rowsWithCredentialState.filter((row) => rowMatchesFilters(row, q, tone, login, action, delivery, brand)),
    [rowsWithCredentialState, q, tone, login, action, delivery, brand],
  );

  const selCls =
    "min-w-0 flex-1 rounded-lg border border-[var(--pw-border)] bg-[var(--pw-muted)]/80 px-3 py-2 text-[13px] text-[var(--pw-text)] shadow-sm outline-none transition hover:border-[var(--pw-text-muted)] focus:border-[var(--pw-brand)] focus:ring-2 focus:ring-[var(--pw-brand)]/15 sm:min-w-[150px]";

  return (
    <div className="font-sans">
      <Toast />
      <AdminPageHeader
        title={t("admin.pages.publisherAccess.title")}
        subtitle={t("admin.pages.publisherAccess.subtitle")}
        actions={
          <Button
            type="button"
            className="bg-[var(--pw-brand)] hover:bg-[var(--pw-brand-deep)]"
            onClick={() => setAddOpen(true)}
          >
            {t("admin.pages.publisherAccess.add")}
          </Button>
        }
      />

      <div className="mb-5 flex flex-col gap-3 rounded-xl border border-[var(--pw-border)] bg-white p-3 shadow-sm sm:p-4">
        <div className="relative min-h-10 w-full">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--pw-text-muted)]"
            strokeWidth={2}
            aria-hidden
          />
          <input
            type="search"
            className="h-10 w-full rounded-lg border border-[var(--pw-border)] bg-[var(--pw-muted)]/60 py-2 pl-10 pr-3 text-sm text-[var(--pw-text)] outline-none transition placeholder:text-[var(--pw-text-muted)] focus:border-[var(--pw-brand)] focus:bg-white focus:ring-2 focus:ring-[var(--pw-brand)]/12"
            placeholder={t("admin.pages.publisherAccess.searchPlaceholder")}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label={t("admin.pages.publisherAccess.searchPlaceholder")}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            className={selCls}
            value={tone}
            onChange={(e) => setTone(e.target.value as ToneFilter)}
            aria-label={t("admin.pages.publisherAccess.filterStatus")}
          >
            <option value="all">{t("admin.pages.publisherAccess.filterStatus")}: {t("admin.pages.publisherAccess.filterAll")}</option>
            <option value="ok">{t("admin.pages.publisherAccess.filterStatusOk")}</option>
            <option value="warn">{t("admin.pages.publisherAccess.filterStatusWarn")}</option>
            <option value="expired">{t("admin.pages.publisherAccess.filterStatusExpired")}</option>
          </select>
          <select
            className={selCls}
            value={login}
            onChange={(e) => setLogin(e.target.value as LoginFilter)}
            aria-label={t("admin.pages.publisherAccess.filterLogin")}
          >
            <option value="all">{t("admin.pages.publisherAccess.filterLogin")}: {t("admin.pages.publisherAccess.filterAll")}</option>
            <option value="Static">{t("admin.pages.publisherAccess.filterLoginStatic")}</option>
            <option value="School-specific">{t("admin.pages.publisherAccess.filterLoginSchool")}</option>
          </select>
          <select
            className={selCls}
            value={action}
            onChange={(e) => setAction(e.target.value as ActionFilter)}
            aria-label={t("admin.pages.publisherAccess.filterAction")}
          >
            <option value="all">{t("admin.pages.publisherAccess.filterAction")}: {t("admin.pages.publisherAccess.filterAll")}</option>
            <option value="test">{t("admin.pages.publisherAccess.filterActionVerify")}</option>
            <option value="pending">{t("admin.pages.publisherAccess.filterActionQueue")}</option>
            <option value="renew">{t("admin.pages.publisherAccess.filterActionRenew")}</option>
          </select>
          <select
            className={selCls}
            value={delivery}
            onChange={(e) => setDelivery(e.target.value as DeliveryFilter)}
            aria-label={t("admin.pages.publisherAccess.filterDelivery")}
          >
            <option value="all">{t("admin.pages.publisherAccess.filterDelivery")}: {t("admin.pages.publisherAccess.filterAll")}</option>
            <option value="instant">{t("admin.pages.publisherAccess.filterDeliveryInstant")}</option>
            <option value="delayed">{t("admin.pages.publisherAccess.filterDeliveryDelayed")}</option>
          </select>
          <select
            className={selCls}
            value={brand}
            onChange={(e) => setBrand(e.target.value as BrandFilter)}
            aria-label={t("admin.pages.publisherAccess.filterBrand")}
          >
            <option value="all">{t("admin.pages.publisherAccess.filterBrand")}: {t("admin.pages.publisherAccess.filterAll")}</option>
            <option value="ours">{t("admin.pages.publisherAccess.filterBrandOurs")}</option>
          </select>
        </div>
        <p className="text-[12px] text-[var(--pw-text-secondary)]">
          {t("admin.pages.publisherAccess.resultsCount", { shown: filtered.length, total: publisherAccessRows.length })}
        </p>
      </div>

      <PublisherCredentialAddModal open={addOpen} onClose={() => setAddOpen(false)} onSaved={show} />
      <PublisherCredentialEditModal open={!!editRow} onClose={() => setEditRow(null)} onSaved={show} row={editRow} />
      <PublisherAssignSchoolModal
        open={!!assignRow}
        onClose={() => setAssignRow(null)}
        credentialId={assignRow?.id ?? ""}
        productTitle={assignRow?.title ?? ""}
        onAssigned={show}
      />
      <PublisherAccessDetailModal
        open={!!detailRow}
        onClose={() => setDetailRow(null)}
        row={detailRow}
        t={t}
      />

      {filtered.length === 0 ? (
        <div
          className={cn(
            "rounded-2xl border border-dashed border-[var(--pw-border)] bg-[var(--pw-muted)]/40 py-16 text-center text-sm text-[var(--pw-text-secondary)]",
          )}
        >
          {t("admin.pages.publisherAccess.noResults")}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((row) => (
            <PublisherAccessCard
              key={row.id}
              row={row}
              t={t}
              credentialEnabled={row.credentialEnabled !== false}
              onOpenDetail={() => setDetailRow(row)}
              onToggleCredential={() => {
                const cur = row.credentialEnabled !== false;
                const next = !cur;
                show(
                  next
                    ? t("admin.pages.publisherAccess.credentialEnabledToast")
                    : t("admin.pages.publisherAccess.credentialDisabledToast"),
                );
                setCredentialEnabledById((prev) => ({ ...prev, [row.id]: next }));
              }}
              onVerify={() => show(t("admin.publisherAccessModal.testOk"))}
              onQueue={() => show(t("admin.publisherAccessModal.pendingToast", { n: row.pendingCount ?? 0 }))}
              onRenew={() => show(t("admin.publisherAccessModal.renewStarted"))}
              onEdit={() => setEditRow(row)}
              onAssignSchool={() => setAssignRow(row)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
