const AuthCard = ({ children, eyebrow, subtitle, title }) => {
  return (
    <section className="mx-auto grid min-h-[64vh] w-full max-w-5xl items-center gap-8 lg:grid-cols-[1fr_440px]">
      <div className="hidden lg:block">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-600">
          {eyebrow}
        </p>
        <h2 className="mt-4 max-w-xl text-5xl font-bold leading-tight text-[var(--text-primary)]">
          Build your developer presence with a quieter kind of polish.
        </h2>
        <p className="mt-5 max-w-lg text-base leading-7 text-[var(--text-secondary)]">
          Share projects, publish technical writing, and discover builders
          through a workspace designed to feel focused instead of noisy.
        </p>
      </div>

      <div className="glass-panel rounded-xl p-6 sm:p-7">
        <div className="mb-7">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600 lg:hidden">
            {eyebrow}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[var(--text-primary)]">
            {title}
          </h1>
          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
            {subtitle}
          </p>
        </div>

        {children}
      </div>
    </section>
  );
};

export default AuthCard;
