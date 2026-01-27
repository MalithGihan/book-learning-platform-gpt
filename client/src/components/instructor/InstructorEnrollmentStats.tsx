import { RefreshCw, Users, BookOpen, AlertCircle, TrendingUp } from "lucide-react";
import { useGetInstructorEnrollmentStatsQuery } from "../../features/instrutor/instructorApi";

export default function InstructorEnrollmentStats() {
  const { data: courses = [], isLoading, isFetching, error, refetch } =
    useGetInstructorEnrollmentStatsQuery();

  const totalEnrolled = courses.reduce((sum, c) => sum + (c.enrolledCount || 0), 0);
  const avgEnrollmentPerCourse = courses.length > 0 ? Math.round(totalEnrolled / courses.length) : 0;

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
            <RefreshCw className="h-4 w-4 text-gray-600 animate-spin" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Loading enrollment data</p>
            <p className="text-xs text-gray-500 mt-0.5">Please wait...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
            <AlertCircle className="h-4 w-4 text-red-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900">Unable to load statistics</p>
            <p className="text-xs text-gray-600 mt-0.5">
              An error occurred while fetching enrollment data.
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shrink-0"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Enrollment Statistics</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Monitor your course performance
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
          title="Refresh statistics"
          disabled={isFetching}
        >
          <RefreshCw className={`h-4 w-4 text-gray-600 ${isFetching ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="px-6 py-5 bg-gray-50/50">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-gray-700" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{totalEnrolled}</p>
              </div>
            </div>
            <p className="text-xs font-medium text-gray-600">Active Students</p>
            <p className="text-xs text-gray-500 mt-0.5">Currently enrolled</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-gray-700" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
              </div>
            </div>
            <p className="text-xs font-medium text-gray-600">Total Courses</p>
            <p className="text-xs text-gray-500 mt-0.5">Published courses</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-gray-700" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{avgEnrollmentPerCourse}</p>
              </div>
            </div>
            <p className="text-xs font-medium text-gray-600">Avg per Course</p>
            <p className="text-xs text-gray-500 mt-0.5">Students/course</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-5">
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <BookOpen className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-sm font-semibold text-gray-900 mb-1">No courses available</p>
            <p className="text-xs text-gray-500">
              Create your first course to start tracking enrollments
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                Course Performance
              </h4>
              <span className="text-xs text-gray-500">
                {courses.length} {courses.length === 1 ? 'course' : 'courses'}
              </span>
            </div>

            <div className="space-y-2">
              {courses.map((c, index) => (
                <div
                  key={c._id}
                  className="group relative bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 overflow-hidden"
                >

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-gray-400">
                            #{String(index + 1).padStart(2, '0')}
                          </span>
                          <h5 className="text-sm font-semibold text-gray-900 truncate">
                            {c.title}
                          </h5>
                        </div>
                        <p className="text-xs text-gray-500">
                          Total enrollments: <span className="font-medium text-gray-700">{c.totalEnrollments}</span>
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <div className="px-2.5 py-1 rounded-md bg-gray-900 text-white">
                          <span className="text-xs font-bold">{c.enrolledCount}</span>
                        </div>
                        <span className="text-xs text-gray-500">active</span>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}