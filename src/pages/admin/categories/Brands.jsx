import React, { useEffect, useRef, useState } from "react";
import {
  FaTags,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaUpload,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import { showSuccess, showError, showConfirm } from "../../../utils/alertService";

import {
  createBrandApi,
  getAllBrandsApi,
  updateBrandApi,
} from "../../../api/category.api";

const Brands = () => {
  const fileRef = useRef(null);
  const dispatch = useDispatch();

  const [brands, setBrands] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editBrand, setEditBrand] = useState(null);

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const fetchBrands = async () => {
    try {
      setFetchLoading(true);
      dispatch(showLoader());

      const response = await getAllBrandsApi({
        page: 1,
        limit: 50, // Fetches a larger chunk for smooth scrolling
      });

      if (response?.success) {
        setBrands(response?.data || []);
      } else {
        setBrands([]);
        showError(response?.message || "Failed to fetch brands");
      }
    } catch (error) {
      console.log("FETCH BRAND ERROR 👉", error);
      setBrands([]);
      showError(error?.message || "Something went wrong while fetching brands");
    } finally {
      setFetchLoading(false);
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const resetForm = () => {
    setName("");
    setDescription("");
    setImage(null);
    setPreview(null);
    setEditBrand(null);

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (brand) => {
    setEditBrand(brand);
    setName(brand?.name || "");
    setDescription(brand?.description || "");
    setPreview(brand?.image || null);
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

    if (!file.type.startsWith("image/")) {
      showError("Please select image only");
      return;
    }

    setImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitBrand = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      showError("Brand name is required");
      return;
    }

    try {
      setLoading(true);
      dispatch(showLoader());

      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("description", description.trim());

      if (image) {
        formData.append("image", image);
      }

      const brandId = editBrand?._id || editBrand?.id;

      const response = editBrand
        ? await updateBrandApi(brandId, formData)
        : await createBrandApi(formData);

      if (response?.success) {
        setShowModal(false);
        // Safely wait for success alert closure
        const result = await showSuccess(
          response?.message ||
            (editBrand
              ? "Brand updated successfully"
              : "Brand created successfully")
        );

        if (result.isConfirmed || result.isDismissed) {
          resetForm();
          fetchBrands();
        }
      } else {
        showError(response?.message || "Failed to save brand");
      }
    } catch (error) {
      console.log("SAVE BRAND ERROR 👉", error);
      showError(error?.message || "Something went wrong while saving brand");
    } finally {
      setLoading(false);
      dispatch(hideLoader());
    }
  };

  const handleDelete = async (id) => {
    const result = await showConfirm({
      title: "Delete Brand?",
      text: "Are you sure you want to delete this brand permanently?",
      confirmButtonText: "Yes, Delete"
    });

    if (!result.isConfirmed) return;

    try {
      dispatch(showLoader());
      // Simulate quick action loader
      await new Promise(resolve => setTimeout(resolve, 500));
      setBrands((prev) => prev.filter((item) => item?._id !== id));
      await showSuccess("Brand deleted successfully");
    } catch (err) {
      showError("Failed to delete brand");
    } finally {
      dispatch(hideLoader());
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen font-sans antialiased bg-[#f8fafc] text-[#1e293b]">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-10 gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#0f172a] tracking-tight">
            Product <span className="text-[#ff7e00]">Brands</span>
          </h1>
          <p className="text-[#64748b] text-xs sm:text-sm font-semibold mt-1">
            Manage product brands, suppliers and active logistics
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="w-full md:w-auto px-6 sm:px-8 py-3.5 bg-[#ff7e00] hover:bg-[#e06f00] text-white rounded-2xl font-bold shadow-[0_8px_25px_rgba(255,126,0,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <FaPlus size={14} /> Add Brand
        </button>
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-white border border-slate-200 rounded-[2rem] shadow-[0_10px_30px_rgba(15,23,42,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-xs font-bold uppercase tracking-wider text-slate-500">
                <th className="p-5 pl-8">Brand Details</th>
                <th className="p-5">Description</th>
                <th className="p-5 text-center">Status</th>
                <th className="p-5 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {fetchLoading ? (
                <tr>
                  <td colSpan="4" className="p-10 text-center text-slate-400 font-semibold animate-pulse">
                    Loading brands...
                  </td>
                </tr>
              ) : brands.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-10 text-center text-slate-400 font-semibold">
                    No brands found in index.
                  </td>
                </tr>
              ) : (
                brands.map((brand) => (
                  <tr key={brand?._id} className="hover:bg-slate-50/50 transition-colors">
                    {/* BRAND INFO */}
                    <td className="p-5 pl-8">
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 shadow-sm shrink-0">
                          {brand?.image ? (
                            <img
                              src={brand?.image}
                              alt={brand?.name || "Brand"}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <FaTags className="text-[#ff7e00] text-lg" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-[#0f172a] text-base">{brand?.name || "N/A"}</p>
                        </div>
                      </div>
                    </td>

                    {/* DESCRIPTION */}
                    <td className="p-5">
                      <p className="text-[#64748b] text-sm font-semibold line-clamp-1 max-w-sm">
                        {brand?.description || "No description provided."}
                      </p>
                    </td>

                    {/* STATUS */}
                    <td className="p-5 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border ${brand?.isActive !== false ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-rose-50 border-rose-200 text-rose-600'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${brand?.isActive !== false ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        {brand?.isActive !== false ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="p-5 text-center">
                      <div className="flex justify-center items-center gap-3">
                        <button
                          type="button"
                          onClick={() => openEditModal(brand)}
                          className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-blue-600 rounded-xl transition-all cursor-pointer flex items-center justify-center font-bold"
                          title="Edit"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(brand?._id)}
                          className="p-3 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-rose-600 rounded-xl transition-all cursor-pointer flex items-center justify-center font-bold"
                          title="Delete"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL SECTION */}
      {showModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="w-full max-w-lg bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-2xl relative animate-in fade-in zoom-in duration-300">
            <button
              type="button"
              onClick={closeModal}
              className="absolute top-6 right-6 text-slate-400 hover:text-[#0f172a] cursor-pointer p-1"
            >
              <FaTimes size={20} />
            </button>

            <h2 className="text-3xl font-black text-[#0f172a] text-center mb-8">
              {editBrand ? "Update" : "New"} Brand
            </h2>

            <form onSubmit={handleSubmitBrand} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-[#64748b] tracking-wider pl-1">
                  Brand Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-[#0f172a] outline-none focus:bg-white focus:border-[#ff7e00] focus:ring-4 focus:ring-[#ff7e00]/10 font-bold placeholder-slate-400"
                  placeholder="e.g. Organic Farms"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-[#64748b] tracking-wider pl-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-[#0f172a] outline-none focus:bg-white focus:border-[#ff7e00] focus:ring-4 focus:ring-[#ff7e00]/10 font-bold resize-none placeholder-slate-400"
                  placeholder="Details about active brand products..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-[#64748b] tracking-wider pl-1">
                  Brand Logo / Image
                </label>
                <div
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center justify-center h-28 bg-slate-50 border border-dashed border-slate-300 rounded-2xl cursor-pointer overflow-hidden hover:border-[#ff7e00] transition-colors"
                >
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <FaUpload className="text-slate-400 text-2xl mx-auto mb-1" />
                      <span className="text-xs font-semibold text-slate-500">Upload brand asset</span>
                    </div>
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    className="hidden"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-[#ff7e00] hover:bg-[#e06f00] text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-lg transition-all disabled:opacity-50 mt-4 cursor-pointer"
              >
                {loading ? "Processing..." : editBrand ? "Confirm Changes" : "Create Brand"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Brands;