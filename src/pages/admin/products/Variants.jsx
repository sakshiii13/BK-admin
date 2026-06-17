import React, { useState, useEffect, useCallback } from "react";
import {
  getAllVariantsApi,
  getVariantByIdApi,
  updateVariantApi,
  toggleVariantStatusApi,
} from "../../../api/admin.api";
import Swal from "sweetalert2";
import {
  Package, Tag, Weight, ToggleLeft, ToggleRight, Pencil, X, Check,
  ChevronRight, Barcode, ShoppingBag, Layers, AlertCircle, ImageOff,
  ArrowUpDown, Star, Search,
} from "lucide-react";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const pct = (mrp, sp) => (mrp > 0 ? Math.round(((mrp - sp) / mrp) * 100) : 0);

const fmt = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n ?? 0);

// ─── Status Badge ─────────────────────────────────────────────────────────────

const StatusBadge = ({ active }) => (
  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border
    ${active ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-red-50 text-red-500 border-red-200"}`}>
    <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-red-400"}`} />
    {active ? "Active" : "Inactive"}
  </span>
);

// ─── Edit Modal ───────────────────────────────────────────────────────────────

const EditModal = ({ variant, onClose, onSave }) => {
  const [form, setForm] = useState({
    sku: variant.sku || "",
    barcode: variant.barcode || "",
    unit: variant.unit || "",
    weight: variant.weight || "",
    mrp: variant.mrp || "",
    sellingPrice: variant.sellingPrice || "",
    sortOrder: variant.sortOrder ?? 0,
    isDefault: variant.isDefault || false,
  });
  const [errors, setErrors] = useState([]);
  const [saving, setSaving] = useState(false);

  const handle = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    setErrors([]);
    try {
      const res = await updateVariantApi(variant._id, form);
      if (res?.success) {
        onSave(res.data);
        Swal.fire({ icon: "success", title: "Saved!", text: res.message || "Variant updated.", timer: 1800, showConfirmButton: false });
      } else throw new Error(res?.message || "Update failed");
    } catch (err) {
      if (err?.errors) setErrors(err.errors);
      else setErrors([err.message || "Something went wrong"]);
    } finally {
      setSaving(false);
    }
  };

  const Field = ({ label, name, type = "text" }) => (
    <div>
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5 block">{label}</label>
      <input
        type={type} name={name} value={form[name]} onChange={handle}
        className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:bg-white"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div>
            <p className="text-[10px] font-black tracking-widest uppercase text-orange-500">Edit Variant</p>
            <p className="text-sm font-bold text-slate-800 mt-0.5">{variant.product?.name} — {variant.sku}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors shadow-sm">
            <X size={16} />
          </button>
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <div className="mx-6 mt-4 rounded-xl bg-red-50 border border-red-200 p-3 space-y-1">
            {errors.map((e, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-red-600">
                <AlertCircle size={13} className="mt-0.5 shrink-0" /> {e}
              </div>
            ))}
          </div>
        )}

        {/* Form */}
        <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <Field label="SKU" name="sku" />
            <Field label="Barcode" name="barcode" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5 block">Unit</label>
              <select name="unit" value={form.unit} onChange={handle}
                className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:bg-white">
                <option value="">Select unit</option>
                {["g", "kg", "ml", "l", "pcs", "pack"].map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <Field label="Weight / Qty" name="weight" type="number" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="MRP (₹)" name="mrp" type="number" />
            <Field label="Selling Price (₹)" name="sellingPrice" type="number" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Sort Order" name="sortOrder" type="number" />
            <div className="flex flex-col justify-end">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5 block">Default Variant</label>
              <div onClick={() => setForm((f) => ({ ...f, isDefault: !f.isDefault }))}
                className={`w-12 h-6 rounded-full cursor-pointer transition-all flex items-center px-0.5 ${form.isDefault ? "bg-orange-500" : "bg-slate-200"}`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${form.isDefault ? "translate-x-6" : "translate-x-0"}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50">
          <button onClick={onClose} className="flex-1 h-11 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={saving}
            className="flex-1 h-11 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-60 shadow-md shadow-orange-200">
            {saving ? "Saving..." : <><Check size={16} /> Save Changes</>}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Detail Drawer ────────────────────────────────────────────────────────────

const DetailDrawer = ({ variantId, onClose, onToggleStatus, onEditSave }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await getVariantByIdApi(variantId);
        if (res?.success) setData(res.data);
      } catch { /* silent */ } finally { setLoading(false); }
    })();
  }, [variantId]);

  const handleToggle = async () => {
    setToggling(true);
    try {
      const res = await toggleVariantStatusApi(data._id);
      if (res?.success) {
        setData((d) => ({ ...d, isActive: !d.isActive }));
        onToggleStatus?.(data._id, !data.isActive);
      }
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "Could not toggle status." });
    } finally { setToggling(false); }
  };

  const v = data;
  const disc = v ? pct(v.mrp, v.sellingPrice) : 0;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 z-40 w-full max-w-md bg-white shadow-2xl flex flex-col overflow-hidden border-l border-slate-100">

        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 rounded-full bg-orange-500" />
            <p className="text-xs font-black tracking-widest uppercase text-slate-700">Variant Detail</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors shadow-sm">
            <X size={16} />
          </button>
        </div>

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full border-3 border-orange-500 border-t-transparent animate-spin" style={{borderWidth: "3px"}} />
            <p className="text-xs text-slate-400 font-semibold">Loading variant...</p>
          </div>
        ) : !v ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 text-slate-400">
            <Package size={36} />
            <p className="text-sm font-semibold">Failed to load variant</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">

            {/* Hero Image */}
            <div className="relative h-56 bg-slate-100">
              {v.thumbnail ? (
                <img src={v.thumbnail} alt={v.product?.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-300">
                  <ImageOff size={44} />
                  <p className="text-xs font-semibold">No image</p>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

              {/* Overlay badges */}
              <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                {v.isDefault && (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-500 text-white shadow">
                    Default
                  </span>
                )}
                <div className="ml-auto">
                  <StatusBadge active={v.isActive} />
                </div>
              </div>

              {/* Bottom overlay text */}
              <div className="absolute bottom-0 left-0 right-0 px-5 pb-4">
                <p className="text-[11px] font-black text-orange-300 uppercase tracking-widest">{v.product?.name}</p>
                <p className="text-xl font-black text-white">{v.weight}{v.unit} · {v.sku}</p>
              </div>
            </div>

            <div className="p-5 space-y-4">

              {/* Pricing Card */}
              <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-4 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Pricing</p>
                <div className="flex items-end gap-4 flex-wrap">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Selling Price</p>
                    <p className="text-2xl font-black text-orange-500">{fmt(v.sellingPrice)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">MRP</p>
                    <p className="text-sm font-bold line-through text-slate-400">{fmt(v.mrp)}</p>
                  </div>
                  {disc > 0 && (
                    <span className="ml-auto px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 text-xs font-black border border-emerald-100">
                      -{disc}% OFF
                    </span>
                  )}
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { icon: <Tag size={13} />, label: "SKU", value: v.sku },
                  { icon: <Barcode size={13} />, label: "Barcode", value: v.barcode || "—" },
                  { icon: <Weight size={13} />, label: "Weight", value: `${v.weight} ${v.unit}` },
                  { icon: <ArrowUpDown size={13} />, label: "Sort Order", value: v.sortOrder ?? "—" },
                  { icon: <Star size={13} />, label: "Default", value: v.isDefault ? "Yes" : "No" },
                  { icon: <ShoppingBag size={13} />, label: "GST", value: `${v.product?.gstPercentage ?? 0}%` },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="rounded-xl border border-slate-100 bg-white p-3 flex items-start gap-2 shadow-sm">
                    <span className="text-orange-400 mt-0.5 shrink-0">{icon}</span>
                    <div className="min-w-0">
                      <p className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">{label}</p>
                      <p className="text-sm font-bold text-slate-700 truncate">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Attributes */}
              {v.attributes && Object.keys(v.attributes).length > 0 && (
                <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5">
                    <Layers size={11} /> Attributes
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(v.attributes).map(([k, val]) => (
                      <span key={k} className="px-3 py-1 rounded-full border border-orange-100 bg-orange-50 text-xs font-bold text-orange-700 capitalize">
                        {k}: {val}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Product Info */}
              <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Product Info</p>
                <p className="text-sm font-bold text-slate-800 mb-1">{v.product?.name}</p>
                <p className="text-xs text-slate-500 leading-relaxed mb-3">{v.product?.description}</p>
                {v.product?.keyPoints?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {v.product.keyPoints.map((kp) => (
                      <span key={kp} className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[10px] font-bold border border-green-100">{kp}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Timestamps */}
              <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3 space-y-1">
                <p className="text-[10px] text-slate-400 font-mono">Created: {new Date(v.createdAt).toLocaleString("en-IN")}</p>
                <p className="text-[10px] text-slate-400 font-mono">Updated: {new Date(v.updatedAt).toLocaleString("en-IN")}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {!loading && v && (
          <div className="px-5 py-4 border-t border-slate-100 bg-slate-50 flex gap-3">
            <button onClick={handleToggle} disabled={toggling}
              className={`flex-1 h-11 rounded-xl border text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-60
              ${v.isActive
                ? "border-red-200 text-red-500 bg-white hover:bg-red-50"
                : "border-emerald-200 text-emerald-600 bg-white hover:bg-emerald-50"}`}>
              {toggling ? "..." : v.isActive
                ? <><ToggleLeft size={16} /> Deactivate</>
                : <><ToggleRight size={16} /> Activate</>}
            </button>
            <button onClick={() => setShowEdit(true)}
              className="flex-1 h-11 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shadow-orange-200">
              <Pencil size={16} /> Edit
            </button>
          </div>
        )}
      </div>

      {showEdit && v && (
        <EditModal variant={v} onClose={() => setShowEdit(false)}
          onSave={(updated) => { setData(updated); onEditSave?.(updated); setShowEdit(false); }} />
      )}
    </>
  );
};

// ─── Variant Card ─────────────────────────────────────────────────────────────

const VariantCard = ({ variant, onClick, onToggle }) => {
  const v = variant;
  const [toggling, setToggling] = useState(false);
  const disc = pct(v.mrp, v.sellingPrice);

  const handleToggle = async (e) => {
    e.stopPropagation();
    setToggling(true);
    try {
      const res = await toggleVariantStatusApi(v._id);
      if (res?.success) onToggle?.(v._id, !v.isActive);
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "Could not toggle status." });
    } finally { setToggling(false); }
  };

  return (
    <div onClick={() => onClick(v._id)}
      className="group relative bg-white rounded-2xl border border-slate-200 hover:border-orange-300 hover:shadow-lg transition-all cursor-pointer overflow-hidden card-3d">

      {/* Image */}
      <div className="relative h-44 bg-slate-50 overflow-hidden">
        {v.thumbnail ? (
          <img src={v.thumbnail} alt={v.product?.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 text-slate-300">
            <ImageOff size={30} />
            <p className="text-[10px] font-semibold">No image</p>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-start">
          {v.isDefault ? (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-orange-500 text-white shadow">
              Default
            </span>
          ) : <span />}
          <StatusBadge active={v.isActive} />
        </div>

        {/* Discount ribbon */}
        {disc > 0 && (
          <div className="absolute bottom-2.5 left-2.5">
            <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black shadow">
              -{disc}% OFF
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{v.product?.name}</p>
        <p className="text-sm font-bold text-slate-800 mt-0.5">{v.weight}{v.unit} · <span className="text-slate-500 font-mono text-xs">{v.sku}</span></p>

        {/* Attributes */}
        {v.attributes && Object.keys(v.attributes).length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {Object.entries(v.attributes).map(([k, val]) => (
              <span key={k} className="px-2 py-0.5 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-[10px] font-bold capitalize">
                {val}
              </span>
            ))}
          </div>
        )}

        {/* Pricing */}
        <div className="flex items-center gap-2 mt-3">
          <span className="text-lg font-black text-orange-500">{fmt(v.sellingPrice)}</span>
          {v.mrp > v.sellingPrice && (
            <span className="text-xs line-through text-slate-400 font-medium">{fmt(v.mrp)}</span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
          <button onClick={handleToggle} disabled={toggling}
            className={`text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-colors
            ${v.isActive ? "text-red-400 hover:text-red-600" : "text-emerald-500 hover:text-emerald-700"}`}>
            {toggling ? "..." : v.isActive
              ? <><ToggleLeft size={13} /> Deactivate</>
              : <><ToggleRight size={13} /> Activate</>}
          </button>
          <div className="flex items-center gap-1 text-slate-400 group-hover:text-orange-400 transition-colors text-xs font-semibold">
            View <ChevronRight size={14} />
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────

const StatCard = ({ label, value, color, bg, border }) => (
  <div className={`rounded-2xl border ${border} ${bg} p-4 card-3d`}>
    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</p>
    <p className={`text-3xl font-black mt-1 ${color}`}>{value}</p>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

const Variants = () => {
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const fetchVariants = useCallback(async (pg = 1, productFilter = "") => {
    setLoading(true);
    try {
      const res = await getAllVariantsApi(pg, 10, productFilter);
      if (res?.success) {
        setVariants(res.data);
        setPagination(res.pagination);
      }
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err?.message || "Failed to fetch variants." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchVariants(1); }, [fetchVariants]);

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
      fetchVariants(1, searchInput);
    }, 500);
    return () => clearTimeout(t);
  }, [searchInput]);

  const handlePageChange = (pg) => { setPage(pg); fetchVariants(pg, search); };

  const handleToggle = (id, newStatus) =>
    setVariants((prev) => prev.map((v) => (v._id === id ? { ...v, isActive: newStatus } : v)));

  const handleEditSave = (updated) =>
    setVariants((prev) => prev.map((v) => (v._id === updated._id ? { ...v, ...updated } : v)));

  const filtered = variants.filter((v) => {
    const q = searchInput.toLowerCase();
    if (!q) return true;
    return (
      v.sku?.toLowerCase().includes(q) ||
      v.product?.name?.toLowerCase().includes(q) ||
      String(v.weight).includes(q) ||
      v.unit?.toLowerCase().includes(q)
    );
  });

  const stats = [
    { label: "Total Variants", value: pagination?.total ?? variants.length, color: "text-slate-800", bg: "bg-white", border: "border-slate-200" },
    { label: "Active", value: variants.filter((v) => v.isActive).length, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
    { label: "Inactive", value: variants.filter((v) => !v.isActive).length, color: "text-red-500", bg: "bg-red-50", border: "border-red-100" },
    { label: "Default", value: variants.filter((v) => v.isDefault).length, color: "text-orange-500", bg: "bg-orange-50", border: "border-orange-100" },
  ];

  return (
    <div className="min-h-screen bg-[#edf2f4] px-4 py-8 md:px-8 font-sans">

      {/* ── Header ── */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-xl border border-orange-100 bg-orange-50 px-3 py-1.5 text-[10px] font-black tracking-widest text-orange-500 mb-3">
            <Package size={11} /> PRODUCT_VARIANTS
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Variants <span className="text-orange-500">Management</span>
          </h1>
          {pagination && (
            <p className="text-xs text-slate-400 mt-1 font-mono">
              {pagination.total} total · page {pagination.page} of {pagination.totalPages}
            </p>
          )}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text" placeholder="Search name, SKU, weight…"
            value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
            className="w-full h-11 rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-700 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-100 shadow-sm"
          />
        </div>
      </div>

      {/* ── Stats ── */}
      {!loading && variants.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {stats.map((s) => <StatCard key={s.label} {...s} />)}
        </div>
      )}

      {/* ── Grid ── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-white h-80 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-28 text-center">
          <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center mb-4">
            <Package size={36} className="text-slate-300" />
          </div>
          <p className="text-base font-bold text-slate-500">
            {searchInput ? "No variants match your search" : "No variants found"}
          </p>
          {searchInput && (
            <button onClick={() => setSearchInput("")} className="mt-3 text-sm text-orange-500 font-bold hover:underline">
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((v) => (
            <VariantCard key={v._id} variant={v} onClick={setSelectedId} onToggle={handleToggle} />
          ))}
        </div>
      )}

      {/* ── Pagination ── */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
          {[...Array(pagination.totalPages)].map((_, i) => (
            <button key={i} onClick={() => handlePageChange(i + 1)}
              className={`w-9 h-9 rounded-xl text-sm font-black transition-all border
              ${page === i + 1
                ? "bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-200"
                : "bg-white text-slate-500 border-slate-200 hover:border-orange-300 hover:text-orange-500"}`}>
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* ── Drawer ── */}
      {selectedId && (
        <DetailDrawer
          variantId={selectedId}
          onClose={() => setSelectedId(null)}
          onToggleStatus={handleToggle}
          onEditSave={handleEditSave}
        />
      )}
    </div>
  );
};

export default Variants;