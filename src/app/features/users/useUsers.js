import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearSelectedUser, clearUserError } from "./userSlice";
import { fetchUserById, fetchUsers } from "./userThunks";

export const useUsers = () => {
  const dispatch = useDispatch();
  const usersState = useSelector((state) => state.users);

  const loadUsers = useCallback(
    (params) => dispatch(fetchUsers(params)).unwrap(),
    [dispatch]
  );

  const loadUserById = useCallback(
    (userId) => dispatch(fetchUserById(userId)).unwrap(),
    [dispatch]
  );

  const clearError = useCallback(() => {
    dispatch(clearUserError());
  }, [dispatch]);

  const clearSelected = useCallback(() => {
    dispatch(clearSelectedUser());
  }, [dispatch]);

  return {
    ...usersState,
    clearError,
    clearSelected,
    loadUserById,
    loadUsers,
  };
};
