import React, { useEffect, useRef, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaTimes, FaUpload, FaCheckCircle, FaMinusCircle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import { showSuccess, showError, showConfirm } from "../../../utils/alertService";

import {
  createCategoryApi,
  getAllCategoriesApi,
  deleteCategoryApi,
  updateCategoryApi,
} from "../../../api/category.api";

import { getAllParentCategoriesApi } from "../../../api/admin.api";

const Categories = () => {
  const fileRef = useRef(null);
  const dispatch = useDispatch();

  const [categories, setCategories] = useState([]);
  const [parentCategories, setParentCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);

  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [selectedParent, setSelectedParent] = useState("");

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // ─── HELPERS ──────────────────────────────────────────────────────────────
  const getImageUrl = (item) => {
    const imageValue = item?.image || item?.imageUrl || item?.thumbnail;
    if (!imageValue) return "/logo.png";
    if (typeof imageValue === "string") {
      if (imageValue.startsWith("http")) return imageValue;
      return `http://192.168.29.96:5000${imageValue.startsWith("/") ? "" : "/"}${imageValue}`;
    }
    return "/logo.png";
  };

  const getParentName = (cat) => {
    if (!cat?.parentCategory) return null;
    if (typeof cat.parentCategory === "object") return cat.parentCategory?.name;
    const found = parentCategories.find((p) => p._id === cat.parentCategory);
    return found?.name || null;
  };

  // ─── FETCH ────────────────────────────────────────────────────────────────
  const fetchCategories = async () => {
    try {
      setFetchLoading(true);
      const response = await getAllCategoriesApi(1, 50);
      if (response?.success) {
        if (Array.isArray(response.data)) setCategories(response.data);
        else if (Array.isArray(response.data?.categories)) setCategories(response.data.categories);
        else setCategories([]);
      }
    } catch {
      showError("Failed to load categories");
    } finally {
      setFetchLoading(false);
    }
  };

  const fetchParentCategories = async () => {
    try {
      const res = await getAllParentCategoriesApi(1, 100);
      if (res?.success && Array.isArray(res.data)) setParentCategories(res.data);
    } catch {
      showError("Failed to load parent categories");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchParentCategories();
  }, []);

  // ─── FORM HANDLERS ────────────────────────────────────────────────────────
  const resetForm = () => {
    setCategoryName("");
    setDescription("");
    setIsActive(true);
    setSelectedParent("");
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
    setEditCategory(category);
    setCategoryName(category?.name || "");
    setDescription(category?.description || "");
    setIsActive(category?.isActive !== false);
    const parentId =
      typeof category?.parentCategory === "object"
        ? category.parentCategory?._id
        : category?.parentCategory || "";
    setSelectedParent(parentId);
    setPreview(getImageUrl(category));
    setImage(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setTimeout(resetForm, 300);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return showError("Category name is required");
    if (!editCategory && !image) return showError("Please upload an image");

    try {
      setLoading(true);
      dispatch(showLoader());

      const formData = new FormData();
      formData.append("name", categoryName.trim());
      formData.append("description", description.trim());
     
      if (selectedParent && selectedParent.trim() !== "") {
          formData.append("parentCategory", selectedParent);
      }
      
      if (editCategory) formData.append("isActive", isActive ? "true" : "false");
      if (image) formData.append("image", image);

      const categoryId = editCategory?._id || editCategory?.id;
      const response = editCategory
        ? await updateCategoryApi(categoryId, formData)
        : await createCategoryApi(formData);

      if (response?.success) {
        closeModal();
        showSuccess(response?.message || "Category saved successfully");
        fetchCategories();
      } else {
        showError(response?.message || "Operation failed");
      }
    } catch (error) {
      showError(error?.message || "Server Error");
    } finally {
      setLoading(false);
      dispatch(hideLoader());
    }
  };

  const handleDelete = async (id) => {
    const confirm = await showConfirm({
      title: "Are you sure?",
      text: "This category will be removed permanently.",
    });
    if (!confirm.isConfirmed) return;
    try {
      dispatch(showLoader());
      const response = await deleteCategoryApi(id);
      if (response?.success) {
        setCategories((prev) => prev.filter((item) => (item?._id || item?.id) !== id));
        showSuccess(response?.message || "Category deleted successfully");
      } else {
        showError(response?.message || "Delete failed");
      }
    } catch (error) {
      showError(error?.message || "Delete failed");
    } finally {
      dispatch(hideLoader());
    }
  };

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen font-sans antialiased bg-[#f8fafc] text-[#1e293b]">

      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-10 gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#0f172a] tracking-tight">
            Store <span className="text-[#ff7e00]">Categories</span>
          </h1>
          <p className="text-[#64748b] text-xs sm:text-sm font-semibold mt-1">
            Organize your products with premium cataloging
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="w-full md:w-auto px-6 sm:px-8 py-3.5 bg-[#ff7e00] hover:bg-[#e06f00] text-white rounded-2xl font-bold shadow-[0_8px_25px_rgba(255,126,0,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <FaPlus size={14} /> Add Category
        </button>
      </div>

      {/* ── GRID ── */}
      {fetchLoading ? (
        <div className="flex justify-center items-center h-64 bg-white border border-slate-200 rounded-3xl animate-pulse text-[#64748b] font-bold shadow-sm">
          Fetching Catalog...
        </div>
      ) : categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white border border-dashed border-slate-200 rounded-3xl text-slate-400 gap-3">
          <span className="text-4xl">📂</span>
          <p className="font-semibold text-sm">No categories yet. Add your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const parentName = getParentName(cat);
            return (
              <div
                key={cat?._id || cat?.id}
                className="group bg-white border border-slate-200 rounded-[2rem] p-6 hover:border-[#ff7e00]/40 transition-all duration-300 hover:-translate-y-1.5 relative shadow-[0_10px_30px_rgba(15,23,42,0.04)] hover:shadow-[0_20px_40px_rgba(15,23,42,0.08)] overflow-hidden"
              >
                {/* Status badge */}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border z-10
                  ${cat?.isActive ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "bg-rose-50 border-rose-200 text-rose-600"}`}>
                  {cat?.isActive ? "Active" : "Inactive"}
                </div>

                {/* Image */}
                <div className="relative h-40 w-full rounded-2xl overflow-hidden mb-4 bg-slate-100 border border-slate-100">
                  <img
                    src={getImageUrl(cat)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt={cat?.name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-40" />
                </div>

                {/* Parent Category pill */}
                {parentName && (
                  <div className="mb-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-full">
                      <span className="text-orange-400">↳</span> {parentName}
                    </span>
                  </div>
                )}

                <h3 className="text-lg font-bold text-[#0f172a] truncate mb-1">{cat?.name}</h3>
                <p className="text-[#64748b] text-xs leading-relaxed line-clamp-2 mb-5 font-semibold min-h-[2rem]">
                  {cat?.description || "Curated collection of premium products."}
                </p>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="flex-1 py-2.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-blue-600 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 font-bold text-xs"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cat?._id || cat?.id)}
                    className="w-11 h-10 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-rose-500 rounded-xl transition-all cursor-pointer flex items-center justify-center"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── MODAL ── */}
      {showModal && (
<div className="fixed inset-0 z-[999] overflow-y-auto bg-slate-900/40 backdrop-blur-md">
  <div className="min-h-screen flex items-start sm:items-center justify-center p-4 py-8">        
      <div className="w-full max-w-lg bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-[0_30px_70px_rgba(15,23,42,0.15)] relative">

            {/* Close */}
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 text-slate-400 hover:text-[#0f172a] transition-colors cursor-pointer p-1"
            >
              <FaTimes size={18} />
            </button>

            {/* Modal Header */}
            <div className="mb-7 text-center">
              <div className="w-14 h-1 bg-[#ff7e00] mx-auto rounded-full mb-4" />
              <h2 className="text-2xl font-black text-[#0f172a]">
                {editCategory ? "Update" : "New"} Category
              </h2>
              <p className="text-[#64748b] text-sm mt-1 font-semibold">
                Fill details to refresh store catalog
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Category Name */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-[#64748b] tracking-wider">
                  Category Title <span className="text-orange-400">*</span>
                </label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-3.5 text-[#0f172a] outline-none focus:bg-white focus:border-[#ff7e00] focus:ring-4 focus:ring-[#ff7e00]/10 transition-all font-bold placeholder-slate-300"
                  placeholder="e.g. Organic Greens"
                />
              </div>

              {/* Parent Category */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-[#64748b] tracking-wider">
                  Parent Category
                  <span className="ml-2 text-[10px] font-semibold text-slate-400 normal-case tracking-normal">(optional)</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedParent}
                    onChange={(e) => setSelectedParent(e.target.value)}
                    className="w-full appearance-none bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-3.5 pr-10 text-slate-700 outline-none focus:bg-white focus:border-[#ff7e00] focus:ring-4 focus:ring-[#ff7e00]/10 transition-all font-bold cursor-pointer"
                  >
                    <option value="">— No Parent Category —</option>
                    {parentCategories.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>

                {/* Selected parent preview */}
                {selectedParent && (() => {
                  const p = parentCategories.find((x) => x._id === selectedParent);
                  return p ? (
                    <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 border border-orange-100 rounded-xl">
                      {p.image && (
                        <img src={p.image} className="w-6 h-6 rounded-md object-cover" alt="" />
                      )}
                      <span className="text-xs font-bold text-orange-700">↳ {p.name}</span>
                      <span className="ml-auto text-[10px] text-orange-400 font-medium">{p.description}</span>
                    </div>
                  ) : null;
                })()}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-[#64748b] tracking-wider">Description</label>
                <textarea
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-3.5 text-[#0f172a] outline-none focus:bg-white focus:border-[#ff7e00] focus:ring-4 focus:ring-[#ff7e00]/10 transition-all font-bold placeholder-slate-300 resize-none"
                  placeholder="Describe the category essence..."
                />
              </div>

              {/* Status + Image row */}
              <div className="grid grid-cols-2 gap-4">
                {/* Status */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-[#64748b] tracking-wider">Visibility</label>
                  <div
                    onClick={() => setIsActive(!isActive)}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-2xl border cursor-pointer transition-all
                      ${isActive ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-rose-50 border-rose-200 text-rose-700"}`}
                  >
                    <span className="text-xs font-extrabold uppercase tracking-wide">
                      {isActive ? "Public" : "Hidden"}
                    </span>
                    {isActive ? <FaCheckCircle size={13} /> : <FaMinusCircle size={13} />}
                  </div>
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-[#64748b] tracking-wider">
                    Cover Image {!editCategory && <span className="text-orange-400">*</span>}
                  </label>
                  <div
                    onClick={() => fileRef.current.click()}
                    className="flex items-center justify-center h-[52px] bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-[#ff7e00] hover:border-[#ff7e00] transition-all cursor-pointer overflow-hidden"
                  >
                    {preview ? (
                      <img src={preview} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <div className="flex items-center gap-2">
                        <FaUpload size={12} />
                        <span className="text-xs font-semibold">Upload</span>
                      </div>
                    )}
                  </div>
                  <input ref={fileRef} type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#ff7e00] hover:bg-[#e06f00] text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-[0_8px_25px_rgba(255,126,0,0.2)] hover:-translate-y-0.5 transition-all disabled:opacity-50 cursor-pointer mt-2"
              >
                {loading ? "Saving..." : editCategory ? "Confirm Changes" : "Publish Category"}
              </button>
            </form>
          </div>
        </div>

        {/* Close */}
        <button
          onClick={closeModal}
          className="absolute top-6 right-6 text-slate-400 hover:text-[#0f172a] transition-colors cursor-pointer p-1"
        >
          <FaTimes size={18} />
        </button>

      </div>

      )}
    </div>

  );
};

export default Categories;