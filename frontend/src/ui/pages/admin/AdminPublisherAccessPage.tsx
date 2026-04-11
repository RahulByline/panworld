import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AdminPageHeader } from "../../admin/components/AdminPageHeader";
import { Button } from "../../components/Button";
import {
  PublisherAssignSchoolModal,
  PublisherCredentialAddModal,
  PublisherCredentialEditModal,
} from "../../admin/components/PublisherCredentialModals";
import { PublisherAccessCard } from "../../admin/components/PublisherAccessCard";
import { publisherAccessRows, type PublisherAccessRow } from "../../../data/admin/publisherAccess";
import { useAdminToast } from "../../admin/hooks/useAdminToast";

export function AdminPublisherAccessPage() {
  const { t } = useTranslation();
  const { show, Toast } = useAdminToast();
  const [addOpen, setAddOpen] = useState(false);
  const [editRow, setEditRow] = useState<PublisherAccessRow | null>(null);
  const [assignRow, setAssignRow] = useState<PublisherAccessRow | null>(null);

  return (
    <div className="font-sans">
      <Toast />
      <AdminPageHeader
        title={t("admin.pages.publisherAccess.title")}
        subtitle={t("admin.pages.publisherAccess.subtitle")}
        actions={
          <Button type="button" className="bg-[#0A3D62] hover:bg-[#071E36]" onClick={() => setAddOpen(true)}>
            {t("admin.pages.publisherAccess.add")}
          </Button>
        }
      />

      <PublisherCredentialAddModal open={addOpen} onClose={() => setAddOpen(false)} onSaved={show} />
      <PublisherCredentialEditModal open={!!editRow} onClose={() => setEditRow(null)} onSaved={show} row={editRow} />
      <PublisherAssignSchoolModal
        open={!!assignRow}
        onClose={() => setAssignRow(null)}
        credentialId={assignRow?.id ?? ""}
        productTitle={assignRow?.title ?? ""}
        onAssigned={show}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {publisherAccessRows.map((row) => (
          <PublisherAccessCard
            key={row.id}
            row={row}
            t={t}
            onVerify={() => show(t("admin.publisherAccessModal.testOk"))}
            onQueue={() => show(t("admin.publisherAccessModal.pendingToast", { n: row.pendingCount ?? 0 }))}
            onRenew={() => show(t("admin.publisherAccessModal.renewStarted"))}
            onEdit={() => setEditRow(row)}
            onAssignSchool={() => setAssignRow(row)}
          />
        ))}
      </div>
    </div>
  );
}
