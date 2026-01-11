import { useNavigate, useParams } from "react-router-dom";
import {
  useGetCourseQuery,
  useUpdateCourseMutation,
} from "../../features/courses/coursesApi";
import CourseForm from "../../features/courses/CourseForm";

export default function EditCourse() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();

  const { data: course, isLoading, error } = useGetCourseQuery(id ?? "", {
    skip: !id,
  });

  const [updateCourse, { isLoading: saving }] = useUpdateCourseMutation();

  if (!id) return <div className="text-slate-600">Missing course id</div>;
  if (isLoading) return <div className="text-slate-600">Loading...</div>;
  if (error) return <div className="text-red-700">Failed to load course.</div>;
  if (!course) return <div className="text-slate-600">Course not found.</div>;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Edit Course</h1>
        <p className="text-slate-600 text-sm">Update title/description.</p>
      </div>

      <div className="rounded-xl border bg-white p-4">
        <CourseForm
          initial={course}
          submitLabel="Save changes"
          busy={saving}
          onSubmit={async (values) => {
            await updateCourse({ id, patch: values }).unwrap();
            nav("/dashboard/manage-courses", { replace: true });
          }}
        />
      </div>
    </div>
  );
}
