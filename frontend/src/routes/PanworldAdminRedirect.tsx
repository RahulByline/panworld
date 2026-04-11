import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

/** School portal UI is for school-side roles; Panworld super-admin uses `/admin` only. */
export function PanworldAdminRedirect({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "PANWORLD_ADMIN") {
      navigate("/admin", { replace: true });
    }
  }, [user, navigate]);

  if (user?.role === "PANWORLD_ADMIN") {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-slate-500">Redirecting to admin…</div>
    );
  }

  return <>{children}</>;
}
