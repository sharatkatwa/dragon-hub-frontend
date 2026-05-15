import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthError } from "./authSlice";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  updateProfile,
  updateProfileImages,
} from "./authThunks";

export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const login = useCallback(
    (credentials) => dispatch(loginUser(credentials)).unwrap(),
    [dispatch]
  );

  const signup = useCallback(
    (userData) => dispatch(registerUser(userData)).unwrap(),
    [dispatch]
  );

  const loadCurrentUser = useCallback(
    () => dispatch(getCurrentUser()).unwrap(),
    [dispatch]
  );

  const logout = useCallback(
    () => dispatch(logoutUser()).unwrap(),
    [dispatch]
  );

  const saveProfile = useCallback(
    (profileData) => dispatch(updateProfile(profileData)).unwrap(),
    [dispatch]
  );

  const saveProfileImages = useCallback(
    (imageData) => dispatch(updateProfileImages(imageData)).unwrap(),
    [dispatch]
  );

  const clearError = useCallback(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  return {
    ...auth,
    clearError,
    loadCurrentUser,
    login,
    logout,
    saveProfile,
    saveProfileImages,
    signup,
  };
};
