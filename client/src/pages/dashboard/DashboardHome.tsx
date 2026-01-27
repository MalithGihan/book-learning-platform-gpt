/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useAppSelector } from "../../app/hooks";

import { useGetCoursesQuery } from "../../features/courses/coursesApi";
import { useGetMyEnrollmentsQuery } from "../../features/enrollments/enrollmentsApi";

import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  Settings,
  Shield,
  Sparkles,
} from "lucide-react";
import InstructorEnrollmentStats from "../../components/instructor/InstructorEnrollmentStats";

type Role = "student" | "instructor" | "admin";

export default function DashboardHome() {
  const user = useAppSelector((s) => s.auth.user);

  const viewer: "guest" | "user" = user ? "user" : "guest";

  const role = (user?.role ?? "student") as Role;

  const isStudent = role === "student";
  const isInstructor = role === "instructor";
  const isAdmin = role === "admin";

  const {
    data: courses = [],
    isLoading: coursesLoading,
    isFetching: coursesFetching,
  } = useGetCoursesQuery(
    { viewer },
    {
      skip: !user,
    },
  );

  const {
    data: myEnrollments = [],
    isLoading: enrollmentsLoading,
    isFetching: enrollmentsFetching,
  } = useGetMyEnrollmentsQuery(undefined, {
    skip: !user || !(isStudent || isAdmin),
  });

  const roleMeta = useMemo(() => {
    switch (user?.role) {
      case "student":
        return {
          label: "Student",
          desc: "Browse courses, enroll, and track your learning.",
          Icon: GraduationCap,
          chip: "bg-emerald-50 text-emerald-700 border-emerald-200",
        };
      case "instructor":
        return {
          label: "Instructor",
          desc: "Create courses and manage your content.",
          Icon: BookOpen,
          chip: "bg-indigo-50 text-indigo-700 border-indigo-200",
        };
      case "admin":
        return {
          label: "Admin",
          desc: "Full access across courses and enrollments.",
          Icon: Shield,
          chip: "bg-amber-50 text-amber-800 border-amber-200",
        };
      default:
        return {
          label: "User",
          desc: "Welcome back.",
          Icon: LayoutDashboard,
          chip: "bg-slate-50 text-slate-700 border-slate-200",
        };
    }
  }, [user?.role]);

  const stats = useMemo(() => {
    const loadingCourses = coursesLoading || coursesFetching;
    const loadingEnrollments = enrollmentsLoading || enrollmentsFetching;

    return {
      availableCourses: loadingCourses ? "…" : String(courses.length),

      enrolledCourses: loadingEnrollments ? "…" : String(myEnrollments.length),

      publishedCourses: loadingCourses
        ? "…"
        : String(courses.filter((c) => Boolean((c as any).published)).length),
    };
  }, [
    courses,
    myEnrollments,
    coursesLoading,
    coursesFetching,
    enrollmentsLoading,
    enrollmentsFetching,
  ]);

  if (!user) return null;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-10">
                Welcome back{user.name ? `, ${user.name}` : ""}!
              </h1>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${roleMeta.chip}`}
                >
                  <BadgeCheck className="h-3.5 w-3.5" />
                  {roleMeta.label}
                </span>

                <span className="text-xs text-slate-600 truncate">
                  {user.email}
                </span>
              </div>

              <p className="mt-2 text-sm text-slate-600">{roleMeta.desc}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              to="/dashboard/settings"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>

            <Link
              to="/courses"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              <Sparkles className="h-4 w-4" />
              Explore
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {(isStudent || isAdmin) && (
          <>
            <StatCard
              label="Available Courses"
              value={stats.availableCourses}
            />
            <StatCard label="My Enrollments" value={stats.enrolledCourses} />
          </>
        )}

        {(isInstructor || isAdmin) && (
          <StatCard label="Published Courses" value={stats.publishedCourses} />
        )}

        {isStudent && !isAdmin && (
          <StatCard label="Learning Status" value="Active" />
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="grid gap-3 sm:grid-cols-2">
            {(isStudent || isAdmin) && (
              <>
                <ActionCard
                  title="Browse courses"
                  desc="View available courses and enroll."
                  to="/dashboard/courses"
                  cta="View courses"
                  icon={<BookOpen className="h-5 w-5" />}
                />
                <ActionCard
                  title="My enrolled courses"
                  desc="Continue where you left off."
                  to="/dashboard/my-courses"
                  cta="Open my courses"
                  icon={<GraduationCap className="h-5 w-5" />}
                />
              </>
            )}

            {(isInstructor || isAdmin) && (
              <ActionCard
                title="Manage courses"
                desc="Create, edit, and publish your courses."
                to="/dashboard/manage-courses"
                cta="Manage"
                icon={<LayoutDashboard className="h-5 w-5" />}
                accent
              />
            )}

            {isAdmin && (
              <ActionCard
                title="Admin tools"
                desc="Review users, roles, and system settings."
                to="/dashboard/admin"
                cta="Open admin"
                icon={<Shield className="h-5 w-5" />}
              />
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Quick tips</h2>
            <span className="text-[11px] font-semibold text-slate-500">
              Today
            </span>
          </div>

          <ul className="mt-3 space-y-3 text-sm text-slate-600">
            {(isStudent || isAdmin) && (
              <>
                <Tip
                  title="Enroll faster"
                  desc="Open a course and click Enroll — you’ll see your badge instantly once enrolled."
                />
                <Tip
                  title="Keep progress"
                  desc="Use My Courses to continue your learning journey."
                />
              </>
            )}

            {(isInstructor || isAdmin) && (
              <>
                <Tip
                  title="Publish wisely"
                  desc="Draft courses are hidden from students until you publish them."
                />
                <Tip
                  title="Keep descriptions clear"
                  desc="A good description increases enrollments."
                />
              </>
            )}
          </ul>

          <div className="mt-4">
            <Link
              to="/dashboard/settings"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:underline"
            >
              Manage preferences <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        

      </div>
      {isInstructor && <InstructorEnrollmentStats />}
    </div>
  );
}

function StatCard(props: { label: string; value: string }) {
  return (
    <div className="group rounded-2xl bg-white p-4 shadow-sm transition-all">
      <div className="text-xs font-semibold text-slate-500">{props.label}</div>
      <div
        className={`mt-2 text-base font-semibold ${
          props.value === "Active" ? "text-[#4CE38F]" : "text-black"
        }`}
      >
        {props.value}
      </div>
    </div>
  );
}

function ActionCard(props: {
  title: string;
  desc: string;
  to: string;
  cta: string;
  icon: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className={`group rounded-2xl border bg-white p-4 shadow-sm transition-all hover:shadow-md ${
        props.accent ? "border-[#4CE38F]/30" : "border-slate-200"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className={`h-10 w-10 rounded-xl flex items-center justify-center ${
              props.accent
                ? "bg-[#4CE38F]/15 text-[#2bbf69]"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            {props.icon}
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-slate-900">{props.title}</h3>
            <p className="mt-1 text-xs text-slate-600">{props.desc}</p>
          </div>
        </div>
      </div>

      <Link
        to={props.to}
        className={`mt-4 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
          props.accent
            ? "bg-[#4CE38F] text-white hover:bg-[#3AB574]"
            : "bg-slate-900 text-white hover:bg-slate-800"
        }`}
      >
        {props.cta} <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function Tip(props: { title: string; desc: string }) {
  return (
    <li className="rounded-xl border border-slate-100 bg-slate-50 p-3">
      <div className="text-xs font-bold text-slate-900">{props.title}</div>
      <div className="mt-1 text-xs text-slate-600">{props.desc}</div>
    </li>
  );
}
