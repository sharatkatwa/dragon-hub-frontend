import { createBrowserRouter, RouterProvider } from "react-router";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import BlogDetailsPage from "../pages/blogs/BlogDetailsPage";
import BlogsPage from "../pages/blogs/BlogsPage";
import NewBlogPage from "../pages/blogs/NewBlogPage";
import DiscoverPage from "../pages/discover/DiscoverPage";
import NotFoundPage from "../pages/errors/NotFoundPage";
import ProfilePage from "../pages/profile/ProfilePage";
import NewProjectPage from "../pages/projects/NewProjectPage";
import ProjectDetailsPage from "../pages/projects/ProjectDetailsPage";
import ProjectsPage from "../pages/projects/ProjectsPage";
import UserDetailsPage from "../pages/users/UserDetailsPage";
import UsersPage from "../pages/users/UsersPage";
import MainLayout from "../layouts/MainLayout";

const AppRoutes = () => {
  const allRoutes = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <DiscoverPage />,
        },
        {
          path: "login",
          element: <LoginPage />,
        },
        {
          path: "register",
          element: <RegisterPage />,
        },
        {
          path: "profile",
          element: <ProfilePage />,
        },
        {
          path: "projects",
          element: <ProjectsPage />,
        },
        {
          path: "projects/new",
          element: <NewProjectPage />,
        },
        {
          path: "projects/:projectId",
          element: <ProjectDetailsPage />,
        },
        {
          path: "blogs",
          element: <BlogsPage />,
        },
        {
          path: "blogs/new",
          element: <NewBlogPage />,
        },
        {
          path: "blogs/:slug",
          element: <BlogDetailsPage />,
        },
        {
          path: "users",
          element: <UsersPage />,
        },
        {
          path: "users/:userId",
          element: <UserDetailsPage />,
        },
        {
          path: "*",
          element: <NotFoundPage />,
        },
      ],
    },
  ]);

  return (
    <RouterProvider router={allRoutes} />
  );
};

export default AppRoutes;
