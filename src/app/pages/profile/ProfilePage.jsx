import {
  Camera,
  Check,
  BriefcaseBusiness,
  Edit3,
  FileText,
  GitFork,
  Globe,
  MessageCircle,
  Pencil,
  Save,
  Trash2,
  UserCircle,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import BlogCard from "../../components/content/BlogCard";
import ProjectCard from "../../components/content/ProjectCard";
import CardSkeleton from "../../components/feedback/CardSkeleton";
import EmptyState from "../../components/feedback/EmptyState";
import FormInput from "../../components/forms/FormInput";
import { toast } from "../../components/toast/toast";
import { useAuth } from "../../features/auth/useAuth";
import { useBlogs } from "../../features/blogs/useBlogs";
import { useProjects } from "../../features/projects/useProjects";

const socialItems = [
  { key: "github", label: "GitHub", icon: GitFork },
  { key: "linkedin", label: "LinkedIn", icon: BriefcaseBusiness },
  { key: "website", label: "Website", icon: Globe },
  { key: "twitter", label: "Twitter / X", icon: MessageCircle },
];

const getDefaultValues = (user) => ({
  bio: user?.bio || "",
  fullName: user?.fullName || "",
  github: user?.socialLinks?.github || "",
  linkedin: user?.socialLinks?.linkedin || "",
  skills: Array.isArray(user?.skills) ? user.skills.join(", ") : "",
  twitter: user?.socialLinks?.twitter || "",
  website: user?.socialLinks?.website || "",
});

const ProfilePage = () => {
  const { isLoading, saveProfile, saveProfileImages, user } = useAuth();
  const {
    isLoading: projectsLoading,
    loadUserProjects,
    removeProject,
    userProjects,
  } = useProjects();
  const {
    isLoading: blogsLoading,
    loadUserBlogs,
    removeBlog,
    userBlogs,
  } = useBlogs();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm({
    defaultValues: getDefaultValues(user),
    mode: "onBlur",
  });

  useEffect(() => {
    reset(getDefaultValues(user));
  }, [reset, user]);

  useEffect(() => {
    const userId = user?._id || user?.id;

    if (!userId) {
      return;
    }

    loadUserProjects(userId).catch(() => {});
    loadUserBlogs(userId).catch(() => {});
  }, [loadUserBlogs, loadUserProjects, user]);

  const avatarPreview = useMemo(
    () => (avatarFile ? URL.createObjectURL(avatarFile) : user?.avatar),
    [avatarFile, user?.avatar]
  );

  const bannerPreview = useMemo(
    () => (bannerFile ? URL.createObjectURL(bannerFile) : user?.banner),
    [bannerFile, user?.banner]
  );

  useEffect(() => {
    return () => {
      if (avatarPreview && avatarFile) {
        URL.revokeObjectURL(avatarPreview);
      }
      if (bannerPreview && bannerFile) {
        URL.revokeObjectURL(bannerPreview);
      }
    };
  }, [avatarFile, avatarPreview, bannerFile, bannerPreview]);

  const skills = Array.isArray(user?.skills) ? user.skills : [];
  const displayName = user?.fullName || user?.username || "Developer";

  const handleCancel = () => {
    reset(getDefaultValues(user));
    setAvatarFile(null);
    setBannerFile(null);
    setIsEditing(false);
  };

  const handleProfileSubmit = async (values) => {
    const payload = {
      bio: values.bio.trim(),
      fullName: values.fullName.trim(),
      skills: values.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
      socialLinks: {
        github: values.github.trim(),
        linkedin: values.linkedin.trim(),
        website: values.website.trim(),
        twitter: values.twitter.trim(),
      },
    };

    try {
      await saveProfile(payload);

      if (avatarFile || bannerFile) {
        const formData = new FormData();

        if (avatarFile) {
          formData.append("avatar", avatarFile);
        }
        if (bannerFile) {
          formData.append("banner", bannerFile);
        }

        await saveProfileImages(formData);
      }

      toast.success("Your profile has been updated.", {
        title: "Profile saved",
      });
      setAvatarFile(null);
      setBannerFile(null);
      setIsEditing(false);
    } catch (error) {
      toast.error(error || "Unable to update your profile.", {
        title: "Profile update failed",
      });
    }
  };

  const handleDeleteProject = async (projectId) => {
    const shouldDelete = window.confirm("Delete this project?");

    if (!shouldDelete) {
      return;
    }

    try {
      await removeProject(projectId);
      toast.success("Project deleted.", {
        title: "Deleted",
      });
    } catch (error) {
      toast.error(error || "Unable to delete project.", {
        title: "Delete failed",
      });
    }
  };

  const handleDeleteBlog = async (blogId) => {
    const shouldDelete = window.confirm("Delete this blog?");

    if (!shouldDelete) {
      return;
    }

    try {
      await removeBlog(blogId);
      toast.success("Blog deleted.", {
        title: "Deleted",
      });
    } catch (error) {
      toast.error(error || "Unable to delete blog.", {
        title: "Delete failed",
      });
    }
  };

  return (
    <section className="space-y-6">
      <div className="surface-panel overflow-hidden rounded-xl">
        <div className="relative h-52 bg-ink-900 sm:h-64">
          {bannerPreview ? (
            <img
              alt=""
              className="h-full w-full object-cover"
              src={bannerPreview}
            />
          ) : (
            <div className="h-full w-full bg-[radial-gradient(circle_at_18%_20%,rgb(126_224_191_/_0.32),transparent_18rem),linear-gradient(135deg,#17382f,#071013)]" />
          )}

          {isEditing ? (
            <label className="absolute right-4 top-4 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-ink-950/65 px-3 py-2 text-sm font-bold text-white backdrop-blur transition hover:bg-ink-950/80">
              <Camera aria-hidden="true" className="size-4" />
              Banner
              <input
                accept="image/*"
                className="sr-only"
                onChange={(event) => setBannerFile(event.target.files?.[0] || null)}
                type="file"
              />
            </label>
          ) : null}
        </div>

        <div className="px-5 pb-6 sm:px-7">
          <div className="-mt-14 flex flex-col gap-5 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="relative size-28 rounded-xl border-4 border-[var(--surface-panel-strong)] bg-[var(--surface-elevated)] shadow-soft sm:size-32">
                {avatarPreview ? (
                  <img
                    alt={displayName}
                    className="size-full rounded-lg object-cover"
                    src={avatarPreview}
                  />
                ) : (
                  <div className="grid size-full place-items-center rounded-lg text-brand-600">
                    <UserCircle aria-hidden="true" className="size-16" />
                  </div>
                )}

                {isEditing ? (
                  <label className="absolute -bottom-2 -right-2 grid size-10 cursor-pointer place-items-center rounded-lg bg-brand-600 text-white shadow-soft transition hover:bg-brand-700">
                    <Camera aria-hidden="true" className="size-4" />
                    <input
                      accept="image/*"
                      className="sr-only"
                      onChange={(event) =>
                        setAvatarFile(event.target.files?.[0] || null)
                      }
                      type="file"
                    />
                  </label>
                ) : null}
              </div>

              <div className="min-w-0 pb-1">
                <h2 className="text-3xl font-bold text-[var(--text-primary)]">
                  {displayName}
                </h2>
                <p className="mt-1 font-mono text-sm text-[var(--text-secondary)]">
                  @{user?.username || "username"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {isEditing ? (
                <>
                  <button
                    className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-[var(--text-secondary)] transition hover:bg-white/50 hover:text-[var(--text-primary)]"
                    onClick={handleCancel}
                    type="button"
                  >
                    <X aria-hidden="true" className="size-4" />
                    Cancel
                  </button>
                  <button
                    className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-bold text-white shadow-soft transition hover:bg-brand-700 disabled:opacity-70"
                    disabled={isSubmitting || isLoading}
                    form="profile-form"
                    type="submit"
                  >
                    <Save aria-hidden="true" className="size-4" />
                    Save profile
                  </button>
                </>
              ) : (
                <button
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-bold text-white shadow-soft transition hover:bg-brand-700"
                  onClick={() => setIsEditing(true)}
                  type="button"
                >
                  <Edit3 aria-hidden="true" className="size-4" />
                  Edit profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {isEditing ? (
        <form
          className="surface-panel grid gap-5 rounded-xl p-5 sm:p-6 lg:grid-cols-2"
          id="profile-form"
          onSubmit={handleSubmit(handleProfileSubmit)}
        >
          <FormInput
            error={errors.fullName}
            id="fullName"
            label="Full name"
            placeholder="Your display name"
            registration={register("fullName", {
              required: "Full name is required",
              minLength: {
                value: 2,
                message: "Full name must be at least 2 characters",
              },
            })}
          />

          <FormInput
            hint="Separate skills with commas."
            id="skills"
            label="Skills"
            placeholder="React, Node.js, MongoDB"
            registration={register("skills")}
          />

          <div className="space-y-2 lg:col-span-2">
            <label
              className="block text-sm font-semibold text-[var(--text-primary)]"
              htmlFor="bio"
            >
              Bio
            </label>
            <textarea
              className="min-h-32 w-full resize-y rounded-lg border border-[var(--border-soft)] bg-white/55 px-4 py-3 text-sm text-[var(--text-primary)] shadow-sm outline-none backdrop-blur placeholder:text-[var(--text-muted)] transition duration-200 focus:border-brand-500 focus:bg-white/75 focus:ring-4 focus:ring-[var(--focus-ring)]"
              id="bio"
              placeholder="Tell people what you build and what you care about."
              {...register("bio", {
                maxLength: {
                  value: 280,
                  message: "Bio must stay under 280 characters",
                },
              })}
            />
            {errors.bio ? (
              <p className="text-sm font-medium text-signal-red">
                {errors.bio.message}
              </p>
            ) : null}
          </div>

          {socialItems.map(({ key, label }) => (
            <FormInput
              id={key}
              key={key}
              label={label}
              placeholder={`https://${key}.com/yourname`}
              registration={register(key)}
              type="url"
            />
          ))}
        </form>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="surface-panel rounded-xl p-5 sm:p-6">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-600">
              Bio
            </p>
            <p className="mt-3 leading-7 text-[var(--text-secondary)]">
              {user?.bio || "No bio added yet. Add a short intro from edit profile."}
            </p>

            <div className="mt-7">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-600">
                Skills
              </p>
              {skills.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      className="rounded-full border-2 border-brand-500 bg-white/5 px-3 py-1.5 text-sm font-semibold text-[var(--color-brand-500)]"
                      key={skill}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-[var(--text-secondary)]">
                  No skills added yet.
                </p>
              )}
            </div>
          </div>

          <div className="surface-panel rounded-xl p-5 sm:p-6">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-600">
              Social links
            </p>
            <div className="mt-4 space-y-2">
              {socialItems.map(({ icon: Icon, key, label }) => {
                const href = user?.socialLinks?.[key];

                return href ? (
                  <a
                    className="interactive-surface flex items-center gap-3 rounded-lg border border-[var(--border-soft)] bg-white/10 px-3 py-3 text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    href={href}
                    key={key}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <Icon aria-hidden="true" className="size-4 text-brand-600" />
                    <span>{label}</span>
                    <Check aria-hidden="true" className="ml-auto size-4" />
                  </a>
                ) : (
                  <div
                    className="flex items-center gap-3 rounded-lg border border-dashed border-[var(--border-soft)] px-3 py-3 text-sm font-semibold text-[var(--text-muted)]"
                    key={key}
                  >
                    <Icon aria-hidden="true" className="size-4" />
                    <span>{label}</span>
                    <span className="ml-auto text-xs">Not added</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-600">
              Your work
            </p>
            <h2 className="mt-1 text-2xl font-bold text-[var(--text-primary)]">
              Posted projects
            </h2>
          </div>
          <Link
            className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-bold text-white shadow-soft transition hover:bg-brand-700"
            to="/projects/new"
          >
            New project
          </Link>
        </div>

        {projectsLoading ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        ) : userProjects.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {userProjects.map((project) => {
              const projectId = project._id || project.id;

              return (
                <div className="relative" key={projectId}>
                  <ProjectCard project={project} />
                  <div className="absolute right-3 top-3 flex gap-2">
                    <Link
                      className="grid size-9 place-items-center rounded-lg bg-ink-950/70 text-white backdrop-blur transition hover:bg-brand-600"
                      to={`/projects/${projectId}/edit`}
                    >
                      <Pencil aria-hidden="true" className="size-4" />
                    </Link>
                    <button
                      className="grid size-9 place-items-center rounded-lg bg-ink-950/70 text-white backdrop-blur transition hover:bg-signal-red"
                      onClick={() => handleDeleteProject(projectId)}
                      type="button"
                    >
                      <Trash2 aria-hidden="true" className="size-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            action={
              <Link
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-bold text-white shadow-soft transition hover:bg-brand-700"
                to="/projects/new"
              >
                Post project
              </Link>
            }
            message="Your projects will appear here after you publish them."
            title="No projects posted yet"
          />
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-600">
              Your writing
            </p>
            <h2 className="mt-1 text-2xl font-bold text-[var(--text-primary)]">
              Posted blogs
            </h2>
          </div>
          <Link
            className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-bold text-white shadow-soft transition hover:bg-brand-700"
            to="/blogs/new"
          >
            New blog
          </Link>
        </div>

        {blogsLoading ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        ) : userBlogs.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {userBlogs.map((blog) => {
              const blogId = blog._id || blog.id;

              return (
                <div className="relative" key={blogId || blog.slug}>
                  <BlogCard blog={blog} />
                  <div className="absolute right-3 top-3 flex gap-2">
                    <Link
                      className="grid size-9 place-items-center rounded-lg bg-ink-950/70 text-white backdrop-blur transition hover:bg-brand-600"
                      to={`/blogs/${blog.slug}/edit`}
                    >
                      <Pencil aria-hidden="true" className="size-4" />
                    </Link>
                    <button
                      className="grid size-9 place-items-center rounded-lg bg-ink-950/70 text-white backdrop-blur transition hover:bg-signal-red"
                      onClick={() => handleDeleteBlog(blogId)}
                      type="button"
                    >
                      <Trash2 aria-hidden="true" className="size-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            action={
              <Link
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-bold text-white shadow-soft transition hover:bg-brand-700"
                to="/blogs/new"
              >
                Post blog
              </Link>
            }
            message="Your blogs will appear here after you publish them."
            title="No blogs posted yet"
          />
        )}
      </section>
    </section>
  );
};

export default ProfilePage;
