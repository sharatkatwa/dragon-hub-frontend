import { ExternalLink, GitFork, Heart } from "lucide-react";
import { Link } from "react-router";
import { useAuth } from "../../features/auth/useAuth";
import { isLikedByUser } from "../../utils/likes";

const getProjectId = (project) => project?._id || project?.id;

const ProjectCard = ({ project }) => {
  const { user } = useAuth();
  const projectId = getProjectId(project);
  const ownerName =
    project?.owner?.fullName || project?.owner?.username || "Developer";
  const techStack = Array.isArray(project?.techStack) ? project.techStack : [];
  const tags = Array.isArray(project?.tags) ? project.tags : [];
  const likesCount = project?.likesCount ?? project?.likes?.length ?? 0;
  const isLiked = isLikedByUser(project, user);

  return (
    <article className="surface-panel interactive-surface flex h-full flex-col overflow-hidden rounded-xl group">
      <Link className="block aspect-[16/9] overflow-hidden bg-ink-900" to={`/projects/${projectId}`}>
        {project?.image ? (
          <img
            alt={project.title}
            className="size-full object-cover transition-transform duration-150 ease-out group-hover:scale-[1.03]"
            src={project.image}
          />
        ) : (
          <div className="grid size-full place-items-center bg-[radial-gradient(circle_at_20%_18%,rgb(126_224_191_/_0.26),transparent_16rem),linear-gradient(135deg,#17382f,#071013)] px-5 text-center">
            <span className="text-lg font-bold text-white">{project?.title}</span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              className="line-clamp-2 text-xl font-bold text-[var(--text-primary)] group-hover:text-brand-600"
              to={`/projects/${projectId}`}
            >
              {project?.title || "Untitled project"}
            </Link>
            <p className="mt-1 text-sm text-[var(--text-muted)]">by {ownerName}</p>
          </div>

          <span className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-[var(--border-soft)] bg-white/35 px-2 py-1 text-xs font-bold text-[var(--text-secondary)]">
            <Heart
              aria-hidden="true"
              className={[
                "size-3.5",
                isLiked ? "fill-signal-red text-signal-red" : "",
              ].join(" ")}
            />
            {likesCount}
          </span>
        </div>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-[var(--text-secondary)]">
          {project?.description || "No description added yet."}
        </p>

        {techStack.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {techStack.slice(0, 4).map((tech) => (
              <span
                className="rounded-lg bg-brand-600/10 px-2.5 py-1 text-xs font-bold text-brand-600"
                key={tech}
              >
                {tech}
              </span>
            ))}
          </div>
        ) : null}

        {tags.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.slice(0, 3).map((tag) => (
              <span className="text-xs font-semibold text-[var(--text-muted)]" key={tag}>
                #{tag}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-auto flex items-center gap-2 pt-5">
          <Link
            className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-bold text-white shadow-soft transition hover:bg-brand-700"
            to={`/projects/${projectId}`}
          >
            View
          </Link>
          {project?.githubUrl ? (
            <a
              aria-label="Open GitHub repository"
              className="grid size-9 place-items-center rounded-lg border border-[var(--border-soft)] text-[var(--text-secondary)] transition hover:bg-white/50 hover:text-[var(--text-primary)]"
              href={project.githubUrl}
              rel="noreferrer"
              target="_blank"
            >
              <GitFork aria-hidden="true" className="size-4" />
            </a>
          ) : null}
          {project?.liveUrl ? (
            <a
              aria-label="Open live project"
              className="grid size-9 place-items-center rounded-lg border border-[var(--border-soft)] text-[var(--text-secondary)] transition hover:bg-white/50 hover:text-[var(--text-primary)]"
              href={project.liveUrl}
              rel="noreferrer"
              target="_blank"
            >
              <ExternalLink aria-hidden="true" className="size-4" />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
