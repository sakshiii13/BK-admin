import React, { useEffect, useRef, useState } from "react";
import { FaPlus, FaEdit, FaTimes, FaUpload, FaPowerOff } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import { showSuccess, showError, showConfirm } from "../../../utils/alertService";
import TableComponent from "../../../components/global/TableComponent";

import {
  createSubCategoryApi,
  getAllCategoriesApi,
  getAllSubCategoriesApi,
  updateSubCategoryApi,
  toggleSubCategoryStatusApi,
} from "../../../api/category.api";

const SubCategories = () => {
  const fileRef = useRef(null);
  const dispatch = useDispatch();

  const [subcats, setSubcats]       = useState([]);
  const [categories, setCategories] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId]         = useState(null);
  const [loading, setLoading]       = useState(false);

  const [name, setName]             = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory]     = useState("");
  const [image, setImage]           = useState(null);
  const [preview, setPreview]       = useState(null);

  const getImageUrl = (item) => {
    const img = item?.image || item?.imageUrl || item?.thumbnail;
    if (!img) return "/logo.png";
    if (typeof img === "string") {
      if (img.startsWith("http")) return img;
      return `http://192.168.29.96:5000${img.startsWith("/") ? "" : "/"}${img}`;
    }
    return "/logo.png";
  };

  const fetchCategories = async () => {
    try {
      const response = await getAllCategoriesApi(1, 100);
      if (response?.success) setCategories(response?.data || []);
    } catch (error) {
      console.error("Fetch Categories Error:", error);
    }
  };

  const fetchSubCategories = async () => {
    try {
      setFetchLoading(true);
      const response = await getAllSubCategoriesApi({ page: 1, limit: 100 });
      if (response?.success) setSubcats(response?.data || []);
      else setSubcats([]);
    } catch {
      showError("Failed to load sub categories");
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  const resetForm = () => {
    setName(""); setDescription(""); setCategory("");
    setImage(null); setPreview(null);
    setIsEditMode(false); setEditId(null);
    if (fileRef.current) fileRef.current.value = "";
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

  const handleEdit = (item) => {
    setIsEditMode(true);
    setEditId(item?._id);
    setName(item?.name || "");
    setDescription(item?.description || "");
    const catId = typeof item?.category === "object" ? item?.category?._id : item?.category;
    setCategory(catId || "");
    setPreview(getImageUrl(item));
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !description.trim() || !category) return showError("All fields are required");

    try {
      setLoading(true);
      dispatch(showLoader());

      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("description", description.trim());
      formData.append("category", category);
      if (image) formData.append("image", image);

      const response = isEditMode
        ? await updateSubCategoryApi(editId, formData)
        : await createSubCategoryApi(formData);

      if (response?.success) {
        setShowModal(false);
        const result = await showSuccess(response?.message || "Saved successfully");
        if (result.isConfirmed || result.isDismissed) {
          resetForm();
          await fetchSubCategories();
        }
      } else {
        dispatch(hideLoader());
        showError(response?.message || "Operation failed");
      }
    } catch {
      dispatch(hideLoader());
      showError("Something went wrong while saving");
    } finally {
      setLoading(false);
      dispatch(hideLoader());
    }
  };

  const handleToggleStatus = async (id) => {
    const confirm = await showConfirm({
      title: "Change Status?",
      text: "Toggle visibility for this sub-category?",
    });
    if (confirm.isConfirmed) {
      try {
        dispatch(showLoader());
        const response = await toggleSubCategoryStatusApi(id);
        if (response?.success) {
          await showSuccess("Status updated successfully");
          fetchSubCategories();
        }
      } catch {
        showError("Update failed");
      } finally {
        dispatch(hideLoader());
      }
    }
  };

  const COLUMNS = [
    {
      key: "name",
      label: "Sub Category Info",
      render: (val, row) => (
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 shrink-0">
            <img src={getImageUrl(row)} className="w-full h-full object-cover" alt={val} />
          </div>
          <div>
            <p className="font-bold text-[#0f172a] text-sm">{val || "N/A"}</p>
            <p className="text-[#64748b] text-xs font-semibold mt-0.5 line-clamp-1 max-w-xs">
              {row?.description || "No description provided."}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      label: "Parent Category",
      render: (val) => (
        <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider text-[#ff7e00] bg-orange-50 border border-orange-100/50">
          {val?.name || "No Category"}
        </span>
      ),
    },
    {
      key: "isActive",
      label: "Status",
      render: (val) => (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border ${val !== false ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "bg-rose-50 border-rose-200 text-rose-600"}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${val !== false ? "bg-emerald-500" : "bg-rose-500"}`} />
          {val !== false ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "_id",
      label: "Actions",
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleEdit(row)}
            className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-blue-600 rounded-xl transition-all cursor-pointer"
            title="Edit"
          >
            <FaEdit size={13} />
          </button>
          <button
            type="button"
            onClick={() => handleToggleStatus(val)}
            className={`p-3 rounded-xl border transition-all cursor-pointer ${row?.isActive !== false ? "bg-rose-50 border-rose-100 text-rose-500 hover:bg-rose-100" : "bg-emerald-50 border-emerald-100 text-emerald-500 hover:bg-emerald-100"}`}
            title="Toggle Status"
          >
            <FaPowerOff size={13} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-[#f8fafc]">

      <TableComponent
        title={<div className="text-3xl">Sub <span className="text-[#ff7e00] text-3xl">Categories</span></div>}
        subtitle="Manage products into specialized sub-groups"
        columns={COLUMNS}
        data={subcats}
        loading={fetchLoading}
        showSearch={true}
        showIndex={true}
        searchPlaceholder="Search sub categories..."
        addButtonText="Add Sub Category"
        onAdd={() => { resetForm(); setShowModal(true); }}
        onRefresh={fetchSubCategories}
      />

      {/* MODAL */}
      {showModal && (
<div className="fixed inset-0 z-[999] overflow-y-auto bg-slate-900/40 backdrop-blur-md">
  <div className="min-h-screen flex items-start sm:items-center justify-center p-4 py-8">          <div className="w-full max-w-lg bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-2xl relative">

            <button type="button" onClick={closeModal} className="absolute top-6 right-6 text-slate-400 hover:text-[#0f172a] cursor-pointer p-1">
              <FaTimes size={20} />
            </button>

            <h2 className="text-3xl font-black text-[#0f172a] text-center mb-8">
              {isEditMode ? "Update" : "New"} Sub Category
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-[#64748b] tracking-wider pl-1">Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-[#0f172a] outline-none focus:bg-white focus:border-[#ff7e00] focus:ring-4 focus:ring-[#ff7e00]/10 font-bold placeholder-slate-400"
                  placeholder="e.g. Lipsticks" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-[#64748b] tracking-wider pl-1">Parent Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:bg-white focus:border-[#ff7e00] focus:ring-4 focus:ring-[#ff7e00]/10 font-bold cursor-pointer text-slate-700">
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat?._id} value={cat?._id}>{cat?.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-[#64748b] tracking-wider pl-1">Description</label>
                <textarea rows="3" value={description} onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-[#0f172a] outline-none focus:bg-white focus:border-[#ff7e00] focus:ring-4 focus:ring-[#ff7e00]/10 font-bold resize-none placeholder-slate-400"
                  placeholder="Details..." />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-[#64748b] tracking-wider pl-1">Sub Category Image</label>
                <div onClick={() => fileRef.current.click()}
                  className="flex items-center justify-center h-28 bg-slate-50 border border-dashed border-slate-300 rounded-2xl cursor-pointer overflow-hidden hover:border-[#ff7e00]">
                  {preview
                    ? <img src={preview} className="h-full w-full object-cover" alt="preview" />
                    : <FaUpload className="text-slate-400 text-2xl" />}
                  <input ref={fileRef} type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-5 bg-[#ff7e00] hover:bg-[#e06f00] text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-lg transition-all disabled:opacity-50 mt-4 cursor-pointer">
                {loading ? "Processing..." : isEditMode ? "Confirm Changes" : "Create Sub Category"}
              </button>
            </form>
          </div>
        </div>
        
        </div>
      )}
    </div>
  );
};

export default SubCategories;