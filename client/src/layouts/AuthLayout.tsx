import { Outlet, Link } from "react-router-dom";
import CookieConsentBanner from "../features/consent/CookieConsentBanner";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <Link to="/" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Back to Home
        </Link>
      </div>

      <main className="mx-auto flex min-h-[calc(100vh-120px)] max-w-6xl items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>

      <CookieConsentBanner />
    </div>
  );
}
