/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  CheckCircle2,
  ChevronLeft,
  Play,
  Download,
  Share2,
  Award,
  Globe,
  FileText,
  Video,
  Code,
  MessageSquare,
} from "lucide-react";

import FullScreenLoader from "../../components/common/FullScreenLoader";
import { useAppSelector } from "../../app/hooks";
import { useGetCourseByIdQuery } from "../../features/courses/coursesApi";
import { useEnrollCourseMutation } from "../../features/enrollments/enrollmentsApi";
import ErrorPage from "../../components/error/error";

export default function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAppSelector((s) => s.auth.user);

  const { data, isLoading, error, refetch, isFetching } = useGetCourseByIdQuery(
    { id: courseId ?? "", viewer: user ? "user" : "guest" },
    { skip: !courseId, refetchOnMountOrArgChange: true }
  ) as any;

  const course = data;
  const [enrollCourse, { isLoading: enrolling }] = useEnrollCourseMutation();

  if (!courseId) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-red-700 mb-4">
          Invalid course link (missing course id).
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (isLoading || enrolling || isFetching)
    return <FullScreenLoader label="Loading..." />;

  if (error) return <ErrorPage />;

  const enrolled = course.enrollmentStatus === "enrolled";
  const price = Number(course.price ?? 0);

  const handleEnroll = async () => {
    if (enrolled) return;

    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    if (price > 0) {
      navigate(`/checkout/${course._id}`);
      return;
    }

    try {
      await enrollCourse(course._id).unwrap();
      refetch();
    } catch (err) {
      console.error("Enrollment failed:", err);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </button>

      <div className=" overflow-hidden">
        <div className="p-6 space-y-6">
          <div>
            {course.level && (
              <span className="inline-block px-3 py-1 bg-[#4CE38F]/10 text-[#4CE38F] rounded-full text-xs font-semibold mb-3">
                {course.level}
              </span>
            )}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {course.title || "Untitled Course"}
            </h1>
            {course.instructor && (
              <p className="text-sm text-gray-600">
                Instructor:{" "}
                <span className="font-medium text-gray-900">
                  {course.instructor}
                </span>
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-1 h-6 bg-[#4CE38F] rounded-full"></div>
                  About This Course
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {course.description || "No description available."}
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-1 h-6 bg-[#4CE38F] rounded-full"></div>
                  Course Content
                </h2>

                <div className="space-y-2">
                  {[
                    {
                      title: "Introduction",
                      lessons: 3,
                      duration: "15 min",
                      type: "video",
                    },
                    {
                      title: "Getting Started",
                      lessons: 5,
                      duration: "45 min",
                      type: "video",
                    },
                    {
                      title: "Advanced Topics",
                      lessons: 8,
                      duration: "2 hrs",
                      type: "video",
                    },
                    {
                      title: "Practice Projects",
                      lessons: 4,
                      duration: "3 hrs",
                      type: "code",
                    },
                    {
                      title: "Final Assessment",
                      lessons: 2,
                      duration: "30 min",
                      type: "file",
                    },
                  ].map((section, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-[#4CE38F]/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {section.type === "video" && (
                          <Video className="h-5 w-5 text-[#4CE38F]" />
                        )}
                        {section.type === "code" && (
                          <Code className="h-5 w-5 text-[#4CE38F]" />
                        )}
                        {section.type === "file" && (
                          <FileText className="h-5 w-5 text-[#4CE38F]" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {section.title}
                          </p>
                          <p className="text-xs text-gray-600">
                            {section.lessons} lessons • {section.duration}
                          </p>
                        </div>
                      </div>

                      {enrolled && (
                        <Play className="h-5 w-5 text-gray-400 hover:text-[#4CE38F] cursor-pointer transition-colors" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="sticky top-4 space-y-4">
                <div className="p-6 bg-linear-to-br from-gray-50 to-white border border-gray-200 rounded-xl">
                  <div className="mb-4">
                    <div className="text-xs text-gray-500 uppercase mb-1">
                      Course Price
                    </div>
                    {price > 0 ? (
                      <div className="text-3xl font-bold text-gray-900">
                        LKR {price.toLocaleString()}
                      </div>
                    ) : (
                      <div className="text-3xl font-bold text-[#4CE38F]">
                        Free
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleEnroll}
                    disabled={enrolled}
                    className={`w-full py-3 rounded-lg font-semibold transition-all text-sm mb-3 ${
                      enrolled
                        ? "bg-[#4CE38F]/15 text-[#4CE38F] cursor-not-allowed border border-[#4CE38F]/30"
                        : "bg-[#4CE38F] text-white hover:bg-[#3AB574] hover:shadow-lg"
                    }`}
                  >
                    {enrolled ? (
                      <span className="flex items-center justify-center gap-2">
                        <CheckCircle2 className="h-5 w-5" />
                        Already Enrolled
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        {price > 0 ? "Proceed to Checkout" : "Enroll for Free"}
                      </span>
                    )}
                  </button>

                  <div className="space-y-2">
                    <button className="w-full flex items-center justify-center gap-2 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                      <Share2 className="h-4 w-4" />
                      Share Course
                    </button>
                    <button className="w-full flex items-center justify-center gap-2 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                      <Download className="h-4 w-4" />
                      Download Syllabus
                    </button>
                  </div>
                </div>

                {Array.isArray(course.tags) && course.tags.length > 0 && (
                  <div className="p-6 bg-white border border-gray-200 rounded-xl">
                    <h3 className="text-sm font-bold text-gray-900 mb-3">
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {course.tags.map((tag: string, idx: number) => (
                        <span
                          key={`${tag}-${idx}`}
                          className="px-2 py-1 bg-gray-50 border border-gray-200 rounded text-xs text-gray-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-6 bg-white border border-gray-200 rounded-xl space-y-3">
                  <h3 className="text-sm font-bold text-gray-900">
                    Course Includes
                  </h3>
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Video className="h-4 w-4 text-[#4CE38F]" />
                      {course.lessons || 0} video lessons
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Download className="h-4 w-4 text-[#4CE38F]" />
                      Downloadable resources
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Award className="h-4 w-4 text-[#4CE38F]" />
                      Certificate of completion
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Globe className="h-4 w-4 text-[#4CE38F]" />
                      Lifetime access
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <MessageSquare className="h-4 w-4 text-[#4CE38F]" />
                      Discussion forum
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
