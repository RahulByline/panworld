import { useState } from "react";
import type { TFunction } from "i18next";
import { AdminModal } from "../AdminModal";
import { Button } from "../../../components/Button";
import { rfqDetailFixture } from "../../../../data/admin/rfqPipeline";
import type { RfqKanbanCard } from "../../../../data/admin/rfqPipeline";
import { cn } from "../../../utils/cn";

type Props = {
  open: boolean;
  onClose: () => void;
  card: RfqKanbanCard | null;
  t: TFunction;
  onToast: (msg: string) => void;
};

const inp = "w-full rounded-lg border border-[#E2E0D9] bg-white px-3 py-2 text-sm outline-none focus:border-[#0A3D62]";
const lbl = "mb-1 block text-[11px] font-semibold uppercase tracking-wide text-[#5C5A55]";

export function RfqViewModal({ open, onClose, card, t, onToast }: Props) {
  const [waReply, setWaReply] = useState(true);
  const [pushOdoo, setPushOdoo] = useState(true);
  const [waStage, setWaStage] = useState(true);

  if (!card) return null;

  const d = rfqDetailFixture;
  const titleId = card.rfqId;

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title={t("admin.pages.rfq.viewTitle", { id: titleId })}
      wide
      footer={
        <div className="flex w-full flex-wrap items-center gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            {t("admin.pages.rfq.closeModal")}
          </Button>
          <Button type="button" variant="danger" size="sm" onClick={() => { onToast(t("admin.pages.rfq.toastRejected")); onClose(); }}>
            {t("admin.pages.rfq.reject")}
          </Button>
          <Button type="button" variant="secondary" size="sm" onClick={() => onToast(t("admin.pages.rfq.toastNotesSaved"))}>
            {t("admin.pages.rfq.saveNotes")}
          </Button>
          <Button type="button" variant="secondary" size="sm" onClick={() => onToast(t("admin.pages.rfq.toastSample"))}>
            {t("admin.pages.rfq.logSample")}
          </Button>
          <Button type="button" variant="secondary" size="sm" onClick={() => onToast(t("admin.pages.rfq.toastDemo"))}>
            {t("admin.pages.rfq.shareDemo")}
          </Button>
          <div className="flex-1" />
          <Button
            type="button"
            className="bg-[#0A3D62] text-white hover:bg-[#071E36]"
            onClick={() => {
              onToast(t("admin.pages.rfq.toastQuoteUploaded"));
              onClose();
            }}
          >
            {t("admin.pages.rfq.uploadQuoteAdvance")}
          </Button>
        </div>
      }
    >
      <div className="pe-1">
        {/* Stage bar */}
        <div className="mb-4 flex gap-0.5 overflow-x-auto text-[11px] font-bold">
          <div className="min-w-[72px] flex-1 rounded-l-md bg-[#0A3D62] py-1.5 text-center text-white">{t("admin.pages.rfq.stageSubmitted")}</div>
          <div className="min-w-[72px] flex-1 bg-[#1a5270] py-1.5 text-center text-white">{t("admin.pages.rfq.stageUnderReview")}</div>
          <div className="min-w-[72px] flex-1 border border-[#E2E0D9] bg-[#FAFAF8] py-1.5 text-center font-semibold text-[#9A9890]">{t("admin.pages.rfq.stageQuoted")}</div>
          <div className="min-w-[72px] flex-1 border border-[#E2E0D9] bg-[#FAFAF8] py-1.5 text-center font-semibold text-[#9A9890]">{t("admin.pages.rfq.stageApproved")}</div>
          <div className="min-w-[72px] flex-1 rounded-r-md border border-[#E2E0D9] bg-[#FAFAF8] py-1.5 text-center font-semibold text-[#9A9890]">{t("admin.pages.rfq.stageOrdered")}</div>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div>
            <div className={lbl}>{t("admin.pages.rfq.lblSchool")}</div>
            <div className="text-sm font-semibold text-[#1A1917]">{d.school}</div>
            <div className="text-xs text-[#9A9890]">{d.schoolSub}</div>
          </div>
          <div>
            <div className={lbl}>{t("admin.pages.rfq.lblSubmittedBy")}</div>
            <div className="text-sm font-semibold text-[#1A1917]">{d.submittedBy}</div>
            <div className="text-xs text-[#9A9890]">{d.submittedBySub}</div>
          </div>
          <div>
            <div className={lbl}>{t("admin.pages.rfq.lblAccountManager")}</div>
            <div className="text-sm font-semibold text-[#1A1917]">{d.accountManager}</div>
            <div className="text-xs text-[#9A9890]">{d.accountManagerSub}</div>
          </div>
          <div>
            <div className={lbl}>{t("admin.pages.rfq.lblEstValue")}</div>
            <div className="text-xl font-bold text-[#0A3D62]">{card.meta1.split("·").slice(1).join("·").trim() || d.estValue}</div>
          </div>
        </div>

        <div className="mb-4 rounded-xl border border-[#E2E0D9] bg-[#FAFAF8] p-3">
          <div className="mb-2 text-xs font-semibold uppercase text-[#5C5A55]">{t("admin.pages.rfq.requestedItems")}</div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-left text-[12.5px]">
              <thead>
                <tr className="border-b border-[#E2E0D9] text-[11px] text-[#5C5A55]">
                  <th className="py-2 pe-2 font-semibold">{t("admin.pages.rfq.colProduct")}</th>
                  <th className="py-2 pe-2 font-semibold">{t("admin.pages.rfq.colPublisher")}</th>
                  <th className="py-2 pe-2 font-semibold">{t("admin.pages.rfq.colGrade")}</th>
                  <th className="py-2 pe-2 font-semibold">{t("admin.pages.rfq.colFormat")}</th>
                  <th className="py-2 pe-2 font-semibold">{t("admin.pages.rfq.colQty")}</th>
                  <th className="py-2 font-semibold">{t("admin.pages.rfq.colNotes")}</th>
                </tr>
              </thead>
              <tbody>
                {d.lineItems.map((row) => (
                  <tr key={row.product} className="border-b border-[#ECEAE4]">
                    <td className="py-2 pe-2">{row.product}</td>
                    <td className="py-2 pe-2">{row.publisher}</td>
                    <td className="py-2 pe-2">{row.grade}</td>
                    <td className="py-2 pe-2">{row.format}</td>
                    <td className="py-2 pe-2">{row.qty}</td>
                    <td className="py-2 text-[#5C5A55]">{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-[12.5px] text-[#5C5A55]">
            <span className="font-semibold text-[#1A1917]">{t("admin.pages.rfq.requiredBy")}</span> {d.requiredBy} ·{" "}
            <span className="font-semibold text-[#1A1917]">{t("admin.pages.rfq.budget")}</span> {d.budget} ·{" "}
            <span className="font-semibold text-[#1A1917]">{t("admin.pages.rfq.decisionMaker")}</span> {d.decisionMaker}
          </p>
        </div>

        <div className="mb-2 text-sm font-semibold text-[#1A1917]">{t("admin.pages.rfq.commThread")}</div>
        <div className="mb-4 rounded-xl border border-[#E2E0D9] bg-[#FAFAF8] p-3">
          {d.threads.map((th, i) => (
            <div key={i} className={cn("border-b border-[#ECEAE4] pb-3 last:border-0", i > 0 && "mt-3 pt-1")}>
              <div className="flex justify-between gap-2">
                <span className={cn("text-xs font-semibold", th.tone === "success" ? "text-[#1E8449]" : "text-[#0A3D62]")}>{th.who}</span>
                <span className="text-[11px] text-[#9A9890]">{th.when}</span>
              </div>
              <p className="mt-1 text-[13px] leading-snug text-[#1A1917]">{th.body}</p>
              {th.attachments ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {th.attachments.map((a) => (
                    <button
                      key={a}
                      type="button"
                      className="inline-flex items-center gap-1 rounded-md border border-[#E2E0D9] bg-white px-2.5 py-1 text-[11.5px] text-[#1A1917] hover:bg-[#F5F4F0]"
                      onClick={() => onToast(t("admin.pages.rfq.toastDownloading"))}
                    >
                      📄 {a}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <label className={lbl}>{t("admin.pages.rfq.replyToSchool")}</label>
        <textarea className={`${inp} mb-3 min-h-[70px]`} placeholder={t("admin.pages.rfq.replyPlaceholder")} />
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Button type="button" variant="secondary" size="sm" onClick={() => onToast(t("admin.pages.rfq.toastReplySent"))}>
            {t("admin.pages.rfq.sendReply")}
          </Button>
          <Button type="button" variant="secondary" size="sm" onClick={() => onToast(t("admin.pages.rfq.toastAttach"))}>
            {t("admin.pages.rfq.attachFile")}
          </Button>
          <Button type="button" variant="secondary" size="sm" onClick={() => onToast(t("admin.pages.rfq.toastInternal"))}>
            {t("admin.pages.rfq.internalNote")}
          </Button>
          <div className="flex-1" />
          <label className="flex cursor-pointer items-center gap-2 text-xs text-[#5C5A55]">
            <input type="checkbox" className="rounded border-[#E2E0D9]" checked={waReply} onChange={(e) => setWaReply(e.target.checked)} />
            {t("admin.pages.rfq.alsoWhatsApp")}
          </label>
        </div>

        <div className="mb-2 text-sm font-semibold">{t("admin.pages.rfq.attachmentsFromSchool")}</div>
        <div className="mb-4 flex flex-wrap gap-2">
          {["Requirement_Sheet.pdf", "Student_Count_G4G6.xlsx", "ConnectED Portal Link"].map((name, i) => (
            <button
              key={name}
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-[#E2E0D9] bg-[#FAFAF8] px-3 py-2 text-xs hover:bg-[#F0EFEA]"
              onClick={() => onToast(t("admin.pages.rfq.toastDownloading"))}
            >
              {name}
              <span className="rounded bg-[#E8EAED] px-1.5 py-0.5 text-[9px] font-medium">{["PDF", "XLSX", "URL"][i]}</span>
            </button>
          ))}
        </div>

        <div className="my-4 border-t border-[#E2E0D9]" />

        <div className="mb-2 text-sm font-semibold">{t("admin.pages.rfq.quotePricing")}</div>
        <div className="mb-4 rounded-xl border border-[#E2E0D9] bg-[#FAFAF8] p-3">
          <table className="w-full border-collapse text-[12.5px]">
            <thead>
              <tr className="border-b border-[#E2E0D9] text-[11px] text-[#5C5A55]">
                <th className="py-2 text-left font-semibold">{t("admin.pages.rfq.colItem")}</th>
                <th className="py-2 text-left font-semibold">{t("admin.pages.rfq.colUnitPrice")}</th>
                <th className="py-2 text-left font-semibold">{t("admin.pages.rfq.colQty")}</th>
                <th className="py-2 text-left font-semibold">{t("admin.pages.rfq.colSubtotal")}</th>
              </tr>
            </thead>
            <tbody>
              {d.quoteRows.map((r) => (
                <tr key={r.item} className="border-b border-[#ECEAE4]">
                  <td className="py-2">{r.item}</td>
                  <td className="py-2">
                    <input type="number" className="w-20 rounded border border-[#E2E0D9] px-2 py-1 text-xs" defaultValue={r.unit} />
                  </td>
                  <td className="py-2">{r.qty}</td>
                  <td className="py-2 font-semibold">{r.subtotal}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-3 flex flex-col gap-3 border-t border-[#E2E0D9] pt-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-wrap gap-4">
              <div>
                <label className={lbl}>{t("admin.pages.rfq.discountPct")}</label>
                <input type="number" className="w-[72px] rounded border border-[#E2E0D9] px-2 py-1 text-xs" defaultValue={d.discountPct} />
              </div>
              <div>
                <label className={lbl}>{t("admin.pages.rfq.validUntil")}</label>
                <input type="date" className={inp} defaultValue={d.validUntil} />
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-[#9A9890]">{t("admin.pages.rfq.totalAfterDiscount", { pct: d.discountPct })}</div>
              <div className="text-2xl font-bold text-[#0A3D62]">{d.totalAfterDiscount}</div>
            </div>
          </div>
        </div>

        <div className="mb-2 grid gap-3 sm:grid-cols-2">
          <div>
            <label className={lbl}>{t("admin.pages.rfq.uploadQuoteDoc")}</label>
            <div className="rounded-xl border border-dashed border-[#E2E0D9] bg-[#FAFAF8] px-4 py-6 text-center text-xs text-[#5C5A55]">
              <div className="mb-1 text-base">📄</div>
              <div className="font-medium text-[#1A1917]">{t("admin.pages.rfq.uploadQuoteHint")}</div>
              <div className="mt-0.5 text-[11px] text-[#9A9890]">{t("admin.pages.rfq.uploadQuoteFormats")}</div>
            </div>
          </div>
          <div>
            <label className={lbl}>{t("admin.pages.rfq.externalLink")}</label>
            <input className={`${inp} mt-6`} placeholder="https://drive.google.com/..." />
          </div>
        </div>

        <div className="my-4 border-t border-[#E2E0D9]" />

        <div className="mb-2 text-sm font-semibold">{t("admin.pages.rfq.activityTimeline")}</div>
        <div className="mb-4 flex flex-col gap-1.5 text-[12.5px]">
          {d.timeline.map((ev, i) => (
            <div key={i} className="flex items-start gap-2">
              <span
                className={cn(
                  "mt-0.5 shrink-0",
                  ev.dot === "success" && "text-[#1E8449]",
                  ev.dot === "brand" && "text-[#0A3D62]",
                  ev.dot === "accent" && "text-[#7E57C2]",
                  ev.dot === "warn" && "text-[#E8912D]",
                )}
              >
                ●
              </span>
              <span className="w-[108px] shrink-0 text-[#9A9890]">{ev.when}</span>
              <span className={cn(ev.urgent && "font-semibold text-[#B7791F]")}>{ev.text}</span>
            </div>
          ))}
        </div>

        <div className="mb-3 grid gap-3 sm:grid-cols-2">
          <div>
            <label className={lbl}>{t("admin.pages.rfq.assignAm")}</label>
            <select className={inp}>
              <option>Rania Khalil (UAE)</option>
              <option>Ahmed Al-Rashidi (KSA)</option>
              <option>Sara Nasser (UAE)</option>
            </select>
          </div>
          <div>
            <label className={lbl}>{t("admin.pages.rfq.priority")}</label>
            <select className={inp} defaultValue="high">
              <option value="normal">{t("admin.pages.rfq.priorityNormal")}</option>
              <option value="high">{t("admin.pages.rfq.priorityHigh")}</option>
              <option value="urgent">{t("admin.pages.rfq.priorityUrgent")}</option>
            </select>
          </div>
        </div>
        <div className="mb-3">
          <label className={lbl}>{t("admin.pages.rfq.internalAdminNotes")}</label>
          <textarea className={`${inp} min-h-[72px]`} defaultValue={d.internalNotes} />
        </div>
        <div className="flex flex-wrap gap-4">
          <label className="flex cursor-pointer items-center gap-2 text-xs text-[#5C5A55]">
            <input type="checkbox" className="rounded border-[#E2E0D9]" checked={pushOdoo} onChange={(e) => setPushOdoo(e.target.checked)} />
            {t("admin.pages.rfq.togglePushOdoo")}
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-xs text-[#5C5A55]">
            <input type="checkbox" className="rounded border-[#E2E0D9]" checked={waStage} onChange={(e) => setWaStage(e.target.checked)} />
            {t("admin.pages.rfq.toggleWaStage")}
          </label>
        </div>
      </div>
    </AdminModal>
  );
}
