import Axios from "./Axios";

const saveAuthData = (responseData) => {
  const token =
    responseData?.token ||
    responseData?.accessToken ||
    responseData?.data?.token ||
    responseData?.data?.accessToken;

  const user =
    responseData?.user ||
    responseData?.admin ||
    responseData?.data?.user ||
    responseData?.data?.admin;

  if (token) {
    localStorage.setItem("token", token);
    localStorage.setItem("adminToken", token);
  }

  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("admin", JSON.stringify(user));
  }

  return responseData;
};

const handleApiError = (error, fallbackMessage) => {
  console.log("AUTH API ERROR 👉", error);

  return error?.response?.data || {
    success: false,
    message: error?.message || fallbackMessage,
  };
};

export const adminRegisterApi = async (payload) => {
  try {
    const response = await Axios.post("/admin/register", payload);
    return response.data;
  } catch (error) {
    return handleApiError(error, "Register failed");
  }
};

export const adminLoginApi = async (payload) => {
  try {
    const response = await Axios.post("/admin/login", payload);

    saveAuthData(response.data);

    return response.data;
  } catch (error) {
    return handleApiError(error, "Login failed");
  }
};

export const verifyAdminOtpApi = async (payload) => {
  try {
    const response = await Axios.post("/admin/verify-otp", payload);

    saveAuthData(response.data);

    return response.data;
  } catch (error) {
    return handleApiError(error, "OTP verification failed");
  }
};

export const adminLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("adminToken");
  localStorage.removeItem("user");
  localStorage.removeItem("admin");
};