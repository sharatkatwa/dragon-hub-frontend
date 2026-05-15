import { Plus, Search, SlidersHorizontal, X } from "lucide-react";
import { Link } from "react-router";

const sortOptions = [
  { label: "Latest", value: "latest" },
  { label: "Popular", value: "popular" },
  { label: "Oldest", value: "oldest" },
];

const inputClass =
  "rounded-lg border border-[var(--border-soft)] bg-white/10 px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-brand-500 focus:bg-white/15 focus:ring-4 focus:ring-[var(--focus-ring)]";

const ProjectQueryPanel = ({
  formValues,
  hasFilters,
  onChange,
  onReset,
  onSubmit,
}) => {
  return (
    <div className="surface-panel rounded-xl p-5 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-600">
            Projects
          </p>
          <h2 className="mt-2 text-3xl font-bold text-[var(--text-primary)] sm:text-4xl">
            Explore what developers are building
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
            Search public projects by title, stack, tags, and popularity.
          </p>
        </div>

        <Link
          className="inline-flex w-fit items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-bold text-white shadow-soft transition hover:bg-brand-700"
          to="/projects/new"
        >
          <Plus aria-hidden="true" className="size-4" />
          Post project
        </Link>
      </div>

      <form
        className="mt-6 grid gap-3 lg:grid-cols-[1.3fr_0.8fr_0.8fr_0.55fr_auto]"
        onSubmit={onSubmit}
      >
        <label className="relative block">
          <span className="sr-only">Search projects</span>
          <Search
            aria-hidden="true"
            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--text-muted)]"
          />
          <input
            className="w-full rounded-lg border border-[var(--border-soft)] bg-white/10 py-3 pl-10 pr-4 text-sm text-[var(--text-primary)] outline-none transition focus:border-brand-500 focus:bg-white/15 focus:ring-4 focus:ring-[var(--focus-ring)]"
            name="search"
            onChange={onChange}
            placeholder="Search projects"
            value={formValues.search}
          />
        </label>

        <input
          className={inputClass}
          name="tech"
          onChange={onChange}
          placeholder="Tech: React,Node.js"
          value={formValues.tech}
        />

        <input
          className={inputClass}
          name="tag"
          onChange={onChange}
          placeholder="Tag: fullstack"
          value={formValues.tag}
        />

        <select
          className="select-control px-4 py-3 pr-10 text-sm font-semibold"
          name="sort"
          onChange={onChange}
          value={formValues.sort}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <button
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-ink-900 px-4 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-ink-800"
          type="submit"
        >
          <SlidersHorizontal aria-hidden="true" className="size-4" />
          Apply
        </button>
      </form>

      {hasFilters ? (
        <button
          className="mt-3 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-[var(--text-secondary)] transition hover:bg-white/45 hover:text-[var(--text-primary)]"
          onClick={onReset}
          type="button"
        >
          <X aria-hidden="true" className="size-4" />
          Clear filters
        </button>
      ) : null}
    </div>
  );
};

export default ProjectQueryPanel;
