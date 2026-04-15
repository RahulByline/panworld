import { useAuthStore } from "../../../store/auth.store";
import { DashboardPage } from "./DashboardPage";
import { SalesDashboardPage } from "../sales-dashboard";

/** `/app` home — sales AM dashboard vs school portal dashboard. */
export function PortalIndexPage() {
  const user = useAuthStore((s) => s.user);
  if (user?.role === "SALES_ADMIN") {
    return <SalesDashboardPage />;
  }
  return <DashboardPage />;
}
