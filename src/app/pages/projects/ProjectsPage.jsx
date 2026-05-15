import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import ProjectCard from "../../components/content/ProjectCard";
import CardSkeleton from "../../components/feedback/CardSkeleton";
import EmptyState from "../../components/feedback/EmptyState";
import { toast } from "../../components/toast/toast";
import { useProjects } from "../../features/projects/useProjects";
import ProjectQueryPanel from "./ProjectQueryPanel";

const getQueryFromSearchParams = (searchParams) => ({
  search: searchParams.get("search") || "",
  tech: searchParams.get("tech") || "",
  tag: searchParams.get("tag") || "",
  sort: searchParams.get("sort") || "latest",
});

const ProjectsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { count, error, isLoading, loadProjects, projects } = useProjects();
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

    loadProjects(params).catch((message) => {
      toast.error(message || "Unable to load projects.", {
        title: "Projects failed",
      });
    });
  }, [loadProjects, query]);

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
      tech: "",
      tag: "",
      sort: "latest",
    });
    setSearchParams({});
  };

  const hasFilters = Boolean(query.search || query.tech || query.tag);

  return (
    <section className="space-y-6">
      <ProjectQueryPanel
        formValues={formValues}
        hasFilters={hasFilters}
        onChange={handleChange}
        onReset={handleReset}
        onSubmit={handleSubmit}
      />

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-[var(--text-secondary)]">
          {isLoading ? "Loading projects..." : `${count || projects.length} projects`}
        </p>
        {error ? <p className="text-sm font-semibold text-signal-red">{error}</p> : null}
      </div>

      {isLoading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      ) : projects.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project._id || project.id} project={project} />
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
          message="Try a different search, tech stack, tag, or sorting option."
          title="No projects found"
        />
      )}
    </section>
  );
};

export default ProjectsPage;
