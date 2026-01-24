import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Lock,
  Bell,
  Globe,
  Shield,
  Moon,
  ChevronRight,
  Check,
  Camera,
  Trash2,
  AlertCircle,
  Save,
  Monitor,
  Smartphone,
  LogOut,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  bootstrapMe,
  loadSessions,
  logoutAll as logoutAllThunk,
  revokeOtherSessions,
  revokeSession,
} from "../../../features/auth/authSlice";

type Locationish = {
  country?: string;
  region?: string;
  city?: string;
  timezone?: string;
} | null;

type SessionRow = {
  id: string;
  ip?: string;
  userAgent?: string;
  createdAt?: string;
  lastUsedAt?: string;
  isCurrent?: boolean;
  location?: Locationish;
};

export default function Settings() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [activeTab, setActiveTab] = useState("profile");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const authUser = useAppSelector((s) => s.auth.user);

  // ✅ sessions from redux
  const { sessions, sessionsLoading, sessionsError, sessionsBusyId } =
    useAppSelector((s) => s.auth);

  useEffect(() => {
    if (!authUser) dispatch(bootstrapMe());
  }, [authUser, dispatch]);

  const fullName = authUser?.name || "";
  const email = authUser?.email || "";
  const role = authUser?.role || "student";

  // ✅ load sessions when security tab opens
  useEffect(() => {
    if (activeTab === "security") {
      dispatch(loadSessions());
    }
  }, [activeTab, dispatch]);

  const refreshSessions = () => dispatch(loadSessions());

  const revoke = async (id: string) => {
    await dispatch(revokeSession({ id }));
    await dispatch(loadSessions());
  };

  const revokeOthers = async () => {
    await dispatch(revokeOtherSessions());
    await dispatch(loadSessions());
  };

  const logoutAllNow = async () => {
    await dispatch(logoutAllThunk());
    navigate("/login", { replace: true });
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "account", label: "Account", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "preferences", label: "Preferences", icon: Globe },
    { id: "security", label: "Security", icon: Lock },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        <p className="text-xs text-gray-600 mt-0.5">
          Manage your account and preferences
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-4 md:h-150">
        <div className="lg:col-span-1 bg-white rounded-lg border border-gray-200 p-3">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-[#4CE38F]/10 text-[#4CE38F]"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span className="flex-1 text-left">{tab.label}</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            ))}
          </nav>
        </div>

        <div className="lg:col-span-3 space-y-4">
          {activeTab === "profile" && (
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-sm font-bold text-gray-900">
                  Profile Information
                </h2>
                <p className="text-xs text-gray-600 mt-0.5">
                  Update your personal details
                </p>
              </div>

              <div className="p-4 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="h-20 w-20 rounded-full bg-linear-to-br from-[#4CE38F] to-[#3AB574] flex items-center justify-center">
                      <User className="h-10 w-10 text-white" />
                    </div>
                    <button className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                      <Camera className="h-3.5 w-3.5 text-gray-600" />
                    </button>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Profile Photo
                    </p>
                    <p className="text-xs text-gray-600 mb-2">
                      JPG, PNG or GIF. Max size 2MB
                    </p>
                    <button className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1">
                      <Trash2 className="h-3 w-3" />
                      Remove photo
                    </button>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      readOnly
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    readOnly
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about yourself..."
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#4CE38F]/20 focus:border-[#4CE38F] resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Brief description for your profile
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                  <button className="px-4 py-2 text-sm font-semibold text-white bg-[#4CE38F] rounded-lg hover:bg-[#3AB574] transition-colors flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ===================== ACCOUNT ===================== */}
          {activeTab === "account" && (
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-sm font-bold text-gray-900">
                  Account Settings
                </h2>
                <p className="text-xs text-gray-600 mt-0.5">
                  Manage your account details
                </p>
              </div>

              <div className="p-4 space-y-4">
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <Mail className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 mb-0.5">
                        Email Address
                      </p>
                      <p className="text-xs text-gray-600 mb-2">{email}</p>

                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded border border-green-200">
                        <Check className="h-3 w-3" />
                        Verified
                      </span>
                    </div>
                    <button className="text-xs text-[#4CE38F] hover:text-[#3AB574] font-semibold">
                      Change
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                      <User className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 mb-0.5">
                        Account Type
                      </p>
                      <p className="text-xs text-gray-600">
                        {role === "student"
                          ? "Student Account"
                          : role === "instructor"
                          ? "Instructor Account"
                          : "Admin Account"}
                      </p>
                    </div>
                    <button className="text-xs text-[#4CE38F] hover:text-[#3AB574] font-semibold">
                      Upgrade
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-bold text-gray-900 mb-3">
                    Danger Zone
                  </h3>
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-red-900 mb-1">
                          Delete Account
                        </p>
                        <p className="text-xs text-red-700 mb-3">
                          Once you delete your account, there is no going back.
                          Please be certain.
                        </p>
                        <button className="px-3 py-1.5 text-xs font-semibold text-red-700 border border-red-300 rounded-lg hover:bg-red-100 transition-colors">
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================== NOTIFICATIONS ===================== */}
          {activeTab === "notifications" && (
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-sm font-bold text-gray-900">
                  Notification Preferences
                </h2>
                <p className="text-xs text-gray-600 mt-0.5">
                  Choose how you want to be notified
                </p>
              </div>

              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Email Notifications
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Receive notifications via email
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setEmailNotifications(!emailNotifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      emailNotifications ? "bg-[#4CE38F]" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        emailNotifications ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start gap-3">
                    <Bell className="h-5 w-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Push Notifications
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Receive push notifications on your device
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setPushNotifications(!pushNotifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      pushNotifications ? "bg-[#4CE38F]" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        pushNotifications ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ===================== PREFERENCES ===================== */}
          {activeTab === "preferences" && (
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-sm font-bold text-gray-900">
                  Display Preferences
                </h2>
                <p className="text-xs text-gray-600 mt-0.5">
                  Customize your experience
                </p>
              </div>

              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start gap-3">
                    <Moon className="h-5 w-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Dark Mode
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Use dark theme across the app
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      darkMode ? "bg-[#4CE38F]" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        darkMode ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ===================== SECURITY ===================== */}
          {activeTab === "security" && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-gray-900">
                      Active Sessions
                    </h2>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Manage your logged-in devices
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={refreshSessions}
                      disabled={sessionsBusyId !== null}
                      className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                      title="Refresh sessions"
                    >
                      <RefreshCw
                        className={`h-4 w-4 text-gray-600 ${
                          sessionsLoading ? "animate-spin" : ""
                        }`}
                      />
                    </button>

                    <button
                      onClick={revokeOthers}
                      disabled={sessionsBusyId !== null}
                      className="px-3 py-2 text-xs font-semibold rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                    >
                      Revoke Others
                    </button>

                    <button
                      onClick={logoutAllNow}
                      disabled={sessionsBusyId !== null}
                      className="px-3 py-2 text-xs font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
                    >
                      Logout All
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  {sessionsError && (
                    <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                      <p className="text-xs text-red-700">{sessionsError}</p>
                    </div>
                  )}

                  {sessionsLoading ? (
                    <div className="text-center py-8">
                      <RefreshCw className="h-6 w-6 text-gray-400 mx-auto mb-2 animate-spin" />
                      <p className="text-xs text-gray-600">
                        Loading sessions...
                      </p>
                    </div>
                  ) : sessions.length === 0 ? (
                    <div className="text-center py-8">
                      <Monitor className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        No active sessions
                      </p>
                      <p className="text-xs text-gray-600">
                        You don't have any active sessions
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {sessions.map((s: SessionRow) => {
                        const loc =
                          s.location?.city ||
                          s.location?.region ||
                          s.location?.country
                            ? `${s.location?.city ?? ""}${
                                s.location?.city ? ", " : ""
                              }${s.location?.region ?? ""}${
                                s.location?.region ? ", " : ""
                              }${s.location?.country ?? ""}`.trim()
                            : null;

                        const ua = (s.userAgent || "").toLowerCase();
                        const isDesktop =
                          ua.includes("windows") ||
                          ua.includes("mac") ||
                          ua.includes("linux");

                        return (
                          <div
                            key={s.id}
                            className={`flex items-start justify-between gap-4 p-4 rounded-lg border transition-all ${
                              s.isCurrent
                                ? "border-[#4CE38F] bg-[#4CE38F]/5"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="flex items-start gap-3 flex-1">
                              <div
                                className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                                  s.isCurrent
                                    ? "bg-[#4CE38F]/20"
                                    : "bg-gray-100"
                                }`}
                              >
                                {isDesktop ? (
                                  <Monitor
                                    className={`h-5 w-5 ${
                                      s.isCurrent
                                        ? "text-[#4CE38F]"
                                        : "text-gray-600"
                                    }`}
                                  />
                                ) : (
                                  <Smartphone
                                    className={`h-5 w-5 ${
                                      s.isCurrent
                                        ? "text-[#4CE38F]"
                                        : "text-gray-600"
                                    }`}
                                  />
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="text-sm font-semibold text-gray-900">
                                    {s.isCurrent
                                      ? "Current Device"
                                      : isDesktop
                                      ? "Desktop"
                                      : "Mobile Device"}
                                  </p>
                                  {s.isCurrent && (
                                    <span className="px-2 py-0.5 bg-[#4CE38F] text-white text-[10px] font-bold rounded uppercase">
                                      Active
                                    </span>
                                  )}
                                </div>

                                <div className="space-y-0.5">
                                  <p className="text-xs text-gray-600">
                                    <span className="font-medium">IP:</span>{" "}
                                    {s.ip || "—"}
                                    {loc && <span> • {loc}</span>}
                                  </p>

                                  {s.userAgent && (
                                    <p className="text-xs text-gray-600 truncate max-w-md">
                                      <span className="font-medium">
                                        Browser:
                                      </span>{" "}
                                      {s.userAgent}
                                    </p>
                                  )}

                                  <p className="text-xs text-gray-500">
                                    <span className="font-medium">
                                      Last used:
                                    </span>{" "}
                                    {s.lastUsedAt
                                      ? new Date(s.lastUsedAt).toLocaleString()
                                      : "—"}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => revoke(s.id)}
                              disabled={sessionsBusyId !== null || s.isCurrent}
                              className="px-3 py-2 text-xs font-semibold rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-red-200 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0"
                              title={
                                s.isCurrent
                                  ? "Cannot revoke current session"
                                  : "Revoke this session"
                              }
                            >
                              {sessionsBusyId === s.id ? (
                                <span className="flex items-center gap-1">
                                  <RefreshCw className="h-3 w-3 animate-spin" />
                                  Revoking...
                                </span>
                              ) : (
                                <span className="flex items-center gap-1">
                                  <LogOut className="h-3 w-3" />
                                  Revoke
                                </span>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
