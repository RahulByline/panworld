import { useEffect, useState } from "react";
import type { TFunction } from "i18next";
import { Check } from "lucide-react";
import { AdminModal } from "../AdminModal";
import { Button } from "../../../components/Button";
import type { AdminOrderDetail } from "../../../../data/admin/ordersDelivery";

const lbl = "mb-1 block text-[11px] font-semibold uppercase tracking-wide text-[#5C5A55]";

type Props = {
  open: boolean;
  onClose: () => void;
  detail: AdminOrderDetail | null;
  t: TFunction;
  onToast: (msg: string) => void;
};

export function OrderViewModal({ open, onClose, detail, t, onToast }: Props) {
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (detail && open) setNotes(detail.adminNotes);
  }, [detail, open]);

  if (!detail) return null;

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title={t("admin.pages.orders.detailTitleFull", { id: detail.id })}
      extraWide
      footer={
        <div className="flex w-full flex-wrap justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            {t("admin.pages.orders.close")}
          </Button>
          <Button type="button" variant="secondary" onClick={() => onToast(t("admin.pages.orders.toastOdooOpen"))}>
            {t("admin.pages.orders.openOdoo")}
          </Button>
          <Button
            type="button"
            className="bg-[#0A3D62] text-white hover:bg-[#071E36]"
            onClick={() => {
              onToast(t("admin.pages.orders.toastNotesSaved"));
              onClose();
            }}
          >
            {t("admin.pages.orders.saveNotes")}
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-4 border-b border-[#ECEAE4] pb-4 sm:grid-cols-3">
        <div>
          <div className={lbl}>{t("admin.pages.rfq.lblSchool")}</div>
          <div className="text-sm font-semibold text-[#1A1917]">{detail.school}</div>
          <div className="text-xs text-[#9A9890]">{detail.schoolSub}</div>
        </div>
        <div>
          <div className={lbl}>{t("admin.pages.orders.orderValue")}</div>
          <div className="text-xl font-bold text-[#0A3D62]">{detail.orderValue}</div>
        </div>
        <div>
          <div className={lbl}>{t("common.status")}</div>
          <span
            className={
              detail.statusLabel.toLowerCase().includes("deliver")
                ? "inline-flex rounded-full bg-[#E8F6EF] px-2.5 py-1 text-xs font-semibold text-[#1E8449]"
                : detail.statusLabel.toLowerCase().includes("partial")
                  ? "inline-flex rounded-full bg-[#FDEBD0] px-2.5 py-1 text-xs font-semibold text-[#B7791F]"
                  : detail.statusLabel.toLowerCase().includes("dispatch")
                    ? "inline-flex rounded-full bg-[#E3F2FD] px-2.5 py-1 text-xs font-semibold text-[#0A3D62]"
                    : "inline-flex rounded-full bg-[#FDEBD0] px-2.5 py-1 text-xs font-semibold text-[#7D4E10]"
            }
          >
            {detail.statusLabel}
          </span>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-[#E2E0D9] bg-[#F8F9FA] p-4">
        <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#5C5A55]">{t("admin.pages.orders.orderItems")}</div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#E2E0D9] text-[11px] text-[#5C5A55]">
                <th className="py-2 pe-2 font-semibold">{t("admin.pages.rfq.colProduct")}</th>
                <th className="py-2 pe-2 font-semibold">{t("admin.pages.rfq.colPublisher")}</th>
                <th className="py-2 pe-2 font-semibold">{t("admin.pages.orders.colQty")}</th>
                <th className="py-2 pe-2 font-semibold">{t("admin.pages.orders.colUnitPrice")}</th>
                <th className="py-2 font-semibold">{t("admin.pages.rfq.colSubtotal")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECEAE4]">
              {detail.lineItems.map((row) => (
                <tr key={row.product}>
                  <td className="py-2 pe-2">{row.product}</td>
                  <td className="py-2 pe-2">{row.publisher}</td>
                  <td className="py-2 pe-2">{row.qty}</td>
                  <td className="py-2 pe-2">{row.unitPrice}</td>
                  <td className="py-2 font-medium">{row.subtotal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-[#E2E0D9] bg-[#F8F9FA] p-3">
          <div className={lbl}>{t("admin.pages.orders.rfqRef")}</div>
          <div className="text-sm font-medium text-[#1A1917]">{detail.rfqRef}</div>
        </div>
        <div className="rounded-xl border border-[#E2E0D9] bg-[#F8F9FA] p-3">
          <div className={lbl}>{t("admin.pages.orders.invoice")}</div>
          <div className="text-sm font-medium text-[#1A1917]">
            {detail.invoiceId}
            {detail.invoiceId !== "—" ? (
              <>
                {" · "}
                <span className={detail.invoicePaid ? "font-semibold text-[#1E8449]" : "text-[#B7791F]"}>
                  {detail.invoicePaid ? t("admin.pages.orders.paid") : t("admin.pages.orders.outstanding")}
                </span>
              </>
            ) : null}
          </div>
        </div>
        <div className="rounded-xl border border-[#E2E0D9] bg-[#F8F9FA] p-3">
          <div className={lbl}>{t("admin.pages.rfq.lblAccountManager")}</div>
          <div className="text-sm font-medium text-[#1A1917]">{detail.accountManager}</div>
        </div>
        <div className="rounded-xl border border-[#E2E0D9] bg-[#F8F9FA] p-3">
          <div className={lbl}>{t("admin.pages.orders.odooSync")}</div>
          <div className="text-sm font-medium text-[#1A1917]">
            <span
              className={
                detail.odooSynced
                  ? "mr-1 inline-flex rounded-full bg-[#E8F6EF] px-2 py-0.5 text-xs font-semibold text-[#1E8449]"
                  : "mr-1 inline-flex rounded-full bg-[#FDEBD0] px-2 py-0.5 text-xs font-semibold text-[#B7791F]"
              }
            >
              {detail.odooSynced ? t("admin.pages.orders.odooSynced") : t("admin.pages.orders.odooError")}
            </span>
            {detail.odooSoId}
          </div>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#5C5A55]">{t("admin.pages.orders.deliveryTimeline")}</div>
        <ul className="flex flex-col gap-2">
          {detail.timeline.map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-[13px]">
              <Check className="mt-0.5 size-4 shrink-0 text-[#1E8449]" strokeWidth={2.5} aria-hidden />
              <span className="w-[72px] shrink-0 text-[#9A9890]">{step.date}</span>
              <span className="text-[#1A1917]">{step.text}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5">
        <label className={lbl} htmlFor="order-admin-notes">
          {t("admin.pages.orders.adminNotes")}
        </label>
        <textarea
          id="order-admin-notes"
          className="min-h-[88px] w-full rounded-lg border border-[#E2E0D9] bg-white px-3 py-2 text-sm outline-none focus:border-[#0A3D62]"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t("admin.pages.orders.adminNotesPh")}
        />
      </div>
    </AdminModal>
  );
}
