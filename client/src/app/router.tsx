import { createBrowserRouter } from "react-router-dom";

import MarketingLayout from "../layouts/MarketingLayout";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import Home from "../pages/marketing/Home";
import About from "../pages/marketing/About";
import Pricing from "../pages/marketing/Pricing";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import NotFound from "../pages/NotFound";

import RequireAuth from "../routes/RequireAuth";
import RequireRole from "../routes/RequireRole";
import Bootstrap from "../app/Bootstrap";

import DashboardHome from "../pages/dashboard/DashboardHome";
import Courses from "../pages/dashboard/Courses";
import MyCourses from "../pages/dashboard/MyCourses";
import ManageCourses from "../pages/dashboard/ManageCourses";

export const router = createBrowserRouter([
  {
    element: <Bootstrap />,
    children: [
      {
        path: "/",
        element: <MarketingLayout />,
        children: [
          { index: true, element: <Home /> },
          { path: "about", element: <About /> },
          { path: "pricing", element: <Pricing /> },
        ],
      },

      {
        element: <AuthLayout />,
        children: [
          { path: "/login", element: <Login /> },
          { path: "/register", element: <Register /> },
        ],
      },

      {
        element: <RequireAuth />,
        children: [
          {
            path: "/dashboard",
            element: <DashboardLayout />,
            children: [
              { index: true, element: <DashboardHome /> },

              {
                element: <RequireRole allow={["student", "admin"]} />,
                children: [
                  { path: "courses", element: <Courses /> },
                  { path: "my-courses", element: <MyCourses /> },
                ],
              },

              {
                element: <RequireRole allow={["instructor", "admin"]} />,
                children: [{ path: "manage-courses", element: <ManageCourses /> }],
              },
            ],
          },
        ],
      },

      { path: "*", element: <NotFound /> },
    ],
  },
]);
