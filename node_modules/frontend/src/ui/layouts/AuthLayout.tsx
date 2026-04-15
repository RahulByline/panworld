import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LanguageToggle } from "../shared/LanguageToggle";

export function AuthLayout() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="relative min-h-screen">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-1/2 h-72 w-[56rem] -translate-x-1/2 rounded-full bg-slate-900/10 blur-3xl" />
          <div className="absolute -bottom-24 right-1/3 h-72 w-[56rem] translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
        </div>

        <div className="relative grid min-h-screen w-full grid-cols-1 md:grid-cols-2">
          <div className="flex flex-col justify-between px-4 py-6 md:px-14 md:py-12 xl:px-20">
            <div className="flex items-center justify-between gap-4">
              <div>
               <div className="mt-1 text-lg font-semibold text-slate-900">{t("app.name")}</div>
              </div>
              <LanguageToggle />
            </div>

            <div className="mt-10 md:mt-16">
              <div className="text-3xl font-semibold leading-tight text-slate-900 md:text-5xl">
              {t("app.title")}
              </div>
              <div className="mt-3 max-w-2xl text-sm text-slate-600">
              {t("app.description")}
              </div>

              <div className="mt-8 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  { k: "Role-based access", v: "Teacher, HOD, Management, CEO, Procurement, Admin, Publisher." },
                  { k: "Country-aware", v: "UAE/KSA VAT, NCC highlights, and localized experience." },
                  { k: "Operational workflows", v: "RFQs → approvals → orders → invoices with auditability." },
                  { k: "Enablement", v: "Training, resources, webinars, certificates, and support tickets." },
                ].map((x) => (
                  <div key={x.k} className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm backdrop-blur">
                    <div className="text-sm font-semibold text-slate-900">{x.k}</div>
                    <div className="mt-1 text-xs text-slate-600">{x.v}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 text-xs text-slate-500 md:mt-0">
              © {new Date().getFullYear()} Panworld • Secure access • MFA-ready (future)
            </div>
          </div>

          <div className="flex items-center justify-center px-4 py-6 md:pl-8 md:pr-14 md:py-12 xl:pl-10 xl:pr-20">
            <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:min-h-[620px] md:p-10">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

