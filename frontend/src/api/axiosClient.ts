// axiosClient.ts

import axios from "axios";
import { API_BASE_URL } from "../config/env";
// REMOVE: import { store } from "../app/store"; ❌

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ⭐️ Define a function to set up the interceptor later
export const setupInterceptors = (store: any) => {
  axiosClient.interceptors.request.use(
    (config) => {
      // Access the token using the passed-in store instance
      const token = store.getState().auth.accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
};

export default axiosClient; // Export the client itself
