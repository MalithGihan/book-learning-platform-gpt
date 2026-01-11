import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import RouteLoadingBar from "../components/common/RouteLoadingBar";

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="hidden md:fixed md:inset-y-0 md:left-0 md:block md:w-64">
        <Sidebar />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-60 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-64 bg-white shadow-xl">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="md:pl-64">
        <Topbar onMenu={() => setMobileOpen(true)} />

        <main className="mx-auto w-full max-w-6xl px-4 py-6">
          <RouteLoadingBar />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
