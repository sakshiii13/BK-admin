// ===============================================
// src/pages/store/OutForDeliveryOrders.jsx
// ===============================================

import React, { useEffect, useMemo, useState } from "react";
import {
  MdDeliveryDining,
  MdSearch,
  MdPhone,
  MdLocationOn,
  MdAccessTime,
  MdShoppingBag,
  MdPerson,
  MdPayments,
  MdCheckCircle,
  MdWarning,
} from "react-icons/md";

import { useParams } from "react-router-dom";

import {
  getStoreOrdersByStatusApi,
  getOutForDeliveryOrdersApi,
  getDeliveredOrdersApi,
  getPendingOrdersApi,
  getConfirmedOrdersApi,
  getAllOrdersByStatusApi,
} from "../../../api/admin.api";

const ORDER_STATUS = [
  "PENDING",
  "CONFIRMED",
  "PACKED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

// =========================================
// API MAPPING FOR EACH STATUS
// =========================================
const getOrdersByStatus = async (storeId, status) => {
  try {
    if (!storeId || storeId === ":storeId") {
      const res = await getAllOrdersByStatusApi(status);
      if (res?.success) {
        // Frontend filter — sirf matching status wale orders
        return {
          ...res,
          data: (res.data || []).filter(
            (order) => order.orderStatus === status
          ),
        };
      }
      return res;
    }

    switch (status) {
      case "PENDING":
        return await getPendingOrdersApi(storeId);
      case "CONFIRMED":
        return await getConfirmedOrdersApi(storeId);
      case "PACKED":
        return await getStoreOrdersByStatusApi(storeId, "PACKED");
      case "OUT_FOR_DELIVERY":
        return await getOutForDeliveryOrdersApi(storeId, status);
      case "DELIVERED":
        return await getDeliveredOrdersApi(storeId);
      default:
        return await getStoreOrdersByStatusApi(storeId, status);
    }
  } catch (error) {
    console.error(`ERROR FETCHING ${status} ORDERS:`, error);
    return { success: false, message: error?.message || "Failed to fetch orders", data: [] };
  }
};

const OutForDeliveryOrders = () => {
  // =========================================
  // DYNAMIC STORE ID
  // route => /store/out-for-delivery/:storeId
  // =========================================
  const { storeId } = useParams();

  // =========================================
  // STATES
  // =========================================
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("PENDING");
  const [error, setError] = useState(null);

  // =========================================
  // FETCH ORDERS BY STATUS
  // =========================================
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log(`📦 FETCHING ${selectedStatus} ORDERS FOR STORE: ${storeId}`);

      const res = await getOrdersByStatus(storeId, selectedStatus);

      console.log(`✅ ${selectedStatus} ORDERS RESPONSE:`, res);

      if (res?.success) {
        setOrders(res?.data || []);
      } else {
        setOrders([]);
        setError(res?.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error(`❌ ERROR FETCHING ${selectedStatus}:`, error);
      setOrders([]);
      setError(error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // PAGE LOAD & STATUS CHANGE
  // =========================================
 useEffect(() => {
  fetchOrders();          // storeId ho ya na ho, fetch karo
}, [storeId, selectedStatus]);

  // =========================================
  // SEARCH FILTER
  // =========================================
  const filteredOrders = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return orders;

    return orders.filter((order) => {
      const orderNo = order?.orderNumber?.toLowerCase() || "";
      const customer = `${order?.user?.firstName || ""} ${
        order?.user?.lastName || ""
      }`.toLowerCase();
      const phone = order?.deliveryAddress?.phoneNumber || "";

      return (
        orderNo.includes(value) ||
        customer.includes(value) ||
        phone.includes(value)
      );
    });
  }, [orders, search]);

  // =========================================
  // FORMAT DATE
  // =========================================
  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =========================================
  // CALCULATE TOTALS
  // =========================================
  const totalRevenue = useMemo(() => {
    return orders.reduce((acc, item) => acc + Number(item?.grandTotal || 0), 0);
  }, [orders]);

  const totalItems = useMemo(() => {
    return orders.reduce(
      (acc, order) =>
        acc +
        (Array.isArray(order?.items)
          ? order.items.reduce((sum, item) => sum + (item?.quantity || 0), 0)
          : 0),
      0
    );
  }, [orders]);

  // =========================================
  // GET STATUS COLOR
  // =========================================
  const getStatusColor = (status) => {
    const colors = {
      PENDING: "bg-yellow-100 text-yellow-700",
      CONFIRMED: "bg-blue-100 text-blue-700",
      PACKED: "bg-purple-100 text-purple-700",
      OUT_FOR_DELIVERY: "bg-orange-100 text-orange-700",
      DELIVERED: "bg-green-100 text-green-700",
    };
    return colors[status] || "bg-slate-100 text-slate-700";
  };

  // =========================================
  // GET HEADER ICON COLOR
  // =========================================
  const getHeaderIconBg = (status) => {
    const colors = {
      PENDING: "bg-yellow-100 text-yellow-600",
      CONFIRMED: "bg-blue-100 text-blue-600",
      PACKED: "bg-purple-100 text-purple-600",
      OUT_FOR_DELIVERY: "bg-orange-100 text-orange-600",
      DELIVERED: "bg-green-100 text-green-600",
    };
    return colors[status] || "bg-orange-100 text-orange-600";
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] p-5 md:p-7">
      {/* =========================================
          HEADER SECTION
      ========================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-7">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 flex items-center gap-3">
            <div
              className={`h-12 w-12 rounded-2xl ${getHeaderIconBg(
                selectedStatus
              )} flex items-center justify-center shadow-sm`}
            >
              <MdDeliveryDining size={28} />
            </div>
            Order Management
          </h1>

          <p className="text-slate-500 text-sm mt-2">
            Manage all delivery orders & track drivers.
          </p>
        </div>

        {/* SEARCH BAR */}
        <div className="relative w-full lg:w-[350px]">
          <MdSearch
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search order / customer / phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-14 pl-12 pr-4 rounded-2xl border border-slate-200 bg-white outline-none focus:border-orange-400 shadow-sm focus:ring-2 focus:ring-orange-200 transition-all"
          />
        </div>
      </div>

      {/* =========================================
          STATUS FILTER BUTTONS
      ========================================= */}
      <div className="flex flex-wrap gap-2 md:gap-3 mb-6 pb-4 border-b border-slate-200">
        {ORDER_STATUS.map((status) => (
          <button
            key={status}
            onClick={() => {
              setSelectedStatus(status);
              setSearch("");
            }}
            className={`px-3 md:px-5 py-2 md:py-3 rounded-2xl text-xs md:text-sm font-bold transition-all duration-200 border whitespace-nowrap
              
              ${
                selectedStatus === status
                  ? "bg-orange-500 text-white border-orange-500 shadow-lg scale-105"
                  : "bg-white text-slate-600 border-slate-200 hover:border-orange-300 hover:bg-orange-50"
              }
            `}
          >
            {status.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      {/* =========================================
          SUMMARY CARDS
      ========================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-7">
        <SummaryCard
          title="Total Orders"
          value={orders.length}
          icon={<MdShoppingBag size={24} />}
          color="blue"
        />

        <SummaryCard
          title="Total Items"
          value={totalItems}
          icon={<MdShoppingBag size={24} />}
          color="purple"
        />

        <SummaryCard
          title="Revenue"
          value={`₹${totalRevenue.toLocaleString("en-IN")}`}
          icon={<MdPayments size={24} />}
          color="green"
        />

        <SummaryCard
          title="Current Status"
          value={selectedStatus.replace(/_/g, " ")}
          icon={<MdCheckCircle size={24} />}
          color="orange"
        />
      </div>

      {/* =========================================
          ERROR STATE
      ========================================= */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <MdWarning className="text-red-500" size={24} />
          <div>
            <p className="font-bold text-red-700">Error Loading Orders</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* =========================================
          LOADING STATE
      ========================================= */}
      {loading ? (
        <div className="bg-white rounded-3xl p-10 text-center shadow-sm border border-slate-200">
          <div className="flex items-center justify-center gap-3">
            <div className="w-6 h-6 border-3 border-orange-300 border-t-orange-500 rounded-full animate-spin"></div>
            <p className="text-slate-600 font-semibold">
              Loading {selectedStatus.replace(/_/g, " ")} Orders...
            </p>
          </div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center shadow-sm border border-slate-200">
          <p className="text-slate-500 text-lg font-semibold">
            🎉 No Orders Found
          </p>
          <p className="text-slate-400 text-sm mt-2">
            {search
              ? "Try searching with different keywords"
              : `No ${selectedStatus.replace(/_/g, " ")} orders yet`}
          </p>
        </div>
      ) : (
        /* =========================================
            ORDERS GRID
        ========================================= */
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order?._id}
              order={order}
              formatDate={formatDate}
              getStatusColor={getStatusColor}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// =========================================
// ORDER CARD COMPONENT
// =========================================
const OrderCard = ({ order, formatDate, getStatusColor }) => {
  return (
    <div className="bg-white rounded-[30px] border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* TOP - ORDER HEADER */}
      <div className="p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-gradient-to-r from-slate-50 to-transparent">
        <div>
          <h2 className="text-xl font-black text-slate-800">
            #{order?.orderNumber}
          </h2>

          <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
            <MdAccessTime size={16} />
            {formatDate(order?.createdAt)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge text={order?.orderStatus} />
          <Badge text={order?.paymentStatus} orange />
          <Badge text={order?.paymentMethod} gray />
        </div>
      </div>

      {/* BODY - CUSTOMER & DELIVERY INFO */}
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {/* CUSTOMER CARD */}
        <InfoCard title="Customer" icon={<MdPerson />}>
          <p className="font-bold text-slate-800">
            {order?.deliveryAddress?.fullName || order?.user?.firstName}
          </p>

          <div className="flex items-center gap-2 mt-2 text-slate-500 text-sm">
            <MdPhone size={16} />
            <a
              href={`tel:${order?.deliveryAddress?.phoneNumber}`}
              className="hover:text-orange-500 transition-colors"
            >
              {order?.deliveryAddress?.phoneNumber}
            </a>
          </div>

          <p className="text-sm text-slate-500 mt-2">
            {order?.user?.email}
          </p>
        </InfoCard>

        {/* DELIVERY ADDRESS CARD */}
        <InfoCard title="Delivery Address" icon={<MdLocationOn />}>
          <p className="text-sm text-slate-700 leading-relaxed font-medium">
            {order?.deliveryAddress?.houseNumber},{" "}
            {order?.deliveryAddress?.apartment}
          </p>

          <p className="text-sm text-slate-500 mt-2">
            {order?.deliveryAddress?.city}, {order?.deliveryAddress?.state}
          </p>

          <p className="text-sm text-slate-500">
            PIN: {order?.deliveryAddress?.postalCode}
          </p>
        </InfoCard>

        {/* DRIVER INFO CARD */}
        <InfoCard title="Driver Info" icon={<MdDeliveryDining />}>
          {order?.driver ? (
            <>
              <p className="font-bold text-slate-800">
                {order?.driver?.firstName}{" "}
                {order?.driver?.lastName}
              </p>

              <p className="text-sm text-slate-500 mt-2">
                {order?.driver?.email}
              </p>

              <p className="text-sm text-slate-500">
                📱 {order?.driver?.number}
              </p>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <MdWarning className="text-red-500" size={16} />
              <p className="text-sm text-red-500 font-semibold">
                Not Assigned Yet
              </p>
            </div>
          )}
        </InfoCard>
      </div>

      {/* ITEMS SECTION */}
      <div className="px-5 py-4 border-t border-slate-100 bg-slate-50">
        <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2">
          <MdShoppingBag size={20} />
          Ordered Items ({order?.items?.length || 0})
        </h3>

        <div className="space-y-3">
          {order?.items?.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 bg-white hover:border-orange-200 transition-colors"
            >
              {/* PRODUCT IMAGE */}
              <img
                src={item?.thumbnail}
                alt={item?.productName}
                className="w-16 h-16 rounded-xl object-cover border border-slate-200"
              />

              {/* PRODUCT DETAILS */}
              <div className="flex-1">
                <h4 className="font-bold text-slate-800 text-sm md:text-base">
                  {item?.productName}
                </h4>

                <p className="text-xs md:text-sm text-slate-500 mt-1">
                  {item?.weight}
                  {item?.unit} × {item?.quantity} items
                </p>
              </div>

              {/* PRICE */}
              <div className="text-right">
                <p className="font-black text-orange-600 text-lg">
                  ₹{Number(item?.totalPrice).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER - TOTAL & TIMELINE */}
      <div className="border-t border-slate-100 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-orange-50 to-transparent">
        <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
          <MdAccessTime className="text-orange-500" size={18} />
          <span>
            {order?.outForDeliveryAt
              ? `Out For Delivery: ${formatDate(order.outForDeliveryAt)}`
              : order?.deliveredAt
              ? `Delivered: ${formatDate(order.deliveredAt)}`
              : "In Progress"}
          </span>
        </div>

        <div className="text-right">
          <p className="text-xs md:text-sm text-slate-500 uppercase tracking-wide">
            Grand Total
          </p>

          <h2 className="text-2xl md:text-3xl font-black text-orange-600">
            ₹{Number(order?.grandTotal || 0).toLocaleString("en-IN")}
          </h2>
        </div>
      </div>
    </div>
  );
};

// =========================================
// SUMMARY CARD COMPONENT
// =========================================
const SummaryCard = ({ title, value, icon, color = "orange" }) => {
  const colors = {
    orange: "bg-orange-50 text-orange-600 border-orange-200",
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
  };

  return (
    <div className={`${colors[color]} rounded-[28px] border p-5 shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs md:text-sm text-slate-600 font-semibold uppercase tracking-wide">
            {title}
          </p>

          <h2 className="text-2xl md:text-2xl font-black text-slate-800 mt-2">
            {value}
          </h2>
        </div>

        <div className={`h-14 w-14 rounded-2xl ${colors[color]} flex items-center justify-center text-2xl`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// =========================================
// INFO CARD COMPONENT
// =========================================
const InfoCard = ({ title, icon, children }) => {
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-[24px] p-5 hover:border-orange-200 transition-colors">
      <div className="flex items-center gap-2 mb-4 text-slate-700 font-black text-sm md:text-base">
        <span className="text-lg">{icon}</span>
        {title}
      </div>

      {children}
    </div>
  );
};

// =========================================
// BADGE COMPONENT
// =========================================
const Badge = ({ text, orange, gray }) => {
  return (
    <span
      className={`px-3 md:px-4 py-1 md:py-2 rounded-full text-xs font-bold whitespace-nowrap
      
      ${
        orange
          ? "bg-orange-100 text-orange-700"
          : gray
          ? "bg-slate-100 text-slate-700"
          : "bg-green-100 text-green-700"
      }
      `}
    >
      {text}
    </span>
  );
};

export default OutForDeliveryOrders;