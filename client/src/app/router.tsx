import { createBrowserRouter } from "react-router-dom";

import MarketingLayout from "../layouts/MarketingLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import Home from "../pages/marketing/Home";
import About from "../pages/marketing/About";
import Pricing from "../pages/marketing/Pricing";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import NotFound from "../pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MarketingLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "pricing", element: <Pricing /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <div className="font-medium">Dashboard Home (later)</div> },
    ],
  },
  { path: "*", element: <NotFound /> },
]);
