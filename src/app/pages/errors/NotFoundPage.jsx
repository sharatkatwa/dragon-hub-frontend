import { Link } from "react-router";

const NotFoundPage = () => {
  return (
    <section className="surface-panel mx-auto max-w-xl rounded-2xl p-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">
        404
      </p>
      <h2 className="mt-2 text-3xl font-semibold text-[var(--text-primary)]">
        Page not found
      </h2>
      <p className="mt-3 text-[var(--text-secondary)]">
        The route you opened does not exist yet.
      </p>
      <Link
        className="mt-5 inline-flex rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700"
        to="/"
      >
        Go home
      </Link>
    </section>
  );
};

export default NotFoundPage;
