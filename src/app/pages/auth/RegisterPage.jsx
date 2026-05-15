import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import AuthCard from "../../components/forms/AuthCard";
import AuthSubmitButton from "../../components/forms/AuthSubmitButton";
import FormInput from "../../components/forms/FormInput";
import { toast } from "../../components/toast/toast";
import { useAuth } from "../../features/auth/useAuth";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    watch,
  } = useForm({
    defaultValues: {
      email: "",
      fullName: "",
      password: "",
      username: "",
    },
    mode: "onBlur",
  });

  const password = watch("password");
  const handleRegister = async (values) => {
    const payload = {
      email: values.email.trim(),
      fullName: values.fullName.trim(),
      password: values.password,
      username: values.username.trim(),
    };

    try {
      await signup(payload);

      toast.success("Your account is ready.", {
        title: "Welcome to DragonHub",
      });
      navigate("/");
    } catch (error) {
      toast.error(error || "Unable to create your account. Please try again.", {
        title: "Registration failed",
      });
    }
  };

  return (
    <AuthCard
      eyebrow="Join the network"
      subtitle="Create your profile, then start showcasing projects and technical writing."
      title="Create account"
    >
      <form className="space-y-5" onSubmit={handleSubmit(handleRegister)}>
        <FormInput
          autoComplete="name"
          error={errors.fullName}
          id="fullName"
          label="Full name"
          placeholder="Alex Morgan"
          registration={register("fullName", {
            required: "Full name is required",
            minLength: {
              value: 2,
              message: "Full name must be at least 2 characters",
            },
          })}
        />

        <FormInput
          autoComplete="username"
          error={errors.username}
          hint="Use letters, numbers, underscores, or hyphens."
          id="username"
          label="Username"
          placeholder="alexmorgan"
          registration={register("username", {
            required: "Username is required",
            minLength: {
              value: 3,
              message: "Username must be at least 3 characters",
            },
            pattern: {
              value: /^[a-zA-Z0-9_-]+$/,
              message: "Username can only include letters, numbers, _ or -",
            },
          })}
        />

        <FormInput
          autoComplete="email"
          error={errors.email}
          id="email"
          label="Email"
          placeholder="alex@dragonhub.dev"
          registration={register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email address",
            },
          })}
          type="email"
        />

        <FormInput
          autoComplete="new-password"
          error={errors.password}
          hint="Use at least 8 characters."
          id="password"
          label="Password"
          placeholder="Create a password"
          registration={register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          })}
          type="password"
        />

        <FormInput
          autoComplete="new-password"
          error={errors.confirmPassword}
          id="confirmPassword"
          label="Confirm password"
          placeholder="Repeat your password"
          registration={register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value) => value === password || "Passwords do not match",
          })}
          type="password"
        />

        <AuthSubmitButton isSubmitting={isSubmitting}>
          Create account
        </AuthSubmitButton>

        <p className="text-center text-sm text-[var(--text-secondary)]">
          Already have an account?{" "}
          <Link className="font-bold text-brand-600 hover:text-brand-700" to="/login">
            Sign in
          </Link>
        </p>
      </form>
    </AuthCard>
  );
};

export default RegisterPage;
