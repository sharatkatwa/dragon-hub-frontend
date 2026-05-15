import { useParams } from "react-router";

const BlogDetailsPage = () => {
  const { slug } = useParams();

  return (
    <section className="surface-panel rounded-2xl p-6">
      <h2 className="text-3xl font-semibold text-[var(--text-primary)]">
        Blog details
      </h2>
      <p className="mt-3 text-[var(--text-secondary)]">
        Blog slug: <span className="font-mono">{slug}</span>
      </p>
    </section>
  );
};

export default BlogDetailsPage;
