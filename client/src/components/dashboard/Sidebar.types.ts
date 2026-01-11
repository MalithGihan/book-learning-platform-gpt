export type Role = "student" | "instructor" | "admin";

export interface DashboardSubNavItem {
  label: string;
  to: string;
}

export interface DashboardNavItem {
  label: string;
  to: string;
  roles: Role[];
  subItems?: DashboardSubNavItem[];
}

export const dashboardNav: DashboardNavItem[] = [
  {
    label: "Overview",
    to: "/dashboard",
    roles: ["admin", "instructor", "student"],
    subItems: [
      { label: "Course", to: "/dashboard/overview/course" },
      { label: "Action", to: "/dashboard/overview/action" },
      { label: "Report", to: "/dashboard/overview/report" },
      { label: "My Courses", to: "/dashboard/my-courses" }
    ],
  },
  {
    label: "Certificates",
    to: "/dashboard/certificates",
    roles: ["admin", "instructor", "student"],
  },
  {
    label: "Feedback",
    to: "/dashboard/feedback",
    roles: ["admin", "instructor", "student"],
  },
  {
    label: "Settings",
    to: "/dashboard/settings",
    roles: ["admin", "instructor", "student"],
  },
  {
    label: "Reports",
    to: "/dashboard/reports",
    roles: ["admin", "instructor"],
  },
];
