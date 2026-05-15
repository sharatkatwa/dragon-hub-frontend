import { createSlice } from "@reduxjs/toolkit";
import {
  createProject,
  deleteProject,
  fetchProjectById,
  fetchProjects,
  fetchUserProjects,
  toggleProjectLike,
  updateProject,
} from "./projectThunks";

const initialState = {
  projects: [],
  selectedProject: null,
  userProjects: [],
  count: 0,
  isLoading: false,
  isMutating: false,
  error: null,
};

const updateProjectInList = (projects, updatedProject) =>
  projects.map((project) =>
    project._id === updatedProject?._id || project.id === updatedProject?.id
      ? updatedProject
      : project
  );

const removeProjectFromList = (projects, projectId) =>
  projects.filter((project) => project._id !== projectId && project.id !== projectId);

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    clearProjectError: (state) => {
      state.error = null;
    },
    clearSelectedProject: (state) => {
      state.selectedProject = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = action.payload.projects || [];
        state.count = action.payload.count ?? state.projects.length;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchProjectById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedProject = action.payload;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userProjects = action.payload || [];
      })
      .addCase(fetchUserProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createProject.pending, (state) => {
        state.isMutating = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.isMutating = false;
        if (action.payload) {
          state.projects.unshift(action.payload);
          state.userProjects.unshift(action.payload);
          state.count += 1;
        }
      })
      .addCase(createProject.rejected, (state, action) => {
        state.isMutating = false;
        state.error = action.payload;
      })
      .addCase(updateProject.pending, (state) => {
        state.isMutating = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.isMutating = false;
        state.selectedProject = action.payload;
        state.projects = updateProjectInList(state.projects, action.payload);
        state.userProjects = updateProjectInList(state.userProjects, action.payload);
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.isMutating = false;
        state.error = action.payload;
      })
      .addCase(deleteProject.pending, (state) => {
        state.isMutating = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.isMutating = false;
        state.projects = removeProjectFromList(state.projects, action.payload);
        state.userProjects = removeProjectFromList(state.userProjects, action.payload);
        state.selectedProject = null;
        state.count = Math.max(0, state.count - 1);
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.isMutating = false;
        state.error = action.payload;
      })
      .addCase(toggleProjectLike.fulfilled, (state, action) => {
        const applyLike = (project) => {
          if (project._id !== action.payload.projectId && project.id !== action.payload.projectId) {
            return project;
          }

          return {
            ...project,
            liked: action.payload.liked,
            likesCount: action.payload.likesCount,
          };
        };

        state.projects = state.projects.map(applyLike);
        state.userProjects = state.userProjects.map(applyLike);
        if (state.selectedProject) {
          state.selectedProject = applyLike(state.selectedProject);
        }
      })
      .addCase(toggleProjectLike.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearProjectError, clearSelectedProject } = projectSlice.actions;
export default projectSlice.reducer;
