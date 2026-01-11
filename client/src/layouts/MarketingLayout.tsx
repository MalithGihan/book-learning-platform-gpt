import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/footer/Footer";
import CookieConsentBanner from "../features/consent/CookieConsentBanner";
import RouteLoadingBar from "../components/common/RouteLoadingBar";

export default function MarketingLayout() {
  return (
    <>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <Navbar />
        <main className="mx-auto w-full max-w-6xl px-4 py-8">
          <RouteLoadingBar />
          <Outlet />
        </main>
        <Footer />
      </div>

      <CookieConsentBanner />
    </>
  );
}
