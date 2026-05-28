// src/pages/products/AddProduct.jsx

import React, { useRef, useState } from "react";
import { FaSave, FaArrowLeft, FaUpload, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import { showSuccess, showError } from "../../../utils/alertService";

const AddProduct = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");

  const [category, setCategory] = useState("Fruits");
  const [subCategory, setSubCategory] = useState("Fresh Fruits");
  const [brand, setBrand] = useState("Organic Farms");
  const [variant, setVariant] = useState("1 kg");

  const [regularPrice, setRegularPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [stock, setStock] = useState("");

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const subCategoryOptions = {
    Fruits: ["Fresh Fruits", "Seasonal Fruits", "Imported Fruits"],
    Vegetables: ["Leafy Vegetables", "Root Vegetables", "Fresh Vegetables"],
    Dairy: ["Milk", "Curd", "Paneer", "Cheese"],
    Bakery: ["Bread", "Cookies", "Cakes"],
    Snacks: ["Chips", "Namkeen", "Biscuits"],
    Beverages: ["Juice", "Soft Drinks", "Tea", "Coffee"],
  };

  const variantOptions = [
    "250 g", "500 g", "1 kg", "2 kg", "5 kg", "500 ml", "1 L", "1 Pack", "Combo Pack",
  ];

  const handleCategoryChange = (e) => {
    const selected = e.target.value;
    setCategory(selected);
    setSubCategory(subCategoryOptions[selected][0]);
  };

  const handleOpenFile = () => fileInputRef.current?.click();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showError("Please select image only");
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setImageFile(null);
    setImagePreview(null);
    fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(showLoader());
      const newProduct = {
        id: Date.now(),
        image: imagePreview || "/logo.png",
        name: productName,
        description,
        category,
        subCategory,
        brand,
        variant,
        price: `₹${salePrice || regularPrice}`,
        stock: Number(stock),
        status: Number(stock) === 0 ? "Out of Stock" : Number(stock) <= 25 ? "Low Stock" : "In Stock",
      };

      const oldProducts = JSON.parse(localStorage.getItem("products")) || [];
      localStorage.setItem("products", JSON.stringify([newProduct, ...oldProducts]));

      await new Promise(resolve => setTimeout(resolve, 800));
      dispatch(hideLoader());
      await showSuccess("Product published successfully ✨");
      navigate("/products");
    } catch (err) {
      dispatch(hideLoader());
      showError(err?.message || "Failed to publish product");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-5xl mx-auto">
      {/* Top Action Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="btn-3d btn-white h-11 w-11 flex items-center justify-center rounded-xl"
        >
          <FaArrowLeft className="text-sm" />
        </button>

        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Add New Product</h1>
          <p className="text-sm text-slate-500 mt-0.5 font-medium">Add product with category, sub category and variant</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Basic Information */}
          <div className="card-3d p-6">
            <h2 className="text-lg font-extrabold text-slate-800 mb-5 border-b border-slate-100 pb-3">Basic Information</h2>
            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Product Name</label>
                <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="e.g. Mangoes" required className="input-3d mt-2 w-full px-4 py-3" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</label>
                <textarea rows="4" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter product description..." className="input-3d mt-2 w-full px-4 py-3" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category</label>
                  <select value={category} onChange={handleCategoryChange} className="input-3d mt-2 w-full px-4 py-3 cursor-pointer">
                    <option>Fruits</option><option>Vegetables</option><option>Dairy</option><option>Bakery</option><option>Snacks</option><option>Beverages</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sub Category</label>
                  <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)} className="input-3d mt-2 w-full px-4 py-3 cursor-pointer">
                    {subCategoryOptions[category].map(item => <option key={item}>{item}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Brand</label>
                  <select value={brand} onChange={(e) => setBrand(e.target.value)} className="input-3d mt-2 w-full px-4 py-3 cursor-pointer">
                    <option>Organic Farms</option><option>Fresh Daily</option><option>Local Vendor</option><option>BK Grocery</option><option>Amul</option><option>Britannia</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Variant</label>
                  <select value={variant} onChange={(e) => setVariant(e.target.value)} className="input-3d mt-2 w-full px-4 py-3 cursor-pointer">
                    {variantOptions.map(item => <option key={item}>{item}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Pricing & Stock */}
          <div className="card-3d p-6">
            <h2 className="text-lg font-extrabold text-slate-800 mb-5 border-b border-slate-100 pb-3">Pricing & Stock</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Regular Price (₹)</label>
                <input type="number" placeholder="Regular" value={regularPrice} onChange={(e) => setRegularPrice(e.target.value)} required className="input-3d w-full px-4 py-3" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Sale Price (₹)</label>
                <input type="number" placeholder="Sale" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} className="input-3d w-full px-4 py-3" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Stock Quantity</label>
                <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} required className="input-3d w-full px-4 py-3" />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-6">
          <div className="card-3d p-6">
            <h2 className="text-lg font-extrabold text-slate-800 mb-4 border-b border-slate-100 pb-3">Product Image</h2>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            <div onClick={handleOpenFile} className="relative w-full aspect-square bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-orange-400 group transition-all">
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-cover rounded-xl" />
                  <button type="button" onClick={handleRemoveImage} className="absolute top-3 right-3 h-9 w-9 rounded-full bg-red-500 text-white flex items-center justify-center hover:scale-110 transition-transform">
                    <FaTimes />
                  </button>
                </>
              ) : (
                <>
                  <div className="h-12 w-12 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center group-hover:scale-110 group-hover:bg-orange-100 group-hover:text-orange-500 transition-all">
                    <FaUpload className="text-xl" />
                  </div>
                  <p className="text-xs text-slate-500 font-bold tracking-wide">Click to upload image</p>
                </>
              )}
            </div>
          </div>
          <div className="card-3d p-4">
            <button type="submit" className="btn-3d btn-gradient-orange w-full py-3.5 flex items-center justify-center gap-2 text-base">
              <FaSave className="text-lg" /> Publish Product
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddProduct;