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
} from "react-icons/md";

import { useParams } from "react-router-dom";

import { getOutForDeliveryOrdersApi } from "../../../api/admin.api";

const ORDER_STATUS = [
  "PENDING",
  "CONFIRMED",
  "PACKED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "DELIVERY_FAILED",
  "CANCELLED",
  "FAILED",
];

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
  const [selectedStatus, setSelectedStatus] =
    useState("OUT_FOR_DELIVERY");

  // =========================================
  // FETCH API
  // =========================================
  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await getOutForDeliveryOrdersApi(
        storeId,
        selectedStatus
      );

      console.log("OUT FOR DELIVERY ORDERS 👉", res);

      if (res?.success) {
        setOrders(res?.data || []);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.log("OUT FOR DELIVERY ERROR 👉", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // PAGE LOAD
  // =========================================
  useEffect(() => {
    if (storeId) {
      fetchOrders();
    }
  }, [storeId, selectedStatus]);

  // =========================================
  // SEARCH FILTER
  // =========================================
  const filteredOrders = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return orders;

    return orders.filter((order) => {
      const orderNo =
        order?.orderNumber?.toLowerCase() || "";

      const customer =
        `${order?.user?.firstName || ""} ${
          order?.user?.lastName || ""
        }`.toLowerCase();

      const phone =
        order?.deliveryAddress?.phoneNumber || "";

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
  // TOTALS
  // =========================================
  const totalRevenue = orders.reduce(
    (acc, item) => acc + Number(item?.grandTotal || 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#f5f7fb] p-5 md:p-7">
      {/* =========================================
          HEADER
      ========================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-7">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shadow-sm">
              <MdDeliveryDining size={28} />
            </div>

            Delivery Orders
          </h1>

          <p className="text-slate-500 text-sm mt-2">
            Manage all delivery orders & track drivers.
          </p>
        </div>

        {/* SEARCH */}
        <div className="relative w-full lg:w-[350px]">
          <MdSearch
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search order..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-14 pl-12 pr-4 rounded-2xl border border-slate-200 bg-white outline-none focus:border-orange-400 shadow-sm"
          />
        </div>
      </div>

      {/* =========================================
          STATUS FILTER
      ========================================= */}
      <div className="flex flex-wrap gap-3 mb-6">
        {ORDER_STATUS.map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-5 py-3 rounded-2xl text-sm font-bold transition-all duration-200 border
              
              ${
                selectedStatus === status
                  ? "bg-orange-500 text-white border-orange-500 shadow-lg"
                  : "bg-white text-slate-600 border-slate-200 hover:border-orange-300"
              }
            `}
          >
            {status.replaceAll("_", " ")}
          </button>
        ))}
      </div>

      {/* =========================================
          SUMMARY CARDS
      ========================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-7">
        <SummaryCard
          title="Total Orders"
          value={orders.length}
          icon={<MdShoppingBag size={24} />}
        />

        <SummaryCard
          title="Revenue"
          value={`₹${totalRevenue}`}
          icon={<MdPayments size={24} />}
        />

        <SummaryCard
          title="Current Status"
          value={selectedStatus}
          icon={<MdCheckCircle size={24} />}
        />
      </div>

      {/* =========================================
          CONTENT
      ========================================= */}
      {loading ? (
        <div className="bg-white rounded-3xl p-10 text-center shadow-sm border border-slate-200">
          Loading Orders...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center shadow-sm border border-slate-200">
          No Orders Found
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order?._id}
              className="bg-white rounded-[30px] border border-slate-200 shadow-sm overflow-hidden"
            >
              {/* TOP */}
              <div className="p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-slate-800">
                    #{order?.orderNumber}
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    {formatDate(order?.createdAt)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge text={order?.orderStatus} />

                  <Badge text={order?.paymentStatus} orange />

                  <Badge text={order?.paymentMethod} gray />
                </div>
              </div>

              {/* BODY */}
              <div className="p-5 grid grid-cols-1 xl:grid-cols-3 gap-5">
                {/* CUSTOMER */}
                <InfoCard
                  title="Customer"
                  icon={<MdPerson />}
                >
                  <p className="font-bold text-slate-800">
                    {order?.deliveryAddress?.fullName}
                  </p>

                  <div className="flex items-center gap-2 mt-2 text-slate-500 text-sm">
                    <MdPhone />
                    {order?.deliveryAddress?.phoneNumber}
                  </div>

                  <p className="text-sm text-slate-500 mt-2">
                    {order?.user?.email}
                  </p>
                </InfoCard>

                {/* ADDRESS */}
                <InfoCard
                  title="Delivery Address"
                  icon={<MdLocationOn />}
                >
                  <p className="text-sm text-slate-700 leading-6">
                    {order?.deliveryAddress?.houseNumber},{" "}
                    {order?.deliveryAddress?.apartment}
                  </p>

                  <p className="text-sm text-slate-500 mt-1">
                    {order?.deliveryAddress?.city},{" "}
                    {order?.deliveryAddress?.state}
                  </p>

                  <p className="text-sm text-slate-500">
                    {order?.deliveryAddress?.postalCode}
                  </p>
                </InfoCard>

                {/* DRIVER */}
                <InfoCard
                  title="Driver Info"
                  icon={<MdDeliveryDining />}
                >
                  {order?.assignedDriver ? (
                    <>
                      <p className="font-bold text-slate-800">
                        {order?.assignedDriver?.firstName}{" "}
                        {order?.assignedDriver?.lastName}
                      </p>

                      <p className="text-sm text-slate-500 mt-2">
                        {order?.assignedDriver?.email}
                      </p>

                      <p className="text-sm text-slate-500">
                        {order?.assignedDriver?.number}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-red-500 font-semibold">
                      Driver Not Assigned
                    </p>
                  )}
                </InfoCard>
              </div>

              {/* ITEMS */}
              <div className="px-5 pb-5">
                <h3 className="font-black text-slate-800 mb-4">
                  Ordered Items
                </h3>

                <div className="space-y-3">
                  {order?.items?.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50"
                    >
                      <img
                        src={item?.thumbnail}
                        alt={item?.productName}
                        className="w-16 h-16 rounded-2xl object-cover border border-slate-200"
                      />

                      <div className="flex-1">
                        <h4 className="font-bold text-slate-800">
                          {item?.productName}
                        </h4>

                        <p className="text-sm text-slate-500 mt-1">
                          {item?.weight}
                          {item?.unit} × {item?.quantity}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-black text-slate-800">
                          ₹{item?.totalPrice}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FOOTER */}
              <div className="border-t border-slate-100 p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <MdAccessTime />
                  Out For Delivery :
                  {formatDate(order?.outForDeliveryAt)}
                </div>

                <div className="text-right">
                  <p className="text-sm text-slate-500">
                    Grand Total
                  </p>

                  <h2 className="text-2xl font-black text-orange-600">
                    ₹{order?.grandTotal}
                  </h2>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// =========================================
// SUMMARY CARD
// =========================================
const SummaryCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white rounded-[28px] border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>

          <h2 className="text-3xl font-black text-slate-800 mt-2">
            {value}
          </h2>
        </div>

        <div className="h-14 w-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center text-2xl">
          {icon}
        </div>
      </div>
    </div>
  );
};

// =========================================
// INFO CARD
// =========================================
const InfoCard = ({ title, icon, children }) => {
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-[24px] p-5">
      <div className="flex items-center gap-2 mb-4 text-slate-700 font-black">
        {icon}
        {title}
      </div>

      {children}
    </div>
  );
};

// =========================================
// BADGE
// =========================================
const Badge = ({ text, orange, gray }) => {
  return (
    <span
      className={`px-4 py-2 rounded-full text-xs font-black
      
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