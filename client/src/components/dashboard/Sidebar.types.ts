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

export interface DashboardSubNavItem {
  label: string;
  to: string;
  icon?: IconKey;
}

export interface DashboardNavItem {
  label: string;
  to: string;
  roles: Role[];
  icon: IconKey;
  subItems?: DashboardSubNavItem[];
}


export const dashboardNav: DashboardNavItem[] = [
  {
    label: "Overview",
    to: "/dashboard",
    roles: ["admin", "instructor", "student"],
    icon: "overview",
  },
  {
    label: "Courses",
    to: "/dashboard/courses",
    roles: ["student", "admin"],
    icon: "courses",
  },
  {
    label: "My Courses",
    to: "/dashboard/my-courses",
    roles: ["student", "admin"],
    icon: "myCourses",
  },
  {
    label: "Manage Courses",
    to: "/dashboard/manage-courses",
    roles: ["instructor", "admin"],
    icon: "manageCourses",
  },

  {
    label: "Certificates",
    to: "/dashboard/certificates",
    roles: ["admin", "instructor", "student"],
    icon: "certificates",
  },
  {
    label: "Feedback",
    to: "/dashboard/feedback",
    roles: ["admin", "instructor", "student"],
    icon: "feedback",
  },
  {
    label: "Settings",
    to: "/dashboard/settings",
    roles: ["admin", "instructor", "student"],
    icon: "settings",
  },
  {
    label: "Reports",
    to: "/dashboard/reports",
    roles: ["admin", "instructor"],
    icon: "reports",
  },
];
