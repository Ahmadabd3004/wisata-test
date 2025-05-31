import axios from "axios";

const API_BASE_URL = "https://project-tempest-hiring.up.railway.app";

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
