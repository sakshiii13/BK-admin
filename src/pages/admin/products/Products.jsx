import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { useDispatch } from "react-redux";

import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import { showConfirm, showSuccess, showError } from "../../../utils/alertService";
import { getAllProductsApi, toggleProductStatusApi } from "../../../api/admin.api";
import { getAllVariantsApi } from "../../../api/admin.api";
import { AdminRouters } from "../../../constants/routes";
import TableComponent from "../../../components/global/TableComponent";

const Products = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [variantModal, setVariantModal] = useState(false);
  const [variants, setVariants] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

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

  const handleShowVariants = async (product) => {
    try {
      dispatch(showLoader());
      setSelectedProduct(product);
      const res = await getAllVariantsApi(1, 50, product._id);
      if (res?.success) {
        setVariants(res?.data || []);
        setVariantModal(true);
      } else {
        showError(res?.message || "Failed to load variants");
      }
    } catch (e) {
      showError(e?.message);
    } finally {
      dispatch(hideLoader());
    }
  };

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

  // ── PRODUCTS COLUMNS ────────────────────────────────
  const productColumns = [
    {
      key: "name",
      label: "Product",
      render: (_, p) => (
        <div className="flex items-center gap-3">
          <img
            src={p?.thumbnail || p?.images?.[0]}
            alt={p?.name}
            className="w-10 h-10 rounded-xl object-cover border border-slate-100"
          />
          <div>
            <p className="font-bold text-[var(--text-primary)]">{p?.name}</p>
            <p className="text-xs text-[var(--primary-green)] font-semibold mt-0.5">
              {p?.subCategory?.name}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (_, p) => (
        <span className="text-[var(--text-secondary)]">{p?.category?.name || "-"}</span>
      ),
    },
    {
      key: "brand",
      label: "Brand",
      render: (_, p) => (
        <span className="text-[var(--text-secondary)]">{p?.brand?.name || "-"}</span>
      ),
    },
    {
      key: "minPrice",
      label: "Price",
      render: (_, p) => (
        <span className="font-black text-[var(--text-primary)]">
          <span className="text-[var(--primary-orange)]">₹</span>
          {p?.minPrice || 0}
        </span>
      ),
    },
    {
      key: "totalVariants",
      label: "Variants",
      render: (_, p) => (
        <button
          onClick={() => handleShowVariants(p)}
          className="px-3 py-1.5 rounded-lg bg-orange-50 border border-orange-100 text-[var(--primary-orange)] text-xs font-bold hover:bg-[var(--primary-orange)] hover:text-white hover:border-[var(--primary-orange)] transition-colors"
        >
          {p?.totalVariants ?? 0} View
        </button>
      ),
    },
    {
      key: "isActive",
      label: "Status",
      render: (_, p) => (
        <button
          onClick={() => handleToggleProductStatus(p)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
            p?.isActive
              ? "bg-green-50 text-green-700 border-green-100 hover:bg-green-100"
              : "bg-red-50 text-red-600 border-red-100 hover:bg-red-100"
          }`}
        >
          {p?.isActive ? "Active" : "Inactive"}
        </button>
      ),
    },
    {
      key: "actions",
      label: "Action",
      render: (_, p) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              navigate(AdminRouters.EDIT_PRODUCT.replace(":productId", p._id))
            }
            className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-100 text-[var(--primary-orange)] hover:bg-[var(--primary-orange)] hover:text-white hover:border-[var(--primary-orange)] transition-colors flex items-center justify-center"
          >
            <FaEdit className="text-xs" />
          </button>
          <button
            onClick={() => handleDelete(p._id)}
            className="w-8 h-8 rounded-lg bg-red-50 border border-red-100 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors flex items-center justify-center"
          >
            <FaTrash className="text-xs" />
          </button>
        </div>
      ),
    },
  ];

  // ── VARIANTS COLUMNS ────────────────────────────────
  const variantColumns = [
    {
      key: "thumbnail",
      label: "Image",
      render: (_, v) =>
        v?.thumbnail ? (
          <img
            src={v.thumbnail}
            alt={v?.sku}
            className="w-10 h-10 rounded-xl object-cover border border-slate-100"
          />
        ) : (
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-bold">
            N/A
          </div>
        ),
    },
    {
      key: "sku",
      label: "Weight / SKU",
      render: (_, v) => (
        <div>
          <p className="font-bold text-[var(--text-primary)]">
            {v?.weight} {v?.unit}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">SKU: {v?.sku || "N/A"}</p>
        </div>
      ),
    },
    {
      key: "sellingPrice",
      label: "Price",
      render: (_, v) => (
        <div>
          <p className="font-black text-[var(--text-primary)]">
            <span className="text-[var(--primary-orange)]">₹</span>
            {v?.sellingPrice ?? 0}
          </p>
          {v?.mrp && v?.mrp !== v?.sellingPrice && (
            <p className="text-xs text-slate-400 line-through mt-0.5">₹{v?.mrp}</p>
          )}
        </div>
      ),
    },
    {
      key: "stock",
      label: "Stock",
      render: () => (
        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-xs font-bold text-slate-500">
          -
        </span>
      ),
    },
    {
      key: "isActive",
      label: "Status",
      render: (_, v) => (
        <span
          className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
            v?.isActive
              ? "bg-green-50 text-green-700 border-green-100"
              : "bg-red-50 text-red-500 border-red-100"
          }`}
        >
          {v?.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-6">

      {/* PRODUCTS TABLE */}
      <TableComponent
        title="Products"
        subtitle="Manage inventory with premium control panel"
        columns={productColumns}
        data={products}
        searchPlaceholder="Search products..."
        addButtonText="Add Product"
        onAdd={() => navigate("/dashboard/products/add")}
        onRefresh={loadProducts}
      />

      {/* VARIANTS MODAL */}
      {variantModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px] p-4"
          onClick={(e) => e.target === e.currentTarget && setVariantModal(false)}
        >
          <div className="bg-[var(--card-bg)] rounded-2xl border border-slate-200 w-full max-w-3xl max-h-[85vh] flex flex-col shadow-lg">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-black text-[var(--text-primary)]">
                  Product Variants
                </h2>
                <p className="text-sm text-[var(--primary-orange)] font-semibold mt-0.5">
                  {selectedProduct?.name}
                </p>
              </div>
              <button
                onClick={() => setVariantModal(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-500 text-slate-500 transition-colors flex items-center justify-center"
              >
                <FaTimes className="text-xs" />
              </button>
            </div>

            {/* Modal Body — flat TableComponent, no nested card */}
            <div className="overflow-y-auto flex-1 p-4">
              <TableComponent
                title=""
                subtitle=""
                columns={variantColumns}
                data={variants}
                searchPlaceholder="Search variants..."
                showSearch={true}
                showIndex={true}
                onRefresh={null}
              />
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-400">
                Total:{" "}
                <span className="font-black text-[var(--text-primary)]">
                  {variants.length} variants
                </span>
              </p>
              <button
                onClick={() => setVariantModal(false)}
                className="btn-3d btn-white h-9 px-5 text-sm"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Products;