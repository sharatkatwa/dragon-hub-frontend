import { createBrowserRouter, RouterProvider } from "react-router";
import GuestRoute from "../components/auth/GuestRoute";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import BlogDetailsPage from "../pages/blogs/BlogDetailsPage";
import BlogsPage from "../pages/blogs/BlogsPage";
import EditBlogPage from "../pages/blogs/EditBlogPage";
import NewBlogPage from "../pages/blogs/NewBlogPage";
import DiscoverPage from "../pages/discover/DiscoverPage";
import NotFoundPage from "../pages/errors/NotFoundPage";
import ProfilePage from "../pages/profile/ProfilePage";
import NewProjectPage from "../pages/projects/NewProjectPage";
import EditProjectPage from "../pages/projects/EditProjectPage";
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
          element: <GuestRoute />,
          children: [
            {
              path: "login",
              element: <LoginPage />,
            },
            {
              path: "register",
              element: <RegisterPage />,
            },
          ],
        },
        {
          element: <ProtectedRoute />,
          children: [
            {
              path: "profile",
              element: <ProfilePage />,
            },
            {
              path: "projects/new",
              element: <NewProjectPage />,
            },
            {
              path: "projects/:projectId/edit",
              element: <EditProjectPage />,
            },
            {
              path: "blogs/new",
              element: <NewBlogPage />,
            },
            {
              path: "blogs/:slug/edit",
              element: <EditBlogPage />,
            },
          ],
        },
        {
          path: "projects",
          element: <ProjectsPage />,
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

  return <RouterProvider router={allRoutes} />;
};

export default AppRoutes;
