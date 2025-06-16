/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const options = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
};

const API = axios.create(options);
export const APIRefresh = axios.create(options);

// Refresh interceptor (no changes)
APIRefresh.interceptors.response.use((response) => response);

// Request retry flag
let isRefreshing = false;

let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const { data, status } = error.response || {};

    // Token not found or expired
    if (
      data?.message === "AUTH_TOKEN_NOT_FOUND" &&
      status === 401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        // Queue requests while refreshing
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
              resolve(API(originalRequest));
            },
            reject: (err: any) => reject(err),
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await APIRefresh.post("/auth/refresh-token");
        const newAccessToken = res.data.accessToken;

        // Optionally update cookies or headers
        API.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        window.location.reload();
        return Promise.resolve();
      } catch (err) {
        processQueue(err, null);
        // window.location.href = "/";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default API;
