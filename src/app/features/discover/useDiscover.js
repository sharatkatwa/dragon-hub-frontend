import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearDiscoverError } from "./discoverSlice";
import { fetchDiscoverFeed } from "./discoverThunks";

export const useDiscover = () => {
  const dispatch = useDispatch();
  const discoverState = useSelector((state) => state.discover);

  const loadDiscoverFeed = useCallback(
    (limit) => dispatch(fetchDiscoverFeed(limit)).unwrap(),
    [dispatch]
  );

  const clearError = useCallback(() => {
    dispatch(clearDiscoverError());
  }, [dispatch]);

  return {
    ...discoverState,
    clearError,
    loadDiscoverFeed,
  };
};
