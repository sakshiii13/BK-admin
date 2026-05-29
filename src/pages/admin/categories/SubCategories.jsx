import React, { useEffect, useRef, useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTimes,
  FaUpload,
  FaPowerOff,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import { showSuccess, showError, showConfirm } from "../../../utils/alertService";

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

  const [subcats, setSubcats] = useState([]);
  const [categories, setCategories] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const fetchCategories = async () => {
    try {
      dispatch(showLoader());
      const response = await getAllCategoriesApi(1, 100);

      if (response?.success) {
        setCategories(response?.data || []);
      } else {
        showError(response?.message || "Failed to fetch categories");
      }
    } catch (error) {
      showError(error?.message || "Something went wrong while fetching categories");
    } finally {
      dispatch(hideLoader());
    }
  };

  const fetchSubCategories = async () => {
    try {
      setFetchLoading(true);
      dispatch(showLoader());

      const response = await getAllSubCategoriesApi({
        page: 1,
        limit: 10,
      });

      console.log("SUB CATEGORY RESPONSE 👉", response);

      if (response?.success) {
        setSubcats(response?.data || []);
      } else {
        setSubcats([]);
        showError(response?.message || "Failed to fetch sub categories");
      }
    } catch (error) {
      showError(error?.message || "Something went wrong while fetching subcategories");
    } finally {
      setFetchLoading(false);
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  const resetForm = () => {
    setName("");
    setDescription("");
    setCategory("");
    setImage(null);
    setPreview(null);
    setIsEditMode(false);
    setEditId(null);

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const openCreateModal = () => {
    resetForm();
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

  const handleEdit = (item) => {
    setIsEditMode(true);
    setEditId(item?._id);

    setName(item?.name || "");
    setDescription(item?.description || "");

    const categoryId =
      typeof item?.category === "object" ? item?.category?._id : item?.category;

    setCategory(categoryId || "");
    setImage(null);
    setPreview(item?.image || null);

    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !description.trim() || !category) {
      showError("Name, description and category are required");
      return;
    }

    if (!isEditMode && !image) {
      showError("Image is required");
      return;
    }

    try {
      setLoading(true);
      dispatch(showLoader());

      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("description", description.trim());
      formData.append("category", category);

      if (image) {
        formData.append("image", image);
      }

      let response;

      if (isEditMode) {
        response = await updateSubCategoryApi(editId, formData);
      } else {
        response = await createSubCategoryApi(formData);
      }

      console.log("SUB CATEGORY SAVE RESPONSE 👉", response);

      if (response?.success) {
        dispatch(hideLoader());
        await showSuccess(
          response?.message ||
            `Sub category ${isEditMode ? "updated" : "created"} successfully`
        );

        closeModal();
        fetchSubCategories();
      } else {
        dispatch(hideLoader());
        showError(response?.message || "Something went wrong");
      }
    } catch (error) {
      dispatch(hideLoader());
      showError(error?.message || "Failed to save sub category");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    const confirmToggle = await showConfirm({
      title: "Change Status?",
      text: "Are you sure you want to change this sub category status?",
      confirmButtonText: "Yes, Change"
    });

    if (!confirmToggle.isConfirmed) return;

    try {
      dispatch(showLoader());
      const response = await toggleSubCategoryStatusApi(id);

      if (response?.success) {
        dispatch(hideLoader());
        await showSuccess(response?.message || "Status updated successfully");
        fetchSubCategories();
      } else {
        dispatch(hideLoader());
        showError(response?.message || "Failed to update status");
      }
    } catch (error) {
      dispatch(hideLoader());
      showError(error?.message || "Something went wrong");
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div> 
          <h1 className="text-2xl font-bold text-white">Sub Categories</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Organize products into sub-groups
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 px-4 py-2 font-medium text-white shadow-lg transition-all hover:scale-[1.02]"
        >
          <FaPlus /> Add Sub Category
        </button>
      </div>

      <div className="glass overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-white/10 bg-[var(--card-bg)]/50">
              <th className="p-4 text-sm font-semibold text-gray-400">
                Sub Category Name
              </th>
              <th className="p-4 text-sm font-semibold text-gray-400">
                Parent Category
              </th>
              <th className="p-4 text-sm font-semibold text-gray-400">
                Status
              </th>
              <th className="p-4 text-sm font-semibold text-gray-400">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {fetchLoading ? (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-400">
                  Loading sub categories...
                </td>
              </tr>
            ) : subcats.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-400">
                  No sub categories found
                </td>
              </tr>
            ) : (
              subcats.map((item) => (
                <tr
                  key={item?._id}
                  className="border-b border-white/5 transition-colors hover:bg-white/5"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item?.image || "/logo.png"}
                        alt={item?.name || "Sub Category"}
                        className="h-11 w-11 rounded-lg object-cover"
                      />

                      <div>
                        <p className="font-medium text-white">
                          {item?.name || "N/A"}
                        </p>

                        <p className="text-xs text-gray-400">
                          {item?.description || "No description"}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 text-gray-300">
                    <span className="rounded-md bg-white/10 px-2 py-1 text-xs">
                      {item?.category?.name || "N/A"}
                    </span>
                  </td>

                  <td className="p-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        item?.isActive === false
                          ? "bg-red-500/10 text-red-400"
                          : "bg-green-500/10 text-green-400"
                      }`}
                    >
                      {item?.isActive === false ? "Inactive" : "Active"}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => handleEdit(item)}
                        className="text-blue-400 hover:text-blue-300"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleStatus(item?._id)}
                        className={
                          item?.isActive === false
                            ? "text-green-400 hover:text-green-300"
                            : "text-red-400 hover:text-red-300"
                        }
                        title="Toggle status"
                      >
                        <FaPowerOff />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#101826] p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {isEditMode ? "Update Sub Category" : "Add Sub Category"}
                </h2>
                <p className="mt-1 text-sm text-gray-400">
                  {isEditMode
                    ? "Update existing sub category"
                    : "Create new sub category"}
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

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Lip stick"
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
                  placeholder="Sub makeup category"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Parent Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-white outline-none"
                >
                  <option value="" className="bg-[#101826]">
                    Select Category
                  </option>

                  {categories.map((cat) => (
                    <option
                      key={cat?._id}
                      value={cat?._id}
                      className="bg-[#101826]"
                    >
                      {cat?.name}
                    </option>
                  ))}
                </select>
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
                  className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/10 p-5 transition hover:border-orange-400/60 hover:bg-white/5"
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
                  ? isEditMode
                    ? "Updating..."
                    : "Creating..."
                  : isEditMode
                  ? "Update Sub Category"
                  : "Create Sub Category"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubCategories;