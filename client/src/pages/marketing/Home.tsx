import { useMemo, useState } from "react";
import { X } from "lucide-react";
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

export default function Home() {
  const { user } = useAppSelector((s) => s.auth) as { user: User };

  const nav = useNavigate();
  const loc = useLocation();

  const [aiSearch, { isLoading: isAiLoading, error: aiError }] =
    useAiSearchMutation();

  const [filter, setFilter] = useState<"all" | "enrolled" | "available">("all");

  const [queryText, setQueryText] = useState("");
  const [aiCourses, setAiCourses] = useState<Course[]>([]);
  const [aiReply, setAiReply] = useState<string | null>(null);

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const showResults = queryText.trim().length > 0;

  async function handleHeroSearch(q: string) {
    const text = q.trim();
    setQueryText(text);

    if (!text) {
      setAiCourses([]);
      setAiReply(null);
      setSelectedCourse(null);
      return;
    }

    try {
      const res = await aiSearch({ message: text, limit: 12 }).unwrap();
      setAiCourses((res.courses ?? []) as Course[]);
      setAiReply(res.reply ?? null);
    } catch {
      setAiCourses([]);
      setAiReply(null);
    }
  }

  function clearSearch() {
    setQueryText("");
    setAiCourses([]);
    setAiReply(null);
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

    // available
    return aiCourses.filter((c) => c.enrollmentStatus !== "enrolled");
  }, [aiCourses, filter]);

  return (
    <section className="space-y-3">
      <HeroSection onSearch={handleHeroSearch} isSearching={isAiLoading} />

      {showResults && (
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          {aiReply && (
            <div className="mb-4 rounded-md border border-slate-200 bg-white p-3 text-sm text-slate-700 flex items-start justify-between gap-3">
              <div>{aiReply}</div>
              <button
                type="button"
                onClick={clearSearch}
                className="shrink-0 p-1 rounded hover:bg-slate-100"
                title="Clear results"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="mb-4 flex gap-2">
            {(["all", "enrolled", "available"] as const).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setFilter(k)}
                className={`px-3 py-1.5 rounded-md text-sm border ${
                  filter === k
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {k === "all" ? "All" : k === "enrolled" ? "Enrolled" : "Available"}
              </button>
            ))}
          </div>

          {isAiLoading && (
            <div className="mb-3 text-sm text-slate-600">Searching...</div>
          )}
          {aiError && (
            <div className="mb-3 text-sm text-red-600">
              AI search failed. Try again.
            </div>
          )}

          {!isAiLoading && filteredResults.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-600">
              No courses found for{" "}
              <span className="font-semibold">{queryText}</span>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredResults.map((course, index) => (
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
          )}

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
