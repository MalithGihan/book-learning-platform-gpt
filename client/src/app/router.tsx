import { createBrowserRouter } from "react-router-dom";

import MarketingLayout from "../layouts/MarketingLayout";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import Home from "../pages/marketing/Home";

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
import MarketingCourses from "../pages/marketing/Courses";
import Checkout from "../pages/checkout/Checkout";
import CourseDetail from "../pages/dashboard/CourseDetail";
import UnderConstruction from "../pages/UnderConstruction";
import AuthSuccess from "../pages/auth/loader/AuthSuccess";
import Settings from "../pages/auth/account/Settings";

export const router = createBrowserRouter([
  {
    element: <Bootstrap />,
    children: [
      {
        path: "/",
        element: <MarketingLayout />,
        children: [
          { index: true, element: <Home /> },
          { path: "courses", element: <MarketingCourses /> },
          { path: "about", element: <UnderConstruction /> },
          { path: "careers", element: <UnderConstruction /> },
          { path: "contact", element: <UnderConstruction /> },
          { path: "blog", element: <UnderConstruction /> },
          { path: "docs", element: <UnderConstruction /> },
          { path: "help", element: <UnderConstruction /> },
        ],
      },
      {
        path: "products",
        element: <MarketingLayout />,
        children: [
          { index: true, element: <Home /> },
          { path: "analytics", element: <UnderConstruction /> },
          { path: "lms", element: <UnderConstruction /> },
          { path: "courses", element: <MarketingCourses /> },
        ],
      },
      {
        path: "section",
        element: <MarketingLayout />,
        children: [
          { index: true, element: <Home /> },
          { path: "teachers", element: <UnderConstruction /> },
          { path: "students", element: <UnderConstruction /> },
          { path: "schools", element: <UnderConstruction /> },
        ],
      },
      {
        path: "pricing",
        element: <MarketingLayout />,
        children: [
          { index: true, element: <Home /> },
          { path: "students", element: <UnderConstruction /> },
          { path: "schools", element: <UnderConstruction /> },
        ],
      },
      {
        element: <AuthLayout />,
        children: [
          { path: "login", element: <Login /> },
          { path: "register", element: <Register /> },
          { path: "auth/success", element: <AuthSuccess /> },
        ],
      },
      {
        element: <RequireAuth />,
        children: [
          {
            path: "dashboard",
            element: <DashboardLayout />,
            children: [
              { index: true, element: <DashboardHome /> },
              { path: "certificates", element: <UnderConstruction /> },
              { path: "feedback", element: <UnderConstruction /> },
              { path: "settings", element: <Settings /> },
              { path: "profile", element: <UnderConstruction /> },
              {
                element: <RequireRole allow={["student", "admin"]} />,
                children: [
                  { path: "courses", element: <Courses /> },
                  { path: "my-courses", element: <MyCourses /> },
                  { path: "courses/:courseId", element: <CourseDetail /> },
                ],
              },
              {
                element: <RequireRole allow={["instructor", "admin"]} />,
                children: [
                  { path: "manage-courses", element: <ManageCourses /> },
                  { path: "reports", element: <UnderConstruction /> },
                ],
              },
            ],
          },
          { path: "checkout/:courseId", element: <Checkout /> }
        ],
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
