import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AdminPageHeader } from "../../admin/components/AdminPageHeader";
import { Button } from "../../components/Button";
import { catalogueByTab, type CatalogueTab } from "../../../data/admin/catalogue";
import { cn } from "../../utils/cn";

export function AdminCmsCataloguePage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<CatalogueTab>("textbooks");

  return (
    <div className="font-sans">
      <AdminPageHeader
        title={t("admin.pages.catalogue.title")}
        subtitle={t("admin.pages.catalogue.subtitle")}
        actions={
          <Button type="button" className="bg-[#0A3D62] hover:bg-[#071E36]">
            {t("admin.pages.catalogue.addProduct")}
          </Button>
        }
      />

      <div className="mb-4 flex w-fit gap-1 rounded-lg border border-[#E2E0D9] bg-[#F5F4F0] p-1">
        {(
          [
            ["textbooks", t("admin.pages.catalogue.tabTextbooks")],
            ["library", t("admin.pages.catalogue.tabLibrary")],
            ["kits", t("admin.pages.catalogue.tabKits")],
          ] as const
        ).map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => setTab(k)}
            className={cn(
              "rounded-md px-4 py-2 text-sm font-medium transition-colors",
              tab === k ? "bg-white text-[#0A3D62] shadow-sm" : "text-[#5C5A55] hover:text-[#1A1917]",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#E2E0D9] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] border-collapse text-left text-[13.5px]">
            <thead className="border-b border-[#E2E0D9] bg-[#F5F4F0] text-[11px] font-semibold uppercase tracking-wide text-[#5C5A55]">
              <tr>
                <th className="px-4 py-3">{t("admin.pages.catalogue.colProduct")}</th>
                <th className="px-4 py-3">{t("admin.pages.catalogue.colPublisher")}</th>
                <th className="px-4 py-3">{t("admin.pages.catalogue.colGrades")}</th>
                <th className="px-4 py-3">{t("admin.pages.catalogue.colFormat")}</th>
                <th className="px-4 py-3">{t("admin.pages.catalogue.colPrice")}</th>
                <th className="px-4 py-3">{t("admin.pages.catalogue.colBadges")}</th>
                <th className="px-4 py-3">{t("common.status")}</th>
                <th className="px-4 py-3 text-right">{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E0D9]">
              {catalogueByTab[tab].map((p) => (
                <tr key={p.id} className="hover:bg-[#FAFAF8]">
                  <td className="px-4 py-3 font-semibold">{p.name}</td>
                  <td className="px-4 py-3">{p.publisher}</td>
                  <td className="px-4 py-3">{p.grades}</td>
                  <td className="px-4 py-3">{p.format}</td>
                  <td className="px-4 py-3">{p.price}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {p.badges.map((b) => (
                        <span
                          key={b}
                          className="rounded-full bg-[#FDEBD0] px-2 py-0.5 text-[10px] font-medium text-[#7D4E10]"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium text-[#1E8449]">{p.status}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button type="button" variant="secondary" size="sm">
                      {t("common.edit")}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
