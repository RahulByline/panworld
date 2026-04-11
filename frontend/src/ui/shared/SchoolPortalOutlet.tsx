import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";

/** School partner routes — account managers use the sales portal instead. */
export function SchoolPortalOutlet() {
  const user = useAuthStore((s) => s.user);
  if (user?.role === "SALES_ADMIN") {
    return <Navigate to="/app" replace />;
  }
  return <Outlet />;
}
