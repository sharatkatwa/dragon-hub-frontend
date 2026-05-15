import api from "./axios";
import { toast } from "../components/toast/toast";

export const setupInterceptors = () => {
  api.interceptors.response.use(
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
          toast.warning("Your session expired. Please sign in again.", {
            title: "Session expired",
          });

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
