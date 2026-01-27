/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import { X , Sparkles} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import HeroSection from "../../components/ui/home/HeroSection";
import BrandsSection from "../../components/ui/home/BrandsSection";
import PageSectionOne from "../../components/ui/home/PageSectionOne";
import GetStartedSection from "../../components/ui/home/GetStartedSection";
import AwardsSection from "../../components/ui/home/AwardsSection";
import AIFeaturesSection from "../../components/ui/home/AIFeaturesSection";
import SpecialOffersSection from "../../components/ui/home/SpecialOffersSection";
import FeedbackCarousel from "../../components/ui/home/FeedbackCarousel";
import ScheduleForm from "../../components/ui/home/ScheduleForm";

import { CourseCard } from "../../components/ui/home/HeroSection/CourseCard";
import { CourseModal } from "../../components/ui/home/HeroSection/CourseModal";

import { useAiSearchMutation } from "../../features/ai/aiApi";
import { useAppSelector } from "../../app/hooks";

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
  enrollmentStatus?: "enrolled" | "not_enrolled" | null;
};

const HOME_AI_UI_KEY = "home_ai_ui_v1";

export default function Home() {
  const { user } = useAppSelector((s) => s.auth) as { user: User };

  const nav = useNavigate();
  const loc = useLocation();

  const [aiSearch, aiState] = useAiSearchMutation({
    fixedCacheKey: "home-ai-search",
  });

  const { data, isLoading: isAiLoading, error: aiError, reset } = aiState;

  const [filter, setFilter] = useState<"all" | "enrolled" | "available">("all");
  const [queryText, setQueryText] = useState("");

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    try {
      sessionStorage.setItem(
        HOME_AI_UI_KEY,
        JSON.stringify({ queryText, filter }),
      );
    } catch (e) {
      console.warn("Failed to save UI persist", e);
    }
  }, [queryText, filter]);

  useEffect(() => {
    sessionStorage.setItem(
      HOME_AI_UI_KEY,
      JSON.stringify({ queryText, filter }),
    );
  }, [queryText, filter]);

  const aiCourses: Course[] = useMemo(() => {
    return (data?.courses ?? []) as Course[];
  }, [data]);

  const aiReply = data?.reply ?? null;

  const showResults = queryText.trim().length > 0;

  useEffect(() => {
    const q = queryText.trim();
    if (!q) return;
    if (data || isAiLoading) return;
    aiSearch({ message: q, limit: 12 });
  }, [queryText]);

  async function handleHeroSearch(q: string) {
    const text = q.trim();
    setQueryText(text);

    if (!text) {
      reset();
      setSelectedCourse(null);
      return;
    }

    try {
      await aiSearch({ message: text, limit: 12 }).unwrap();
    } catch {
      // keep UI, but results will be empty + error shown
    }
  }

  function clearSearch() {
    setQueryText("");
    reset();
    setSelectedCourse(null);
  }

  function onEnrollClick(courseId: string, enrolled?: boolean) {
    if (enrolled) return;

    if (!user) {
      nav("/login", {
        state: { from: `/checkout/${courseId}`, back: loc.pathname },
      });
      return;
    }

    if (user.role !== "student" && user.role !== "admin") return;

    nav(`/checkout/${courseId}`);
  }

  const filteredResults = useMemo(() => {
    if (filter === "all") return aiCourses;

    if (filter === "enrolled") {
      return aiCourses.filter((c) => c.enrollmentStatus === "enrolled");
    }
    return aiCourses.filter((c) => c.enrollmentStatus !== "enrolled");
  }, [aiCourses, filter]);

  return (
    <section className="space-y-3">
      <HeroSection onSearch={handleHeroSearch} isSearching={isAiLoading} />

      {showResults && (
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-6">
          {aiReply && (
            <div className="mb-10">
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col">
                  <div className="flex flex-row items-center gap-2 mb-4">
                    <Sparkles size={14} color="#4CE38F"/>
                    <span className="text-xs font-semibold text-black uppercase tracking-wide">
                      AI Assistant
                    </span>
                  </div>
                  <p className="bg-black px-3 py-1 rounded-full text-xs font-semibold text-white leading-relaxed">
                    {aiReply}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={clearSearch}
                  className="shrink-0 p-2 rounded-lg hover:bg-black/10 transition-all duration-200 group"
                  title="Clear results"
                  aria-label="Clear search results"
                >
                  <X className="h-4 w-4 text-black  transition-colors" />
                </button>
              </div>
            </div>
          )}

          <div className="mb-6">
            <div className="inline-flex items-center gap-2 p-1 bg-slate-100 rounded-lg border border-slate-200/80 shadow-sm">
              {(["all", "enrolled", "available"] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setFilter(k)}
                  className={`relative px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    filter === k
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                  }`}
                >
                  {filter === k && (
                    <span className="absolute inset-0 rounded-md bg-linear-to-br from-blue-500/5 to-indigo-500/5"></span>
                  )}
                  <span className="relative">
                    {k === "all"
                      ? "All Courses"
                      : k === "enrolled"
                        ? "My Courses"
                        : "Available"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {isAiLoading && (
            <div className="flex items-center gap-3 mb-6 p-4 rounded-lg bg-blue-50/50 border border-blue-100">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-[#4CE38F] rounded-full animate-bounce"></span>
                <span
                  className="w-2 h-2 bg-[#4CE38F] rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></span>
                <span
                  className="w-2 h-2 bg-[#4CE38F] rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></span>
              </div>
              <span className="text-sm text-[#4CE38F] font-medium">
                Searching courses...
              </span>
            </div>
          )}

          {aiError && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                  <X className="w-3 h-3 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-900">
                    Search Failed
                  </p>
                  <p className="text-xs text-red-700 mt-0.5">
                    AI search encountered an error. Please try again.
                  </p>
                </div>
              </div>
            </div>
          )}

          {!isAiLoading && filteredResults.length === 0 ? (
            <div className="py-16 text-center animate-in fade-in zoom-in-95 duration-500">
              <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">
                No courses found
              </h3>
              <p className="text-sm text-slate-600">
                We couldn't find any courses matching{" "}
                <span className="font-semibold text-slate-900">
                  "{queryText}"
                </span>
              </p>
              <button
                onClick={clearSearch}
                className="mt-4 text-sm text-black/50 hover:text-black font-medium hover:underline transition-colors"
              >
                Clear search and try again
              </button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredResults.map((course, index) => (
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
          )}

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
      )}

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
