import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown } from "lucide-react";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Card } from "../../components/Card";
import { useAuthStore } from "../../../store/auth.store";
import { demoAccounts, DEMO_PASSWORD } from "../../../mock/accounts";

const Schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  rememberMe: z.boolean().optional(),
});
type FormValues = z.infer<typeof Schema>;

export function LoginPage() {
  const { t } = useTranslation();
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  const redirectTo = useMemo(() => {
    const state = location.state as { from?: { pathname?: string } } | undefined;
    const from = state?.from?.pathname;
    if (from?.startsWith("/admin")) return from;
    if (from?.startsWith("/app")) return from;
    return "/app";
  }, [location.state]);

  const form = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: { email: "admin@panworld-demo.com", password: DEMO_PASSWORD, rememberMe: true },
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    setError(null);
    try {
      await login(values.email, values.password, values.rememberMe);
      const u = useAuthStore.getState().user;
      if (u?.role === "PANWORLD_ADMIN") {
        const state = location.state as { from?: { pathname?: string } } | undefined;
        const from = state?.from?.pathname;
        navigate(from?.startsWith("/admin") ? from : "/admin", { replace: true });
      } else {
        navigate(redirectTo, { replace: true });
      }
    } catch (e: any) {
      setError(e?.message ?? "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  const shortcuts = demoAccounts.map((a) => ({ label: a.label, email: a.email }));

  return (
    <div className="flex h-full flex-col">
      <div className="flex justify-center">
        <img src="/src/assets/logo.png" alt="Panworld Education" className="h-9 w-auto" />
      </div>

      <div className="mt-6 text-center">
        <div className="text-2xl font-semibold text-slate-900">Welcome back</div>
        <div className="mt-1 text-sm text-slate-600">Sign in to continue.</div>
      </div>

      {error ? (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {error}
        </div>
      ) : null}

      <form className="mt-6 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-600">{t("auth.email")}</label>
          <Input type="email" autoComplete="email" {...form.register("email")} />
          {form.formState.errors.email ? (
            <div className="mt-1 text-xs text-rose-600">{form.formState.errors.email.message}</div>
          ) : null}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-600">{t("auth.password")}</label>
          <Input type="password" autoComplete="current-password" {...form.register("password")} />
          {form.formState.errors.password ? (
            <div className="mt-1 text-xs text-rose-600">{form.formState.errors.password.message}</div>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" className="h-4 w-4 rounded border-slate-300" {...form.register("rememberMe")} />
            {t("auth.rememberMe")}
          </label>
          <Link className="text-sm font-medium text-slate-900 hover:underline" to="/forgot-password">
            {t("auth.forgotPassword")}
          </Link>
        </div>

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Signing in…" : t("auth.continue")}
        </Button>
     </form>

      <div className="mt-6 flex-1" />

      <details
        className="rounded-2xl border border-slate-200 bg-slate-50/40 p-4"
        open={shortcutsOpen}
        onToggle={(e) => setShortcutsOpen((e.currentTarget as HTMLDetailsElement).open)}
      >
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t("auth.demoShortcuts")}</div>
            <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-700">{shortcuts.length}</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
            {shortcutsOpen ? "Hide" : "Show"}
            <ChevronDown className={"h-4 w-4 transition " + (shortcutsOpen ? "rotate-180" : "")} />
          </div>
        </summary>

        <div className="mt-4 h-px bg-slate-200/70" />

        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {shortcuts.map((s) => (
            <Card key={s.email} className="p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-slate-900">{s.label}</div>
                  <div className="truncate text-xs text-slate-600">{s.email}</div>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    form.setValue("email", s.email);
                    form.setValue("password", DEMO_PASSWORD);
                  }}
                >
                  Use
                </Button>
              </div>
            </Card>
          ))}
        </div>
        <div className="mt-3 text-xs text-slate-500">
          Password for all demo accounts: <span className="font-semibold text-slate-700">{DEMO_PASSWORD}</span>
        </div>
      </details>
    </div>
  );
}

