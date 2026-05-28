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


// ================= ADMIN DASHBOARD =================

export const getAdminDashboardApi = async () => {
  try {
    const response = await Axios.get("/admin/dashboard");
    return response.data;
  } catch (error) {
    return handleApiError(error, "Get admin dashboard failed");
  }
};

// ================= AUTH =================

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
    const response = await Axios.post("admin/login", payload);
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
    return handleApiError(error, "Failed to fetch stores");
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

// ================= CATEGORY =================

export const createCategoryApi = async (data) => {
  try {
    const response = await Axios.post("/admin/category-create", data);
    return response.data;
  } catch (error) {
    return handleApiError(error, "Failed to create category");
  }
};

export const getAllCategoriesApi = async (page = 1, limit = 10) => {
  try {
    const response = await Axios.get(
      `/user/get-all-categories?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, "Failed to fetch categories");
  }
};

// GET CATEGORY BY ID
export const getCategoryByIdApi = async (categoryId) => {
  try {
    const response = await Axios.get(`/user/category/${categoryId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, "Get category by id failed");
  }
};

// UPDATE CATEGORY
export const updateCategoryApi = async (categoryId, payload) => {
  try {
    const response = await Axios.put(
      `/admin/update-category/${categoryId}`,
      payload
    );

    return response.data;
  } catch (error) {
    return handleApiError(error, "Update category failed");
  }
};
// ================= INVENTORY =================

export const createInventoryApi = async (payload) => {
  try {
    const response = await Axios.post("/admin/create-inventory", payload);
    return response.data;
  } catch (error) {
    return handleApiError(error, "Create inventory failed");
  }
};

export const getInventoryByStoreIdApi = async (
  storeId,
  page = 1,
  limit = 10
) => {
  try {
    const response = await Axios.get(
      `/user/store-inventory/${storeId}?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, "Get store inventory failed");
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

// ================= APP RATINGS =================

export const getAppRatingsApi = async () => {
  try {
    const response = await Axios.get("/admin/app-ratings");
    return response.data;
  } catch (error) {
    return handleApiError(error, "Failed to fetch app ratings");
  }
};

export const getAppRatingAverageApi = async () => {
  try {
    const response = await Axios.get("/admin/app-rating-average");
    return response.data;
  } catch (error) {
    return handleApiError(error, "Failed to fetch app rating average");
  }
};


export const getStoreOrdersApi = async (storeId) => {
  const response = await Axios.get(`/store/orders/${storeId}`);
  return response.data;
};

export const packStoreOrderApi = async (storeId, orderId) => {
  const response = await Axios.patch(
    `/store/orders/${storeId}/${orderId}/pack`
  );

  return response.data;
};