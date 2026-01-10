import { useState } from "react";
import { Moon, Sun, Languages, CircleArrowDown, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const linkBase =
  "text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors cursor-pointer";

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

const DropdownMenu = ({
  label,
  items,
  onItemClick,
  isMobile = false,
}: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (isMobile) {
    return (
      <div className="border-b border-slate-200">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-slate-700"
        >
          {label}
          <CircleArrowDown
            className={`h-4 w-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {isOpen && (
          <div className="absolute left-0 top-full pt-2 z-50">
            <div className="w-48 rounded-lg border border-slate-200 bg-white py-2 shadow-lg">
              {items.map((item) => (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => onItemClick?.(item.path)}
                  className="block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className={`${linkBase} flex items-center gap-1`}>
        {label}
        <CircleArrowDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full pt-2 z-50">
          <div className="w-48 rounded-lg border border-slate-200 bg-white py-2 shadow-lg">
            {items.map((item) => (
              <button
                key={item.path}
                type="button"
                onClick={() => onItemClick?.(item.path)}
                className="block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = {
    products: [
      { label: "Learning Management", path: "/products/lms" },
      { label: "Course Builder", path: "/products/builder" },
      { label: "Analytics", path: "/products/analytics" },
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

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/60 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex h-16 max-w-8xl items-center justify-between px-6">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            handleNavigation("/");
          }}
          className="text-2xl font-bold text-slate-900 z-50"
        >
          <img src="/logo/logo.png" alt="logo" className="h-5 w-13" />
        </a>

        <div className="hidden lg:flex flex-row gap-12">
          <nav className="flex items-center gap-8">
            <DropdownMenu
              label="Products"
              items={menuItems.products}
              onItemClick={handleNavigation}
            />
            <DropdownMenu
              label="Section"
              items={menuItems.section}
              onItemClick={handleNavigation}
            />
            <DropdownMenu
              label="Pricing"
              items={menuItems.pricing}
              onItemClick={handleNavigation}
            />
            <DropdownMenu
              label="Company"
              items={menuItems.company}
              onItemClick={handleNavigation}
            />
            <DropdownMenu
              label="Resources"
              items={menuItems.resources}
              onItemClick={handleNavigation}
            />
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="/login"
              onClick={(e) => {
                e.preventDefault();
                handleNavigation("/login");
              }}
              className="rounded-lg px-4 py-1.5 text-sm font-medium text-slate-700 shadow-[0_0_0_2px_rgba(0,0,0,0.08),0_0_14px_rgba(0,0,0,0.12)] hover:text-black transition-colors"
            >
              Sign in
            </a>

            <button
              onClick={() => setIsDark(!isDark)}
              className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            <button
              className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Change language"
            >
              <Languages className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden rounded-lg p-2 text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white">
          <nav className="max-h-[calc(100vh-4rem)] overflow-y-auto">
            <DropdownMenu
              label="Products"
              items={menuItems.products}
              onItemClick={handleNavigation}
              isMobile
            />
            <DropdownMenu
              label="Section"
              items={menuItems.section}
              onItemClick={handleNavigation}
              isMobile
            />
            <DropdownMenu
              label="Pricing"
              items={menuItems.pricing}
              onItemClick={handleNavigation}
              isMobile
            />
            <DropdownMenu
              label="Company"
              items={menuItems.company}
              onItemClick={handleNavigation}
              isMobile
            />
            <DropdownMenu
              label="Resources"
              items={menuItems.resources}
              onItemClick={handleNavigation}
              isMobile
            />

            {/* Mobile Actions */}
            <div className="border-t border-slate-200 p-4 space-y-3">
              <a
                href="/login"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation("/login");
                }}
                className="block w-full rounded-lg px-4 py-2 text-center text-sm font-medium text-slate-700 shadow-[0_0_0_2px_rgba(0,0,0,0.08),0_0_14px_rgba(0,0,0,0.12)] hover:text-black transition-colors"
              >
                Sign in
              </a>

              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setIsDark(!isDark)}
                  className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 transition-colors"
                  aria-label="Toggle theme"
                >
                  {isDark ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
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
      )}
    </header>
  );
}
