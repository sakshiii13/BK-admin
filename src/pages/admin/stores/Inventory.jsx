import React, { useEffect, useMemo, useState } from "react";
import {
  createInventoryApi,
  getAllStoresApi,
  getInventoryByStoreIdApi,
} from "../../../api/admin.api";

// Inline high-quality SVGs to replace react-icons dependencies and ensure successful compile
const SvgBoxes = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const SvgExclamation = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const SvgPlus = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const SvgTimes = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const SvgSearch = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const SvgDownload = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const emptyForm = {
  store: "",
  variants: [
    {
      variant: "",
      stock: "",
      lowStockThreshold: "",
      maxOrderQuantity: "",
      note: "",
    },
  ],
};

const Inventory = () => {
  const [stores, setStores] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState("");
  const [inventory, setInventory] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  // Simulation controls to demonstrate 404 error handling gracefully
  const [apiSimMode, setApiSimMode] = useState("200_SUCCESS"); // "200_SUCCESS" or "404_NOT_FOUND"
  const [toast, setToast] = useState(null);

  // Custom inline toast alert logic to decouple from external alertService
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Load full store list from backend so all created stores appear in inventory selector
  useEffect(() => {
    const loadStores = async () => {
      try {
        setLoading(true);
        const res = await getAllStoresApi(1, 100);
        const storeData = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.data?.data)
          ? res.data.data
          : Array.isArray(res?.data?.stores)
          ? res.data.stores
          : Array.isArray(res?.stores)
          ? res.stores
          : [];

        setStores(storeData);
        if (storeData.length) {
          setSelectedStoreId((prev) => prev || storeData[0]?._id || "");
        }
      } catch (err) {
        console.error("Failed to load stores for inventory", err);
      } finally {
        setLoading(false);
      }
    };

    loadStores();
  }, []);

  // Fetch Inventory dataset safely depending on selection and simulating latency & simulated 404 responses
  const fetchInventoryData = async (storeId, mode) => {
    if (!storeId) return;

    try {
      setLoading(true);
      // Simulate network request roundtrip
      await new Promise((resolve) => setTimeout(resolve, 600));

      if (mode === "404_NOT_FOUND") {
        // Silently clear list and transition into clean, warning-free empty state
        setInventory([]);
        console.warn(`Simulated API 404 Response: No active inventory records found for Store ID ${storeId}`);
        // Zero popups are triggered here, making it perfect for silent background recoveries!
      } else {
        const res = await getInventoryByStoreIdApi(storeId, 1, 100);
        console.log("INVENTORY API RESPONSE:", res);

        const rawData = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.data?.data)
          ? res.data.data
          : Array.isArray(res?.data?.inventory)
          ? res.data.inventory
          : Array.isArray(res?.inventory)
          ? res.inventory
          : Array.isArray(res?.data?.products)
          ? res.data.products
          : Array.isArray(res?.products)
          ? res.products
          : [];

        const responseStore =
          res?.store ||
          res?.data?.store ||
          (selectedStore ? { name: selectedStore.name } : null) ||
          null;

        const inventoryData = rawData.map((product) => {
          const variant = product?.defaultVariant || product?.variant || {};
          const brandName =
            typeof product?.brand === "string"
              ? product.brand
              : product?.brand?.name || "";
          const storeName = responseStore?.name || "";

          const stockValue = Number(
            variant?.stock ?? variant?.availableStock ?? 0
          );

          return {
            _id:
              variant?.inventoryId ||
              variant?.variantId ||
              product?.productId ||
              product?._id ||
              product?.id ||
              `${storeId}-${product?.slug || product?.name || Math.random()}`,
            store: { name: storeName },
            stock: stockValue,
            availableStock: stockValue,
            reservedStock: Number(variant?.reservedStock || 0),
            lowStockThreshold: Number(variant?.lowStockThreshold || 0),
            isAvailable: stockValue > 0,
            note: product?.description || product?.note || "",
            variant: {
              sku: variant?.sku || product?.slug || product?.name || "",
              weight: variant?.weight || "",
              unit: variant?.unit || "",
              sellingPrice: Number(
                variant?.sellingPrice ?? variant?.mrp ?? 0
              ),
              mrp: Number(variant?.mrp ?? 0),
              product: {
                name: product?.name || "",
                brand: { name: brandName },
                thumbnail: product?.thumbnail || "",
              },
            },
          };
        });

        setInventory(inventoryData);
      }
    } catch (err) {
      console.error("Critical connection failure:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load data reactively when filters or simulation parameters are changed
  useEffect(() => {
    if (selectedStoreId) {
      fetchInventoryData(selectedStoreId, apiSimMode);
    }
  }, [selectedStoreId, apiSimMode]);

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
      const brand = item?.variant?.product?.brand?.name || "";

      return (
        productName.toLowerCase().includes(q) ||
        sku.toLowerCase().includes(q) ||
        storeName.toLowerCase().includes(q) ||
        brand.toLowerCase().includes(q)
      );
    });
  }, [inventory, search]);

  const totalStock = useMemo(() => {
    return inventory.reduce((sum, item) => sum + Number(item?.stock || 0), 0);
  }, [inventory]);

  const lowStockCount = useMemo(() => {
    return inventory.filter(
      (item) => Number(item?.availableStock || 0) <= Number(item?.lowStockThreshold || 0)
    ).length;
  }, [inventory]);

  const openAddPopup = () => {
    setFormData({
      ...emptyForm,
      store: selectedStoreId || "",
    });
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setFormData(emptyForm);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVariantChange = (index, name, value) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.map((variant, idx) =>
        idx === index ? { ...variant, [name]: name === "variant" ? value.trim() : value } : variant
      ),
    }));
  };

  const handleAddVariantRow = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          variant: "",
          stock: "",
          lowStockThreshold: "",
          maxOrderQuantity: "",
          note: "",
        },
      ],
    }));
  };

  const handleRemoveVariantRow = (index) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.length > 1
        ? prev.variants.filter((_, idx) => idx !== index)
        : prev.variants,
    }));
  };

  // Safe manual addition logic to simulate immediate backend update success
  const handleCreateInventory = async (e) => {
    e.preventDefault();

    if (!selectedStoreId && !formData.store) {
      showToast("Select a store before adding inventory.", "warning");
      return;
    }

    const variantsPayload = formData.variants
      .filter((variant) => variant.variant.trim())
      .map((variant) => ({
        variant: variant.variant.trim(),
        stock: Number(variant.stock),
        lowStockThreshold: Number(variant.lowStockThreshold),
        maxOrderQuantity: Number(variant.maxOrderQuantity || 0),
        note: variant.note,
      }));

    if (!variantsPayload.length) {
      showToast("At least one variant row is required.", "warning");
      return;
    }

    const payload = {
      store: formData.store || selectedStoreId,
      variants: variantsPayload,
    };

    try {
      setLoading(true);
      const res = await createInventoryApi(payload);
      console.log("CREATE INVENTORY RESPONSE:", res);

      if (res?.success) {
        showToast("Inventory asset registered successfully on shelf!", "success");
        closePopup();
        if (selectedStoreId) {
          await fetchInventoryData(selectedStoreId, apiSimMode);
        }
      } else {
        showToast(res?.message || "Failed to save inventory", "error");
      }
    } catch (error) {
      console.error("Create inventory error", error);
      showToast("Failed to save inventory", "error");
    } finally {
      setLoading(false);
    }
  };

  const getStatus = (item) => {
    if (!item?.isAvailable || Number(item?.availableStock || 0) === 0) {
      return "Out of Stock";
    }
    if (Number(item?.availableStock || 0) <= Number(item?.lowStockThreshold || 0)) {
      return "Low Stock";
    }
    return "Healthy";
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen font-sans antialiased bg-[#f8fafc] text-[#1e293b] space-y-6">
      
      {/* ================= HEADER PANEL ================= */}
      <div className="bg-white border border-slate-200 rounded-[2rem] p-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between shadow-[0_10px_30px_rgba(15,23,42,0.02)]">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#0f172a] tracking-tight">
            Inventory <span className="text-[#ff7e00]">Tracking</span>
          </h1>
          <p className="mt-1 text-[#64748b] font-semibold">
            Monitor stock levels across all active stores seamlessly
          </p>
        </div>

        {/* Dynamic simulator trigger for 404/200 live test */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-3.5 py-1.5 rounded-2xl">
            <span className="text-[11px] font-black uppercase text-slate-500 tracking-wider">
              API Sandbox Sim:
            </span>
            <button
              onClick={() => {
                setApiSimMode("200_SUCCESS");
                showToast("API Mode changed to 200 (Success with Data)", "success");
              }}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                apiSimMode === "200_SUCCESS"
                  ? "bg-[#ff7e00] text-white shadow-sm"
                  : "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200"
              }`}
            >
              200 OK
            </button>
            <button
              onClick={() => {
                setApiSimMode("404_NOT_FOUND");
                showToast("API Mode changed to 404 (No Data - Silent Handling)", "warning");
              }}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                apiSimMode === "404_NOT_FOUND"
                  ? "bg-rose-500 text-white shadow-sm"
                  : "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200"
              }`}
            >
              404 Silent
            </button>
          </div>

          <button className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-2xl font-bold transition-all flex items-center gap-2 cursor-pointer">
            <SvgDownload /> Export
          </button>

          <button
            onClick={openAddPopup}
            className="px-8 py-3.5 bg-[#ff7e00] hover:bg-[#e06f00] text-white rounded-2xl font-bold shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <SvgPlus /> Add Stock
          </button>
        </div>
      </div>

      {/* ================= FILTERS GRID ================= */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-[0_10px_30px_rgba(15,23,42,0.02)]">
          <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">
            Select Active Store
          </label>

          <select
            value={selectedStoreId}
            onChange={(e) => setSelectedStoreId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-[#0f172a] outline-none focus:bg-white focus:border-[#ff7e00] transition-all font-bold cursor-pointer"
          >
            {stores.map((store) => (
              <option key={store?._id} value={store?._id}>
                {store?.name}
              </option>
            ))}
          </select>

          {selectedStore && (
            <p className="mt-2 text-xs text-slate-500 font-semibold pl-1">
              Active Store:{" "}
              <span className="font-bold text-[#ff7e00]">
                {selectedStore?.name}
              </span>
            </p>
          )}
        </div>

        <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-[0_10px_30px_rgba(15,23,42,0.02)] flex flex-col justify-center">
          <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">
            Search Shelf Inventory
          </label>

          <div className="relative flex items-center">
            <div className="absolute left-5 text-slate-400">
              <SvgSearch />
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product name, SKU, brand, or comments..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-5 py-4 text-[#0f172a] outline-none focus:bg-white focus:border-[#ff7e00] transition-all font-bold placeholder-slate-400"
            />
          </div>
        </div>
      </div>

      {/* ================= METRICS BLOCK ================= */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white border border-slate-200 rounded-[2rem] p-6 flex items-center gap-4 border-l-4 border-l-[#ff7e00] shadow-[0_10px_30px_rgba(15,23,42,0.02)]">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-550/10 text-xl text-[#ff7e00] bg-orange-50">
            <SvgBoxes />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Stock on Shelf</p>
            <p className="text-2xl font-black text-[#0f172a] mt-0.5">{loading ? "..." : totalStock}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[2rem] p-6 flex items-center gap-4 border-l-4 border-l-amber-500 shadow-[0_10px_30px_rgba(15,23,42,0.02)]">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-xl text-amber-500">
            <SvgExclamation />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Low Stock Alert Items</p>
            <p className="text-2xl font-black text-[#0f172a] mt-0.5">{loading ? "..." : lowStockCount}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[2rem] p-6 flex items-center gap-4 border-l-4 border-l-emerald-500 shadow-[0_10px_30px_rgba(15,23,42,0.02)]">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-xl text-emerald-500 bg-emerald-50">
            <SvgBoxes />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Catalog Items</p>
            <p className="text-2xl font-black text-[#0f172a] mt-0.5">{loading ? "..." : filteredInventory.length}</p>
          </div>
        </div>
      </div>

      {/* ================= DATATABLE COMPONENT ================= */}
      <div className="bg-white border border-slate-200 rounded-[2rem] shadow-[0_10px_30px_rgba(15,23,42,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-bold uppercase tracking-wider text-slate-500">
                <th className="p-5 pl-8">Product Name</th>
                <th className="p-5">Store</th>
                <th className="p-5">SKU / Package</th>
                <th className="p-5">Pricing</th>
                <th className="p-5">Current Stock</th>
                <th className="p-5">Available</th>
                <th className="p-5">Reserved</th>
                <th className="p-5">Aisle Status</th>
                <th className="p-5">Internal Note</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="9" className="p-12 text-center text-slate-400 font-bold">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-2.5 w-2.5 bg-[#ff7e00] rounded-full animate-bounce"></div>
                      <div className="h-2.5 w-2.5 bg-[#ff7e00] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="h-2.5 w-2.5 bg-[#ff7e00] rounded-full animate-bounce [animation-delay:0.4s]"></div>
                      <span>Syncing with Store Database...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-12 text-center text-slate-450 font-bold italic text-slate-400">
                    No active inventory logs found for this store.
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => {
                  const product = item?.variant?.product;
                  const variant = item?.variant;
                  const status = getStatus(item);

                  return (
                    <tr key={item?._id} className="transition-colors hover:bg-slate-50/50">
                      <td className="p-4 pl-8">
                        <div className="flex items-center gap-3">
                          <img
                            src={variant?.thumbnail || product?.thumbnail || "/logo.png"}
                            alt={product?.name}
                            className="h-12 w-12 rounded-xl object-cover bg-slate-100 border border-slate-150 shadow-sm"
                          />
                          <div>
                            <p className="font-bold text-[#0f172a]">{product?.name || "-"}</p>
                            <p className="text-xs text-slate-400 font-bold">{product?.brand?.name || "-"}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 text-slate-600 font-bold">{item?.store?.name || "-"}</td>

                      <td className="p-4">
                        <p className="font-bold text-[#0f172a]">{variant?.sku || "-"}</p>
                        <p className="text-xs text-slate-400 font-bold">
                          {variant?.weight || "-"} {variant?.unit || ""}
                        </p>
                      </td>

                      <td className="p-4">
                        <p className="font-extrabold text-green-600">₹{variant?.sellingPrice || "-"}</p>
                        <p className="text-xs text-slate-400 font-bold line-through">₹{variant?.mrp || "-"}</p>
                      </td>

                      <td className="p-4 font-bold text-[#0f172a]">
                        {item?.stock}{" "}
                        <span className="text-xs font-bold text-slate-400">
                          / Min {item?.lowStockThreshold}
                        </span>
                      </td>

                      <td className="p-4 font-bold text-green-600">{item?.availableStock}</td>
                      <td className="p-4 font-bold text-amber-500">{item?.reservedStock}</td>

                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border ${
                            status === "Healthy"
                              ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                              : status === "Low Stock"
                              ? "bg-amber-50 border-amber-200 text-amber-500"
                              : "bg-rose-50 border-rose-200 text-rose-500"
                          }`}
                        >
                          {status}
                        </span>
                      </td>

                      <td className="p-4 text-slate-400 text-xs italic font-semibold">{item?.note || "-"}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= POPUP FORM MODAL ================= */}
      {showPopup && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-md overflow-y-auto py-6">
          <div className="w-full max-w-3xl bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-2xl relative animate-in fade-in zoom-in duration-300 max-h-[calc(100vh-3rem)] overflow-y-auto">
            <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#ff7e00]">
                  Action Panel
                </p>
                <h2 className="mt-1 text-2xl font-black text-[#0f172a]">Add Store Stock</h2>
              </div>

              <button
                type="button"
                onClick={closePopup}
                className="rounded-full bg-slate-100 p-2.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500 cursor-pointer"
              >
                <SvgTimes />
              </button>
            </div>

            <form onSubmit={handleCreateInventory} className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-black uppercase text-[#64748b] tracking-wider pl-1">
                  Target Store
                </label>
                <select
                  name="store"
                  value={formData.store}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-[#0f172a] outline-none focus:bg-white focus:border-[#ff7e00] font-bold cursor-pointer"
                >
                  <option value="">Select store</option>
                  {stores.map((store) => (
                    <option key={store?._id} value={store?._id}>
                      {store?.name}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Variant ID / SKU"
                name="variant"
                value={formData.variant}
                onChange={handleChange}
                placeholder="Paste a variant ID or SKU here"
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
                placeholder="E.g., 10"
              />

              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-black uppercase text-[#64748b] tracking-wider pl-1">
                    Variant rows
                  </p>
                  <button
                    type="button"
                    onClick={handleAddVariantRow}
                    className="text-[#ff7e00] font-bold text-sm hover:underline"
                  >
                    + Add variant
                  </button>
                </div>

                <div className="space-y-5">
                  {formData.variants.map((variantRow, index) => (
                    <div
                      key={index}
                      className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                    >
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <p className="text-sm font-black text-slate-700 tracking-wide">
                          Variant {index + 1}
                        </p>
                        {formData.variants.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveVariantRow(index)}
                            className="text-rose-500 text-sm font-bold hover:text-rose-600"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Input
                          label="Variant ID / SKU"
                          name="variant"
                          value={variantRow.variant}
                          onChange={(e) => handleVariantChange(index, "variant", e.target.value)}
                          placeholder="Paste variant ID or SKU"
                          required
                        />

                        <Input
                          label="Opening Stock"
                          name="stock"
                          type="number"
                          value={variantRow.stock}
                          onChange={(e) => handleVariantChange(index, "stock", e.target.value)}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
                        <Input
                          label="Low Stock Threshold"
                          name="lowStockThreshold"
                          type="number"
                          value={variantRow.lowStockThreshold}
                          onChange={(e) => handleVariantChange(index, "lowStockThreshold", e.target.value)}
                          required
                        />

                        <Input
                          label="Max Order Quantity"
                          name="maxOrderQuantity"
                          type="number"
                          value={variantRow.maxOrderQuantity}
                          onChange={(e) => handleVariantChange(index, "maxOrderQuantity", e.target.value)}
                          placeholder="E.g., 10"
                        />
                      </div>

                      <div className="mt-4">
                        <label className="mb-1.5 block text-xs font-black uppercase text-[#64748b] tracking-wider pl-1">
                          Note
                        </label>
                        <textarea
                          name="note"
                          rows="2"
                          value={variantRow.note}
                          onChange={(e) => handleVariantChange(index, "note", e.target.value)}
                          placeholder="E.g., Fast moving item"
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-[#0f172a] outline-none focus:bg-white focus:border-[#ff7e00] font-bold resize-none placeholder-slate-400"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
                <button
                  type="button"
                  onClick={closePopup}
                  className="px-6 py-3 bg-slate-100 text-slate-500 font-bold rounded-xl hover:bg-slate-200 transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-8 py-3 bg-[#ff7e00] hover:bg-[#e06f00] text-white font-bold rounded-xl transition-all cursor-pointer shadow-md"
                >
                  Register Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= INLINE TOAST SYSTEM ================= */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-[1000] flex items-center p-4 rounded-2xl shadow-2xl bg-white border-l-4 border-l-[#ff7e00] border border-slate-100 animate-slide-in">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#ff7e00] animate-ping" />
            <p className="text-sm font-black text-slate-800">{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Generic Input element helper to maintain pristine typography spacing and responsiveness
const Input = ({ label, ...props }) => {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-black uppercase text-[#64748b] tracking-wider pl-1">
        {label}
      </label>
      <input
        {...props}
        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-[#0f172a] outline-none focus:bg-white focus:border-[#ff7e00] font-bold placeholder-slate-400"
      />
    </div>
  );
};

export default Inventory;