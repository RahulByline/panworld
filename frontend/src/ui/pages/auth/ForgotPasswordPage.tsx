import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { api } from "../../../services/api";

const Schema = z.object({ email: z.string().email() });
type FormValues = z.infer<typeof Schema>;

export function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [sent, setSent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: { email: "teacher@panworld-demo.com" },
  });

  async function onSubmit(values: FormValues) {
    setError(null);
    setSent(null);
    try {
      const res = await api.post("/auth/forgot-password", values);
      setSent(res.data.data.mockToken ?? "sent");
    } catch (e: any) {
      setError(e?.response?.data?.error?.message ?? "Request failed");
    }
  }

  return (
    <div>
      <div className="text-lg font-semibold">{t("auth.forgotPassword")}</div>
      <div className="mt-1 text-sm text-slate-600">We generate a reset token and send it by email/WhatsApp.</div>

      {sent ? (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Reset token generated: <span className="font-mono">{sent}</span>
          <div className="mt-2">
            <Link className="font-medium underline" to={`/reset-password?token=${encodeURIComponent(sent)}`}>
              Continue to reset
            </Link>
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</div>
      ) : null}

      <form className="mt-6 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div>
          <label className="text-xs font-medium text-slate-600">{t("auth.email")}</label>
          <div className="mt-1">
            <Input type="email" autoComplete="email" {...form.register("email")} />
          </div>
        </div>
        <Button type="submit" className="w-full">
          {t("auth.sendReset")}
        </Button>
      </form>

      <div className="mt-6 text-sm">
        <Link className="font-medium text-slate-900 hover:underline" to="/login">
          {t("auth.backToLogin")}
        </Link>
      </div>
    </div>
  );
}

