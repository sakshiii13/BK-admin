import React, { useEffect, useRef, useState } from "react";
import {
  FaTags,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaUpload,
} from "react-icons/fa";
import Swal from "sweetalert2";

import {
  createBrandApi,
  getAllBrandsApi,
  updateBrandApi,
} from "../../../api/category.api";

const Brands = () => {
  const fileRef = useRef(null);

  const [brands, setBrands] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editBrand, setEditBrand] = useState(null);

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const showSuccess = (message) => {
    Swal.fire({
      html: `
        <div style="padding:12px 6px;">
          <div style="
            width:92px;height:92px;margin:0 auto 18px;border-radius:30px;
            background:linear-gradient(135deg,#f97316,#fb923c);
            display:flex;align-items:center;justify-content:center;
            box-shadow:0 18px 45px rgba(249,115,22,0.45);
          ">
            <span style="font-size:44px;color:white;font-weight:900;">✓</span>
          </div>

          <h2 style="color:white;font-size:30px;font-weight:900;margin-bottom:10px;">
            Success!
          </h2>

          <p style="color:#cbd5e1;font-size:15px;line-height:24px;">
            ${message}
          </p>
        </div>
      `,
      showConfirmButton: true,
      confirmButtonText: "Awesome ✨",
      background:
        "linear-gradient(145deg, rgba(16,24,38,0.98), rgba(10,15,28,0.98))",
      backdrop: "rgba(0,0,0,0.75)",
      customClass: {
        popup: "rounded-[32px] border border-white/10 shadow-2xl",
        confirmButton:
          "rounded-2xl bg-orange-500 px-8 py-3 text-sm font-bold text-white shadow-lg hover:bg-orange-400",
      },
      buttonsStyling: false,
    });
  };

  const showError = (message) => {
    Swal.fire({
      html: `
        <div style="padding:12px 6px;">
          <div style="
            width:92px;height:92px;margin:0 auto 18px;border-radius:30px;
            background:linear-gradient(135deg,#ef4444,#f87171);
            display:flex;align-items:center;justify-content:center;
            box-shadow:0 18px 45px rgba(239,68,68,0.45);
          ">
            <span style="font-size:44px;color:white;font-weight:900;">!</span>
          </div>

          <h2 style="color:white;font-size:30px;font-weight:900;margin-bottom:10px;">
            Oops!
          </h2>

          <p style="color:#cbd5e1;font-size:15px;line-height:24px;">
            ${message}
          </p>
        </div>
      `,
      showConfirmButton: true,
      confirmButtonText: "Try Again",
      background:
        "linear-gradient(145deg, rgba(16,24,38,0.98), rgba(10,15,28,0.98))",
      backdrop: "rgba(0,0,0,0.75)",
      customClass: {
        popup: "rounded-[32px] border border-white/10 shadow-2xl",
        confirmButton:
          "rounded-2xl bg-red-500 px-8 py-3 text-sm font-bold text-white shadow-lg hover:bg-red-400",
      },
      buttonsStyling: false,
    });
  };

  const fetchBrands = async () => {
    try {
      setFetchLoading(true);

      const response = await getAllBrandsApi({
        page: 1,
        limit: 10,
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
    resetForm();
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
        showSuccess(
          response?.message ||
            (editBrand
              ? "Brand updated successfully"
              : "Brand created successfully")
        );

        closeModal();
        fetchBrands();
      } else {
        showError(response?.message || "Failed to save brand");
      }
    } catch (error) {
      console.log("SAVE BRAND ERROR 👉", error);
      showError(error?.message || "Something went wrong while saving brand");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      html: `
        <div style="padding:12px 6px;">
          <div style="
            width:92px;height:92px;margin:0 auto 18px;border-radius:30px;
            background:linear-gradient(135deg,#ef4444,#f97316);
            display:flex;align-items:center;justify-content:center;
            box-shadow:0 18px 45px rgba(239,68,68,0.45);
          ">
            <span style="font-size:44px;color:white;font-weight:900;">?</span>
          </div>

          <h2 style="color:white;font-size:30px;font-weight:900;margin-bottom:10px;">
            Delete Brand?
          </h2>

          <p style="color:#cbd5e1;font-size:15px;line-height:24px;">
            This action cannot be undone.
          </p>
        </div>
      `,
      background:
        "linear-gradient(145deg, rgba(16,24,38,0.98), rgba(10,15,28,0.98))",
      backdrop: "rgba(0,0,0,0.75)",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "rounded-[32px] border border-white/10 shadow-2xl",
        confirmButton:
          "rounded-2xl bg-red-500 px-7 py-3 text-sm font-bold text-white shadow-lg hover:bg-red-400",
        cancelButton:
          "ml-3 rounded-2xl bg-slate-600 px-7 py-3 text-sm font-bold text-white shadow-lg hover:bg-slate-500",
      },
      buttonsStyling: false,
    });

    if (!result.isConfirmed) return;

    setBrands((prev) => prev.filter((item) => item?._id !== id));
    showSuccess("Brand deleted successfully");
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Brands</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Manage product brands and suppliers
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 px-4 py-2 font-medium text-white shadow-lg transition-all hover:scale-[1.02]"
        >
          <FaPlus /> Add Brand
        </button>
      </div>

      {fetchLoading ? (
        <div className="rounded-2xl border border-white/10 bg-[var(--card-bg)] p-8 text-center text-gray-400">
          Loading brands...
        </div>
      ) : brands.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[var(--card-bg)] p-8 text-center text-gray-400">
          No brands found
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {brands.map((brand) => (
            <div
              key={brand?._id}
              className="glass group flex items-center justify-between rounded-2xl border border-white/10 p-5 shadow-xl"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-[var(--card-bg)]">
                  {brand?.image ? (
                    <img
                      src={brand?.image}
                      alt={brand?.name || "Brand"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <FaTags className="text-orange-400" />
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-white">
                    {brand?.name || "N/A"}
                  </h3>

                  <p className="mt-1 text-xs text-gray-400">
                    {brand?.description || "No description"}
                  </p>

                  <p
                    className={`mt-1 text-xs font-semibold ${
                      brand?.isActive ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {brand?.isActive ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => openEditModal(brand)}
                  className="text-blue-400 hover:text-blue-300"
                >
                  <FaEdit />
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(brand?._id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#101826] p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {editBrand ? "Update Brand" : "Add Brand"}
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                  {editBrand ? "Update brand details" : "Create new brand"}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="text-gray-400 hover:text-white"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmitBrand} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Brand Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Parle"
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-white outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Description
                </label>

                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brand description"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-300">
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
                  onClick={() => fileRef.current?.click()}
                  className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/10 p-5"
                >
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="h-40 w-full rounded-xl object-cover"
                    />
                  ) : (
                    <>
                      <FaUpload className="text-3xl text-orange-400" />

                      <p className="mt-2 text-sm text-gray-400">
                        Click to upload image
                      </p>
                    </>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 font-bold text-white disabled:opacity-60"
              >
                {loading
                  ? editBrand
                    ? "Updating..."
                    : "Creating..."
                  : editBrand
                  ? "Update Brand"
                  : "Create Brand"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Brands;