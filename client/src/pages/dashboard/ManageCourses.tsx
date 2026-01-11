import { useMemo, useState } from "react";
import {
  Plus,
  RefreshCw,
  Edit2,
  Trash2,
  Search,
  MoreVertical,
  BookOpen,
  DollarSign,
  Users,
  Eye,
  EyeOff,
  Tag,
  X,
} from "lucide-react";

import {
  useGetCoursesQuery,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} from "../../features/courses/coursesApi";
import FullScreenLoader from "../../components/common/FullScreenLoader";
import DashboardModal from "../../components/model/DashboardModel";

interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  tags: string[];
  price: number;
  published: boolean;
  enrollmentCount?: number;
}

type CoursesResponse = { ok?: boolean; courses?: Course[] } | Course[];

type CourseFormState = {
  title: string;
  description: string;
  category: string;
  level: Course["level"];
  tagsText: string;
  price: number;
  published: boolean;
};

function tagsToText(tags: string[]) {
  return (tags ?? []).join(", ");
}
function textToTags(text: string) {
  return text
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function courseToForm(c: Course): CourseFormState {
  return {
    title: c.title ?? "",
    description: c.description ?? "",
    category: c.category ?? "",
    level: c.level ?? "beginner",
    tagsText: tagsToText(c.tags ?? []),
    price: Number.isFinite(c.price) ? c.price : 0,
    published: !!c.published,
  };
}

export default function ManageCourses() {
  const [showCreate, setShowCreate] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterLevel, setFilterLevel] = useState<string>("all");

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Course | null>(null);

  const [editForm, setEditForm] = useState<CourseFormState | null>(null);

  const { data, isLoading, isError, refetch } = useGetCoursesQuery({
    viewer: "user",
  }) as {
    data?: CoursesResponse;
    isLoading: boolean;
    isError: boolean;
    refetch: () => void;
  };

  const [updateCourse, { isLoading: updating }] = useUpdateCourseMutation();
  const [deleteCourse, { isLoading: deleting }] = useDeleteCourseMutation();

  const courses: Course[] = useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data as Course[];
    return (data.courses ?? []) as Course[];
  }, [data]);

  const filteredCourses = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return courses.filter((c) => {
      const matchesSearch =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        (c.category ?? "").toLowerCase().includes(q) ||
        (c.tags ?? []).some((t) => t.toLowerCase().includes(q));

      const matchesLevel = filterLevel === "all" || c.level === filterLevel;

      return matchesSearch && matchesLevel;
    });
  }, [courses, searchQuery, filterLevel]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-50 text-green-700 border-green-200";
      case "intermediate":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "advanced":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  function openDetails(course: Course) {
    setSelected(course);
    setDetailsOpen(true);
  }

  function openEdit(course: Course) {
    setSelected(course);
    setEditForm(courseToForm(course));
    setEditOpen(true);
  }

  function openDelete(course: Course) {
    setSelected(course);
    setDeleteOpen(true);
  }

  async function onSaveEdit() {
    if (!selected || !editForm) return;

    const patch = {
      title: editForm.title.trim(),
      description: editForm.description.trim(),
      category: editForm.category.trim(),
      level: editForm.level,
      tags: textToTags(editForm.tagsText),
      price: Number(editForm.price) || 0,
      published: !!editForm.published,
    };

    await updateCourse({ id: selected._id, patch }).unwrap();

    setEditOpen(false);
    setSelected(null);
    setEditForm(null);
  }

  async function onConfirmDelete() {
    if (!selected) return;

    await deleteCourse(selected._id).unwrap();

    setDeleteOpen(false);
    setSelected(null);
  }

  if (isLoading ) return <FullScreenLoader label="Loading ..." />;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Manage Courses</h1>
          <p className="text-xs text-gray-600 mt-0.5">
            Create, edit, and manage your courses
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowCreate((v) => !v)}
            className="flex items-center gap-2 px-4 py-2 bg-[#4CE38F] text-white text-sm font-semibold rounded-lg hover:bg-[#3AB574] transition-colors"
          >
            {showCreate ? (
              <X className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {showCreate ? "Cancel" : "New Course"}
          </button>

          <button
            onClick={() => refetch()}
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            aria-label="Refresh"
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4 text-gray-700" />
          </button>
        </div>
      </div>

      {isError && (
        <div className="bg-white rounded-lg border border-red-200 p-6 text-sm text-red-600">
          Failed to load courses.{" "}
          <button className="underline" onClick={() => refetch()}>
            Try again
          </button>
        </div>
      )}

      {showCreate && (
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">
            Create New Course
          </h2>
          <p className="text-xs text-gray-600">
            (We can connect this to POST /courses next.)
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-300 bg-white"
          />
        </div>

        <select
          value={filterLevel}
          onChange={(e) => setFilterLevel(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-300 bg-white"
        >
          <option value="all">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      {!isLoading && !isError && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">
                Your Courses
              </h2>
              <span className="text-xs text-gray-600">
                {filteredCourses.length} total
              </span>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredCourses.map((course) => (
              <div
                key={course._id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {course.title}
                      </h3>

                      {course.published ? (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-semibold rounded border border-green-200">
                          <Eye className="h-3 w-3" />
                          Published
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-gray-50 text-gray-600 text-[10px] font-semibold rounded border border-gray-200">
                          <EyeOff className="h-3 w-3" />
                          Draft
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                      {course.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-semibold rounded border ${getLevelColor(
                          course.level
                        )}`}
                      >
                        {course.level}
                      </span>

                      {course.category && (
                        <span className="px-2 py-0.5 bg-gray-50 text-gray-700 text-[10px] font-medium rounded border border-gray-200">
                          {course.category}
                        </span>
                      )}

                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <DollarSign className="h-3 w-3" />
                        {course.price === 0
                          ? "Free"
                          : `LKR ${course.price.toLocaleString()}`}
                      </div>

                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Users className="h-3 w-3" />
                        {course.enrollmentCount || 0}
                      </div>
                    </div>

                    {course.tags?.length > 0 && (
                      <div className="flex items-center gap-1 mt-2">
                        <Tag className="h-3 w-3 text-gray-400" />
                        <div className="flex flex-wrap gap-1">
                          {course.tags.map((tag, idx) => (
                            <span
                              key={`${tag}-${idx}`}
                              className="text-[10px] text-gray-500"
                            >
                              {tag}
                              {idx < course.tags.length - 1 ? "," : ""}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                      aria-label="Edit"
                      onClick={() => openEdit(course)}
                    >
                      <Edit2 className="h-4 w-4 text-gray-600 group-hover:text-gray-900" />
                    </button>

                    <button
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                      aria-label="Delete"
                      onClick={() => openDelete(course)}
                    >
                      <Trash2 className="h-4 w-4 text-gray-600 group-hover:text-red-600" />
                    </button>

                    <button
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      aria-label="More"
                      onClick={() => openDetails(course)}
                    >
                      <MoreVertical className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredCourses.length === 0 && (
              <div className="p-8 text-center">
                <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-900 mb-1">
                  No courses found
                </p>
                <p className="text-xs text-gray-600">Try a different search</p>
              </div>
            )}
          </div>
        </div>
      )}

      <DashboardModal
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        title="Course Details"
      >
        {selected ? (
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-gray-900">
                  {selected.title}
                </div>
                <div className="text-xs text-gray-600 mt-0.5">
                  {selected.category}
                </div>
              </div>
              <span
                className={`px-2 py-0.5 text-[10px] font-semibold rounded border ${getLevelColor(
                  selected.level
                )}`}
              >
                {selected.level}
              </span>
            </div>

            <div className="text-xs text-gray-700 whitespace-pre-wrap">
              {selected.description}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded border border-gray-200 p-2">
                <div className="text-[10px] text-gray-500">Price</div>
                <div className="font-medium text-gray-900">
                  {selected.price === 0
                    ? "Free"
                    : `LKR ${selected.price.toLocaleString()}`}
                </div>
              </div>

              <div className="rounded border border-gray-200 p-2">
                <div className="text-[10px] text-gray-500">Status</div>
                <div className="font-medium text-gray-900">
                  {selected.published ? "Published" : "Draft"}
                </div>
              </div>

              <div className="rounded border border-gray-200 p-2">
                <div className="text-[10px] text-gray-500">Enrollments</div>
                <div className="font-medium text-gray-900">
                  {selected.enrollmentCount ?? 0}
                </div>
              </div>

              <div className="rounded border border-gray-200 p-2">
                <div className="text-[10px] text-gray-500">Course ID</div>
                <div className="font-medium text-gray-900 truncate">
                  {selected._id}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="h-4 w-4 text-gray-400" />
              {(selected.tags ?? []).length ? (
                selected.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] px-2 py-0.5 rounded border border-gray-200 bg-gray-50"
                  >
                    {t}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-500">No tags</span>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
                onClick={() => setDetailsOpen(false)}
              >
                Close
              </button>
              <button
                className="px-3 py-2 text-sm rounded-lg bg-gray-900 text-white hover:bg-gray-800"
                onClick={() => {
                  setDetailsOpen(false);
                  openEdit(selected);
                }}
              >
                Edit
              </button>
            </div>
          </div>
        ) : null}
      </DashboardModal>

      <DashboardModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Course"
      >
        {!selected || !editForm ? null : (
          <div className="space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  value={editForm.category}
                  onChange={(e) =>
                    setEditForm({ ...editForm, category: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-gray-200 resize-none"
              />
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Level
                </label>
                <select
                  value={editForm.level}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      level: e.target.value as Course["level"],
                    })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-gray-200"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Price (LKR)
                </label>
                <input
                  type="number"
                  value={editForm.price}
                  onChange={(e) =>
                    setEditForm({ ...editForm, price: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <input
                  value={editForm.tagsText}
                  onChange={(e) =>
                    setEditForm({ ...editForm, tagsText: e.target.value })
                  }
                  placeholder="React, JavaScript"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs text-gray-700">
              <input
                type="checkbox"
                checked={editForm.published}
                onChange={(e) =>
                  setEditForm({ ...editForm, published: e.target.checked })
                }
                className="h-4 w-4 rounded border-gray-300"
              />
              Published
            </label>

            <div className="flex justify-end gap-2 pt-2">
              <button
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
                onClick={() => setEditOpen(false)}
                disabled={updating}
              >
                Cancel
              </button>
              <button
                className="px-3 py-2 text-sm rounded-lg bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-60"
                onClick={onSaveEdit}
                disabled={updating}
              >
                {updating ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        )}
      </DashboardModal>

      <DashboardModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete Course"
      >
        {!selected ? null : (
          <div className="space-y-3">
            <p className="text-sm text-gray-800">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{selected.title}</span>?
            </p>
            <p className="text-xs text-gray-600">
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
                onClick={() => setDeleteOpen(false)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="px-3 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
                onClick={onConfirmDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        )}
      </DashboardModal>
    </div>
  );
}


