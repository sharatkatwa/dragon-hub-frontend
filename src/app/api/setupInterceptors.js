import api from "./axios";
import { toast } from "../components/toast/toast";

let interceptorId = null;
let isRedirectingToLogin = false;

const redirectToLogin = () => {
  const currentPath = window.location.pathname;
  const isAuthPage = currentPath === "/login" || currentPath === "/register";

  if (isRedirectingToLogin || isAuthPage) {
    return;
  }

  isRedirectingToLogin = true;

  toast.warning("Your session expired. Please sign in again.", {
    title: "Session expired",
  });

  window.location.replace("/login");
};

export const setupInterceptors = () => {
  if (interceptorId !== null) {
    return;
  }

  interceptorId = api.interceptors.response.use(
    (res) => res,
    async (error) => {
      const originalRequest = error.config;
      const isRefreshRequest = originalRequest?.url?.includes(
        "/auth/refresh-token"
      );

      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry &&
        !isRefreshRequest
      ) {
        originalRequest._retry = true;

        try {
          await api.post("/auth/refresh-token");
        } catch (refreshError) {
          redirectToLogin();
          return Promise.reject(refreshError);
        }

        return api(originalRequest);
      }

      if (!error.response) {
        toast.error("Check your connection and try again.", {
          title: "Network error",
        });
      }

      return Promise.reject(error);
    }
  );
};
