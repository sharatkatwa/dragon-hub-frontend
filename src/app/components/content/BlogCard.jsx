import { CalendarDays, Heart } from "lucide-react";
import { Link } from "react-router";
import { useAuth } from "../../features/auth/useAuth";
import { isLikedByUser } from "../../utils/likes";

const formatDate = (date) => {
  if (!date) {
    return "Unpublished";
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

const BlogCard = ({ blog }) => {
  const { user } = useAuth();
  const authorName = blog?.author?.fullName || blog?.author?.username || "Developer";
  const tags = Array.isArray(blog?.tags) ? blog.tags : [];
  const likesCount = blog?.likesCount ?? blog?.likes?.length ?? 0;
  const isLiked = isLikedByUser(blog, user);

  return (
    <article className="surface-panel interactive-surface flex h-full flex-col overflow-hidden rounded-xl group">
      <Link className="block aspect-[16/9] overflow-hidden bg-ink-900" to={`/blogs/${blog?.slug}`}>
        {blog?.coverImage ? (
          <img
            alt={blog.title}
            className="size-full object-cover transition-transform duration-150 ease-out group-hover:scale-[1.03]"
            src={blog.coverImage}
          />
        ) : (
          <div className="grid size-full place-items-center bg-[radial-gradient(circle_at_78%_22%,rgb(58_134_255_/_0.22),transparent_15rem),linear-gradient(135deg,#13242a,#071013)] px-5 text-center">
            <span className="text-lg font-bold text-white">{blog?.category || "Article"}</span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-3 text-xs font-bold text-[var(--text-muted)]">
          <span className="rounded-lg bg-white/10 px-2.5 py-1 uppercase tracking-[0.12em]">
            {blog?.category || "General"}
          </span>
          <span className="inline-flex items-center gap-1">
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

        <Link
          className="mt-3 line-clamp-2 text-xl font-bold text-[var(--text-primary)] group-hover:text-brand-600"
          to={`/blogs/${blog?.slug}`}
        >
          {blog?.title || "Untitled blog"}
        </Link>

        <p className="mt-2 text-sm text-[var(--text-muted)]">by {authorName}</p>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-[var(--text-secondary)]">
          {blog?.excerpt || "No excerpt added yet."}
        </p>

        {tags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.slice(0, 4).map((tag) => (
              <span
                className="rounded-lg bg-brand-600/10 px-2.5 py-1 text-xs font-bold text-brand-600"
                key={tag}
              >
                #{tag}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)]">
            <CalendarDays aria-hidden="true" className="size-3.5" />
            {formatDate(blog?.publishedAt || blog?.createdAt)}
          </span>
          <Link
            className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-bold text-white shadow-soft transition hover:bg-brand-700"
            to={`/blogs/${blog?.slug}`}
          >
            Read
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
