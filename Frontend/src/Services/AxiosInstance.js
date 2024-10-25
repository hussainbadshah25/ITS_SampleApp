import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/", // Your API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add the token to the headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      // Attach the token to the Authorization header for all requests
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors or token expiration
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // You can handle unauthorized errors (401) or token expiration here
    if (error.response && error.response.status === 401) {
      //Navigate user back to login page
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
