import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createProductApi,
  getAllBrandsApi,
  getAllSubCategoriesApi,
  getAllCategoriesApi,
  getSingleProductApi,
  updateProductApi,
} from "../../../api/admin.api";
import { showSuccess, showError } from "../../../utils/alertService";
// ==========================================
// CUSTOM INLINE SVG ICONS (Removes react-icons dependency)
// ==========================================
const SvgArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>

);
const SvgPlus = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);
const SvgTrash = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
);
const SvgUpload = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
);
const SvgCheckCircle = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
);
const SvgBoxes = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.73z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
);
const SvgRegListAlt = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="9"></line><line x1="9" y1="13" x2="15" y2="13"></line><line x1="5" y1="9" x2="5.01" y2="9"></line><line x1="5" y1="13" x2="5.01" y2="13"></line></svg>
);

const AddProduct = () => {
  const fileRef = useRef(null);
  const navigate = useNavigate();
  const { productId } = useParams();
  const isEditMode = Boolean(productId);

  // UI Notification Toast State (used by effects and handlers)
  const [notification, setNotification] = useState(null);
  const showLocalNotification = (msg, type = "error") => {
    setNotification({ text: msg, type });
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => setNotification(null), 4000);
  };

  // ==========================================
  // COMPILER MOCK DATA & ACTIONS 
  // (Provides offline preview stability inside isolated environments)
  // ==========================================
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch master data from APIs (categories & brands) on mount
  useEffect(() => {
    let mounted = true;

    const fetchMasterData = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          getAllCategoriesApi(1, 100),
          getAllBrandsApi({ page: 1, limit: 100 }),
        ]);

        if (!mounted) return;

        // Categories
        if (catRes?.success) {
          setCategories(catRes.data || catRes.categories || []);
        } else if (Array.isArray(catRes)) {
          setCategories(catRes);
        } else {
          setCategories([]);
          if (catRes?.message) showLocalNotification(catRes.message);
        }

        // Brands
        if (brandRes?.success) {
          setBrands(brandRes.data || brandRes.brands || []);
        } else if (Array.isArray(brandRes)) {
          setBrands(brandRes);
        } else {
          setBrands([]);
          if (brandRes?.message) showLocalNotification(brandRes.message);
        }
      } catch (err) {
        if (!mounted) return;
        showLocalNotification("Failed to fetch master data");
      }
    };

    fetchMasterData();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!productId) return;

    let mounted = true;

    const loadProduct = async () => {
      try {
        const res = await getSingleProductApi(productId);
        if (!mounted) return;

        if (res?.success && res?.data) {
          const product = res.data;
          setName(product.name || "");
          setBrand(product.brand?._id || product.brand || "");
          setCategory(product.category?._id || product.category || "");
          setSubCategory(product.subCategory?._id || product.subCategory || "");
          setDescription(product.description || "");
          setIsActive(product.isActive ?? true);
          setVariants(
            Array.isArray(product.variants) && product.variants.length > 0
              ? product.variants.map((variant) => ({
                  sku: variant.sku || "",
                  weight: variant.weight || "",
                  unit: variant.unit || "",
                  mrp: variant.mrp || "",
                  sellingPrice: variant.sellingPrice || "",
                }))
              : variants
          );
          setExistingImages(product.images || []);
        }
      } catch (err) {
        if (!mounted) return;
        showLocalNotification("Failed to load product details");
      }
    };

    loadProduct();

    return () => {
      mounted = false;
    };
  }, [productId]);

  // Fetch subcategories when parent category changes (server-backed)
  // (moved) fetch of subcategories happens after `category` state is declared


  // Main Product States
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [existingImages, setExistingImages] = useState([]);

  // Fetch subcategories from server when parent category changes
  useEffect(() => {
    if (!category) return; // nothing to fetch yet

    let mounted = true;

    const fetchSubs = async () => {
      try {
        const res = await getAllSubCategoriesApi({ page: 1, limit: 200, category });
        if (!mounted) return;
        if (res?.success) {
          setSubCategories(res.data || res.subCategories || []);
        } else if (Array.isArray(res)) {
          setSubCategories(res);
        } else {
          if (res?.message) showLocalNotification(res.message);
        }
      } catch (err) {
        if (!mounted) return;
        showLocalNotification("Failed to fetch sub categories");
      }
    };

    fetchSubs();

    return () => {
      mounted = false;
    };
  }, [category]);

  // Images upload states
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  // Multi-variant arrays (Grocery standard: multi size packs per item)
  const [variants, setVariants] = useState([
    { sku: "", weight: "", unit: "g", mrp: "", sellingPrice: "" },
  ]);

  useEffect(() => {
    if (category) {
      const filtered = subCategories.filter((sub) => {
        const catId = typeof sub.category === "object" ? sub.category?._id : sub.category;
        return catId === category;
      });
      setFilteredSubCategories(filtered);
      setSubCategory(""); // Reset selected subcategory on parent category change
    } else {
      setFilteredSubCategories([]);
    }
  }, [category, subCategories]);

  const handleAddVariantRow = () => {
    setVariants((prev) => [
      ...prev,
      { sku: "", weight: "", unit: "g", mrp: "", sellingPrice: "" },
    ]);
  };

  
  const handleRemoveVariantRow = (index) => {
    if (variants.length === 1) {
      showLocalNotification("A supermarket product must have at least one pack variant!");
      return;
    }
    setVariants((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleVariantChange = (index, field, value) => {
    setVariants((prev) =>
      prev.map((v, idx) => {
        if (idx === index) {
          return { ...v, [field]: value };
        }
        return v;
      })
    );
  };

  const handleAutoGenerateSKU = (index) => {
    const v = variants[index];
    const brandObj = brands.find((b) => b._id === brand);
    const brandName = brandObj ? brandObj.name : "BK";
    
    if (!name.trim()) {
      showLocalNotification("Please enter product name first to auto-generate SKU");
      return;
    }
    if (!v.weight) {
      showLocalNotification("Please enter weight for this variant to generate SKU");
      return;
    }

    const cleanBrand = brandName.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    const cleanName = name.replace(/[^a-zA-Z0-9]/g, "").substring(0, 10).toUpperCase();
    const cleanUnit = v.unit.toUpperCase();
    const generatedSKU = `${cleanBrand}-${cleanName}-${v.weight}${cleanUnit}`;

    handleVariantChange(index, "sku", generatedSKU);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const validFiles = files.filter((file) => file.type.startsWith("image/"));
    if (validFiles.length !== files.length) {
      showLocalNotification("Only image file formats are accepted!");
    }

    setImages((prev) => [...prev, ...validFiles]);

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, idx) => idx !== index));
    setPreviews((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();

    // 1. Basic Validations
    if (!name.trim()) return showLocalNotification("Product Title is required");
    if (!brand) return showLocalNotification("Please select a Brand");
    if (!category) return showLocalNotification("Please select a Category");
    if (!subCategory) return showLocalNotification("Please select a SubCategory");
    if (!images.length && !isEditMode) return showLocalNotification("Please upload at least one image");

    setLoading(true);

    // 2. FormData Construction
    const formData = new FormData();
    formData.append("name", name);
    formData.append("brand", brand);
    formData.append("category", category);
    formData.append("subCategory", subCategory);
    formData.append("description", description);
    formData.append("isActive", String(isActive));

    if (images.length) {
      images.forEach((file) => {
        formData.append("images", file);
      });
    }

    formData.append("variants", JSON.stringify(variants));

    // 3. API Hit
    const res = isEditMode
      ? await updateProductApi(productId, formData)
      : await createProductApi(formData);

    setLoading(false);

    if (res?.success) {
      showLocalNotification(
        isEditMode ? "Product updated successfully!" : "Product Published Successfully!",
        "success"
      );
      if (isEditMode) {
        navigate("/dashboard/products");
      }
    } else {
      showLocalNotification(res?.message || "Failed to save product");
    }
  };
  return (
    <div className="p-4 md:p-8 min-h-screen font-sans antialiased bg-[#f8fafc] text-[#1e293b]">
      {/* ================= NOTIFICATION BANNER ================= */}
      {notification && (
        <div className={`mb-6 p-5 rounded-2xl border flex items-center justify-between shadow-md transition-all ${
          notification.type === "success" 
            ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
            : "bg-rose-50 border-rose-200 text-rose-800"
        }`}>
          <span className="font-bold text-sm tracking-wide">{notification.text}</span>
          <button 
            type="button" 
            onClick={() => setNotification(null)}
            className="text-xs font-black uppercase hover:underline opacity-80 cursor-pointer"
          >
            Close
          </button>
        </div>
      )}

      {/* ================= HEADER SECTION ================= */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="p-3 bg-white hover:bg-slate-50 text-slate-600 hover:text-[#ff7e00] border border-slate-200 rounded-2xl shadow-sm transition-all cursor-pointer flex items-center justify-center h-11 w-11"
          >
            <SvgArrowLeft />
          </button>
          <div>
            <h1 className="text-2xl md:text-4xl font-black text-[#0f172a] tracking-tight">
              {isEditMode ? "Edit" : "Add New"} <span className="text-[#ff7e00]">Product</span>
            </h1>
            <p className="text-[#64748b] font-semibold mt-1 text-sm md:text-base">
              {isEditMode
                ? "Update product details and save changes to the catalog"
                : "Publish premium goods to the active supermarket display shelves"}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmitProduct} className="space-y-8">
        {/* ================= PRIMARY DETAILS GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* LEFT 2 COLUMNS: GENERAL METRICS */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-5 md:p-8 shadow-[0_10px_30px_rgba(15,23,42,0.02)] space-y-6">
              <h2 className="text-xl font-black text-[#0f172a] border-b border-slate-100 pb-3 flex items-center gap-2">
                <SvgRegListAlt /> Product Essentials
              </h2>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-[#64748b] tracking-wider pl-1">
                  Product Title / Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 text-[#0f172a] outline-none focus:bg-white focus:border-[#ff7e00] focus:ring-4 focus:ring-[#ff7e00]/10 transition-all font-bold placeholder-slate-400"
                  placeholder="e.g. Amul Gold Fresh Milk"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Brand Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-[#64748b] tracking-wider pl-1">
                    Brand Provider
                  </label>
                  <select
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-4 text-slate-700 outline-none focus:bg-white focus:border-[#ff7e00] transition-all font-bold cursor-pointer"
                  >
                    <option value="">Select Brand</option>
                    {brands.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Parent Category */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-[#64748b] tracking-wider pl-1">
                    Parent Category
                  </label>
                  <select
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-4 text-slate-700 outline-none focus:bg-white focus:border-[#ff7e00] transition-all font-bold cursor-pointer"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sub-Category Aisle */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-[#64748b] tracking-wider pl-1">
                    Department Aisle (Sub)
                  </label>
                  <select
                    required
                    disabled={!category}
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-4 text-slate-700 outline-none focus:bg-white focus:border-[#ff7e00] transition-all font-bold cursor-pointer disabled:opacity-50"
                  >
                    <option value="">Select Aisle</option>
                    {filteredSubCategories.map((sub) => (
                      <option key={sub._id} value={sub._id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-[#64748b] tracking-wider pl-1">
                  Product Description
                </label>
                <textarea
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 text-[#0f172a] outline-none focus:bg-white focus:border-[#ff7e00] focus:ring-4 focus:ring-[#ff7e00]/10 transition-all font-bold placeholder-slate-400 resize-none"
                  placeholder="Elaborate key details, health ingredients, nutrient value, etc..."
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: MEDIA UPLOAD & GENERAL CONFIG */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-5 md:p-8 shadow-[0_10px_30px_rgba(15,23,42,0.02)] space-y-6">
              <h2 className="text-xl font-black text-[#0f172a] border-b border-slate-100 pb-3 flex items-center gap-2">
                <SvgUpload /> Cover & Media
              </h2>

              {/* Status Visibility config */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-[#64748b] tracking-wider pl-1">
                  Visibility Status
                </label>
                <div
                  onClick={() => setIsActive(!isActive)}
                  className={`flex items-center justify-between px-5 py-4 rounded-2xl border cursor-pointer transition-all ${
                    isActive
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                      : "bg-rose-50 border-rose-200 text-rose-700"
                  }`}
                >
                  <span className="text-xs font-extrabold uppercase tracking-wide">
                    {isActive ? "Active / Public" : "Draft / Hidden"}
                  </span>
                  <span className={`w-3.5 h-3.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-rose-500"}`} />
                </div>
              </div>

              {/* Drag and drop looking selector zone */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-[#64748b] tracking-wider pl-1">
                  Upload Product Showcase
                </label>
                <div
                  onClick={() => fileRef.current.click()}
                  className="flex flex-col items-center justify-center h-44 bg-slate-50/50 border border-dashed border-slate-300 rounded-2xl cursor-pointer hover:border-[#ff7e00] hover:bg-slate-50 transition-all group"
                >
                  <span className="text-slate-400 group-hover:text-[#ff7e00] mb-2 transition-colors">
                    <SvgUpload />
                  </span>
                  <span className="text-xs font-black text-slate-500 uppercase tracking-wide">
                    Click to upload media
                  </span>
                  <input
                    ref={fileRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                    accept="image/*"
                  />
                </div>
              </div>

              {/* Mini previews listing thumbnails scrollable strip */}
              {previews.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-[#64748b] tracking-wider pl-1">
                    Uploaded Previews ({previews.length})
                  </label>
                  <div className="grid grid-cols-3 gap-2.5 max-h-40 overflow-y-auto pr-1">
                    {previews.map((previewSrc, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-square border border-slate-100 rounded-xl overflow-hidden bg-slate-50 group"
                      >
                        <img src={previewSrc} className="w-full h-full object-cover" alt="" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white hover:text-red-400 cursor-pointer"
                        >
                          <SvgTrash />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ================= DYNAMIC VARIANT GRID BUILDER ================= */}
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-5 md:p-8 shadow-[0_10px_30px_rgba(15,23,42,0.02)] space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 gap-4">
            <div>
              <h2 className="text-2xl font-black text-[#0f172a] flex items-center gap-2.5">
                <SvgBoxes /> Product Pack Variants
              </h2>
              <p className="text-[#64748b] text-xs font-semibold mt-0.5">
                Define sizes, packages, weight increments, and specific retail selling pricing
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddVariantRow}
              className="px-5 py-3.5 bg-orange-50 hover:bg-[#ff7e00] text-[#ff7e00] hover:text-white border border-orange-200/50 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-sm uppercase tracking-wider"
            >
              <SvgPlus /> Add New Pack Size
            </button>
          </div>

          <div className="space-y-4">
            {variants.map((v, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-slate-50/50 border border-slate-200/60 rounded-2xl p-5 relative group"
              >
                {/* Variant serial badge */}
                <div className="absolute -top-3.5 left-4 bg-slate-200 text-slate-600 border border-slate-300 text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full">
                  Pack variant {index + 1}
                </div>

                {/* Pack Weight input */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-[#64748b] tracking-wider pl-0.5">
                    Weight / Vol
                  </label>
                  <input
                    type="number"
                    required
                    value={v.weight}
                    onChange={(e) => handleVariantChange(index, "weight", e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-[#0f172a] outline-none focus:border-[#ff7e00] font-bold"
                    placeholder="e.g. 500"
                  />
                </div>

                {/* Pack Unit selector */}
                <div className="md:col-span-1 space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-[#64748b] tracking-wider pl-0.5">
                    Unit
                  </label>
                  <select
                    value={v.unit}
                    onChange={(e) => handleVariantChange(index, "unit", e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-2 py-2.5 text-xs text-slate-700 outline-none focus:border-[#ff7e00] font-bold cursor-pointer"
                  >
                    {["g", "kg", "ml", "L", "pcs", "pack", "tabs"].map((unitOpt) => (
                      <option key={unitOpt} value={unitOpt}>
                        {unitOpt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* SKU configuration block with trigger */}
                <div className="md:col-span-3 space-y-1.5">
                  <div className="flex justify-between items-center px-0.5">
                    <label className="text-[10px] font-black uppercase text-[#64748b] tracking-wider">
                      Stock SKU Code
                    </label>
                    <button
                      type="button"
                      onClick={() => handleAutoGenerateSKU(index)}
                      className="text-[9px] font-extrabold uppercase text-[#ff7e00] hover:underline cursor-pointer"
                    >
                      Auto Gen ✨
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={v.sku}
                    onChange={(e) => handleVariantChange(index, "sku", e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-[#0f172a] outline-none focus:border-[#ff7e00] font-bold uppercase tracking-wide"
                    placeholder="SKU-CODE"
                  />
                </div>

                {/* Maximum Retail Price MRP */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-[#64748b] tracking-wider pl-0.5">
                    MRP (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={v.mrp}
                    onChange={(e) => handleVariantChange(index, "mrp", e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-red-600 outline-none focus:border-[#ff7e00] font-bold"
                    placeholder="e.g. 150"
                  />
                </div>

                {/* Discounted Supermarket Selling Price */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-[#64748b] tracking-wider pl-0.5">
                    Selling Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={v.sellingPrice}
                    onChange={(e) => handleVariantChange(index, "sellingPrice", e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-green-600 outline-none focus:border-[#ff7e00] font-bold"
                    placeholder="e.g. 135"
                  />
                </div>

                {/* Row Delete Button */}
                <div className="md:col-span-2 flex justify-center pb-0.5">
                  <button
                    type="button"
                    onClick={() => handleRemoveVariantRow(index)}
                    className="w-full h-[38px] bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-rose-500 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 font-bold text-xs shadow-sm"
                  >
                    <SvgTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= FORM ACTIONS BAR ================= */}
        <div className="flex justify-end items-center gap-4 bg-white border border-slate-200 rounded-[1.8rem] p-6 shadow-[0_10px_30px_rgba(15,23,42,0.02)]">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-2xl font-bold transition-all cursor-pointer active:scale-95 text-sm"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-10 py-4 bg-[#ff7e00] hover:bg-[#e06f00] text-white rounded-2xl font-black shadow-lg shadow-[#ff7e00]/25 hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer active:scale-95 text-sm uppercase tracking-wider"
          >
            <SvgCheckCircle /> {loading ? "Publishing Catalog..." : "Publish Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;