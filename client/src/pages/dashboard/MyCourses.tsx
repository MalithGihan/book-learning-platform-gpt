import { Link, useNavigate } from "react-router-dom";
import {
  Star,
  Users,
  Clock,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  Award,
  PlayCircle,
} from "lucide-react";
import { useGetMyEnrollmentsQuery } from "../../features/enrollments/enrollmentsApi";
import FullScreenLoader from "../../components/common/FullScreenLoader";
import ErrorPage from "../../components/error/error";

interface Enrollment {
  _id: string;
  course?: {
    _id: string;
    title?: string;
    description?: string;
    level?: string;
    rating?: number;
    students?: number;
    duration?: string;
    lessons?: number;
    image?: string;
    price?: number;
  };
  progress?: number;
  enrolledAt?: string;
}

function MyCourseCard({
  enrollment,
  onViewDetails,
  delay = 0,
}: {
  enrollment: Enrollment;
  onViewDetails: () => void;
  delay?: number;
}) {
  const course = enrollment.course;
  if (!course) return null;

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
            alt={course.title}
            className="w-12 h-12 rounded-full object-cover"
          />
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(76,227,143,0.08),transparent_70%)]"></div>

        <div className="absolute top-2 right-2">
          <div className="flex items-center gap-1 bg-[#4CE38F] text-white px-2 py-1 rounded-full text-[10px] font-semibold shadow-sm">
            <CheckCircle2 className="h-3 w-3" />
            Enrolled
          </div>
        </div>

        <div className="absolute bottom-2 left-2 right-2 flex items-center gap-2 text-[10px] text-gray-900">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-[#4CE38F] text-[#4CE38F]" />
            <span className="font-medium">{course.rating || "0.0"}</span>
          </div>
          <div className="w-px h-2.5 bg-gray-300"></div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{(course.students || 0).toLocaleString()}</span>
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

        {enrollment.progress !== undefined && (
          <div className="py-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-gray-600">Progress</span>
              <span className="text-[10px] font-semibold text-gray-900">
                {enrollment.progress}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#4CE38F] rounded-full transition-all duration-300"
                style={{ width: `${enrollment.progress}%` }}
              />
            </div>
          </div>
        )}

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
          <div className="flex items-center gap-1 text-[10px] text-gray-500">
            <TrendingUp className="h-3 w-3" />
            <span>Continue learning</span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails();
            }}
            className="flex items-center gap-1 px-3 py-2 bg-[#4CE38F] text-white rounded-lg font-semibold transition-all text-xs hover:bg-[#3AB574]"
          >
            <PlayCircle className="h-3 w-3" />
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MyCourses() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetMyEnrollmentsQuery();

  if (isLoading) return <FullScreenLoader label="Loading ..." />;
  if (error) return <ErrorPage />;

  const enrollments = (data ?? []) as Enrollment[];

  const handleViewDetails = (courseId: string) => {
    navigate(`/dashboard/courses/${courseId}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">My Courses</h1>
          <p className="text-xs text-gray-600 mt-0.5">
            Courses you are enrolled in
          </p>
        </div>

        <Link
          to="/dashboard/courses"
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
        >
          Browse More Courses
        </Link>
      </div>

      {!isLoading && !error && enrollments.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <div className="group rounded-2xl bg-white p-4 shadow-sm transition-all ">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-black/10 rounded-lg">
                  <BookOpen className="h-5 w-5 text-black" />
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-1">Total Courses</p>
              <p className="text-2xl font-bold text-gray-900">
                {enrollments.length}
              </p>
            </div>

            <div className="group rounded-2xl bg-white p-4 shadow-sm transition-all ">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-black/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-black" />
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-1">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">
                {
                  enrollments.filter(
                    (e) => (e.progress || 0) > 0 && (e.progress || 0) < 100
                  ).length
                }
              </p>
            </div>

            <div className="group rounded-2xl bg-white p-4 shadow-sm transition-all ">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-black/10 rounded-lg">
                  <Award className="h-5 w-5 text-black" />
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-1">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {enrollments.filter((e) => (e.progress || 0) === 100).length}
              </p>
            </div>

            <div className="group rounded-2xl bg-white p-4 shadow-sm transition-all ">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-black/10 rounded-lg">
                  <Clock className="h-5 w-5 text-black" />
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-1">Hours Learned</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10">
            {enrollments.map((enrollment, idx) => (
              <MyCourseCard
                key={enrollment._id}
                enrollment={enrollment}
                onViewDetails={() =>
                  handleViewDetails(enrollment.course?._id || "")
                }
                delay={idx * 100}
              />
            ))}
          </div>
        </>
      )}

      {!isLoading && !error && enrollments.length === 0 && (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-base font-semibold text-gray-900 mb-2">
            No courses enrolled yet
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Start your learning journey by enrolling in a course
          </p>
          <Link
            to="/dashboard/courses"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#4CE38F] text-white text-sm font-semibold rounded-lg hover:bg-[#3AB574] transition-colors"
          >
            Browse Courses
          </Link>
        </div>
      )}
    </div>
  );
}
