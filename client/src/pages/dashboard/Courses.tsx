/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Star,
  Users,
  Clock,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  X,
  Filter,
  Search,
  Grid3x3,
  List,
  RefreshCw,
} from "lucide-react";

import { useAppSelector } from "../../app/hooks";
import { useGetCoursesQuery } from "../../features/courses/coursesApi";
import ErrorPage from "../../components/error/error";
import FullScreenLoader from "../../components/common/FullScreenLoader";

interface Course {
  _id: string;
  title?: string;
  description?: string;
  price?: number;
  enrollmentStatus?: "enrolled" | "not_enrolled";
  level?: string;
  rating?: number;
  students?: number;
  duration?: string;
  lessons?: number;
  image?: string;
  instructor?: string;
  category?: string;
  tags?: string[];
  lastUpdated?: string;
  language?: string;
  certificate?: boolean;
}

type CoursesResponse = { ok?: boolean; courses?: Course[] } | Course[];

function normalizeCourses(data: CoursesResponse | undefined): Course[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  return data.courses ?? [];
}

function CourseCard({
  course,
  onViewDetails,
  onEnroll,
  delay = 0,
}: {
  course: Course;
  onViewDetails: () => void;
  onEnroll: () => void;
  delay?: number;
}) {
  const enrolled = course.enrollmentStatus === "enrolled";

  return (
    <div
      className="group relative overflow-hidden transition-all duration-300 cursor-pointer bg-white rounded-lg border border-gray-200 hover:shadow-lg hover:border-[#4CE38F]/30"
      style={{ animation: `fadeInUp 0.4s ease-out ${delay}ms both` }}
      onClick={onViewDetails}
    >
      <div className="relative h-36 bg-linear-to-br from-gray-50 to-gray-100 overflow-hidden">
        <div className="flex items-center justify-center h-full">
          <img
            src={course.image || "/images/icon3.png"}
            alt={course.title || "course"}
            className="w-12 h-12 rounded-full object-cover"
          />
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(76,227,143,0.08),transparent_70%)]"></div>

        {enrolled && (
          <div className="absolute top-2 right-2">
            <div className="flex items-center gap-1 bg-[#4CE38F] text-white px-2 py-1 rounded-full text-[10px] font-semibold shadow-sm">
              <CheckCircle2 className="h-3 w-3" />
              Enrolled
            </div>
          </div>
        )}

        <div className="absolute bottom-2 left-2 right-2 flex items-center gap-2 text-[10px] text-gray-900">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-[#4CE38F] text-[#4CE38F]" />
            <span className="font-medium">{course.rating ?? "0.0"}</span>
          </div>
          <div className="w-px h-2.5 bg-gray-300"></div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{(course.students ?? 0).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-2">
        {course.level && (
          <span className="inline-block px-2 py-0.5 bg-gray-50 border border-gray-200 rounded text-[10px] font-semibold text-gray-700">
            {course.level}
          </span>
        )}

        <h3 className="font-semibold text-gray-900 text-sm leading-tight group-hover:text-gray-700 transition-colors line-clamp-2 min-h-10">
          {course.title || "Untitled Course"}
        </h3>

        <p className="text-gray-600 text-xs leading-relaxed line-clamp-2 min-h-8">
          {course.description || "No description available."}
        </p>

        <div className="grid grid-cols-2 gap-2 py-2">
          <div className="flex items-center gap-1 text-[10px] text-gray-600">
            <Clock className="h-3 w-3 text-[#4CE38F]" />
            <span>{course.duration || "Self-paced"}</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-gray-600">
            <BookOpen className="h-3 w-3 text-[#4CE38F]" />
            <span>{course.lessons || 0} lessons</span>
          </div>
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

function CourseDetailModal({
  course,
  onClose,
  onEnroll,
}: {
  course: Course;
  onClose: () => void;
  onEnroll: () => void;
}) {
  const enrolled = course.enrollmentStatus === "enrolled";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-48 bg-linear-to-br from-gray-50 to-gray-100">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 p-2 bg-white hover:bg-gray-50 rounded-full shadow-sm border border-gray-200"
          >
            <X className="h-4 w-4 text-gray-700" />
          </button>

          <div className="absolute bottom-4 left-4 right-4">
            {course.level && (
              <span className="inline-block px-2 py-1 rounded text-[10px] font-semibold mb-2 bg-[#4CE38F]/15 text-[#4CE38F]">
                {course.level}
              </span>
            )}
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {course.title || "Untitled Course"}
            </h2>
            {course.instructor && (
              <p className="text-gray-600 text-xs">
                Instructor: {course.instructor}
              </p>
            )}
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-12rem)] p-6">
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
              <div className="w-1 h-5 bg-[#4CE38F] rounded-full"></div>
              About This Course
            </h3>
            <p className="text-gray-600 text-xs leading-relaxed">
              {course.description || "No description available."}
            </p>
          </div>

          <div className="flex items-center justify-between gap-3 p-4 bg-linear-to-r from-gray-50 to-[#4CE38F]/5 rounded-lg border border-gray-200">
            <div>
              <div className="text-[10px] text-gray-500 mb-1 uppercase">
                Course Investment
              </div>
              <div className="text-2xl font-bold text-gray-900">
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
              disabled={enrolled}
              className={`px-5 py-2.5 rounded-lg font-semibold transition-all text-sm ${
                enrolled
                  ? "bg-[#4CE38F]/15 text-[#4CE38F] cursor-not-allowed border border-[#4CE38F]/30"
                  : "bg-[#4CE38F] text-white hover:bg-[#3AB574] hover:shadow-lg"
              }`}
            >
              {enrolled ? (
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Already Enrolled
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Enroll Now
                  <ChevronRight className="h-4 w-4" />
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Courses() {
  const user = useAppSelector((s) => s.auth.user);
  const nav = useNavigate();
  const loc = useLocation();

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data, isLoading, error, refetch, isFetching } = useGetCoursesQuery(
    { viewer: user ? "user" : "guest" },
    { refetchOnMountOrArgChange: true }
  ) as any;

  const courses = useMemo(() => normalizeCourses(data), [data]);

  // ✅ SEARCH WORKS HERE
  const filteredCourses = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return courses;

    return courses.filter((c) => {
      const hay = [
        c.title,
        c.description,
        c.category,
        c.instructor,
        c.level,
        ...(c.tags ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return hay.includes(q);
    });
  }, [courses, searchQuery]);

  function handleEnroll(course: Course) {
    const enrolled = course.enrollmentStatus === "enrolled";
    if (enrolled) return;

    if (!user) {
      nav("/login", { state: { from: loc.pathname } });
      return;
    }

    const price = Number(course.price ?? 0);
    if (price > 0) {
      nav(`/checkout/${course._id}`);
    } else {
      console.log("Enroll free:", course._id);
    }

    setSelectedCourse(null);
  }

  if (isLoading) return <FullScreenLoader label="Loading ..." />;
  if (!isLoading && error) return <ErrorPage />;
  

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Courses</h1>
          <p className="text-xs text-gray-600 mt-0.5">
            Browse and enroll in courses
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            aria-label="Refresh"
            title="Refresh"
          >
            <RefreshCw
              className={`h-4 w-4 text-gray-700 ${
                isFetching ? "animate-spin" : ""
              }`}
            />
          </button>

          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "grid" ? "bg-gray-100" : "hover:bg-gray-50"
            }`}
          >
            <Grid3x3 className="h-4 w-4 text-gray-700" />
          </button>

          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "list" ? "bg-gray-100" : "hover:bg-gray-50"
            }`}
          >
            <List className="h-4 w-4 text-gray-700" />
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mb-10">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-gray-200 bg-white"
          />
        </div>
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm"
        >
          <Filter className="h-4 w-4" />
          Filter
        </button>
      </div>

      {!isLoading && !error && (
        <>
          <div
            className={`grid gap-4 ${
              viewMode === "grid"
                ? "sm:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1"
            }`}
          >
            {filteredCourses.map((course: Course, idx: number) => (
              <CourseCard
                key={course._id}
                course={course}
                onViewDetails={() => setSelectedCourse(course)}
                onEnroll={() => handleEnroll(course)}
                delay={idx * 60}
              />
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-900 mb-1">
                No courses found
              </p>
              <p className="text-xs text-gray-600">Try adjusting your search</p>
            </div>
          )}
        </>
      )}

      {selectedCourse && (
        <CourseDetailModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
          onEnroll={() => handleEnroll(selectedCourse)}
        />
      )}
    </div>
  );
}
