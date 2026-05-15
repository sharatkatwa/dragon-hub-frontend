const EmptyState = ({ action, message, title }) => {
  return (
    <div className="surface-panel rounded-xl p-8 text-center">
      <h3 className="text-xl font-bold text-[var(--text-primary)]">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--text-secondary)]">
        {message}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
};

export default EmptyState;
