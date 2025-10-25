import axios from "axios";
import { useAuthStore } from "../stores/auth.store";
import type { AuthResponse } from "../types/api.types";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

// Attach access token to requests
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Refresh on token expiration
let isRefreshing = false;
let failedQueue: Array<() => void> = [];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    // Refresh if there is a token expiration and it's not retried yet
    if (
      error.response?.status === 401 &&
      error.response?.data.code === "auth.expired_token" &&
      !original._retry
    ) {
      // Enqueue the request if there is already a concurrent refresh
      if (isRefreshing) {
        return new Promise((resolve) =>
          failedQueue.push(() => resolve(api(original))),
        );
      }

      // Start a new refresh
      original._retry = true;
      isRefreshing = true;

      try {
        // Send the refresh request
        const res = await axios.post<AuthResponse>(
          "http://localhost:8000/api/auth/refresh",
          undefined,
          { withCredentials: true },
        );

        // Update the auth state
        useAuthStore.getState().signin(res.data.accessToken, res.data.user);

        // Resolve pending requests
        failedQueue.forEach((cb) => cb());
        failedQueue = [];

        // Retry the failed request
        return api(original);
      } catch (refreshError) {
        // Force signout and reject pending requests
        useAuthStore.getState().signout();
        failedQueue = [];
        return Promise.reject(refreshError);
      } finally {
        // Finish refreshing
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export { api };
