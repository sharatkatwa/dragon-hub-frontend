import { ArrowLeft, ImagePlus, Loader2, Rocket, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import FormInput from "../../components/forms/FormInput";
import { toast } from "../../components/toast/toast";
import { useProjects } from "../../features/projects/useProjects";

const NewProjectPage = () => {
  const navigate = useNavigate();
  const { addProject, isMutating } = useProjects();
  const [imageFile, setImageFile] = useState(null);

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm({
    defaultValues: {
      description: "",
      githubUrl: "",
      liveUrl: "",
      tags: "",
      techStack: "",
      title: "",
    },
    mode: "onBlur",
  });

  const imagePreview = useMemo(
    () => (imageFile ? URL.createObjectURL(imageFile) : ""),
    [imageFile]
  );

  const handleCreateProject = async (values) => {
    const formData = new FormData();

    formData.append("title", values.title.trim());
    formData.append("description", values.description.trim());
    formData.append("techStack", values.techStack.trim());

    if (values.githubUrl.trim()) {
      formData.append("githubUrl", values.githubUrl.trim());
    }
    if (values.liveUrl.trim()) {
      formData.append("liveUrl", values.liveUrl.trim());
    }
    if (values.tags.trim()) {
      formData.append("tags", values.tags.trim());
    }
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const project = await addProject(formData);

      toast.success("Your project has been published.", {
        title: "Project posted",
      });

      reset();
      setImageFile(null);
      navigate(`/projects/${project?._id || project?.id}`);
    } catch (error) {
      toast.error(error || "Unable to post your project.", {
        title: "Project failed",
      });
    }
  };

  return (
    <section className="space-y-6">
      <Link
        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-[var(--text-secondary)] transition hover:bg-white/10 hover:text-[var(--text-primary)]"
        to="/projects"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Projects
      </Link>

      <div className="surface-panel rounded-xl p-5 sm:p-6">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-600">
          New project
        </p>
        <h2 className="mt-2 text-3xl font-bold text-[var(--text-primary)] sm:text-4xl">
          Share something worth exploring
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
          Add the core details, stack, links, and a preview image. Fields with
          project substance come first; polish can follow.
        </p>
      </div>

      <form
        className="grid gap-6 lg:grid-cols-[1fr_360px]"
        onSubmit={handleSubmit(handleCreateProject)}
      >
        <div className="surface-panel space-y-5 rounded-xl p-5 sm:p-6">
          <FormInput
            error={errors.title}
            id="title"
            label="Project title"
            placeholder="DragonHub"
            registration={register("title", {
              required: "Project title is required",
              minLength: {
                value: 3,
                message: "Title must be at least 3 characters",
              },
            })}
          />

          <div className="space-y-2">
            <label
              className="block text-sm font-semibold text-[var(--text-primary)]"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              className="min-h-36 w-full resize-y rounded-lg border border-[var(--border-soft)] bg-white/10 px-4 py-3 text-sm text-[var(--text-primary)] shadow-sm outline-none backdrop-blur placeholder:text-[var(--text-muted)] transition duration-200 focus:border-brand-500 focus:bg-white/15 focus:ring-4 focus:ring-[var(--focus-ring)]"
              id="description"
              placeholder="What does it do, who is it for, and what makes it interesting?"
              {...register("description", {
                required: "Description is required",
                minLength: {
                  value: 20,
                  message: "Description must be at least 20 characters",
                },
              })}
            />
            {errors.description ? (
              <p className="text-sm font-medium text-signal-red">
                {errors.description.message}
              </p>
            ) : null}
          </div>

          <FormInput
            error={errors.techStack}
            hint="Separate technologies with commas."
            id="techStack"
            label="Tech stack"
            placeholder="React, Node.js, MongoDB"
            registration={register("techStack", {
              required: "Tech stack is required",
              minLength: {
                value: 2,
                message: "Add at least one technology",
              },
            })}
          />

          <div className="grid gap-5 md:grid-cols-2">
            <FormInput
              error={errors.githubUrl}
              id="githubUrl"
              label="GitHub URL"
              placeholder="https://github.com/user/project"
              registration={register("githubUrl", {
                pattern: {
                  value: /^https?:\/\/.+/i,
                  message: "Enter a valid URL",
                },
              })}
              type="url"
            />

            <FormInput
              error={errors.liveUrl}
              id="liveUrl"
              label="Live URL"
              placeholder="https://project.dev"
              registration={register("liveUrl", {
                pattern: {
                  value: /^https?:\/\/.+/i,
                  message: "Enter a valid URL",
                },
              })}
              type="url"
            />
          </div>

          <FormInput
            hint="Separate tags with commas."
            id="tags"
            label="Tags"
            placeholder="fullstack, social, portfolio"
            registration={register("tags")}
          />
        </div>

        <aside className="surface-panel h-fit rounded-xl p-5 sm:p-6">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-600">
            Preview image
          </p>

          <div className="mt-4 overflow-hidden rounded-xl border border-[var(--border-soft)] bg-white/10">
            {imagePreview ? (
              <div className="relative aspect-[16/10]">
                <img
                  alt="Project preview"
                  className="size-full object-cover"
                  src={imagePreview}
                />
                <button
                  aria-label="Remove selected image"
                  className="absolute right-3 top-3 grid size-9 place-items-center rounded-lg bg-ink-950/65 text-white backdrop-blur transition hover:bg-ink-950/80"
                  onClick={() => setImageFile(null)}
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
                    Upload project image
                  </span>
                  <span className="mt-1 block text-xs text-[var(--text-muted)]">
                    PNG, JPG, or WEBP
                  </span>
                </span>
                <input
                  accept="image/*"
                  className="sr-only"
                  onChange={(event) =>
                    setImageFile(event.target.files?.[0] || null)
                  }
                  type="file"
                />
              </label>
            )}
          </div>

          {imagePreview ? (
            <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-[var(--text-secondary)] transition hover:bg-white/10 hover:text-[var(--text-primary)]">
              <ImagePlus aria-hidden="true" className="size-4" />
              Change image
              <input
                accept="image/*"
                className="sr-only"
                onChange={(event) => setImageFile(event.target.files?.[0] || null)}
                type="file"
              />
            </label>
          ) : null}

          <button
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isSubmitting || isMutating}
            type="submit"
          >
            {isSubmitting || isMutating ? (
              <Loader2 aria-hidden="true" className="size-4 animate-spin" />
            ) : (
              <Rocket aria-hidden="true" className="size-4" />
            )}
            Post project
          </button>
        </aside>
      </form>
    </section>
  );
};

export default NewProjectPage;
