import { Outlet } from "react-router-dom";
import { Sidebar } from "../shared/Sidebar";
import { Topbar } from "../shared/Topbar";

export function AppLayout() {
  return (
    <div className="h-screen bg-slate-50 text-slate-900">
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <Topbar />
          <main className="min-w-0 flex-1 overflow-y-auto px-4 py-6 md:px-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

