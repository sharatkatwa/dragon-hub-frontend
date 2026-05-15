import { useParams } from "react-router";

const ProjectDetailsPage = () => {
  const { projectId } = useParams();

  return (
    <section className="surface-panel rounded-2xl p-6">
      <h2 className="text-3xl font-semibold text-[var(--text-primary)]">
        Project details
      </h2>
      <p className="mt-3 text-[var(--text-secondary)]">
        Project ID: <span className="font-mono">{projectId}</span>
      </p>
    </section>
  );
};

export default ProjectDetailsPage;
