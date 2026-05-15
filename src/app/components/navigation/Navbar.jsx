import { NavLink } from "react-router";

const navLinkClass = ({ isActive }) =>
  [
    "rounded-md px-3 py-2 transition",
    isActive
      ? "bg-white/55 text-[var(--text-primary)] shadow-soft"
      : "hover:bg-white/45 hover:text-[var(--text-primary)]",
  ].join(" ");

const Navbar = () => {
  return (
    <header className="glass-panel interactive-surface mb-8 rounded-2xl px-5 py-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {/* <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
            Developer Network
          </p> */}
          <h1 className="mt-1 text-2xl font-semibold text-[var(--text-primary)]">
            DragonHub
          </h1>
        </div>

        <nav className="flex flex-wrap items-center gap-2 text-sm font-medium text-[var(--text-secondary)]">
          <NavLink
            className={navLinkClass}
            to="/"
            end
          >
            Discover
          </NavLink>
          <NavLink
            className={navLinkClass}
            to="/projects"
          >
            Projects
          </NavLink>
          <NavLink
            className={navLinkClass}
            to="/blogs"
          >
            Blogs
          </NavLink>
          <NavLink
            className={navLinkClass}
            to="/users"
          >
            Developers
          </NavLink>
          <NavLink
            className="rounded-md bg-brand-600 px-3 py-2 text-white shadow-soft transition hover:bg-brand-700"
            to="/login"
          >
            Sign in
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
