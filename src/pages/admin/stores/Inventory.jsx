import React, { useEffect, useMemo, useState } from "react";
import {
  FaBoxes,
  FaExclamationTriangle,
  FaPlus,
  FaTimes,
  FaSearch,
  FaDownload,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import { showSuccess, showError } from "../../../utils/alertService";

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
  const dispatch = useDispatch();
  const [stores, setStores] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState("");
  const [inventory, setInventory] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  // ================= FETCH STORES WITH DEBUGGING =================
  const fetchStores = async () => {
    try {
      console.log("Fetching all stores...");
      const res = await getAllStoresApi();
      console.log("getAllStoresApi Response Data:", res); // console me check karo isko

      if (res?.success) {
        // Kuch APIs me data direct res.data me hota hai, kuch me res.data.stores me. 
        // Isliye donon cases ko handle kar rahe hain:
        const apiStores = res?.data?.stores || res?.data || [];
        console.log("Parsed Stores Array:", apiStores);
        
        setStores(apiStores);

        if (apiStores.length > 0) {
          setSelectedStoreId(apiStores[0]?._id);
          setFormData((prev) => ({
            ...prev,
            store: apiStores[0]?._id,
          }));
        } else {
          console.warn("API succeeded but returned an empty array for stores.");
        }
      } else {
        showError(res?.message || "Failed to load stores from server");
      }
    } catch (error) {
      console.error("Critical error in fetchStores API call:", error);
      showError("Could not connect to stores service");
    }
  };

  // ================= FETCH INVENTORY =================
  const fetchInventory = async (storeId) => {
    if (!storeId) return;

    try {
      setLoading(true);
      dispatch(showLoader());

      console.log(`Fetching inventory for storeId: ${storeId}`);
      const res = await getInventoryByStoreIdApi(storeId);
      console.log("getInventoryByStoreIdApi Response:", res);

      if (res?.success) {
        setInventory(res?.data || []);
        setPagination(res?.pagination || null);
      } else {
        setInventory([]);
        setPagination(null);
        // Pehle is error box ko check karo agar alert pop ho raha hai toh
        showError(res?.message || "Inventory data not found");
      }
    } catch (error) {
      console.error("Inventory fetch error:", error);
      showError("Something went wrong while fetching inventory");
    } finally {
      setLoading(false);
      dispatch(hideLoader());
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

    try {
      setLoading(true);
      dispatch(showLoader());

      const res = await createInventoryApi(payload);

      if (res?.success) {
        dispatch(hideLoader());
        await showSuccess("Inventory created successfully");
        closePopup();
        setSelectedStoreId(formData.store);
        fetchInventory(formData.store);
      } else {
        dispatch(hideLoader());
        showError(res?.message || "Inventory create failed");
      }
    } catch (error) {
      console.log("Create inventory error:", error);
      dispatch(hideLoader());
      showError("Something went wrong while creating inventory");
    } {
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
    <div className="p-6 space-y-6">
      {/* ================= HEADER ================= */}
      <div className="card-3d p-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between bg-white">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Inventory Tracking</h1>
          <p className="mt-1 text-sm text-slate-500">
            Monitor stock levels across all stores seamlessly
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="btn-3d btn-white px-5 py-2.5 text-sm flex items-center gap-2">
            <FaDownload className="text-slate-400" /> Export Report
          </button>

          <button
            onClick={openAddPopup}
            className="btn-3d btn-gradient-orange px-5 py-2.5 text-sm flex items-center gap-2 text-white font-bold"
          >
            <FaPlus /> Add Inventory
          </button>
        </div>
      </div>

      {/* ================= CONTROLS (STORE & SEARCH) ================= */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="card-3d p-5 bg-white">
          <label className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500">
            Select Active Store
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
            className="input-3d w-full px-4 py-3 text-sm h-12 bg-white text-slate-800 font-medium focus:outline-none"
          >
            <option value="">Select Store</option>
            {stores && stores.length > 0 ? (
              stores.map((store) => (
                <option key={store?._id} value={store?._id}>
                  {store?.name} {store?.address ? `— ${store.address}` : ""}
                </option>
              ))
            ) : (
              <option disabled value="">⚠️ No stores found or loading...</option>
            )}
          </select>

          {selectedStore && (
            <p className="mt-2 text-xs text-slate-500">
              Showing analytics for:{" "}
              <span className="font-bold text-orange-500">
                {selectedStore?.name}
              </span>
            </p>
          )}
        </div>

        <div className="card-3d p-5 flex flex-col justify-center bg-white">
          <label className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500">
            Search Inventory
          </label>

          <div className="relative flex items-center">
            <FaSearch className="absolute left-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product name, SKU, category, brand..."
              className="input-3d w-full pl-11 pr-4 py-3 text-sm h-12 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* ================= METRICS CARDS ================= */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="card-3d p-5 flex items-center gap-4 border-l-4 border-l-orange-500 bg-white">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-xl text-orange-500">
            <FaBoxes />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Stock</p>
            <p className="text-2xl font-black text-slate-800 mt-0.5">{totalStock}</p>
          </div>
        </div>

        <div className="card-3d p-5 flex items-center gap-4 border-l-4 border-l-amber-500 bg-white">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-xl text-amber-500">
            <FaExclamationTriangle />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Low Stock Items</p>
            <p className="text-2xl font-black text-slate-800 mt-0.5">{lowStockCount}</p>
          </div>
        </div>

        <div className="card-3d p-5 flex items-center gap-4 border-l-4 border-l-green-500 bg-white">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-xl text-green-500">
            <FaBoxes />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Items</p>
            <p className="text-2xl font-black text-slate-800 mt-0.5">
              {pagination?.total || filteredInventory.length}
            </p>
          </div>
        </div>
      </div>

      {/* ================= DATATABLE ================= */}
      <div className="card-3d overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70">
                <th className="p-4 text-xs font-extrabold uppercase tracking-wider text-slate-400">Product</th>
                <th className="p-4 text-xs font-extrabold uppercase tracking-wider text-slate-400">Store</th>
                <th className="p-4 text-xs font-extrabold uppercase tracking-wider text-slate-400">SKU / Variant</th>
                <th className="p-4 text-xs font-extrabold uppercase tracking-wider text-slate-400">Price</th>
                <th className="p-4 text-xs font-extrabold uppercase tracking-wider text-slate-400">Current Stock</th>
                <th className="p-4 text-xs font-extrabold uppercase tracking-wider text-slate-400">Available</th>
                <th className="p-4 text-xs font-extrabold uppercase tracking-wider text-slate-400">Reserved</th>
                <th className="p-4 text-xs font-extrabold uppercase tracking-wider text-slate-400">Status</th>
                <th className="p-4 text-xs font-extrabold uppercase tracking-wider text-slate-400">Note</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="9" className="p-12 text-center text-slate-400 font-medium">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-2 w-2 bg-orange-500 rounded-full animate-bounce"></div>
                      <div className="h-2 w-2 bg-orange-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="h-2 w-2 bg-orange-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                      <span>Loading production inventory...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-12 text-center text-slate-400 italic">
                    No active inventory logs found for this filter.
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => {
                  const product = item?.variant?.product;
                  const variant = item?.variant;
                  const status = getStatus(item);

                  return (
                    <tr key={item?._id} className="transition-colors hover:bg-slate-50/50">
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
                            className="img-3d h-12 w-12 object-cover bg-slate-100"
                          />
                          <div>
                            <p className="font-bold text-slate-800">{product?.name || "-"}</p>
                            <p className="text-xs text-slate-400 font-medium">{product?.brand?.name || "-"}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 text-slate-600 font-medium">{item?.store?.name || "-"}</td>

                      <td className="p-4">
                        <p className="font-bold text-slate-800">{variant?.sku || "-"}</p>
                        <p className="text-xs text-slate-400">
                          {variant?.weight || "-"} {variant?.unit || ""}
                        </p>
                      </td>

                      <td className="p-4">
                        <p className="font-extrabold text-green-600">₹{variant?.sellingPrice || "-"}</p>
                        <p className="text-xs text-slate-400 line-through">₹{variant?.mrp || "-"}</p>
                      </td>

                      <td className="p-4 font-bold text-slate-800">
                        {item?.stock}{" "}
                        <span className="text-xs font-normal text-slate-400">
                          / Min {item?.lowStockThreshold}
                        </span>
                      </td>

                      <td className="p-4 font-bold text-green-600">{item?.availableStock}</td>
                      <td className="p-4 font-bold text-amber-500">{item?.reservedStock}</td>

                      <td className="p-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-extrabold tracking-wide uppercase ${
                            status === "Healthy"
                              ? "bg-green-50 text-green-600"
                              : status === "Low Stock"
                              ? "bg-amber-50 text-amber-500"
                              : "bg-red-50 text-red-500"
                          }`}
                        >
                          {status}
                        </span>
                      </td>

                      <td className="p-4 text-slate-400 text-xs italic">{item?.note || "-"}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= 3D MODAL POPUP ================= */}
      {showPopup && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl card-3d p-6 !rounded-[24px] !bg-white border-none shadow-2xl">
            <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-500">
                  Action Panel
                </p>
                <h2 className="mt-1 text-xl font-black text-slate-800">Add Store Inventory</h2>
              </div>

              <button
                type="button"
                onClick={closePopup}
                className="rounded-full bg-slate-100 p-2.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleCreateInventory} className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Target Store
                </label>
                <select
                  name="store"
                  value={formData.store}
                  onChange={handleChange}
                  required
                  className="input-3d w-full px-4 py-2.5 text-sm h-11 bg-white"
                >
                  <option value="">Select Store</option>
                  {stores.map((store) => (
                    <option key={store?._id} value={store?._id}>
                      {store?.name}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Variant Object ID"
                name="variant"
                value={formData.variant}
                onChange={handleChange}
                placeholder="Paste item variant database string _id"
                required
              />

              <Input
                label="Opening Stock"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                required
              />

              <Input
                label="Low Stock Alert Threshold"
                name="lowStockThreshold"
                type="number"
                value={formData.lowStockThreshold}
                onChange={handleChange}
                required
              />

              <Input
                label="Max Allowed Per Order"
                name="maxOrderQuantity"
                type="number"
                value={formData.maxOrderQuantity}
                onChange={handleChange}
                required
              />

              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Internal Operations Note
                </label>
                <textarea
                  name="note"
                  rows="2"
                  value={formData.note}
                  onChange={handleChange}
                  placeholder="E.g., Special promo batches, fast-moving batch..."
                  className="input-3d w-full px-4 py-2.5 text-sm placeholder:text-slate-400/70 bg-white"
                />
              </div>

              <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
                <button
                  type="button"
                  onClick={closePopup}
                  className="btn-3d btn-white px-5 py-2 text-sm"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-3d btn-gradient-orange px-6 py-2 text-sm disabled:opacity-60 text-white font-bold"
                >
                  {loading ? "Registering..." : "Create Asset"}
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
      <label className="mb-1.5 block text-xs font-bold text-slate-500 uppercase tracking-wider">
        {label}
      </label>
      <input
        {...props}
        className="input-3d w-full px-4 py-2.5 text-sm placeholder:text-slate-400/60 h-11 bg-white text-slate-800"
      />
    </div>
  );
};

export default Inventory;