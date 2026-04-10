import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { api } from "../../../services/api";

const Schema = z.object({
  token: z.string().min(8),
  newPassword: z.string().min(6),
});
type FormValues = z.infer<typeof Schema>;

export function ResetPasswordPage() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const tokenFromUrl = useMemo(() => params.get("token") ?? "", [params]);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: { token: tokenFromUrl, newPassword: "Panworld@123" },
  });

  async function onSubmit(values: FormValues) {
    setError(null);
    try {
      await api.post("/auth/reset-password", values);
      setDone(true);
    } catch (e: any) {
      setError(e?.response?.data?.error?.message ?? "Reset failed");
    }
  }

  return (
    <div>
      <div className="text-lg font-semibold">{t("auth.resetPassword")}</div>
      <div className="mt-1 text-sm text-slate-600">Mock reset updates the seeded user password in the local database.</div>

      {done ? (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Password updated. You can now login.
          <div className="mt-2">
            <Link className="font-medium underline" to="/login">
              {t("auth.backToLogin")}
            </Link>
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</div>
      ) : null}

      <form className="mt-6 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div>
          <label className="text-xs font-medium text-slate-600">Token</label>
          <div className="mt-1">
            <Input type="text" {...form.register("token")} />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">{t("auth.newPassword")}</label>
          <div className="mt-1">
            <Input type="password" {...form.register("newPassword")} />
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={done}>
          {t("auth.resetPassword")}
        </Button>
      </form>
    </div>
  );
}

