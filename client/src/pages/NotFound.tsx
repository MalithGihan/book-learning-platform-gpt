import { useNavigate } from "react-router-dom";
import { ChevronLeft, Home, FileQuestion } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-6">
        <div className="relative">
          <div className="absolute inset-0 bg-[#4CE38F]/10 blur-3xl rounded-full"></div>
          <div className="relative">
            <FileQuestion className="h-32 w-32 text-gray-300 mx-auto mb-4" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-6xl md:text-8xl font-bold text-gray-900">404</h1>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
            Page Not Found
          </h2>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#4CE38F] text-white text-sm font-semibold rounded-lg hover:bg-[#3AB574] transition-colors shadow-sm hover:shadow-md"
          >
            <ChevronLeft className="h-4 w-4" />
            Go Back
          </button>

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm"
          >
            <Home className="h-4 w-4" />
            Home
          </button>
        </div>

        <div className="pt-8">
          <p className="text-xs text-gray-500 mb-3">Quick Links</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => navigate("/dashboard")}
              className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs rounded-lg hover:bg-gray-200 transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate("/dashboard/courses")}
              className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs rounded-lg hover:bg-gray-200 transition-colors"
            >
              Courses
            </button>
            <button
              onClick={() => navigate("/dashboard/my-courses")}
              className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs rounded-lg hover:bg-gray-200 transition-colors"
            >
              My Courses
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}