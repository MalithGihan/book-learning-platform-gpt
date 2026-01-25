/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";

import AIFeaturesSection from "../../components/ui/home/AIFeaturesSection";
import AwardsSection from "../../components/ui/home/AwardsSection";
import BrandsSection from "../../components/ui/home/BrandsSection";
import FeedbackCarousel from "../../components/ui/home/FeedbackCarousel";
import GetStartedSection from "../../components/ui/home/GetStartedSection";
import HeroSection from "../../components/ui/home/HeroSection";
import PageSectionOne from "../../components/ui/home/PageSectionOne";
import ScheduleForm from "../../components/ui/home/ScheduleForm";
import SpecialOffersSection from "../../components/ui/home/SpecialOffersSection";

import { useAiSearchMutation } from "../../features/ai/aiApi";
import { useGetCoursesQuery } from "../../features/courses/coursesApi";

import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  Star,
  Users,
  X,
} from "lucide-react";

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

  // optional UI fields (safe)
  image?: string;
  rating?: number | string;
  students?: number;
  lessons?: number;
  duration?: string;

  enrollmentStatus?: string | null;
};

function normalize(s: string) {
  return String(s || "")
    .toLowerCase()
    .trim();
}

function looksLikeAiPrompt(q: string) {
  const s = normalize(q);
  return (
    s.includes("i want to be") ||
    s.includes("what courses") ||
    s.includes("recommend") ||
    s.includes("roadmap") ||
    s.includes("engineer") ||
    s.split(" ").length >= 6
  );
}

export default function Home() {
  // TODO: replace with real user from your auth store
  const user: User = null;

  const { data, isLoading, error } = useGetCoursesQuery(
    { viewer: user ? "user" : "guest" },
    { refetchOnMountOrArgChange: true },
  ) as {
    data?: { courses?: Course[] } | Course[];
    isLoading: boolean;
    error: any;
  };

  const [aiSearch, { isLoading: isAiLoading }] = useAiSearchMutation();

  const [keyword, setKeyword] = useState("");

  // AI results
  const [aiCourses, setAiCourses] = useState<Course[]>([]);
  const [aiReply, setAiReply] = useState<string | null>(null);
  const [mode, setMode] = useState<"catalog" | "ai">("catalog");

  // Modal
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const courses: Course[] = useMemo(() => {
    return (Array.isArray(data) ? data : (data?.courses ?? [])) as Course[];
  }, [data]);

  const filteredCourses = useMemo(() => {
    if (mode === "ai") return aiCourses;

    const q = normalize(keyword);
    if (!q) return courses;

    return courses.filter((c) => {
      const title = normalize(c.title);
      const desc = normalize(c.description);
      const cat = normalize(c.category || "");
      const lvl = normalize(c.level || "");
      const tags = Array.isArray(c.tags) ? c.tags.map(normalize).join(" ") : "";

      return (
        title.includes(q) ||
        desc.includes(q) ||
        cat.includes(q) ||
        lvl.includes(q) ||
        tags.includes(q)
      );
    });
  }, [mode, aiCourses, courses, keyword]);

  console.log("AI Courses 3:", filteredCourses);

  const onEnrollClick = (courseId: string, alreadyEnrolled: boolean) => {
    if (alreadyEnrolled) return;

    // TODO: integrate your enrollment mutation here
    if (!user) {
      // e.g., navigate("/login")
      console.log("User not logged in. Redirect to login.");
      return;
    }

    console.log("Enroll requested for course:", courseId);
  };

  const handleHeroSearch = async (q: string) => {
    const text = q.trim();

    // reset
    if (!text) {
      setMode("catalog");
      setKeyword("");
      setAiCourses([]);
      setAiReply(null);
      return;
    }

    if (looksLikeAiPrompt(text)) {
      try {
        const res = await aiSearch({ message: text, limit: 12 }).unwrap();
        setMode("ai");
        setAiCourses((res.courses ?? []) as Course[]);
        setAiReply(res.reply ?? null);

        console.log("AI search response:", res);
      } catch {
        // fallback to normal keyword search
        setMode("catalog");
        setKeyword(text);
        setAiCourses([]);
        setAiReply(null);
      }
    } else {
      setMode("catalog");
      setKeyword(text);
      setAiCourses([]);
      setAiReply(null);
    }
  };

  const clearAiMode = () => {
    setMode("catalog");
    setAiCourses([]);
    setAiReply(null);
  };

  return (
    <section className="space-y-3">
      <HeroSection onSearch={handleHeroSearch} isSearching={isAiLoading} />

      {aiReply && mode === "ai" && (
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="rounded-md border border-slate-200 bg-white p-3 text-sm text-slate-700">
            <strong className="block mb-1">AI Recommendations:</strong>
            <div>{aiReply}</div>
          </div>
        </div>
      )}

      {/* AI reply banner */}
      {mode === "ai" && aiReply && (
        <div className="mx-auto max-w-7xl px-4 md:px-6 mb-4">
          <div className="rounded-md border border-slate-200 bg-white p-3 text-sm text-slate-700 flex items-start justify-between gap-3">
            <div>{aiReply}</div>
            <button
              type="button"
              onClick={clearAiMode}
              className="shrink-0 p-1 rounded hover:bg-slate-100"
              title="Clear AI results"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {isLoading && <div>Loading...</div>}
        {error && <div>Failed to load courses</div>}

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course, index) => (
            <CourseCard
              key={course._id}
              course={course}
              onViewDetails={() => setSelectedCourse(course)}
              onEnroll={() =>
                onEnrollClick(
                  course._id,
                  course.enrollmentStatus === "enrolled",
                )
              }
              user={user}
              delay={index * 80}
            />
          ))}
        </div>

        {selectedCourse && (
          <CourseModal
            course={selectedCourse}
            onClose={() => setSelectedCourse(null)}
            onEnroll={() => {
              onEnrollClick(
                selectedCourse._id,
                selectedCourse.enrollmentStatus === "enrolled",
              );
              setSelectedCourse(null);
            }}
            user={user}
          />
        )}
      </div>

      <BrandsSection />
      <PageSectionOne />
      <GetStartedSection />
      <AwardsSection />
      <AIFeaturesSection />
      <SpecialOffersSection />
      <FeedbackCarousel />
      <ScheduleForm />
    </section>
  );
}

function CourseModal({
  course,
  onClose,
  onEnroll,
  user,
}: {
  course: Course;
  onClose: () => void;
  onEnroll: () => void;
  user: User;
}) {
  const enrolled = course.enrollmentStatus === "enrolled";
  const canEnroll = !user || user.role === "student" || user.role === "admin";

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
      value: course.duration ?? "0 hrs",
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
        {/* Header */}
        <div className="relative h-32 bg-linear-to-br from-gray-50 to-gray-100 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(76,227,143,0.1),transparent_70%)]" />

          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 p-1.5 bg-white hover:bg-gray-50 rounded-full text-gray-600 hover:text-gray-900 transition-colors duration-200 shadow-sm border border-gray-200"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="absolute bottom-4 left-4 right-4">
            {course.level && (
              <span
                className="inline-block px-2 py-0.5 rounded text-sm font-semibold mb-2 bg-linear-to-r from-white/30 to-black/10 backdrop-blur-md
                shadow-[0_0_0_2px_rgba(0,0,0,0.08),0_0_14px_rgba(0,0,0,0.12)]"
              >
                {course.level}
              </span>
            )}
            <h2 className="text-xl font-bold text-gray-900 mb-1 leading-tight">
              {course.title || "Untitled Course"}
            </h2>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(85vh-8rem)] p-4">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-2 mb-4">
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

          {/* About */}
          <div className="mb-4">
            <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-1.5">
              <div className="w-0.5 h-4 bg-[#4CE38F] rounded-full" />
              About This Course
            </h3>
            <p className="text-gray-600 leading-relaxed text-xs">
              {course.description || "No description available."}
            </p>
          </div>

          {/* Learn */}
          <div className="mb-4">
            <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-1.5">
              <div className="w-0.5 h-4 bg-[#4CE38F] rounded-full" />
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

          {/* Price + CTA */}
          <div
            className="flex flex-col md:flex-row items-center justify-between gap-3 p-3 bg-linear-to-r from-white/30 to-black/10 backdrop-blur-md
            shadow-[0_0_0_2px_rgba(0,0,0,0.08),0_0_14px_rgba(0,0,0,0.12)] rounded-lg"
          >
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

function CourseCard({
  course,
  onViewDetails,
  onEnroll,
  delay = 0,
}: {
  course: Course;
  onViewDetails: () => void;
  onEnroll: () => void;
  user: User;
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

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(76,227,143,0.08),transparent_70%)]" />

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
          <div className="w-px h-2.5 bg-gray-300" />
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
