import axios from "axios";
import { backendConfig } from "../constants/mainContent";

const Axios = axios.create({
  baseURL: backendConfig.base,
  headers: {
    "Content-Type": "application/json",
  },
});

Axios.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("adminToken") ||
      localStorage.getItem("token") ||
      sessionStorage.getItem("adminToken") ||
      sessionStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("REQUEST URL 👉", `${config.baseURL}${config.url}`);
    console.log("TOKEN SEND HO RAHA HAI 👉", token ? "YES" : "NO");

    return config;
  },
  (error) => Promise.reject(error)
);

Axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("AXIOS ERROR 👉", error?.response?.data || error);

    if (error?.response?.status === 401) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("token");
      localStorage.removeItem("isAdminLogin");
      localStorage.removeItem("adminData");
      localStorage.removeItem("adminEmail");

      sessionStorage.removeItem("adminToken");
      sessionStorage.removeItem("token");

      alert("Session expired. Please login again.");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default Axios;