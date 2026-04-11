import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AdminPageHeader } from "../../admin/components/AdminPageHeader";
import { Button } from "../../components/Button";
import { AdminModal } from "../../admin/components/AdminModal";
import { useAdminToast } from "../../admin/hooks/useAdminToast";

const CHANNELS = [
  { titleKey: "admin.pages.odoo.ch1t", subKey: "admin.pages.odoo.ch1s", ok: true },
  { titleKey: "admin.pages.odoo.ch2t", subKey: "admin.pages.odoo.ch2s", ok: true },
  { titleKey: "admin.pages.odoo.ch3t", subKey: "admin.pages.odoo.ch3s", ok: true },
  { titleKey: "admin.pages.odoo.ch4t", subKey: "admin.pages.odoo.ch4s", ok: true },
  { titleKey: "admin.pages.odoo.ch5t", subKey: "admin.pages.odoo.ch5s", ok: false },
  { titleKey: "admin.pages.odoo.ch6t", subKey: "admin.pages.odoo.ch6s", ok: true },
] as const;

export function AdminOdooPage() {
  const { t } = useTranslation();
  const { show, Toast } = useAdminToast();
  const [cfgOpen, setCfgOpen] = useState(false);
  const inp = "w-full rounded-lg border border-[#E2E0D9] px-3 py-2 text-sm outline-none focus:border-[#0A3D62]";
  const lbl = "mb-1 block text-xs font-medium text-[#5C5A55]";

  return (
    <div className="font-sans">
      <Toast />
      <AdminPageHeader
        title={t("admin.pages.odoo.title")}
        subtitle={t("admin.pages.odoo.subtitle")}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={() => show(t("admin.pages.odoo.fullSync"))}>
              {t("admin.pages.odoo.forceSync")}
            </Button>
            <Button type="button" className="bg-[#0A3D62] text-white hover:bg-[#071E36]" size="sm" onClick={() => setCfgOpen(true)}>
              {t("admin.pages.odoo.configure")}
            </Button>
          </div>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label={t("admin.pages.odoo.apiStatus")} value={t("admin.pages.odoo.online")} tone="ok" sub="Ping: 42ms" />
        <Stat label={t("admin.pages.odoo.lastSync")} value="9:38 AM" tone="neutral" sub={t("admin.pages.odoo.todayAuto")} />
        <Stat label={t("admin.pages.odoo.syncErrors")} value="1" tone="bad" sub="ORD-1130 — KSA VAT" />
        <Stat label={t("admin.pages.odoo.records")} value="8,421" tone="neutral" sub={t("admin.pages.odoo.last30")} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#E2E0D9] bg-white p-5">
          <div className="mb-4 text-sm font-semibold">{t("admin.pages.odoo.channels")}</div>
          <div className="flex flex-col gap-2">
            {CHANNELS.map((c) => (
              <div
                key={c.titleKey}
                className={`flex items-center justify-between rounded-xl border px-3 py-2.5 text-sm ${
                  c.ok ? "border-[#E2E0D9] bg-[#F5F4F0]" : "border-rose-200 bg-rose-50"
                }`}
              >
                <div>
                  <div className="font-semibold">{t(c.titleKey)}</div>
                  <div className="text-xs text-[#5C5A55]">{t(c.subKey)}</div>
                </div>
                {c.ok ? (
                  <span className="rounded-full bg-[#D5F0E8] px-2 py-0.5 text-[11px] font-semibold text-[#0D7A5F]">{t("admin.pages.odoo.live")}</span>
                ) : (
                  <Button type="button" variant="danger" size="sm" onClick={() => show(t("admin.pages.odoo.retrying"))}>
                    {t("admin.pages.odoo.retry")}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#E2E0D9] bg-white p-5">
          <div className="mb-4 text-sm font-semibold">{t("admin.pages.odoo.recentLog")}</div>
          <ul className="space-y-3 text-sm">
            <LogLine ok time="9:38 AM" msg={t("admin.pages.odoo.log1")} />
            <LogLine ok time="9:38 AM" msg={t("admin.pages.odoo.log2")} />
            <LogLine ok={false} time="9:35 AM" msg={t("admin.pages.odoo.log3")} />
            <LogLine ok time="9:30 AM" msg={t("admin.pages.odoo.log4")} />
          </ul>
        </div>
      </div>

      <AdminModal
        open={cfgOpen}
        onClose={() => setCfgOpen(false)}
        title={t("admin.pages.odoo.cfgTitle")}
        footer={
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setCfgOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button
              type="button"
              className="bg-[#0A3D62] text-white hover:bg-[#071E36]"
              onClick={() => {
                show(t("admin.pages.odoo.cfgSaved"));
                setCfgOpen(false);
              }}
            >
              {t("common.save")}
            </Button>
          </div>
        }
      >
        <div>
          <label className={lbl}>{t("admin.pages.odoo.cfgUrl")}</label>
          <input className={inp} placeholder="https://odoo.example.com" />
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className={lbl}>{t("admin.pages.odoo.cfgDb")}</label>
            <input className={inp} />
          </div>
          <div>
            <label className={lbl}>{t("admin.pages.odoo.cfgKey")}</label>
            <input className={inp} type="password" />
          </div>
        </div>
      </AdminModal>
    </div>
  );
}

function Stat({ label, value, sub, tone }: { label: string; value: string; sub: string; tone: "ok" | "bad" | "neutral" }) {
  const border = tone === "ok" ? "border-l-4 border-l-[#0D7A5F]" : tone === "bad" ? "border-l-4 border-l-[#BE3A3A]" : "border-l-4 border-l-transparent";
  const valCls = tone === "ok" ? "text-[#0D7A5F]" : tone === "bad" ? "text-[#BE3A3A]" : "text-[#0A3D62]";
  return (
    <div className={`rounded-2xl border border-[#E2E0D9] bg-white p-4 ${border}`}>
      <div className="text-[11px] font-semibold uppercase tracking-wide text-[#5C5A55]">{label}</div>
      <div className={`mt-1 text-2xl font-bold ${valCls}`}>{value}</div>
      <div className="mt-1 text-xs text-[#5C5A55]">{sub}</div>
    </div>
  );
}

function LogLine({ ok, time, msg }: { ok: boolean; time: string; msg: string }) {
  return (
    <li className="flex gap-3">
      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${ok ? "bg-[#0D7A5F]" : "bg-[#BE3A3A]"}`} />
      <div>
        <div className="text-xs text-[#5C5A55]">{time}</div>
        <div>{msg}</div>
      </div>
    </li>
  );
}
