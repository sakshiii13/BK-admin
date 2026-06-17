import React, { useEffect, useRef, useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaUpload,
  FaCheckCircle,
  FaMinusCircle,
  FaLayerGroup,
  FaChevronRight,
  FaArrowLeft,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import { showSuccess, showError, showConfirm } from "../../../utils/alertService";

import {
  createParentCategoryApi,
  getAllParentCategoriesApi,
  updateParentCategoryApi,
  deleteParentCategoryApi,
} from "../../../api/admin.api";

import { getAllCategoriesApi } from "../../../api/category.api";

// ─── helpers ────────────────────────────────────────────────────────────────

const normalizeList = (apiData) => {
  if (!apiData) return [];
  if (Array.isArray(apiData)) return apiData;
  const d = apiData?.data;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.parentCategories)) return d.parentCategories;
  if (Array.isArray(d?.categories)) return d.categories;
  if (Array.isArray(d?.docs)) return d.docs;
  if (d && (d._id || d.id)) return [d];
  return [];
};

const getImageUrl = (item) => {
  const v = item?.image || item?.imageUrl || item?.thumbnail;
  if (!v) return "/logo.png";
  if (typeof v === "string") {
    if (v.startsWith("http")) return v;
    return `http://192.168.29.96:5000${v.startsWith("/") ? "" : "/"}${v}`;
  }
  return "/logo.png";
};

// ─── component ──────────────────────────────────────────────────────────────

const ParentCategories = () => {
  const fileRef = useRef(null);
  const dispatch = useDispatch();

  const [list, setList] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  // Child categories modal state
  const [showChildModal, setShowChildModal] = useState(false);
  const [selectedParent, setSelectedParent] = useState(null);
  const [childCategories, setChildCategories] = useState([]);
  const [childLoading, setChildLoading] = useState(false);

  // form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // ── fetch parent categories ─────────────────────────────────────────────────
  const fetchAll = async () => {
    try {
      setFetchLoading(true);
      const res = await getAllParentCategoriesApi(1, 50);
      if (res?.success) {
        setList(normalizeList(res));
      }
    } catch {
      showError("Failed to load parent categories");
    } finally {
      setFetchLoading(false);
    }
  };

  // ── fetch child categories ──────────────────────────────────────────────────
  const fetchChildCategories = async (parentId, parentName) => {
    try {
      setChildLoading(true);
      const res = await getAllCategoriesApi(1, 100);

      if (res?.success) {
        const allCategories = normalizeList(res.data || res);
        // Filter categories that belong to this parent
        const children = allCategories.filter(
          (cat) => cat?.parentCategory?._id === parentId
        );
        setChildCategories(children);
        setSelectedParent({ id: parentId, name: parentName });
        setShowChildModal(true);
      }
    } catch (err) {
      console.log(err);
      showError("Failed to load child categories");
    } finally {
      setChildLoading(false);
    }
  };

  const closeChildModal = () => {
    setShowChildModal(false);
    setTimeout(() => {
      setSelectedParent(null);
      setChildCategories([]);
    }, 300);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // ── form helpers ────────────────────────────────────────────────────────────
  const resetForm = () => {
    setName("");
    setDescription("");
    setIsActive(true);
    setImage(null);
    setPreview(null);
    setEditItem(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const openAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setName(item?.name || "");
    setDescription(item?.description || "");
    setIsActive(item?.isActive !== false);
    setPreview(getImageUrl(item));
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

  // ── submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return showError("Parent category name is required");
    if (!editItem && !image) return showError("Please upload an image");

    try {
      setLoading(true);
      dispatch(showLoader());

      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("description", description.trim());
      if (editItem) {
        formData.append("isActive", isActive ? "true" : "false");
      }
      if (image) formData.append("image", image);

      const id = editItem?._id || editItem?.id;
      const res = editItem
        ? await updateParentCategoryApi(id, formData)
        : await createParentCategoryApi(formData);

      if (res?.success) {
        closeModal();
        showSuccess(res?.message || "Saved successfully");
        fetchAll();
      } else {
        showError(res?.message || "Operation failed");
      }
    } catch (err) {
      showError(err?.message || "Server error");
    } finally {
      setLoading(false);
      dispatch(hideLoader());
    }
  };

  // ── delete ──────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    const confirm = await showConfirm({
      title: "Delete Parent Category?",
      text: "This action is permanent and cannot be undone.",
    });
    if (!confirm.isConfirmed) return;

    try {
      dispatch(showLoader());
      const res = await deleteParentCategoryApi(id);
      if (res?.success) {
        setList((prev) => prev.filter((i) => (i?._id || i?.id) !== id));
        showSuccess(res?.message || "Deleted successfully");
      } else {
        showError(res?.message || "Delete failed");
      }
    } catch {
      showError("Delete failed");
    } finally {
      dispatch(hideLoader());
    }
  };

  // ── render ──────────────────────────────────────────────────────────────────
  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen font-sans antialiased bg-[var(--app-bg)] text-[var(--text-primary)]">
      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-10 gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--primary-orange)] mb-1">
            Category Management
          </p>
          <h1 className="text-2xl sm:text-4xl font-black text-[var(--text-primary)] tracking-tight">
            Parent <span className="text-[var(--primary-orange)]">Categories</span>
          </h1>
          <p className="text-[var(--text-secondary)] text-xs sm:text-sm font-semibold mt-1">
            Top-level categories — all child categories nest under these
          </p>
        </div>

        <button
          onClick={openAdd}
          className="w-full md:w-auto px-6 sm:px-8 py-3.5 bg-[var(--primary-orange)] hover:bg-[var(--primary-orange-dark)] text-white rounded-2xl font-bold shadow-[0_8px_25px_rgba(242,122,26,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <FaPlus size={14} /> Add Parent Category
        </button>
      </div>

      {/* ── STATS BADGE ────────────────────────────────────────────────────── */}
      {!fetchLoading && list.length > 0 && (
        <div className="flex items-center gap-2 mb-6">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-sm">
            <FaLayerGroup className="text-[var(--primary-orange)]" size={14} />
            <span className="text-xs font-black text-slate-600 uppercase tracking-wider">
              {list.length} Parent {list.length === 1 ? "Category" : "Categories"}
            </span>
          </div>
        </div>
      )}

      {/* ── GRID ───────────────────────────────────────────────────────────── */}
      {fetchLoading ? (
        <div className="flex justify-center items-center h-64 bg-white border border-slate-200 rounded-3xl animate-pulse text-slate-400 font-bold shadow-sm">
          Loading Parent Categories...
        </div>
      ) : list.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white border border-dashed border-slate-200 rounded-3xl text-center p-8">
          <FaLayerGroup className="text-slate-300 mb-4" size={40} />
          <p className="text-slate-400 font-bold text-sm">
            No parent categories yet
          </p>
          <p className="text-slate-300 text-xs mt-1">
            Click "Add Parent Category" to get started
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {list.map((item) => (
            <div
              key={item?._id || item?.id}
              className="group bg-white border border-slate-200 rounded-[2rem] p-6 hover:border-[var(--primary-orange)]/40 transition-all duration-400 hover:-translate-y-1.5 relative shadow-[0_10px_30px_rgba(15,23,42,0.04)] hover:shadow-[0_20px_40px_rgba(15,23,42,0.08)] overflow-hidden"
            >
              {/* Status badge */}
              <div
                className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border z-10 ${
                  item?.isActive
                    ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                    : "bg-rose-50 border-rose-200 text-rose-600"
                }`}
              >
                {item?.isActive ? "Active" : "Inactive"}
              </div>

              {/* Image - Clickable to view children */}
              <div
                onClick={() =>
                  fetchChildCategories(item?._id || item?.id, item?.name)
                }
                className="relative h-40 w-full rounded-2xl overflow-hidden mb-5 bg-slate-100 border border-slate-100 cursor-pointer group/image"
              >
                <img
                  src={getImageUrl(item)}
                  className="w-full h-full object-cover group-hover/image:scale-105 transition-transform duration-500"
                  alt={item?.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-40 group-hover/image:opacity-60 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity">
                  <FaChevronRight className="text-white" size={24} />
                </div>
              </div>

              {/* Name & description */}
              <h3 className="text-xl font-bold text-[var(--text-primary)] truncate mb-2">
                {item?.name}
              </h3>
              <p className="text-[var(--text-secondary)] text-xs leading-relaxed line-clamp-2 mb-6 h-8 font-semibold">
                {item?.description || "Top-level parent category."}
              </p>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => openEdit(item)}
                  className="flex-1 py-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-blue-600 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 font-bold text-xs"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => handleDelete(item?._id || item?.id)}
                  className="w-12 h-11 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-rose-600 rounded-xl transition-all cursor-pointer flex items-center justify-center"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── PARENT CATEGORY MODAL ─────────────────────────────────────────── */}
      {showModal && (
<div className="fixed inset-0 z-[999] overflow-y-auto bg-slate-900/40 backdrop-blur-md">
  <div className="min-h-screen flex items-start sm:items-center justify-center p-4 py-8">          <div className="w-full max-w-lg bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-[0_30px_70px_rgba(15,23,42,0.15)] relative animate-in fade-in zoom-in duration-300">
            {/* Close */}
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 text-slate-400 hover:text-[var(--text-primary)] transition-colors cursor-pointer p-1"
            >
              <FaTimes size={20} />
            </button>

            {/* Modal header */}
            <div className="mb-8 text-center">
              <div className="w-16 h-1 bg-[var(--primary-orange)] mx-auto rounded-full mb-4" />
              <h2 className="text-3xl font-black text-[var(--text-primary)]">
                {editItem ? "Update" : "New"} Parent Category
              </h2>
              <p className="text-[var(--text-secondary)] text-sm mt-1 font-semibold">
                {editItem
                  ? "Modify details of this parent category"
                  : "Create a top-level category for your store"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-[var(--text-secondary)] tracking-wider">
                  Category Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 text-[var(--text-primary)] outline-none focus:bg-white focus:border-[var(--primary-orange)] focus:ring-4 focus:ring-[var(--primary-orange)]/10 transition-all font-bold placeholder-slate-400"
                  placeholder="e.g. Fruits & Vegetables"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-[var(--text-secondary)] tracking-wider">
                  Description
                </label>
                <textarea
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 text-[var(--text-primary)] outline-none focus:bg-white focus:border-[var(--primary-orange)] focus:ring-4 focus:ring-[var(--primary-orange)]/10 transition-all font-bold placeholder-slate-400 resize-none"
                  placeholder="Brief description of this parent category..."
                />
              </div>

              {/* Status + Image */}
              <div className="grid grid-cols-2 gap-4">
                {/* Status toggle */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-[var(--text-secondary)] tracking-wider">
                    Status
                  </label>
                  <div
                    onClick={() => setIsActive(!isActive)}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-2xl border cursor-pointer transition-all ${
                      isActive
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                        : "bg-rose-50 border-rose-200 text-rose-700"
                    }`}
                  >
                    <span className="text-xs font-extrabold uppercase tracking-wide">
                      {isActive ? "Active" : "Inactive"}
                    </span>
                    {isActive ? (
                      <FaCheckCircle size={14} />
                    ) : (
                      <FaMinusCircle size={14} />
                    )}
                  </div>
                </div>

                {/* Image upload */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-[var(--text-secondary)] tracking-wider">
                    Cover Image
                  </label>
                  <div
                    onClick={() => fileRef.current.click()}
                    className="flex items-center justify-center h-[52px] bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-[var(--primary-orange)] hover:border-[var(--primary-orange)] transition-all cursor-pointer overflow-hidden"
                  >
                    {preview ? (
                      <img
                        src={preview}
                        className="w-full h-full object-cover"
                        alt="preview"
                      />
                    ) : (
                      <FaUpload />
                    )}
                  </div>
                  <input
                    ref={fileRef}
                    type="file"
                    className="hidden"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-[var(--primary-orange)] hover:bg-[var(--primary-orange-dark)] text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-[0_8px_25px_rgba(242,122,26,0.2)] hover:-translate-y-0.5 transition-all disabled:opacity-50 cursor-pointer mt-4"
              >
                {loading
                  ? "Saving..."
                  : editItem
                  ? "Update Category"
                  : "Create Parent Category"}
              </button>
            </form>
          </div>
        </div>
        </div>
      )}

      {/* ── CHILD CATEGORIES MODAL ────────────────────────────────────────── */}
      {showChildModal && (
        <div className="fixed inset-0 z-[998] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="w-full max-w-4xl bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-[0_30px_70px_rgba(15,23,42,0.15)] relative animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
            {/* Close */}
            <button
              onClick={closeChildModal}
              className="absolute top-6 right-6 text-slate-400 hover:text-[var(--text-primary)] transition-colors cursor-pointer p-1 z-10"
            >
              <FaTimes size={20} />
            </button>

            {/* Back button */}
            <button
              onClick={closeChildModal}
              className="flex items-center gap-2 text-[var(--primary-orange)] hover:text-[var(--primary-orange-dark)] font-bold text-sm mb-6 transition-colors"
            >
              <FaArrowLeft size={14} /> Back to Parent Categories
            </button>

            {/* Header */}
            <div className="mb-8">
              <div className="w-16 h-1 bg-[var(--primary-orange)] rounded-full mb-4" />
              <h2 className="text-3xl font-black text-[var(--text-primary)]">
                {selectedParent?.name}
              </h2>
              <p className="text-[var(--text-secondary)] text-sm mt-2 font-semibold">
                Child categories under this parent category
              </p>
            </div>

            {/* Child Categories Grid */}
            {childLoading ? (
              <div className="flex justify-center items-center h-40 text-slate-400 font-bold">
                Loading categories...
              </div>
            ) : childCategories.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <FaLayerGroup className="text-slate-300 mb-3" size={32} />
                <p className="text-slate-400 font-bold text-sm">
                  No child categories found
                </p>
                <p className="text-slate-300 text-xs mt-1">
                  Add categories to this parent category
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {childCategories.map((category) => (
                  <div
                    key={category?._id || category?.id}
                    className="group bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl p-5 hover:border-[var(--primary-orange)]/40 hover:shadow-lg transition-all duration-300"
                  >
                    {/* Status badge */}
                    <div
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-3 ${
                        category?.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {category?.isActive ? "✓ Active" : "✕ Inactive"}
                    </div>

                    {/* Image */}
                    <div className="relative h-32 w-full rounded-xl overflow-hidden mb-3 bg-slate-100 border border-slate-200">
                      <img
                        src={getImageUrl(category)}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        alt={category?.name}
                      />
                    </div>

                    {/* Name & description */}
                    <h3 className="text-lg font-bold text-[var(--text-primary)] truncate mb-1">
                      {category?.name}
                    </h3>
                    <p className="text-[var(--text-secondary)] text-xs line-clamp-2 mb-4 font-semibold">
                      {category?.description || "No description"}
                    </p>

                    {/* Meta info */}
                    <div className="text-[10px] text-slate-400 font-bold mb-3">
                      ID: {category?._id?.slice(-8)}
                    </div>
                  </div>
                 
                ))}
              </div>
             
            )}

          </div>
        </div>
        
      )}
    </div>
  );
};

export default ParentCategories;