/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Lock, Mail, User, AlertCircle, CheckCircle2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { register, clearAuthError } from "../../features/auth/authSlice";
import { api } from "../../app/api"; 

type RegisterValues = {
  name: string;
  email: string;
  password: string;
  terms: boolean;
};

const registerSchema: Yup.ObjectSchema<RegisterValues> = Yup.object({
  name: Yup.string().defined(),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required")
    .defined(),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required")
    .defined(),
  terms: Yup.boolean()
    .oneOf([true], "You must accept the terms")
    .required()
    .defined(),
});

export default function Register() {
  const dispatch = useAppDispatch();
  const nav = useNavigate();
  const loc = useLocation() as any;

  const from: string = loc.state?.from || "/";

  const { error } = useAppSelector((s) => s.auth);

  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const formik = useFormik<RegisterValues>({
    initialValues: {
      name: "",
      email: "",
      password: "",
      terms: false,
    },
    validationSchema: registerSchema,
    validateOnMount: true,
    onSubmit: async (values) => {
      dispatch(clearAuthError());
      setServerError("");

      setSubmitting(true);
      try {
        await dispatch(
          register({
            name: values.name.trim() || undefined,
            email: values.email.trim(),
            password: values.password,
          })
        ).unwrap();

        dispatch(api.util.invalidateTags([{ type: "Courses", id: "LIST" }]));

        nav(from, { replace: true });
      } catch (e: any) {
        setServerError(error || "Registration failed. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="w-full mx-auto overflow-hidden">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="hidden md:block relative bg-white p-8 border-r border-gray-200">
          <div className="h-full flex flex-col justify-between">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Start Your Journey</h2>
              <p className="text-gray-600 text-sm">
                Join thousands of learners and unlock your potential
              </p>
            </div>

            <div className="space-y-4">
              {[
                ["Unlimited Access", "Access all courses and learning materials anytime"],
                ["Expert Instructors", "Learn from industry professionals and experts"],
                ["Certificates", "Earn recognized certificates upon completion"],
                ["Community Support", "Connect with fellow learners worldwide"],
              ].map(([t, d]) => (
                <div key={t} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#4CE38F]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-[#4CE38F]" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium text-sm">{t}</p>
                    <p className="text-gray-600 text-xs mt-0.5">{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="max-w-md mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
              <p className="mt-1 text-xs text-gray-600">Register and start learning today</p>
            </div>

            {(serverError || error) && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                <p className="text-xs text-red-700">{serverError || error}</p>
              </div>
            )}

            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-1">
                  Name <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-lg outline-none transition-all duration-200 focus:ring-2 focus:ring-[#4CE38F]/20 focus:border-[#4CE38F]"
                    placeholder="Your name"
                    value={formik.values.name}
                    onChange={(e) => {
                      formik.handleChange(e);
                      setServerError("");
                    }}
                    onBlur={formik.handleBlur}
                  />
                </div>
              </div>

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
                    autoComplete="new-password"
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
                {formik.touched.password && formik.errors.password ? (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {formik.errors.password}
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-gray-500">Use at least 8 characters for better security</p>
                )}
              </div>

              <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <input
                  type="checkbox"
                  id="terms"
                  name="terms"
                  checked={formik.values.terms}
                  onChange={formik.handleChange}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#4CE38F] focus:ring-[#4CE38F]/20"
                />
                <label htmlFor="terms" className="text-xs text-gray-600">
                  I agree to the{" "}
                  <button type="button" className="text-[#4CE38F] hover:text-[#3AB574] font-medium">
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button type="button" className="text-[#4CE38F] hover:text-[#3AB574] font-medium">
                    Privacy Policy
                  </button>
                </label>
              </div>
              {formik.touched.terms && formik.errors.terms && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {formik.errors.terms}
                </p>
              )}

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
                    Creating account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-gray-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => nav("/login", { state: { from } })}
                className="font-semibold text-[#4CE38F] hover:text-[#3AB574]"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
