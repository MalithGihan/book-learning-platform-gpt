import { useMemo, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AlertCircle, Mail, RefreshCw, CheckCircle2, X } from "lucide-react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { verifyEmail, resendVerification, clearAuthError } from "../../features/auth/authSlice";

type Props = {
  open: boolean;
  email: string;
  onClose: () => void;
  onVerified: () => void;
};

type Values = { code: string };

const schema: Yup.ObjectSchema<Values> = Yup.object({
  code: Yup.string()
    .trim()
    .matches(/^\d{6}$/, "Enter the 6-digit code")
    .required("Code is required"),
});

export default function VerifyEmailModal({ open, email, onClose, onVerified }: Props) {
  const dispatch = useAppDispatch();
  const { error } = useAppSelector((s) => s.auth);

  const cleanEmail = useMemo(() => String(email || "").trim(), [email]);

  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [resentMsg, setResentMsg] = useState("");

  const formik = useFormik<Values>({
    initialValues: { code: "" },
    validationSchema: schema,
    validateOnMount: true,
    onSubmit: async (values) => {
      dispatch(clearAuthError());
      setServerError("");
      setResentMsg("");

      setSubmitting(true);
      try {
        await dispatch(verifyEmail({ email: cleanEmail, code: values.code.trim() })).unwrap();
        onVerified();
      } catch {
        setServerError(error || "Invalid code. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  async function onResend() {
    dispatch(clearAuthError());
    setServerError("");
    setResentMsg("");

    setResending(true);
    try {
      await dispatch(resendVerification({ email: cleanEmail })).unwrap();
      setResentMsg("A new code was sent to your email.");
    } catch {
      setServerError(error || "Failed to resend code.");
    } finally {
      setResending(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
        aria-label="Close"
      />

      <div className="relative w-full max-w-md rounded-xl bg-white border border-gray-200 shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-sm font-bold text-gray-900">Verify your email</h2>
            <p className="text-xs text-gray-600 mt-0.5">
              We sent a 6-digit code to <span className="font-semibold">{cleanEmail}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200"
            aria-label="Close modal"
          >
            <X className="h-4 w-4 text-gray-600" />
          </button>
        </div>

        <div className="p-5">
          {!cleanEmail && (
            <div className="mb-3 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
              <p className="text-xs text-red-700">Missing email. Please try registering again.</p>
            </div>
          )}

          {(serverError || error) && (
            <div className="mb-3 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
              <p className="text-xs text-red-700">{serverError || error}</p>
            </div>
          )}

          {resentMsg && (
            <div className="mb-3 p-3 rounded-lg bg-green-50 border border-green-200 flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-700 shrink-0 mt-0.5" />
              <p className="text-xs text-green-800">{resentMsg}</p>
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Verification code
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  name="code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="123456"
                  maxLength={6}
                  className={`w-full pl-10 pr-3 py-2 text-sm border rounded-lg outline-none transition-all duration-200 ${
                    formik.touched.code && formik.errors.code
                      ? "border-red-300 focus:ring-2 focus:ring-red-200 bg-red-50"
                      : "border-gray-200 focus:ring-2 focus:ring-[#4CE38F]/20 focus:border-[#4CE38F]"
                  }`}
                  value={formik.values.code}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "").slice(0, 6);
                    formik.setFieldValue("code", v);
                    setServerError("");
                  }}
                  onBlur={formik.handleBlur}
                  disabled={!cleanEmail}
                />
              </div>

              {formik.touched.code && formik.errors.code && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {formik.errors.code}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!cleanEmail || submitting || !(formik.isValid && formik.dirty)}
              className="w-full py-2.5 px-4 bg-[#4CE38F] text-white text-sm font-semibold rounded-lg hover:bg-[#3AB574] transition-all disabled:opacity-50"
            >
              {submitting ? "Verifying..." : "Verify"}
            </button>

            <button
              type="button"
              onClick={onResend}
              disabled={!cleanEmail || resending}
              className="w-full py-2.5 px-4 border border-gray-200 text-gray-800 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${resending ? "animate-spin" : ""}`} />
              {resending ? "Resending..." : "Resend code"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
