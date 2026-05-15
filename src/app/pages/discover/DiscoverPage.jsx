import {
  Flame,
  Loader2,
  RefreshCw,
  Sparkles,
  TrendingUp,
  UserCircle,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import BlogCard from "../../components/content/BlogCard";
import ProjectCard from "../../components/content/ProjectCard";
import CardSkeleton from "../../components/feedback/CardSkeleton";
import EmptyState from "../../components/feedback/EmptyState";
import { toast } from "../../components/toast/toast";
import { useDiscover } from "../../features/discover/useDiscover";

const sections = [
  { key: "latestProjects", label: "Latest projects", type: "projects" },
  { key: "trendingProjects", label: "Trending projects", type: "projects" },
  { key: "latestBlogs", label: "Latest blogs", type: "blogs" },
  { key: "trendingBlogs", label: "Trending blogs", type: "blogs" },
];

const statCards = [
  {
    key: "latestProjects",
    label: "Fresh projects",
    icon: Sparkles,
  },
  {
    key: "trendingProjects",
    label: "Trending builds",
    icon: TrendingUp,
  },
  {
    key: "latestBlogs",
    label: "New articles",
    icon: Flame,
  },
  {
    key: "topDevelopers",
    label: "Developers",
    icon: Users,
  },
];

const DiscoverPage = () => {
  const [activeSection, setActiveSection] = useState("latestProjects");
  const [limit, setLimit] = useState(6);
  const {
    error,
    isLoading,
    latestBlogs,
    latestProjects,
    loadDiscoverFeed,
    topDevelopers,
    trendingBlogs,
    trendingProjects,
  } = useDiscover();

  useEffect(() => {
    loadDiscoverFeed(limit).catch((message) => {
      toast.error(message || "Unable to load discover feed.", {
        title: "Discover failed",
      });
    });
  }, [limit, loadDiscoverFeed]);

  const feed = {
    latestProjects,
    trendingProjects,
    latestBlogs,
    trendingBlogs,
  };

  const activeConfig = sections.find((section) => section.key === activeSection);
  const activeItems = feed[activeSection] || [];

  const stats = useMemo(
    () =>
      statCards.map((stat) => ({
        ...stat,
        value:
          stat.key === "topDevelopers"
            ? topDevelopers.length
            : feed[stat.key]?.length || 0,
      })),
    [feed, topDevelopers.length]
  );

  const handleRefresh = () => {
    loadDiscoverFeed(limit)
      .then(() => {
        toast.success("Discover feed refreshed.", {
          title: "Updated",
          duration: 2200,
        });
      })
      .catch((message) => {
        toast.error(message || "Unable to refresh discover feed.", {
          title: "Refresh failed",
        });
      });
  };

  return (
    <section className="space-y-6">
      <div className="surface-panel overflow-hidden rounded-xl">
        <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1fr_320px] lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-600">
              Discover
            </p>
            <h2 className="mt-2 max-w-3xl text-4xl font-bold leading-tight text-[var(--text-primary)] sm:text-5xl">
              Find projects, writing, and builders moving the network forward.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
              A live feed of the newest and most-liked work across DragonHub,
              tuned for quick scanning and deeper exploration.
            </p>
          </div>

          <div className="glass-panel rounded-xl p-4">
            <label
              className="block text-xs font-bold uppercase tracking-[0.18em] text-brand-600"
              htmlFor="discover-limit"
            >
              Feed size
            </label>
            <div className="mt-3 flex gap-2">
              <select
                className="select-control min-w-0 flex-1 px-3 py-2.5 pr-9 text-sm font-bold"
                id="discover-limit"
                onChange={(event) => setLimit(Number(event.target.value))}
                value={limit}
              >
                <option value={3}>Compact</option>
                <option value={6}>Balanced</option>
                <option value={9}>Expanded</option>
              </select>
              <button
                className="grid size-11 place-items-center rounded-lg bg-brand-600 text-white shadow-soft transition hover:bg-brand-700 disabled:opacity-70"
                disabled={isLoading}
                onClick={handleRefresh}
                type="button"
              >
                {isLoading ? (
                  <Loader2 aria-hidden="true" className="size-5 animate-spin" />
                ) : (
                  <RefreshCw aria-hidden="true" className="size-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="grid border-t border-[var(--border-soft)] sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ icon: Icon, key, label, value }) => (
            <button
              className={[
                "flex items-center gap-3 border-b border-[var(--border-soft)] px-5 py-4 text-left transition hover:bg-white/20 sm:border-r lg:border-b-0",
                key === activeSection ? "bg-white/25" : "",
              ].join(" ")}
              key={key}
              onClick={() => {
                if (feed[key]) {
                  setActiveSection(key);
                }
              }}
              type="button"
            >
              <span className="grid size-10 place-items-center rounded-lg bg-brand-600/10 text-brand-600">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <span>
                <span className="block text-2xl font-bold text-[var(--text-primary)]">
                  {value}
                </span>
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                  {label}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {sections.map((section) => (
          <button
            className={[
              "shrink-0 rounded-lg px-4 py-2 text-sm font-bold transition",
              activeSection === section.key
                ? "bg-brand-600 text-white shadow-soft"
                : "surface-panel text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
            ].join(" ")}
            key={section.key}
            onClick={() => setActiveSection(section.key)}
            type="button"
          >
            {section.label}
          </button>
        ))}
      </div>

      {error ? (
        <p className="rounded-lg border border-signal-red/30 bg-signal-red/10 px-4 py-3 text-sm font-semibold text-signal-red">
          {error}
        </p>
      ) : null}

      {isLoading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: Math.min(limit, 6) }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      ) : activeItems.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {activeConfig.type === "projects"
            ? activeItems.map((project) => (
                <ProjectCard key={project._id || project.id} project={project} />
              ))
            : activeItems.map((blog) => (
                <BlogCard key={blog._id || blog.id || blog.slug} blog={blog} />
              ))}
        </div>
      ) : (
        <EmptyState
          action={
            <button
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-bold text-white shadow-soft transition hover:bg-brand-700"
              onClick={handleRefresh}
              type="button"
            >
              Refresh feed
            </button>
          }
          message="There is nothing in this section yet. Try refreshing or exploring another section."
          title={`No ${activeConfig.label.toLowerCase()} found`}
        />
      )}

      <section className="surface-panel rounded-xl p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-600">
              Developers
            </p>
            <h3 className="mt-1 text-2xl font-bold text-[var(--text-primary)]">
              Builders to watch
            </h3>
          </div>
          <Link
            className="rounded-lg px-3 py-2 text-sm font-bold text-[var(--text-secondary)] transition hover:bg-white/45 hover:text-[var(--text-primary)]"
            to="/users"
          >
            View all
          </Link>
        </div>

        {isLoading ? (
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div className="h-20 animate-pulse rounded-xl bg-white/20" key={index} />
            ))}
          </div>
        ) : topDevelopers.length > 0 ? (
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {topDevelopers.map((developer) => {
              const developerId = developer._id || developer.id;
              const displayName =
                developer.fullName || developer.username || "Developer";

              return (
                <Link
                  className="interactive-surface flex items-center gap-3 rounded-xl border border-[var(--border-soft)] bg-white/10 p-3"
                  key={developerId}
                  to={`/users/${developerId}`}
                >
                  {developer.avatar ? (
                    <img
                      alt={displayName}
                      className="size-12 rounded-lg object-cover"
                      src={developer.avatar}
                    />
                  ) : (
                    <span className="grid size-12 place-items-center rounded-lg bg-brand-600/10 text-brand-600">
                      <UserCircle aria-hidden="true" className="size-7" />
                    </span>
                  )}
                  <span className="min-w-0">
                    <span className="block truncate font-bold text-[var(--text-primary)]">
                      {displayName}
                    </span>
                    <span className="block truncate font-mono text-xs text-[var(--text-muted)]">
                      @{developer.username || "developer"}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="mt-5 text-sm text-[var(--text-secondary)]">
            No developers found yet.
          </p>
        )}
      </section>
    </section>
  );
};

export default DiscoverPage;
