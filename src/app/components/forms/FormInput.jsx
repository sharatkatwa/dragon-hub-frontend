const FormInput = ({
  error,
  hint,
  id,
  label,
  registration,
  type = "text",
  ...props
}) => {
  return (
    <div className="space-y-2">
      <label
        className="block text-sm font-semibold text-[var(--text-primary)]"
        htmlFor={id}
      >
        {label}
      </label>
      <input
        className={[
          "w-full rounded-lg border bg-white/55 px-4 py-3 text-sm text-[var(--text-primary)] shadow-sm outline-none backdrop-blur placeholder:text-[var(--text-muted)]",
          "transition duration-200 focus:border-brand-500 focus:bg-white/75 focus:ring-4 focus:ring-[var(--focus-ring)]",
          error ? "border-signal-red" : "border-[var(--border-soft)]",
        ].join(" ")}
        id={id}
        type={type}
        {...registration}
        {...props}
      />
      {error ? (
        <p className="text-sm font-medium text-signal-red">{error.message}</p>
      ) : hint ? (
        <p className="text-xs text-[var(--text-muted)]">{hint}</p>
      ) : null}
    </div>
  );
};

export default FormInput;
