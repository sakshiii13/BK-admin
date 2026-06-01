// ===============================================
// src/pages/admin/StoreProducts.jsx
// ===============================================

import React, { useEffect, useMemo, useState } from "react";

import {
  getStoreOrdersApi,
  packStoreOrderApi,
  getStoreByIdApi,
} from "../../../api/admin.api";

import { AdminRouters } from "../../../constants/routes";
import { useParams, useNavigate } from "react-router-dom";

import {
  ShoppingBag,
  User,
  MapPin,
  Calendar,
  Package,
  IndianRupee,
  Truck,
  CreditCard,
  Search,
  Store,
  Clock3,
  Phone,
  Mail,
} from "lucide-react";

const Orders = () => {
  // =========================================
  // ROUTE PARAM
  // =========================================
  const { storeId } = useParams();
  const navigate = useNavigate();

  // =========================================
  // STATES
  // =========================================
  const [orders, setOrders] = useState([]);
  const [store, setStore] = useState(null);

  const [loading, setLoading] = useState(false);
  const [packingId, setPackingId] = useState(null);
  const [packSuccess, setPackSuccess] = useState(false);

  const [search, setSearch] = useState("");

  // =========================================
  // FETCH STORE DETAILS
  // =========================================
  const fetchStoreDetails = async () => {
    try {
      const res = await getStoreByIdApi(storeId);

      console.log("STORE DETAILS 👉", res);

      const finalStore =
        res?.data ||
        res?.store ||
        res?.data?.store ||
        null;

      setStore(finalStore);
    } catch (error) {
      console.log("STORE DETAILS ERROR 👉", error);
    }
  };

  // =========================================
  // FETCH STORE ORDERS
  // =========================================
  // const fetchStoreOrders = async () => {
  //   try {
  //     setLoading(true);

  //     console.log("STORE ID 👉", storeId);

  //     const res = await getStoreOrdersApi(storeId);

  //     console.log("STORE ORDERS RESPONSE 👉", res);

  //     const finalData = Array.isArray(res?.data)
  //       ? res.data
  //       : Array.isArray(res?.data?.data)
  //       ? res.data.data
  //       : [];

  //     setOrders(finalData);
  //   } catch (error) {
  //     console.log("STORE ORDERS ERROR 👉", error);

  //     setOrders([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // // =========================================
  // // COMPONENT LOAD
  // // =========================================
  // useEffect(() => {
  //   if (storeId) {
  //     // fetchStoreDetails();
  //     fetchStoreOrders();
  //   }
  // }, []);

  useEffect(()=>{
    try{
      setLoading(true);
      if(storeId){
        Promise.all([
          getStoreByIdApi(storeId),
          getStoreOrdersApi(storeId)
        ]).then(([storeRes, ordersRes])=>{
          console.log("STORE DETAILS 👉", storeRes);
          console.log("STORE ORDERS RESPONSE 👉", ordersRes);
          setStore(storeRes?.data || storeRes?.store || null);
          setOrders(Array.isArray(ordersRes?.data) ? ordersRes.data : Array.isArray(ordersRes?.data?.data) ? ordersRes.data.data : []);
        });
      }
    } catch (error) {
      console.log("ERROR 👉", error);
    } finally {
      setLoading(false);  
    }
  },[])

  // =========================================
  // PACK ORDER
  // =========================================
  const handlePackOrder = async (orderId) => {
    try {
      setPackingId(orderId);

      const res = await packStoreOrderApi(
        storeId,
        orderId
      );

      console.log("PACK ORDER RESPONSE 👉", res);

      if (res?.success) {
        // =========================================
        // LOCAL UI UPDATE
        // =========================================
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId
              ? {
                  ...order,
                  orderStatus: "PACKED",
                  packedAt: new Date().toISOString(),
                }
              : order
          )
        );

        setPackSuccess(true);
      }
    } catch (error) {
      console.log("PACK ORDER ERROR 👉", error);
    } finally {
      setPackingId(null);
    }
  };

  const handleClosePackModal = () => {
    setPackSuccess(false);
  };

  const handleGoToPackedOrders = () => {
    setPackSuccess(false);
    navigate(`${AdminRouters.PACKED_ORDERS}?storeId=${storeId}`);
  };

  // =========================================
  // DATE FORMAT
  // =========================================
  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =========================================
  // SEARCH FILTER
  // =========================================
  const filteredOrders = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return orders;

    return orders.filter((order) => {
      const customerName = `${
        order?.user?.firstName || ""
      } ${order?.user?.lastName || ""}`.toLowerCase();

      const orderNumber =
        order?.orderNumber?.toLowerCase() || "";

      const email =
        order?.user?.email?.toLowerCase() || "";

      const status =
        order?.orderStatus?.toLowerCase() || "";

      return (
        customerName.includes(value) ||
        orderNumber.includes(value) ||
        email.includes(value) ||
        status.includes(value)
      );
    });
  }, [orders, search]);

  // =========================================
  // TOTALS
  // =========================================
  const totalRevenue = orders.reduce(
    (acc, order) =>
      acc + Number(order?.grandTotal || 0),
    0
  );

  const totalItems = orders.reduce(
    (acc, order) =>
      acc + Number(order?.totalItems || 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-6">
      {/* =========================================
          STORE HEADER
      ========================================= */}
      <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm mb-6">
        {/* STORE IMAGE */}
        <div className="h-[260px] w-full bg-slate-100">
          <img
            src={
              store?.images?.[0] ||
              "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop"
            }
            alt={store?.name}
            className="h-full w-full object-cover"
          />
        </div>

        {/* STORE INFO */}
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-2xl bg-orange-100 flex items-center justify-center">
                  <Store
                    size={24}
                    className="text-orange-500"
                  />
                </div>

                <div>
                  <h1 className="text-3xl font-bold text-slate-900">
                    {store?.name || "Store"}
                  </h1>

                  <p className="text-slate-500 mt-1">
                    {store?.description ||
                      "Store details"}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem
                  icon={
                    <MapPin
                      size={16}
                      className="text-sky-500"
                    />
                  }
                  text={store?.address}
                />

                <InfoItem
                  icon={
                    <Phone
                      size={16}
                      className="text-emerald-500"
                    />
                  }
                  text={store?.phoneNumber}
                />

                <InfoItem
                  icon={
                    <Mail
                      size={16}
                      className="text-pink-500"
                    />
                  }
                  text={store?.email}
                />

                <InfoItem
                  icon={
                    <Clock3
                      size={16}
                      className="text-orange-500"
                    />
                  }
                  text={`${store?.openingTime} - ${store?.closingTime}`}
                />
              </div>
            </div>

            {/* STATUS */}
            <div className="flex flex-col gap-3">
              <div className="px-5 py-3 rounded-2xl bg-orange-50 border border-orange-100 text-orange-600 font-semibold">
                🚚 Delivery Radius:{" "}
                {store?.deliveryRadius || 0} KM
              </div>

              <div
                className={`px-5 py-3 rounded-2xl font-semibold ${
                  store?.isActive
                    ? "bg-emerald-50 border border-emerald-200 text-emerald-600"
                    : "bg-red-50 border border-red-200 text-red-600"
                }`}
              >
                {store?.isActive
                  ? "✅ Store Active"
                  : "❌ Store Inactive"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================
          HEADER
      ========================================= */}
      <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-orange-100 flex items-center justify-center">
              <ShoppingBag
                className="text-orange-500"
                size={22}
              />
            </div>

            Store Orders
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            Manage all store orders easily.
          </p>
        </div>

        {/* SEARCH */}
        <div className="relative w-full lg:w-[340px]">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-white outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all"
          />
        </div>
      </div>

      {/* =========================================
          SUMMARY CARDS
      ========================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <SummaryCard
          title="Total Orders"
          value={orders.length}
          icon={
            <ShoppingBag
              size={20}
              className="text-orange-500"
            />
          }
        />

        <SummaryCard
          title="Total Items"
          value={totalItems}
          icon={
            <Package
              size={20}
              className="text-sky-500"
            />
          }
        />

        <SummaryCard
          title="Revenue"
          value={`₹${totalRevenue}`}
          icon={
            <IndianRupee
              size={20}
              className="text-emerald-500"
            />
          }
        />
      </div>

      {packSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-[32px] bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900">
              Order packed successfully
            </h3>
            <p className="mt-3 text-sm text-slate-600">
              The order has been packed. Would you like to stay on this page or go to the packed orders list?
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleClosePackModal}
                className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Stay here
              </button>

              <button
                type="button"
                onClick={handleGoToPackedOrders}
                className="rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                Go to Packed Orders
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================
          ORDERS
      ========================================= */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center shadow-sm">
          Loading orders...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center shadow-sm text-slate-500">
          No orders found
        </div>
      ) : (
        <div className="space-y-5">
          {filteredOrders.map((order) => (
            <div
              key={order?._id}
              className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
            >
              {/* TOP */}
              <div className="p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h2 className="font-bold text-slate-900 text-lg">
                    #{order?.orderNumber || "N/A"}
                  </h2>

                  <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                    <Calendar size={14} />
                    {formatDate(order?.createdAt)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <StatusBadge
                    text={order?.orderStatus}
                    type="order"
                  />

                  <StatusBadge
                    text={order?.paymentStatus}
                    type="payment"
                  />

                  <StatusBadge
                    text={order?.paymentMethod}
                    type="method"
                  />
                </div>
              </div>

              {/* INFO */}
              <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* CUSTOMER */}
                <InfoCard
                  icon={
                    <User
                      size={17}
                      className="text-orange-500"
                    />
                  }
                  title="Customer"
                >
                  <p className="font-semibold text-slate-900">
                    {order?.deliveryAddress
                      ?.fullName || "N/A"}
                  </p>

                  <p className="text-sm text-slate-500 mt-1">
                    {order?.deliveryAddress
                      ?.phoneNumber || "N/A"}
                  </p>
                </InfoCard>

                {/* ADDRESS */}
                <InfoCard
                  icon={
                    <MapPin
                      size={17}
                      className="text-sky-500"
                    />
                  }
                  title="Delivery Address"
                >
                  <p className="text-sm text-slate-700">
                    {
                      order?.deliveryAddress
                        ?.houseNumber
                    }
                    ,{" "}
                    {
                      order?.deliveryAddress
                        ?.apartment
                    }
                  </p>

                  <p className="text-sm text-slate-500 mt-1">
                    {
                      order?.deliveryAddress
                        ?.city
                    }
                    ,{" "}
                    {
                      order?.deliveryAddress
                        ?.state
                    }
                  </p>

                  <p className="text-sm text-slate-500">
                    {
                      order?.deliveryAddress
                        ?.postalCode
                    }
                  </p>
                </InfoCard>

                {/* PAYMENT */}
                <InfoCard
                  icon={
                    <CreditCard
                      size={17}
                      className="text-emerald-500"
                    />
                  }
                  title="Payment Summary"
                >
                  <PriceRow
                    label="MRP"
                    value={`₹${
                      order?.totalMrp || 0
                    }`}
                  />

                  <PriceRow
                    label="Discount"
                    value={`-₹${
                      order?.totalDiscount || 0
                    }`}
                    green
                  />

                  <div className="flex justify-between font-bold text-slate-900 pt-2 border-t mt-2">
                    <span>Total</span>

                    <span>
                      ₹{order?.grandTotal || 0}
                    </span>
                  </div>
                </InfoCard>
              </div>

              {/* ITEMS */}
              <div className="px-5 pb-5">
                <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                  <Package
                    size={18}
                    className="text-orange-500"
                  />

                  Ordered Items
                </h3>

                <div className="space-y-3">
                  {order?.items?.map(
                    (item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-3"
                      >
                        <img
                          src={item?.thumbnail}
                          alt={
                            item?.productName
                          }
                          className="h-16 w-16 rounded-2xl object-cover bg-white"
                        />

                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900">
                            {
                              item?.productName
                            }
                          </h4>

                          <p className="text-sm text-slate-500 mt-1">
                            {item?.weight}
                            {item?.unit} ×{" "}
                            {item?.quantity}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="font-bold text-slate-900">
                            ₹
                            {item?.totalPrice ||
                              0}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* ACTION */}
              <div className="px-5 pb-5 flex flex-wrap gap-3 items-center">
                {order?.orderStatus !== "PACKED" ? (
                  <button
                    onClick={() => handlePackOrder(order._id)}
                    disabled={packingId === order._id}
                    className="px-5 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-all shadow-lg shadow-orange-100 cursor-pointer"
                  >
                    {packingId === order._id ? "Packing..." : "Pack Order"}
                  </button>
                ) : (
                  <>
                    <div className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold">
                      ✅ Order Packed
                    </div>
                    {!order?.assignedDriver && (
                      <button
                        onClick={() => navigate(`/dashboard/orders/add-driver/${storeId}/${order._id}`)}
                        className="px-5 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-all shadow-lg shadow-orange-100 flex items-center gap-2 cursor-pointer"
                      >
                        <Truck size={16} />
                        Assign Driver
                      </button>
                    )}
                  </>
                )}
              </div>

              {/* DRIVER */}
              {order?.assignedDriver && (
                <div className="px-5 pb-5">
                  <div className="rounded-2xl bg-orange-50 border border-orange-100 p-4 flex gap-3">
                    <Truck
                      size={20}
                      className="text-orange-500 mt-1"
                    />

                    <div>
                      <h3 className="font-bold text-orange-600">
                        Driver Assigned
                      </h3>

                      <p className="text-sm text-slate-600 mt-1">
                        {
                          order?.assignedDriver
                            ?.firstName
                        }{" "}
                        {
                          order?.assignedDriver
                            ?.lastName
                        }
                      </p>

                      <p className="text-sm text-slate-500">
                        {
                          order?.assignedDriver
                            ?.number
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// =========================================
// INFO ITEM
// =========================================
const InfoItem = ({ icon, text }) => {
  return (
    <div className="flex items-start gap-2">
      <div className="mt-1">{icon}</div>

      <p className="text-sm text-slate-600">
        {text || "N/A"}
      </p>
    </div>
  );
};

// =========================================
// SUMMARY CARD
// =========================================
const SummaryCard = ({
  title,
  value,
  icon,
}) => {
  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-slate-500">
            {title}
          </p>

          <h3 className="text-3xl font-bold text-slate-900 mt-2">
            {value}
          </h3>
        </div>

        <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center">
          {icon}
        </div>
      </div>
    </div>
  );
};

// =========================================
// INFO CARD
// =========================================
const InfoCard = ({
  title,
  icon,
  children,
}) => {
  return (
    <div className="bg-slate-50 rounded-3xl border border-slate-200 p-4">
      <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-3">
        {icon}
        {title}
      </h3>

      {children}
    </div>
  );
};

// =========================================
// PRICE ROW
// =========================================
const PriceRow = ({
  label,
  value,
  green,
}) => {
  return (
    <div className="flex justify-between text-sm mb-2">
      <span className="text-slate-500">
        {label}
      </span>

      <span
        className={
          green
            ? "text-emerald-600 font-semibold"
            : "text-slate-700"
        }
      >
        {value}
      </span>
    </div>
  );
};

// =========================================
// STATUS BADGE
// =========================================
const StatusBadge = ({
  text,
  type,
}) => {
  const styles = {
    order:
      "bg-orange-50 text-orange-600 border border-orange-100",

    payment:
      "bg-red-50 text-red-600 border border-red-100",

    method:
      "bg-sky-50 text-sky-600 border border-sky-100",
  };

  return (
    <span
      className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
        styles[type] ||
        "bg-slate-100 text-slate-700"
      }`}
    >
      {text || "N/A"}
    </span>
  );
};

export default Orders;