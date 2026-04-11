import { useState } from "react";
import type { TFunction } from "i18next";
import { AlertTriangle } from "lucide-react";
import { AdminModal } from "../AdminModal";
import { Button } from "../../../components/Button";
import type { SupportTicketRow } from "../../../../data/admin/supportTickets";

const lbl = "mb-1 block text-[11px] font-semibold uppercase tracking-wide text-[#5C5A55]";
const inp = "w-full rounded-lg border border-[#E2E0D9] bg-white px-3 py-2 text-sm outline-none focus:border-[#0A3D62]";

const ASSIGNEES = ["Zara Al-Ahmad", "Tech Support Team", "McGraw Hill Support (escalate)"] as const;

type Props = {
  open: boolean;
  onClose: () => void;
  row: SupportTicketRow | null;
  t: TFunction;
  onToast: (msg: string) => void;
};

export function SupportTicketViewModal({ open, onClose, row, t, onToast }: Props) {
  const [assignee, setAssignee] = useState<string>(ASSIGNEES[0]);
  const [response, setResponse] = useState("");
  const [waExtra, setWaExtra] = useState(true);

  if (!row) return null;

  const d = row.detail;

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title={t("admin.pages.support.ticketModalTitle", { id: row.id })}
      wide
      footer={
        <div className="flex w-full flex-wrap justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            {t("admin.pages.rfq.closeModal")}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              onToast(t("admin.pages.support.toastResponseSent"));
              onClose();
            }}
          >
            {t("admin.pages.support.sendResponse")}
          </Button>
          <Button
            type="button"
            className="bg-[#0D9488] text-white hover:bg-[#0F766E]"
            onClick={() => {
              onToast(t("admin.pages.support.toastResolved"));
              onClose();
            }}
          >
            {t("admin.pages.support.markResolved")}
          </Button>
        </div>
      }
    >
      {d.slaBanner ? (
        <div className="mb-4 flex gap-3 rounded-xl border border-[#F5B7B1] bg-[#FDEDEC] px-4 py-3 text-sm font-medium text-[#7B241C]">
          <AlertTriangle className="mt-0.5 size-5 shrink-0" aria-hidden />
          <span>{d.slaBanner}</span>
        </div>
      ) : null}

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <div className={lbl}>{t("admin.pages.rfq.lblSchool")}</div>
          <div className="text-sm font-semibold text-[#1A1917]">{d.school}</div>
        </div>
        <div>
          <div className={lbl}>{t("admin.pages.support.colPlatform")}</div>
          <div className="text-sm font-semibold text-[#1A1917]">{d.platform}</div>
        </div>
        <div>
          <div className={lbl}>{t("admin.pages.support.issueType")}</div>
          <div className="text-sm font-semibold text-[#1A1917]">{d.issueType}</div>
        </div>
        <div>
          <div className={lbl}>{t("admin.pages.support.reportedBy")}</div>
          <div className="text-sm font-semibold text-[#1A1917]">{d.reportedBy}</div>
        </div>
      </div>

      <div className="mb-4 rounded-xl border border-[#E2E0D9] bg-[#F8F9FA] p-4">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#5C5A55]">{t("admin.pages.support.issueDescription")}</div>
        <p className="text-[13.5px] leading-relaxed text-[#1A1917]">{d.description}</p>
      </div>

      <div className="mb-3">
        <label className={lbl} htmlFor="ticket-assign">
          {t("admin.pages.support.assignTo")}
        </label>
        <select id="ticket-assign" className={inp} value={assignee} onChange={(e) => setAssignee(e.target.value)}>
          {ASSIGNEES.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className={lbl} htmlFor="ticket-response">
          {t("admin.pages.support.responseToSchool")}
        </label>
        <textarea
          id="ticket-response"
          className={`${inp} min-h-[100px]`}
          placeholder={t("admin.pages.support.responsePlaceholder")}
          value={response}
          onChange={(e) => setResponse(e.target.value)}
        />
      </div>

      <label className="flex cursor-pointer items-center gap-2 text-sm text-[#5C5A55]">
        <input type="checkbox" className="rounded border-[#E2E0D9] accent-[#0A3D62]" checked={waExtra} onChange={(e) => setWaExtra(e.target.checked)} />
        {t("admin.pages.support.alsoWhatsAppSchool")}
      </label>
    </AdminModal>
  );
}
