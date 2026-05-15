import { useForm } from "react-hook-form";
import { Link } from "react-router";
import AuthCard from "../../components/forms/AuthCard";
import AuthSubmitButton from "../../components/forms/AuthSubmitButton";
import FormInput from "../../components/forms/FormInput";

const LoginPage = () => {
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm({
    defaultValues: {
      identifier: "",
      password: "",
    },
    mode: "onBlur",
  });

  const handleLoginPreview = () => {};

  return (
    <AuthCard
      eyebrow="Welcome back"
      subtitle="Enter your username or email to continue to your DragonHub workspace."
      title="Sign in"
    >
      <form className="space-y-5" onSubmit={handleSubmit(handleLoginPreview)}>
        <FormInput
          autoComplete="username"
          error={errors.identifier}
          id="identifier"
          label="Email or username"
          placeholder="alex@dragonhub.dev"
          registration={register("identifier", {
            required: "Email or username is required",
            minLength: {
              value: 3,
              message: "Enter at least 3 characters",
            },
          })}
        />

        <FormInput
          autoComplete="current-password"
          error={errors.password}
          id="password"
          label="Password"
          placeholder="Enter your password"
          registration={register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          })}
          type="password"
        />

        <div className="flex items-center justify-between gap-3 text-sm">
          <label className="flex items-center gap-2 text-[var(--text-secondary)]">
            <input
              className="size-4 rounded border-[var(--border-soft)] accent-brand-600"
              type="checkbox"
            />
            Remember me
          </label>
          <a className="font-semibold text-brand-600 hover:text-brand-700" href="#">
            Forgot password?
          </a>
        </div>

        <AuthSubmitButton isSubmitting={isSubmitting}>
          Sign in
        </AuthSubmitButton>

        <p className="text-center text-sm text-[var(--text-secondary)]">
          New to DragonHub?{" "}
          <Link className="font-bold text-brand-600 hover:text-brand-700" to="/register">
            Create account
          </Link>
        </p>
      </form>
    </AuthCard>
  );
};

export default LoginPage;
