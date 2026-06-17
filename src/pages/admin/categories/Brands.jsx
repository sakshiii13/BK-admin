import React, { useEffect, useRef, useState } from "react";
import { FaTags, FaEdit, FaTimes, FaUpload } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import { showSuccess, showError, showConfirm } from "../../../utils/alertService";
import TableComponent from "../../../components/global/TableComponent";

import {
  createBrandApi,
  getAllBrandsApi,
  updateBrandApi,
} from "../../../api/category.api";

const Brands = () => {
  const fileRef = useRef(null);
  const dispatch = useDispatch();

  const [brands, setBrands]         = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [showModal, setShowModal]   = useState(false);
  const [editBrand, setEditBrand]   = useState(null);
  const [loading, setLoading]       = useState(false);

  const [name, setName]             = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage]           = useState(null);
  const [preview, setPreview]       = useState(null);

  const fetchBrands = async () => {
    try {
      setFetchLoading(true);
      dispatch(showLoader());
      const response = await getAllBrandsApi({ page: 1, limit: 50 });
      if (response?.success) setBrands(response?.data || []);
      else { setBrands([]); showError(response?.message || "Failed to fetch brands"); }
    } catch (error) {
      setBrands([]);
      showError(error?.message || "Something went wrong while fetching brands");
    } finally {
      setFetchLoading(false);
      dispatch(hideLoader());
    }
  };

  useEffect(() => { fetchBrands(); }, []);

  const resetForm = () => {
    setName(""); setDescription(""); setImage(null); setPreview(null); setEditBrand(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const closeModal = () => { setShowModal(false); setTimeout(resetForm, 300); };

  const openEditModal = (brand) => {
    setEditBrand(brand);
    setName(brand?.name || "");
    setDescription(brand?.description || "");
    setPreview(brand?.image || null);
    setImage(null);
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { showError("Please select image only"); return; }
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmitBrand = async (e) => {
    e.preventDefault();
    if (!name.trim()) { showError("Brand name is required"); return; }
    try {
      setLoading(true);
      dispatch(showLoader());
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("description", description.trim());
      if (image) formData.append("image", image);

      const brandId  = editBrand?._id || editBrand?.id;
      const response = editBrand
        ? await updateBrandApi(brandId, formData)
        : await createBrandApi(formData);

      if (response?.success) {
        setShowModal(false);
        const result = await showSuccess(response?.message || (editBrand ? "Brand updated successfully" : "Brand created successfully"));
        if (result.isConfirmed || result.isDismissed) { resetForm(); fetchBrands(); }
      } else {
        showError(response?.message || "Failed to save brand");
      }
    } catch (error) {
      showError(error?.message || "Something went wrong while saving brand");
    } finally {
      setLoading(false);
      dispatch(hideLoader());
    }
  };

  // const handleDelete = async (id) => {
  //   const result = await showConfirm({
  //     title: "Delete Brand?",
  //     text: "Are you sure you want to delete this brand permanently?",
  //     confirmButtonText: "Yes, Delete",
  //   });
  //   if (!result.isConfirmed) return;
  //   try {
  //     dispatch(showLoader());
  //     await new Promise((r) => setTimeout(r, 500));
  //     setBrands((prev) => prev.filter((item) => item?._id !== id));
  //     await showSuccess("Brand deleted successfully");
  //   } catch {
  //     showError("Failed to delete brand");
  //   } finally {
  //     dispatch(hideLoader());
  //   }
  // };

  const COLUMNS = [
    {
      key: "name",
      label: "Brand Details",
      render: (val, row) => (
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 shrink-0 flex items-center justify-center">
            {row?.image
              ? <img src={row.image} alt={val} className="h-full w-full object-cover" />
              : <FaTags className="text-[#ff7e00] text-lg" />}
          </div>
          <p className="font-bold text-[#0f172a] text-sm">{val || "N/A"}</p>
        </div>
      ),
    },
    {
      key: "description",
      label: "Description",
      render: (val) => (
        <p className="text-slate-500 text-sm font-semibold line-clamp-1 max-w-xs">
          {val || "No description provided."}
        </p>
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
            onClick={() => openEditModal(row)}
            className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-blue-600 rounded-xl transition-all cursor-pointer"
            title="Edit"
          >
            <FaEdit size={13} />
          </button>
          <button
            type="button"
            onClick={() => handleDelete(val)}
            className="p-3 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-rose-600 rounded-xl transition-all cursor-pointer"
            title="Delete"
          >
            {/* <FaTrash size={13} /> */}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-[#f8fafc]">

      <TableComponent
        title={<div className="text-3xl">Product <span className="text-[#ff7e00] text-3xl">Brands</span></div>}
        subtitle={<p className="text-[15px]">Manage product brands, suppliers and active logistics</p>}
        columns={COLUMNS}
        data={brands}
        loading={fetchLoading}
        showSearch={true}
        showIndex={true}
        searchPlaceholder="Search brands..."
        addButtonText="Add Brand"
        onAdd={() => { resetForm(); setShowModal(true); }}
        onRefresh={fetchBrands}
      />

      {/* MODAL */}
      {showModal && (
<div className="fixed inset-0 z-[999] overflow-y-auto bg-slate-900/40 backdrop-blur-md">
  <div className="min-h-screen flex items-start sm:items-center justify-center p-4 py-8">          <div className="w-full max-w-lg bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-2xl relative">

            <button type="button" onClick={closeModal} className="absolute top-6 right-6 text-slate-400 hover:text-[#0f172a] cursor-pointer p-1">
              <FaTimes size={20} />
            </button>

            <h2 className="text-3xl font-black text-[#0f172a] text-center mb-8">
              {editBrand ? "Update" : "New"} Brand
            </h2>

            <form onSubmit={handleSubmitBrand} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-[#64748b] tracking-wider pl-1">Brand Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-[#0f172a] outline-none focus:bg-white focus:border-[#ff7e00] focus:ring-4 focus:ring-[#ff7e00]/10 font-bold placeholder-slate-400"
                  placeholder="e.g. Organic Farms" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-[#64748b] tracking-wider pl-1">Description</label>
                <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-[#0f172a] outline-none focus:bg-white focus:border-[#ff7e00] focus:ring-4 focus:ring-[#ff7e00]/10 font-bold resize-none placeholder-slate-400"
                  placeholder="Details about active brand products..." />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-[#64748b] tracking-wider pl-1">Brand Logo / Image</label>
                <div onClick={() => fileRef.current?.click()}
                  className="flex items-center justify-center h-28 bg-slate-50 border border-dashed border-slate-300 rounded-2xl cursor-pointer overflow-hidden hover:border-[#ff7e00] transition-colors">
                  {preview
                    ? <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                    : <div className="text-center">
                        <FaUpload className="text-slate-400 text-2xl mx-auto mb-1" />
                        <span className="text-xs font-semibold text-slate-500">Upload brand asset</span>
                      </div>}
                  <input ref={fileRef} type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-5 bg-[#ff7e00] hover:bg-[#e06f00] text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-lg transition-all disabled:opacity-50 mt-4 cursor-pointer">
                {loading ? "Processing..." : editBrand ? "Confirm Changes" : "Create Brand"}
              </button>
            </form>
          </div>
        </div>
        </div>
      )}
    </div>
  );
};

export default Brands;