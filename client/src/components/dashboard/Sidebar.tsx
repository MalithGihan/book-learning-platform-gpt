import {  NavLink } from "react-router-dom";
import { dashboardNav } from "./dashboardNav";
import { useAppSelector } from "../../app/hooks";

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const user = useAppSelector((s) => s.auth.user);

  const items = dashboardNav.filter((i) =>
    user ? i.roles.includes(user.role) : false
  );

  return (
    <aside className="h-full w-64 border-r bg-white">
      <div className="h-14 border-b px-4 flex items-center">
        <a href="/" className="font-semibold text-slate-900">
          BookLMS
        </a>
      </div>

      <nav className="p-3 space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              [
                "block rounded-lg px-3 py-2 text-sm font-medium transition",
                isActive
                  ? "bg-slate-900 text-white"
                  : "text-slate-700 hover:bg-slate-100",
              ].join(" ")
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
