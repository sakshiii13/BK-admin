// ===============================================
// src/pages/admin/stores/Stores.jsx
// ===============================================

import React, { useEffect, useState } from "react";

import {
  FaPlus,
  FaEdit,
  FaEye,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import { getAllStoresApi } from "../../../api/admin.api";

const Stores = () => {
  const navigate = useNavigate();

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchStores = async () => {
    try {
      setLoading(true);

      const res = await getAllStoresApi();

      if (res?.success) {
        setStores(res?.data || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-[var(--app-bg)]">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">
            Stores
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Manage all physical stores
          </p>
        </div>

        <button className="btn-3d btn-gradient-orange px-5 h-11 flex items-center gap-2">
          <FaPlus /> Add Store
        </button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <div className="card-3d p-10 text-center text-[var(--text-secondary)]">
            Loading stores...
          </div>
        ) : stores.length === 0 ? (
          <div className="card-3d p-10 text-center text-[var(--text-secondary)]">
            No stores found
          </div>
        ) : (
          stores.map((store) => (
            <div
              key={store?._id}
              className="card-3d overflow-hidden"
            >
              {/* IMAGE */}
              <div className="h-48">
                <img
                  src={
                    store?.images?.[0] ||
                    "https://images.unsplash.com/photo-1542838132-92c53300491e"
                  }
                  alt={store?.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* CONTENT */}
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">
                    {store?.name}
                  </h2>

                  <span
                    className={`text-xs px-3 py-1 rounded-full font-semibold ${
                      store?.isActive
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-500"
                    }`}
                  >
                    {store?.isActive
                      ? "Active"
                      : "Inactive"}
                  </span>
                </div>

                {/* ADDRESS */}
                <p className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mt-3">
                  <FaMapMarkerAlt className="text-[var(--primary-orange)]" />
                  {store?.address}
                </p>

                {/* DETAILS */}
                <div className="mt-4 space-y-2 text-sm text-[var(--text-secondary)]">
                  <p className="flex items-center gap-2">
                    <FaPhoneAlt className="text-[var(--primary-orange)]" />
                    {store?.phoneNumber}
                  </p>

                  <p className="flex items-center gap-2">
                    <FaEnvelope className="text-[var(--primary-orange)]" />
                    {store?.email}
                  </p>

                  <p className="flex items-center gap-2">
                    <FaClock className="text-[var(--primary-orange)]" />
                    {store?.openingTime} -{" "}
                    {store?.closingTime}
                  </p>
                </div>

                {/* BUTTONS */}
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <button
                    onClick={() =>
                      navigate(
                        `/dashboard/stores/${store?._id}`
                      )
                    }
                    className="btn-3d btn-white h-10 flex items-center justify-center gap-2"
                  >
                    <FaEye /> Details
                  </button>

                  <button
                    onClick={() =>
                      navigate(
                        `/dashboard/orders/${store?._id}`
                      )
                    }
                    className="btn-3d btn-white h-10 flex items-center justify-center gap-2"
                  >
                    <FaEye /> Orders
                  </button>

                  <button className="btn-3d btn-gradient-orange col-span-2 h-10 flex items-center justify-center gap-2">
                    <FaEdit /> Update
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Stores;