import { Link } from "react-router-dom";
import { useGetMyEnrollmentsQuery } from "../../features/enrollments/enrollmentsApi";
import FullScreenLoader from "../../components/common/FullScreenLoader";

export default function MyCourses() {
  const { data, isLoading, error } = useGetMyEnrollmentsQuery();

  if (isLoading ) return <FullScreenLoader label="Loading ..." />;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">My Courses</h1>
        <p className="text-sm text-slate-600">Courses you are enrolled in.</p>
      </div>
    
      {error && <div className="text-red-700">Failed to load your enrollments.</div>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(data ?? []).map((en) => (
          <div key={en._id} className="rounded-2xl border bg-white p-4">
            <h2 className="font-semibold text-slate-900">
              {en.course?.title ?? "Untitled"}
            </h2>
            <p className="mt-2 text-sm text-slate-600 line-clamp-3">
              {en.course?.description ?? ""}
            </p>

            <div className="mt-3 flex items-center justify-between">
              <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                Enrolled
              </span>

              {/* Later you can link to a course details page */}
              <Link
                to="/dashboard/courses"
                className="text-sm font-medium text-slate-700 underline underline-offset-2"
              >
                Browse more
              </Link>
            </div>
          </div>
        ))}
      </div>

      {!isLoading && !error && (data ?? []).length === 0 && (
        <div className="rounded-xl border bg-white p-4">
          <p className="text-slate-700">You haven’t enrolled in any courses yet.</p>
          <Link
            to="/dashboard/courses"
            className="mt-2 inline-block rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            View courses
          </Link>
        </div>
      )}
    </div>
  );
}
