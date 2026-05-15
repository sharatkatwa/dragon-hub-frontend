import { BriefcaseBusiness, Globe, UserCircle } from "lucide-react";
import { Link } from "react-router";

const UserCard = ({ user }) => {
  const userId = user?._id || user?.id;
  const displayName = user?.fullName || user?.username || "Developer";
  const skills = Array.isArray(user?.skills) ? user.skills : [];
  const hasWebsite = Boolean(user?.socialLinks?.website);

  return (
    <article className="surface-panel interactive-surface overflow-hidden rounded-xl">
      <div className="h-24 bg-ink-900">
        {user?.banner ? (
          <img
            alt=""
            className="size-full object-cover"
            src={user.banner}
          />
        ) : (
          <div className="size-full bg-[radial-gradient(circle_at_22%_18%,rgb(126_224_191_/_0.28),transparent_13rem),linear-gradient(135deg,#17382f,#071013)]" />
        )}
      </div>

      <div className="px-4 pb-4">
        <div className="-mt-8 flex items-end justify-between gap-3">
          {user?.avatar ? (
            <img
              alt={displayName}
              className="size-16 rounded-xl border-4 border-[var(--surface-panel-strong)] object-cover shadow-soft"
              src={user.avatar}
            />
          ) : (
            <span className="grid size-16 place-items-center rounded-xl border-4 border-[var(--surface-panel-strong)] bg-brand-600/10 text-brand-600 shadow-soft">
              <UserCircle aria-hidden="true" className="size-9" />
            </span>
          )}

          <Link
            className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-bold text-white shadow-soft transition hover:bg-brand-700"
            to={`/users/${userId}`}
          >
            View
          </Link>
        </div>

        <div className="mt-4">
          <Link
            className="text-xl font-bold text-[var(--text-primary)] hover:text-brand-600"
            to={`/users/${userId}`}
          >
            {displayName}
          </Link>
          <p className="mt-1 font-mono text-xs text-[var(--text-muted)]">
            @{user?.username || "developer"}
          </p>
        </div>

        <p className="mt-3 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-[var(--text-secondary)]">
          {user?.bio || "No bio added yet."}
        </p>

        {skills.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {skills.slice(0, 4).map((skill) => (
              <span
                className="rounded-lg bg-brand-600/10 px-2.5 py-1 text-xs font-bold text-brand-600"
                key={skill}
              >
                {skill}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)]">
          <BriefcaseBusiness aria-hidden="true" className="size-4" />
          <span>Developer profile</span>
          {hasWebsite ? (
            <>
              <span className="ml-auto" />
              <Globe aria-hidden="true" className="size-4" />
            </>
          ) : null}
        </div>
      </div>
    </article>
  );
};

export default UserCard;
