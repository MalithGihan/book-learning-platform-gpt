import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { useGetCoursesQuery } from "../../features/courses/coursesApi";
import {
  BookOpen,
  ArrowRight,
  Sparkles
} from "lucide-react";
import FullScreenLoader from "../../components/common/FullScreenLoader";
import ErrorPage from "../../components/error/error";
import { CourseModal } from "../../components/ui/home/HeroSection/CourseModal";
import { CourseCard, type Course } from "../../components/ui/home/HeroSection/CourseCard";


export default function MarketingCourses() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [filter, setFilter] = useState<"all" | "enrolled" | "available">("all");

  const { user, status } = useAppSelector((s) => s.auth);
  const { data, isLoading, error } = useGetCoursesQuery(
    { viewer: user ? "user" : "guest" },
    { refetchOnMountOrArgChange: true }
  );

  const courses = (data ?? []) as Course[];
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
                className="group flex items-center rounded-lg px-4 py-2 bg-white text-sm font-medium text-black shadow-sm hover:shadow-md hover:text-black/80 transition-all duration-200"
              >
                Dashboard
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>

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
          <ErrorPage />
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

