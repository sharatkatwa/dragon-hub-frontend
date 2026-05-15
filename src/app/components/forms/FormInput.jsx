import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const FormInput = ({
  error,
  hint,
  id,
  label,
  registration,
  type = "text",
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPasswordField = type === "password";
  const inputType =
    isPasswordField && isPasswordVisible ? "text" : type;

  return (
    <div className="space-y-2">
      <label
        className="block text-sm font-semibold text-[var(--text-primary)]"
        htmlFor={id}
      >
        {label}
      </label>
      <div className="relative">
        <input
          className={[
            "w-full rounded-lg border bg-white/10 px-4 py-3 text-sm text-[var(--text-primary)] shadow-sm outline-none backdrop-blur placeholder:text-[var(--text-muted)]",
            "transition duration-200 focus:border-brand-500 focus:bg-white/15 focus:ring-4 focus:ring-[var(--focus-ring)]",
            isPasswordField ? "pr-12" : "",
            error ? "border-signal-red" : "border-[var(--border-soft)]",
          ].join(" ")}
          id={id}
          type={inputType}
          {...registration}
          {...props}
        />

        {isPasswordField ? (
          <button
            aria-label={isPasswordVisible ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-md text-[var(--text-muted)] transition hover:bg-white/60 hover:text-[var(--text-primary)]"
            onClick={() => setIsPasswordVisible((current) => !current)}
            type="button"
          >
            {isPasswordVisible ? (
              <EyeOff aria-hidden="true" size={18} strokeWidth={2} />
            ) : (
              <Eye aria-hidden="true" size={18} strokeWidth={2} />
            )}
          </button>
        ) : null}
      </div>
      {error ? (
        <p className="text-sm font-medium text-signal-red">{error.message}</p>
      ) : hint ? (
        <p className="text-xs text-[var(--text-muted)]">{hint}</p>
      ) : null}
    </div>
  );
};

export default FormInput;
