import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

export default function RequireAuth() {
  const { status, user } = useAppSelector((s) => s.auth);
  const loc = useLocation();

  if (status === "checking") {
    return <div className="p-6 text-slate-600">Checking session...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  }

  return <Outlet />;
}
