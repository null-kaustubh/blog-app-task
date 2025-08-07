import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // This will prepend /api to all routes, like /api/blogs
  withCredentials: true, // so cookies (e.g., for sessions) are sent automatically
});

// Optional: You can intercept requests here to inject auth tokens
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
