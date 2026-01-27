/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Star,
  Users,
  X,
  Tag,
  Layers,
  Hash,
  Image as ImageIcon,
} from "lucide-react";

type CourseModalProps = {
  course: Course;
  onClose: () => void;
  onEnroll: () => void;
  user: User;
};

type Role = "student" | "instructor" | "admin";

type User = {
  id?: string;
  role?: Role;
  email?: string;
} | null;

export type Course = {
  _id: string;
  title: string;
  description: string;
  category?: string;
  level?: string;
  tags?: string[];
  price?: number;
  image?: string;
  rating?: number | string;
  students?: number;
  lessons?: number;
  duration?: string;
  enrollmentStatus?: string | null; 
};

function normalizeStatus(s?: string | null) {
  const v = String(s ?? "").toLowerCase();
  if (v === "enrolled") return "enrolled";
  if (v === "not_enrolled") return "not_enrolled";
  return "unknown";
}

export function CourseModal({
  course,
  onClose,
  onEnroll,
  user,
}: CourseModalProps) {
  const status = normalizeStatus(course.enrollmentStatus);
  const enrolled = status === "enrolled";

  const canEnroll = !user || user.role === "student" || user.role === "admin";

  const tags = Array.isArray(course.tags) ? course.tags.filter(Boolean) : [];

  const stats = [
    {
      icon: Star,
      label: "Rating",
      value: course.rating ?? "0.0",
      iconClass: "text-[#4CE38F]",
    },
    {
      icon: Users,
      label: "Students",
      value: (course.students ?? 0).toLocaleString(),
      iconClass: "text-gray-600",
    },
    {
      icon: BookOpen,
      label: "Lessons",
      value: course.lessons ?? 0,
      iconClass: "text-gray-600",
    },
    {
      icon: Clock,
      label: "Duration",
      value: course.duration ?? "Self-paced",
      iconClass: "text-gray-600",
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-linear-to-r from-black/30 to-black/10 backdrop-blur-sm"
      style={{ animation: "fadeIn 0.2s ease-out" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[85vh] overflow-hidden border border-gray-200"
        style={{ animation: "slideUp 0.3s ease-out" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-36 bg-linear-to-br from-gray-50 to-gray-100 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(76,227,143,0.1),transparent_70%)]" />

          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 p-1.5 bg-white hover:bg-gray-50 rounded-full text-gray-600 hover:text-gray-900 transition-colors duration-200 shadow-sm border border-gray-200"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="absolute bottom-4 left-4 right-4 flex items-end gap-3">
            <div className="shrink-0 w-12 h-12 rounded-lg bg-white border border-gray-200 shadow-sm flex items-center justify-center overflow-hidden">
              {course.image ? (
                <img
                  src={course.image}
                  alt={course.title || "course"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon className="h-5 w-5 text-gray-400" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                    enrolled
                      ? "bg-[#4CE38F] text-white border-[#4CE38F]"
                      : "bg-white/80 text-gray-700 border-gray-200"
                  }`}
                >
                  <CheckCircle2 className="h-3 w-3" />
                  {enrolled ? "Enrolled" : "Available"}
                </span>

                {course.level && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-white/70 border border-gray-200 text-gray-700">
                    <Layers className="h-3 w-3 text-gray-500" />
                    {course.level}
                  </span>
                )}

                {course.category && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-white/70 border border-gray-200 text-gray-700">
                    <Tag className="h-3 w-3 text-gray-500" />
                    {course.category}
                  </span>
                )}
              </div>

              <h2 className="text-xl font-bold text-gray-900 leading-tight truncate">
                {course.title || "Untitled Course"}
              </h2>

              <div className="mt-1 flex items-center gap-1 text-[10px] text-gray-500">
                <Hash className="h-3 w-3" />
                <span className="truncate">{course._id}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(85vh-9rem)] p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="text-center p-2 bg-gray-50 rounded-lg border border-gray-200"
              >
                <stat.icon
                  className={`h-4 w-4 ${stat.iconClass} mx-auto mb-1`}
                />
                <div className="font-bold text-gray-900 text-sm mb-0.5">
                  {stat.value as any}
                </div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-1.5">
              <div className="w-0.5 h-4 bg-[#4CE38F] rounded-full" />
              Tags
            </h3>

            {tags.length ? (
              <div className="flex flex-wrap gap-2">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-1 rounded-full text-[11px] bg-[#4CE38F]/10 text-gray-800 border border-[#4CE38F]/20"
                  >
                    {t}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500">No tags available.</p>
            )}
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-1.5">
              <div className="w-0.5 h-4 bg-[#4CE38F] rounded-full" />
              About This Course
            </h3>
            <p className="text-gray-600 leading-relaxed text-xs">
              {course.description || "No description available."}
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-1.5">
              <div className="w-0.5 h-4 bg-[#4CE38F] rounded-full" />
              Course Info
            </h3>

            <div className="grid md:grid-cols-2 gap-2">
              {[
                { label: "Category", value: course.category ?? "—" },
                { label: "Level", value: course.level ?? "—" },
                { label: "Duration", value: course.duration ?? "—" },
                { label: "Lessons", value: String(course.lessons ?? 0) },
                { label: "Students", value: String(course.students ?? 0) },
                { label: "Rating", value: String(course.rating ?? "0.0") },
                {
                  label: "Enrollment Status",
                  value:
                    status === "enrolled"
                      ? "Enrolled"
                      : status === "not_enrolled"
                        ? "Not Enrolled"
                        : "N/A",
                },
                { label: "Image", value: course.image ? "Provided" : "None" },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between gap-3 p-2 bg-gray-50 rounded border border-gray-100"
                >
                  <span className="text-[11px] text-gray-500 uppercase tracking-wide">
                    {row.label}
                  </span>
                  <span className="text-xs text-gray-800 font-semibold text-right">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div
            className="flex flex-col md:flex-row items-center justify-between gap-3 p-3 bg-linear-to-r from-white/30 to-black/10 backdrop-blur-md
            shadow-[0_0_0_2px_rgba(0,0,0,0.08),0_0_14px_rgba(0,0,0,0.12)] rounded-lg"
          >
            <div>
              <div className="text-[10px] text-gray-500 mb-0.5 uppercase tracking-wide">
                Course Investment
              </div>
              <div className="text-xl font-bold text-gray-900">
                {typeof course.price === "number" && course.price > 0 ? (
                  <>LKR {course.price.toLocaleString()}</>
                ) : (
                  <span className="text-[#4CE38F]">Free</span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={onEnroll}
              disabled={enrolled || (user && !canEnroll) || undefined}
              className={`group/btn px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 text-sm ${
                enrolled
                  ? "bg-[#4CE38F]/15 text-[#4CE38F] cursor-not-allowed border border-[#4CE38F]/30"
                  : "bg-[#4CE38F] text-white hover:bg-[#4CE38F]/90 hover:shadow-lg hover:shadow-[#4CE38F]/20"
              } ${user && !canEnroll ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {enrolled ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Already Enrolled
                </>
              ) : (
                <>
                  Enroll Now
                  <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
