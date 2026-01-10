import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import type { Role } from "../features/auth/authTypes";

export default function RequireRole({ allow }: { allow: Role[] }) {
  const user = useAppSelector((s) => s.auth.user);

  if (!user) return <Navigate to="/login" replace />;

  if (!allow.includes(user.role)) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">Not allowed</h1>
        <p className="mt-1 text-slate-600">You don’t have permission to view this page.</p>
      </div>
    );
  }

  return <Outlet />;
}
