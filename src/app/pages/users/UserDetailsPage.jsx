import {
  ArrowLeft,
  BriefcaseBusiness,
  FileText,
  GitFork,
  Globe,
  Loader2,
  MessageCircle,
  UserCircle,
} from "lucide-react";
import { useEffect } from "react";
import { Link, useParams } from "react-router";
import BlogCard from "../../components/content/BlogCard";
import ProjectCard from "../../components/content/ProjectCard";
import CardSkeleton from "../../components/feedback/CardSkeleton";
import EmptyState from "../../components/feedback/EmptyState";
import { toast } from "../../components/toast/toast";
import { useBlogs } from "../../features/blogs/useBlogs";
import { useProjects } from "../../features/projects/useProjects";
import { useUsers } from "../../features/users/useUsers";

const socialItems = [
  { key: "github", label: "GitHub", icon: GitFork },
  { key: "linkedin", label: "LinkedIn", icon: BriefcaseBusiness },
  { key: "website", label: "Website", icon: Globe },
  { key: "twitter", label: "Twitter / X", icon: MessageCircle },
];

const UserDetailsPage = () => {
  const { userId } = useParams();
  const {
    clearSelected,
    error,
    isLoading,
    loadUserById,
    selectedUser: user,
  } = useUsers();
  const {
    isLoading: projectsLoading,
    loadUserProjects,
    userProjects,
  } = useProjects();
  const {
    isLoading: blogsLoading,
    loadUserBlogs,
    userBlogs,
  } = useBlogs();

  useEffect(() => {
    loadUserById(userId).catch((message) => {
      toast.error(message || "Unable to load developer profile.", {
        title: "Profile failed",
      });
    });

    loadUserProjects(userId).catch(() => {});
    loadUserBlogs(userId).catch(() => {});

    return () => clearSelected();
  }, [clearSelected, loadUserBlogs, loadUserById, loadUserProjects, userId]);

  if (isLoading && !user) {
    return (
      <section className="surface-panel grid min-h-80 place-items-center rounded-xl p-8">
        <div className="flex items-center gap-3 text-[var(--text-secondary)]">
          <Loader2 aria-hidden="true" className="size-5 animate-spin" />
          Loading developer profile...
        </div>
      </section>
    );
  }

  if (error && !user) {
    return (
      <EmptyState
        action={
          <Link
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-bold text-white shadow-soft transition hover:bg-brand-700"
            to="/users"
          >
            Back to developers
          </Link>
        }
        message={error}
        title="Developer unavailable"
      />
    );
  }

  if (!user) {
    return null;
  }

  const displayName = user.fullName || user.username || "Developer";
  const skills = Array.isArray(user.skills) ? user.skills : [];
  const projectCount = userProjects.length;
  const blogCount = userBlogs.length;

  return (
    <section className="space-y-6">
      <Link
        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-[var(--text-secondary)] transition hover:bg-white/45 hover:text-[var(--text-primary)]"
        to="/users"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Developers
      </Link>

      <header className="surface-panel overflow-hidden rounded-xl">
        <div className="relative z-0 h-56 bg-ink-900 sm:h-72">
          {user.banner ? (
            <img
              alt=""
              className="absolute inset-0 -z-10 size-full object-cover"
              src={user.banner}
            />
          ) : (
            <div className="absolute inset-0 -z-10 size-full bg-[radial-gradient(circle_at_18%_20%,rgb(126_224_191_/_0.28),transparent_18rem),radial-gradient(circle_at_82%_10%,rgb(58_134_255_/_0.18),transparent_18rem),linear-gradient(135deg,#17382f,#071013)]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface-panel-strong)] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 px-5 pb-6 sm:px-7">
          <div className="-mt-14 flex flex-col gap-5 rounded-xl bg-[var(--surface-panel-strong)]/82 p-4 backdrop-blur sm:-mt-16 sm:p-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              {user.avatar ? (
                <img
                  alt={displayName}
                  className="size-32 rounded-xl border-4 border-[var(--surface-panel-strong)] object-cover shadow-soft"
                  src={user.avatar}
                />
              ) : (
                <span className="grid size-32 place-items-center rounded-xl border-4 border-[var(--surface-panel-strong)] bg-brand-600/10 text-brand-600 shadow-soft">
                  <UserCircle aria-hidden="true" className="size-20" />
                </span>
              )}

              <div className="pb-1">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-600">
                  Developer Portfolio
                </p>
                <h1 className="mt-1 text-4xl font-bold text-[var(--text-primary)]">
                  {displayName}
                </h1>
                <p className="mt-1 font-mono text-sm text-[var(--text-secondary)]">
                  @{user.username || "developer"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:flex">
              <div className="rounded-xl border border-[var(--border-soft)] bg-white/10 px-4 py-3">
                <span className="block text-2xl font-bold text-[var(--text-primary)]">
                  {projectCount}
                </span>
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                  Projects
                </span>
              </div>
              <div className="rounded-xl border border-[var(--border-soft)] bg-white/10 px-4 py-3">
                <span className="block text-2xl font-bold text-[var(--text-primary)]">
                  {blogCount}
                </span>
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                  Blogs
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="surface-panel rounded-xl p-5 sm:p-6">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-600">
            About
          </p>
          <p className="mt-3 leading-7 text-[var(--text-secondary)]">
            {user.bio || "This developer has not added a bio yet."}
          </p>

          <div className="mt-7">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-600">
              Skills
            </p>
            {skills.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    className="rounded-lg bg-brand-600/10 px-3 py-1.5 text-sm font-bold text-brand-600"
                    key={skill}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-[var(--text-secondary)]">
                No skills listed yet.
              </p>
            )}
          </div>
        </section>

        <aside className="surface-panel rounded-xl p-5 sm:p-6">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-600">
            Social links
          </p>
          <div className="mt-4 space-y-2">
            {socialItems.map(({ icon: Icon, key, label }) => {
              const href = user.socialLinks?.[key];

              return href ? (
                <a
                  className="interactive-surface flex items-center gap-3 rounded-lg border border-[var(--border-soft)] bg-white/10 px-3 py-3 text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  href={href}
                  key={key}
                  rel="noreferrer"
                  target="_blank"
                >
                  <Icon aria-hidden="true" className="size-4 text-brand-600" />
                  {label}
                </a>
              ) : (
                <div
                  className="flex items-center gap-3 rounded-lg border border-dashed border-[var(--border-soft)] px-3 py-3 text-sm font-semibold text-[var(--text-muted)]"
                  key={key}
                >
                  <Icon aria-hidden="true" className="size-4" />
                  {label}
                  <span className="ml-auto text-xs">Not added</span>
                </div>
              );
            })}
          </div>
        </aside>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-600">
              Work
            </p>
            <h2 className="mt-1 text-2xl font-bold text-[var(--text-primary)]">
              Projects
            </h2>
          </div>
          <BriefcaseBusiness aria-hidden="true" className="size-6 text-brand-600" />
        </div>

        {projectsLoading ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        ) : userProjects.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {userProjects.map((project) => (
              <ProjectCard key={project._id || project.id} project={project} />
            ))}
          </div>
        ) : (
          <EmptyState
            message="This developer has not shared any projects yet."
            title="No projects yet"
          />
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-600">
              Writing
            </p>
            <h2 className="mt-1 text-2xl font-bold text-[var(--text-primary)]">
              Blogs
            </h2>
          </div>
          <FileText aria-hidden="true" className="size-6 text-brand-600" />
        </div>

        {blogsLoading ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        ) : userBlogs.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {userBlogs.map((blog) => (
              <BlogCard key={blog._id || blog.id || blog.slug} blog={blog} />
            ))}
          </div>
        ) : (
          <EmptyState
            message="This developer has not published any blogs yet."
            title="No blogs yet"
          />
        )}
      </section>
    </section>
  );
};

export default UserDetailsPage;
