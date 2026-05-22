import React, { useEffect, useRef, useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaUpload,
} from "react-icons/fa";

import Axios from "../../../api/Axios";

const SubCategories = () => {
  const fileRef = useRef(null);

  const [subcats, setSubcats] = useState([]);
  const [categories, setCategories] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const fetchCategories = async () => {
    try {
      const response = await Axios.get(
        "/user/get-all-categories?page=1&limit=100"
      );

      if (response?.data?.success) {
        setCategories(response?.data?.data || []);
      }
    } catch (error) {
      console.log("FETCH CATEGORY ERROR 👉", error);
    }
  };

  const fetchSubCategories = async () => {
    try {
      setFetchLoading(true);

      const response = await Axios.get(
        "/user/get-all-subcategories?page=1&limit=10"
      );

      console.log("SUB CATEGORY RESPONSE 👉", response.data);

      if (response?.data?.success) {
        setSubcats(response?.data?.data || []);
      } else {
        setSubcats([]);
        alert(response?.data?.message || "Failed to fetch sub categories");
      }
    } catch (error) {
      console.log("FETCH SUB CATEGORY ERROR 👉", error);
      setSubcats([]);
      alert(error?.response?.data?.message || "Failed to fetch sub categories");
    } finally {
      setFetchLoading(false);
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

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
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
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCreateSubCategory = async (e) => {
    e.preventDefault();

    if (!name.trim() || !description.trim() || !category || !image) {
      alert("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("description", description.trim());
      formData.append("category", category);
      formData.append("image", image);

      const response = await Axios.post("/admin/subcategory-create", formData);

      console.log("CREATE SUB CATEGORY RESPONSE 👉", response.data);

      if (response?.data?.success) {
        alert(response?.data?.message || "Sub category created successfully");
        closeModal();
        fetchSubCategories();
      } else {
        alert(response?.data?.message || "Failed to create sub category");
      }
    } catch (error) {
      console.log("CREATE SUB CATEGORY ERROR 👉", error);
      alert(
        error?.response?.data?.message || "Failed to create sub category"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this sub category?"
    );

    if (!confirmDelete) return;

    setSubcats((prev) => prev.filter((item) => item?._id !== id));
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
          onClick={() => setShowModal(true)}
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
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <FaEdit />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(item?._id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <FaTrash />
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
                  Add Sub Category
                </h2>
                <p className="mt-1 text-sm text-gray-400">
                  Create new sub category
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

            <form onSubmit={handleCreateSubCategory} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="lip stick"
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
                  placeholder="sub make up category"
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
                {loading ? "Creating..." : "Create Sub Category"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubCategories;