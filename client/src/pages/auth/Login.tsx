/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Lock, Mail, AlertCircle, CheckCircle2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { login, clearAuthError } from "../../features/auth/authSlice";
import { api } from "../../app/api";

type LoginValues = {
  email: string;
  password: string;
};

const loginSchema: Yup.ObjectSchema<LoginValues> = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || "http://localhost:4000";

function startGoogleLogin() {
  window.location.href = `${API_ORIGIN}/api/v1/auth/google/start`;
}

export default function Login() {
  const dispatch = useAppDispatch();
  const nav = useNavigate();
  const loc = useLocation() as any;

  const from: string = loc.state?.from || "/";

  const { error } = useAppSelector((s) => s.auth);

  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const formik = useFormik<LoginValues>({
    initialValues: { email: "", password: "" },
    validationSchema: loginSchema,
    validateOnMount: true,
    onSubmit: async (values) => {
      dispatch(clearAuthError());
      setServerError("");

      setSubmitting(true);
      try {
        await dispatch(
          login({ email: values.email.trim(), password: values.password })
        ).unwrap();

        dispatch(api.util.invalidateTags([{ type: "Courses", id: "LIST" }]));

        nav(from, { replace: true });
      } catch (e: any) {
        setServerError(error || "Invalid credentials. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="w-full mx-auto overflow-hidden">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="hidden md:block relative p-8">
          <div className="relative h-full flex flex-col justify-between">
            <div>
              <h2 className="text-4xl font-bold text-black mb-2">
                Welcome Back!
              </h2>
              <p className="text-black/90 text-sm">
                Sign in to continue your learning journey
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-8 h-8 rounded-full bg-[#4CE38F]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-[#4CE38F]" />
                  </div>
                </div>
                <div>
                  <p className="text-black font-medium text-sm">
                    Access Your Courses
                  </p>
                  <p className="text-black/80 text-xs mt-0.5">
                    Continue learning from where you left off
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-8 h-8 rounded-full bg-[#4CE38F]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-[#4CE38F]" />
                  </div>
                </div>
                <div>
                  <p className="text-black font-medium text-sm">
                    Track Progress
                  </p>
                  <p className="text-black/80 text-xs mt-0.5">
                    Monitor your achievements and certificates
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-8 h-8 rounded-full bg-[#4CE38F]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-[#4CE38F]" />
                  </div>
                </div>
                <div>
                  <p className="text-black font-medium text-sm">
                    Connect & Learn
                  </p>
                  <p className="text-black/80 text-xs mt-0.5">
                    Join a community of learners
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 border-l border-black/25">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Sign In</h1>
            <p className="mt-1 text-xs text-gray-600">
              Enter your credentials to access your account
            </p>
          </div>

          {(serverError || error) && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
              <p className="text-xs text-red-700">{serverError || error}</p>
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className={`w-full pl-10 pr-3 py-2 text-sm border rounded-lg outline-none transition-all duration-200 ${
                    formik.touched.email && formik.errors.email
                      ? "border-red-300 focus:ring-2 focus:ring-red-200 bg-red-50"
                      : "border-gray-200 focus:ring-2 focus:ring-[#4CE38F]/20 focus:border-[#4CE38F]"
                  }`}
                  placeholder="you@example.com"
                  value={formik.values.email}
                  onChange={(e) => {
                    formik.handleChange(e);
                    setServerError("");
                  }}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {formik.errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  className={`w-full pl-10 pr-3 py-2 text-sm border rounded-lg outline-none transition-all duration-200 ${
                    formik.touched.password && formik.errors.password
                      ? "border-red-300 focus:ring-2 focus:ring-red-200 bg-red-50"
                      : "border-gray-200 focus:ring-2 focus:ring-[#4CE38F]/20 focus:border-[#4CE38F]"
                  }`}
                  placeholder="••••••••"
                  value={formik.values.password}
                  onChange={(e) => {
                    formik.handleChange(e);
                    setServerError("");
                  }}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {formik.errors.password}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="text-xs text-[#4CE38F] hover:text-[#3AB574] font-medium"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={submitting || !(formik.isValid && formik.dirty)}
              className="w-full py-2.5 px-4 bg-[#4CE38F] text-white text-sm font-semibold rounded-lg hover:bg-[#3AB574] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-gray-500 font-medium">
                  or continue with email
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={startGoogleLogin}
              className="w-full mb-4 py-2.5 px-4 border border-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-3 group"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            
          </div>

          <p className="mt-6 text-center text-xs text-gray-600">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => nav("/register", { state: { from } })}
              className="font-semibold text-[#4CE38F] hover:text-[#3AB574]"
            >
              Create one
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
