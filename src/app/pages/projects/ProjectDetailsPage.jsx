import {
  ArrowLeft,
  ExternalLink,
  GitFork,
  Heart,
  Layers3,
  Loader2,
  UserCircle,
} from "lucide-react";
import { useEffect } from "react";
import { Link, useParams } from "react-router";
import EmptyState from "../../components/feedback/EmptyState";
import { toast } from "../../components/toast/toast";
import { useAuth } from "../../features/auth/useAuth";
import { useProjects } from "../../features/projects/useProjects";
import { isLikedByUser } from "../../utils/likes";

const getProjectId = (project) => project?._id || project?.id;

const ProjectDetailsPage = () => {
  const { projectId } = useParams();
  const { user } = useAuth();
  const {
    clearSelected,
    error,
    isLoading,
    likeProject,
    loadProjectById,
    selectedProject: project,
  } = useProjects();

  useEffect(() => {
    loadProjectById(projectId).catch((message) => {
      toast.error(message || "Unable to load project.", {
        title: "Project failed",
      });
    });

    return () => clearSelected();
  }, [clearSelected, loadProjectById, projectId]);

  const handleLike = async () => {
    try {
      await likeProject(projectId);
    } catch (message) {
      toast.error(message || "Unable to update like.", {
        title: "Action failed",
      });
    }
  };

  if (isLoading && !project) {
    return (
      <section className="surface-panel grid min-h-80 place-items-center rounded-xl p-8">
        <div className="flex items-center gap-3 text-[var(--text-secondary)]">
          <Loader2 aria-hidden="true" className="size-5 animate-spin" />
          Loading project...
        </div>
      </section>
    );
  }

  if (error && !project) {
    return (
      <EmptyState
        action={
          <Link
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-bold text-white shadow-soft transition hover:bg-brand-700"
            to="/projects"
          >
            Back to projects
          </Link>
        }
        message={error}
        title="Project unavailable"
      />
    );
  }

  if (!project) {
    return null;
  }

  const owner = project.owner || {};
  const ownerName = owner.fullName || owner.username || "Developer";
  const techStack = Array.isArray(project.techStack) ? project.techStack : [];
  const tags = Array.isArray(project.tags) ? project.tags : [];
  const likesCount = project.likesCount ?? project.likes?.length ?? 0;
  const isLiked = isLikedByUser(project, user);

  return (
    <section className="space-y-6">
      <Link
        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-[var(--text-secondary)] transition hover:bg-white/45 hover:text-[var(--text-primary)]"
        to="/projects"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Projects
      </Link>

      <article className="surface-panel overflow-hidden rounded-xl">
        <div className="relative aspect-[16/8] min-h-64 bg-ink-900">
          {project.image ? (
            <img
              alt={project.title}
              className="size-full object-cover"
              src={project.image}
            />
          ) : (
            <div className="grid size-full place-items-center bg-[radial-gradient(circle_at_20%_18%,rgb(126_224_191_/_0.28),transparent_18rem),linear-gradient(135deg,#17382f,#071013)] px-6 text-center">
              <Layers3 aria-hidden="true" className="mb-3 size-10 text-brand-300" />
              <p className="max-w-xl text-2xl font-bold text-white">
                {project.title}
              </p>
            </div>
          )}
        </div>

        <div className="p-5 sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-600">
                Project
              </p>
              <h1 className="mt-2 text-4xl font-bold leading-tight text-[var(--text-primary)]">
                {project.title}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-[var(--text-secondary)]">
                <span className="inline-flex items-center gap-2">
                  {owner.avatar ? (
                    <img
                      alt={ownerName}
                      className="size-7 rounded-full object-cover"
                      src={owner.avatar}
                    />
                  ) : (
                    <UserCircle aria-hidden="true" className="size-5" />
                  )}
                  {ownerName}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Heart
                    aria-hidden="true"
                    className={[
                      "size-4",
                      isLiked ? "fill-signal-red text-signal-red" : "",
                    ].join(" ")}
                  />
                  {likesCount} likes
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-soft)] bg-white/20 px-4 py-2.5 text-sm font-bold text-[var(--text-primary)] shadow-soft transition hover:bg-white/40"
                onClick={handleLike}
                type="button"
              >
                <Heart
                  aria-hidden="true"
                  className={[
                    "size-4",
                    isLiked ? "fill-signal-red text-signal-red" : "",
                  ].join(" ")}
                />
                {isLiked ? "Liked" : "Like"}
              </button>
              {project.githubUrl ? (
                <a
                  className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-soft)] bg-white/20 px-4 py-2.5 text-sm font-bold text-[var(--text-primary)] shadow-soft transition hover:bg-white/40"
                  href={project.githubUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  <GitFork aria-hidden="true" className="size-4" />
                  Code
                </a>
              ) : null}
              {project.liveUrl ? (
                <a
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-bold text-white shadow-soft transition hover:bg-brand-700"
                  href={project.liveUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  <ExternalLink aria-hidden="true" className="size-4" />
                  Live
                </a>
              ) : null}
            </div>
          </div>

          <p className="mt-7 max-w-3xl text-base leading-8 text-[var(--text-secondary)]">
            {project.description || "No description added yet."}
          </p>

          {techStack.length > 0 ? (
            <div className="mt-8">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-600">
                Tech stack
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <span
                    className="rounded-lg bg-brand-600/10 px-3 py-1.5 text-sm font-bold text-brand-600"
                    key={tech}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {tags.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span className="text-sm font-semibold text-[var(--text-muted)]" key={tag}>
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </article>
    </section>
  );
};

export default ProjectDetailsPage;
