import { Outlet } from "react-router-dom";
import { AdminSidebar, ADMIN_SIDEBAR_WIDTH_PX } from "../admin/AdminSidebar";
import { AdminTopbar } from "../admin/AdminTopbar";

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-[var(--pw-page)] font-sans text-[var(--pw-text)] pw-app">
      <AdminSidebar />
      <div className="min-h-screen" style={{ paddingLeft: ADMIN_SIDEBAR_WIDTH_PX }}>
        <AdminTopbar />
        <main className="min-h-[calc(100vh-60px)] px-4 py-6 md:px-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
