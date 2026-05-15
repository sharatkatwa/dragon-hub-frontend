import { useParams } from "react-router";

const UserDetailsPage = () => {
  const { userId } = useParams();

  return (
    <section className="surface-panel rounded-2xl p-6">
      <h2 className="text-3xl font-semibold text-[var(--text-primary)]">
        Developer profile
      </h2>
      <p className="mt-3 text-[var(--text-secondary)]">
        User ID: <span className="font-mono">{userId}</span>
      </p>
    </section>
  );
};

export default UserDetailsPage;
