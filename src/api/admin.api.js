import Axios from "./Axios";
import {
  getAllSubCategoriesApi as getAllSubCategoriesApiFromCategory,
  getAllBrandsApi as getAllBrandsApiFromCategory,
} from "./category.api";

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

// ==========================================
// CREATE PRODUCT (ADMIN)
// ==========================================
export const createProductApi = async (data) => {
  try {
    const response = await Axios.post("/admin/create-product", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    return error.response?.data || {
      success: false,
      message: error.message,
    };
  }
};

export const updateProductApi = async (productId, data) => {
  try {
    const response = await Axios.put(
      `/admin/update-product/${productId}`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    return error.response?.data || {
      success: false,
      message: error.message,
    };
  }
};

// ======================================================
// GET ALL PRODUCTS
// ======================================================

export const getAllProductsApi = async (
  page = 1,
  limit = 10,
  category = "",
  subCategory = "",
  brand = ""
) => {
  try {
    let url = `/user/get-all-products?page=${page}&limit=${limit}`;

    if (category) {
      url += `&category=${category}`;
    }

    if (subCategory) {
      url += `&subCategory=${subCategory}`;
    }

    if (brand) {
      url += `&brand=${brand}`;
    }

    const response = await Axios.get(url);

    return response.data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: error.message,
      }
    );
  }
};

// ==========================================
// GET SINGLE PRODUCT
// ==========================================
export const getSingleProductApi = async (productId) => {
  try {
    const response = await Axios.get(`/user/product/${productId}`);

    return response.data;
  } catch (error) {
    return error.response?.data || {
      success: false,
      message: error.message,
    };
  }
};

// ==========================================
// TOGGLE PRODUCT STATUS
// ==========================================
export const toggleProductStatusApi = async (productId) => {
  try {
    const response = await Axios.patch(
      `/admin/toggle-product-status/${productId}`
    );

    return response.data;
  } catch (error) {
    return (
      error?.response?.data || {
        success: false,
        message: "Something went wrong",
      }
    );
  }
};

// ==========================================
// DELETE PRODUCT
// ==========================================
export const deleteProductApi = async (productId) => {
  try {
    const response = await Axios.delete(`/admin/delete-product/${productId}`);
    return response.data;
  } catch (error) {
    return error?.response?.data || {
      success: false,
      message: error.message,
    };
  }
};

// ================= STORE =================

export const createStoreApi = async (formData) => {
  try {
    const res = await Axios.post("/admin/store-create", formData);
    return res.data;
  } catch (error) {
    return error.response?.data || { success: false, message: "Upload failed" };
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

export const updateStoreApi = async (storeId, formData) => {
  try {
    const res = await Axios.put(`/admin/update-store/${storeId}`, formData);
    return res.data;
  } catch (error) {
    return error.response?.data || { success: false, message: "Update failed" };
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

export const getAllSubCategoriesApi = getAllSubCategoriesApiFromCategory;
export const getAllBrandsApi = getAllBrandsApiFromCategory;

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
   
    const res = await Axios.get("/store/nearest", {
      params: {
        lat: payload.lat,
        lng: payload.lng
      }
    });
    return res.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
   //error return kar rha hai
    return error.response?.data || { success: false, message: "Server connection failed" };
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

export const getStoreOrdersByStatusApi = async (
  storeId,
  status = "PACKED"
) => {
  try {
    if (!storeId) throw new Error("storeId is required");

    const response = await Axios.get(`/store/orders/${storeId}`, {
      params: { status },
    });

    return response.data;
  } catch (error) {
    console.error("STORE_ORDERS_BY_STATUS_API_ERROR 👉", error);

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

export const getAllOrdersByStatusApi = async (
  status = "PACKED"
) => {
  try {
    const res = await Axios.get("/admin/all-orders");
    const data = res?.data;
    const orders = Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data)
      ? data
      : [];

    const filteredOrders = orders.filter(
      (order) => String(order?.orderStatus || "").toUpperCase() === status
    );

    return {
      success: true,
      data: filteredOrders,
    };
  } catch (error) {
    console.error("ALL_ORDERS_BY_STATUS_API_ERROR 👉", error);

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

export const getOutForDeliveryOrdersApi = async (
  storeId,
  status = "OUT_FOR_DELIVERY"
) => {
  return getStoreOrdersByStatusApi(storeId, status);
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

// ================= PAYMENTS =================

export const getAllTransactionsApi = async (
  page = 1,
  limit = 25,
  status = "",
  paymentMethod = ""
) => {
  try {
    const res = await Axios.get("/admin/all-transactions", {
      params: {
        page,
        limit,
        status,
        paymentMethod,
      },
    });

    return res.data;
  } catch (error) {
    return handleApiError(error, "Failed to fetch transactions");
  }
};

export const getUserTransactionsApi = async (
  userId,
  page = 1,
  limit = 25,
  status = "",
  paymentMethod = ""
) => {
  if (!userId) {
    return {
      success: false,
      message: "userId is required to fetch user transactions",
      data: [],
    };
  }

  try {
    const res = await Axios.get(`/admin/user-transactions/${userId}`, {
      params: {
        page,
        limit,
        status,
        paymentMethod,
      },
    });

    return res.data;
  } catch (error) {
    return handleApiError(error, "Failed to fetch user transactions");
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

// ================= SUPPORT TICKETS =================

export const getAllSupportTicketsApi = async (page = 1, limit = 25) => {
  try {
    const res = await Axios.get("/admin/get-all-support-tickets", {
      params: { page, limit },
    });

    // merge any locally-created tickets (fallback) with server data
    const serverData = res.data;
    try {
      const local = JSON.parse(localStorage.getItem("localSupportTickets") || "[]");
      // serverData may be { success, data } or array
      const serverList = Array.isArray(serverData?.data)
        ? serverData.data
        : Array.isArray(serverData)
        ? serverData
        : [];

      return {
        success: true,
        data: [...local, ...serverList],
      };
    } catch (e) {
      return res.data;
    }
  } catch (error) {
    // if endpoint missing, return local fallback tickets
    if (error?.response?.status === 404) {
      const local = JSON.parse(localStorage.getItem("localSupportTickets") || "[]");
      return { success: true, data: local };
    }

    return handleApiError(error, "Failed to fetch support tickets");
  }
};

export const createSupportTicketApi = async (payload) => {
  try {
    const res = await Axios.post("/admin/create-support-ticket", payload);
    return res.data;
  } catch (error) {
    // if backend route missing (404), persist ticket locally as fallback
    if (error?.response?.status === 404) {
      try {
        const subject = payload?.get ? payload.get("subject") : "";
        const description = payload?.get ? payload.get("description") : "";
        const files = payload?.getAll ? payload.getAll("images") : [];

        const images = Array.from(files || []).map((f) => {
          try {
            return URL.createObjectURL(f);
          } catch (e) {
            return "";
          }
        });

        const ticket = {
          _id: `local_${Date.now()}`,
          subject,
          description,
          images,
          status: "PENDING",
        };

        const existing = JSON.parse(localStorage.getItem("localSupportTickets") || "[]");
        existing.unshift(ticket);
        localStorage.setItem("localSupportTickets", JSON.stringify(existing));

        return { success: true, data: ticket };
      } catch (e) {
        return { success: false, message: "Local fallback failed" };
      }
    }

    return handleApiError(error, "Failed to create support ticket");
  }
};

export const updateSupportTicketStatusApi = async (ticketId, status) => {
  try {
    const res = await Axios.patch(
      `/admin/update-support-ticket-status/${ticketId}`,
      { status }
    );

    return res.data;
  } catch (error) {
    // if backend route missing, update local fallback tickets
    if (error?.response?.status === 404) {
      try {
        const existing = JSON.parse(localStorage.getItem("localSupportTickets") || "[]");
        const updated = existing.map((t) =>
          t._id === ticketId ? { ...t, status } : t
        );
        localStorage.setItem("localSupportTickets", JSON.stringify(updated));
        return { success: true };
      } catch (e) {
        return handleApiError(error, "Failed to update support ticket status");
      }
    }

    return handleApiError(error, "Failed to update support ticket status");
  }
};

export const registerDriverApi = async (payload) => {
  try {
    const res = await Axios.post("/driver/register", payload);
    return res.data;
  } catch (error) {
    return handleApiError(error, "Driver registration failed");
  }
};


export const getDriversByStoreApi = async (storeId) => {
  try {
    const res = await Axios.get(`/driver/store/${storeId}`);
    return res.data;
  } catch (error) {
    return error.response?.data || { success: false, message: "Failed to fetch drivers" };
  }
};