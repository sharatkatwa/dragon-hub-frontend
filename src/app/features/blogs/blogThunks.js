import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

const getErrorMessage = (error) =>
  error.response?.data?.message || error.message || "Something went wrong";

export const fetchBlogs = createAsyncThunk(
  "blogs/fetchBlogs",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/blogs", { params });
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchBlogBySlug = createAsyncThunk(
  "blogs/fetchBlogBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/blogs/slug/${slug}`);
      return data.blog;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchUserBlogs = createAsyncThunk(
  "blogs/fetchUserBlogs",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/blogs/user/${userId}`);
      return data.blogs;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const createBlog = createAsyncThunk(
  "blogs/createBlog",
  async (blogData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/blogs", blogData);
      return data.blog;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateBlog = createAsyncThunk(
  "blogs/updateBlog",
  async ({ blogId, blogData }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/blogs/${blogId}`, blogData);
      return data.blog;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteBlog = createAsyncThunk(
  "blogs/deleteBlog",
  async (blogId, { rejectWithValue }) => {
    try {
      await api.delete(`/blogs/${blogId}`);
      return blogId;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const toggleBlogLike = createAsyncThunk(
  "blogs/toggleBlogLike",
  async (blogId, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/blogs/${blogId}/like`);
      return { blogId, ...data };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);
