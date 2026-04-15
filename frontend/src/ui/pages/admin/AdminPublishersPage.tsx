import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AdminPageHeader } from "../../admin/components/AdminPageHeader";
import { Button } from "../../components/Button";
import { PublisherPartnerListCard } from "../../admin/components/PublisherPartnerListCard";
import { PublisherPartnerDetailModal, PublisherPartnerFormModal } from "../../admin/components/PublisherPartnerModals";
import { publisherPartners, type PublisherPartnerRow } from "../../../data/admin/publishers";
import { useAdminToast } from "../../admin/hooks/useAdminToast";

export function AdminPublishersPage() {
  const { t } = useTranslation();
  const { show, Toast } = useAdminToast();
  const [rows, setRows] = useState<PublisherPartnerRow[]>(() => [...publisherPartners]);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | PublisherPartnerRow["status"]>("all");
  const [territoryFilter, setTerritoryFilter] = useState("all");
  const [schoolsFilter, setSchoolsFilter] = useState<"all" | "0" | "1-24" | "25+">("all");
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailRow, setDetailRow] = useState<PublisherPartnerRow | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formInitial, setFormInitial] = useState<PublisherPartnerRow | null>(null);

  const territoryOptions = useMemo(
    () =>
      Array.from(new Set(rows.map((r) => r.territory)))
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b)),
    [rows],
  );

  const filteredRows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter((row) => {
      if (needle) {
        const hay = [row.name, row.contact, row.territory, row.productsFocus ?? "", row.website ?? ""].join(" ").toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      if (statusFilter !== "all" && row.status !== statusFilter) return false;
      if (territoryFilter !== "all" && row.territory !== territoryFilter) return false;
      if (schoolsFilter === "0" && row.activeSchools !== 0) return false;
      if (schoolsFilter === "1-24" && !(row.activeSchools >= 1 && row.activeSchools <= 24)) return false;
      if (schoolsFilter === "25+" && row.activeSchools < 25) return false;
      return true;
    });
  }, [rows, q, statusFilter, territoryFilter, schoolsFilter]);

  function handleSavePublisher(row: PublisherPartnerRow) {
    setRows((prev) => {
      const idx = prev.findIndex((r) => r.id === row.id);
      if (idx === -1) return [...prev, row];
      const next = [...prev];
      next[idx] = row;
      return next;
    });
    setDetailRow((prev) => (prev?.id === row.id ? row : prev));
    show(t("admin.pages.publishers.savedToast"));
  }

  function openCreate() {
    setFormInitial(null);
    setFormOpen(true);
  }

  function openEdit(row: PublisherPartnerRow) {
    setFormInitial(row);
    setFormOpen(true);
  }

  function openDetail(row: PublisherPartnerRow) {
    setDetailRow(row);
    setDetailOpen(true);
  }

  function deletePublisher(row: PublisherPartnerRow) {
    const ok = window.confirm(t("admin.pages.publishers.deleteConfirm", { name: row.name }));
    if (!ok) return;
    setRows((prev) => prev.filter((r) => r.id !== row.id));
    setDetailRow((prev) => (prev?.id === row.id ? null : prev));
    setFormInitial((prev) => (prev?.id === row.id ? null : prev));
    if (detailRow?.id === row.id) setDetailOpen(false);
    show(t("admin.pages.publishers.deletedToast", { name: row.name }));
  }

  function closeDetail() {
    setDetailOpen(false);
    setDetailRow(null);
  }

  function editFromDetail() {
    if (!detailRow) return;
    const r = detailRow;
    setDetailOpen(false);
    setDetailRow(null);
    setFormInitial(r);
    setFormOpen(true);
  }

  return (
    <div className="font-sans">
      <Toast />
      <AdminPageHeader
        title={t("admin.pages.publishers.title")}
        subtitle={t("admin.pages.publishers.subtitle")}
        actions={
          <Button type="button" className="bg-[#0A3D62] hover:bg-[#071E36]" onClick={openCreate}>
            {t("admin.pages.publishers.add")}
          </Button>
        }
      />

      <p className="mb-3 text-[12px] text-[#5C5A55]">{t("admin.pages.publishers.tableHint")}</p>

      <div className="mb-4 flex flex-col gap-3 rounded-xl border border-[#E2E0D9] bg-white p-3 shadow-sm">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9A9890]" strokeWidth={2} aria-hidden />
          <input
            type="search"
            className="h-10 w-full rounded-lg border border-[#E2E0D9] bg-[#FAFAF8] py-2 pl-10 pr-3 text-sm text-[#1A1917] outline-none transition placeholder:text-[#9A9890] focus:border-[#0A3D62] focus:bg-white focus:ring-2 focus:ring-[#0A3D62]/12"
            placeholder={t("admin.pages.publishers.searchPlaceholder")}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label={t("admin.pages.publishers.searchPlaceholder")}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            className="min-w-0 flex-1 rounded-lg border border-[#E2E0D9] bg-[#FAFAF8] px-3 py-2 text-[13px] text-[#1A1917] shadow-sm outline-none transition hover:border-[#C4C2BC] focus:border-[#0A3D62] focus:ring-2 focus:ring-[#0A3D62]/15 sm:min-w-[170px]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | PublisherPartnerRow["status"])}
            aria-label={t("admin.pages.publishers.filterStatus")}
          >
            <option value="all">
              {t("admin.pages.publishers.filterStatus")}: {t("admin.pages.publishers.filterAll")}
            </option>
            <option value="Active">{t("admin.pages.publishers.statusActive")}</option>
            <option value="Onboarding">{t("admin.pages.publishers.statusOnboarding")}</option>
            <option value="Paused">{t("admin.pages.publishers.statusPaused")}</option>
          </select>
          <select
            className="min-w-0 flex-1 rounded-lg border border-[#E2E0D9] bg-[#FAFAF8] px-3 py-2 text-[13px] text-[#1A1917] shadow-sm outline-none transition hover:border-[#C4C2BC] focus:border-[#0A3D62] focus:ring-2 focus:ring-[#0A3D62]/15 sm:min-w-[170px]"
            value={territoryFilter}
            onChange={(e) => setTerritoryFilter(e.target.value)}
            aria-label={t("admin.pages.publishers.filterTerritory")}
          >
            <option value="all">
              {t("admin.pages.publishers.filterTerritory")}: {t("admin.pages.publishers.filterAll")}
            </option>
            {territoryOptions.map((terr) => (
              <option key={terr} value={terr}>
                {terr}
              </option>
            ))}
          </select>
          <select
            className="min-w-0 flex-1 rounded-lg border border-[#E2E0D9] bg-[#FAFAF8] px-3 py-2 text-[13px] text-[#1A1917] shadow-sm outline-none transition hover:border-[#C4C2BC] focus:border-[#0A3D62] focus:ring-2 focus:ring-[#0A3D62]/15 sm:min-w-[170px]"
            value={schoolsFilter}
            onChange={(e) => setSchoolsFilter(e.target.value as "all" | "0" | "1-24" | "25+")}
            aria-label={t("admin.pages.publishers.filterSchools")}
          >
            <option value="all">
              {t("admin.pages.publishers.filterSchools")}: {t("admin.pages.publishers.filterAll")}
            </option>
            <option value="0">{t("admin.pages.publishers.filterSchools0")}</option>
            <option value="1-24">{t("admin.pages.publishers.filterSchools1to24")}</option>
            <option value="25+">{t("admin.pages.publishers.filterSchools25Plus")}</option>
          </select>
        </div>
        <p className="text-[12px] text-[#5C5A55]">
          {t("admin.pages.publishers.resultsCount", { shown: filteredRows.length, total: rows.length })}
        </p>
      </div>

      {filteredRows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#E2E0D9] bg-[#FAFAF8] py-16 text-center text-sm text-[#5C5A55]">
          {t("admin.pages.publishers.noResults")}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredRows.map((row) => (
            <PublisherPartnerListCard
              key={row.id}
              row={row}
              t={t}
              onOpenDetail={() => openDetail(row)}
              onEdit={() => openEdit(row)}
              onDelete={() => deletePublisher(row)}
            />
          ))}
        </div>
      )}

      <PublisherPartnerFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        initial={formInitial}
        onSave={handleSavePublisher}
        t={t}
      />
      <PublisherPartnerDetailModal
        open={detailOpen}
        onClose={closeDetail}
        row={detailRow}
        onEdit={editFromDetail}
        t={t}
      />
    </div>
  );
}
