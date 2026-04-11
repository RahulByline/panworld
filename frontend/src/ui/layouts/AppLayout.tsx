import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import { Sidebar } from "../shared/Sidebar";
import { SalesSidebar } from "../shared/SalesSidebar";
import { Topbar } from "../shared/Topbar";
import { SalesTopbar } from "../shared/SalesTopbar";
import { cn } from "../utils/cn";

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const isSales = user?.role === "SALES_ADMIN";

  return (
    <div
      className={cn(
        "min-h-screen",
        isSales ? "pw-app pw-sales-app bg-[#EEF2F5]" : "pw-app bg-[#F0EDE8]",
      )}
    >
      {isSales ? (
        <SalesSidebar mobileOpen={mobileOpen} onNavigate={() => setMobileOpen(false)} />
      ) : (
        <Sidebar mobileOpen={mobileOpen} onNavigate={() => setMobileOpen(false)} />
      )}
      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-[90] bg-black/40 md:hidden"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}
      <div className="flex min-h-screen flex-col md:ps-[240px]">
        {isSales ? <SalesTopbar onMenuClick={() => setMobileOpen(true)} /> : <Topbar onMenuClick={() => setMobileOpen(true)} />}
        <main className="min-h-0 flex-1 overflow-y-auto px-4 pb-10 pt-[88px] md:px-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
