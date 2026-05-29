import Axios from "./Axios";

// ================= COMMON HELPERS =================

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
  return data?.admin || data?.user || data?.data?.admin || data?.data?.user || null;
};

export const saveAdminAuth = (data) => {
  const token = getTokenFromResponse(data);
  const admin = getAdminFromResponse(data);

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

  return {
    success: false,
    message:
      error?.response?.data?.message ||
      error?.message ||
      fallbackMessage,
  };
};

// ================= AUTH =================

export const adminRegisterApi = async (payload) => {
  try {
    const res = await Axios.post("/admin/register", payload);
    return res.data;
  } catch (error) {
    return handleApiError(error, "Register failed");
  }
};

export const adminLoginApi = async (payload) => {
  try {
    const res = await Axios.post("/admin/login", payload);
    return res.data;
  } catch (error) {
    return handleApiError(error, "Login failed");
  }
};

export const verifyAdminOtpApi = async (payload) => {
  try {
    const res = await Axios.post("/admin/verify-otp", payload);
    saveAdminAuth(res.data);
    return res.data;
  } catch (error) {
    return handleApiError(error, "OTP verification failed");
  }
};

// ================= DASHBOARD =================

export const getAdminDashboardApi = async () => {
  try {
    const res = await Axios.get("/admin/dashboard");
    return res.data;
  } catch (error) {
    return handleApiError(error, "Get admin dashboard failed");
  }
};

// ================= STORE =================

export const createStoreApi = async (payload) => {
  try {
    const res = await Axios.post("/admin/store-create", payload);
    return res.data;
  } catch (error) {
    return handleApiError(error, "Create store failed");
  }
};

export const getAllStoresApi = async (page = 1, limit = 10) => {
  try {
    const res = await Axios.get("/admin/get-all-stores", {
      params: { page, limit },
    });
    return res.data;
  } catch (error) {
    return handleApiError(error, "Failed to fetch stores");
  }
};

export const updateStoreApi = async (storeId, payload) => {
  try {
    const res = await Axios.put(`/admin/update-store/${storeId}`, payload);
    return res.data;
  } catch (error) {
    return handleApiError(error, "Update store failed");
  }
};

export const getStoreByIdApi = async (storeId) => {
  try {
    const res = await Axios.get(`/user/store/${storeId}`);
    return res.data;
  } catch (error) {
    return handleApiError(error, "Get store by id failed");
  }
};

// ================= CATEGORY =================

export const createCategoryApi = async (data) => {
  try {
    const res = await Axios.post("/admin/category-create", data);
    return res.data;
  } catch (error) {
    return handleApiError(error, "Failed to create category");
  }
};

export const getAllCategoriesApi = async (page = 1, limit = 10) => {
  try {
    const res = await Axios.get("/user/get-all-categories", {
      params: { page, limit },
    });
    return res.data;
  } catch (error) {
    return handleApiError(error, "Failed to fetch categories");
  }
};

export const updateCategoryApi = async (categoryId, data) => {
  try {
    const res = await Axios.put(
      `/admin/update-category/${categoryId}`,
      data
    );

    return res.data;
  } catch (error) {
    return handleApiError(error, "Failed to update category");
  }
};


// ================= LOCATION =================
export const findNearestStoreApi = async (payload) => {
  try {
    const res = await Axios.post(
      "/store/find-nearest",
      payload
    );

    return res.data;
  } catch (error) {
    return handleApiError(
      error,
      "Failed to find nearest store"
    );
  }
};

// ================= USERS =================

export const getAllUsersApi = async (page = 1, limit = 10) => {
  try {
    const res = await Axios.get("/admin/get-all-users", {
      params: { page, limit },
    });
    return res.data;
  } catch (error) {
    return handleApiError(error, "Failed to fetch users");
  }
};

// ================= INVENTORY =================

export const createInventoryApi = async (payload) => {
  try {
    const res = await Axios.post("/admin/create-inventory", payload);
    return res.data;
  } catch (error) {
    return handleApiError(error, "Create inventory failed");
  }
};
export const getInventoryByStoreIdApi = async (
  storeId,
  page = 1,
  limit = 20
) => {
  try {
    const res = await Axios.get(
      `/admin/inventory/${storeId}`,
      {
        params: { page, limit },
      }
    );

    return res.data;
  } catch (error) {
    return handleApiError(
      error,
      "Failed to fetch inventory"
    );
  }
};

// ================= ORDERS =================

export const getStoreOrdersApi = async (storeId) => {
  try {
    if (!storeId) throw new Error("storeId is required");

    const res = await Axios.get(`/store/orders/${storeId}`);
    return res.data;
  } catch (error) {
    return handleApiError(error, "Get store orders failed");
  }
};

export const getOutForDeliveryOrdersApi = async (
  storeId,
  status = "OUT_FOR_DELIVERY"
) => {
  try {
    if (!storeId) throw new Error("storeId is required");

    const response = await Axios.get(`/store/orders/${storeId}`, {
      params: { status },
    });

    return response.data;
  } catch (error) {
    console.error("OUT_FOR_DELIVERY_API_ERROR 👉", error);

    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong",
      data: [],
    };
  }
};

export const packStoreOrderApi = async (storeId, orderId) => {
  try {
    const res = await Axios.patch(
      `/store/orders/${storeId}/${orderId}/pack`
    );
    return res.data;
  } catch (error) {
    return handleApiError(error, "Pack order failed");
  }
};

export const assignDriverApi = async (storeId, orderId, driverId) => {
  try {
    const res = await Axios.patch(
      `/store/orders/${storeId}/${orderId}/assign-driver`,
      { driverId }
    );
    return res.data;
  } catch (error) {
    return handleApiError(error, "Assign driver failed");
  }
};

// ================= RATINGS =================

export const getAppRatingsApi = async () => {
  try {
    const res = await Axios.get("/admin/app-ratings");
    return res.data;
  } catch (error) {
    return handleApiError(error, "Failed to fetch ratings");
  }
};

export const getAppRatingAverageApi = async () => {
  try {
    const res = await Axios.get("/admin/app-rating-average");
    return res.data;
  } catch (error) {
    return handleApiError(error, "Failed to fetch rating average");
  }
};