import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import blogReducer from "../features/blogs/blogSlice";
import discoverReducer from "../features/discover/discoverSlice";
import projectReducer from "../features/projects/projectSlice";
import userReducer from "../features/users/userSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    blogs: blogReducer,
    discover: discoverReducer,
    projects: projectReducer,
    users: userReducer,
  },
});
