import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api"
});

// Request interceptor to attach Bearer token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const serverMessage = error.response?.data?.message;
    let message = serverMessage || error.message;

    if (!error.response) {
      message = "Cannot reach the server. Check that the backend is running.";
    } else if (status === 503) {
      message = "The database is unavailable. Please try again shortly.";
    } else if (status >= 500) {
      message = "Something went wrong on the server.";
    }

    error.userMessage = message;

    if (error.response) {
      const responseData =
        error.response.data && typeof error.response.data === "object"
          ? error.response.data
          : {};
      error.response.data = { ...responseData, message };
    }

    return Promise.reject(error);
  }
);

export default api;