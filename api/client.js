import axios from "axios"; // Ini akan diimport melalui mekanisme bundling Vue/Vite

const API_BASE_URL = "https://project-tempest-hiring.up.railway.app";

/**
 * TASK: Implement API client for fetching data from the backend API endpoint
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Tambahkan timeout 10 detik (opsional)
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);
