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
      // Simulate quick action loader
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
          <div className="h-12 w-12 overflow-hidden rounded-xl border border-white/10 bg-white/5">
            <img
              src={row.image}
              alt={row.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <p className="font-semibold text-white">{row.name}</p>
            <p className="text-xs text-slate-400">{row.brand}</p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
    },
    {
      key: "subCategory",
      label: "Sub Category",
      render: (value) => (
        <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300">
          {value || "-"}
        </span>
      ),
    },
    {
      key: "variant",
      label: "Variant",
      render: (value) => (
        <span className="rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-300">
          {value || "-"}
        </span>
      ),
    },
    {
      key: "price",
      label: "Price",
    },
    {
      key: "stock",
      label: "Stock",
      render: (value) => (
        <span className="font-semibold text-white">{value} units</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span
          className={`rounded-full border px-3 py-1 text-xs font-bold
          ${
            value === "In Stock"
              ? "border-green-500/20 bg-green-500/10 text-green-400"
              : value === "Low Stock"
              ? "border-yellow-500/20 bg-yellow-500/10 text-yellow-400"
              : "border-red-500/20 bg-red-500/10 text-red-400"
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
        <div className="flex items-center gap-2">
          <button
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 transition hover:bg-blue-500/20"
            onClick={() => console.log("Edit:", row.id)}
          >
            <FaEdit />
          </button>

          <button
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10 text-red-400 transition hover:bg-red-500/20"
            onClick={() => handleDelete(row.id)}
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
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