import axios from "axios";
import { backendConfig } from "../constants/mainContent";

const Axios = axios.create({
  baseURL: backendConfig.base,
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
    console.log("TOKEN SEND 👉", token ? "YES" : "NO");

    return config;
  },
  (error) => Promise.reject(error)
);

export default Axios;