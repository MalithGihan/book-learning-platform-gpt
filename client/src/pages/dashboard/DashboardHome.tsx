import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";

export default function DashboardHome() {
  const user = useAppSelector((s) => s.auth.user);

  if (!user) return null;

  const isStudent = user.role === "student";
  const isInstructor = user.role === "instructor";
  const isAdmin = user.role === "admin";

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-slate-600">Logged in as <span className="font-medium">{user.role}</span></p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {(isStudent || isAdmin) && (
          <>
            <DashCard
              title="Browse courses"
              desc="View available courses and enroll."
              to="/dashboard/courses"
              cta="View courses"
            />
            <DashCard
              title="My enrolled courses"
              desc="See courses you already enrolled in."
              to="/dashboard/my-courses"
              cta="Open my courses"
            />
          </>
        )}

        {(isInstructor || isAdmin) && (
          <DashCard
            title="Manage courses"
            desc="Create, edit, and delete your courses."
            to="/dashboard/manage-courses"
            cta="Manage"
          />
        )}
      </div>
    </div>
  );
}

function DashCard(props: { title: string; desc: string; to: string; cta: string }) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <h2 className="font-semibold">{props.title}</h2>
      <p className="mt-1 text-sm text-slate-600">{props.desc}</p>
      <Link
        to={props.to}
        className="mt-3 inline-block rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
      >
        {props.cta}
      </Link>
    </div>
  );
}
