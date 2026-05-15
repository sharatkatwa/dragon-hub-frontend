import { Search, SlidersHorizontal, UserPlus, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";
import UserCard from "../../components/content/UserCard";
import CardSkeleton from "../../components/feedback/CardSkeleton";
import EmptyState from "../../components/feedback/EmptyState";
import { toast } from "../../components/toast/toast";
import { useUsers } from "../../features/users/useUsers";

const sortOptions = [
  { label: "Latest", value: "latest" },
  { label: "Oldest", value: "oldest" },
];

const getQueryFromSearchParams = (searchParams) => ({
  search: searchParams.get("search") || "",
  skill: searchParams.get("skill") || "",
  sort: searchParams.get("sort") || "latest",
});

const UsersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { count, error, isLoading, loadUsers, users } = useUsers();
  const query = useMemo(
    () => getQueryFromSearchParams(searchParams),
    [searchParams]
  );
  const [formValues, setFormValues] = useState(query);

  useEffect(() => {
    setFormValues(query);
  }, [query]);

  useEffect(() => {
    const params = Object.fromEntries(
      Object.entries(query).filter(([, value]) => value)
    );

    loadUsers(params).catch((message) => {
      toast.error(message || "Unable to load developers.", {
        title: "Developers failed",
      });
    });
  }, [loadUsers, query]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextParams = new URLSearchParams();

    Object.entries(formValues).forEach(([key, value]) => {
      const cleanValue = value.trim();

      if (cleanValue) {
        nextParams.set(key, cleanValue);
      }
    });

    setSearchParams(nextParams);
  };

  const handleReset = () => {
    setFormValues({
      search: "",
      skill: "",
      sort: "latest",
    });
    setSearchParams({});
  };

  const hasFilters = Boolean(query.search || query.skill);

  return (
    <section className="space-y-6">
      <div className="surface-panel rounded-xl p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-600">
              Developers
            </p>
            <h2 className="mt-2 text-3xl font-bold text-[var(--text-primary)] sm:text-4xl">
              Find builders by name, bio, and skill
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
              Search public profiles and discover developers building across the
              DragonHub network.
            </p>
          </div>

          <Link
            className="inline-flex w-fit items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-bold text-white shadow-soft transition hover:bg-brand-700"
            to="/profile"
          >
            <UserPlus aria-hidden="true" className="size-4" />
            Your profile
          </Link>
        </div>

        <form
          className="mt-6 grid gap-3 lg:grid-cols-[1.4fr_0.9fr_0.55fr_auto]"
          onSubmit={handleSubmit}
        >
          <label className="relative block">
            <span className="sr-only">Search developers</span>
            <Search
              aria-hidden="true"
              className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--text-muted)]"
            />
            <input
              className="w-full rounded-lg border border-[var(--border-soft)] bg-white/10 py-3 pl-10 pr-4 text-sm text-[var(--text-primary)] outline-none transition focus:border-brand-500 focus:bg-white/15 focus:ring-4 focus:ring-[var(--focus-ring)]"
              name="search"
              onChange={handleChange}
              placeholder="Search username, name, or bio"
              value={formValues.search}
            />
          </label>

          <input
            className="rounded-lg border border-[var(--border-soft)] bg-white/10 px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-brand-500 focus:bg-white/15 focus:ring-4 focus:ring-[var(--focus-ring)]"
            name="skill"
            onChange={handleChange}
            placeholder="Skill: React,Node.js"
            value={formValues.skill}
          />

          <select
            className="select-control px-4 py-3 pr-10 text-sm font-semibold"
            name="sort"
            onChange={handleChange}
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
            onClick={handleReset}
            type="button"
          >
            <X aria-hidden="true" className="size-4" />
            Clear filters
          </button>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-[var(--text-secondary)]">
          {isLoading ? "Loading developers..." : `${count || users.length} developers`}
        </p>
        {error ? <p className="text-sm font-semibold text-signal-red">{error}</p> : null}
      </div>

      {isLoading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      ) : users.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {users.map((user) => (
            <UserCard key={user._id || user.id} user={user} />
          ))}
        </div>
      ) : (
        <EmptyState
          action={
            hasFilters ? (
              <button
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-bold text-white shadow-soft transition hover:bg-brand-700"
                onClick={handleReset}
                type="button"
              >
                Reset filters
              </button>
            ) : null
          }
          message="Try a different search term, skill, or sort option."
          title="No developers found"
        />
      )}
    </section>
  );
};

export default UsersPage;
