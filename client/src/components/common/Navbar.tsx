import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Moon, Sun, Languages, ChevronDown, Menu, X, LayoutDashboard, LogOut } from "lucide-react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logout } from "../../features/auth/authSlice"; 
import { api } from "../../app/api";

const linkBase =
  "text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors";

interface MenuItem {
  label: string;
  path: string;
}

interface DropdownMenuProps {
  label: string;
  items: MenuItem[];
  onItemClick?: (path: string) => void;
  isMobile?: boolean;
}

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const nav = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const { user, status } = useAppSelector((s) => s.auth);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const menuItems = {
    products: [
      { label: "Courses", path: "/courses" },
      { label: "Analytics", path: "/products/analytics" },
      { label: "Learning Management", path: "/products/lms" },
    ],
    section: [
      { label: "For Teachers", path: "/section/teachers" },
      { label: "For Students", path: "/section/students" },
      { label: "For Schools", path: "/section/schools" },
    ],
    pricing: [
      { label: "For Students", path: "/pricing/students" },
      { label: "For Schools", path: "/pricing/schools" },
    ],
    company: [
      { label: "About Us", path: "/about" },
      { label: "Careers", path: "/careers" },
      { label: "Contact", path: "/contact" },
    ],
    resources: [
      { label: "Blog", path: "/blog" },
      { label: "Documentation", path: "/docs" },
      { label: "Help Center", path: "/help" },
    ],
  };

  function go(path: string) {
    nav(path);
    setMobileMenuOpen(false);
  }

  async function onLogout() {
    try {
    await dispatch(logout()).unwrap();
  } finally {
    dispatch(api.util.resetApiState());
  }

    nav("/", { replace: true });
  }

  function goLogin() {
    nav("/login", { state: { from: location.pathname } });
    setMobileMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xs shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="z-50">
          <img src="/logo/logo.png" alt="logo" className="h-5 w-13" />
        </Link>

        <div className="hidden lg:flex flex-row gap-12">
          <nav className="flex items-center gap-8">
            <DropdownMenu label="Products" items={menuItems.products} onItemClick={go} />
            <DropdownMenu label="Section" items={menuItems.section} onItemClick={go} />
            <DropdownMenu label="Pricing" items={menuItems.pricing} onItemClick={go} />
            <DropdownMenu label="Company" items={menuItems.company} onItemClick={go} />
            <DropdownMenu label="Resources" items={menuItems.resources} onItemClick={go} />
          </nav>

          <div className="flex items-center gap-3">
            {status === "checking" ? (
              <div className="text-sm text-slate-500">...</div>
            ) : user ? (
              <UserMenu
                email={user.email ?? "Account"}
                role={user.role}
                onDashboard={() => go("/dashboard")}
                onLogout={onLogout}
              />
            ) : (
              <button
                onClick={goLogin}
                className="rounded-lg px-4 py-2 bg-[#4CE38F] text-sm font-medium text-white shadow-sm hover:shadow-md hover:text-white/80 transition-all duration-200"
              >
                Sign in
              </button>
            )}

            <button
              onClick={() => setIsDark(!isDark)}
              className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <button
              className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Change language"
            >
              <Languages className="h-5 w-5" />
            </button>
          </div>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden rounded-lg p-2 text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div
        className={`lg:hidden border-t border-slate-200 bg-white overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? "max-h-[calc(100vh-4rem)]" : "max-h-0"
        }`}
      >
        <nav className="overflow-y-auto">
          <DropdownMenu label="Products" items={menuItems.products} onItemClick={go} isMobile />
          <DropdownMenu label="Section" items={menuItems.section} onItemClick={go} isMobile />
          <DropdownMenu label="Pricing" items={menuItems.pricing} onItemClick={go} isMobile />
          <DropdownMenu label="Company" items={menuItems.company} onItemClick={go} isMobile />
          <DropdownMenu label="Resources" items={menuItems.resources} onItemClick={go} isMobile />

          <div className="border-t border-slate-200 p-4 space-y-3">
            {status === "checking" ? (
              <div className="text-sm text-slate-500">...</div>
            ) : user ? (
              <div className="space-y-2">
                <div className="px-3 py-2 bg-slate-50 rounded-lg">
                  <div className="text-sm font-medium text-slate-900 truncate">{user.email}</div>
                  <div className="text-xs text-slate-500">Role: {user.role}</div>
                </div>

                <button
                  onClick={() => go("/dashboard")}
                  className="flex w-full items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </button>

                <button
                  onClick={onLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={goLogin}
                className="block w-full rounded-lg px-4 py-2.5 text-center text-sm font-medium text-slate-700 shadow-sm border border-slate-200 hover:border-slate-300 hover:shadow-md hover:text-black transition-all duration-200"
              >
                Sign in
              </button>
            )}

            <div className="flex justify-center gap-2 pt-2">
              <button
                onClick={() => setIsDark(!isDark)}
                className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              <button
                className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Change language"
              >
                <Languages className="h-5 w-5" />
              </button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

const DropdownMenu = ({ label, items, onItemClick, isMobile = false }: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setIsOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  if (isMobile) {
    return (
      <div className="border-b border-slate-200">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          {label}
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {isOpen && (
          <div className="bg-slate-50 py-1">
            {items.map((item) => (
              <button
                key={item.path}
                type="button"
                onClick={() => onItemClick?.(item.path)}
                className="block w-full px-8 py-2 text-left text-sm text-slate-600 hover:text-slate-900 hover:bg-white transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className={`${linkBase} flex items-center gap-1`}
      >
        {label}
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-56 rounded-xl border border-slate-200 bg-white py-2 shadow-lg z-50">
          {items.map((item) => (
            <button
              key={item.path}
              type="button"
              onClick={() => {
                setIsOpen(false);
                onItemClick?.(item.path);
              }}
              className="block w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

function UserMenu(props: {
  email: string;
  role: string;
  onDashboard: () => void;
  onLogout: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-50"
        aria-label="User menu"
      >
        <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center">
          <span className="text-white text-sm font-semibold">
            {props.email.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="hidden sm:block text-sm font-medium text-slate-700">{props.role}</span>
        <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white shadow-xl z-50">
          <div className="p-3 border-b border-slate-100">
            <div className="text-sm font-semibold text-slate-900 truncate">{props.email}</div>
            <div className="text-xs text-slate-500 mt-0.5">{props.role}</div>
          </div>

          <div className="p-2">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                props.onDashboard();
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50"
            >
              <LayoutDashboard className="h-4 w-4 text-slate-500" />
              <span className="font-medium">Dashboard</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                props.onLogout();
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 mt-1"
            >
              <LogOut className="h-4 w-4" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
