import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import { showSuccess, showError } from "../../../utils/alertService";
import { FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";
import {
  createInventoryApi,
  toggleInventoryStatusApi,
  getInventoryByStoreIdApi,
  getAllStoresApi,
  updateInventoryStockApi,
  getAllVariantsApi,
} from "../../../api/admin.api";
import TableComponent from "../../../components/global/TableComponent";

// ─── Icon ─────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 18, className = "" }) => (
  <i className={`ti ti-${name} ${className}`} style={{ fontSize: size }} aria-hidden="true" />
);

// ─── Normalize inventory response ─────────────────────────────────────────────
const normalizeInventory = (res) => {
  if (!res) { console.warn("❌ Response is null/undefined"); return []; }
  if (!res?.success) { console.warn("❌ Response success is false:", res); return []; }

  // API returns: { success, data: { inventory: [...], pagination: {...} } }
  let arr =
    Array.isArray(res?.data?.inventory) ? res.data.inventory :   // ✅ actual shape
    Array.isArray(res?.data)            ? res.data            :   // flat array fallback
    Array.isArray(res?.inventory)       ? res.inventory       :
    Array.isArray(res?.items)           ? res.items           : null;

  if (!arr) { console.error("❌ Could not find array in response:", res); return []; }

  return arr.map((item) => {
  console.log(" Inventory Item:", item);
  console.log(" isAvailable:", item?.isAvailable);

  const variant = item?.variant || {};
  const product = variant?.product || {};
  const store = item?.store || {};
  const brand = product?.brand || {};
  const category = product?.category || {};

  return {
    _id: item?._id,
    storeId: store?._id,
    storeName: store?.name || "—",
    storeAddress: store?.address || "",

    productName: product?.name || "—",
    productSlug: product?.slug || "",

    thumbnail: variant?.thumbnail || product?.thumbnail || "",
    brandName: brand?.name || "—",
    categoryName: category?.name || "—",

    variantId: variant?._id,
    sku: variant?.sku || "—",
    weight: variant?.weight ?? "",
    unit: variant?.unit || "",
    attributes: variant?.attributes || {},

    mrp: Number(variant?.mrp || 0),
    sellingPrice: Number(variant?.sellingPrice || 0),
    isDefault: variant?.isDefault || false,

    stock: Number(item?.stock || 0),
    reservedStock: Number(item?.reservedStock || 0),
    availableStock: Number(item?.availableStock || 0),

    lowStockThreshold: Number(item?.lowStockThreshold || 0),
    maxOrderQuantity: Number(item?.maxOrderQuantity || 0),

    // 👇 Important
    isAvailable: item?.isAvailable,

    isDeleted: item?.isDeleted || false,
    lastRestockedAt: item?.lastRestockedAt || null,
    note: item?.note || "",

    createdAt: item?.createdAt || null,
    updatedAt: item?.updatedAt || null,
  };
});
};

const normalizeStores = (res) => {
  if (!res) return [];
  return (
    Array.isArray(res?.data) ? res.data :
    Array.isArray(res?.data?.data) ? res.data.data :
    Array.isArray(res?.data?.stores) ? res.data.stores :
    Array.isArray(res?.stores) ? res.stores : []
  );
};

// ─── Status helpers ────────────────────────────────────────────────────────────
const getStatus = (item) => {
  if (!item.isAvailable || item.availableStock === 0) return "out";
  if (item.availableStock <= item.lowStockThreshold) return "low";
  return "healthy";
};

const STATUS_META = {
  healthy: { label: "Healthy", icon: "circle-check", cls: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  low:     { label: "Low stock", icon: "alert-triangle", cls: "bg-amber-50 text-amber-700 border border-amber-200" },
  out:     { label: "Out of stock", icon: "circle-x", cls: "bg-rose-50 text-rose-700 border border-rose-200" },
};

// ─── Stock bar ────────────────────────────────────────────────────────────────
const StockBar = ({ item }) => {
  const status = getStatus(item);
  const max = Math.max(item.stock, 1);
  const pct = Math.round((item.availableStock / max) * 100);
  const color = status === "out" ? "#e24b4a" : status === "low" ? "#ef9f27" : "#22c55e";
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex justify-between items-baseline">
        <span className="text-sm font-bold text-[#0f172a]">{item.stock}</span>
        <span className="text-[10px] text-slate-400 font-semibold">min {item.lowStockThreshold}</span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(pct, 100)}%`, background: color }} />
      </div>
    </div>
  );
};

// ─── Variant Selector Dropdown ────────────────────────────────────────────────
const VariantSelector = ({ value, onChange, allVariants, variantsLoading }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = allVariants.find((v) => v._id === value);
  const filtered = useMemo(() => {
    if (!query.trim()) return allVariants;
    const q = query.toLowerCase();
    return allVariants.filter((v) =>
      v.productName?.toLowerCase().includes(q) ||
      v.sku?.toLowerCase().includes(q) ||
      v._id?.toLowerCase().includes(q)
    );
  }, [allVariants, query]);

  const handleSelect = (v) => { onChange(v._id); setQuery(""); setOpen(false); };
  const handleClear = (e) => { e.stopPropagation(); onChange(""); setQuery(""); };

  return (
    <div ref={ref} className="relative w-full">
      <div
        onClick={() => !variantsLoading && setOpen((p) => !p)}
        className={`w-full flex items-center gap-3 bg-white border rounded-xl px-4 py-3 cursor-pointer transition-all
          ${open ? "border-[#ff7e00] ring-2 ring-[#ff7e00]/10" : "border-slate-200 hover:border-slate-300"}
          ${variantsLoading ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        {selected ? (
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-100 bg-slate-50 shrink-0">
              {selected.thumbnail
                ? <img src={selected.thumbnail} className="w-full h-full object-cover" alt="" />
                : <div className="w-full h-full flex items-center justify-center"><Icon name="package" size={14} className="text-slate-300" /></div>
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#0f172a] truncate">{selected.productName}</p>
              <p className="text-[10px] text-slate-400 font-semibold">
                {selected.sku} · {selected.weight}{selected.unit}
                {selected.flavour && ` · ${selected.flavour}`}
              </p>
            </div>
            <button type="button" onClick={handleClear} className="text-slate-300 hover:text-slate-500 cursor-pointer shrink-0">
              <Icon name="x" size={14} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 flex-1 text-slate-400">
            {variantsLoading
              ? <><div className="w-3.5 h-3.5 border-2 border-slate-200 border-t-orange-400 rounded-full animate-spin" /><span className="text-sm font-semibold">Loading variants...</span></>
              : <><Icon name="search" size={14} /><span className="text-sm font-semibold">Search by product name or SKU...</span></>
            }
          </div>
        )}
        <Icon name={open ? "chevron-up" : "chevron-down"} size={14} className="text-slate-400 shrink-0" />
      </div>

      {open && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-3 pt-3 pb-2">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
              <Icon name="search" size={13} className="text-slate-400 shrink-0" />
              <input autoFocus type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder="Search product, SKU..."
                className="w-full bg-transparent text-sm font-semibold text-[#0f172a] outline-none placeholder-slate-300" />
              {query && (
                <button type="button" onClick={() => setQuery("")} className="text-slate-300 hover:text-slate-500 cursor-pointer">
                  <Icon name="x" size={12} />
                </button>
              )}
            </div>
          </div>
          <div className="max-h-56 overflow-y-auto divide-y divide-slate-50">
            {filtered.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-400 font-semibold">No variants found</div>
            ) : filtered.map((v) => (
              <div key={v._id} onClick={() => handleSelect(v)}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-orange-50/60 transition-colors ${value === v._id ? "bg-orange-50" : ""}`}>
                <div className="w-9 h-9 rounded-xl overflow-hidden border border-slate-100 bg-slate-50 shrink-0">
                  {v.thumbnail
                    ? <img src={v.thumbnail} className="w-full h-full object-cover" alt="" />
                    : <div className="w-full h-full flex items-center justify-center"><Icon name="package" size={16} className="text-slate-300" /></div>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#0f172a] truncate">{v.productName}</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{v.sku}</span>
                    <span className="text-[10px] text-slate-400 font-semibold">{v.weight}{v.unit}</span>
                    {v.flavour && <span className="text-[10px] text-orange-500 font-semibold">{v.flavour}</span>}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-black text-emerald-600">₹{v.sellingPrice}</p>
                  <p className="text-[10px] text-slate-400 line-through">₹{v.mrp}</p>
                </div>
                {value === v._id && <Icon name="check" size={14} className="text-[#ff7e00] shrink-0" />}
              </div>
            ))}
          </div>
          <div className="px-4 py-2 border-t border-slate-100 text-[10px] text-slate-400 font-semibold">
            {filtered.length} variant{filtered.length !== 1 ? "s" : ""} available
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Variant Row in modal ─────────────────────────────────────────────────────
const emptyVariant = () => ({ variant: "", stock: "", lowStockThreshold: "", maxOrderQuantity: "", note: "" });

const VariantRow = ({ idx, data, onChange, onRemove, showRemove, allVariants, variantsLoading }) => {
  const field = (name) => ({ value: data[name], onChange: (e) => onChange(idx, name, e.target.value) });
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-black uppercase tracking-wider text-slate-500">Variant {idx + 1}</span>
        {showRemove && (
          <button type="button" onClick={() => onRemove(idx)}
            className="text-rose-500 hover:text-rose-700 text-xs font-bold flex items-center gap-1 cursor-pointer">
            <Icon name="trash" size={12} /> Remove
          </button>
        )}
      </div>
      <div>
        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
          Select Variant <span className="text-orange-400">*</span>
        </label>
        <VariantSelector value={data.variant} onChange={(val) => onChange(idx, "variant", val)}
          allVariants={allVariants} variantsLoading={variantsLoading} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { name: "stock", label: "Opening Stock", req: true, placeholder: "100" },
          { name: "lowStockThreshold", label: "Low Stock Alert", placeholder: "5" },
          { name: "maxOrderQuantity", label: "Max Order Qty", placeholder: "10" },
        ].map(({ name, label, req, placeholder }) => (
          <div key={name}>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
              {label} {req && <span className="text-orange-400">*</span>}
            </label>
            <input type="number" min={name === "maxOrderQuantity" ? "1" : "0"} required={!!req}
              placeholder={placeholder}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-[#0f172a] outline-none focus:border-[#ff7e00] focus:ring-2 focus:ring-[#ff7e00]/10 transition-all placeholder-slate-300"
              {...field(name)} />
          </div>
        ))}
      </div>
      <div>
        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Note</label>
        <input type="text" placeholder="e.g. Fast moving item"
          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-[#0f172a] outline-none focus:border-[#ff7e00] focus:ring-2 focus:ring-[#ff7e00]/10 transition-all placeholder-slate-300"
          {...field("note")} />
      </div>
    </div>
  );
};

// ─── columns builder — receives stable callback refs ──────────────────────────
const buildColumns = (onToggleStatus, onUpdateStock) => [
  {
    key: "productName",
    label: "Product / Variant",
    render: (_, row) => {
      const attrs = Object.entries(row.attributes || {}).map(([k, v]) => `${k}: ${v}`).join(" · ");
      return (
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl overflow-hidden border border-slate-100 bg-slate-50 shrink-0">
            {row.thumbnail
              ? <img src={row.thumbnail} alt={row.productName} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center"><Icon name="package" size={20} className="text-slate-300" /></div>
            }
          </div>
          <div>
            <p className="text-sm font-bold text-[#0f172a] leading-tight">{row.productName}</p>
            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">{row.sku} · {row.weight}{row.unit}</p>
            {attrs && <p className="text-[10px] text-slate-400 font-semibold italic mt-0.5">{attrs}</p>}
            <p className="text-[10px] text-slate-300 font-mono mt-0.5 truncate max-w-[160px]" title={row.variantId}>{row.variantId}</p>
          </div>
        </div>
      );
    },
  },
  {
    key: "storeName",
    label: "Store",
    render: (_, row) => (
      <div>
        <p className="text-sm font-bold text-[#0f172a]">{row.storeName}</p>
        <p className="text-[11px] text-slate-400 font-semibold">{row.brandName}</p>
        <p className="text-[10px] text-slate-300 font-semibold">{row.categoryName}</p>
      </div>
    ),
  },
  {
    key: "sellingPrice",
    label: "Pricing",
    render: (_, row) => (
      <div>
        <p className="text-sm font-black text-emerald-600">₹{row.sellingPrice}</p>
        <p className="text-[11px] text-slate-400 font-semibold line-through">₹{row.mrp}</p>
        {row.mrp > row.sellingPrice && (
          <p className="text-[10px] font-bold text-[#ff7e00]">
            {Math.round(((row.mrp - row.sellingPrice) / row.mrp) * 100)}% off
          </p>
        )}
      </div>
    ),
  },
  {
    key: "stock",
    label: "Stock",
    render: (_, row) => <StockBar item={row} />,
  },
  {
    key: "availableStock",
    label: "Available",
    render: (val) => <span className="text-sm font-black text-emerald-600">{val}</span>,
  },
  {
    key: "reservedStock",
    label: "Reserved",
    render: (val) => <span className="text-sm font-black text-amber-500">{val}</span>,
  },
  {
    key: "maxOrderQuantity",
    label: "Max Order",
    render: (val) => <span className="text-sm font-bold text-slate-500">{val}</span>,
  },
  {
    key: "isAvailable",
    label: "Status",
    render: (_, row) => {
      const status = getStatus(row);
      const meta = STATUS_META[status];
      return (
        <div className="flex flex-col gap-1.5">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${meta.cls}`}>
            <Icon name={meta.icon} size={10} /> {meta.label}
          </span>
          {row.note && (
            <p className="text-[10px] text-slate-400 italic font-semibold max-w-[120px] truncate" title={row.note}>{row.note}</p>
          )}
        </div>
      );
    },
  },
  {
    key: "lastRestockedAt",
    label: "Last Restock",
    render: (val) => (
      <span className="text-xs text-slate-500 font-semibold">
        {val ? new Date(val).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" }) : "—"}
      </span>
    ),
  },
  {
    key: "_id",
    label: "Actions",
    render: (_, row) => (
      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdateStock(row)}
          className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
        >
          <Icon name="pencil" size={11} /> Update
        </button>
        <button
          onClick={() => onToggleStatus(row)}
          className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center gap-1
            ${row.isAvailable
              ? "bg-rose-50 hover:bg-rose-100 text-rose-600"
              : "bg-emerald-50 hover:bg-emerald-100 text-emerald-600"
            }`}
        >
          <Icon name={row.isAvailable ? "eye-off" : "eye"} size={11} />
          {row.isAvailable ? "Disable" : "Enable"}
        </button>
      </div>
    ),
  },
];

// ─── Main component ───────────────────────────────────────────────────────────
const Inventory = () => {
  const dispatch = useDispatch();

  const [stores, setStores] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [allVariants, setAllVariants] = useState([]);
  const [variantsLoading, setVariantsLoading] = useState(false);

  const [selectedStoreId, setSelectedStoreId] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [fetchLoading, setFetchLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formStore, setFormStore] = useState("");
  const [variants, setVariants] = useState([emptyVariant()]);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  // ── load stores ───────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAllStoresApi(1, 100);
        const list = normalizeStores(res);
        setStores(list);
        if (list.length) { setSelectedStoreId(list[0]?._id || ""); setFormStore(list[0]?._id || ""); }
      } catch { showError("Failed to load stores"); }
    };
    load();
  }, []);

  // ── load all variants once ────────────────────────────────────────────────
  useEffect(() => {
    const loadVariants = async () => {
      setVariantsLoading(true);
      try {
        const res = await getAllVariantsApi(1, 200);
        if (res?.success && Array.isArray(res.data)) {
          setAllVariants(res.data.map((v) => ({
            _id: v._id,
            productId: v.product?._id || "",
            productName: v.product?.name || "Unknown Product",
            thumbnail: v.thumbnail || v.product?.thumbnail || "",
            sku: v.sku || "—",
            weight: v.weight ?? "",
            unit: v.unit || "",
            mrp: Number(v.mrp || 0),
            sellingPrice: Number(v.sellingPrice || 0),
            isDefault: v.isDefault || false,
            flavour: v.attributes?.flavour || v.attributes?.flavor || "",
          })));
        }
      } catch { showError("Failed to load variants"); }
      finally { setVariantsLoading(false); }
    };
    loadVariants();
  }, []);

  // ── load inventory ────────────────────────────────────────────────────────
  const fetchInventory = useCallback(async (storeId) => {
    if (!storeId) return;
    try {
      setFetchLoading(true);
      const res = await getInventoryByStoreIdApi(storeId, 1, 50);
      // console.log("Inventory Response:", res.data.inventory);
      setInventory(normalizeInventory(res));
      setPagination(res?.data?.pagination || res?.pagination || { total: 0, page: 1, totalPages: 1 });
    } catch { showError("Failed to fetch inventory"); }
    finally { setFetchLoading(false); }
  }, []);

  useEffect(() => {
    if (selectedStoreId) fetchInventory(selectedStoreId);
  }, [selectedStoreId, fetchInventory, refetchTrigger]);

  // ── action handlers (useCallback so columns memo stays stable) ────────────
 const handleToggleStatus = useCallback(async (row) => {
  try {
    dispatch(showLoader());

    console.log("Inventory ID:", row._id);


    const res = await toggleInventoryStatusApi(row._id, { isAvailable: !row.isAvailable });

console.log("Toggle API Response:", res.data || res);
    if (res?.success) {
      console.log("Before:", row.isAvailable);
console.log("Response:", res);

await fetchInventory(selectedStoreId);
      setRefetchTrigger((p) => p + 1);
    } else {
      showError(res?.message || "Failed");
    }
  } catch (err) {
    console.log("Toggle Error:", err);
    showError(err?.message || "Something went wrong");
  } finally {
    dispatch(hideLoader());
  }
}, [dispatch]);

 const handleUpdateStock = useCallback(async (row) => {
  const { value: qty } = await Swal.fire({
    title: "Update Inventory Stock",
    text: `Current Stock: ${row.stock}`,
    input: "number",
    inputValue: row.stock,
    inputLabel: "Enter New Stock Quantity",
    inputAttributes: {
      min: 0,
    },
    showCancelButton: true,
    confirmButtonText: "Update Stock",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#ff7e00",
    reverseButtons: true,
    inputValidator: (value) => {
      if (value === "" || value === null) {
        return "Please enter stock quantity";
      }

      if (Number(value) < 0) {
        return "Stock cannot be negative";
      }

      return null;
    },
  });

  if (qty === undefined) return;

  try {
    dispatch(showLoader());

    const res = await updateInventoryStockApi(row._id, {
      stock: Number(qty),
    });

    if (res?.success) {
      showSuccess(res?.message || "Stock updated successfully");
      setRefetchTrigger((prev) => prev + 1);
    } else {
      showError(res?.message || "Failed to update stock");
    }
  } catch (err) {
    showError(err?.message || "Something went wrong");
  } finally {
    dispatch(hideLoader());
  }
}, [dispatch]);

  // ── columns — rebuilt only when action handlers change (stable) ───────────
  const columns = useMemo(
    () => buildColumns(handleToggleStatus, handleUpdateStock),
    [handleToggleStatus, handleUpdateStock]
  );

  // ── derived ───────────────────────────────────────────────────────────────
  const filteredByStatus = useMemo(() => {
    if (statusFilter === "all") return inventory;
    return inventory.filter((item) => getStatus(item) === statusFilter);
  }, [inventory, statusFilter]);

  const metrics = useMemo(() => ({
    totalStock: inventory.reduce((s, i) => s + i.stock, 0),
    totalItems: inventory.length,
    healthy: inventory.filter((i) => getStatus(i) === "healthy").length,
    low: inventory.filter((i) => getStatus(i) === "low").length,
    out: inventory.filter((i) => getStatus(i) === "out").length,
    totalValue: inventory.reduce((s, i) => s + i.sellingPrice * i.availableStock, 0),
  }), [inventory]);

  const selectedStore = useMemo(
    () => stores.find((s) => s._id === selectedStoreId),
    [stores, selectedStoreId]
  );

  // ── form handlers ─────────────────────────────────────────────────────────
  const handleVariantChange = (idx, name, value) =>
    setVariants((prev) => prev.map((v, i) => (i === idx ? { ...v, [name]: value } : v)));

  const addVariantRow = () => setVariants((prev) => [...prev, emptyVariant()]);
  const removeVariantRow = (idx) => setVariants((prev) => prev.filter((_, i) => i !== idx));

  const openModal = () => {
    setVariants([emptyVariant()]);
    setFormStore(selectedStoreId || stores[0]?._id || "");
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => setVariants([emptyVariant()]), 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validVariants = variants.filter((v) => v.variant.trim() && v.stock !== "");
    if (!formStore) return showError("Please select a store");
    if (!validVariants.length) return showError("Select at least one variant and enter stock");
    const payload = {
      store: formStore,
      variants: validVariants.map((v) => ({
        variant: v.variant.trim(),
        stock: Number(v.stock),
        lowStockThreshold: Number(v.lowStockThreshold || 5),
        maxOrderQuantity: Number(v.maxOrderQuantity || 10),
        note: v.note.trim(),
      })),
    };
    try {
      setSubmitting(true);
      dispatch(showLoader());
      const res = await createInventoryApi(payload);
      if (res?.success) {
        showSuccess(res?.message || "Stock added successfully");
        closeModal();
        setRefetchTrigger((prev) => prev + 1);
      } else {
        showError(res?.message || "Failed to add stock");
      }
    } catch { showError("Server error — please try again"); }
    finally { setSubmitting(false); dispatch(hideLoader()); }
  };

  // ── export CSV ────────────────────────────────────────────────────────────
  const exportCSV = () => {
    const headers = ["Product", "SKU", "Brand", "Weight", "Store", "Stock", "Available", "Reserved", "Low Threshold", "Max Order", "Selling Price", "MRP", "Status", "Last Restock", "Note"];
    const rows = filteredByStatus.map((i) => [
      i.productName, i.sku, i.brandName, `${i.weight}${i.unit}`, i.storeName,
      i.stock, i.availableStock, i.reservedStock, i.lowStockThreshold, i.maxOrderQuantity,
      i.sellingPrice, i.mrp, getStatus(i),
      i.lastRestockedAt ? new Date(i.lastRestockedAt).toLocaleDateString() : "", i.note,
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    a.download = `inventory-${selectedStore?.name || "all"}-${Date.now()}.csv`;
    a.click();
  };

  // ─── render ───────────────────────────────────────────────────────────────
  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-[#f8fafc] font-sans antialiased text-[#1e293b]">

      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff7e00] mb-1">Store operations</p>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0f172a] tracking-tight">
            Inventory <span className="text-[#ff7e00]">tracking</span>
          </h1>
          {selectedStore && (
            <p className="mt-1 text-sm text-slate-500 font-semibold flex items-center gap-1.5">
              <Icon name="building-store" size={13} className="text-[#ff7e00]" />
              {selectedStore.name}{selectedStore.address && ` · ${selectedStore.address}`}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer">
            <Icon name="download" size={15} /> Export CSV
          </button>
        </div>
      </div>

      {/* ── STORE SELECTOR ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3">
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Store</label>
          <select value={selectedStoreId} onChange={(e) => setSelectedStoreId(e.target.value)}
            className="w-full text-sm font-bold text-[#0f172a] bg-transparent outline-none cursor-pointer">
            {stores.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
        </div>
      </div>

      {/* ── METRICS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {[
          { label: "Total stock", value: metrics.totalStock.toLocaleString(), icon: "packages", color: "text-[#ff7e00]", filter: null },
          { label: "Total items", value: metrics.totalItems, icon: "box", color: "text-slate-500", filter: null },
          { label: "Healthy", value: metrics.healthy, icon: "circle-check", color: "text-emerald-600", filter: "healthy" },
          { label: "Low stock", value: metrics.low, icon: "alert-triangle", color: "text-amber-600", filter: "low" },
          { label: "Out of stock", value: metrics.out, icon: "circle-x", color: "text-rose-600", filter: "out" },
          { label: "Stock value", value: `₹${metrics.totalValue.toLocaleString("en-IN")}`, icon: "currency-rupee", color: "text-blue-600", filter: null },
        ].map(({ label, value, icon, color, filter }) => (
          <div key={label}
            onClick={() => filter && setStatusFilter((f) => f === filter ? "all" : filter)}
            className={`bg-white border rounded-2xl px-4 py-3.5 transition-all
              ${filter ? "cursor-pointer hover:border-slate-300 hover:shadow-sm" : ""}
              ${statusFilter === filter ? "border-[#ff7e00] shadow-[0_0_0_2px_rgba(255,126,0,0.1)]" : "border-slate-200"}`}>
            <div className={`text-xl mb-1 ${color}`}><Icon name={icon} size={18} /></div>
            <div className="text-lg font-black text-[#0f172a]">{value}</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* ── STATUS FILTER TABS ── */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {["all", "healthy", "low", "out"].map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer
              ${statusFilter === s ? "bg-[#ff7e00] text-white shadow-sm" : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
            {s === "all" ? `All (${inventory.length})` :
             s === "healthy" ? `Healthy (${metrics.healthy})` :
             s === "low" ? `Low stock (${metrics.low})` :
             `Out of stock (${metrics.out})`}
          </button>
        ))}
      </div>

      {/* ── TABLE ── */}
      <TableComponent
        title="Inventory Records"
        subtitle={selectedStore ? `Showing stock for ${selectedStore.name}` : "Select a store to view inventory"}
        columns={columns}
        data={filteredByStatus}
        searchPlaceholder="Search by product, SKU, brand or variant ID..."
        showSearch={true}
        showIndex={false}
        loading={fetchLoading}
        addButtonText="Add stock"
        onAdd={openModal}
        onRefresh={() => setRefetchTrigger((prev) => prev + 1)}
      />

      {/* Pagination info */}
      {!fetchLoading && filteredByStatus.length > 0 && (
        <div className="mt-3 flex justify-end">
          <p className="text-xs text-slate-400 font-semibold">
            {pagination.total} total records · Page {pagination.page} of {pagination.totalPages} · Last synced: {new Date().toLocaleTimeString("en-IN")}
          </p>
        </div>
      )}

      {/* ── ADD STOCK MODAL ── */}
      {showModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-white border border-slate-100 rounded-[2rem] shadow-[0_30px_60px_rgba(15,23,42,0.15)] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff7e00]">Stock management</p>
                <h2 className="text-xl font-black text-[#0f172a] mt-0.5">Add stock</h2>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
                  {allVariants.length} variants loaded
                </span>
               <button
  onClick={closeModal}
  className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-800 cursor-pointer transition-all"
>
  <FaTimes size={16} />
</button>
              </div>
            </div>

            <div className="px-6 py-5 max-h-[70vh] overflow-y-auto space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                  Store <span className="text-orange-400">*</span>
                </label>
                <select value={formStore} onChange={(e) => setFormStore(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-[#0f172a] outline-none focus:border-[#ff7e00] cursor-pointer">
                  <option value="">Select a store</option>
                  {stores.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Variants ({variants.length})
                  </label>
                  <button type="button" onClick={addVariantRow}
                    className="text-[#ff7e00] text-xs font-bold flex items-center gap-1 hover:text-[#e06f00] cursor-pointer">
                    <Icon name="plus" size={12} /> Add another variant
                  </button>
                </div>
                <div className="space-y-3">
                  {variants.map((v, idx) => (
                    <VariantRow key={idx} idx={idx} data={v} onChange={handleVariantChange}
                      onRemove={removeVariantRow} showRemove={variants.length > 1}
                      allVariants={allVariants} variantsLoading={variantsLoading} />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100">
              <button type="button" onClick={closeModal}
                className="px-5 py-2.5 text-sm font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer">
                Cancel
              </button>
              <button onClick={handleSubmit} disabled={submitting}
                className="px-6 py-2.5 text-sm font-bold text-white bg-[#ff7e00] hover:bg-[#e06f00] rounded-xl shadow-md transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2">
                {submitting
                  ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                  : <><Icon name="check" size={14} /> Register stock</>
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;