import React, { useEffect, useMemo, useState } from "react";
import {
  FaBoxes,
  FaExclamationTriangle,
  FaPlus,
  FaTimes,
  FaSearch,
} from "react-icons/fa";

import {
  createInventoryApi,
  getAllStoresApi,
  getInventoryByStoreIdApi,
} from "../../../api/admin.api";

const emptyForm = {
  store: "",
  variant: "",
  stock: "",
  lowStockThreshold: "",
  maxOrderQuantity: "",
  note: "",
};

const Inventory = () => {
  const [stores, setStores] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState("");
  const [inventory, setInventory] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  const fetchStores = async () => {
    const res = await getAllStoresApi();

    if (res?.success) {
      const apiStores = res?.data || [];
      setStores(apiStores);

      if (apiStores.length > 0) {
        setSelectedStoreId(apiStores[0]?._id);
        setFormData((prev) => ({
          ...prev,
          store: apiStores[0]?._id,
        }));
      }
    }
  };

  const fetchInventory = async (storeId) => {
    if (!storeId) return;

    try {
      setLoading(true);

      const res = await getInventoryByStoreIdApi(storeId);

      if (res?.success) {
        setInventory(res?.data || []);
        setPagination(res?.pagination || null);
      } else {
        setInventory([]);
        setPagination(null);
        alert(res?.message || "Inventory not found");
      }
    } catch (error) {
      console.log("Inventory fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  useEffect(() => {
    if (selectedStoreId) {
      fetchInventory(selectedStoreId);
    }
  }, [selectedStoreId]);

  const selectedStore = useMemo(() => {
    return stores.find((store) => store?._id === selectedStoreId);
  }, [stores, selectedStoreId]);

  const filteredInventory = useMemo(() => {
    const q = search.toLowerCase().trim();

    if (!q) return inventory;

    return inventory.filter((item) => {
      const productName = item?.variant?.product?.name || "";
      const sku = item?.variant?.sku || "";
      const storeName = item?.store?.name || "";
      const category = item?.variant?.product?.category?.name || "";
      const brand = item?.variant?.product?.brand?.name || "";

      return (
        productName.toLowerCase().includes(q) ||
        sku.toLowerCase().includes(q) ||
        storeName.toLowerCase().includes(q) ||
        category.toLowerCase().includes(q) ||
        brand.toLowerCase().includes(q)
      );
    });
  }, [inventory, search]);

  const totalStock = inventory.reduce(
    (sum, item) => sum + Number(item?.stock || 0),
    0
  );

  const lowStockCount = inventory.filter(
    (item) =>
      Number(item?.availableStock || 0) <=
      Number(item?.lowStockThreshold || 0)
  ).length;

  const openAddPopup = () => {
    setFormData({
      ...emptyForm,
      store: selectedStoreId || "",
    });
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setFormData({
      ...emptyForm,
      store: selectedStoreId || "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateInventory = async (e) => {
    e.preventDefault();

    const payload = {
      storeId: formData.store,
      variants: [
        {
          variantId: formData.variant,
          stock: Number(formData.stock),
          lowStockThreshold: Number(formData.lowStockThreshold),
          maxOrderQuantity: Number(formData.maxOrderQuantity),
          note: formData.note,
        },
      ],
    };

    console.log("FINAL PAYLOAD 👉", payload);

    try {
      setLoading(true);

      const res = await createInventoryApi(payload);

      console.log("CREATE INVENTORY RESPONSE 👉", res);

      if (res?.success) {
        alert("Inventory created successfully");
        closePopup();
        setSelectedStoreId(formData.store);
        fetchInventory(formData.store);
      } else {
        alert(res?.message || "Inventory create failed");
      }
    } catch (error) {
      console.log("Create inventory error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatus = (item) => {
    if (!item?.isAvailable || Number(item?.availableStock || 0) === 0) {
      return "Out of Stock";
    }

    if (
      Number(item?.availableStock || 0) <=
      Number(item?.lowStockThreshold || 0)
    ) {
      return "Low Stock";
    }

    return "Healthy";
  };

  return (
    <div className="p-6 text-white">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Inventory Tracking</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Monitor stock levels across all stores
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="rounded-xl border border-[var(--border-soft)] bg-[var(--card-bg)] px-4 py-2 text-gray-300 transition-all hover:border-orange-500/50 hover:text-white">
            Export Report
          </button>

          <button
            onClick={openAddPopup}
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 font-bold text-black transition hover:bg-orange-400"
          >
            <FaPlus />
            Add Inventory
          </button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-300">
            Select Store
          </label>

          <select
            value={selectedStoreId}
            onChange={(e) => {
              setSelectedStoreId(e.target.value);
              setFormData((prev) => ({
                ...prev,
                store: e.target.value,
              }));
            }}
            className="w-full rounded-xl border border-white/10 bg-[var(--card-bg)] px-4 py-3 text-white outline-none"
          >
            <option className="bg-slate-900" value="">
              Select Store
            </option>

            {stores.map((store) => (
              <option
                className="bg-slate-900"
                key={store?._id}
                value={store?._id}
              >
                {store?.name} - {store?.address}
              </option>
            ))}
          </select>

          {selectedStore && (
            <p className="mt-2 text-sm text-gray-400">
              Showing inventory for:{" "}
              <span className="font-semibold text-orange-400">
                {selectedStore?.name}
              </span>
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-300">
            Search Inventory
          </label>

          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[var(--card-bg)] px-4 py-3">
            <FaSearch className="text-orange-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product, SKU, category, brand..."
              className="w-full bg-transparent text-white outline-none placeholder:text-gray-500"
            />
          </div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="glass flex items-center gap-4 rounded-2xl border border-orange-500/30 bg-orange-500/5 p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/20 text-xl text-orange-400">
            <FaBoxes />
          </div>
          <div>
            <p className="text-sm text-gray-400">Total Stock</p>
            <p className="text-2xl font-bold text-white">{totalStock}</p>
          </div>
        </div>

        <div className="glass flex items-center gap-4 rounded-2xl border border-yellow-500/30 bg-yellow-500/5 p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/20 text-xl text-yellow-400">
            <FaExclamationTriangle />
          </div>
          <div>
            <p className="text-sm text-gray-400">Low Stock Items</p>
            <p className="text-2xl font-bold text-white">{lowStockCount}</p>
          </div>
        </div>

        <div className="glass flex items-center gap-4 rounded-2xl border border-green-500/30 bg-green-500/5 p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20 text-xl text-green-400">
            <FaBoxes />
          </div>
          <div>
            <p className="text-sm text-gray-400">Total Items</p>
            <p className="text-2xl font-bold text-white">
              {pagination?.total || inventory.length}
            </p>
          </div>
        </div>
      </div>

      <div className="glass overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] border-collapse text-left">
            <thead>
              <tr className="border-b border-white/10 bg-[var(--card-bg)]/50">
                <th className="p-4 text-sm font-semibold text-gray-400">
                  Product
                </th>
                <th className="p-4 text-sm font-semibold text-gray-400">
                  Store
                </th>
                <th className="p-4 text-sm font-semibold text-gray-400">
                  SKU / Variant
                </th>
                <th className="p-4 text-sm font-semibold text-gray-400">
                  Price
                </th>
                <th className="p-4 text-sm font-semibold text-gray-400">
                  Current Stock
                </th>
                <th className="p-4 text-sm font-semibold text-gray-400">
                  Available
                </th>
                <th className="p-4 text-sm font-semibold text-gray-400">
                  Reserved
                </th>
                <th className="p-4 text-sm font-semibold text-gray-400">
                  Status
                </th>
                <th className="p-4 text-sm font-semibold text-gray-400">
                  Note
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-gray-400">
                    Loading inventory...
                  </td>
                </tr>
              ) : filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-gray-400">
                    No inventory found.
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => {
                  const product = item?.variant?.product;
                  const variant = item?.variant;
                  const status = getStatus(item);

                  return (
                    <tr
                      key={item?._id}
                      className="border-b border-white/5 transition-colors hover:bg-white/5"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              variant?.thumbnail ||
                              product?.thumbnail ||
                              product?.images?.[0] ||
                              "/logo.png"
                            }
                            alt={product?.name}
                            className="h-12 w-12 rounded-xl object-cover"
                          />

                          <div>
                            <p className="font-medium text-white">
                              {product?.name || "-"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {product?.brand?.name || "-"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 text-gray-300">
                        {item?.store?.name || "-"}
                      </td>

                      <td className="p-4">
                        <p className="font-semibold text-white">
                          {variant?.sku || "-"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {variant?.weight || "-"} {variant?.unit || ""}
                        </p>
                      </td>

                      <td className="p-4">
                        <p className="font-bold text-green-400">
                          ₹{variant?.sellingPrice || "-"}
                        </p>
                        <p className="text-xs text-gray-500 line-through">
                          ₹{variant?.mrp || "-"}
                        </p>
                      </td>

                      <td className="p-4 font-bold text-white">
                        {item?.stock}{" "}
                        <span className="text-xs font-normal text-gray-500">
                          / Min {item?.lowStockThreshold}
                        </span>
                      </td>

                      <td className="p-4 font-bold text-green-400">
                        {item?.availableStock}
                      </td>

                      <td className="p-4 font-bold text-yellow-400">
                        {item?.reservedStock}
                      </td>

                      <td className="p-4">
                        <span
                          className={`rounded-md border px-2.5 py-1 text-xs ${
                            status === "Healthy"
                              ? "border-green-500/20 bg-green-500/10 text-green-400"
                              : status === "Low Stock"
                              ? "border-yellow-500/20 bg-yellow-500/10 text-yellow-400"
                              : "border-red-500/20 bg-red-500/10 text-red-400"
                          }`}
                        >
                          {status}
                        </span>
                      </td>

                      <td className="p-4 text-gray-400">
                        {item?.note || "-"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-[32px] border border-orange-500/20 bg-[#111827] p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-400">
                  Create Inventory
                </p>

                <h2 className="mt-2 text-2xl font-bold">Add Store Inventory</h2>
              </div>

              <button
                type="button"
                onClick={closePopup}
                className="rounded-full bg-white/10 p-3 transition hover:bg-red-500"
              >
                <FaTimes />
              </button>
            </div>

            <form
              onSubmit={handleCreateInventory}
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
            >
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-300">
                  Store
                </label>

                <select
                  name="store"
                  value={formData.store}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
                >
                  <option className="bg-slate-900" value="">
                    Select Store
                  </option>

                  {stores.map((store) => (
                    <option
                      className="bg-slate-900"
                      key={store?._id}
                      value={store?._id}
                    >
                      {store?.name}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Variant ID"
                name="variant"
                value={formData.variant}
                onChange={handleChange}
                placeholder="Paste variant _id"
                required
              />

              <Input
                label="Stock"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                required
              />

              <Input
                label="Low Stock Threshold"
                name="lowStockThreshold"
                type="number"
                value={formData.lowStockThreshold}
                onChange={handleChange}
                required
              />

              <Input
                label="Max Order Quantity"
                name="maxOrderQuantity"
                type="number"
                value={formData.maxOrderQuantity}
                onChange={handleChange}
                required
              />

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-gray-300">
                  Note
                </label>

                <textarea
                  name="note"
                  rows="3"
                  value={formData.note}
                  onChange={handleChange}
                  placeholder="Fast moving item / Limited stock"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-gray-500"
                />
              </div>

              <div className="md:col-span-2 flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={closePopup}
                  className="rounded-2xl bg-white/10 px-6 py-3 font-bold text-gray-300 transition hover:bg-white/20"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-2xl bg-orange-500 px-6 py-3 font-bold text-black transition hover:bg-orange-400 disabled:opacity-60"
                >
                  {loading ? "Please wait..." : "Create Inventory"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const Input = ({ label, ...props }) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-300">
        {label}
      </label>

      <input
        {...props}
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-gray-500"
      />
    </div>
  );
};

export default Inventory;