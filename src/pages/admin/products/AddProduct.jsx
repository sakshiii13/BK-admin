import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  
  getAllBrandsApi,
  getAllCategoriesApi,
  getAllSubCategoriesApi,
} from "../../../api/category.api";
import {
  getAllParentCategoriesApi,
  getAllVariantsApi,
  createProductApi,
  getSingleProductApi,
  updateProductApi,
} from "../../../api/admin.api";
import { showSuccess, showError } from "../../../utils/alertService";

// ─── ICONS ───────────────────────────────────────────────────────────────────
const Icon = {
  Back: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
    </svg>
  ),
  Plus: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Trash: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  ),
  Upload: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  ),
  Tag: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  ),
  Package: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.73z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  Image: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  Sparkle: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  Check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  ChevronDown: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
};

// ─── REUSABLE COMPONENTS ──────────────────────────────────────────────────────
const Label = ({ children, required }) => (
  <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-800 mb-1.5">
    {children}{required && <span className="text-orange-400 ml-0.5">*</span>}
  </label>
);

const InputField = ({ label, required, ...props }) => (
  <div>
    {label && <Label required={required}>{label}</Label>}
    <input
      {...props}
      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-black outline-none
        placeholder:text-slate-500 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
    />
  </div>
);

const SelectField = ({ label, required, disabled, children, ...props }) => (
  <div>
    {label && <Label required={required}>{label}</Label>}
    <div className="relative">
      <select
        disabled={disabled}
        {...props}
        className={`w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-3 pr-10 text-sm font-medium text-slate-700 outline-none
          focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all cursor-pointer
          ${disabled ? "opacity-40 cursor-not-allowed bg-slate-50" : ""}`}
      >
        {children}
      </select>
      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
        <Icon.ChevronDown />
      </div>
    </div>
  </div>
);

// ─── SECTION CARD ─────────────────────────────────────────────────────────────
const Card = ({ icon, title, subtitle, action, children }) => (
  <div className="bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden">
    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
      <div className="flex items-center gap-2.5">
        <span className="text-orange-500">{icon}</span>
        <div>
          <h3 className="text-sm font-bold text-slate-800">{title}</h3>
          {subtitle && <p className="text-[11px] text-slate-600 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
    <div className="p-6">{children}</div>
  </div>
);

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const AddProduct = () => {
  const fileRef = useRef(null);
  const navigate = useNavigate();
  const { productId } = useParams();
  const isEditMode = Boolean(productId);

  // ── Toast ──
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  // ── Master Data ──
  const [brands, setBrands] = useState([]);
  const [parentCategories, setParentCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  // ── Form ──
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedParent, setSelectedParent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");

  // ── Images ──
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  // ── Variants ──
  const [variants, setVariants] = useState([
    { sku: "", weight: "", unit: "g", mrp: "", sellingPrice: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [variantsLoading, setVariantsLoading] = useState(false);

  // ─── FETCH ON MOUNT ───────────────────────────────────────────────────────
  useEffect(() => {
    const fetchMaster = async () => {
      try {
        const [parentRes, brandRes] = await Promise.all([
          getAllParentCategoriesApi(1, 100),
          getAllBrandsApi({ page: 1, limit: 100 }),
        ]);
        if (parentRes?.success) setParentCategories(parentRes.data || []);
        if (brandRes?.success) setBrands(brandRes.data || []);
        else if (Array.isArray(brandRes)) setBrands(brandRes);
      } catch {
        showToast("Failed to load master data");
      }
    };
    fetchMaster();
  }, []);

  // ─── FETCH CATEGORIES WHEN PARENT CHANGES ─────────────────────────────────
  useEffect(() => {
    setCategories([]);
    setSubCategories([]);
    setSelectedCategory("");
    setSelectedSubCategory("");
    if (!selectedParent) return;

    const fetchCats = async () => {
      try {
        const res = await getAllCategoriesApi({ page: 1, limit: 100, parentCategory: selectedParent });
        if (res?.success) setCategories(res.data || []);
        else if (Array.isArray(res)) setCategories(res);
      } catch {
        showToast("Failed to load categories");
      }
    };
    fetchCats();
  }, [selectedParent]);

  // ─── FETCH SUBCATEGORIES WHEN CATEGORY CHANGES ────────────────────────────
  useEffect(() => {
    setSubCategories([]);
    setSelectedSubCategory("");
    if (!selectedCategory) return;

    const fetchSubs = async () => {
      try {
        const res = await getAllSubCategoriesApi({ page: 1, limit: 100, category: selectedCategory });
        if (res?.success) setSubCategories(res.data || []);
        else if (Array.isArray(res)) setSubCategories(res);
      } catch {
        showToast("Failed to load sub categories");
      }
    };
    fetchSubs();
  }, [selectedCategory]);

  // ─── EDIT MODE: LOAD PRODUCT ──────────────────────────────────────────────
  useEffect(() => {
    if (!productId) return;
    const load = async () => {
      try {
        const res = await getSingleProductApi(productId);
        const p = res?.data || res;
        if (p) {
          setName(p.name || "");
          setDescription(p.description || "");
          setIsActive(p.isActive ?? true);
          setSelectedBrand(p.brand?._id || p.brand || "");
          setSelectedParent(p.parentCategory?._id || p.parentCategory || "");
          setSelectedCategory(p.category?._id || p.category || "");
          setSelectedSubCategory(p.subCategory?._id || p.subCategory || "");
          fetchVariants(productId);
        }
      } catch {
        showToast("Failed to load product");
      }
    };
    load();
  }, [productId]);

  const fetchVariants = async (pid) => {
    setVariantsLoading(true);
    try {
      const res = await getAllVariantsApi(1, 100, pid);
      const data = res?.success ? res.data : Array.isArray(res) ? res : [];
      if (data.length > 0) {
        setVariants(data.map((v) => ({
          _id: v._id,
          sku: v.sku || "",
          weight: String(v.weight || ""),
          unit: v.unit || "g",
          mrp: String(v.mrp || ""),
          sellingPrice: String(v.sellingPrice || ""),
        })));
      }
    } catch {
      showToast("Could not load variants");
    } finally {
      setVariantsLoading(false);
    }
  };

  // ─── VARIANT HANDLERS ─────────────────────────────────────────────────────
  const addVariant = () =>
    setVariants((p) => [...p, { sku: "", weight: "", unit: "g", mrp: "", sellingPrice: "" }]);

  const removeVariant = (i) => {
    if (variants.length === 1) return showToast("At least one variant required");
    setVariants((p) => p.filter((_, idx) => idx !== i));
  };

  const updateVariant = (i, field, val) =>
    setVariants((p) => p.map((v, idx) => (idx === i ? { ...v, [field]: val } : v)));

 const autoSKU = (i) => {
  const v = variants[i];
  const brandObj = brands.find((b) => b._id === selectedBrand);
  if (!name.trim()) return showToast("Enter product name first");
  if (!v.weight) return showToast("Enter weight/quantity first");
  const b = (brandObj?.name || "BK").replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 5);
  const n = name.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 8);
  const w = String(v.weight).replace(/[^a-zA-Z0-9]/g, "");
  const u = String(v.unit).toUpperCase();
  updateVariant(i, "sku", `${b}-${n}-${w}${u}`);
};

  // ─── IMAGE HANDLERS ───────────────────────────────────────────────────────
  const handleImages = (e) => {
    const files = Array.from(e.target.files).filter((f) => f.type.startsWith("image/"));
    setImages((p) => [...p, ...files]);
    files.forEach((file) => {
      const r = new FileReader();
      r.onloadend = () => setPreviews((p) => [...p, r.result]);
      r.readAsDataURL(file);
    });
  };

  const removeImage = (i) => {
    setImages((p) => p.filter((_, idx) => idx !== i));
    setPreviews((p) => p.filter((_, idx) => idx !== i));
  };

  // ─── SUBMIT ───────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return showToast("Product name is required");
    if (!selectedBrand) return showToast("Select a brand");
    if (!selectedParent) return showToast("Select a parent category");
    if (!selectedCategory) return showToast("Select a category");
    if (!selectedSubCategory) return showToast("Select a sub category");
    if (!images.length && !isEditMode) return showToast("Upload at least one image");
    if (variants.some((v) => !v.sku || !v.weight || !v.mrp || !v.sellingPrice))
      return showToast("All variant fields are required");

    setLoading(true);
    const fd = new FormData();
    fd.append("name", name);
    fd.append("description", description);
    fd.append("brand", selectedBrand);
    fd.append("parentCategory", selectedParent);
    fd.append("category", selectedCategory);
    fd.append("subCategory", selectedSubCategory);
    // fd.append("isActive", String(isActive)); --- IGNORE ---
    images.forEach((f) => fd.append("images", f));
    fd.append("variants", JSON.stringify(variants.map(({ _id, ...v }) => ({
      ...v,
      weight: parseFloat(v.weight),
      mrp: parseFloat(v.mrp),
      sellingPrice: parseFloat(v.sellingPrice),
    }))));

    try {
      const res = isEditMode
        ? await updateProductApi(productId, fd)
        : await createProductApi(fd);
      if (res?.success) {
        showToast(isEditMode ? "Product updated!" : "Product published!", "success");
        setTimeout(() => navigate("/dashboard/products/all"), 1500);
      } else {
        showToast(res?.message || "Failed to save");
      }
    } catch {
      showToast("Submission error");
    } finally {
      setLoading(false);
    }
  };

  // ─── DERIVED: filtered categories by parent ───────────────────────────────
  const filteredCategories = categories.filter((c) => {
    const pid = typeof c.parentCategory === "object" ? c.parentCategory?._id : c.parentCategory;
    return !pid || pid === selectedParent;
  });

const UNITS = ["g", "kg", "ml", "ltr", "pcs", "pack", "tabs", "dozen"];
  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* ── TOAST ── */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold border transition-all
          ${toast.type === "success"
            ? "bg-emerald-50 border-emerald-200 text-emerald-700"
            : "bg-red-50 border-red-200 text-red-700"
          }`}>
          <span>{toast.msg}</span>
          <button onClick={() => setToast(null)} className="opacity-60 hover:opacity-100 font-bold cursor-pointer">✕</button>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* ── HEADER ── */}
        <div className="flex items-center gap-4 mb-2">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-orange-500 hover:border-orange-200 transition-all shadow-sm cursor-pointer"
          >
            <Icon.Back />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900">
                {isEditMode ? "Edit Product" : "Add New Product"}
              </h1>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide
                ${isEditMode ? "bg-blue-100 text-blue-600" : "bg-orange-100 text-orange-600"}`}>
                {isEditMode ? "Edit Mode" : "New"}
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-0.5">
              {isEditMode ? "Update product info and variants" : "Fill all details to publish a new product"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ── ROW 1: ESSENTIALS + MEDIA ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* LEFT: Essentials */}
            <div className="lg:col-span-2 space-y-5">
              {/* Product Info */}
              <Card icon={<Icon.Tag />} title="Product Info" subtitle="Basic details about the product">
                <div className="space-y-4">
                  <InputField
                    label="Product Name"
                    required
                    type="text"
                    placeholder="e.g. Amul Gold Fresh Milk"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <div>
                    <Label>Product Description</Label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Key features, ingredients, usage info..."
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 outline-none
                        placeholder:text-slate-500 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all resize-none"
                    />
                  </div>
                </div>
              </Card>

              {/* Classification: Brand → Parent → Category → Sub */}
              <Card icon={<Icon.Package />} title="Classification" subtitle="Assign brand and category hierarchy">
                <div className="space-y-4">
                  {/* Brand */}
                  <SelectField label="Brand" required value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
                    <option value="">Select Brand</option>
                    {brands.map((b) => (
                      <option key={b._id} value={b._id}>{b.name}</option>
                    ))}
                  </SelectField>

                  {/* 3-col grid: Parent → Category → Sub */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <SelectField
                      label="Parent Category"
                      required
                      value={selectedParent}
                      onChange={(e) => setSelectedParent(e.target.value)}
                    >
                      <option value="">Select Parent</option>
                      {parentCategories.map((p) => (
                        <option key={p._id} value={p._id}>{p.name}</option>
                      ))}
                    </SelectField>

                    <SelectField
                      label="Category"
                      required
                      disabled={!selectedParent}
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="">{selectedParent ? "Select Category" : "Select parent first"}</option>
                      {filteredCategories.map((c) => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </SelectField>

                    <SelectField
                      label="Sub Category"
                      required
                      disabled={!selectedCategory}
                      value={selectedSubCategory}
                      onChange={(e) => setSelectedSubCategory(e.target.value)}
                    >
                      <option value="">{selectedCategory ? "Select Sub Category" : "Select category first"}</option>
                      {subCategories.map((s) => (
                        <option key={s._id} value={s._id}>{s.name}</option>
                      ))}
                    </SelectField>
                  </div>

                  {/* Breadcrumb preview */}
                  {(selectedParent || selectedCategory || selectedSubCategory) && (
                    <div className="flex items-center gap-1.5 flex-wrap text-[11px] bg-orange-50 border border-orange-100 rounded-lg px-3 py-2">
                      <span className="text-slate-400 font-medium">Path:</span>
                      {selectedParent && (
                        <span className="font-semibold text-orange-600">
                          {parentCategories.find((p) => p._id === selectedParent)?.name}
                        </span>
                      )}
                      {selectedCategory && (
                        <>
                          <span className="text-slate-300">›</span>
                          <span className="font-semibold text-orange-600">
                            {filteredCategories.find((c) => c._id === selectedCategory)?.name}
                          </span>
                        </>
                      )}
                      {selectedSubCategory && (
                        <>
                          <span className="text-slate-300">›</span>
                          <span className="font-semibold text-orange-600">
                            {subCategories.find((s) => s._id === selectedSubCategory)?.name}
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* RIGHT: Media + Status */}
            <div className="space-y-5">
              <Card icon={<Icon.Image />} title="Cover Media" subtitle="Upload product images">
                <div className="space-y-4">
                  {/* Status Toggle */}
                  <div>
                    <Label>Visibility</Label>
                    <button
                      type="button"
                      onClick={() => setIsActive((p) => !p)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-bold transition-all cursor-pointer
                        ${isActive
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                          : "bg-slate-50 border-slate-200 text-slate-500"
                        }`}
                    >
                      <span>{isActive ? "Active / Public" : "Draft / Hidden"}</span>
                      <div className={`w-9 h-5 rounded-full transition-all relative ${isActive ? "bg-emerald-500" : "bg-slate-300"}`}>
                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${isActive ? "left-4" : "left-0.5"}`} />
                      </div>
                    </button>
                  </div>

                  {/* Upload zone */}
                  <div>
                    <Label>Images</Label>
                    <div
                      onClick={() => fileRef.current.click()}
                      className="flex flex-col items-center justify-center gap-2 h-36 border-2 border-dashed border-slate-200
                        rounded-xl cursor-pointer hover:border-orange-400 hover:bg-orange-50/50 transition-all group"
                    >
                      <span className="text-slate-300 group-hover:text-orange-400 transition-colors"><Icon.Upload /></span>
                      <p className="text-xs font-semibold text-slate-400 group-hover:text-orange-500 transition-colors">
                        Click to upload
                      </p>
                      <p className="text-[10px] text-slate-300">JPG, PNG, WEBP accepted</p>
                    </div>
                    <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={handleImages} />
                  </div>

                  {/* Previews */}
                  {previews.length > 0 && (
                    <div>
                      <Label>{previews.length} image{previews.length > 1 ? "s" : ""} selected</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {previews.map((src, i) => (
                          <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-slate-100 group">
                            <img src={src} className="w-full h-full object-cover" alt="" />
                            <button
                              type="button"
                              onClick={() => removeImage(i)}
                              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white cursor-pointer"
                            >
                              <Icon.Trash />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>

          {/* ── VARIANTS ── */}
          <Card
            icon={<Icon.Package />}
            title="Pack Variants"
            subtitle={`${variants.length} variant${variants.length > 1 ? "s" : ""} added — define weight, unit, SKU & pricing`}
            action={
              <button
                type="button"
                onClick={addVariant}
                disabled={variantsLoading}
                className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl
                  transition-all cursor-pointer disabled:opacity-50 shadow-sm shadow-orange-200"
              >
                <Icon.Plus /> Add Variant
              </button>
            }
          >
            {variantsLoading ? (
              <div className="flex items-center justify-center py-10">
                <div className="flex items-center gap-3 text-slate-400">
                  <div className="w-4 h-4 border-2 border-slate-200 border-t-orange-400 rounded-full animate-spin" />
                  <span className="text-sm font-medium">Loading variants...</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Header row */}
                <div className="hidden md:grid grid-cols-12 gap-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-800">
                  <div className="col-span-2">Weight</div>
                  <div className="col-span-1">Unit</div>
                  <div className="col-span-4">SKU Code</div>
                  <div className="col-span-2">MRP (₹)</div>
                  <div className="col-span-2">Sale Price (₹)</div>
                  <div className="col-span-1"></div>
                </div>

                {variants.map((v, i) => (
                  <div key={i} className="relative grid grid-cols-1 md:grid-cols-12 gap-3 items-center
                    bg-slate-50 border border-slate-100 rounded-xl px-4 py-4 group hover:border-orange-200 transition-all">
                    {/* Badge */}
                    <div className="absolute -top-2.5 left-3 bg-white border border-slate-200 text-[9px] font-black uppercase px-2 py-0.5 rounded-full text-slate-500 shadow-sm">
                      {isEditMode && v._id ? "Saved" : "New"} #{i + 1}
                    </div>

                    {/* Weight */}
                    <div className="md:col-span-2">
                      <label className="block md:hidden text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Weight</label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 500"
                        value={v.weight}
                        onChange={(e) => updateVariant(i, "weight", e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-800
                          outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all placeholder:text-slate-500"
                      />
                    </div>

                    {/* Unit */}
                    <div className="md:col-span-1">
                      <label className="block md:hidden text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Unit</label>
                      <div className="relative">
                        <select
                          value={v.unit}
                          onChange={(e) => updateVariant(i, "unit", e.target.value)}
                          className="w-full appearance-none bg-white border border-slate-200 rounded-lg px-3 py-2.5 pr-7 text-sm font-semibold
                            text-slate-700 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all cursor-pointer"
                        >
                          {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                        </select>
                        <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
                          <Icon.ChevronDown />
                        </div>
                      </div>
                    </div>

                    {/* SKU */}
                    <div className="md:col-span-4">
                      <label className="block md:hidden text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">SKU Code</label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          placeholder="SKU-CODE"
                          value={v.sku}
                          onChange={(e) => updateVariant(i, "sku", e.target.value.toUpperCase())}
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 pr-16 text-sm font-mono font-semibold
                            text-slate-800 uppercase outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all placeholder:text-slate-500 placeholder:normal-case placeholder:font-sans"
                        />
                        <button
                          type="button"
                          onClick={() => autoSKU(i)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] font-extrabold text-orange-500
                            hover:text-orange-700 transition-colors cursor-pointer uppercase tracking-wide bg-orange-50 hover:bg-orange-100 rounded px-1.5 py-0.5"
                        >
                          <Icon.Sparkle /> Auto
                        </button>
                      </div>
                    </div>

                    {/* MRP */}
                    <div className="md:col-span-2">
                      <label className="block md:hidden text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">MRP (₹)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">₹</span>
                        <input
                          type="number"
                          required
                          placeholder="150"
                          value={v.mrp}
                          onChange={(e) => updateVariant(i, "mrp", e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg pl-7 pr-3 py-2.5 text-sm font-semibold text-red-500
                            outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all placeholder:text-slate-300 placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    {/* Selling Price */}
                    <div className="md:col-span-2">
                      <label className="block md:hidden text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Sale Price (₹)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">₹</span>
                        <input
                          type="number"
                          required
                          placeholder="135"
                          value={v.sellingPrice}
                          onChange={(e) => updateVariant(i, "sellingPrice", e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg pl-7 pr-3 py-2.5 text-sm font-semibold text-emerald-600
                            outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all placeholder:text-slate-300 placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    {/* Delete */}
                    <div className="md:col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeVariant(i)}
                        className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-red-500 hover:border-red-200
                          hover:bg-red-50 transition-all cursor-pointer"
                      >
                        <Icon.Trash />
                      </button>
                    </div>

                    {/* Discount badge */}
                    {v.mrp && v.sellingPrice && parseFloat(v.mrp) > parseFloat(v.sellingPrice) && (
                      <div className="md:col-span-12 flex items-center gap-1.5 -mt-1">
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                          {Math.round(((v.mrp - v.sellingPrice) / v.mrp) * 100)}% off
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Saving ₹{(parseFloat(v.mrp) - parseFloat(v.sellingPrice)).toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* ── ACTIONS ── */}
          <div className="flex justify-between items-center bg-white border border-slate-100 rounded-2xl px-6 py-4 shadow-sm">
            <p className="text-xs text-slate-400 font-medium">
              {variants.length} variant{variants.length > 1 ? "s" : ""} · {images.length} image{images.length !== 1 ? "s" : ""}
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || variantsLoading}
                className="flex items-center gap-2 px-7 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-black rounded-xl
                  shadow-md shadow-orange-200 hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 uppercase tracking-wide active:scale-95"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Icon.Check />
                    {isEditMode ? "Save Changes" : "Publish Product"}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;