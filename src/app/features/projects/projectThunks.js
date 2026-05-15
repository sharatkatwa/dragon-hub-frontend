import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

const getErrorMessage = (error) =>
  error.response?.data?.message || error.message || "Something went wrong";

export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/projects", { params });
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchProjectById = createAsyncThunk(
  "projects/fetchProjectById",
  async (projectId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/projects/${projectId}`);
      return data.project;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchUserProjects = createAsyncThunk(
  "projects/fetchUserProjects",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/projects/user/${userId}`);
      return data.projects;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const createProject = createAsyncThunk(
  "projects/createProject",
  async (projectData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/projects", projectData);
      return data.project;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateProject = createAsyncThunk(
  "projects/updateProject",
  async ({ projectId, projectData }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/projects/${projectId}`, projectData);
      return data.project;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  async (projectId, { rejectWithValue }) => {
    try {
      await api.delete(`/projects/${projectId}`);
      return projectId;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const toggleProjectLike = createAsyncThunk(
  "projects/toggleProjectLike",
  async (projectId, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/projects/${projectId}/like`);
      return { projectId, ...data };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);
