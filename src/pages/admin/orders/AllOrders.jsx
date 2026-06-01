import React, { useEffect, useState, useMemo } from "react";
import {
  FaStore,
  FaRupeeSign,
  FaSearch,
  FaSyncAlt,
} from "react-icons/fa";
import Axios from "../../../api/axiosInstance";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [apiError, setApiError] = useState(""); // Erros ko track karne ke liye state

  // ================= FETCH ORDERS =================
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setApiError(""); // Clear previous errors

      const res = await Axios.get("/admin/all-orders");
      const data = res?.data;
      console.log("👉 FULL API RESPONSE:", data);

      // Backend response se data extract kar rahe hain
      const ordersData = data?.data || data || [];
      console.log("👉 EXTRACTED ORDERS ARRAY:", ordersData);

      if (Array.isArray(ordersData)) {
        setOrders(ordersData);
      } else {
        console.warn("Extracted data is not an array:", ordersData);
        setOrders([]);
      }
    } catch (error) {
      console.error("❌ Orders fetch error:", error);
      const msg = error?.response?.data?.message || error?.message || "Failed to fetch orders";
      setApiError(msg);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ================= FILTER =================
  const filteredOrders = useMemo(() => {
    const q = search?.trim()?.toLowerCase();
    if (!q) return orders;

    return orders.filter((o) => {
      const orderNo = String(o?.orderNumber || "").toLowerCase();
      const userFirst = String(o?.user?.firstName || "").toLowerCase();
      const userEmail = String(o?.user?.email || "").toLowerCase();
      
      return orderNo.includes(q) || userFirst.includes(q) || userEmail.includes(q);
    });
  }, [search, orders]);

  return (
    <div className="p-4 md:p-6 space-y-6">

      {/* ================= HEADER ================= */}
      <div className="card-3d p-5 flex flex-col md:flex-row justify-between gap-4 md:items-center">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800">All Orders</h1>
          <p className="text-xs text-slate-500">Manage and track all customer orders</p>
        </div>

        <div className="flex gap-3 items-center w-full md:w-auto">
          {/* SEARCH */}
          <div className="relative flex-1 md:flex-none">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search orders..."
              className="input-3d h-10 pl-10 pr-3 text-sm w-full md:w-64"
            />
          </div>

          {/* REFRESH */}
          <button
            onClick={fetchOrders}
            className="btn-3d btn-white h-10 px-4 flex items-center gap-2"
          >
            <FaSyncAlt className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* ================= ORDERS CONTAINER ================= */}
      {loading ? (
        <div className="card-3d p-10 text-center text-slate-500">
          <div className="animate-pulse flex flex-col items-center gap-2">
            <div className="h-4 w-32 bg-slate-200 rounded"></div>
            <p>Loading orders from database...</p>
          </div>
        </div>
      ) : apiError ? (
        <div className="card-3d p-10 text-center border border-red-200 bg-red-50 text-red-600 rounded-xl">
          <p className="font-bold">Backend Connection Error!</p>
          <p className="text-xs text-red-500 mt-1">{apiError}</p>
          <p className="text-[11px] text-slate-400 mt-2">Check if backend server is running on port 5000 and CORS is enabled.</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="card-3d p-10 text-center text-slate-500">
          No orders found in the system.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredOrders.map((order) => (
            <div
              key={order?._id || Math.random()}
              className="card-3d p-5 hover:scale-[1.01] transition-all duration-300 bg-white"
            >
              {/* ORDER HEADER */}
              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="text-xs text-slate-400">Order ID</p>
                  <p className="font-bold text-slate-800 text-sm">
                    {order?.orderNumber || "N/A"}
                  </p>
                </div>
                <span className="px-3 py-1 text-[10px] font-bold rounded-full bg-orange-100 text-orange-600 uppercase">
                  {order?.orderStatus || "Pending"}
                </span>
              </div>

              {/* USER INFO */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-green-400 flex items-center justify-center text-white font-bold">
                  {order?.user?.firstName ? order.user.firstName.charAt(0).toUpperCase() : "U"}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    {order?.user?.firstName || "Unknown User"}{" "}
                    {order?.user?.lastName || ""}
                  </p>
                  <p className="text-xs text-slate-500">
                    {order?.user?.email || "No email attached"}
                  </p>
                </div>
              </div>

              {/* STORE + PRICE */}
              <div className="flex justify-between text-xs text-slate-600 mb-3 border-t border-b border-slate-100 py-2">
                <span className="flex items-center gap-2">
                  <FaStore className="text-orange-500" />
                  {order?.store?.name || "Direct / Unknown Store"}
                </span>
                <span className="flex items-center gap-1 font-bold text-green-600 text-sm">
                  <FaRupeeSign />
                  {order?.grandTotal || 0}
                </span>
              </div>

              {/* ITEMS LIST */}
              <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-600">
                <p className="font-bold mb-1.5 text-slate-700">Items Ordered:</p>
                {order?.items && order.items.length > 0 ? (
                  order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between py-0.5 border-b border-dashed border-slate-200/60 last:border-none">
                      <span>{item?.productName || item?.product?.name || "Product Item"}</span>
                      <span className="font-semibold text-slate-800">
                        x{item?.quantity || 1}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 italic">No items found in this order</p>
                )}
              </div>

              {/* FOOTER */}
              <div className="mt-3 flex justify-between text-[11px] text-slate-400 font-medium">
                <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">{order?.paymentMethod || "COD"}</span>
                <span className={`px-2 py-0.5 rounded ${order?.paymentStatus === "Paid" ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"}`}>
                  {order?.paymentStatus || "Unpaid"}
                </span>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllOrders;