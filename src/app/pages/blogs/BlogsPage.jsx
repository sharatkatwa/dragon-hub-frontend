import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import BlogCard from "../../components/content/BlogCard";
import CardSkeleton from "../../components/feedback/CardSkeleton";
import EmptyState from "../../components/feedback/EmptyState";
import { toast } from "../../components/toast/toast";
import { useBlogs } from "../../features/blogs/useBlogs";
import BlogQueryPanel from "./BlogQueryPanel";

const getQueryFromSearchParams = (searchParams) => ({
  search: searchParams.get("search") || "",
  tag: searchParams.get("tag") || "",
  category: searchParams.get("category") || "",
  sort: searchParams.get("sort") || "latest",
});

const BlogsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { blogs, count, error, isLoading, loadBlogs } = useBlogs();
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

    loadBlogs(params).catch((message) => {
      toast.error(message || "Unable to load blogs.", {
        title: "Blogs failed",
      });
    });
  }, [loadBlogs, query]);

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
      tag: "",
      category: "",
      sort: "latest",
    });
    setSearchParams({});
  };

  const hasFilters = Boolean(query.search || query.tag || query.category);

  return (
    <section className="space-y-6">
      <BlogQueryPanel
        formValues={formValues}
        hasFilters={hasFilters}
        onChange={handleChange}
        onReset={handleReset}
        onSubmit={handleSubmit}
      />

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-[var(--text-secondary)]">
          {isLoading ? "Loading blogs..." : `${count || blogs.length} blogs`}
        </p>
        {error ? <p className="text-sm font-semibold text-signal-red">{error}</p> : null}
      </div>

      {isLoading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      ) : blogs.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {blogs.map((blog) => (
            <BlogCard key={blog._id || blog.id || blog.slug} blog={blog} />
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
          message="Try a different search, tag, category, or sorting option."
          title="No blogs found"
        />
      )}
    </section>
  );
};

export default BlogsPage;
