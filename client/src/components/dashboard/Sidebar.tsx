import { Link, NavLink, useNavigate } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  Monitor,
  BookOpen,
  FileText,
  Award,
  MessageSquare,
  Settings,
  ChevronLeft,
  CirclePlus,
  BookA,
} from "lucide-react";

import { type Role } from "./dashboardNav";
import { useAppSelector } from "../../app/hooks";
import { dashboardNav, type DashboardNavItem, type DashboardSubNavItem } from "./Sidebar.types";

const iconMap: Record<string, LucideIcon> = {
  overview: Monitor,
  courses: BookOpen,
  myCourses: BookA,
  manageCourses: CirclePlus,
  certificates: Award,
  feedback: MessageSquare,
  settings: Settings,
  reports: FileText,
};

export default function Sidebar({
  isCollapsed,
  onNavigate,
}: {
  isCollapsed?: boolean;
  onNavigate?: () => void;
}) {
  const user = useAppSelector((s) => s.auth.user);
  const navigate = useNavigate();

  const role = (user?.role ?? null) as Role | null;

  const items: DashboardNavItem[] = dashboardNav.filter((i) =>
  role ? i.roles.includes(role) : false
);


  const overviewItem = items.find((i) => i.label.toLowerCase() === "overview");
  const overviewSubItems: DashboardSubNavItem[] = overviewItem?.subItems ?? [];
  const regularItems = items.filter(
    (i) => i.label.toLowerCase() !== "overview"
  );

  return (
    <aside className="h-full flex flex-col bg-white border-r border-gray-200">
      <div className="h-16 flex items-center justify-center border-b border-gray-200 px-4">
        <Link to="/" className="z-50 text-lg font-bold text-gray-900">
          {isCollapsed ? 'B' : <img src="/logo/logo.png" alt="logo" className="h-5 w-13" />}
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {overviewItem && (
          <div className="">
            <NavLink
              to={overviewItem.to}
              end
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? "bg-gray-900 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
              title={isCollapsed ? overviewItem.label : undefined}
            >
              <Monitor className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span>{overviewItem.label}</span>}
            </NavLink>

            {!isCollapsed && overviewSubItems.length > 0 && (
              <div className="ml-6 mt-2 space-y-1 border-l-2 border-gray-200 pl-4">
                {overviewSubItems.map((subItem) => (
                  <NavLink
                    key={subItem.to}
                    to={subItem.to}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                        isActive
                          ? "text-gray-900 font-medium"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`
                    }
                  >
                    <CirclePlus className="h-4 w-4 shrink-0" />
                    <span>{subItem.label}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        )}

        {regularItems.map((item) => {
          const Icon = iconMap[item.icon];
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? "bg-gray-900 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
              title={isCollapsed ? item.label : undefined}
            >
              {Icon && <Icon className="h-5 w-5 shrink-0" />}
              {!isCollapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {!isCollapsed && (
        <div className="p-3 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-5 w-5 shrink-0" />
            <span>Back</span>
          </button>
        </div>
      )}
    </aside>
  );
}