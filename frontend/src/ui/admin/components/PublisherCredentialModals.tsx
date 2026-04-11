import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AdminModal } from "./AdminModal";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import type { PublisherAccessRow } from "../../../data/admin/publisherAccess";
import { AM_PORTFOLIO_SCHOOLS } from "../../../data/admin/amPortfolioSchools";

const inp = "w-full rounded-lg border border-[#E2E0D9] bg-white px-3 py-2 text-sm text-[#1A1917] outline-none focus:border-[#0A3D62]";
const lbl = "mb-1 block text-xs font-medium text-[#5C5A55]";

type Base = { open: boolean; onClose: () => void; onSaved: (msg: string) => void };

export function PublisherCredentialAddModal({ open, onClose, onSaved }: Base) {
  const { t } = useTranslation();
  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title={t("admin.publisherAccessModal.addTitle")}
      wide
      footer={
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            type="button"
            className="bg-[#0A3D62] text-white hover:bg-[#071E36]"
            onClick={() => {
              onSaved(t("admin.publisherAccessModal.saved"));
              onClose();
            }}
          >
            {t("admin.publisherAccessModal.save")}
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className={lbl}>{t("admin.catalogueModals.publisher")} *</label>
          <select className={inp} defaultValue="">
            <option value="">{t("admin.catalogueModals.selectPublisher")}</option>
            <option>McGraw Hill</option>
            <option>Kodeit Global</option>
            <option>StudySync</option>
            <option>Achieve3000</option>
            <option>PowerSchool</option>
            <option>Oxford</option>
            <option>Cambridge</option>
          </select>
        </div>
        <div>
          <label className={lbl}>{t("admin.publisherAccessModal.product")} *</label>
          <input className={inp} placeholder={t("admin.publisherAccessModal.productPh")} />
        </div>
      </div>
      <div className="mt-3">
        <span className={lbl}>{t("admin.publisherAccessModal.credType")} *</span>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" name="cred-type" defaultChecked />
            {t("admin.publisherAccessModal.typeShared")}
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" name="cred-type" />
            {t("admin.publisherAccessModal.typeSchool")}
          </label>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className={lbl}>{t("admin.publisherAccessModal.login")} *</label>
          <input className={inp} type="email" placeholder="demo@publisher.com" />
        </div>
        <div>
          <label className={lbl}>{t("admin.publisherAccessModal.password")} *</label>
          <input className={inp} type="password" placeholder="••••••••" />
        </div>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className={lbl}>{t("admin.publisherAccessModal.demoUrl")}</label>
          <input className={inp} placeholder="https://demo.publisher.com" />
        </div>
        <div>
          <label className={lbl}>{t("admin.publisherAccessModal.validUntil")}</label>
          <input className={inp} type="date" />
        </div>
      </div>
      <div className="mt-3">
        <label className={lbl}>{t("admin.publisherAccessModal.notes")}</label>
        <textarea className={`${inp} min-h-[88px]`} placeholder={t("admin.publisherAccessModal.notesPh")} />
      </div>
    </AdminModal>
  );
}

export function PublisherCredentialEditModal({
  open,
  onClose,
  onSaved,
  row,
}: Base & { row: PublisherAccessRow | null }) {
  const { t } = useTranslation();
  if (!row) return null;
  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title={t("admin.publisherAccessModal.editTitle", { name: row.title })}
      wide
      footer={
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            type="button"
            className="bg-[#0A3D62] text-white hover:bg-[#071E36]"
            onClick={() => {
              onSaved(t("admin.publisherAccessModal.updated"));
              onClose();
            }}
          >
            {t("common.save")}
          </Button>
        </div>
      }
    >
      <p className="text-sm text-[#5C5A55]">{row.subtitle ?? row.accessLine}</p>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className={lbl}>{t("admin.publisherAccessModal.login")}</label>
          <input className={inp} defaultValue={row.accessLine.split(" / ")[0] ?? ""} />
        </div>
        <div>
          <label className={lbl}>{t("admin.publisherAccessModal.password")}</label>
          <input className={inp} type="password" placeholder="••••••••" />
        </div>
      </div>
      <div className="mt-3">
        <label className={lbl}>{t("admin.publisherAccessModal.demoUrl")}</label>
        <input className={inp} placeholder="https://…" />
      </div>
    </AdminModal>
  );
}

type AssignProps = {
  open: boolean;
  onClose: () => void;
  credentialId: string;
  productTitle: string;
  onAssigned: (msg: string) => void;
};

export function PublisherAssignSchoolModal({ open, onClose, credentialId, productTitle, onAssigned }: AssignProps) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setFilter("");
      setSelectedId(null);
    }
  }, [open, credentialId, productTitle]);

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return AM_PORTFOLIO_SCHOOLS;
    return AM_PORTFOLIO_SCHOOLS.filter(
      (s) => s.name.toLowerCase().includes(q) || s.country.toLowerCase().includes(q),
    );
  }, [filter]);

  function save() {
    const school = selectedId ? AM_PORTFOLIO_SCHOOLS.find((s) => s.id === selectedId) : undefined;
    if (!school) return;
    onAssigned(t("admin.publisherAccessModal.assignSaved", { school: school.name, product: productTitle }));
    onClose();
  }

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title={t("admin.publisherAccessModal.assignTitle", { name: productTitle })}
      wide
      footer={
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            type="button"
            className="bg-[#0A3D62] text-white hover:bg-[#071E36] disabled:opacity-50"
            disabled={!selectedId}
            onClick={save}
          >
            {t("admin.publisherAccessModal.assignSave")}
          </Button>
        </div>
      }
    >
      <p className="text-sm text-[#5C5A55]">{t("admin.publisherAccessModal.assignHint")}</p>
      <div className="mt-3">
        <label className={lbl}>{t("admin.publisherAccessModal.assignFilter")}</label>
        <Input
          className="mt-1"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder={t("admin.publisherAccessModal.assignFilterPh")}
        />
      </div>
      <div className="mt-3 max-h-[min(52vh,420px)] overflow-y-auto rounded-xl border border-[#E2E0D9]">
        <ul className="divide-y divide-[#ECEAE4]">
          {filtered.slice(0, 200).map((s) => (
            <li key={s.id}>
              <label className="flex cursor-pointer items-center gap-3 px-3 py-2.5 hover:bg-[#FAFAF8]">
                <input
                  type="radio"
                  name={`assign-school-${credentialId || "x"}`}
                  className="h-4 w-4 accent-[#0A3D62]"
                  checked={selectedId === s.id}
                  onChange={() => setSelectedId(s.id)}
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-[#1A1917]">{s.name}</span>
                  <span className="text-xs text-[#9A9890]">{s.country}</span>
                </span>
              </label>
            </li>
          ))}
        </ul>
        {filtered.length === 0 ? (
          <div className="px-3 py-8 text-center text-sm text-[#9A9890]">{t("admin.publisherAccessModal.assignNoResults")}</div>
        ) : null}
        {filtered.length > 200 ? (
          <p className="border-t border-[#ECEAE4] px-3 py-2 text-center text-xs text-[#9A9890]">
            {t("admin.publisherAccessModal.assignListTruncated")}
          </p>
        ) : null}
      </div>
    </AdminModal>
  );
}
