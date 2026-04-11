import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Download, RefreshCw, Search } from "lucide-react";
import { AdminPageHeader } from "../../admin/components/AdminPageHeader";
import { Button } from "../../components/Button";
import { OrderViewModal } from "../../admin/components/orders/OrderViewModal";
import { adminOrdersList, getOrderDetail, type AdminOrderListRow } from "../../../data/admin/ordersDelivery";
import { useAdminToast } from "../../admin/hooks/useAdminToast";
import { cn } from "../../utils/cn";

function statusPillClass(status: string): string {
  const s = status.toLowerCase();
  if (s.includes("deliver")) return "bg-[#E8F6EF] text-[#1E8449]";
  if (s.includes("dispatch")) return "bg-[#E3F2FD] text-[#0A3D62]";
  if (s.includes("process")) return "bg-[#FDEBD0] text-[#B7791F]";
  if (s.includes("partial")) return "bg-[#FDEDEC] text-[#C0392B]";
  return "bg-[#E8EAED] text-[#5C5A55]";
}

export function AdminOrdersPage() {
  const { t } = useTranslation();
  const { show, Toast } = useAdminToast();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<AdminOrderListRow | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return adminOrdersList;
    return adminOrdersList.filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        o.school.toLowerCase().includes(q) ||
        o.productsSummary.toLowerCase().includes(q) ||
        o.value.toLowerCase().includes(q),
    );
  }, [search]);

  const detail = selected ? getOrderDetail(selected.id) : null;

  return (
    <div className="font-sans">
      <Toast />
      <AdminPageHeader
        title={t("admin.pages.orders.title")}
        subtitle={t("admin.pages.orders.subtitle")}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary" size="sm" className="gap-1.5" onClick={() => show(t("admin.pages.orders.syncOdoo"))}>
              <RefreshCw className="size-3.5" aria-hidden />
              {t("admin.pages.orders.sync")}
            </Button>
            <Button type="button" variant="secondary" size="sm" className="gap-1.5" onClick={() => show(t("admin.pages.orders.export"))}>
              <Download className="size-3.5" aria-hidden />
              {t("common.export")}
            </Button>
          </div>
        }
      />

      <div className="mb-4">
        <div className="relative max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9A9890]" aria-hidden />
          <input
            type="search"
            className="h-10 w-full rounded-lg border border-[#E2E0D9] bg-[#F8F9FA] py-2 pl-9 pr-3 text-sm outline-none focus:border-[#0A3D62] focus:bg-white"
            placeholder={t("admin.pages.orders.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label={t("admin.pages.orders.searchPlaceholder")}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#E2E0D9] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] border-collapse text-left text-[13.5px]">
            <thead className="border-b border-[#E2E0D9] bg-[#F5F4F0] text-[11px] font-semibold uppercase tracking-wide text-[#5C5A55]">
              <tr>
                <th className="px-4 py-3">{t("admin.pages.orders.colId")}</th>
                <th className="px-4 py-3">{t("admin.pages.rfq.colSchool")}</th>
                <th className="px-4 py-3">{t("admin.pages.orders.colProducts")}</th>
                <th className="px-4 py-3">{t("admin.pages.rfq.colValue")}</th>
                <th className="px-4 py-3">{t("common.status")}</th>
                <th className="px-4 py-3">{t("admin.pages.orders.colTracking")}</th>
                <th className="px-4 py-3">{t("admin.pages.orders.colExpected")}</th>
                <th className="px-4 py-3">{t("admin.pages.orders.colOdoo")}</th>
                <th className="px-4 py-3 text-right">{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E0D9]">
              {filtered.map((o) => (
                <tr key={o.id} className="hover:bg-[#FAFAF8]">
                  <td className="px-4 py-3 font-mono text-xs font-semibold">{o.id}</td>
                  <td className="px-4 py-3">{o.school}</td>
                  <td className="max-w-[220px] px-4 py-3 text-[#5C5A55]">{o.productsSummary}</td>
                  <td className="px-4 py-3 font-medium">{o.value}</td>
                  <td className="px-4 py-3">
                    <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold", statusPillClass(o.status))}>{o.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    {o.tracking ? (
                      <button
                        type="button"
                        className="text-left text-sm text-[#0A3D62] underline"
                        onClick={() => show(t("admin.pages.orders.tracking", { id: o.tracking }))}
                      >
                        {o.tracking}
                      </button>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3 text-[#5C5A55]">{o.expectedDelivery}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold",
                        o.odoo === "synced" ? "bg-[#E8F6EF] text-[#1E8449]" : "bg-[#FDEBD0] text-[#B7791F]",
                      )}
                    >
                      {o.odoo === "synced" ? t("admin.pages.orders.odooSynced") : t("admin.pages.orders.odooError")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button type="button" variant="secondary" size="sm" onClick={() => setSelected(o)}>
                      {t("admin.pages.orders.detail")}
                    </Button>
                    {o.odoo === "error" ? (
                      <Button type="button" variant="ghost" size="sm" className="ml-1 text-[#B7791F]" onClick={() => show(t("admin.pages.orders.retrySync"))}>
                        {t("admin.pages.orders.retry")}
                      </Button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <OrderViewModal open={!!selected && !!detail} onClose={() => setSelected(null)} detail={detail} t={t} onToast={show} />
    </div>
  );
}
