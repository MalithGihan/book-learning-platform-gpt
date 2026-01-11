import { Link } from "react-router-dom";
import {
  useCreateCourseMutation,
  useDeleteCourseMutation,
  useGetCoursesQuery,
} from "../../features/courses/coursesApi";
import CourseForm from "../../features/courses/CourseForm";
import { useState } from "react";

export default function ManageCourses() {
  const { data: courses, isLoading, error, refetch } = useGetCoursesQuery();
  const [createCourse, { isLoading: creating }] = useCreateCourseMutation();
  const [deleteCourse, { isLoading: deleting }] = useDeleteCourseMutation();

  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Manage Courses</h1>
          <p className="text-slate-600 text-sm">Create, edit, and delete courses.</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowCreate((v) => !v)}
            className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            {showCreate ? "Close" : "New course"}
          </button>
          <button
            onClick={() => refetch()}
            className="rounded-lg border px-3 py-2 text-sm hover:bg-slate-50"
          >
            Refresh
          </button>
        </div>
      </div>

      {showCreate && (
        <div className="rounded-xl border bg-white p-4">
          <h2 className="font-semibold">Create a course</h2>
          <div className="mt-3">
            <CourseForm
              submitLabel="Create"
              busy={creating}
              onSubmit={async (values) => {
                await createCourse(values).unwrap();
                setShowCreate(false);
              }}
            />
          </div>
          <p className="mt-2 text-xs text-slate-500">
            If your backend requires more fields, add them to the form + payload.
          </p>
        </div>
      )}

      <div className="rounded-xl border bg-white">
        <div className="border-b px-4 py-3 font-semibold">Your courses</div>

        {isLoading && <div className="p-4 text-slate-600">Loading...</div>}

        {error && (
          <div className="p-4 text-red-700">
            Failed to load courses. (Check role permissions / backend response)
          </div>
        )}

        {!isLoading && !error && (
          <div className="divide-y">
            {(courses ?? []).map((c) => (
              <div key={c._id} className="flex items-center justify-between gap-3 p-4">
                <div>
                  <div className="font-medium">{c.title ?? "Untitled"}</div>
                  <div className="text-sm text-slate-600 line-clamp-1">
                    {c.description ?? ""}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/dashboard/manage-courses/${c._id}`}
                    className="rounded-lg border px-3 py-1.5 text-sm hover:bg-slate-50"
                  >
                    Edit
                  </Link>

                  <button
                    disabled={deleting}
                    onClick={async () => {
                      if (!confirm("Delete this course?")) return;
                      await deleteCourse(c._id).unwrap();
                    }}
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50 disabled:opacity-60"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {(courses ?? []).length === 0 && (
              <div className="p-4 text-slate-600">No courses yet.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
