import { Outlet, Link } from "react-router-dom";
import CookieConsentBanner from "../features/consent/CookieConsentBanner";

export default function AuthLayout() {
  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 flex flex-col">
      <div className="pt-10">
        <Link
          to="/"
          className="text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          ← Back to Home
        </Link>
      </div>

      <main className="flex-1 flex items-center justify-around py-10">
        <Outlet />
      </main>

      <CookieConsentBanner />
    </div>
  );
}
