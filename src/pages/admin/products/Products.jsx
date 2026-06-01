import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus, FaSync } from "react-icons/fa";
import { useDispatch } from "react-redux";

import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import { showConfirm, showSuccess, showError } from "../../../utils/alertService";
import {
  getAllProductsApi,
  toggleProductStatusApi,
} from "../../../api/admin.api";
import { AdminRouters } from "../../../constants/routes";

const Products = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);

  const loadProducts = async () => {
    try {
      dispatch(showLoader());
      const res = await getAllProductsApi();

      if (res?.success) setProducts(res?.data || []);
      else showError(res?.message);
    } catch (e) {
      showError(e?.message);
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id) => {
    const ok = await showConfirm({
      title: "Delete Product?",
      text: "This action cannot be undone",
    });

    if (!ok.isConfirmed) return;

    setProducts((p) => p.filter((x) => x._id !== id));
    showSuccess("Deleted successfully");
  };

  const handleToggleProductStatus = async (product) => {
    try {
      dispatch(showLoader());

      const res = await toggleProductStatusApi(product._id);

      if (res?.success) {
        setProducts((prev) =>
          prev.map((item) =>
            item._id === product._id
              ? { ...item, isActive: !item?.isActive }
              : item
          )
        );
        showSuccess(res?.message || "Product status updated successfully");
      } else {
        showError(res?.message || "Failed to update product status");
      }
    } catch (error) {
      showError(error?.message || "Failed to update product status");
    } finally {
      dispatch(hideLoader());
    }
  };

  const nameSafe = (v) => v?.name || "-";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f6f7fb] via-[#eef2f7] to-[#f8fafc] p-4 md:p-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8">

        <div>
          <h1 className="text-3xl font-extrabold text-gray-800">
            Products
          </h1>
          <p className="text-gray-500 text-sm">
            Manage inventory with premium control panel
          </p>
        </div>

        <div className="flex gap-3">

          <button
            onClick={loadProducts}
            className="px-4 py-2 rounded-xl bg-white/70 backdrop-blur-md border shadow-md hover:scale-105 transition flex items-center gap-2 text-gray-600"
          >
            <FaSync /> Refresh
          </button>

          {/* ORANGE 3D BUTTON */}
          <button
            onClick={() => navigate("/dashboard/products/add")}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-400 to-orange-600 text-white font-semibold shadow-[0_8px_20px_rgba(255,140,0,0.35)] hover:shadow-[0_12px_30px_rgba(255,140,0,0.45)] hover:-translate-y-1 transition flex items-center gap-2"
          >
            <FaPlus /> Add Product
          </button>

        </div>
      </div>

      {/* TABLE WRAPPER (GLASS + 3D) */}
      <div className="rounded-3xl overflow-hidden border border-white/40 bg-white/60 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.08)]">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[850px]">

            {/* HEADER */}
            <thead className="bg-white/40 backdrop-blur-md text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="p-5 text-left">Product</th>
                <th className="p-5 text-center">Category</th>
                <th className="p-5 text-center">Brand</th>
                <th className="p-5 text-center">Price</th>
                <th className="p-5 text-center">Variants</th>
                <th className="p-5 text-center">Status</th>
                <th className="p-5 text-center">Action</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody className="divide-y divide-white/40">

              {products.map((p) => (
                <tr
                  key={p._id}
                  className="group hover:bg-white/70 transition"
                >

                  {/* PRODUCT */}
                  <td className="p-4 flex items-center gap-3">
                    <img
                      src={p?.thumbnail || p?.images?.[0]}
                      className="w-12 h-12 rounded-xl object-cover shadow-md group-hover:scale-110 transition"
                    />

                    <div>
                      <p className="font-semibold text-gray-800 group-hover:text-orange-500 transition">
                        {p?.name}
                      </p>
                      <p className="text-xs text-green-600">
                        {p?.subCategory?.name}
                      </p>
                    </div>
                  </td>

                  {/* CATEGORY */}
                  <td className="text-center text-gray-600 font-medium">
                    {nameSafe(p?.category)}
                  </td>

                  {/* BRAND */}
                  <td className="text-center text-gray-600">
                    {nameSafe(p?.brand)}
                  </td>

                  {/* PRICE */}
                  <td className="text-center font-bold text-gray-800">
                    <span className="text-orange-500">₹</span>
                    {p?.minPrice || 0}
                  </td>

                  {/* VARIANTS */}
                  <td className="text-center">
                    <span className="px-2 py-1 rounded-lg bg-gray-100 text-xs font-semibold">
                      {p?.totalVariants}
                    </span>
                  </td>

                  {/* STATUS */}
                  <td className="text-center">
                    <button
                      onClick={() => handleToggleProductStatus(p)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                        p?.isActive
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-red-100 text-red-600 hover:bg-red-200"
                      }`}
                    >
                      {p?.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>

                  {/* ACTIONS */}
                  <td className="text-center">
                    <div className="flex justify-center gap-2">

                      {/* EDIT */}
                      <button
                        onClick={() =>
                          navigate(
                            AdminRouters.EDIT_PRODUCT.replace(
                              ":productId",
                              p._id
                            )
                          )
                        }
                        className="p-2 rounded-xl bg-orange-100 text-orange-600 hover:bg-orange-500 hover:text-white shadow-md transition hover:-translate-y-1"
                      >
                        <FaEdit />
                      </button>

                      {/* DELETE */}
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="p-2 rounded-xl bg-red-100 text-red-500 hover:bg-red-500 hover:text-white shadow-md transition hover:-translate-y-1"
                      >
                        <FaTrash />
                      </button>

                    </div>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>
      </div>
    </div>
  );
};

export default Products;