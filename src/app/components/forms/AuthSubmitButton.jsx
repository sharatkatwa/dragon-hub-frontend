const AuthSubmitButton = ({ children, isSubmitting }) => {
  return (
    <button
      className="interactive-surface w-full rounded-lg bg-brand-600 px-4 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
      disabled={isSubmitting}
      type="submit"
    >
      {isSubmitting ? "Checking..." : children}
    </button>
  );
};

export default AuthSubmitButton;
