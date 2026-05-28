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
    "250 g",
    "500 g",
    "1 kg",
    "2 kg",
    "5 kg",
    "500 ml",
    "1 L",
    "1 Pack",
    "Combo Pack",
  ];

  const handleCategoryChange = (e) => {
    const selected = e.target.value;
    setCategory(selected);
    setSubCategory(subCategoryOptions[selected][0]);
  };

  const handleOpenFile = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showError("Please select image only");
      return;
    }

    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
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
        status:
          Number(stock) === 0
            ? "Out of Stock"
            : Number(stock) <= 25
            ? "Low Stock"
            : "In Stock",
      };

      const oldProducts = JSON.parse(localStorage.getItem("products")) || [];

      localStorage.setItem(
        "products",
        JSON.stringify([newProduct, ...oldProducts])
      );

      // Simulate publishing delay for premium visual feedback
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
      <div className="flex items-center gap-4 mb-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="h-10 w-10 rounded-xl bg-[var(--card-bg)] border border-[var(--border-soft)] text-gray-400 flex items-center justify-center hover:text-white hover:border-orange-500/50"
        >
          <FaArrowLeft />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-white">Add New Product</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Add product with category, sub category and variant
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass rounded-3xl p-6 border border-white/10 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-4">
              Basic Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-300">
                  Product Name
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. Mangoes"
                  required
                  className="mt-2 w-full bg-[var(--card-bg)] border border-[var(--border-soft)] rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500/50"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-300">
                  Description
                </label>
                <textarea
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter product description..."
                  className="mt-2 w-full bg-[var(--card-bg)] border border-[var(--border-soft)] rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-300">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={handleCategoryChange}
                    className="mt-2 w-full bg-[var(--card-bg)] border border-[var(--border-soft)] rounded-xl px-4 py-3 text-white outline-none"
                  >
                    <option>Fruits</option>
                    <option>Vegetables</option>
                    <option>Dairy</option>
                    <option>Bakery</option>
                    <option>Snacks</option>
                    <option>Beverages</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-300">
                    Sub Category
                  </label>
                  <select
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    className="mt-2 w-full bg-[var(--card-bg)] border border-[var(--border-soft)] rounded-xl px-4 py-3 text-white outline-none"
                  >
                    {subCategoryOptions[category].map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-300">
                    Brand
                  </label>
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="mt-2 w-full bg-[var(--card-bg)] border border-[var(--border-soft)] rounded-xl px-4 py-3 text-white outline-none"
                  >
                    <option>Organic Farms</option>
                    <option>Fresh Daily</option>
                    <option>Local Vendor</option>
                    <option>BK Grocery</option>
                    <option>Amul</option>
                    <option>Britannia</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-300">
                    Variant
                  </label>
                  <select
                    value={variant}
                    onChange={(e) => setVariant(e.target.value)}
                    className="mt-2 w-full bg-[var(--card-bg)] border border-[var(--border-soft)] rounded-xl px-4 py-3 text-white outline-none"
                  >
                    {variantOptions.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="glass rounded-3xl p-6 border border-white/10 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-4">
              Pricing & Stock
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="number"
                placeholder="Regular Price"
                value={regularPrice}
                onChange={(e) => setRegularPrice(e.target.value)}
                required
                className="bg-[var(--card-bg)] border border-[var(--border-soft)] rounded-xl px-4 py-3 text-white outline-none"
              />

              <input
                type="number"
                placeholder="Sale Price"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                className="bg-[var(--card-bg)] border border-[var(--border-soft)] rounded-xl px-4 py-3 text-white outline-none"
              />

              <input
                type="number"
                placeholder="Stock Quantity"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
                className="bg-[var(--card-bg)] border border-[var(--border-soft)] rounded-xl px-4 py-3 text-white outline-none"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass rounded-3xl p-6 border border-white/10 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-4">
              Product Image
            </h2>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            <div
              onClick={handleOpenFile}
              className="relative w-full aspect-square bg-[var(--card-bg)] border-2 border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer overflow-hidden"
            >
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-3 right-3 h-9 w-9 rounded-full bg-red-500 text-white flex items-center justify-center"
                  >
                    <FaTimes />
                  </button>
                </>
              ) : (
                <>
                  <FaUpload className="text-3xl text-gray-400" />
                  <p className="text-sm text-gray-400">
                    Click to upload image
                  </p>
                </>
              )}
            </div>

            {imageFile && (
              <p className="mt-3 text-xs text-slate-400 truncate">
                Selected:{" "}
                <span className="text-orange-400">{imageFile.name}</span>
              </p>
            )}
          </div>

          <div className="glass rounded-3xl p-6 border border-white/10 shadow-xl">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-400 text-white px-8 py-3.5 rounded-xl font-bold text-lg"
            >
              <FaSave /> Publish Product
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddProduct;