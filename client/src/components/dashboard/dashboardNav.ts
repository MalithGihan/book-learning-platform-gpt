import type { DashboardSubNavItem } from "./Sidebar.types";

export type Role = "student" | "instructor" | "admin";

export type IconKey =
  | "overview"
  | "courses"
  | "myCourses"
  | "manageCourses"
  | "certificates"
  | "feedback"
  | "settings"
  | "reports";

export interface NavItem {
  label: string;
  to: string;
  roles: Role[];
  icon: IconKey;          
  subItems?: DashboardSubNavItem[];
}

