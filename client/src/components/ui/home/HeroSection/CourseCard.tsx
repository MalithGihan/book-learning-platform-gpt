import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  Star,
  Users,
  Tag,
  Layers,
  Hash,
} from "lucide-react";

type CourseCardProps = {
  course: Course;
  onViewDetails: () => void;
  onEnroll: () => void;
  user: User;
  delay?: number;
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
  const v = (s ?? "").toLowerCase();
  if (v === "enrolled") return "enrolled";
  if (v === "not_enrolled") return "not_enrolled";
  return "unknown";
}

export function CourseCard({
  course,
  onViewDetails,
  onEnroll,
  delay = 0,
}: CourseCardProps) {
  const status = normalizeStatus(course.enrollmentStatus);
  const enrolled = status === "enrolled";

  const tags = Array.isArray(course.tags) ? course.tags.filter(Boolean) : [];
  const visibleTags = tags.slice(0, 4);
  const remainingTags = tags.length - visibleTags.length;

  return (
    <div
      className="group relative overflow-hidden transition-all duration-300 cursor-pointer bg-white rounded-lg border border-gray-200 hover:shadow-lg hover:border-[#4CE38F]/30"
      style={{ animation: `fadeInUp 0.4s ease-out ${delay}ms both` }}
      onClick={onViewDetails}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") onViewDetails();
      }}
    >
      <div className="relative h-36 bg-linear-to-br from-gray-50 to-gray-100 overflow-hidden">
        <div className="flex items-center justify-center h-full">
          <img
            src={course.image || "/images/icon3.png"}
            alt={course.title || "course"}
            className="w-12 h-12 rounded-full object-cover"
          />
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(76,227,143,0.08),transparent_70%)]" />

        <div className="absolute top-2 right-2">
          {enrolled ? (
            <div className="flex items-center gap-1 bg-[#4CE38F] text-white px-2 py-1 rounded-full text-[10px] font-semibold shadow-sm">
              <CheckCircle2 className="h-3 w-3" />
              Enrolled
            </div>
          ) : (
            <div className="flex items-center gap-1 bg-white/90 text-gray-700 px-2 py-1 rounded-full text-[10px] font-semibold shadow-sm border border-gray-200">
              <Layers className="h-3 w-3" />
              Available
            </div>
          )}
        </div>

        <div className="absolute bottom-2 left-2 right-2 flex items-center gap-2 text-[10px] text-gray-900">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-[#4CE38F] text-[#4CE38F]" />
            <span className="font-medium">{course.rating ?? "0.0"}</span>
          </div>
          <div className="w-px h-2.5 bg-gray-300" />
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{(course.students ?? 0).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          {course.level && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-50 border border-gray-200 rounded text-[10px] font-semibold text-gray-700">
              <Layers className="h-3 w-3 text-gray-500" />
              {course.level}
            </span>
          )}

          {course.category && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-50 border border-gray-200 rounded text-[10px] font-semibold text-gray-700">
              <Tag className="h-3 w-3 text-gray-500" />
              {course.category}
            </span>
          )}
        </div>

        <h3 className="font-semibold text-gray-900 text-sm leading-tight group-hover:text-gray-700 transition-colors line-clamp-2 min-h-10">
          {course.title || "Untitled Course"}
        </h3>

        <p className="text-gray-600 text-xs leading-relaxed line-clamp-2 min-h-8">
          {course.description || "No description available."}
        </p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {visibleTags.map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded-full text-[10px] bg-[#4CE38F]/10 text-gray-800 border border-[#4CE38F]/20"
              >
                {t}
              </span>
            ))}
            {remainingTags > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-gray-50 text-gray-700 border border-gray-200">
                +{remainingTags}
              </span>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 py-2">
          <div className="flex items-center gap-1 text-[10px] text-gray-600">
            <Clock className="h-3 w-3 text-[#4CE38F]" />
            <span>{course.duration || "Self-paced"}</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-gray-600">
            <BookOpen className="h-3 w-3 text-[#4CE38F]" />
            <span>{course.lessons ?? 0} lessons</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-gray-500">
          <div className="flex items-center gap-1">
            <Hash className="h-3 w-3" />
            <span className="truncate max-w-42.5">{course._id}</span>
          </div>
          <span className="uppercase tracking-wide">
            {status === "enrolled"
              ? "enrolled"
              : status === "not_enrolled"
                ? "not enrolled"
                : "status n/a"}
          </span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div>
            {typeof course.price === "number" && course.price > 0 ? (
              <div className="space-y-0.5">
                <div className="text-[9px] text-gray-500 uppercase">Price</div>
                <div className="text-base font-bold text-gray-900">
                  LKR {course.price.toLocaleString()}
                </div>
              </div>
            ) : (
              <div className="text-base font-bold text-[#4CE38F]">Free</div>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEnroll();
            }}
            disabled={enrolled}
            className={`px-3 py-2 rounded-lg font-semibold transition-all text-xs ${
              enrolled
                ? "bg-[#4CE38F]/15 text-[#4CE38F] cursor-not-allowed"
                : "bg-[#4CE38F] text-white hover:bg-[#3AB574]"
            }`}
          >
            <span className="flex items-center gap-1">
              {enrolled ? "Enrolled" : "Enroll"}
              {!enrolled && <ChevronRight className="h-3 w-3" />}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
