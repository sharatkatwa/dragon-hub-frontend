import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearProjectError, clearSelectedProject } from "./projectSlice";
import {
  createProject,
  deleteProject,
  fetchProjectById,
  fetchProjects,
  fetchUserProjects,
  toggleProjectLike,
  updateProject,
} from "./projectThunks";

export const useProjects = () => {
  const dispatch = useDispatch();
  const projectsState = useSelector((state) => state.projects);

  const loadProjects = useCallback(
    (params) => dispatch(fetchProjects(params)).unwrap(),
    [dispatch]
  );

  const loadProjectById = useCallback(
    (projectId) => dispatch(fetchProjectById(projectId)).unwrap(),
    [dispatch]
  );

  const loadUserProjects = useCallback(
    (userId) => dispatch(fetchUserProjects(userId)).unwrap(),
    [dispatch]
  );

  const addProject = useCallback(
    (projectData) => dispatch(createProject(projectData)).unwrap(),
    [dispatch]
  );

  const saveProject = useCallback(
    (projectId, projectData) =>
      dispatch(updateProject({ projectId, projectData })).unwrap(),
    [dispatch]
  );

  const removeProject = useCallback(
    (projectId) => dispatch(deleteProject(projectId)).unwrap(),
    [dispatch]
  );

  const likeProject = useCallback(
    (projectId) => dispatch(toggleProjectLike(projectId)).unwrap(),
    [dispatch]
  );

  const clearError = useCallback(() => {
    dispatch(clearProjectError());
  }, [dispatch]);

  const clearSelected = useCallback(() => {
    dispatch(clearSelectedProject());
  }, [dispatch]);

  return {
    ...projectsState,
    addProject,
    clearError,
    clearSelected,
    likeProject,
    loadProjectById,
    loadProjects,
    loadUserProjects,
    removeProject,
    saveProject,
  };
};
