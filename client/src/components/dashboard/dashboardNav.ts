export type Role = "student" | "instructor" | "admin";

export type NavItem = {
  label: string;
  to: string;
  roles: Role[];
};

export const dashboardNav: NavItem[] = [
  { label: "Overview", to: "/dashboard", roles: ["student", "instructor", "admin"] },

  { label: "Courses", to: "/dashboard/courses", roles: ["student", "admin"] },
  { label: "My Courses", to: "/dashboard/my-courses", roles: ["student", "admin"] },

  { label: "Manage Courses", to: "/dashboard/manage-courses", roles: ["instructor", "admin"] },
];
