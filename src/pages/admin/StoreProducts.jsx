import React, { useEffect, useMemo, useState } from "react";
import {
  getStoreOrdersApi,
  packStoreOrderApi,
} from "../../api/admin.api";

import { useParams } from "react-router-dom";

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
} from "lucide-react";

const StoreProducts = () => {
  // =========================================
  // useParams route se dynamic id nikalta hai
  // route: /stores/orders/:storeId
  // =========================================
  const { storeId } = useParams();

  // =========================================
  // orders -> API ka data store karega
  // loading -> loader handle karega
  // search -> search input ki value
  // =========================================
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [packingId, setPackingId] = useState(null);
  const [search, setSearch] = useState("");

  // =========================================
  // API CALL
  // store ke saare orders la raha
  // =========================================
  const fetchStoreOrders = async () => {
    try {
      setLoading(true);

      const res = await getStoreOrdersApi(storeId);

      console.log("STORE ORDERS RESPONSE 👉", res);

      // response safe handling
      const finalData = Array.isArray(res?.data) ? res.data : [];

      setOrders(finalData);
    } catch (error) {
      console.log("Store Orders Error 👉", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // COMPONENT LOAD PE API CALL
  // =========================================
  useEffect(() => {
    if (storeId) {
      fetchStoreOrders();
    }
  }, [storeId]);

  // =========================================
  // ORDER PACK FUNCTION
  // PATCH API CALL
  // =========================================
  const handlePackOrder = async (orderId) => {
    try {
      setPackingId(orderId);

      const res = await packStoreOrderApi(storeId, orderId);

      console.log("PACK ORDER RESPONSE 👉", res);

      // =========================================
      // LOCAL STATE UPDATE
      // pura API dubara call nahi karna
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
    } catch (error) {
      console.log("PACK ORDER ERROR 👉", error);
    } finally {
      setPackingId(null);
    }
  };

  // =========================================
  // DATE FORMATTER
  // =========================================
  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================================
  // SEARCH FILTER
  // useMemo performance optimize karta hai
  // unnecessary filter avoid karta hai
  // =========================================
  const filteredOrders = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return orders;

    return orders.filter((order) => {
      const customerName = `${order?.user?.firstName || ""} ${
        order?.user?.lastName || ""
      }`.toLowerCase();

      const orderNumber = order?.orderNumber?.toLowerCase() || "";
      const email = order?.user?.email?.toLowerCase() || "";
      const status = order?.orderStatus?.toLowerCase() || "";

      return (
        customerName.includes(value) ||
        orderNumber.includes(value) ||
        email.includes(value) ||
        status.includes(value)
      );
    });
  }, [orders, search]);

  // =========================================
  // TOTAL REVENUE
  // reduce pura array ka sum nikalta hai
  // =========================================
  const totalRevenue = orders.reduce(
    (acc, order) => acc + Number(order?.grandTotal || 0),
    0
  );

  const totalItems = orders.reduce(
    (acc, order) => acc + Number(order?.totalItems || 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#f4f8f1] p-4 md:p-6">
      {/* =========================================
          TOP HEADER
      ========================================= */}
      <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#14532d] flex items-center gap-2">
            <ShoppingBag className="text-[#16a34a]" size={26} />
            Store Orders
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            BK Grocery store order management panel.
          </p>
        </div>

        {/* =========================================
            SEARCH INPUT
        ========================================= */}
        <div className="relative w-full lg:w-[330px]">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-green-100 outline-none focus:border-[#16a34a] text-sm"
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
          icon={<ShoppingBag size={22} className="text-[#16a34a]" />}
        />

        <SummaryCard
          title="Total Items"
          value={totalItems}
          icon={<Package size={22} className="text-orange-500" />}
        />

        <SummaryCard
          title="Revenue"
          value={`₹${totalRevenue}`}
          icon={<IndianRupee size={22} className="text-green-600" />}
        />
      </div>

      {/* =========================================
          CONDITIONAL RENDERING
      ========================================= */}
      {loading ? (
        <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
          Loading orders...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center shadow-sm text-slate-500">
          No orders found
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {filteredOrders.map((order) => (
            <div
              key={order?._id}
              className="bg-white rounded-3xl shadow-sm border border-green-100 overflow-hidden"
            >
              {/* =========================================
                  TOP SECTION
              ========================================= */}
              <div className="p-5 border-b border-green-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="font-bold text-slate-900">
                    #{order?.orderNumber || "N/A"}
                  </h2>

                  <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                    <Calendar size={14} />
                    {formatDate(order?.createdAt)}
                  </p>
                </div>

                {/* =========================================
                    STATUS BADGES
                ========================================= */}
                <div className="flex flex-wrap gap-2">
                  <StatusBadge text={order?.orderStatus} type="order" />

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

              {/* =========================================
                  CUSTOMER + ADDRESS + PAYMENT
              ========================================= */}
              <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-5">
                <InfoCard
                  icon={<User size={17} className="text-[#16a34a]" />}
                  title="Customer"
                >
                  <p className="font-semibold text-slate-900">
                    {order?.deliveryAddress?.fullName || "N/A"}
                  </p>

                  <p className="text-sm text-slate-500">
                    {order?.deliveryAddress?.phoneNumber || "N/A"}
                  </p>
                </InfoCard>

                <InfoCard
                  icon={<MapPin size={17} className="text-orange-500" />}
                  title="Delivery Address"
                >
                  <p className="text-sm text-slate-700">
                    {order?.deliveryAddress?.houseNumber || ""},{" "}
                    {order?.deliveryAddress?.apartment || ""}
                  </p>

                  <p className="text-sm text-slate-500 mt-1">
                    {order?.deliveryAddress?.city || ""},{" "}
                    {order?.deliveryAddress?.state || ""}
                  </p>

                  <p className="text-sm text-slate-500">
                    {order?.deliveryAddress?.postalCode || ""}
                  </p>
                </InfoCard>

                <InfoCard
                  icon={<CreditCard size={17} className="text-green-600" />}
                  title="Payment Summary"
                >
                  <PriceRow label="MRP" value={`₹${order?.totalMrp || 0}`} />

                  <PriceRow
                    label="Discount"
                    value={`-₹${order?.totalDiscount || 0}`}
                    green
                  />

                  <div className="flex justify-between font-bold text-slate-900 pt-2 border-t mt-2">
                    <span>Total</span>
                    <span>₹{order?.grandTotal || 0}</span>
                  </div>
                </InfoCard>
              </div>

              {/* =========================================
                  ORDER ITEMS
              ========================================= */}
              <div className="px-5 pb-5">
                <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-3">
                  <Package size={17} className="text-orange-500" />
                  Ordered Items
                </h3>

                <div className="space-y-3">
                  {order?.items?.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 bg-[#f9fafb] rounded-2xl p-3 border border-green-100"
                    >
                      <img
                        src={item?.thumbnail}
                        alt={item?.productName}
                        className="w-16 h-16 rounded-xl object-cover bg-white"
                      />

                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900">
                          {item?.productName || "N/A"}
                        </h4>

                        <p className="text-sm text-slate-500">
                          {item?.weight}
                          {item?.unit} × {item?.quantity}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-slate-900">
                          ₹{item?.totalPrice || 0}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* =========================================
                  PACK ORDER BUTTON
              ========================================= */}
              <div className="px-5 pb-5">
                {order?.orderStatus !== "PACKED" ? (
                  <button
                    onClick={() => handlePackOrder(order._id)}
                    disabled={packingId === order._id}
                    className="bg-[#16a34a] hover:bg-[#15803d] text-white px-5 py-3 rounded-2xl font-semibold transition"
                  >
                    {packingId === order._id
                      ? "Packing..."
                      : "Pack Order"}
                  </button>
                ) : (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-2xl font-semibold inline-flex items-center gap-2">
                    ✅ Order Packed
                  </div>
                )}
              </div>

              {/* =========================================
                  DRIVER INFO
              ========================================= */}
              {order?.assignedDriver && (
                <div className="px-5 pb-5">
                  <div className="bg-green-50 border border-green-100 rounded-2xl p-4 flex items-start gap-3">
                    <Truck size={20} className="text-green-700 mt-1" />

                    <div>
                      <h3 className="font-bold text-green-700 mb-1">
                        Driver Assigned
                      </h3>

                      <p className="text-sm text-slate-700">
                        Driver ID: {order?.assignedDriver}
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

const SummaryCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white rounded-3xl p-5 border border-green-100 shadow-sm">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-slate-500">{title}</p>

          <h3 className="text-2xl font-bold text-slate-900 mt-1">
            {value}
          </h3>
        </div>

        <div className="h-12 w-12 rounded-2xl bg-[#f0fdf4] flex items-center justify-center">
          {icon}
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ title, icon, children }) => {
  return (
    <div className="bg-[#f9fafb] rounded-2xl p-4 border border-green-100">
      <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-3">
        {icon}
        {title}
      </h3>

      {children}
    </div>
  );
};

const PriceRow = ({ label, value, green }) => {
  return (
    <div className="flex justify-between text-sm mb-1">
      <span className="text-slate-500">{label}</span>

      <span className={green ? "text-green-600 font-semibold" : ""}>
        {value}
      </span>
    </div>
  );
};

const StatusBadge = ({ text, type }) => {
  const styles = {
    order: "bg-green-50 text-green-700",
    payment: "bg-orange-50 text-orange-700",
    method: "bg-lime-50 text-lime-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        styles[type] || "bg-slate-100 text-slate-700"
      }`}
    >
      {text || "N/A"}
    </span>
  );
};

export default StoreProducts;