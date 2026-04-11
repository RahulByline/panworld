import { Outlet } from "react-router-dom";
import { AdminSidebar } from "../admin/AdminSidebar";
import { AdminTopbar } from "../admin/AdminTopbar";

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-[var(--pw-page)] font-sans text-[var(--pw-text)] pw-app">
      <AdminSidebar />
      <div className="min-h-screen pl-[252px]">
        <AdminTopbar />
        <main className="min-h-[calc(100vh-60px)] px-4 py-6 md:px-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
