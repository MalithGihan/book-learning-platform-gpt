import { useNavigate } from "react-router-dom";
import { useGetCoursesQuery } from "../../features/courses/coursesApi";
import { useEnrollCourseMutation } from "../../features/enrollments/enrollmentsApi";
import FullScreenLoader from "../../components/common/FullScreenLoader";

type CourseVM = {
  _id: string;
  title?: string;
  description?: string;
  price?: number;
  enrollmentStatus?: "enrolled" | "not_enrolled";
};

export default function Courses() {
  const nav = useNavigate();

  const { data, isLoading, error } = useGetCoursesQuery();
  const courses = (data ?? []) as CourseVM[];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [enrollCourse, { isLoading: enrollingId }] = useEnrollCourseMutation() as any;

  if (isLoading || enrollingId) return <FullScreenLoader label="Loading ..." />;

  async function onEnroll(course: CourseVM) {
    const enrolled = course.enrollmentStatus === "enrolled";
    if (enrolled) return;

    const price = Number(course.price ?? 0);

    // If paid -> go to checkout
    if (price > 0) {
      nav(`/checkout/${course._id}`);
      return;
    }

    // If free -> enroll directly
    await enrollCourse(course._id).unwrap();
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Courses</h1>
        <p className="text-sm text-slate-600">Browse courses and enroll.</p>
      </div>

      {isLoading && <div className="text-slate-600">Loading...</div>}
      {error && <div className="text-red-700">Failed to load courses.</div>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((c) => {
          const enrolled = c.enrollmentStatus === "enrolled";
          const price = Number(c.price ?? 0);

          return (
            <div key={c._id} className="rounded-2xl border bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-semibold text-slate-900">{c.title ?? "Untitled"}</h2>

                <span
                  className={[
                    "rounded-full px-2 py-1 text-xs font-medium",
                    enrolled ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-700",
                  ].join(" ")}
                >
                  {enrolled ? "Enrolled" : "Not enrolled"}
                </span>
              </div>

              <p className="mt-2 text-sm text-slate-600 line-clamp-3">
                {c.description ?? ""}
              </p>

              <div className="mt-3 flex items-center justify-between">
                <div className="text-sm text-slate-700">
                  {price > 0 ? `LKR ${price}` : "Free"}
                </div>

                <button
                  type="button"
                  disabled={enrolled}
                  onClick={() => onEnroll(c)}
                  className={[
                    "rounded-lg px-3 py-2 text-sm font-medium transition",
                    enrolled
                      ? "bg-emerald-600 text-white opacity-70 cursor-not-allowed"
                      : "bg-slate-900 text-white hover:bg-slate-800",
                  ].join(" ")}
                >
                  {enrolled ? "Enrolled" : price > 0 ? "Pay & Enroll" : "Enroll"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {!isLoading && !error && courses.length === 0 && (
        <div className="text-slate-600">No courses available yet.</div>
      )}
    </div>
  );
}
