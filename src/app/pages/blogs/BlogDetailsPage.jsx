import {
  ArrowLeft,
  CalendarDays,
  Heart,
  Loader2,
  UserCircle,
} from "lucide-react";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Link, useParams } from "react-router";
import remarkGfm from "remark-gfm";
import EmptyState from "../../components/feedback/EmptyState";
import { toast } from "../../components/toast/toast";
import { useAuth } from "../../features/auth/useAuth";
import { useBlogs } from "../../features/blogs/useBlogs";
import { isLikedByUser } from "../../utils/likes";

const formatDate = (date) => {
  if (!date) {
    return "Draft";
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
};

const BlogDetailsPage = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const {
    clearSelected,
    error,
    isLoading,
    likeBlog,
    loadBlogBySlug,
    selectedBlog: blog,
  } = useBlogs();

  useEffect(() => {
    loadBlogBySlug(slug).catch((message) => {
      toast.error(message || "Unable to load blog.", {
        title: "Blog failed",
      });
    });

    return () => clearSelected();
  }, [clearSelected, loadBlogBySlug, slug]);

  const handleLike = async () => {
    try {
      await likeBlog(blog?._id || blog?.id);
    } catch (message) {
      toast.error(message || "Unable to update like.", {
        title: "Action failed",
      });
    }
  };

  if (isLoading && !blog) {
    return (
      <section className="surface-panel grid min-h-80 place-items-center rounded-xl p-8">
        <div className="flex items-center gap-3 text-[var(--text-secondary)]">
          <Loader2 aria-hidden="true" className="size-5 animate-spin" />
          Loading blog...
        </div>
      </section>
    );
  }

  if (error && !blog) {
    return (
      <EmptyState
        action={
          <Link
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-bold text-white shadow-soft transition hover:bg-brand-700"
            to="/blogs"
          >
            Back to blogs
          </Link>
        }
        message={error}
        title="Blog unavailable"
      />
    );
  }

  if (!blog) {
    return null;
  }

  const author = blog.author || {};
  const authorName = author.fullName || author.username || "Developer";
  const tags = Array.isArray(blog.tags) ? blog.tags : [];
  const likesCount = blog.likesCount ?? blog.likes?.length ?? 0;
  const isLiked = isLikedByUser(blog, user);

  return (
    <article className="space-y-6">
      <Link
        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-[var(--text-secondary)] transition hover:bg-white/45 hover:text-[var(--text-primary)]"
        to="/blogs"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Blogs
      </Link>

      <header className="surface-panel overflow-hidden rounded-xl">
        {blog.coverImage ? (
          <div className="aspect-[16/7] min-h-64 overflow-hidden bg-ink-900">
            <img
              alt={blog.title}
              className="size-full object-cover"
              src={blog.coverImage}
            />
          </div>
        ) : null}

        <div className="p-5 sm:p-7">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-600">
            {blog.category || "Article"}
          </p>
          <h1 className="mt-3 max-w-4xl text-4xl font-bold leading-tight text-[var(--text-primary)] sm:text-5xl">
            {blog.title}
          </h1>
          {blog.excerpt ? (
            <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--text-secondary)]">
              {blog.excerpt}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-[var(--text-secondary)]">
            <span className="inline-flex items-center gap-2">
              {author.avatar ? (
                <img
                  alt={authorName}
                  className="size-7 rounded-full object-cover"
                  src={author.avatar}
                />
              ) : (
                <UserCircle aria-hidden="true" className="size-5" />
              )}
              {authorName}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays aria-hidden="true" className="size-4" />
              {formatDate(blog.publishedAt || blog.createdAt)}
            </span>
            <button
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-soft)] bg-white/20 px-3 py-1.5 font-bold text-[var(--text-primary)] transition hover:bg-white/40"
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
              {likesCount}
            </button>
          </div>

          {tags.length > 0 ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  className="rounded-lg bg-brand-600/10 px-3 py-1.5 text-sm font-bold text-brand-600"
                  key={tag}
                >
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </header>

      <section className="surface-panel rounded-xl p-5 sm:p-8">
        <div className="markdown-content max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {blog.content || "No content available."}
          </ReactMarkdown>
        </div>
      </section>
    </article>
  );
};

export default BlogDetailsPage;
