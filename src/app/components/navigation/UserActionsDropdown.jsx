import {
  ChevronDown,
  FilePenLine,
  FolderPlus,
  LogOut,
  UserCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "../toast/toast";
import { useAuth } from "../../features/auth/useAuth";

const menuItemClass =
  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-[var(--text-secondary)] transition hover:bg-white/55 hover:text-[var(--text-primary)]";

const UserActionsDropdown = () => {
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const { logout, user } = useAuth();
  const displayName = user?.fullName || user?.username || "Profile";

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("You have been signed out.", {
        title: "Signed out",
      });
      navigate("/login");
    } catch (error) {
      toast.error(error || "Unable to sign out. Please try again.", {
        title: "Logout failed",
      });
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative z-[160] " ref={menuRef}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-md bg-brand-600 px-3 py-2 text-white shadow-soft transition hover:bg-brand-700"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <span>{displayName}</span>

        {user?.avatar ? (
          <img
            alt={displayName}
            className="size-5 rounded-full object-cover"
            src={user.avatar}
          />
        ) : (
          <UserCircle className="size-5" aria-hidden="true" />
        )}

        <ChevronDown
          aria-hidden="true"
          className={[
            "size-4 transition-transform",
            isOpen ? "rotate-180" : "",
          ].join(" ")}
        />
      </button>

      {isOpen ? (
        <div
          className="glass-panel absolute right-0 top-[calc(100%+0.65rem)] z-[170] w-56 rounded-xl p-2"
          role="menu"
        >
          <Link
            className={menuItemClass}
            onClick={() => setIsOpen(false)}
            role="menuitem"
            to="/profile"
          >
            <UserCircle aria-hidden="true" className="size-4 text-brand-600" />
            View profile
          </Link>

          <div className="my-1 h-px bg-[var(--border-soft)]" />

          <Link
            className={menuItemClass}
            onClick={() => setIsOpen(false)}
            role="menuitem"
            to="/projects/new"
          >
            <FolderPlus aria-hidden="true" className="size-4 text-brand-600" />
            Post project
          </Link>

          <Link
            className={menuItemClass}
            onClick={() => setIsOpen(false)}
            role="menuitem"
            to="/blogs/new"
          >
            <FilePenLine aria-hidden="true" className="size-4 text-brand-600" />
            Post blog
          </Link>

          <div className="my-1 h-px bg-[var(--border-soft)]" />

          <button
            className={`${menuItemClass} text-signal-red hover:text-signal-red`}
            onClick={handleLogout}
            role="menuitem"
            type="button"
          >
            <LogOut aria-hidden="true" className="size-4" />
            Logout
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default UserActionsDropdown;
