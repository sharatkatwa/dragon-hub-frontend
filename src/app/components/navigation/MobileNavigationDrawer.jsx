import {
  FilePenLine,
  FolderPlus,
  LogIn,
  LogOut,
  UserCircle,
  X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router";
import { toast } from "../toast/toast";
import { useAuth } from "../../features/auth/useAuth";

const mobileNavLinkClass = ({ isActive }) =>
  [
    "flex items-center justify-between rounded-lg px-3 py-3 text-base font-semibold transition",
    isActive
      ? "bg-white/60 text-[var(--text-primary)] shadow-soft"
      : "text-[var(--text-secondary)] hover:bg-white/45 hover:text-[var(--text-primary)]",
  ].join(" ");

const actionLinkClass =
  "flex items-center gap-3 rounded-lg px-3 py-3 text-base font-semibold text-[var(--text-secondary)] transition hover:bg-white/45 hover:text-[var(--text-primary)]";

const MobileNavigationDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();
  const displayName = user?.fullName || user?.username || "Profile";

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("You have been signed out.", {
        title: "Signed out",
      });
      onClose();
      navigate("/login");
    } catch (error) {
      toast.error(error || "Unable to sign out. Please try again.", {
        title: "Logout failed",
      });
    }
  };

  return (
    <div
      className={[
        "fixed inset-0 z-[180] lg:hidden",
        isOpen ? "pointer-events-auto" : "pointer-events-none",
      ].join(" ")}
    >
      <button
        aria-label="Close menu"
        className={[
          "absolute inset-0 bg-ink-950/35 backdrop-blur-sm transition-opacity",
          isOpen ? "opacity-100" : "opacity-0",
        ].join(" ")}
        onClick={onClose}
        type="button"
      />

      <aside
        className={[
          "glass-panel absolute right-3 top-3 flex h-[calc(100vh-1.5rem)] w-[min(21rem,calc(100vw-1.5rem))] flex-col rounded-xl p-4 transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-[calc(100%+1rem)]",
        ].join(" ")}
      >
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
              DragonHub
            </p>
            <p className="truncate text-sm font-semibold text-[var(--text-secondary)]">
              {isAuthenticated ? displayName : "Developer Network"}
            </p>
          </div>

          <button
            aria-label="Close menu"
            className="grid size-10 place-items-center rounded-lg text-[var(--text-secondary)] transition hover:bg-white/45 hover:text-[var(--text-primary)]"
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          <NavLink className={mobileNavLinkClass} end onClick={onClose} to="/">
            Discover
          </NavLink>
          <NavLink className={mobileNavLinkClass} onClick={onClose} to="/projects">
            Projects
          </NavLink>
          <NavLink className={mobileNavLinkClass} onClick={onClose} to="/blogs">
            Blogs
          </NavLink>
          <NavLink className={mobileNavLinkClass} onClick={onClose} to="/users">
            Developers
          </NavLink>

          <div className="my-3 h-px bg-[var(--border-soft)]" />

          {isAuthenticated ? (
            <>
              <NavLink className={mobileNavLinkClass} onClick={onClose} to="/profile">
                <span>Profile</span>
                {user?.avatar ? (
                  <img
                    alt={displayName}
                    className="size-6 rounded-full object-cover"
                    src={user.avatar}
                  />
                ) : (
                  <UserCircle aria-hidden="true" className="size-5" />
                )}
              </NavLink>
              <NavLink className={actionLinkClass} onClick={onClose} to="/projects/new">
                <FolderPlus aria-hidden="true" className="size-5 text-brand-600" />
                Post project
              </NavLink>
              <NavLink className={actionLinkClass} onClick={onClose} to="/blogs/new">
                <FilePenLine aria-hidden="true" className="size-5 text-brand-600" />
                Post blog
              </NavLink>
              <button
                className={`${actionLinkClass} mt-auto text-signal-red hover:text-signal-red`}
                onClick={handleLogout}
                type="button"
              >
                <LogOut aria-hidden="true" className="size-5" />
                Logout
              </button>
            </>
          ) : (
            <NavLink
              className="mt-auto flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-3 text-base font-bold text-white shadow-soft transition hover:bg-brand-700"
              onClick={onClose}
              to="/login"
            >
              <LogIn aria-hidden="true" className="size-5" />
              Sign in
            </NavLink>
          )}
        </nav>
      </aside>
    </div>
  );
};

export default MobileNavigationDrawer;
