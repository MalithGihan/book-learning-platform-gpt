import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  Search,
  Bell,
  Grid3x3,
  Moon,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logout } from "../../features/auth/authSlice";
import { api } from "../../app/api";

export default function Topbar({
  onMenu,
  onToggleSidebar,
  isSidebarCollapsed,
}: {
  onMenu: () => void;
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
}) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications] = useState(3);

  const dispatch = useAppDispatch();
  const nav = useNavigate();

  const user = useAppSelector((s) => s.auth.user);

  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setShowUserMenu(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  async function onLogout() {
    try {
      await dispatch(logout()).unwrap();
    } finally {
      dispatch(api.util.resetApiState());
      setShowUserMenu(false);
      nav("/", { replace: true });
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-4 gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenu}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5 text-gray-700" />
          </button>

          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              className="hidden md:block p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle sidebar"
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="h-5 w-5 text-gray-700" />
              ) : (
                <ChevronLeft className="h-5 w-5 text-gray-700" />
              )}
            </button>
          )}
        </div>

        <div className="hidden md:flex flex-1 max-w-xl">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Enter Text here"
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg outline-none transition-all duration-200 focus:ring-2 focus:ring-gray-200 focus:border-gray-300 bg-gray-50"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Search"
          >
            <Search className="h-5 w-5 text-gray-700" />
          </button>

          <button
            type="button"
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-gray-700" />
            {notifications > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {notifications}
              </span>
            )}
          </button>

          <button
            type="button"
            className="hidden sm:block p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Apps"
          >
            <Grid3x3 className="h-5 w-5 text-gray-700" />
          </button>

          <button
            type="button"
            className="hidden sm:block p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle dark mode"
          >
            <Moon className="h-5 w-5 text-gray-700" />
          </button>

          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setShowUserMenu((v) => !v)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="User menu"
            >
              <User className="h-5 w-5 text-gray-700" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#4CE38F]/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-[#4CE38F]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user?.name || user?.email || "Guest"}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {user?.role || "guest"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-xs text-gray-600 truncate">
                    {user?.email || "Not signed in"}
                  </p>
                </div>

                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserMenu(false);
                      nav("/dashboard/profile");
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Profile Settings
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowUserMenu(false);
                      nav("/dashboard/my-courses");
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    My Courses
                  </button>

                  <button
                    type="button"
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Preferences
                  </button>
                </div>

                <div className="border-t border-gray-100 pt-1">
                  <button
                    type="button"
                    onClick={onLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                    disabled={!user}
                    title={!user ? "You are not logged in" : "Logout"}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
