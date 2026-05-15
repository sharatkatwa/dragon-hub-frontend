import { createSlice } from "@reduxjs/toolkit";
import {
  createBlog,
  deleteBlog,
  fetchBlogBySlug,
  fetchBlogs,
  fetchUserBlogs,
  toggleBlogLike,
  updateBlog,
} from "./blogThunks";

const initialState = {
  blogs: [],
  selectedBlog: null,
  userBlogs: [],
  count: 0,
  isLoading: false,
  isMutating: false,
  error: null,
};

const updateBlogInList = (blogs, updatedBlog) =>
  blogs.map((blog) =>
    blog._id === updatedBlog?._id || blog.id === updatedBlog?.id ? updatedBlog : blog
  );

const removeBlogFromList = (blogs, blogId) =>
  blogs.filter((blog) => blog._id !== blogId && blog.id !== blogId);

const blogSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    clearBlogError: (state) => {
      state.error = null;
    },
    clearSelectedBlog: (state) => {
      state.selectedBlog = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.blogs = action.payload.blogs || [];
        state.count = action.payload.count ?? state.blogs.length;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchBlogBySlug.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBlogBySlug.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedBlog = action.payload;
      })
      .addCase(fetchBlogBySlug.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserBlogs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserBlogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userBlogs = action.payload || [];
      })
      .addCase(fetchUserBlogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createBlog.pending, (state) => {
        state.isMutating = true;
        state.error = null;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.isMutating = false;
        if (action.payload) {
          state.blogs.unshift(action.payload);
          state.userBlogs.unshift(action.payload);
          state.count += 1;
        }
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.isMutating = false;
        state.error = action.payload;
      })
      .addCase(updateBlog.pending, (state) => {
        state.isMutating = true;
        state.error = null;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.isMutating = false;
        state.selectedBlog = action.payload;
        state.blogs = updateBlogInList(state.blogs, action.payload);
        state.userBlogs = updateBlogInList(state.userBlogs, action.payload);
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.isMutating = false;
        state.error = action.payload;
      })
      .addCase(deleteBlog.pending, (state) => {
        state.isMutating = true;
        state.error = null;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.isMutating = false;
        state.blogs = removeBlogFromList(state.blogs, action.payload);
        state.userBlogs = removeBlogFromList(state.userBlogs, action.payload);
        state.selectedBlog = null;
        state.count = Math.max(0, state.count - 1);
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.isMutating = false;
        state.error = action.payload;
      })
      .addCase(toggleBlogLike.fulfilled, (state, action) => {
        const applyLike = (blog) => {
          if (blog._id !== action.payload.blogId && blog.id !== action.payload.blogId) {
            return blog;
          }

          return {
            ...blog,
            liked: action.payload.liked,
            likesCount: action.payload.likesCount,
          };
        };

        state.blogs = state.blogs.map(applyLike);
        state.userBlogs = state.userBlogs.map(applyLike);
        if (state.selectedBlog) {
          state.selectedBlog = applyLike(state.selectedBlog);
        }
      })
      .addCase(toggleBlogLike.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearBlogError, clearSelectedBlog } = blogSlice.actions;
export default blogSlice.reducer;
