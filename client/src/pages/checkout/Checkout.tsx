import { useNavigate, useParams, Link } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { useGetCourseQuery } from "../../features/courses/coursesApi";
import { useEnrollCourseMutation } from "../../features/enrollments/enrollmentsApi";

type CourseVM = {
  _id: string;
  title?: string;
  description?: string;
  price?: number;
  enrollmentStatus?: "enrolled" | "not_enrolled";
};

export default function Checkout() {
  const { courseId } = useParams<{ courseId: string}>();
  const nav = useNavigate();
  const user = useAppSelector((s) => s.auth.user);

  const { data: courseRaw, isLoading, error } = useGetCourseQuery(courseId ?? "", {
    skip: !courseId,
  });

  const course = courseRaw as unknown as CourseVM | undefined;

  const [enrollCourse, { isLoading: enrolling, error: enrollErr }] =
    useEnrollCourseMutation();

  if (!courseId) return <div className="p-6">Missing courseId</div>;
  if (isLoading) return <div className="p-6 text-slate-600">Loading...</div>;
  if (error || !course) return <div className="p-6 text-red-700">Course not found.</div>;

  const enrolled = course.enrollmentStatus === "enrolled";
  const id = courseId;

  async function onPayAndEnroll() {
    await enrollCourse(id).unwrap();
    nav("/dashboard/my-courses", { replace: true });
  }

  const canEnroll = user?.role === "student" || user?.role === "admin";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Link to="/courses" className="text-sm text-slate-600 underline underline-offset-2">
          ← Back to courses
        </Link>

        <div className="mt-4 rounded-2xl border bg-white p-5">
          <h1 className="text-2xl font-bold">Checkout</h1>

          <div className="mt-4">
            <div className="font-semibold">{course.title ?? "Untitled"}</div>
            <div className="mt-1 text-sm text-slate-600">{course.description ?? ""}</div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-slate-700">
                Price: {typeof course.price === "number" ? `LKR ${course.price}` : "Free"}
              </div>
              {enrolled && (
                <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                  Already enrolled
                </span>
              )}
            </div>

            {!canEnroll && (
              <div className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                Only student/admin accounts can enroll.
              </div>
            )}

            {enrollErr && (
              <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                Enrollment failed. Try again.
              </div>
            )}

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                disabled={enrolled || !canEnroll || enrolling}
                onClick={onPayAndEnroll}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
              >
                {enrolling ? "Processing..." : (enrolled ? "Enrolled" : "Pay & Enroll")}
              </button>

              <Link
                to="/dashboard"
                className="rounded-lg border px-4 py-2 text-sm hover:bg-slate-50"
              >
                Dashboard
              </Link>
            </div>

            <p className="mt-3 text-xs text-slate-500">
              Note: This is a mock checkout. Real payments must be confirmed on the server (Stripe, etc.)
              before enrolling.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
