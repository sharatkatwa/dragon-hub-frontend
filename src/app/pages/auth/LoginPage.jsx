import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import AuthCard from "../../components/forms/AuthCard";
import AuthSubmitButton from "../../components/forms/AuthSubmitButton";
import FormInput from "../../components/forms/FormInput";
import { toast } from "../../components/toast/toast";
import { useAuth } from "../../features/auth/useAuth";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
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

  const handleLogin = async ({ identifier, password }) => {
    const trimmedIdentifier = identifier.trim();
    const credentials = trimmedIdentifier.includes("@")
      ? { email: trimmedIdentifier, password }
      : { username: trimmedIdentifier, password };

    try {
      await login(credentials);
      toast.success("You are signed in.", {
        title: "Welcome back",
      });
      navigate("/");
    } catch (error) {
      toast.error(error || "Unable to sign in. Please try again.", {
        title: "Sign in failed",
      });
    }
  };

  return (
    <AuthCard
      eyebrow="Welcome back"
      subtitle="Enter your username or email to continue to your DragonHub workspace."
      title="Sign in"
    >
      <form className="space-y-5" onSubmit={handleSubmit(handleLogin)}>
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
          <a
            className="font-semibold text-brand-600 hover:text-brand-700"
            href="#"
            onClick={(event) => {
              event.preventDefault();
              toast.info("Password reset is not available yet.", {
                title: "Coming soon",
              });
            }}
          >
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
