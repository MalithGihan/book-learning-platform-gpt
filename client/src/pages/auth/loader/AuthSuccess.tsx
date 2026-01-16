/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useAppDispatch } from "../../../app/hooks";
import { bootstrapMe } from "../../../features/auth/authSlice";

export default function AuthSuccess() {
  const dispatch = useAppDispatch();
  const nav = useNavigate();
  const loc = useLocation() as any;

  const from: string = loc.state?.from || "/";

  useEffect(() => {
    let alive = true;

    (async () => {
      const user = await dispatch(bootstrapMe()).unwrap();
      if (!alive) return;

      if (user) nav(from, { replace: true });
      else nav("/login", { replace: true, state: { from } });
    })();

    return () => {
      alive = false;
    };
  }, [dispatch, nav, from]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-gray-900">
            Authentication Successful
          </h1>
          <p className="text-sm text-gray-600">
            Signing you in and setting up your account...
          </p>
        </div>

        <div className="flex items-center justify-center gap-2">
          <Loader2 className="h-5 w-5 text-[#4CE38F] animate-spin" />
          <span className="text-sm text-gray-600 font-medium">Please wait</span>
        </div>

        <div className="pt-4">
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-linear-to-r from-[#4CE38F] to-[#3AB574] rounded-full animate-progress"></div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-[#4CE38F]/10 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-4 w-4 text-[#4CE38F]" />
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-gray-900 mb-1">
                Almost there!
              </p>
              <p className="text-xs text-gray-600 leading-relaxed">
                We're verifying your credentials and preparing your personalized dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}