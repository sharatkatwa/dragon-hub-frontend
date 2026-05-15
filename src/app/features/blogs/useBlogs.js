import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearBlogError, clearSelectedBlog } from "./blogSlice";
import {
  createBlog,
  deleteBlog,
  fetchBlogBySlug,
  fetchBlogs,
  fetchUserBlogs,
  toggleBlogLike,
  updateBlog,
} from "./blogThunks";

export const useBlogs = () => {
  const dispatch = useDispatch();
  const blogsState = useSelector((state) => state.blogs);

  const loadBlogs = useCallback(
    (params) => dispatch(fetchBlogs(params)).unwrap(),
    [dispatch]
  );

  const loadBlogBySlug = useCallback(
    (slug) => dispatch(fetchBlogBySlug(slug)).unwrap(),
    [dispatch]
  );

  const loadUserBlogs = useCallback(
    (userId) => dispatch(fetchUserBlogs(userId)).unwrap(),
    [dispatch]
  );

  const addBlog = useCallback(
    (blogData) => dispatch(createBlog(blogData)).unwrap(),
    [dispatch]
  );

  const saveBlog = useCallback(
    (blogId, blogData) => dispatch(updateBlog({ blogId, blogData })).unwrap(),
    [dispatch]
  );

  const removeBlog = useCallback(
    (blogId) => dispatch(deleteBlog(blogId)).unwrap(),
    [dispatch]
  );

  const likeBlog = useCallback(
    (blogId) => dispatch(toggleBlogLike(blogId)).unwrap(),
    [dispatch]
  );

  const clearError = useCallback(() => {
    dispatch(clearBlogError());
  }, [dispatch]);

  const clearSelected = useCallback(() => {
    dispatch(clearSelectedBlog());
  }, [dispatch]);

  return {
    ...blogsState,
    addBlog,
    clearError,
    clearSelected,
    likeBlog,
    loadBlogBySlug,
    loadBlogs,
    loadUserBlogs,
    removeBlog,
    saveBlog,
  };
};
