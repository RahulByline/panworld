import { Navigate } from "react-router-dom";
import type { UserRole } from "../types/domain";
import { useAuthStore } from "../store/auth.store";

export function RequireRole({ roles, children }: { roles: UserRole[]; children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/app" replace />;
  }
  return <>{children}</>;
}
