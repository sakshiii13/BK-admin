import Axios from "./Axios";

const getTokenFromResponse = (data) => {
  return (
    data?.token ||
    data?.adminToken ||
    data?.accessToken ||
    data?.jwt ||
    data?.data?.token ||
    data?.data?.adminToken ||
    data?.data?.accessToken ||
    data?.data?.jwt ||
    data?.admin?.token ||
    data?.data?.admin?.token ||
    ""
  );
};

const getAdminFromResponse = (data) => {
  return (
    data?.admin ||
    data?.user ||
    data?.data?.admin ||
    data?.data?.user ||
    null
  );
};

export const saveAdminAuth = (data) => {
  const token = getTokenFromResponse(data);
  const admin = getAdminFromResponse(data);

  console.log("AUTH RESPONSE 👉", data);
  console.log("TOKEN SAVE 👉", token ? "YES" : "NO");

  if (token) {
    localStorage.setItem("adminToken", token);
    localStorage.setItem("token", token);
  }

  if (admin) {
    localStorage.setItem("adminData", JSON.stringify(admin));
  }

  return token;
};

const handleApiError = (error, fallbackMessage) => {
  console.log("ADMIN API ERROR 👉", error?.response?.data || error);

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
    return response.data;
  } catch (error) {
    return handleApiError(error, "Login failed");
  }
};

export const verifyAdminOtpApi = async (payload) => {
  try {
    const response = await Axios.post("/admin/verify-otp", payload);
    saveAdminAuth(response.data);
    return response.data;
  } catch (error) {
    return handleApiError(error, "OTP verification failed");
  }
};

// ================= STORE =================

export const createStoreApi = async (payload) => {
  try {
    const response = await Axios.post("/admin/store-create", payload);
    return response.data;
  } catch (error) {
    return handleApiError(error, "Create store failed");
  }
};

export const getAllStoresApi = async (page = 1, limit = 10) => {
  try {
    const response = await Axios.get(
      `/admin/get-all-stores?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, "Get all stores failed");
  }
};

export const updateStoreApi = async (storeId, payload) => {
  try {
    const response = await Axios.put(
      `/admin/update-store/${storeId}`,
      payload
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, "Update store failed");
  }
};

export const getStoreByIdApi = async (storeId) => {
  try {
    const response = await Axios.get(`/user/store/${storeId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, "Get store by id failed");
  }
};

export const findNearestStoreApi = async ({ lat, lng }) => {
  try {
    const response = await Axios.get(`/store/nearest?lat=${lat}&lng=${lng}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, "Find nearest store failed");
  }
};

// ================= STORE INVENTORY =================

export const createInventoryApi = async (payload) => {
  try {
    const response = await Axios.post(
      "/store-inventory/create-inventory",
      payload
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, "Create inventory failed");
  }
};

export const getInventoryByStoreIdApi = async (storeId) => {
  try {
    const response = await Axios.get(
      `/store-inventory/get-inventory-by-store-id/${storeId}`
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, "Get inventory failed");
  }
};

export const getHomeProductsApi = async () => {
  try {
    const response = await Axios.get("/store-inventory/get-home-products");
    return response.data;
  } catch (error) {
    return handleApiError(error, "Get home products failed");
  }
};

export const getStoreCategoryApi = async (storeId) => {
  try {
    const response = await Axios.get(
      `/store-inventory/get-store-category/${storeId}`
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, "Get store category failed");
  }
};

export const getStoreSubCategoryByCategoryApi = async (
  storeId,
  categoryId
) => {
  try {
    const response = await Axios.get(
      `/store-inventory/get-store-subCategory-by-category/${storeId}/${categoryId}`
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, "Get sub category failed");
  }
};

export const getStoreProductBySubCategoryApi = async (
  storeId,
  subCategoryId
) => {
  try {
    const response = await Axios.get(
      `/store-inventory/get-store-product-by-subCategory/${storeId}/${subCategoryId}`
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, "Get store product failed");
  }
};

export const getProductDetailsOfStoreApi = async (productId) => {
  try {
    const response = await Axios.get(
      `/store-inventory/get-product-details-of-store/${productId}`
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, "Get product details failed");
  }
};

// ================= ORDER =================

export const getOrdersByStoreIdApi = async (storeId) => {
  try {
    const response = await Axios.get(`/order/get-orders-by-Store-id/${storeId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, "Get orders failed");
  }
};

export const updateOrderToPackedApi = async (orderId, payload = {}) => {
  try {
    const response = await Axios.patch(
      `/order/update-order-to-packed/${orderId}`,
      payload
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, "Update order failed");
  }
};

export const assignOrderToDriverApi = async (orderId, payload) => {
  try {
    const response = await Axios.patch(
      `/order/Assign-order-to-driver/${orderId}`,
      payload
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, "Assign driver failed");
  }
};

export const getAllOrderByStatusApi = async (status) => {
  try {
    const response = await Axios.get(
      `/order/get-all-order-by-status?status=${status}`
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, "Get order by status failed");
  }
};

// ================= TRANSACTION =================

export const getAllTransactionApi = async () => {
  try {
    const response = await Axios.get("/transaction/Get-all-transaction");
    return response.data;
  } catch (error) {
    return handleApiError(error, "Get transactions failed");
  }
};

export const getTransactionByUserIdApi = async (userId) => {
  try {
    const response = await Axios.get(
      `/transaction/get-transaction-by-user-id/${userId}`
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, "Get transaction failed");
  }
};

// ================= DRIVER =================

export const registerDriverApi = async (payload) => {
  try {
    const response = await Axios.post("/driver/Register-driver", payload);
    return response.data;
  } catch (error) {
    return handleApiError(error, "Register driver failed");
  }
};

export const getAllDriverByStoreIdApi = async (storeId) => {
  try {
    const response = await Axios.get(
      `/driver/Get-All-driver-by-store-id/${storeId}`
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, "Get drivers failed");
  }
};

// ================= DASHBOARD =================

export const getDashboardApi = async () => {
  try {
    const response = await Axios.get("/dashboard/get-dashboard");
    return response.data;
  } catch (error) {
    return handleApiError(error, "Get dashboard failed");
  }
};

// ================= RATING =================

export const getAllRatingApi = async () => {
  try {
    const response = await Axios.get("/rating/Get-all-rating");
    return response.data;
  } catch (error) {
    return handleApiError(error, "Get ratings failed");
  }
};

export const getAvgRatingApi = async () => {
  try {
    const response = await Axios.get("/rating/get-avg-rating");
    return response.data;
  } catch (error) {
    return handleApiError(error, "Get average rating failed");
  }
};

export const adminLogout = () => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("token");
  localStorage.removeItem("isAdminLogin");
  localStorage.removeItem("adminData");
  localStorage.removeItem("adminEmail");
  localStorage.removeItem("adminOtp");

  sessionStorage.removeItem("adminToken");
  sessionStorage.removeItem("token");
};