import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const bootstrap = useAuthStore((s) => s.bootstrap);
  const location = useLocation();

  useEffect(() => {
    if (!user) void bootstrap();
  }, [bootstrap, user]);

  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return <>{children}</>;
}

