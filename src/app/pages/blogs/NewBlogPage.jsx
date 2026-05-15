import { ArrowLeft, FileText, ImagePlus, Loader2, Send, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import FormInput from "../../components/forms/FormInput";
import { toast } from "../../components/toast/toast";
import { useBlogs } from "../../features/blogs/useBlogs";

const NewBlogPage = () => {
  const navigate = useNavigate();
  const { addBlog, isMutating } = useBlogs();
  const [coverFile, setCoverFile] = useState(null);

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm({
    defaultValues: {
      category: "",
      content: "",
      excerpt: "",
      tags: "",
      title: "",
    },
    mode: "onBlur",
  });

  const coverPreview = useMemo(
    () => (coverFile ? URL.createObjectURL(coverFile) : ""),
    [coverFile]
  );

  const handleCreateBlog = async (values) => {
    const formData = new FormData();

    formData.append("title", values.title.trim());
    formData.append("content", values.content.trim());

    if (values.excerpt.trim()) {
      formData.append("excerpt", values.excerpt.trim());
    }
    if (values.category.trim()) {
      formData.append("category", values.category.trim());
    }
    if (values.tags.trim()) {
      formData.append("tags", values.tags.trim());
    }
    if (coverFile) {
      formData.append("coverImage", coverFile);
    }

    try {
      const blog = await addBlog(formData);

      toast.success("Your blog has been published.", {
        title: "Blog posted",
      });

      reset();
      setCoverFile(null);
      navigate(`/blogs/${blog?.slug}`);
    } catch (error) {
      toast.error(error || "Unable to post your blog.", {
        title: "Blog failed",
      });
    }
  };

  return (
    <section className="space-y-6">
      <Link
        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-[var(--text-secondary)] transition hover:bg-white/10 hover:text-[var(--text-primary)]"
        to="/blogs"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Blogs
      </Link>

      <div className="surface-panel rounded-xl p-5 sm:p-6">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-600">
          New blog
        </p>
        <h2 className="mt-2 text-3xl font-bold text-[var(--text-primary)] sm:text-4xl">
          Publish a technical article
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
          Write in markdown, add a clear excerpt, and make the piece easy to
          discover with category and tags.
        </p>
      </div>

      <form
        className="grid gap-6 lg:grid-cols-[1fr_360px]"
        onSubmit={handleSubmit(handleCreateBlog)}
      >
        <div className="surface-panel space-y-5 rounded-xl p-5 sm:p-6">
          <FormInput
            error={errors.title}
            id="title"
            label="Blog title"
            placeholder="How to Build an Express API"
            registration={register("title", {
              required: "Blog title is required",
              minLength: {
                value: 5,
                message: "Title must be at least 5 characters",
              },
            })}
          />

          <div className="space-y-2">
            <label
              className="block text-sm font-semibold text-[var(--text-primary)]"
              htmlFor="excerpt"
            >
              Excerpt
            </label>
            <textarea
              className="min-h-24 w-full resize-y rounded-lg border border-[var(--border-soft)] bg-white/10 px-4 py-3 text-sm text-[var(--text-primary)] shadow-sm outline-none backdrop-blur placeholder:text-[var(--text-muted)] transition duration-200 focus:border-brand-500 focus:bg-white/15 focus:ring-4 focus:ring-[var(--focus-ring)]"
              id="excerpt"
              placeholder="A short summary people will see before opening the article."
              {...register("excerpt", {
                maxLength: {
                  value: 180,
                  message: "Excerpt must stay under 180 characters",
                },
              })}
            />
            {errors.excerpt ? (
              <p className="text-sm font-medium text-signal-red">
                {errors.excerpt.message}
              </p>
            ) : null}
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <FormInput
              error={errors.category}
              id="category"
              label="Category"
              placeholder="backend"
              registration={register("category", {
                minLength: {
                  value: 2,
                  message: "Category must be at least 2 characters",
                },
              })}
            />

            <FormInput
              hint="Separate tags with commas."
              id="tags"
              label="Tags"
              placeholder="node, express, mongodb"
              registration={register("tags")}
            />
          </div>

          <div className="space-y-2">
            <label
              className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]"
              htmlFor="content"
            >
              <FileText aria-hidden="true" className="size-4 text-brand-600" />
              Markdown content
            </label>
            <textarea
              className="min-h-[28rem] w-full resize-y rounded-lg border border-[var(--border-soft)] bg-white/10 px-4 py-3 font-mono text-sm leading-7 text-[var(--text-primary)] shadow-sm outline-none backdrop-blur placeholder:text-[var(--text-muted)] transition duration-200 focus:border-brand-500 focus:bg-white/15 focus:ring-4 focus:ring-[var(--focus-ring)]"
              id="content"
              placeholder={`# Introduction\n\nWrite your article in markdown...\n\n## What you will learn\n\n- Point one\n- Point two`}
              {...register("content", {
                required: "Blog content is required",
                minLength: {
                  value: 80,
                  message: "Content must be at least 80 characters",
                },
              })}
            />
            {errors.content ? (
              <p className="text-sm font-medium text-signal-red">
                {errors.content.message}
              </p>
            ) : (
              <p className="text-xs text-[var(--text-muted)]">
                Supports headings, lists, links, tables, code blocks, and images.
              </p>
            )}
          </div>
        </div>

        <aside className="surface-panel h-fit rounded-xl p-5 sm:p-6">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-600">
            Cover image
          </p>

          <div className="mt-4 overflow-hidden rounded-xl border border-[var(--border-soft)] bg-white/10">
            {coverPreview ? (
              <div className="relative aspect-[16/10]">
                <img
                  alt="Blog cover preview"
                  className="size-full object-cover"
                  src={coverPreview}
                />
                <button
                  aria-label="Remove selected cover"
                  className="absolute right-3 top-3 grid size-9 place-items-center rounded-lg bg-ink-950/65 text-white backdrop-blur transition hover:bg-ink-950/80"
                  onClick={() => setCoverFile(null)}
                  type="button"
                >
                  <X aria-hidden="true" className="size-4" />
                </button>
              </div>
            ) : (
              <label className="grid aspect-[16/10] cursor-pointer place-items-center p-6 text-center transition hover:bg-white/10">
                <span>
                  <ImagePlus
                    aria-hidden="true"
                    className="mx-auto size-9 text-brand-600"
                  />
                  <span className="mt-3 block text-sm font-bold text-[var(--text-primary)]">
                    Upload cover image
                  </span>
                  <span className="mt-1 block text-xs text-[var(--text-muted)]">
                    PNG, JPG, or WEBP
                  </span>
                </span>
                <input
                  accept="image/*"
                  className="sr-only"
                  onChange={(event) =>
                    setCoverFile(event.target.files?.[0] || null)
                  }
                  type="file"
                />
              </label>
            )}
          </div>

          {coverPreview ? (
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
          ) : null}

          <div className="mt-5 rounded-xl border border-[var(--border-soft)] bg-white/10 p-4">
            <p className="text-sm font-bold text-[var(--text-primary)]">
              Publishing checklist
            </p>
            <ul className="mt-3 space-y-2 text-sm text-[var(--text-secondary)]">
              <li>Title is specific and searchable.</li>
              <li>Excerpt explains the value quickly.</li>
              <li>Content uses markdown structure.</li>
              <li>Tags are comma-separated.</li>
            </ul>
          </div>

          <button
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isSubmitting || isMutating}
            type="submit"
          >
            {isSubmitting || isMutating ? (
              <Loader2 aria-hidden="true" className="size-4 animate-spin" />
            ) : (
              <Send aria-hidden="true" className="size-4" />
            )}
            Post blog
          </button>
        </aside>
      </form>
    </section>
  );
};

export default NewBlogPage;
