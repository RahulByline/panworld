import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Mail, Phone } from "lucide-react";
import { AdminPageHeader } from "../../admin/components/AdminPageHeader";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { AdminModal } from "../../admin/components/AdminModal";
import {
  accountManagersSeed,
  type AccountManagerRow,
  type AccountManagerTerritory,
} from "../../../data/admin/accountManagers";
import { AM_PORTFOLIO_SCHOOLS } from "../../../data/admin/amPortfolioSchools";
import { useAdminToast } from "../../admin/hooks/useAdminToast";

type AmFormDraft = {
  name: string;
  title: string;
  region: string;
  territory: AccountManagerTerritory;
  email: string;
  mobile: string;
  visibleToSchools: boolean;
};

const emptyDraft: AmFormDraft = {
  name: "",
  title: "",
  region: "",
  territory: "UAE",
  email: "",
  mobile: "",
  visibleToSchools: true,
};

function rowToDraft(row: AccountManagerRow): AmFormDraft {
  return {
    name: row.name,
    title: row.title,
    region: row.region,
    territory: row.territory,
    email: row.email,
    mobile: row.mobile,
    visibleToSchools: row.visibleToSchools,
  };
}

function draftToNewRow(d: AmFormDraft, id: string): AccountManagerRow {
  return {
    id,
    name: d.name.trim(),
    title: d.title.trim() || "Account Manager",
    region: d.region.trim() || "—",
    territory: d.territory,
    email: d.email.trim(),
    mobile: d.mobile.trim(),
    visibleToSchools: d.visibleToSchools,
    openRfqs: 0,
    pipelineAed: "AED 0",
    assignedSchoolIds: [],
  };
}

export function AdminAccountManagersPage() {
  const { t } = useTranslation();
  const { show, Toast } = useAdminToast();
  const [managers, setManagers] = useState<AccountManagerRow[]>(() => [...accountManagersSeed]);

  const [addOpen, setAddOpen] = useState(false);
  const [addDraft, setAddDraft] = useState<AmFormDraft>(emptyDraft);

  const [editOpen, setEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<AmFormDraft>(emptyDraft);

  const [assignOpen, setAssignOpen] = useState(false);
  const [assignAmId, setAssignAmId] = useState<string | null>(null);
  const [assignSelected, setAssignSelected] = useState<Set<string>>(() => new Set());
  const [assignFilter, setAssignFilter] = useState("");
  const [assignNotes, setAssignNotes] = useState("");

  const inp = "w-full rounded-lg border border-[#E2E0D9] px-3 py-2 text-sm outline-none focus:border-[#0A3D62]";
  const lbl = "mb-1 block text-xs font-medium text-[#5C5A55]";

  const assignAm = useMemo(() => managers.find((m) => m.id === assignAmId) ?? null, [managers, assignAmId]);

  const filteredPortfolioSchools = useMemo(() => {
    const q = assignFilter.trim().toLowerCase();
    if (!q) return AM_PORTFOLIO_SCHOOLS;
    return AM_PORTFOLIO_SCHOOLS.filter(
      (s) => s.name.toLowerCase().includes(q) || s.country.toLowerCase().includes(q),
    );
  }, [assignFilter]);

  function openAdd() {
    setAddDraft(emptyDraft);
    setAddOpen(true);
  }

  function openEdit(row: AccountManagerRow) {
    setEditingId(row.id);
    setEditDraft(rowToDraft(row));
    setEditOpen(true);
  }

  function openAssignSchools(row: AccountManagerRow) {
    setAssignAmId(row.id);
    setAssignSelected(new Set(row.assignedSchoolIds));
    setAssignFilter("");
    setAssignNotes("");
    setAssignOpen(true);
  }

  function closeAssign() {
    setAssignOpen(false);
    setAssignAmId(null);
    setAssignSelected(new Set());
    setAssignNotes("");
  }

  function toggleSchoolInAssign(id: string) {
    setAssignSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function saveAssignSchools() {
    if (!assignAmId) return;
    const ids = Array.from(assignSelected);
    setManagers((prev) =>
      prev.map((m) => (m.id === assignAmId ? { ...m, assignedSchoolIds: ids } : m)),
    );
    show(t("admin.pages.accountManagers.assignSchoolsSaved", { name: assignAm?.name ?? "" }));
    closeAssign();
  }

  function submitAdd() {
    if (!addDraft.name.trim() || !addDraft.email.trim() || !addDraft.mobile.trim()) {
      show(t("admin.pages.accountManagers.validationRequired"));
      return;
    }
    const id = `am-${Date.now()}`;
    setManagers((prev) => [...prev, draftToNewRow(addDraft, id)]);
    show(t("admin.pages.accountManagers.amCreated"));
    setAddOpen(false);
    setAddDraft(emptyDraft);
  }

  function submitEdit() {
    if (!editingId) return;
    if (!editDraft.name.trim() || !editDraft.email.trim() || !editDraft.mobile.trim()) {
      show(t("admin.pages.accountManagers.validationRequired"));
      return;
    }
    setManagers((prev) =>
      prev.map((m) =>
        m.id === editingId
          ? {
              ...m,
              name: editDraft.name.trim(),
              title: editDraft.title.trim() || "Account Manager",
              region: editDraft.region.trim() || "—",
              territory: editDraft.territory,
              email: editDraft.email.trim(),
              mobile: editDraft.mobile.trim(),
              visibleToSchools: editDraft.visibleToSchools,
            }
          : m,
      ),
    );
    show(t("admin.pages.accountManagers.amSaved"));
    setEditOpen(false);
    setEditingId(null);
  }

  function deactivateEditing() {
    if (!editingId) return;
    const row = managers.find((m) => m.id === editingId);
    if (!row) return;
    if (!window.confirm(t("admin.pages.accountManagers.confirmDeactivateAm", { name: row.name }))) return;
    setManagers((prev) => prev.filter((m) => m.id !== editingId));
    show(t("admin.pages.accountManagers.deactivatedToast"));
    setEditOpen(false);
    setEditingId(null);
  }

  const editingRow = editingId ? managers.find((m) => m.id === editingId) : null;

  return (
    <div className="font-sans">
      <Toast />
      <AdminPageHeader
        title={t("admin.pages.accountManagers.title")}
        subtitle={t("admin.pages.accountManagers.subtitle")}
        actions={
          <Button type="button" className="bg-[#0A3D62] text-white hover:bg-[#071E36]" onClick={openAdd}>
            {t("admin.pages.accountManagers.add")}
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {managers.map((row) => {
          const schoolCount = row.assignedSchoolIds.length;
          const pipeShort = row.pipelineAed.replace(/^AED\s+/i, "");
          return (
            <div key={row.id} className="flex flex-col rounded-2xl border border-[#E2E0D9] bg-white p-5">
              <div className="text-lg font-semibold text-[#0A3D62]">{row.name}</div>
              <div className="text-sm text-[#5C5A55]">{row.title}</div>
              <div className="text-sm text-[#5C5A55]">{row.region}</div>
              <div className="mt-3 space-y-1.5 text-[13px] text-[#1A1917]">
                <a href={`mailto:${row.email}`} className="flex items-center gap-2 text-[#0A3D62] hover:underline">
                  <Mail className="h-3.5 w-3.5 shrink-0 text-[#5C5A55]" />
                  <span className="min-w-0 truncate">{row.email}</span>
                </a>
                <a href={`tel:${row.mobile.replace(/\s/g, "")}`} className="flex items-center gap-2 text-[#0A3D62] hover:underline">
                  <Phone className="h-3.5 w-3.5 shrink-0 text-[#5C5A55]" />
                  <span>{row.mobile}</span>
                </a>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
                <div className="rounded-lg bg-[#F5F4F0] py-2">
                  <div className="text-lg font-bold">{schoolCount}</div>
                  <div className="text-[10px] font-semibold uppercase text-[#5C5A55]">{t("admin.pages.accountManagers.cardSchools")}</div>
                </div>
                <div className="rounded-lg bg-[#F5F4F0] py-2">
                  <div className="text-lg font-bold">{row.openRfqs}</div>
                  <div className="text-[10px] font-semibold uppercase text-[#5C5A55]">{t("admin.pages.accountManagers.cardRfqPipeline")}</div>
                </div>
                <div className="rounded-lg bg-[#FDEBD0] py-2">
                  <div className="text-lg font-bold text-[#7D4E10]">{pipeShort}</div>
                  <div className="text-[10px] font-semibold uppercase text-[#7D4E10]">{t("admin.pages.accountManagers.cardPipe")}</div>
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-2 border-t border-[#E2E0D9] pt-4">
                <Link to={`/admin/assignments?am=${encodeURIComponent(row.id)}`} className="w-full">
                  <Button type="button" variant="secondary" size="sm" className="w-full border-[#DDD9D2]">
                    {t("admin.pages.accountManagers.viewSchools")}
                  </Button>
                </Link>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="w-full border-[#DDD9D2]"
                  onClick={() => openAssignSchools(row)}
                >
                  {t("admin.pages.accountManagers.assignSchools")}
                </Button>
                <Button type="button" size="sm" className="w-full bg-[#0A3D62] text-white hover:bg-[#071E36]" onClick={() => openEdit(row)}>
                  {t("common.edit")}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#E2E0D9] bg-white">
        <div className="border-b border-[#E2E0D9] bg-[#F5F4F0] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#5C5A55]">
          {t("admin.pages.accountManagers.tableView")}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left text-[13.5px]">
            <thead className="border-b border-[#E2E0D9] text-[11px] font-semibold uppercase tracking-wide text-[#5C5A55]">
              <tr>
                <th className="px-4 py-3">{t("admin.pages.accountManagers.colName")}</th>
                <th className="px-4 py-3">{t("admin.pages.accountManagers.colRegion")}</th>
                <th className="px-4 py-3">{t("admin.pages.accountManagers.colEmail")}</th>
                <th className="px-4 py-3">{t("admin.pages.accountManagers.colPhone")}</th>
                <th className="px-4 py-3">{t("admin.pages.accountManagers.colSchools")}</th>
                <th className="px-4 py-3">{t("admin.pages.accountManagers.colRfqs")}</th>
                <th className="px-4 py-3">{t("admin.pages.accountManagers.colPipeline")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E0D9]">
              {managers.map((row) => (
                <tr key={row.id} className="hover:bg-[#FAFAF8]">
                  <td className="px-4 py-3 font-semibold">{row.name}</td>
                  <td className="px-4 py-3">{row.region}</td>
                  <td className="px-4 py-3">
                    <a href={`mailto:${row.email}`} className="text-[#0A3D62] hover:underline">
                      {row.email}
                    </a>
                  </td>
                  <td className="px-4 py-3">{row.mobile}</td>
                  <td className="px-4 py-3">{row.assignedSchoolIds.length}</td>
                  <td className="px-4 py-3">{row.openRfqs}</td>
                  <td className="px-4 py-3 font-medium text-[#1E8449]">{row.pipelineAed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AdminModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title={t("admin.pages.accountManagers.modalAddTitle")}
        wide
        footer={
          <div className="flex flex-wrap justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setAddOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="button" className="bg-[#0A3D62] text-white hover:bg-[#071E36]" onClick={submitAdd}>
              {t("admin.pages.accountManagers.saveAm")}
            </Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className={lbl}>{t("admin.pages.accountManagers.amName")} *</label>
            <Input className={inp} value={addDraft.name} onChange={(e) => setAddDraft((d) => ({ ...d, name: e.target.value }))} />
          </div>
          <div>
            <label className={lbl}>{t("admin.pages.accountManagers.amTitle")}</label>
            <Input
              className={inp}
              placeholder={t("admin.pages.accountManagers.amTitlePh")}
              value={addDraft.title}
              onChange={(e) => setAddDraft((d) => ({ ...d, title: e.target.value }))}
            />
          </div>
        </div>
        <div className="mt-3">
          <label className={lbl}>{t("auth.email")} *</label>
          <Input type="email" className={inp} value={addDraft.email} onChange={(e) => setAddDraft((d) => ({ ...d, email: e.target.value }))} />
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className={lbl}>{t("admin.pages.accountManagers.amMobile")} *</label>
            <Input className={inp} placeholder="+971 …" value={addDraft.mobile} onChange={(e) => setAddDraft((d) => ({ ...d, mobile: e.target.value }))} />
          </div>
          <div>
            <label className={lbl}>{t("admin.pages.accountManagers.amTerritory")} *</label>
            <select
              className={inp}
              value={addDraft.territory}
              onChange={(e) => setAddDraft((d) => ({ ...d, territory: e.target.value as AccountManagerTerritory }))}
            >
              <option value="UAE">{t("admin.pages.accountManagers.territoryUae")}</option>
              <option value="SA">{t("admin.pages.accountManagers.territorySa")}</option>
              <option value="BOTH">{t("admin.pages.accountManagers.territoryBoth")}</option>
            </select>
          </div>
        </div>
        <div className="mt-3">
          <label className={lbl}>{t("admin.pages.accountManagers.amRegion")}</label>
          <Input
            className={inp}
            placeholder={t("admin.pages.accountManagers.amRegionPh")}
            value={addDraft.region}
            onChange={(e) => setAddDraft((d) => ({ ...d, region: e.target.value }))}
          />
        </div>
        <div className="mt-4">
          <div className={lbl}>{t("admin.pages.accountManagers.visibleLabel")}</div>
          <div className="mt-2 flex flex-wrap gap-4">
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="radio"
                checked={addDraft.visibleToSchools}
                onChange={() => setAddDraft((d) => ({ ...d, visibleToSchools: true }))}
              />
              {t("admin.pages.accountManagers.visibleYes")}
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="radio"
                checked={!addDraft.visibleToSchools}
                onChange={() => setAddDraft((d) => ({ ...d, visibleToSchools: false }))}
              />
              {t("admin.pages.accountManagers.visibleNo")}
            </label>
          </div>
        </div>
      </AdminModal>

      <AdminModal
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setEditingId(null);
        }}
        title={t("admin.pages.accountManagers.modalEditTitleName", { name: editingRow?.name ?? "" })}
        wide
        footer={
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => { setEditOpen(false); setEditingId(null); }}>
              {t("common.cancel")}
            </Button>
            <Button type="button" variant="danger" onClick={deactivateEditing}>
              {t("admin.pages.accountManagers.deactivate")}
            </Button>
            <Button type="button" className="bg-[#0A3D62] text-white hover:bg-[#071E36]" onClick={submitEdit}>
              {t("common.save")}
            </Button>
          </div>
        }
      >
        {editingRow ? (
          <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className={lbl}>{t("admin.pages.accountManagers.amName")} *</label>
                <Input className={inp} value={editDraft.name} onChange={(e) => setEditDraft((d) => ({ ...d, name: e.target.value }))} />
              </div>
              <div>
                <label className={lbl}>{t("admin.pages.accountManagers.amTitle")}</label>
                <Input className={inp} value={editDraft.title} onChange={(e) => setEditDraft((d) => ({ ...d, title: e.target.value }))} />
              </div>
            </div>
            <div className="mt-3">
              <label className={lbl}>{t("auth.email")} *</label>
              <Input type="email" className={inp} value={editDraft.email} onChange={(e) => setEditDraft((d) => ({ ...d, email: e.target.value }))} />
            </div>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className={lbl}>{t("admin.pages.accountManagers.amMobile")} *</label>
                <Input className={inp} value={editDraft.mobile} onChange={(e) => setEditDraft((d) => ({ ...d, mobile: e.target.value }))} />
              </div>
              <div>
                <label className={lbl}>{t("admin.pages.accountManagers.amTerritory")} *</label>
                <select
                  className={inp}
                  value={editDraft.territory}
                  onChange={(e) => setEditDraft((d) => ({ ...d, territory: e.target.value as AccountManagerTerritory }))}
                >
                  <option value="UAE">{t("admin.pages.accountManagers.territoryUae")}</option>
                  <option value="SA">{t("admin.pages.accountManagers.territorySa")}</option>
                  <option value="BOTH">{t("admin.pages.accountManagers.territoryBoth")}</option>
                </select>
              </div>
            </div>
            <div className="mt-3">
              <label className={lbl}>{t("admin.pages.accountManagers.amRegion")}</label>
              <Input className={inp} value={editDraft.region} onChange={(e) => setEditDraft((d) => ({ ...d, region: e.target.value }))} />
            </div>
            <div className="mt-4 rounded-xl border border-[#E2E0D9] bg-[#FAFAF8] p-3 text-[12.5px] text-[#5C5A55]">
              <div className="flex justify-between border-b border-[#E2E0D9] py-1">
                <span>{t("admin.pages.accountManagers.summarySchools")}</span>
                <span className="font-semibold text-[#1A1917]">{editingRow.assignedSchoolIds.length}</span>
              </div>
              <div className="flex justify-between border-b border-[#E2E0D9] py-1">
                <span>{t("admin.pages.accountManagers.summaryRfqs")}</span>
                <span className="font-semibold text-[#1A1917]">{editingRow.openRfqs}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>{t("admin.pages.accountManagers.summaryPipeline")}</span>
                <span className="font-semibold text-emerald-700">{editingRow.pipelineAed}</span>
              </div>
            </div>
            <div className="mt-4">
              <div className={lbl}>{t("admin.pages.accountManagers.visibleLabel")}</div>
              <div className="mt-2 flex flex-wrap gap-4">
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="radio"
                    checked={editDraft.visibleToSchools}
                    onChange={() => setEditDraft((d) => ({ ...d, visibleToSchools: true }))}
                  />
                  {t("admin.pages.accountManagers.visibleYes")}
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="radio"
                    checked={!editDraft.visibleToSchools}
                    onChange={() => setEditDraft((d) => ({ ...d, visibleToSchools: false }))}
                  />
                  {t("admin.pages.accountManagers.visibleNo")}
                </label>
              </div>
            </div>
          </>
        ) : (
          <p className="text-sm text-[#5C5A55]">{t("common.loading")}</p>
        )}
      </AdminModal>

      <AdminModal
        open={assignOpen}
        onClose={closeAssign}
        title={t("admin.pages.accountManagers.assignSchoolsTitle", { name: assignAm?.name ?? "" })}
        wide
        footer={
          <div className="flex flex-wrap justify-end gap-2">
            <Button type="button" variant="ghost" onClick={closeAssign}>
              {t("common.cancel")}
            </Button>
            <Button type="button" className="bg-[#0A3D62] text-white hover:bg-[#071E36]" onClick={saveAssignSchools}>
              {t("admin.pages.accountManagers.assignSchoolsSave")}
            </Button>
          </div>
        }
      >
        <p className="text-sm text-[#5C5A55]">{t("admin.pages.accountManagers.assignSchoolsHint")}</p>
        <div className="mt-3">
          <label className={lbl}>{t("admin.pages.accountManagers.assignFilterSchools")}</label>
          <Input className={inp} value={assignFilter} onChange={(e) => setAssignFilter(e.target.value)} />
        </div>
        <div className="mt-3 max-h-[min(50vh,320px)] overflow-y-auto rounded-xl border border-[#E2E0D9] bg-white p-2">
          <div className="flex flex-col gap-1">
            {filteredPortfolioSchools.map((s) => (
              <label
                key={s.id}
                className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 hover:bg-[#F5F4F0]"
              >
                <input type="checkbox" checked={assignSelected.has(s.id)} onChange={() => toggleSchoolInAssign(s.id)} />
                <span className="text-[13px]">
                  <span className="font-medium text-[#1A1917]">{s.name}</span>
                  <span className="text-[#5C5A55]"> · {s.country}</span>
                </span>
              </label>
            ))}
          </div>
        </div>
        <div className="mt-3 text-xs text-[#5C5A55]">
          {t("admin.pages.accountManagers.assignSelectedCount", { n: assignSelected.size })}
        </div>
        <div className="mt-3">
          <label className={lbl}>{t("admin.pages.accountManagers.assignNotes")}</label>
          <textarea className={`${inp} min-h-[72px]`} value={assignNotes} onChange={(e) => setAssignNotes(e.target.value)} placeholder={t("admin.pages.accountManagers.assignNotesPh")} />
        </div>
      </AdminModal>
    </div>
  );
}
