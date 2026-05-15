import { ArrowLeft, ImagePlus, Loader2, Save, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router";
import FormInput from "../../components/forms/FormInput";
import { toast } from "../../components/toast/toast";
import { useBlogs } from "../../features/blogs/useBlogs";

const getDefaultValues = (blog) => ({
  category: blog?.category || "",
  content: blog?.content || "",
  excerpt: blog?.excerpt || "",
  tags: Array.isArray(blog?.tags) ? blog.tags.join(", ") : "",
  title: blog?.title || "",
});

const EditBlogPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const {
    isLoading,
    isMutating,
    loadBlogBySlug,
    saveBlog,
    selectedBlog: blog,
  } = useBlogs();
  const [coverFile, setCoverFile] = useState(null);

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm({
    defaultValues: getDefaultValues(blog),
    mode: "onBlur",
  });

  useEffect(() => {
    loadBlogBySlug(slug).catch((message) => {
      toast.error(message || "Unable to load blog.", {
        title: "Blog failed",
      });
    });
  }, [loadBlogBySlug, slug]);

  useEffect(() => {
    reset(getDefaultValues(blog));
  }, [blog, reset]);

  const coverPreview = useMemo(
    () => (coverFile ? URL.createObjectURL(coverFile) : blog?.coverImage || ""),
    [blog?.coverImage, coverFile]
  );

  const handleUpdateBlog = async (values) => {
    const formData = new FormData();
    const blogId = blog?._id || blog?.id;

    formData.append("title", values.title.trim());
    formData.append("content", values.content.trim());
    formData.append("excerpt", values.excerpt.trim());
    formData.append("category", values.category.trim());
    formData.append("tags", values.tags.trim());

    if (coverFile) {
      formData.append("coverImage", coverFile);
    }

    try {
      const updatedBlog = await saveBlog(blogId, formData);

      toast.success("Blog updated.", {
        title: "Saved",
      });
      navigate(`/blogs/${updatedBlog?.slug || slug}`);
    } catch (error) {
      toast.error(error || "Unable to update blog.", {
        title: "Update failed",
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

  return (
    <section className="space-y-6">
      <Link
        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-[var(--text-secondary)] transition hover:bg-white/10 hover:text-[var(--text-primary)]"
        to="/profile"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Profile
      </Link>

      <div className="surface-panel rounded-xl p-5 sm:p-6">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-600">
          Edit blog
        </p>
        <h2 className="mt-2 text-3xl font-bold text-[var(--text-primary)]">
          Update article
        </h2>
      </div>

      <form
        className="grid gap-6 lg:grid-cols-[1fr_360px]"
        onSubmit={handleSubmit(handleUpdateBlog)}
      >
        <div className="surface-panel space-y-5 rounded-xl p-5 sm:p-6">
          <FormInput
            error={errors.title}
            id="title"
            label="Blog title"
            registration={register("title", {
              required: "Blog title is required",
            })}
          />

          <div className="grid gap-5 md:grid-cols-2">
            <FormInput id="category" label="Category" registration={register("category")} />
            <FormInput
              hint="Separate tags with commas."
              id="tags"
              label="Tags"
              registration={register("tags")}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[var(--text-primary)]" htmlFor="excerpt">
              Excerpt
            </label>
            <textarea
              className="min-h-24 w-full resize-y rounded-lg border border-[var(--border-soft)] bg-white/10 px-4 py-3 text-sm text-[var(--text-primary)] shadow-sm outline-none backdrop-blur placeholder:text-[var(--text-muted)] transition duration-200 focus:border-brand-500 focus:bg-white/15 focus:ring-4 focus:ring-[var(--focus-ring)]"
              id="excerpt"
              {...register("excerpt")}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[var(--text-primary)]" htmlFor="content">
              Markdown content
            </label>
            <textarea
              className="min-h-[28rem] w-full resize-y rounded-lg border border-[var(--border-soft)] bg-white/10 px-4 py-3 font-mono text-sm leading-7 text-[var(--text-primary)] shadow-sm outline-none backdrop-blur placeholder:text-[var(--text-muted)] transition duration-200 focus:border-brand-500 focus:bg-white/15 focus:ring-4 focus:ring-[var(--focus-ring)]"
              id="content"
              {...register("content", {
                required: "Blog content is required",
              })}
            />
            {errors.content ? (
              <p className="text-sm font-medium text-signal-red">
                {errors.content.message}
              </p>
            ) : null}
          </div>
        </div>

        <aside className="surface-panel h-fit rounded-xl p-5 sm:p-6">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-600">
            Cover image
          </p>

          <div className="mt-4 overflow-hidden rounded-xl border border-[var(--border-soft)] bg-white/10">
            {coverPreview ? (
              <div className="relative aspect-[16/10]">
                <img alt="" className="size-full object-cover" src={coverPreview} />
                {coverFile ? (
                  <button
                    aria-label="Remove selected cover"
                    className="absolute right-3 top-3 grid size-9 place-items-center rounded-lg bg-ink-950/65 text-white backdrop-blur transition hover:bg-ink-950/80"
                    onClick={() => setCoverFile(null)}
                    type="button"
                  >
                    <X aria-hidden="true" className="size-4" />
                  </button>
                ) : null}
              </div>
            ) : (
              <div className="grid aspect-[16/10] place-items-center text-sm text-[var(--text-muted)]">
                No cover
              </div>
            )}
          </div>

          <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-[var(--text-secondary)] transition hover:bg-white/10 hover:text-[var(--text-primary)]">
            <ImagePlus aria-hidden="true" className="size-4" />
            Change cover
            <input
              accept="image/*"
              className="sr-only"
              onChange={(event) => setCoverFile(event.target.files?.[0] || null)}
              type="file"
            />
          </label>

          <button
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isSubmitting || isMutating}
            type="submit"
          >
            {isSubmitting || isMutating ? (
              <Loader2 aria-hidden="true" className="size-4 animate-spin" />
            ) : (
              <Save aria-hidden="true" className="size-4" />
            )}
            Save blog
          </button>
        </aside>
      </form>
    </section>
  );
};

export default EditBlogPage;
