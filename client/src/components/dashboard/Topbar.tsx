import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logout } from "../../features/auth/authSlice";

export default function Topbar({ onMenu }: { onMenu: () => void }) {
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const nav = useNavigate();

  async function onLogout() {
    await dispatch(logout());
    nav("/", { replace: true });
  }

  return (
    <header className="sticky top-0 z-30 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenu}
            className="md:hidden rounded-lg p-2 hover:bg-slate-100"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <span className="font-semibold">Dashboard</span>
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <div className="hidden sm:block text-right">
              <div className="text-sm font-medium text-slate-900">{user.email ?? "User"}</div>
              <div className="text-xs text-slate-500">{user.role}</div>
            </div>
          )}

          <button
            type="button"
            onClick={onLogout}
            className="rounded-lg border px-3 py-1.5 text-sm hover:bg-slate-50"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
