import React, { useEffect, useRef, useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaUpload,
} from "react-icons/fa";

import {
  createCategoryApi,
  getAllCategoriesApi,
  updateCategoryApi,
} from "../../../api/category.api";

const Categories = () => {
  const fileRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);

  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // =========================
  // NORMALIZE CATEGORY DATA
  // =========================

  const normalizeCategories = (apiData) => {
    if (Array.isArray(apiData)) return apiData;

    if (Array.isArray(apiData?.data)) return apiData.data;

    if (Array.isArray(apiData?.categories))
      return apiData.categories;

    if (Array.isArray(apiData?.data?.categories))
      return apiData.data.categories;

    if (Array.isArray(apiData?.data?.docs))
      return apiData.data.docs;

    return [];
  };

  // =========================
  // IMAGE URL
  // =========================

  const getImageUrl = (item) => {
    const imageValue =
      item?.image ||
      item?.imageUrl ||
      item?.categoryImage ||
      item?.thumbnail ||
      item?.photo ||
      item?.file ||
      item?.media?.url ||
      item?.image?.url ||
      item?.image?.path;

    if (!imageValue) return "/logo.png";

    if (typeof imageValue === "string") {
      if (imageValue.startsWith("data:image"))
        return imageValue;

      if (imageValue.startsWith("http"))
        return imageValue;

      if (imageValue.startsWith("/"))
        return `http://192.168.29.96:5000${imageValue}`;

      return `http://192.168.29.96:5000/${imageValue}`;
    }

    return "/logo.png";
  };

  // =========================
  // FETCH CATEGORIES
  // =========================

  const fetchCategories = async () => {
    try {
      setFetchLoading(true);

      const response = await getAllCategoriesApi(1, 10);

      console.log("CATEGORY RESPONSE 👉", response);

      if (response?.success) {
        const apiList = normalizeCategories(response);

        setCategories(apiList);
      } else {
        setCategories([]);

        alert(
          response?.message ||
            "Failed to fetch categories"
        );
      }
    } catch (error) {
      console.log("FETCH CATEGORY ERROR 👉", error);

      setCategories([]);

      alert(
        error?.message ||
          "Something went wrong while fetching categories"
      );
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {
    setCategoryName("");
    setDescription("");
    setImage(null);
    setPreview(null);
    setEditCategory(null);

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  // =========================
  // OPEN ADD MODAL
  // =========================

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  // =========================
  // OPEN EDIT MODAL
  // =========================

  const openEditModal = (category) => {
    setEditCategory(category);

    setCategoryName(category?.name || "");
    setDescription(category?.description || "");

    setPreview(getImageUrl(category));

    setImage(null);

    setShowModal(true);
  };

  // =========================
  // CLOSE MODAL
  // =========================

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  // =========================
  // OPEN FILE
  // =========================

  const handleOpenFile = () => {
    fileRef.current?.click();
  };

  // =========================
  // IMAGE CHANGE
  // =========================

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select image only");
      return;
    }

    setImage(file);

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  // =========================
  // CREATE / UPDATE CATEGORY
  // =========================

  const handleSubmitCategory = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      alert("Category name is required");
      return;
    }

    if (!editCategory && !image) {
      alert("Please upload category image");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      // ✅ ONLY THESE FIELDS
      formData.append("name", categoryName.trim());
      formData.append(
        "description",
        description.trim()
      );

      if (image) {
        formData.append("image", image);
      }

      const categoryId =
        editCategory?._id || editCategory?.id;

      const response = editCategory
        ? await updateCategoryApi(
            categoryId,
            formData
          )
        : await createCategoryApi(formData);

      console.log(
        "SAVE CATEGORY RESPONSE 👉",
        response
      );

      if (response?.success) {
        alert(
          response?.message ||
            "Category saved successfully"
        );

        closeModal();

        fetchCategories();
      } else {
        alert(
          response?.message ||
            "Failed to save category"
        );
      }
    } catch (error) {
      console.log(
        "SAVE CATEGORY ERROR 👉",
        error
      );

      alert(
        error?.message ||
          "Something went wrong while saving category"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmDelete) return;

    setCategories((prev) =>
      prev.filter(
        (item) =>
          (item?._id || item?.id) !== id
      )
    );
  };

  return (
    <div className="p-6">
      {/* HEADER */}

      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Categories
          </h1>

          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Manage main product categories
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 px-4 py-2 font-medium text-white shadow-lg transition-all hover:scale-[1.02]"
        >
          <FaPlus /> Add Category
        </button>
      </div>

      {/* LOADING */}

      {fetchLoading ? (
        <div className="rounded-2xl border border-white/10 bg-[var(--card-bg)] p-8 text-center text-slate-400">
          Loading categories...
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[var(--card-bg)] p-8 text-center text-slate-400">
          No categories found
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => {
            const id = cat?._id || cat?.id;

            return (
              <div
                key={id}
                className="glass group rounded-2xl border border-white/10 p-5 shadow-xl transition-all hover:-translate-y-1"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="h-16 w-16 overflow-hidden rounded-2xl border border-orange-500/20 bg-orange-500/10">
                    <img
                      src={getImageUrl(cat)}
                      alt={
                        cat?.name || "Category"
                      }
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() =>
                        openEditModal(cat)
                      }
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <FaEdit />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(id)
                      }
                      className="text-red-400 hover:text-red-300"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white">
                  {cat?.name || "Category"}
                </h3>

                <p className="mt-1 line-clamp-2 text-sm text-slate-400">
                  {cat?.description ||
                    "No description"}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL */}

      {showModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[var(--app-bg)] p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {editCategory
                    ? "Update Category"
                    : "Add Category"}
                </h2>

                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  {editCategory
                    ? "Update category details"
                    : "Create a new category"}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-gray-400 hover:text-white"
              >
                <FaTimes />
              </button>
            </div>

            <form
              onSubmit={handleSubmitCategory}
              className="space-y-4"
            >
              {/* NAME */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-300">
                  Category Name
                </label>

                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) =>
                    setCategoryName(
                      e.target.value
                    )
                  }
                  placeholder="e.g. MakeUp"
                  required
                  className="w-full rounded-xl border border-[var(--border-soft)] bg-[var(--card-bg)] px-4 py-3 text-white outline-none focus:border-orange-500/60"
                />
              </div>

              {/* DESCRIPTION */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-300">
                  Description
                </label>

                <textarea
                  rows="4"
                  value={description}
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                  placeholder="Enter category description..."
                  className="w-full rounded-xl border border-[var(--border-soft)] bg-[var(--card-bg)] px-4 py-3 text-white outline-none focus:border-orange-500/60"
                />
              </div>

              {/* IMAGE */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-300">
                  Upload Image
                </label>

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

                <div
                  onClick={handleOpenFile}
                  className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-white/10 bg-[var(--card-bg)] p-6 transition hover:border-orange-500/50"
                >
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="h-32 w-full rounded-xl object-cover"
                    />
                  ) : (
                    <>
                      <FaUpload className="text-3xl text-orange-400" />

                      <p className="text-sm text-gray-400">
                        Click to upload image
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* BUTTONS */}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-gray-300 hover:bg-white/10"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 px-4 py-3 font-bold text-white transition hover:scale-[1.02] disabled:opacity-60"
                >
                  {loading
                    ? editCategory
                      ? "Updating..."
                      : "Creating..."
                    : editCategory
                    ? "Update"
                    : "Add Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;