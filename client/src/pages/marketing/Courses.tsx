/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { useGetCoursesQuery } from "../../features/courses/coursesApi";
import {
  X,
  Clock,
  Users,
  BookOpen,
  ChevronRight,
  Star,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import FullScreenLoader from "../../components/common/FullScreenLoader";

type CourseVM = {
  _id: string;
  title?: string;
  description?: string;
  price?: number;
  enrollmentStatus?: "enrolled" | "not_enrolled";
  duration?: string;
  students?: number;
  lessons?: number;
  level?: string;
  instructor?: string;
  rating?: number;
};

export default function MarketingCourses() {
  const [selectedCourse, setSelectedCourse] = useState<CourseVM | null>(null);
  const [filter, setFilter] = useState<"all" | "enrolled" | "available">("all");

  const { user, status } = useAppSelector((s) => s.auth);
  const { data, isLoading, error } = useGetCoursesQuery(
    { viewer: user ? "user" : "guest" },
    { refetchOnMountOrArgChange: true }
  );

  const courses = (data ?? []) as CourseVM[];
  const nav = useNavigate();
  const loc = useLocation();

  const filteredCourses = courses.filter((c) => {
    if (filter === "enrolled") return c.enrollmentStatus === "enrolled";
    if (filter === "available") return c.enrollmentStatus === "not_enrolled";
    return true;
  });

  function onEnrollClick(courseId: string, enrolled?: boolean) {
    if (enrolled) return;

    if (!user) {
      nav("/login", {
        state: { from: `/checkout/${courseId}`, back: loc.pathname },
      });
      return;
    }

    if (user.role !== "student" && user.role !== "admin") {
      return;
    }

    nav(`/checkout/${courseId}`);
  }

  if (isLoading) return <FullScreenLoader label="Loading courses..." />;

  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-6 py-5 md:py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 space-y-6">
              <div
                className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-white/30 to-black/10 backdrop-blur-md
           shadow-[0_0_0_2px_rgba(0,0,0,0.08),0_0_14px_rgba(0,0,0,0.12)] rounded-full"
              >
                <Sparkles className="h-4 w-4 text-[#4CE38F]" />
                <span className="text-sm font-medium text-[#4CE38F]">
                  Premium Learning Experience
                </span>
              </div>

              <h1 className="text-3xl md:text-6xl font-bold text-black leading-tight">
                Elevate Your
                <span className="block text-xl text-transparent bg-clip-text bg-linear-to-r from-[#4CE38F] to-black">
                  Skills Today
                </span>
              </h1>

              <p className="text-base font-semibold text-black/60 max-w-3xl leading-relaxed">
                Master cutting-edge skills with industry experts. Transform your
                career with courses designed for the future.
              </p>

              <div className="flex items-center gap-6 pt-4">
                <div
                  className="text-center p-4 bg-linear-to-r from-white/30 to-black/10 backdrop-blur-md
           shadow-[0_0_0_2px_rgba(0,0,0,0.08),0_0_14px_rgba(0,0,0,0.12)] rounded"
                >
                  <div className="text-2xl font-bold text-black">
                    {courses.length}+
                  </div>
                  <div className="text-sm text-black">Courses</div>
                </div>
                <div className="w-px h-12 bg-black"></div>
                <div
                  className="text-center p-4 bg-linear-to-r from-white/30 to-black/10 backdrop-blur-md
           shadow-[0_0_0_2px_rgba(0,0,0,0.08),0_0_14px_rgba(0,0,0,0.12)] rounded"
                >
                  <div className="text-2xl font-bold text-black">
                    {courses.reduce((sum, c) => sum + (c.students || 0), 0)}+
                  </div>
                  <div className="text-sm text-black">Students</div>
                </div>
              </div>
            </div>

            {status === "authed" && (
              <Link
                to="/dashboard"
                className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-black font-semibold hover:bg-[#4CE38F] transition-all duration-300 shadow-lg hover:shadow-[#4CE38F]/20"
              >
                Dashboard
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="mt-12 flex gap-3 flex-wrap">
            {[
              {
                key: "all" as const,
                label: "All Courses",
                count: courses.length,
              },
              {
                key: "available" as const,
                label: "Available",
                count: courses.filter(
                  (c) => c.enrollmentStatus === "not_enrolled"
                ).length,
              },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`group relative rounded-lg px-4 py-2 text-sm font-medium text-slate-700 shadow-sm border border-slate-200 hover:border-slate-300 hover:shadow-md hover:text-black transition-all duration-200`}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {tab.label}
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      filter === tab.key ? "bg-[#4CE38F]" : "bg-black/10"
                    }`}
                  >
                    {tab.count}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {error && (
          <div className="mb-8 p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400">
            <p className="font-semibold">
              Failed to load courses. Please try again.
            </p>
          </div>
        )}

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course, index) => (
            <CourseCard
              key={course._id}
              course={course}
              onViewDetails={() => setSelectedCourse(course)}
              onEnroll={() =>
                onEnrollClick(
                  course._id,
                  course.enrollmentStatus === "enrolled"
                )
              }
              user={user}
              delay={index * 80}
            />
          ))}
        </div>

        {filteredCourses.length === 0 && !isLoading && (
          <div className="text-center py-24">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 mb-6">
              <BookOpen className="h-10 w-10 text-white/30" />
            </div>
            <h3 className="text-base font-semibold text-white mb-3">
              No courses found
            </h3>
            <p className="text-white/50 text-sm">
              {filter === "enrolled"
                ? "You haven't enrolled in any courses yet. Start learning today!"
                : "Check back soon for new courses."}
            </p>
          </div>
        )}
      </div>

      {selectedCourse && (
        <CourseModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
          onEnroll={() => {
            onEnrollClick(
              selectedCourse._id,
              selectedCourse.enrollmentStatus === "enrolled"
            );
            setSelectedCourse(null);
          }}
          user={user}
        />
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
      `}</style>
    </div>
  );
}

function CourseCard({
  course,
  onViewDetails,
  onEnroll,
  user,
  delay,
}: {
  course: any;
  onViewDetails: () => void;
  onEnroll: () => void;
  user: any;
  delay: number;
}) {
  const enrolled = course.enrollmentStatus === "enrolled";
  const canEnroll = !user || user.role === "student" || user.role === "admin";

  return (
    <div
      className="group relative overflow-hidden transition-all duration-500 cursor-pointer bg-white rounded-md shadow-[0_0_0_2px_rgba(0,0,0,0.08),0_0_14px_rgba(0,0,0,0.12)]"
      style={{ animation: `fadeInUp 0.6s ease-out ${delay}ms both` }}
      onClick={onViewDetails}
    >

      <div className="relative h-40 bg-linear-to-br from-gray-50 to-gray-100 overflow-hidden">
        <div className="flex items-center justify-center h-full">
          <img
            src={course.image ? course.image : "/images/icon3.png"}
            alt={course.title}
            className="w-14 h-14 rounded-full object-cover"
          />
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(76,227,143,0.08),transparent_70%)]"></div>

        {enrolled && (
          <div className="absolute top-3 right-3 z-10">
            <div className="flex items-center gap-1.5 bg-[#4CE38F] text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-md">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Enrolled
            </div>
          </div>
        )}

        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-3 text-xs text-black">
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-[#4CE38F] text-[#4CE38F]" />
            <span className="font-medium">{course.rating || "0.0"}</span>
          </div>
          <div className="w-px h-3 bg-white/30"></div>
          <div className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            <span>{(course.students || 0).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-3">
        {course.level && (
          <div className="inline-flex">
            <span
              className={`px-2.5 py-1 text-black bg-linear-to-r from-white/30 to-black/10 backdrop-blur-md
           shadow-[0_0_0_2px_rgba(0,0,0,0.08),0_0_14px_rgba(0,0,0,0.12)] rounded-full text-xs font-semibold`}
            >
              {course.level}
            </span>
          </div>
        )}

        <h3 className="font-semibold text-gray-900 text-lg leading-snug group-hover:text-black/70 transition-colors duration-300 line-clamp-2 min-h-12">
          {course.title || "Untitled Course"}
        </h3>

        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 min-h-10">
          {course.description || "No description available."}
        </p>

        <div className="grid grid-cols-2 gap-2.5 py-2">
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <Clock className="h-3.5 w-3.5 text-[#4CE38F]" />
            <span>{course.duration || "Self-paced"}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <BookOpen className="h-3.5 w-3.5 text-[#4CE38F]" />
            <span>{course.lessons || 0} lessons</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            {typeof course.price === "number" ? (
              <div className="space-y-0.5">
                <div className="text-xs text-gray-400">Price</div>
                <div className="text-xl font-bold text-gray-900">
                  LKR {course.price.toLocaleString()}
                </div>
              </div>
            ) : (
              <div className="text-xl font-bold text-[#4CE38F]">Free</div>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEnroll();
            }}
            disabled={enrolled || (user && !canEnroll) || undefined}
            className={`group/btn relative px-4 py-2.5 rounded-md font-semibold transition-all duration-300 text-sm overflow-hidden ${
              enrolled
                ? "bg-[#4CE38F]/15 text-[#4CE38F] cursor-not-allowed"
                : "bg-[#4CE38F] text-white hover:bg-[#4CE38F]/90 hover:shadow-lg hover:shadow-[#4CE38F]/20"
            } ${user && !canEnroll ? "opacity-50 cursor-not-allowed" : ""}`}
            title={user && !canEnroll ? "Only students can enroll" : ""}
          >
            <span className="relative z-10 flex items-center gap-1.5">
              {enrolled ? "Enrolled" : "Enroll Now"}
              {!enrolled && (
                <ChevronRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
              )}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

function CourseModal({
  course,
  onClose,
  onEnroll,
  user,
}: {
  course: any;
  onClose: () => void;
  onEnroll: () => void;
  user: any;
}) {
  const enrolled = course.enrollmentStatus === "enrolled";
  const canEnroll = !user || user.role === "student" || user.role === "admin";

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
        {/* Compact Header */}
        <div className="relative h-32 bg-linear-to-br from-gray-50 to-gray-100 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(76,227,143,0.1),transparent_70%)]"></div>

          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 p-1.5 bg-white hover:bg-gray-50 rounded-full text-gray-600 hover:text-gray-900 transition-colors duration-200 shadow-sm border border-gray-200"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="absolute bottom-4 left-4 right-4">
            {course.level && (
              <span
                className={`inline-block px-2 py-0.5 rounded text-sm font-semibold mb-2 bg-linear-to-r from-white/30 to-black/10 backdrop-blur-md
           shadow-[0_0_0_2px_rgba(0,0,0,0.08),0_0_14px_rgba(0,0,0,0.12)]`}
              >
                {course.level}
              </span>
            )}
            <h2 className="text-xl font-bold text-gray-900 mb-1 leading-tight">
              {course.title || "Untitled Course"}
            </h2>
            {course.instructor && (
              <p className="text-gray-600 text-xs">
                Instructor: {course.instructor}
              </p>
            )}
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(85vh-8rem)] p-4">
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[
              {
                icon: Star,
                label: "Rating",
                value: course.rating || "0.0",
                color: "[#4CE38F]",
              },
              {
                icon: Users,
                label: "Students",
                value: (course.students || 0).toLocaleString(),
                color: "gray-600",
              },
              {
                icon: BookOpen,
                label: "Lessons",
                value: course.lessons || 0,
                color: "gray-600",
              },
              {
                icon: Clock,
                label: "Duration",
                value: course.duration || "0 hrs",
                color: "gray-600",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="text-center p-2 bg-gray-50 rounded-lg border border-gray-200"
              >
                <stat.icon
                  className={`h-4 w-4 text-${stat.color} mx-auto mb-1`}
                />
                <div className="font-bold text-gray-900 text-sm mb-0.5">
                  {stat.value}
                </div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-1.5">
              <div className="w-0.5 h-4 bg-[#4CE38F] rounded-full"></div>
              About This Course
            </h3>
            <p className="text-gray-600 leading-relaxed text-xs">
              {course.description || "No description available."}
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-1.5">
              <div className="w-0.5 h-4 bg-[#4CE38F] rounded-full"></div>
              What You'll Learn
            </h3>
            <div className="grid md:grid-cols-2 gap-2">
              {[
                "Build production-ready projects",
                "Master industry best practices",
                "Earn a certificate of completion",
                "Access to lifetime updates",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-1.5 p-2 bg-gray-50 rounded border border-gray-100"
                >
                  <div className="shrink-0 w-4 h-4 rounded-full bg-[#4CE38F]/15 flex items-center justify-center mt-0.5">
                    <CheckCircle2 className="h-2.5 w-2.5 text-[#4CE38F]" />
                  </div>
                  <span className="text-gray-700 leading-relaxed text-xs">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-3 bg-linear-to-r from-white/30 to-black/10 backdrop-blur-md
           shadow-[0_0_0_2px_rgba(0,0,0,0.08),0_0_14px_rgba(0,0,0,0.12)] rounded-lg">
            <div>
              <div className="text-[10px] text-gray-500 mb-0.5 uppercase tracking-wide">
                Course Investment
              </div>
              <div className="text-xl font-bold text-gray-900">
                {typeof course.price === "number" ? (
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

