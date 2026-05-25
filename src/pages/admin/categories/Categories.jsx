import React, { useEffect, useRef, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaTimes, FaUpload } from "react-icons/fa";

import {
  createCategoryApi,
  getAllCategoriesApi,
  updateCategoryApi,
} from "../../../api/admin.api";

const Categories = () => {
  const fileRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);

  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const normalizeCategories = (apiData) => {
    if (Array.isArray(apiData)) return apiData;
    if (Array.isArray(apiData?.data)) return apiData.data;
    if (Array.isArray(apiData?.categories)) return apiData.categories;
    if (Array.isArray(apiData?.data?.categories)) return apiData.data.categories;
    if (Array.isArray(apiData?.data?.docs)) return apiData.data.docs;
    return [];
  };

  const getImageUrl = (item) => {
    const imageValue = item?.image || item?.imageUrl || item?.thumbnail;

    if (!imageValue) return "/logo.png";

    if (typeof imageValue === "string") {
      if (imageValue.startsWith("http")) return imageValue;
      if (imageValue.startsWith("/")) return `http://192.168.29.96:5000${imageValue}`;
      return `http://192.168.29.96:5000/${imageValue}`;
    }

    return "/logo.png";
  };

  const fetchCategories = async () => {
    try {
      setFetchLoading(true);

      const response = await getAllCategoriesApi(1, 10);
      console.log("CATEGORY RESPONSE 👉", response);

      if (response?.success) {
        setCategories(normalizeCategories(response));
      } else {
        setCategories([]);
        alert(response?.message || "Failed to fetch categories");
      }
    } catch (error) {
      console.log("FETCH CATEGORY ERROR 👉", error);
      alert(error?.message || "Something went wrong while fetching categories");
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setCategoryName("");
    setDescription("");
    setIsActive(true);
    setImage(null);
    setPreview(null);
    setEditCategory(null);

    if (fileRef.current) fileRef.current.value = "";
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (category) => {
    console.log("EDIT CATEGORY 👉", category);

    setEditCategory(category);
    setCategoryName(category?.name || "");
    setDescription(category?.description || "");
    setIsActive(category?.isActive ?? true);
    setPreview(getImageUrl(category));
    setImage(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleOpenFile = () => {
    fileRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select image only");
      return;
    }

    setImage(file);

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

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

      formData.append("name", categoryName.trim());
      formData.append("description", description.trim());
      formData.append("isActive", isActive);

      if (image) {
        formData.append("image", image);
      }

      const categoryId = editCategory?._id || editCategory?.id;

      const response = editCategory
        ? await updateCategoryApi(categoryId, formData)
        : await createCategoryApi(formData);

      console.log("SAVE CATEGORY RESPONSE 👉", response);

      if (response?.success) {
        alert(response?.message || "Category saved successfully");
        closeModal();
        fetchCategories();
      } else {
        alert(response?.message || "Failed to save category");
      }
    } catch (error) {
      console.log("SAVE CATEGORY ERROR 👉", error);
      alert(error?.message || "Something went wrong while saving category");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmDelete) return;

    setCategories((prev) => prev.filter((item) => (item?._id || item?.id) !== id));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-white/[0.01] via-transparent to-transparent p-5 rounded-3xl border border-white/[0.03]">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Categories
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Manage main product categories for the storefront
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center gap-2 h-11 bg-gradient-to-r from-[var(--primary-orange)] to-[var(--primary-orange-light)] text-white px-5 rounded-xl transition-all shadow-md shadow-orange-500/20 font-bold text-xs shrink-0 cursor-pointer hover:scale-[1.01]"
        >
          <FaPlus /> Add Category
        </button>
      </div>

      {fetchLoading ? (
        <div className="glass-premium rounded-3xl border border-white/[0.03] p-10 text-center text-xs text-slate-500 font-medium">
          Loading categories...
        </div>
      ) : categories.length === 0 ? (
        <div className="glass-premium rounded-3xl border border-white/[0.03] p-10 text-center text-xs text-slate-500 font-medium">
          No categories found. Start by adding one!
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => {
            const id = cat?._id || cat?.id;

            return (
              <div
                key={id}
                className="glass-premium glass-premium-hover group rounded-2xl p-5 border border-white/[0.02] shadow-xl relative"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="h-16 w-16 overflow-hidden rounded-xl border border-white/5 bg-white/[0.02]">
                    <img
                      src={getImageUrl(cat)}
                      alt={cat?.name || "Category"}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <span
                    className={`text-[10px] px-2 py-1 rounded-full font-bold ${
                      cat?.isActive
                        ? "bg-green-500/10 text-green-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {cat?.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="absolute right-4 top-20 flex gap-1.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-black/60 p-1.5 rounded-lg border border-white/5 backdrop-blur-md">
                  <button
                    type="button"
                    onClick={() => openEditModal(cat)}
                    className="text-blue-400 hover:text-blue-300 p-1 cursor-pointer"
                  >
                    <FaEdit size={13} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(id)}
                    className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                  >
                    <FaTrash size={13} />
                  </button>
                </div>

                <h3 className="text-sm font-bold text-white tracking-wide">
                  {cat?.name || "Category"}
                </h3>

                <p className="mt-1.5 line-clamp-2 text-xs text-slate-500 font-medium leading-relaxed">
                  {cat?.description || "No description provided."}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 px-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl border border-white/5 bg-[#080e0a] p-6 shadow-2xl relative overflow-hidden glass-premium">
            <div className="mb-6 flex items-center justify-between border-b border-white/[0.03] pb-4">
              <div>
                <h2 className="text-lg font-bold text-white tracking-wide">
                  {editCategory ? "Update Category" : "Add Category"}
                </h2>

                <p className="mt-0.5 text-xs text-slate-500 font-medium">
                  {editCategory
                    ? "Modify existing category properties"
                    : "Define a new product catalog category"}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-slate-400 hover:text-white cursor-pointer border border-white/5"
              >
                <FaTimes size={12} />
              </button>
            </div>

            <form onSubmit={handleSubmitCategory} className="space-y-5">
              <div>
                <label className="mb-2 block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Category Name
                </label>

                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="e.g. Fruits & Vegetables"
                  required
                  className="w-full h-11 rounded-xl border border-white/5 bg-black/40 px-4 text-xs text-white outline-none focus:border-[var(--primary-orange)]/45 focus:bg-black/60 transition-all"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Description
                </label>

                <textarea
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summarize product types included..."
                  className="w-full rounded-xl border border-white/5 bg-black/40 px-4 py-3 text-xs text-white outline-none focus:border-[var(--primary-orange)]/45 focus:bg-black/60 transition-all resize-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Status
                </label>

                <select
                  value={String(isActive)}
                  onChange={(e) => setIsActive(e.target.value === "true")}
                  className="w-full h-11 rounded-xl border border-white/5 bg-black/40 px-4 text-xs text-white outline-none focus:border-[var(--primary-orange)]/45"
                >
                  <option className="bg-slate-900" value="true">
                    Active
                  </option>
                  <option className="bg-slate-900" value="false">
                    Inactive
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Category Image
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
                  className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/10 bg-white/[0.01] p-6 transition-all hover:border-[var(--primary-orange)]/40 hover:bg-white/[0.02]"
                >
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="h-28 w-full rounded-xl object-cover"
                    />
                  ) : (
                    <>
                      <FaUpload className="text-xl text-[var(--primary-orange-light)]" />
                      <p className="text-xs text-slate-500 font-bold">
                        Click to select image file
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-full h-11 rounded-xl border border-white/5 bg-white/[0.02] text-slate-300 font-bold text-xs hover:bg-white/[0.04] transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-xl btn-gradient-orange text-white font-bold text-xs transition-all disabled:opacity-50 cursor-pointer"
                >
                  {loading
                    ? editCategory
                      ? "Saving Updates..."
                      : "Adding Category..."
                    : editCategory
                    ? "Update Category"
                    : "Create Category"}
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