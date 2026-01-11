/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import  { useState } from "react";
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
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

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
              <h2 className="text-4xl font-bold text-black mb-2">Welcome Back!</h2>
              <p className="text-black/90 text-sm">Sign in to continue your learning journey</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-8 h-8 rounded-full bg-[#4CE38F]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-[#4CE38F]" />
                  </div>
                </div>
                <div>
                  <p className="text-black font-medium text-sm">Access Your Courses</p>
                  <p className="text-black/80 text-xs mt-0.5">Continue learning from where you left off</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-8 h-8 rounded-full bg-[#4CE38F]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-[#4CE38F]" />
                  </div>
                </div>
                <div>
                  <p className="text-black font-medium text-sm">Track Progress</p>
                  <p className="text-black/80 text-xs mt-0.5">Monitor your achievements and certificates</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-8 h-8 rounded-full bg-[#4CE38F]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-[#4CE38F]" />
                  </div>
                </div>
                <div>
                  <p className="text-black font-medium text-sm">Connect & Learn</p>
                  <p className="text-black/80 text-xs mt-0.5">Join a community of learners</p>
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
              <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
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
              <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1">
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
              <button type="button" className="text-xs text-[#4CE38F] hover:text-[#3AB574] font-medium">
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
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
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
