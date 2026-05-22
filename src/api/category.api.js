import Axios from "./Axios";

const handleApiError = (error, fallbackMessage) => {
  console.log("API ERROR 👉", error?.response?.data || error);

  return error?.response?.data || {
    success: false,
    message: error?.message || fallbackMessage,
  };
};

// =======================================
// CATEGORY APIs
// =======================================

export const createCategoryApi = async (formData) => {
  try {
    const response = await Axios.post("/admin/category-create", formData);
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

export const updateCategoryApi = async (categoryId, formData) => {
  try {
    const response = await Axios.put(
      `/admin/update-category/${categoryId}`,
      formData
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, "Failed to update category");
  }
};

// =======================================
// SUB CATEGORY APIs
// =======================================

export const createSubCategoryApi = async (formData) => {
  try {
    const response = await Axios.post("/admin/subcategory-create", formData);
    return response.data;
  } catch (error) {
    return handleApiError(error, "Failed to create sub category");
  }
};

export const getAllSubCategoriesApi = async ({
  page = 1,
  limit = 10,
  category = "",
} = {}) => {
  try {
    const params = new URLSearchParams();

    params.append("page", page);
    params.append("limit", limit);

    if (category) {
      params.append("category", category);
    }

    const response = await Axios.get(
      `/user/get-all-subcategories?${params.toString()}`
    );

    return response.data;
  } catch (error) {
    return handleApiError(error, "Failed to fetch sub categories");
  }
};

export const getSubCategoryByIdApi = async (subCategoryId) => {
  try {
    const response = await Axios.get(`/user/subcategory/${subCategoryId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, "Failed to fetch sub category");
  }
};

export const updateSubCategoryApi = async (subCategoryId, formData) => {
  try {
    const response = await Axios.put(
      `/admin/update-subcategory/${subCategoryId}`,
      formData
    );

    return response.data;
  } catch (error) {
    return handleApiError(error, "Failed to update sub category");
  }
};

export const toggleSubCategoryStatusApi = async (subCategoryId) => {
  try {
    const response = await Axios.patch(`/admin/toggle/${subCategoryId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, "Failed to toggle sub category status");
  }
};

// =======================================
// BRAND APIs
// =======================================

export const createBrandApi = async (formData) => {
  try {
    const response = await Axios.post("/admin/brand-create", formData);
    return response.data;
  } catch (error) {
    return handleApiError(error, "Failed to create brand");
  }
};

export const getAllBrandsApi = async ({
  page = 1,
  limit = 10,
  search = "",
} = {}) => {
  try {
    const params = new URLSearchParams();

    params.append("page", page);
    params.append("limit", limit);

    if (search) {
      params.append("search", search);
    }

    const response = await Axios.get(
      `/user/get-all-brands?${params.toString()}`
    );

    return response.data;
  } catch (error) {
    return handleApiError(error, "Failed to fetch brands");
  }
};

export const getBrandByIdApi = async (brandId) => {
  try {
    const response = await Axios.get(`/user/brand/${brandId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, "Failed to fetch brand");
  }
};

export const updateBrandApi = async (brandId, formData) => {
  try {
    const response = await Axios.put(`/admin/update-brand/${brandId}`, formData);
    return response.data;
  } catch (error) {
    return handleApiError(error, "Failed to update brand");
  }
};