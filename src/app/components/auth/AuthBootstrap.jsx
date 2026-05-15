import { useEffect } from "react";
import { useAuth } from "../../features/auth/useAuth";

const AuthBootstrap = () => {
  const { loadCurrentUser } = useAuth();

  useEffect(() => {
    loadCurrentUser().catch(() => {
      // Guest sessions are expected here; the auth slice already resets state.
    });
  }, [loadCurrentUser]);

  return null;
};

export default AuthBootstrap;
