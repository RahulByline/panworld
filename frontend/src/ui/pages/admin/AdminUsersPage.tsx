import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router-dom";
import { AdminPageHeader } from "../../admin/components/AdminPageHeader";
import { Button } from "../../components/Button";
import { AdminModal } from "../../admin/components/AdminModal";
import { RoleAccessMatrix } from "../../admin/components/RoleAccessMatrix";
import { directoryUserTabCounts, directoryUsers, type DirectoryUserRole } from "../../../data/admin/directoryUsers";
import { useAdminToast } from "../../admin/hooks/useAdminToast";
import { cn } from "../../utils/cn";

const TABS: (DirectoryUserRole | "all")[] = [
  "all",
  "Teacher",
  "HOD",
  "School Admin",
  "School CEO",
  "Procurement",
  "Sales (AM)",
  "Panworld Admin",
  "Publisher Login",
];

const CREATE_ROLE_OPTIONS: DirectoryUserRole[] = [
  "Teacher",
  "HOD",
  "School Admin",
  "School CEO",
  "Procurement",
  "Panworld Admin",
  "Publisher Login",
];

export function AdminUsersPage() {
  const { t } = useTranslation();
  const { show, Toast } = useAdminToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const mainTab = searchParams.get("view") === "access" ? "access" : "directory";

  const [tab, setTab] = useState<(typeof TABS)[number]>("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [provisionMode, setProvisionMode] = useState<"direct" | "request">("direct");

  const rows = useMemo(() => {
    if (tab === "all") return directoryUsers;
    return directoryUsers.filter((u) => u.role === tab);
  }, [tab]);

  const inp = "w-full rounded-lg border border-[#E2E0D9] px-3 py-2 text-sm outline-none focus:border-[#0A3D62]";
  const lbl = "mb-1 block text-xs font-medium text-[#5C5A55]";

  function setMainTab(next: "directory" | "access") {
    setSearchParams(
      (prev) => {
        const n = new URLSearchParams(prev);
        if (next === "directory") n.delete("view");
        else n.set("view", "access");
        return n;
      },
      { replace: true },
    );
  }

  return (
    <div className="font-sans">
      <Toast />
      <AdminPageHeader
        title={t("admin.pages.users.title")}
        subtitle={mainTab === "access" ? t("admin.pages.users.subtitleAccess") : t("admin.pages.users.subtitle")}
        actions={
          mainTab === "directory" ? (
            <Button type="button" className="bg-[#0A3D62] text-white hover:bg-[#071E36]" onClick={() => setCreateOpen(true)}>
              {t("admin.pages.users.create")}
            </Button>
          ) : null
        }
      />

      <div className="mb-4 flex flex-wrap gap-2 border-b border-[#E2E0D9] pb-4">
        <button
          type="button"
          onClick={() => setMainTab("directory")}
          className={cn(
            "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
            mainTab === "directory" ? "border-[#0A3D62] bg-[#0A3D62] text-white" : "border-[#E2E0D9] bg-white text-[#5C5A55] hover:bg-[#F5F4F0]",
          )}
        >
          {t("admin.pages.users.mainTabDirectory")}
        </button>
        <button
          type="button"
          onClick={() => setMainTab("access")}
          className={cn(
            "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
            mainTab === "access" ? "border-[#0A3D62] bg-[#0A3D62] text-white" : "border-[#E2E0D9] bg-white text-[#5C5A55] hover:bg-[#F5F4F0]",
          )}
        >
          {t("admin.pages.users.mainTabAccess")}
        </button>
      </div>

      {mainTab === "access" ? (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-[#5C5A55]">{t("admin.pages.users.accessIntro")}</p>
          <RoleAccessMatrix t={t} />
          <p className="text-sm text-[#5C5A55]">
            <Link to="/admin/assignments" className="font-medium text-[#0A3D62] underline">
              {t("admin.pages.users.accessLinkAssignments")}
            </Link>
            {" · "}
            <Link to="/admin/schools" className="font-medium text-[#0A3D62] underline">
              {t("admin.pages.users.accessLinkSchools")}
            </Link>
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4 flex flex-wrap gap-2">
            {TABS.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setTab(k)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  tab === k ? "border-[#0A3D62] bg-[#0A3D62] text-white" : "border-[#E2E0D9] bg-white text-[#5C5A55] hover:bg-[#F5F4F0]",
                )}
              >
                {k === "all" ? t("admin.pages.users.tabAll", { count: directoryUserTabCounts.all }) : `${k} (${directoryUserTabCounts[k]})`}
              </button>
            ))}
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#E2E0D9] bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left text-[13.5px]">
                <thead className="border-b border-[#E2E0D9] bg-[#F5F4F0] text-[11px] font-semibold uppercase tracking-wide text-[#5C5A55]">
                  <tr>
                    <th className="px-4 py-3">{t("admin.pages.users.colName")}</th>
                    <th className="px-4 py-3">{t("admin.pages.users.colEmail")}</th>
                    <th className="px-4 py-3">{t("admin.pages.users.colRole")}</th>
                    <th className="px-4 py-3">{t("admin.pages.users.colSchool")}</th>
                    <th className="px-4 py-3">{t("admin.pages.users.colLast")}</th>
                    <th className="px-4 py-3 text-right">{t("common.actions")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E0D9]">
                  {rows.map((u) => (
                    <tr key={u.id} className="hover:bg-[#FAFAF8]">
                      <td className="px-4 py-3 font-semibold">{u.name}</td>
                      <td className="px-4 py-3 text-[#5C5A55]">{u.email}</td>
                      <td className="px-4 py-3">{u.role}</td>
                      <td className="px-4 py-3">{u.school ?? "—"}</td>
                      <td className="px-4 py-3">{u.lastActive}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex flex-wrap justify-end gap-1">
                          <Button type="button" variant="secondary" size="sm" onClick={() => setEditOpen(true)}>
                            {t("common.edit")}
                          </Button>
                          <Button type="button" variant="ghost" size="sm" onClick={() => show(t("admin.pages.users.resetPw"))}>
                            {t("admin.pages.users.resetPwShort")}
                          </Button>
                          <Button type="button" variant="ghost" size="sm" onClick={() => show(t("admin.pages.users.deactivated"))}>
                            {t("admin.pages.users.deactivate")}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <AdminModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title={t("admin.pages.users.modalCreateTitle")}
        wide
        footer={
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setCreateOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button
              type="button"
              className="bg-[#0A3D62] text-white hover:bg-[#071E36]"
              onClick={() => {
                show(
                  provisionMode === "request"
                    ? t("admin.pages.users.createdRequest")
                    : t("admin.pages.users.created"),
                );
                setCreateOpen(false);
              }}
            >
              {provisionMode === "request" ? t("admin.pages.users.submitRequest") : t("admin.pages.users.submitCreate")}
            </Button>
          </div>
        }
      >
        <div className="rounded-xl border border-[#E8F0F7] bg-[#F7FAFC] px-3 py-2.5 text-[12px] leading-snug text-[#5C5A55]">
          {t("admin.pages.users.provisionPolicyHint")}
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className={lbl}>{t("admin.schools.adminFirst")} *</label>
            <input className={inp} />
          </div>
          <div>
            <label className={lbl}>{t("admin.schools.adminLast")} *</label>
            <input className={inp} />
          </div>
        </div>
        <div className="mt-3">
          <label className={lbl}>{t("auth.email")} *</label>
          <input className={inp} type="email" placeholder="user@school.ae" />
        </div>
        <div className="mt-3">
          <label className={lbl}>{t("admin.pages.users.whatsapp")}</label>
          <input className={inp} placeholder="+971 …" />
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className={lbl}>{t("admin.pages.users.assignRole")} *</label>
            <select className={inp}>
              {CREATE_ROLE_OPTIONS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={lbl}>{t("admin.pages.users.assignSchool")}</label>
            <select className={inp}>
              <option>Al Noor International</option>
              <option>GEMS Wellington</option>
              <option>King Faisal International</option>
              <option>— N/A —</option>
            </select>
          </div>
        </div>
        <div className="mt-3">
          <span className={lbl}>{t("admin.pages.users.provisionMode")}</span>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:gap-6">
            <label className="flex cursor-pointer items-start gap-2 text-sm">
              <input type="radio" name="prov-mode" className="mt-1" checked={provisionMode === "direct"} onChange={() => setProvisionMode("direct")} />
              <span>
                <span className="font-medium text-[#1A1917]">{t("admin.pages.users.provisionDirect")}</span>
                <span className="mt-0.5 block text-[12px] text-[#9A9890]">{t("admin.pages.users.provisionDirectHint")}</span>
              </span>
            </label>
            <label className="flex cursor-pointer items-start gap-2 text-sm">
              <input type="radio" name="prov-mode" className="mt-1" checked={provisionMode === "request"} onChange={() => setProvisionMode("request")} />
              <span>
                <span className="font-medium text-[#1A1917]">{t("admin.pages.users.provisionRequest")}</span>
                <span className="mt-0.5 block text-[12px] text-[#9A9890]">{t("admin.pages.users.provisionRequestHint")}</span>
              </span>
            </label>
          </div>
        </div>
        <div className="mt-3">
          <label className={lbl}>{t("admin.pages.users.assignAm")}</label>
          <select className={inp}>
            <option>Mohamed Hassan</option>
            <option>Rania Khalil</option>
            <option>Omar Hassan</option>
          </select>
        </div>
      </AdminModal>

      <AdminModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title={t("admin.pages.users.modalEditTitle")}
        footer={
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setEditOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button
              type="button"
              className="bg-[#0A3D62] text-white hover:bg-[#071E36]"
              onClick={() => {
                show(t("admin.pages.users.saved"));
                setEditOpen(false);
              }}
            >
              {t("common.save")}
            </Button>
          </div>
        }
      >
        <p className="text-sm text-[#5C5A55]">{t("admin.pages.users.editHint")}</p>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className={lbl}>{t("admin.schools.adminFirst")}</label>
            <input className={inp} defaultValue="Sarah" />
          </div>
          <div>
            <label className={lbl}>{t("admin.schools.adminLast")}</label>
            <input className={inp} defaultValue="Al-Mansoori" />
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
