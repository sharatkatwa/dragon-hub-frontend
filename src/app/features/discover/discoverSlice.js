import { createSlice } from "@reduxjs/toolkit";
import { fetchDiscoverFeed } from "./discoverThunks";

const initialState = {
  latestProjects: [],
  trendingProjects: [],
  latestBlogs: [],
  trendingBlogs: [],
  topDevelopers: [],
  isLoading: false,
  error: null,
};

const discoverSlice = createSlice({
  name: "discover",
  initialState,
  reducers: {
    clearDiscoverError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDiscoverFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDiscoverFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        state.latestProjects = action.payload.latestProjects || [];
        state.trendingProjects = action.payload.trendingProjects || [];
        state.latestBlogs = action.payload.latestBlogs || [];
        state.trendingBlogs = action.payload.trendingBlogs || [];
        state.topDevelopers = action.payload.topDevelopers || [];
      })
      .addCase(fetchDiscoverFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDiscoverError } = discoverSlice.actions;
export default discoverSlice.reducer;
