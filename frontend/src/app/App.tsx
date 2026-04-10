import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AppRoutes } from "../routes/AppRoutes";
import { useAuthStore } from "../store/auth.store";

export function App() {
  const bootstrap = useAuthStore((s) => s.bootstrap);
  const bootstrapped = useAuthStore((s) => s.bootstrapped);
  const user = useAuthStore((s) => s.user);
  const { i18n } = useTranslation();

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  useEffect(() => {
    if (user?.preferredLang && user.preferredLang !== i18n.language) void i18n.changeLanguage(user.preferredLang);
  }, [i18n, user?.preferredLang]);

  if (!bootstrapped) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
          <div className="text-sm text-slate-600">Loading portal…</div>
        </div>
      </div>
    );
  }

  return <AppRoutes />;
}

