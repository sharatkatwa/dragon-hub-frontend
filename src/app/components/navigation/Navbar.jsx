import { Menu } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router";
import { useAuth } from "../../features/auth/useAuth";
import MobileNavigationDrawer from "./MobileNavigationDrawer";
import UserActionsDropdown from "./UserActionsDropdown";

const navLinkClass = ({ isActive }) =>
  [
    "rounded-md px-3 py-2 transition",
    isActive
      ? "bg-white/5 border border-white/20 text-[var(--text-primary)] shadow-soft"
      : "hover:bg-white/10 hover:text-[var(--text-primary)]",
  ].join(" ");

const Navbar = () => {
  const { isAuthenticated, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY.current;

      if (currentScrollY < 24 || scrollDelta < -6) {
        setIsNavbarVisible(true);
      }

      if (currentScrollY > 96 && scrollDelta > 6 && !isMobileMenuOpen) {
        setIsNavbarVisible(false);
      }

      lastScrollY.current = Math.max(currentScrollY, 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      setIsNavbarVisible(true);
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className={[
          "glass-panel interactive-surface sticky top-3 z-[150] mb-8 rounded-xl px-4 py-3 transition-transform duration-200 ease-out sm:top-4 sm:px-5 sm:py-4",
          isNavbarVisible
            ? "translate-y-0"
            : "-translate-y-[calc(100%+1.5rem)]",
        ].join(" ")}
      >
        <div className="flex items-center justify-between gap-4">
          <NavLink className="min-w-0" to="/">
            <h1 className="flex items-center gap-2 text-xl font-bold text-brand-300 sm:text-2xl">
              <img
                src="/logo.png"
                alt=""
                className="size-9 shrink-0 object-contain sm:size-10"
              />
            <span>
              Dragon
              <span className="text-[var(--text-primary)] font-thin">Hub</span>
            </span>
            </h1>
            <p className="mt-1 hidden max-w-[22rem] truncate text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 xl:block">
            (Devendra, Ritik, Abdur, Gourav, Om, Naman)
          </p>
          </NavLink>

          <nav className="hidden items-center gap-2 text-sm font-medium text-[var(--text-secondary)] lg:flex">
          <NavLink className={navLinkClass} to="/" end>
            Discover
          </NavLink>
          <NavLink className={navLinkClass} to="/projects">
            Projects
          </NavLink>
          <NavLink className={navLinkClass} to="/blogs">
            Blogs
          </NavLink>
          <NavLink className={navLinkClass} to="/users">
            Developers
          </NavLink>
          {isAuthenticated ? (
            <UserActionsDropdown />
          ) : (
            <NavLink
              className="rounded-md bg-brand-600 px-3 py-2 text-white shadow-soft transition hover:bg-brand-700"
              to="/login"
            >
              Sign in
            </NavLink>
          )}
        </nav>

          <button
            aria-expanded={isMobileMenuOpen}
            aria-label="Open menu"
            className="grid size-10 shrink-0 place-items-center rounded-lg text-[var(--text-primary)] transition hover:bg-white/45 lg:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
            type="button"
          >
            <Menu aria-hidden="true" className="size-5" />
          </button>
        </div>
      </header>

      <MobileNavigationDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
};

export default Navbar;
