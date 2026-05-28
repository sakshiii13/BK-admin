// src/pages/products/Products.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import { showConfirm, showSuccess } from "../../../utils/alertService";
import TableComponent from "../../../components/global/TableComponent";

const defaultProducts = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce",
    name: "Fresh Organic Apples",
    brand: "Fresh Farm",
    category: "Fruits",
    subCategory: "Fresh Fruits",
    variant: "1 kg",
    price: "₹299",
    stock: 150,
    status: "In Stock",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff",
    name: "Whole Wheat Bread",
    brand: "Bake House",
    category: "Bakery",
    subCategory: "Bread",
    variant: "1 Pack",
    price: "₹89",
    stock: 22,
    status: "Low Stock",
  },
];

const Products = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);

  const loadProducts = () => {
    const savedProducts = JSON.parse(localStorage.getItem("products")) || [];
    setProducts([...savedProducts, ...defaultProducts]);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id) => {
    const result = await showConfirm({
      title: "Delete Product?",
      text: "Are you sure you want to delete this product from catalog?",
      confirmButtonText: "Yes, Delete"
    });

    if (!result.isConfirmed) return;

    try {
      dispatch(showLoader());
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const savedProducts = JSON.parse(localStorage.getItem("products")) || [];
      const updatedProducts = savedProducts.filter((item) => item.id !== id);

      localStorage.setItem("products", JSON.stringify(updatedProducts));
      loadProducts();
      
      dispatch(hideLoader());
      showSuccess("Product deleted successfully");
    } catch (err) {
      dispatch(hideLoader());
    }
  };

  const columns = [
    {
      key: "product",
      label: "Product",
      render: (_, row) => (
        <div className="flex items-center gap-3">
          {/* Direct use of our img-3d utility class */}
          <img src={row.image} alt={row.name} className="img-3d h-12 w-12 object-cover" />
          <div>
            <p className="font-bold text-slate-800 text-sm">{row.name}</p>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">{row.brand}</p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (value) => <span className="font-bold text-slate-700">{value}</span>
    },
    {
      key: "subCategory",
      label: "Sub Category",
      render: (value) => (
        <span className="rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-bold text-slate-600">
          {value || "-"}
        </span>
      ),
    },
    {
      key: "variant",
      label: "Variant",
      render: (value) => (
        <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-extrabold text-orange-600">
          {value || "-"}
        </span>
      ),
    },
    {
      key: "price",
      label: "Price",
      render: (value) => <span className="font-extrabold text-slate-900 text-sm">{value}</span>
    },
    {
      key: "stock",
      label: "Stock",
      render: (value) => <span className="font-bold text-slate-800">{value} units</span>
    },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span
          className={`rounded-full border px-3 py-1 text-xs font-extrabold 
          ${
            value === "In Stock" ? "border-green-200 bg-green-50 text-green-600"
            : value === "Low Stock" ? "border-yellow-200 bg-yellow-50 text-yellow-600"
            : "border-red-200 bg-red-50 text-red-600"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="flex items-center gap-2.5">
          {/* Action buttons utilizing btn-3d and btn-white */}
          <button
            className="btn-3d btn-white h-9 w-9 rounded-xl flex items-center justify-center text-blue-600"
            onClick={() => console.log("Edit:", row.id)}
          >
            <FaEdit className="text-sm" />
          </button>
          <button
            className="btn-3d btn-white h-9 w-9 rounded-xl flex items-center justify-center text-red-500"
            onClick={() => handleDelete(row.id)}
          >
            <FaTrash className="text-xs" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <TableComponent
        title="Products"
        subtitle="Manage your grocery catalog"
        columns={columns}
        data={products}
        searchPlaceholder="Search products..."
        addButtonText="Add Product"
        onAdd={() => navigate("/products/add")}
        onRefresh={loadProducts}
      />
    </div>
  );
};

export default Products;