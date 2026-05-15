import { ArrowLeft, ImagePlus, Loader2, Save, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router";
import FormInput from "../../components/forms/FormInput";
import { toast } from "../../components/toast/toast";
import { useProjects } from "../../features/projects/useProjects";

const getDefaultValues = (project) => ({
  description: project?.description || "",
  githubUrl: project?.githubUrl || "",
  liveUrl: project?.liveUrl || "",
  tags: Array.isArray(project?.tags) ? project.tags.join(", ") : "",
  techStack: Array.isArray(project?.techStack) ? project.techStack.join(", ") : "",
  title: project?.title || "",
});

const EditProjectPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const {
    isLoading,
    isMutating,
    loadProjectById,
    saveProject,
    selectedProject: project,
  } = useProjects();
  const [imageFile, setImageFile] = useState(null);

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm({
    defaultValues: getDefaultValues(project),
    mode: "onBlur",
  });

  useEffect(() => {
    loadProjectById(projectId).catch((message) => {
      toast.error(message || "Unable to load project.", {
        title: "Project failed",
      });
    });
  }, [loadProjectById, projectId]);

  useEffect(() => {
    reset(getDefaultValues(project));
  }, [project, reset]);

  const imagePreview = useMemo(
    () => (imageFile ? URL.createObjectURL(imageFile) : project?.image || ""),
    [imageFile, project?.image]
  );

  const handleUpdateProject = async (values) => {
    const formData = new FormData();

    formData.append("title", values.title.trim());
    formData.append("description", values.description.trim());
    formData.append("techStack", values.techStack.trim());
    formData.append("githubUrl", values.githubUrl.trim());
    formData.append("liveUrl", values.liveUrl.trim());
    formData.append("tags", values.tags.trim());

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const updatedProject = await saveProject(projectId, formData);

      toast.success("Project updated.", {
        title: "Saved",
      });
      navigate(`/projects/${updatedProject?._id || updatedProject?.id || projectId}`);
    } catch (error) {
      toast.error(error || "Unable to update project.", {
        title: "Update failed",
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

  return (
    <section className="space-y-6">
      <Link
        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-[var(--text-secondary)] transition hover:bg-white/15 hover:text-[var(--text-primary)]"
        to="/profile"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Profile
      </Link>

      <div className="surface-panel rounded-xl p-5 sm:p-6">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-600">
          Edit project
        </p>
        <h2 className="mt-2 text-3xl font-bold text-[var(--text-primary)]">
          Update project details
        </h2>
      </div>

      <form
        className="grid gap-6 lg:grid-cols-[1fr_360px]"
        onSubmit={handleSubmit(handleUpdateProject)}
      >
        <div className="surface-panel space-y-5 rounded-xl p-5 sm:p-6">
          <FormInput
            error={errors.title}
            id="title"
            label="Project title"
            registration={register("title", {
              required: "Project title is required",
            })}
          />

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[var(--text-primary)]" htmlFor="description">
              Description
            </label>
            <textarea
              className="min-h-36 w-full resize-y rounded-lg border border-[var(--border-soft)] bg-white/15 px-4 py-3 text-sm text-[var(--text-primary)] shadow-sm outline-none backdrop-blur placeholder:text-[var(--text-muted)] transition duration-200 focus:border-brand-500 focus:bg-white/15 focus:ring-4 focus:ring-[var(--focus-ring)]"
              id="description"
              {...register("description", {
                required: "Description is required",
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
            registration={register("techStack", {
              required: "Tech stack is required",
            })}
          />

          <div className="grid gap-5 md:grid-cols-2">
            <FormInput id="githubUrl" label="GitHub URL" registration={register("githubUrl")} type="url" />
            <FormInput id="liveUrl" label="Live URL" registration={register("liveUrl")} type="url" />
          </div>

          <FormInput
            hint="Separate tags with commas."
            id="tags"
            label="Tags"
            registration={register("tags")}
          />
        </div>

        <aside className="surface-panel h-fit rounded-xl p-5 sm:p-6">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-600">
            Project image
          </p>

          <div className="mt-4 overflow-hidden rounded-xl border border-[var(--border-soft)] bg-white/10">
            {imagePreview ? (
              <div className="relative aspect-[16/10]">
                <img alt="" className="size-full object-cover" src={imagePreview} />
                {imageFile ? (
                  <button
                    aria-label="Remove selected image"
                    className="absolute right-3 top-3 grid size-9 place-items-center rounded-lg bg-ink-950/65 text-white backdrop-blur transition hover:bg-ink-950/80"
                    onClick={() => setImageFile(null)}
                    type="button"
                  >
                    <X aria-hidden="true" className="size-4" />
                  </button>
                ) : null}
              </div>
            ) : (
              <div className="grid aspect-[16/10] place-items-center text-sm text-[var(--text-muted)]">
                No image
              </div>
            )}
          </div>

          <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-[var(--text-secondary)] transition hover:bg-white/15 hover:text-[var(--text-primary)]">
            <ImagePlus aria-hidden="true" className="size-4" />
            Change image
            <input
              accept="image/*"
              className="sr-only"
              onChange={(event) => setImageFile(event.target.files?.[0] || null)}
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
            Save project
          </button>
        </aside>
      </form>
    </section>
  );
};

export default EditProjectPage;
