import { Outlet } from "react-router-dom";
import { AdminSidebar } from "../admin/AdminSidebar";
import { AdminTopbar } from "../admin/AdminTopbar";

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#EBE8E4] font-sans text-[#1A1917]">
      <AdminSidebar />
      <div className="min-h-screen pl-[240px]">
        <AdminTopbar />
        <main className="min-h-[calc(100vh-60px)] px-4 py-6 md:px-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
